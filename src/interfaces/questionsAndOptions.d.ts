export interface QuestionsAndOptions {
    id: number,
    title: string
    imageUrl: string
    questionOptions: QuestionOptions
}

export interface QuestionOptions {
    [key: string]: boolean
}