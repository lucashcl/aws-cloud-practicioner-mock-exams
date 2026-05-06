import { CheckCircle2, XCircle } from "lucide-react";
import type { ExamQuestion } from "../../../lib/types";

interface QuestionCardProps {
   question: ExamQuestion;
   selectedOptions: string[];
   isAnswered: boolean;
   onAnswer: (option: string) => void;
}

export function QuestionCard({
   question,
   selectedOptions,
   isAnswered,
   onAnswer,
}: QuestionCardProps) {
   return (
      <main className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 mb-6">
         <h2 className="text-lg font-semibold mb-6 leading-relaxed">
            {question.text}
         </h2>

         <div className="space-y-3">
            {Object.entries(question.options).map(([option, text]) => {
               const isCurrentSelected = selectedOptions.includes(option);
               const isRightAnswer = question.correctAnswer.includes(option);

               let variantClasses =
                  "border-slate-200 hover:border-indigo-300 hover:bg-indigo-50";

               if (isAnswered) {
                  if (isRightAnswer) {
                     variantClasses =
                        "border-emerald-500 bg-emerald-50 ring-1 ring-emerald-500";
                  } else if (isCurrentSelected && !isRightAnswer) {
                     variantClasses =
                        "border-rose-500 bg-rose-50 ring-1 ring-rose-500";
                  } else {
                     variantClasses = "border-slate-100 opacity-60";
                  }
               } else if (isCurrentSelected) {
                  variantClasses =
                     "border-indigo-600 bg-indigo-50 ring-1 ring-indigo-600";
               }

               return (
                  <button
                     key={option}
                     onClick={() => onAnswer(option)}
                     disabled={isAnswered}
                     className={`w-full text-left p-4 rounded-xl border-2 transition-all flex items-start gap-3 cursor-pointer ${variantClasses}`}
                  >
                     <span
                        className={`font-bold shrink-0 ${isAnswered && isRightAnswer
                              ? "text-emerald-600"
                              : "text-slate-400"
                           }`}
                     >
                        {option})
                     </span>
                     <span className="grow">{text}</span>
                     {isAnswered && isRightAnswer && (
                        <CheckCircle2
                           className="text-emerald-600 shrink-0"
                           size={20}
                        />
                     )}
                     {isAnswered && isCurrentSelected && !isRightAnswer && (
                        <XCircle className="text-rose-600 shrink-0" size={20} />
                     )}
                  </button>
               );
            })}
         </div>
      </main>
   );
}
