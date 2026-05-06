interface ExamHeaderProps {
   title: string;
   currentIndex: number;
   totalQuestions: number;
   progress: number;
}

export function ExamHeader({
   title,
   currentIndex,
   totalQuestions,
   progress,
}: ExamHeaderProps) {
   return (
      <header className="mb-8">
         <h1 className="text-2xl font-bold text-slate-800 mb-4">{title}</h1>
         <div className="flex justify-between items-end mb-2 text-sm font-medium text-slate-500">
            <span>
               Questao {currentIndex + 1} de {totalQuestions}
            </span>
            <span>{Math.round(progress)}% completo</span>
         </div>
         <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
            <div
               className="bg-indigo-600 h-full transition-all duration-300 ease-out"
               style={{ width: `${progress}%` }}
            />
         </div>
      </header>
   );
}
