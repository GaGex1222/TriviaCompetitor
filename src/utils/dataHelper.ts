import { Questions } from "../interfaces/question";
import { PlayTriviaQuestions } from "../interfaces/trivia";

export function triviaCreationValidation(questionsData: { [key: string]: Questions }, fileKbSize: number, fileType: string){

    const creationErrors = []
    let isValid = true

    if(fileKbSize > 3000){
        creationErrors.push("File size is bigger (3MB Max)")
        isValid = false;
    }

    if (!fileType.startsWith('image')) {
        creationErrors.push("File is not an image.");
        isValid = false;
    }

    for(const keyName in questionsData){
        const currentQuestionOptions = Object.values(questionsData[keyName].options)
        
        const isCorrectAnswer = currentQuestionOptions.some((optionValue) => {
            return optionValue.isCorrect === true
        })

        const hasEmptyOption = currentQuestionOptions.some((optionValue) => {
            return optionValue.text === ''
        })

        if(!isCorrectAnswer){
            isValid = false;
            creationErrors.push(`Question number ${keyName} has no correct answers.`)
        }

        if(hasEmptyOption){
            isValid = false;
            creationErrors.push(`Question number ${keyName} has empty option`)
        }

        console.log("ss", isCorrectAnswer)
    }


    if(!isValid){
        return creationErrors;
    }

    return true;
    
}


export function calculateTriviaScore(questionsAndOptions: Array<PlayTriviaQuestions>, userAnswers: string[]){
    let score = 0;
    for(let i = 0; i < questionsAndOptions.length; i++){
        Object.keys(questionsAndOptions[i].questionOptions).map((questionText) =>{
            if(questionsAndOptions[i].questionOptions[questionText]){
                if(userAnswers.includes(questionText)){
                    score++;
                }
            }
        })
    }
    return score
}