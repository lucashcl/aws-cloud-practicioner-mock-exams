import { parseExamMarkdownToJSON } from "./parseExam";
import { writeFile, lstat, mkdir } from "node:fs/promises";
import path from "node:path";

const EXAM_RANGE = [1, 23] as const

const getExamURL = (i: number) => `https://raw.githubusercontent.com/kananinirav/AWS-Certified-Cloud-Practitioner-Notes/refs/heads/master/practice-exam/practice-exam-${i}.md`;

const abortController = new AbortController();

const dataDir = path.join(import.meta.dirname, "../data/exams");

async function ensureDataDirExists() {
   try {
      await lstat(dataDir);
   } catch (err) {
      if ((err as NodeJS.ErrnoException).code === "ENOENT") {
         await mkdir(dataDir, { recursive: true });
      }
   }
}

async function scrapeExams({ signal = abortController.signal } = {}) {
   await ensureDataDirExists();
   for (let i = EXAM_RANGE[0]; i <= EXAM_RANGE[1]; i++) {
      if (signal.aborted) {
         console.log("Scraping aborted");
         break;
      }
      console.log(`Scraping exam [${i}/${EXAM_RANGE[1]}]`);
      const url = getExamURL(i);
      const response = await fetch(url);
      const markdown = await response.text();
      const json = parseExamMarkdownToJSON(markdown);
      console.log(`Parsed exam [${i}/${EXAM_RANGE[1]}]`);
      await writeFile(path.join(import.meta.dirname, `../data/exams/exam-${i}.json`), JSON.stringify(json, null, 2));
      console.log(`Saved exam [${i}/${EXAM_RANGE[1]}]`);
   }
}

scrapeExams()

process.on("SIGINT", () => {
   console.log("Received SIGINT, aborting...");
   abortController.abort();
});