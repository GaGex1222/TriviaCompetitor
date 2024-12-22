import { Question } from "./interfaces/question";
import { handleErrorToast } from "./toastFunctions";

export function triviaCreationValidation(questionsData: { [key: string]: Question }, fileKbSize: number, fileType: string){
    if(fileKbSize > 3000){
        handleErrorToast("File size is bigger (3MB Max)")
        return false
    }
    if(!fileType.startsWith('image')){
        handleErrorToast("File is not an image.")
        return false
    }
    for(let keyName in questionsData){
        const currentQuestion = questionsData[keyName]
        let falseCounter = 0
        
        for(let answer in currentQuestion['isCorrect']){
            const currrentAnswer = currentQuestion['isCorrect'][answer]
            if(!currrentAnswer){
                falseCounter++;
            }

            if(falseCounter == 4){
                handleErrorToast(`Question number ${keyName} has no correct answers.`);
                return false
            }
        }
    }
    return true

}