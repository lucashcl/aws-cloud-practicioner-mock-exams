export interface ExamOption {
   [key: string]: string;
}

export interface ExamQuestion {
   number: number;
   text: string;
   options: ExamOption;
   correctAnswer: string[];
   explanation?: string;
}

export interface ExamData {
   title: string;
   questions: ExamQuestion[];
}