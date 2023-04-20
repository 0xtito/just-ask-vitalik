import * as cheerio from "cheerio";
import axios from "axios";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { Document } from "langchain/document";
import { SupabaseVectorStore } from "langchain/vectorstores/supabase";

import { supabase } from "@/utils/clients/supabase-client";
import { EssayProps } from "@/types";

const BASE_URL = `https://vitalik.ca/`;

async function storeEssays(essays: EssayProps[]) {
  const vectorStore = await SupabaseVectorStore.fromExistingIndex(
    new OpenAIEmbeddings(),
    {
      client: supabase,
      tableName: "vitalik_essays",
      queryName: "match_documents",
    }
  );

  const textSplitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1000,
    chunkOverlap: 100,
  });

  const essayTexts = essays.map((essay) => essay.content);
  const essayMetadata = essays.map((essay) => {
    const { title, link, date } = essay;
    return {
      title,
      link,
      date,
    };
  });
  console.log(`creating documents...`);
  const docs = await textSplitter.createDocuments(essayTexts, essayMetadata);
  console.log(`documents created`);

  console.log("adding docs to vector store...");
  await vectorStore.addDocuments(docs);
}

async function getEssays() {
  const rawEssays: EssayProps[] = await getEssayObj();

  const essays: EssayProps[] = [];

  for (let i = 0; i < rawEssays.length; i++) {
    let essay = rawEssays[i];
    const res = await axios.get(essay.link);
    const $ = cheerio.load(res.data);
    const doc = $("div");
    let text = doc.text();
    const removeToggleText = text.replaceAll("Dark Mode Toggle", "");

    const startIndex = removeToggleText.indexOf("See all posts");
    const cleanedText = removeToggleText.slice(startIndex + 13).trim();

    const noTitleText = cleanedText.replace(essay.title, "").trim();

    const finalText = noTitleText.replace(/(\n\s*){3,}/g, "\n\n");

    essay = {
      ...essay,
      content: finalText.trim(),
    };
    essays.push(essay);
  }

  await storeEssays(essays);
}

async function getEssayObj() {
  const res = await axios.get(BASE_URL);
  const $ = cheerio.load(res.data);
  let listItems = $("ul").find("li");

  let essays: EssayProps[] = [];

  listItems.each((i, item) => {
    let titleSection = $(item).find("a");
    let title = titleSection.text();
    let link = titleSection.attr("href");
    if (!link) {
      throw new Error(`No link found for title: ${title}}`);
    }
    //remove ./ in the beginning of the returned link
    link = link.slice(2);
    let date = $(item).find("span").text();

    let essay: EssayProps = {
      title,
      link: `${BASE_URL}${link}`,
      content: "",
      date,
    };
    essays.push(essay);
  });

  return essays;
}

(async () => {
  await getEssays();
  console.log("done");
})();
