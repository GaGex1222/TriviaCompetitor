export interface Question {
    questionTitle: string;
    option1: string;
    option2: string;
    option3: string;
    option4: string;
    isCorrect: {
        [key: string] : boolean
    }
}