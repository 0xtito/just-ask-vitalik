import { AgentActionOutputParser } from "langchain/agents";
import {
  BasePromptTemplate,
  SerializedBasePromptTemplate,
  renderTemplate,
  BaseChatPromptTemplate,
} from "langchain/prompts";
import {
  InputValues,
  PartialValues,
  AgentStep,
  AgentAction,
  AgentFinish,
  BaseChatMessage,
  HumanChatMessage,
  SystemChatMessage,
} from "langchain/schema";
import { Tool } from "langchain/tools";

import {
  vitalikAgentPrompt,
  SUFFIX,
  formatInstructions,
  CUSTOM_FORMAT_INSTRUCTIONS,
} from "../constants";

export class VitalikPromptTemplate extends BaseChatPromptTemplate {
  tools: Tool[];
  private prefix: string;

  constructor(args: { tools: Tool[]; inputVariables: string[] }) {
    super({ inputVariables: args.inputVariables });
    this.tools = args.tools;
    this.prefix = vitalikAgentPrompt;
  }

  _getPromptType(): string {
    throw new Error("Not implemented");
  }

  // From LangChain
  async formatMessages(values: InputValues): Promise<BaseChatMessage[]> {
    /** Construct the final template */
    // console.log("values: ", values);
    const toolStrings = this.tools
      .map((tool) => `${tool.name}: ${tool.description}`)
      .join("\n");
    const toolNames = this.tools.map((tool) => tool.name).join("\n");
    const instructions = formatInstructions(toolNames);

    // let systemChatMessage = new SystemChatMessage(this.prefix);
    // systemChatMessage.name = "Admin";

    const template = [
      new SystemChatMessage(this.prefix).text,
      toolStrings,
      instructions,
      SUFFIX,
    ].join("\n\n");
    /** Construct the agent_scratchpad */
    const intermediateSteps = values.intermediate_steps as AgentStep[];
    console.log("inside formatMessage - intermediate steps", intermediateSteps);
    const agentScratchpad = intermediateSteps.reduce(
      (thoughts, { action, observation }) =>
        thoughts +
        [action.log, `\nObservation: ${observation}`, "Thought:"].join("\n"),
      ""
    );
    const newInput = { agent_scratchpad: agentScratchpad, ...values };
    /** Format the template. */
    const formatted = renderTemplate(template, "f-string", newInput);

    let systemChatMessage = new SystemChatMessage(formatted);
    systemChatMessage.name = "Admin";
    return [systemChatMessage];
    // return [new HumanChatMessage(formatted)];
  }

  partial(_values: PartialValues): Promise<BasePromptTemplate> {
    throw new Error("Not implemented");
  }

  serialize(): SerializedBasePromptTemplate {
    throw new Error("Not implemented");
  }
}

export class VitalikOutputParser extends AgentActionOutputParser {
  private tools: Tool[];
  constructor(tools: Tool[]) {
    super();
    this.tools = tools;
  }

  async parse(text: string): Promise<AgentAction | AgentFinish> {
    if (text.includes("Final Answer:")) {
      const parts = text.split("Final Answer:");
      const input = parts[parts.length - 1].trim();
      console.log("during Final Answer parse - final answer: ", input);
      const finalAnswers = { output: input };
      return { log: text, returnValues: finalAnswers };
    }
    console.log("during parse - text: ", text);

    const match = /Action: (.*)\nAction Input: (.*)/s.exec(text);
    if (!match) {
      throw new Error(`Could not parse LLM output: ${text}`);
    }

    return {
      tool: match[1].trim(),
      toolInput: match[2].trim().replace(/^"+|"+$/g, ""),
      log: text,
    };
  }

  getFormatInstructions(): string {
    const toolNames = this.tools.map((tool) => tool.name).join("\n");
    const instructions = formatInstructions(toolNames);
    return CUSTOM_FORMAT_INSTRUCTIONS;
    // return instructions;
  }
}
