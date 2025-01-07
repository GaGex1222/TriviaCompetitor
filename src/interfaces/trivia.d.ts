export interface Trivia {
    id: number
    title: string
    description: string
    imageUrl: string
    creatorId?: number
    createdAt: string
    username?: string
    questions?: Array<object>
}

export interface PlayTriviaQuestions {
    id: number,
    imageUrl: string,
    questionOptions: { 
        [optionText: string]: boolean 
    }
    title: string
}



