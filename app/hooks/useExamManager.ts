import { useEffect } from "react";
import type { ExamData } from "../../lib/types";
import { useLocalStorageState } from "./useLocalStorageState";

interface ExamProgress {
   currentIndex: number;
   answersByIndex: Record<number, string[]>;
}

function isExactAnswer(selected: string[], correct: string[]) {
   if (selected.length !== correct.length) return false;

   const correctSet = new Set(correct);
   for (const option of selected) {
      if (!correctSet.has(option)) return false;
   }

   return true;
}

export function useExamManager(exam: ExamData) {
   const [progressState, setProgressState, clearProgressState] =
      useLocalStorageState<ExamProgress>(exam.title, () => ({
         currentIndex: 0,
         answersByIndex: {},
      }));
   const currentIndex = progressState.currentIndex;
   const answersByIndex = progressState.answersByIndex;

   const currentQuestion = exam.questions[currentIndex];
   const selectedOptions = answersByIndex[currentIndex] ?? [];
   const isAnswered =
      selectedOptions.length === currentQuestion.correctAnswer.length;
   const isCorrect = isAnswered
      ? isExactAnswer(selectedOptions, currentQuestion.correctAnswer)
      : false;
   const score = exam.questions.reduce((total, question, index) => {
      const answers = answersByIndex[index];
      if (!answers || answers.length !== question.correctAnswer.length) {
         return total;
      }

      return isExactAnswer(answers, question.correctAnswer) ? total + 1 : total;
   }, 0);

   const handleSelectOption = (option: string) => {
      if (isAnswered) return;

      setProgressState((prev) => {
         const current = prev.answersByIndex[currentIndex] ?? [];
         const next = current.includes(option)
            ? current.filter((item) => item !== option)
            : [...current, option];

         return {
            ...prev,
            answersByIndex: {
               ...prev.answersByIndex,
               [currentIndex]: next,
            },
         };
      });
   };

   const handleNextQuestion = () => {
      if (currentIndex < exam.questions.length - 1) {
         setProgressState((prev) => ({
            ...prev,
            currentIndex: prev.currentIndex + 1,
         }));
      }
   };

   const progress = ((currentIndex + 1) / exam.questions.length) * 100;
   const isLastQuestion = currentIndex === exam.questions.length - 1;

   useEffect(() => {
      if (!isLastQuestion || !isAnswered) return;
      clearProgressState();
   }, [clearProgressState, isAnswered, isLastQuestion]);

   return {
      currentQuestion,
      currentIndex,
      totalQuestions: exam.questions.length,
      selectedOptions,
      isAnswered,
      isCorrect,
      progress,
      score,
      handleSelectOption,
      handleNextQuestion,
   };
}
