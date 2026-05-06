import { CheckCircle2, ChevronRight, Info, XCircle } from "lucide-react";

interface FeedbackPanelProps {
   isCorrect: boolean;
   explanation?: string;
   isLastQuestion: boolean;
   onNext: () => void;
}

export function FeedbackPanel({
   isCorrect,
   explanation,
   isLastQuestion,
   onNext,
}: FeedbackPanelProps) {
   return (
      <div className="animate-in fade-in slide-in-from-top-4 duration-300">
         <div
            className={`p-5 rounded-2xl mb-6 border ${isCorrect
                  ? "bg-emerald-50 border-emerald-200"
                  : "bg-rose-50 border-rose-200"
               }`}
         >
            <div className="flex items-center gap-2 mb-2">
               {isCorrect ? (
                  <span className="text-emerald-700 font-bold flex items-center gap-1">
                     <CheckCircle2 size={18} /> Resposta Correta!
                  </span>
               ) : (
                  <span className="text-rose-700 font-bold flex items-center gap-1">
                     <XCircle size={18} /> Resposta Incorreta
                  </span>
               )}
            </div>

            {explanation && (
               <div className="text-slate-700 text-sm leading-relaxed flex gap-2">
                  <Info size={16} className="shrink-0 mt-0.5 text-slate-400" />
                  <p>{explanation}</p>
               </div>
            )}
         </div>

         <button
            onClick={onNext}
            className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-slate-800 transition-colors shadow-lg shadow-slate-200"
         >
            {isLastQuestion ? "Finalizar Teste" : "Proxima Questao"}
            <ChevronRight size={20} />
         </button>
      </div>
   );
}
