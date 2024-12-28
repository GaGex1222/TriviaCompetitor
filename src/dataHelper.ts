import { Questions } from "./interfaces/question";
import { handleErrorToast } from "./toastFunctions";

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

    for(let keyName in questionsData){
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