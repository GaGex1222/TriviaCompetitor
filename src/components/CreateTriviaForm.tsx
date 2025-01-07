"use client";
import { handleErrorToast, handleSuccesToast } from "@/toastFunctions";
import { useSession } from "next-auth/react";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Questions } from "@/interfaces/question";
import { triviaCreationValidation } from "@/utils/dataHelper";
import { TriviaFormErrors } from "./TriviaFormErrors";

export const CreateTriviaForm = () => {
  const defaultTriviaValues: Questions = {
    questionTitle: "",
    options: {
      option1: { text: "", isCorrect: false },
      option2: { text: "", isCorrect: false },
      option3: { text: "", isCorrect: false },
      option4: { text: "", isCorrect: false },
    },
  };
  const [showValidationErrors, setShowValidationErrors] = useState(false);
  const router = useRouter();
  const [canCreateQuestion, setCanCreateQuestion] = useState(true);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const { data: session } = useSession();
  const [creationLoading, setCreationLoading] = useState(false);
  const [questionsData, setQuestionsData] = useState<{
    [key: number]: Questions;
  }>({
    1: defaultTriviaValues,
  });
  const [questionIndex, setQuestionIndex] = useState(1);
  const questionOptions = questionsData[questionIndex]?.options ? Object.keys(questionsData[questionIndex].options): [];

  const handleQuestionOptionChange = (
    event: React.FormEvent<HTMLInputElement>
  ) => {
    const optionKey = event.currentTarget.name as keyof Questions;
    const currentInputValue = event.currentTarget.value;
    setQuestionsData((prevState) => ({
      ...prevState,
      [questionIndex]: {
        ...prevState[questionIndex],
        options: {
          ...prevState[questionIndex].options,
          [optionKey]: {
            ...prevState[questionIndex].options[optionKey],
            text: currentInputValue,
          },
        },
      },
    }));
    console.log(questionsData);
  };

  const handleCloseFormErrors = () => {
    setShowValidationErrors(false);
  };

  useEffect(() => {
    if(!session){
      router.push('/')
      handleErrorToast("You have to be logged in to create trivia!")
    }
  }, [])

  const handleQuestionTitleChange = (
    event: React.FormEvent<HTMLInputElement>
  ) => {
    const InputValue = event.currentTarget.value;
    setQuestionsData((prevState) => ({
      ...prevState,
      [questionIndex]: {
        ...prevState[questionIndex],
        questionTitle: InputValue,
      },
    }));
  };

  const handleNextButton = () => {
    if (questionIndex + 1 <= Object.keys(questionsData).length) {
      setQuestionIndex((prevState) => prevState + 1);
    } else {
      handleErrorToast("That is the last question!");
    }
  };

  const handleCorrectAnswerChange = (keyName: string) => {
    const updatedQuestionData = { ...questionsData };
    if (questionsData[questionIndex]["options"][keyName]["isCorrect"] == true) {
      questionsData[questionIndex]["options"][keyName]["isCorrect"] = false;
    } else {
      questionsData[questionIndex]["options"][keyName]["isCorrect"] = true;
    }
    setQuestionsData(updatedQuestionData);
  };

  const handleOptionDelete = (keyName: string) => {
    const updatedQuestionsData = { ...questionsData };
    delete questionsData[questionIndex]["options"][keyName];
    setQuestionsData(updatedQuestionsData);
    handleSuccesToast("Option successfully deleted!");
  };

  const handleOptionCreation = () => {
    if (questionOptions.length == 6) {
      handleErrorToast("Max is 6 options!");
      return;
    }
    const optionToCreate = `option${questionOptions.length + 1}`;
    const updatedQuestionData = { ...questionsData };
    questionsData[questionIndex]["options"][optionToCreate] = {
      text: "",
      isCorrect: false,
    };
    handleSuccesToast('Option has been added successfully!')
    setQuestionsData(updatedQuestionData);
  };

  const handleQuestionDeletion = () => {
    console.log(questionsData);
    if (questionIndex == 1) {
      handleErrorToast("Can't delete first question!");
      return;
    }
    if (Object.keys(questionsData).length == 1) {
      handleErrorToast("Can't remove more questions!");
    } else {
      const updatedQuestionsData = { ...questionsData };
      delete updatedQuestionsData[questionIndex];
      for (
        let i = questionIndex + 1;
        i <= Object.keys(questionsData).length;
        i++
      ) {
        const newIndex = i - 1;
        updatedQuestionsData[newIndex] = updatedQuestionsData[i];
        delete updatedQuestionsData[i];
      }
      setQuestionIndex((prevState) => prevState - 1);
      setQuestionsData(updatedQuestionsData);
    }
    handleSuccesToast("Successfully deleted question!");
  };

  const handleQuestionCreation = () => {
    if (canCreateQuestion) {
      const questionIndexToCreate = Object.keys(questionsData).length + 1;
      setQuestionsData((prevState) => ({
        ...prevState,
        [questionIndexToCreate]: defaultTriviaValues,
      }));
      handleSuccesToast("Question Created Successfully!");
    } else {
      handleErrorToast("Wait before creating another question!");
      return;
    }
    setCanCreateQuestion(false);
    setTimeout(() => {
      setCanCreateQuestion(true);
    }, 3000);
  };

  const handlePreviosQuestion = () => {
    if (questionIndex - 1 == 0) {
      handleErrorToast("That is the first question!");
      return;
    } else {
      setQuestionIndex((prevState) => prevState - 1);
    }
  };

  const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    setCreationLoading(true)
    event.preventDefault();
    const formData = new FormData(event.target as HTMLFormElement);
    const questionsDataJSON = JSON.stringify(questionsData);
    formData.append("questionsData", questionsDataJSON);
    formData.append("userId", session?.userId as string);
    const fileUploaded: FormDataEntryValue | null = formData.get("fileInput");
    console.log("Question data", questionsData);
    if (fileUploaded) {
      if (fileUploaded instanceof File) {
        const fileSize = fileUploaded.size;
        const fileKbSize = fileSize / 1024;
        const fileType: string = fileUploaded.type;
        const triviaFormValid = triviaCreationValidation(
          questionsData,
          fileKbSize,
          fileType
        );
        if (triviaFormValid === true) {
          try {
            const response = await fetch("/api/createTrivia", {
              method: "POST",
              body: formData,
            });
            const result = await response.json();
            if (result.success) {
              handleSuccesToast("Trivia created successfully!");
              router.push(`/triviapreview/${result.insertedTriviaId}`);
            } else {
              handleErrorToast("Couldn't create trivia, try again later!");
            }
          } catch (Exception) {
            console.log("Error occured when tried adding trivia to db", Exception);
            handleErrorToast("Couldn't create trivia, try again later!");
            return;
          }
        } else {
          setShowValidationErrors(true);
          setValidationErrors(triviaFormValid);
          return;
        }
      }
    } else {
      handleErrorToast(
        "Couldn't get file from submission of form, try again later"
      );
      return;
    }
    setCreationLoading(false)
  };

  return (
    <>
      <div className="flex justify-center min-h-screen">
        <div className="w-screen p-8 bg-gray-900 shadow-lg flex flex-col text-gray-200 font-semibold">
          <form onSubmit={handleFormSubmit} className="space-y-4 text-center">
            <label className="text-3xl text-gray-200">Trivia Overview</label>
            <br />
            <div className="mt-4">
              <label htmlFor="titleInput" className="block text-sm font-medium text-gray-300">
                Title
              </label>
              <input
                type="text"
                name="titleInput"
                className="mt-1 p-2 w-full border-2 border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 text-gray-800 rounded-md"
                placeholder="Enter title"
                required
              />
            </div>
            <div className="mt-4">
              <label htmlFor="descriptionInput" className="block text-sm font-medium text-gray-300">
                Description
              </label>
              <input
                type="text"
                name="descriptionInput"
                className="mt-1 p-2 w-full border-2 border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 text-gray-800 rounded-md"
                placeholder="Enter description"
                required
              />
            </div>
            <div className="mt-4">
              <label htmlFor="fileInput" className="block text-sm font-medium text-gray-300">
                Select Image
              </label>
              <input
                type="file"
                id="fileInput"
                name="fileInput"
                className="mt-1 p-2 w-full rounded-md border-gray-600 border-2 transition-all duration-200 bg-gray-800 text-gray-200 hover:bg-gray-700"
                required
              />
            </div>
            <div className="mt-4">
              <label htmlFor="questionInput" className="font-semibold block text-xl mb-2 text-gray-200 text-center">
                Question {`${questionIndex}/${Object.keys(questionsData).length}`}
              </label>
              <input
                type="text"
                id="questionInput"
                name="questionTitle"
                onChange={handleQuestionTitleChange}
                value={questionsData[questionIndex].questionTitle}
                className="mt-1 p-2 w-full border-2 rounded-md border-gray-600 text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600"
                placeholder="Enter question"
                required
              />
            </div>
            <div className="mt-4 grid grid-cols-2 gap-5">
              {questionOptions.map((optionNumber, index) => {
                return (
                  <div className="relative mb-4" key={optionNumber}>
                    <input
                      type="text"
                      name={optionNumber}
                      onChange={handleQuestionOptionChange}
                      value={
                        questionsData[questionIndex]["options"][optionNumber]["text"] || ""
                      }
                      className="p-2 w-full rounded-md pr-10 border-gray-600 border-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600"
                      placeholder={`Enter Option ${index + 1}`}
                    />
                    {index === questionOptions.length - 1 && index !== 1 && (
                      <button
                        type="button"
                        onClick={() => handleOptionDelete(optionNumber)}
                        className="absolute right-2 top-1/2 transform transition-all -translate-y-1/2 text-red-500 hover:text-red-700"
                      >
                        🗑️
                      </button>
                    )}
                    <input
                      type="checkbox"
                      name={optionNumber}
                      checked={
                        questionsData[questionIndex]["options"][optionNumber]["isCorrect"] || false
                      }
                      className="absolute right-9 top-1/2 transform transition-all -translate-y-1/2 accent-green-500"
                      onChange={() => handleCorrectAnswerChange(optionNumber)}
                    />
                  </div>
                );
              })}
              <div className="col-span-2 flex justify-center">
                <button
                  type="button"
                  onClick={handleOptionCreation}
                  disabled={creationLoading}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50"
                >
                  Add Option
                </button>
              </div>
            </div>
            <div className="flex flex-col items-center mt-6">
              <div className="flex space-x-4 mb-4">
                <button
                  type="button"
                  disabled={creationLoading}
                  onClick={handleQuestionCreation}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50"
                >
                  Create Question
                </button>
                <button
                  type="button"
                  disabled={creationLoading}
                  onClick={handleQuestionDeletion}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50"
                >
                  Delete Question
                </button>
              </div>
              <div className="flex justify-between w-full max-w-lg space-x-20 mt-5">
                <button
                  type="button"
                  disabled={creationLoading}
                  onClick={handlePreviosQuestion}
                  className={`flex-1 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50`}
                >
                  Previous Question
                </button>
                <button disabled={creationLoading} type="submit" className={`flex-1 disabled:opacity-50 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700`}>
                  Upload Trivia
                </button>
                <button
                  type="button"
                  onClick={handleNextButton}
                  disabled={creationLoading}
                  className={`flex-1 px-4 disabled:opacity-50 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700`}
                >
                  Next Question
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
      {showValidationErrors && (
        <TriviaFormErrors
          onClose={handleCloseFormErrors}
          errors={validationErrors}
        />
      )}
    </>
  );
   
};
