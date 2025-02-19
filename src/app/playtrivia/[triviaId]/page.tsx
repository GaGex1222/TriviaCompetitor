"use client";
import { TriviaResults } from "@/components/TriviaResults";
import { calculateTriviaScore } from "@/utils/dataHelper";
import { PlayTriviaQuestions } from "@/interfaces/trivia";
import { handleErrorToast } from "@/toastFunctions";
import React, { useState } from "react";
import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function PlayTriviaPage({ params }) {
  const {data: session} = useSession();
  const router = useRouter();
  const [triviaId, setTriviaId] = useState();
  const [questions, setQuestions] = useState<Array<PlayTriviaQuestions>>([]);
  const [seconds, setSeconds] = useState(60);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState("");
  const [userAnswers, setUserAnswers] = useState<Array<string>>([]);
  const [gameFinished, setGameFinished] = useState(false);
  const [userScore, setUserScore] = useState(0);

  useEffect(() => {
    if (!gameFinished) {
      if (seconds > 0) {
        const timer = setTimeout(() => setSeconds(seconds - 1), 1000);
        return () => clearTimeout(timer);
      } else {
        handleErrorToast("You didnt answer in time, next question");
        handleQuestionSubmit();
      }
    }
  }, [seconds]);

  useEffect(() => {
    if (!triviaId) {
      return;
    }
    async function fetchQuestionsData() {
      try {
        const response = await fetch("/api/questionsData", {
          method: "POST",
          body: JSON.stringify(triviaId),
        });
        const data = await response.json();
        if (data.success) {
          const questionsData: Array<PlayTriviaQuestions> = data.data;
          setQuestions(questionsData);
        }
      } catch (error) {
        handleErrorToast("Couldn't fetch question data, try again later.");
        console.log(error);
      }
    }

    fetchQuestionsData();
  }, [triviaId]);

  const getImageUrl = () => {
    if (questions.length > 0 && questions[questionIndex]) {
      return questions[questionIndex].imageUrl ?? "defaultImageUrl.png";
    }
    return "defaultImageUrl.png";
  };

  useEffect(() => {
    if(!session){
      handleErrorToast("You have to be logged in to play!")
      router.push('/')
    }
    const fetchTriviaId = async () => {
      const { triviaId } = await params;
      setTriviaId(triviaId);
    };
    fetchTriviaId();
  }, []);

  const handleSelectQuestion = (event: React.MouseEvent) => {
    const target = event.currentTarget;
    const option = target.getAttribute("id");
    if (option === selectedOption) {
      setSelectedOption("");
    } else {
      setSelectedOption(option);
    }
  };

  const handleQuestionSubmit = () => {
    if (!selectedOption) {
      setUserAnswers([...userAnswers, null]);
    } else {
      setUserAnswers([...userAnswers, selectedOption]);
    }
    setSelectedOption("");
    setSeconds(60);
    setQuestionIndex(questionIndex + 1);
    if (questions.length - 1 === questionIndex) {
      setGameFinished(true);
    }
  };

  useEffect(() => {
    const userScore = calculateTriviaScore(questions, userAnswers);
    setUserScore(userScore);
  }, [gameFinished]);

  if (gameFinished) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen overflow-auto mt-10 mb-10">
        <div className="bg-gray-900 p-8 shadow-xl rounded-lg w-full max-w-4xl">
          <TriviaResults
            questionsAndOptions={questions}
            score={userScore}
            userAnswers={userAnswers}
            userId={session.userId}
          />
        </div>
      </div>
    );
  }
  return questions.length > 0 && !gameFinished ? (
    <div className="flex flex-col justify-center items-center">
      <div className="bg-gray-900 p-8 shadow-xl rounded-lg w-full max-w-4xl">
        <div className="flex justify-between items-center mb-4">
          <div className="bg-indigo-600 text-white py-2 px-4 rounded transition-all duration-300">
            Timer: {`${seconds}s`}
          </div>
        </div>

        <div className="text-white text-2xl font-semibold mb-4">
          <p>{questions[questionIndex].title}</p>{" "}
        </div>

        <div className="bg-gray-500 w-full h-96 mb-6">
          <img
            alt="mainImage"
            src={getImageUrl()}
            className="object-cover w-full h-full"
          />
        </div>

        <div className="grid gap-6 grid-cols-1 md:grid-cols-2 mb-6">
          {Object.keys(questions[questionIndex].questionOptions).map(
            (option) => (
              <div
                key={option}
                id={option}
                onClick={(event) => handleSelectQuestion(event)}
                className={`${
                  selectedOption === option ? "border-indigo-700" : ""
                } bg-gray-800 text-white p-4 rounded-lg shadow-lg hover:cursor-pointer border-2 transition-all duration-300`}
              >
                <p>{option}</p>
              </div>
            )
          )}
        </div>

        <button
          onClick={() => handleQuestionSubmit()}
          disabled={selectedOption === ""}
          className={` text-white py-2 px-4 rounded transition-all duration-300 ${
            selectedOption == ""
              ? "bg-gray-400"
              : "bg-indigo-600 hover:bg-indigo-700"
          }`}
        >
          Submit
        </button>
      </div>
    </div>
  ) : (
    ""
  );
}
