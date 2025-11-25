import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Progress } from "./ui/progress";
import { Badge } from "./ui/badge";
import {
  ArrowLeft,
  CheckCircle,
  XCircle,
  Trophy,
  Star,
} from "lucide-react";

interface SubjectQuizProps {
  subject: string;
  language: string;
  onBack: () => void;
}

const translations = {
  en: {
    mathematics: "Mathematics Quiz",
    science: "Science Quiz",
    technology: "Technology Quiz",
    engineering: "Engineering Quiz",
    question: "Question",
    of: "of",
    nextQuestion: "Next Question",
    submitAnswer: "Submit Answer",
    tryAgain: "Try Again",
    backToDashboard: "Back to Dashboard",
    correct: "Correct!",
    incorrect: "Incorrect",
    quizComplete: "Quiz Complete!",
    yourScore: "Your Score",
    pointsEarned: "Points Earned",
    newLevel: "New Level Unlocked!",
    wellDone: "Well Done!",
  },
  hi: {
    mathematics: "गणित क्विज",
    science: "विज्ञान क्विज",
    technology: "प्रौद्योगिकी क्विज",
    engineering: "इंजीनियरिंग क्विज",
    question: "प्रश्न",
    of: "में से",
    nextQuestion: "अगला प्रश्न",
    submitAnswer: "उत्तर जमा करें",
    tryAgain: "फिर कोशिश करें",
    backToDashboard: "डैशबोर्ड पर वापस",
    correct: "सही!",
    incorrect: "गलत",
    quizComplete: "क्विज पूर्ण!",
    yourScore: "आपका स्कोर",
    pointsEarned: "अर्जित अंक",
    newLevel: "नया स्तर खुला!",
    wellDone: "अच्छा किया!",
  },
};

// Sample quiz data for different subjects
const quizData = {
  math: {
    en: [
      {
        question: "What is 15 + 27?",
        options: ["42", "41", "43", "40"],
        correct: 0,
        explanation: "15 + 27 = 42",
      },
      {
        question:
          "If a rectangle has length 8 and width 5, what is its area?",
        options: ["40", "35", "45", "30"],
        correct: 0,
        explanation: "Area = length × width = 8 × 5 = 40",
      },
      {
        question: "What is 144 ÷ 12?",
        options: ["11", "12", "13", "14"],
        correct: 1,
        explanation: "144 ÷ 12 = 12",
      },
    ],
    hi: [
      {
        question: "15 + 27 क्या है?",
        options: ["42", "41", "43", "40"],
        correct: 0,
        explanation: "15 + 27 = 42",
      },
      {
        question:
          "यदि एक आयत की लंबाई 8 और चौड़ाई 5 है, तो इसका क्षेत्रफल क्या है?",
        options: ["40", "35", "45", "30"],
        correct: 0,
        explanation: "क्षेत्रफल = लंबाई × चौड़ाई = 8 × 5 = 40",
      },
      {
        question: "144 ÷ 12 क्या है?",
        options: ["11", "12", "13", "14"],
        correct: 1,
        explanation: "144 ÷ 12 = 12",
      },
    ],
  },
  science: {
    en: [
      {
        question: "What do plants need to make their own food?",
        options: [
          "Sunlight and water",
          "Only water",
          "Only air",
          "Only soil",
        ],
        correct: 0,
        explanation:
          "Plants need sunlight, water, and carbon dioxide for photosynthesis",
      },
      {
        question: "How many bones are in the human body?",
        options: ["196", "206", "216", "186"],
        correct: 1,
        explanation: "An adult human has 206 bones",
      },
      {
        question: "What is the center of our solar system?",
        options: ["Earth", "Moon", "Sun", "Mars"],
        correct: 2,
        explanation:
          "The Sun is at the center of our solar system",
      },
    ],
    hi: [
      {
        question: "पौधों को अपना भोजन बनाने के लिए क्या चाहिए?",
        options: [
          "सूर्य का प्रकाश और पानी",
          "केवल पानी",
          "केवल हवा",
          "केवल मिट्टी",
        ],
        correct: 0,
        explanation:
          "पौधों को प्रकाश संश्लेषण के लिए सूर्य का प्रकाश, पानी और कार्बन डाइऑक्साइड की आवश्यकता होती है",
      },
      {
        question: "मानव शरीर में कितनी हड्डियां होती हैं?",
        options: ["196", "206", "216", "186"],
        correct: 1,
        explanation: "एक वयस्क मानव में 206 हड्डियां होती हैं",
      },
      {
        question: "हमारे सौर मंडल का केंद्र क्या है?",
        options: ["पृथ्वी", "चाँद", "सूर्य", "मंगल"],
        correct: 2,
        explanation: "सूर्य हमारे सौर मंडल के केंद्र में है",
      },
    ],
  },
  technology: {
    en: [
      {
        question: "What does CPU stand for?",
        options: [
          "Central Processing Unit",
          "Computer Personal Unit",
          "Central Personal Unit",
          "Computer Processing Unit",
        ],
        correct: 0,
        explanation:
          "CPU stands for Central Processing Unit - the brain of the computer",
      },
      {
        question: "What is used to connect to the internet?",
        options: [
          "Mouse",
          "Keyboard",
          "Wi-Fi or Ethernet",
          "Monitor",
        ],
        correct: 2,
        explanation:
          "Wi-Fi or Ethernet cables are used to connect devices to the internet",
      },
    ],
    hi: [
      {
        question: "CPU का मतलब क्या है?",
        options: [
          "सेंट्रल प्रोसेसिंग यूनिट",
          "कंप्यूटर पर्सनल यूनिट",
          "सेंट्रल पर्सनल यूनिट",
          "कंप्यूटर प्रोसेसिंग यूनिट",
        ],
        correct: 0,
        explanation:
          "CPU का मतलब सेंट्रल प्रोसेसिंग यूनिट है - कंप्यूटर का दिमाग",
      },
      {
        question:
          "इंटरनेट से जुड़ने के लिए क्या उपयोग किया जाता है?",
        options: [
          "माउस",
          "कीबोर्ड",
          "वाई-फाई या ईथरनेट",
          "मॉनिटर",
        ],
        correct: 2,
        explanation:
          "वाई-फाई या ईथरनेट केबल का उपयोग उपकरणों को इंटरनेट से जोड़ने के लिए किया जाता है",
      },
    ],
  },
};

export function SubjectQuiz({
  subject,
  language,
  onBack,
}: SubjectQuizProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<
    number | null
  >(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState<boolean[]>([]);
  const [quizComplete, setQuizComplete] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);

  // Ensure language is valid, default to 'en'
  const validLanguage =
    language && ["en", "hi"].includes(language)
      ? language
      : "en";
  const t =
    translations[validLanguage as keyof typeof translations] ||
    translations.en;
  const questions =
    quizData[subject as keyof typeof quizData]?.[
      validLanguage as keyof typeof quizData.math
    ] ||
    quizData[subject as keyof typeof quizData]?.en ||
    quizData.math.en;

  useEffect(() => {
    if (!showResult && !quizComplete && timeLeft > 0) {
      const timer = setTimeout(
        () => setTimeLeft(timeLeft - 1),
        1000,
      );
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !showResult) {
      handleSubmitAnswer();
    }
  }, [timeLeft, showResult, quizComplete]);

  const handleSubmitAnswer = () => {
    if (selectedAnswer === null) {
      setSelectedAnswer(-1); // Mark as unanswered
    }

    const isCorrect =
      selectedAnswer === questions[currentQuestion].correct;
    const newAnswers = [...answers, isCorrect];
    setAnswers(newAnswers);

    if (isCorrect) {
      setScore(score + 10);
    }

    setShowResult(true);
  };

  const handleNextQuestion = () => {
    if (currentQuestion + 1 < questions.length) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setShowResult(false);
      setTimeLeft(30);
    } else {
      setQuizComplete(true);
    }
  };

  const handleTryAgain = () => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setScore(0);
    setAnswers([]);
    setQuizComplete(false);
    setTimeLeft(30);
  };

  if (quizComplete) {
    const finalScore = Math.round(
      (score / (questions.length * 10)) * 100,
    );
    const pointsEarned = score * 2;

    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl">
          <CardHeader className="text-center">
            <Trophy className="mx-auto w-16 h-16 text-yellow-500 mb-4" />
            <CardTitle className="text-3xl">
              {t.quizComplete}
            </CardTitle>
            <CardDescription>{t.wellDone}</CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="text-2xl">{finalScore}%</div>
                <div className="text-sm text-gray-600">
                  {t.yourScore}
                </div>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="text-2xl">{pointsEarned}</div>
                <div className="text-sm text-gray-600">
                  {t.pointsEarned}
                </div>
              </div>
            </div>

            {finalScore >= 80 && (
              <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                <Star className="mx-auto w-8 h-8 text-yellow-500 mb-2" />
                <p className="text-yellow-700">{t.newLevel}</p>
              </div>
            )}

            <div className="flex gap-4 justify-center">
              <Button onClick={handleTryAgain}>
                {t.tryAgain}
              </Button>
              <Button variant="outline" onClick={onBack}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                {t.backToDashboard}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const currentQ = questions[currentQuestion];
  const progress =
    ((currentQuestion + 1) / questions.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <Button
            variant="outline"
            onClick={onBack}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            {t.backToDashboard}
          </Button>

          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl">
              {t[subject as keyof typeof translations.en]}
            </h1>
            <div className="flex items-center gap-4">
              <Badge variant="secondary">
                {t.question} {currentQuestion + 1} {t.of}{" "}
                {questions.length}
              </Badge>
              <Badge
                variant={
                  timeLeft <= 10 ? "destructive" : "secondary"
                }
              >
                {timeLeft}s
              </Badge>
            </div>
          </div>

          <Progress value={progress} className="mb-6" />
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-xl">
              {currentQ.question}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {currentQ.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() =>
                    !showResult && setSelectedAnswer(index)
                  }
                  disabled={showResult}
                  className={`p-4 text-left border-2 rounded-lg transition-all ${
                    selectedAnswer === index
                      ? showResult
                        ? index === currentQ.correct
                          ? "border-green-500 bg-green-50"
                          : "border-red-500 bg-red-50"
                        : "border-blue-500 bg-blue-50"
                      : showResult && index === currentQ.correct
                        ? "border-green-500 bg-green-50"
                        : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span>{option}</span>
                    {showResult && (
                      <>
                        {index === currentQ.correct && (
                          <CheckCircle className="w-5 h-5 text-green-500" />
                        )}
                        {selectedAnswer === index &&
                          index !== currentQ.correct && (
                            <XCircle className="w-5 h-5 text-red-500" />
                          )}
                      </>
                    )}
                  </div>
                </button>
              ))}
            </div>

            {showResult && (
              <div
                className={`mt-4 p-4 rounded-lg ${
                  selectedAnswer === currentQ.correct
                    ? "bg-green-50"
                    : "bg-red-50"
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  {selectedAnswer === currentQ.correct ? (
                    <>
                      <CheckCircle className="w-5 h-5 text-green-500" />
                      <span className="text-green-700">
                        {t.correct}
                      </span>
                    </>
                  ) : (
                    <>
                      <XCircle className="w-5 h-5 text-red-500" />
                      <span className="text-red-700">
                        {t.incorrect}
                      </span>
                    </>
                  )}
                </div>
                <p className="text-sm text-gray-700">
                  {currentQ.explanation}
                </p>
              </div>
            )}

            <div className="mt-6 flex justify-end">
              {!showResult ? (
                <Button
                  onClick={handleSubmitAnswer}
                  disabled={selectedAnswer === null}
                >
                  {t.submitAnswer}
                </Button>
              ) : (
                <Button onClick={handleNextQuestion}>
                  {currentQuestion + 1 < questions.length
                    ? t.nextQuestion
                    : t.quizComplete}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}