import { PlayTriviaQuestions, QuestionsAndOptions } from "./question";
import { Trivia } from "./trivia";

export interface TriviaFormErrorsProps {
    errors: string[];
    onClose: () => void;
}

export interface TrviaiResultsProps {
    userAnswers: string[],
    questionsAndOptions: Array<PlayTriviaQuestions>,
    score: number
}

export interface TriviaCardProps {
    trivia: Trivia
}
  