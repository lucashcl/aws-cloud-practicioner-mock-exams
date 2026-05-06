import { readFile } from "node:fs/promises";
import type { Route } from "./+types/exam";
import { resolve } from "node:path";
import type { ExamData } from "../../lib/types";
import { useExamManager } from "../hooks/useExamManager";
import { ExamHeader } from "../components/exam/ExamHeader";
import { FeedbackPanel } from "../components/exam/FeedbackPanel";
import { QuestionCard } from "../components/exam/QuestionCard";

export function meta({ params: { id } }: Route.MetaArgs) {
   return [
      { title: `Exam ${id}` },
      // { name: "description", content: "Welcome to React Router!" },
   ];
}

export async function loader({ params: { id } }: Route.LoaderArgs) {
   let exam = await readFile(resolve(import.meta.dirname, `../../data/exams/exam-${id}.json`), "utf-8");
   return JSON.parse(exam) as ExamData;
}

export default function ExamPage({ loaderData: exam }: { loaderData: ExamData }) {
   const {
      currentQuestion,
      currentIndex,
      totalQuestions,
      selectedOptions,
      isAnswered,
      isCorrect,
      progress,
      handleSelectOption,
      handleNextQuestion,
   } = useExamManager(exam);

   return (
      <div className="min-h-screen bg-slate-50 py-8 px-4 font-sans text-slate-900">
         <div className="max-w-2xl mx-auto">
            {/* Header & Progresso */}
            <ExamHeader
               title={exam.title}
               currentIndex={currentIndex}
               totalQuestions={totalQuestions}
               progress={progress}
            />

            {/* Card da Questão */}
            <QuestionCard
               question={currentQuestion}
               selectedOptions={selectedOptions}
               isAnswered={isAnswered}
               onAnswer={handleSelectOption}
            />

            {/* Feedback Imediato e Explicação */}
            {isAnswered && (
               <FeedbackPanel
                  isCorrect={isCorrect}
                  explanation={currentQuestion.explanation}
                  isLastQuestion={currentIndex === totalQuestions - 1}
                  onNext={handleNextQuestion}
               />
            )}
         </div>
      </div>
   );
}