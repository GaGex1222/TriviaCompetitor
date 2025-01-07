import { PlayTriviaQuestions } from "./question";
import { Trivia } from "./trivia";

export interface TriviaFormErrorsProps {
    errors: string[];
    onClose: () => void;
}

export interface TrviaiResultsProps {
    userAnswers: string[],
    userId: string,
    questionsAndOptions: Array<PlayTriviaQuestions>,
    score: number
}

export interface TriviaCardProps {
    trivia: Trivia
}

export interface UserSpecificTriviasProps {
    triviaData: Trivia[],
    page: number,
}
  