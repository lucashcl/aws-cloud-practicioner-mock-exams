import type { ExamData, ExamQuestion } from "../lib/types";

/**
 * Converte o texto markdown de um exame prático em um objeto JSON.
 * Suporta o formato com front-matter, tags <details> e múltiplas respostas.
 */
export function parseExamMarkdownToJSON(markdown: string): ExamData {
   const lines = markdown.split('\n');
   const examData: ExamData = { title: '', questions: [] };

   let currentQuestion: Partial<ExamQuestion> | null = null;
   let currentExplanation: string[] = [];
   let inExplanation = false;
   let inFrontMatter = false;

   for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();

      // 1. Trata Front Matter (--- layout: exam ---)
      if (line === '---') {
         inFrontMatter = !inFrontMatter;
         continue;
      }
      if (inFrontMatter) continue;

      // Pula linhas vazias que não sejam parte da explicação
      if (!line && !inExplanation) continue;

      // 2. Extrai o título (ex: "# Practice Exam 1")
      if (line.startsWith('# ')) {
         examData.title = line.substring(2).trim();
         continue;
      }

      // 3. Detecta o início de uma nova questão (ex: "1. AWS allows...")
      const questionMatch = line.match(/^(\d+)\.\s+(.*)/);
      if (questionMatch) {
         // Salva a questão anterior antes de iniciar a nova
         if (currentQuestion) {
            if (currentExplanation.length > 0) {
               currentQuestion.explanation = currentExplanation.join('\n').trim();
            }
            examData.questions.push(currentQuestion as ExamQuestion);
         }

         currentQuestion = {
            number: parseInt(questionMatch[1], 10),
            text: questionMatch[2].trim(),
            options: {},
            correctAnswer: []
         };

         currentExplanation = [];
         inExplanation = false;
         continue;
      }

      if (!currentQuestion) continue;

      // 4. Extrai as opções (ex: "- A. AWS CLI.")
      const optionMatch = line.match(/^-\s+([A-Z])\.\s+(.*)/);
      if (optionMatch && !inExplanation) {
         currentQuestion.options![optionMatch[1]] = optionMatch[2].trim();
         continue;
      }

      // 5. Detecta o início de um bloco de resposta/explicação (<details>)
      if (line.startsWith('<details')) {
         inExplanation = true;
         continue;
      }

      // 6. Detecta o fim do bloco
      if (line === '</details>') {
         inExplanation = false;
         continue;
      }

      // 7. Processa o conteúdo dentro de <details> ou após a questão
      if (inExplanation || (currentQuestion && !line.startsWith('-'))) {
         // Tenta extrair a resposta correta (ex: "Correct answer: D" ou "Correct answer: B, E")
         const answerMatch = line.match(/Correct\s+answer:\s*([A-Z,\s]+)/i);

         if (answerMatch) {
            currentQuestion.correctAnswer = answerMatch[1].trim().replace(/\s/g, '').replace(/,\s*/g, '').split(''); // Remove espaços para casos de múltiplas respostas
         } else {
            // Se não for a linha da resposta nem a tag summary, adiciona à explicação
            const isSummary = line.startsWith('<summary') || line.startsWith('</summary');
            if (!isSummary && line !== '') {
               // Remove possíveis tags HTML residuais da linha de explicação
               const cleanLine = line.replace(/<\/?[^>]+(>|$)/g, "").trim();
               if (cleanLine) currentExplanation.push(cleanLine);
            }
         }
         continue;
      }
   }

   // Garante que a última questão seja salva
   if (currentQuestion) {
      if (currentExplanation.length > 0) {
         currentQuestion.explanation = currentExplanation.join('\n').trim();
      }
      examData.questions.push(currentQuestion as ExamQuestion);
   }

   return examData;
}