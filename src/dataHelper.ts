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
        const currentQuestion = questionsData[keyName]
        let falseCounter = 0
        
        for(let optionValue of Object.values(currentQuestion.options)){
            if(!optionValue.isCorrect){
                falseCounter++;
            }

            if(!optionValue.text){
                creationErrors.push(`Question number ${keyName} has empty option`)
                isValid = false;
            }

            console.log(creationErrors)
            if(falseCounter == 4){
                creationErrors.push(`Question number ${keyName} has no correct answers.`)
                isValid = false;
            }
        }

    }

    if(!isValid){
        return creationErrors;
    }

    return true;
    
}