export interface Questions {
    questionTitle: string
    options: QuestionOptions
}

export interface QuestionOptions {
    [optionText: string]: {
        text: string,
        isCorrect: boolean
    }
}

export interface QuestionsAndOptions {
    id: number,
    title: string
    imageUrl: string
    questionOptions: QuestionOptions
}

export interface PlayTriviaQuestions {
    id: number,
    imageUrl: string,
    questionOptions: { 
        [optionText: string]: boolean 
    }
    title: string
}
