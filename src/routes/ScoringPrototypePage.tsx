import { useState } from "react";

type PGQuestion = {
  id: string;
  question: string;
  score: number;
};

type EssayQuestion = {
  id: string;
  question: string;
  score: number;
};

export default function ScoringPrototypePage() {
  const totalScore = 1000;
  const [defaultPGScore, setDefaultPGScore] = useState(10);
  const [PGQuestions, setPGQuestions] = useState<PGQuestion[]>([]);
  const [EssayQuestions, setEssayQuestions] = useState<EssayQuestion[]>([]);

  const PGQuestionsTotalScore = PGQuestions.reduce(
    (acc, cur) => acc + cur.score,
    0
  );

  const essayQuestionsTotalScore = EssayQuestions.reduce(
    (acc, cur) => acc + cur.score,
    0
  );

  const totalDefinedScore = PGQuestionsTotalScore + essayQuestionsTotalScore;
  const scorePoolLeft =
    totalScore - totalDefinedScore <= 0 ? 0 : totalScore - totalDefinedScore;
  return (
    <div className="h-svh w-screen">
      <div className="flex flex-col gap-8">
        <div className="flex gap-2 text-white">
          <button
            className="bg-slate-700 p-2"
            onClick={() => {
              setPGQuestions([
                ...PGQuestions,
                {
                  id: crypto.randomUUID(),
                  question: `soal ${PGQuestions.length + 1}`,
                  score: defaultPGScore,
                },
              ]);
            }}
          >
            tambah soal pg
          </button>
          <button
            className="bg-slate-700 p-2"
            onClick={() => {
              setEssayQuestions([
                ...EssayQuestions,
                {
                  id: crypto.randomUUID(),
                  question: `soal ${EssayQuestions.length + 1}`,
                  score: 0,
                },
              ]);
            }}
          >
            tambah soal essay
          </button>
          <div className="flex flex-col gap-1 bg-slate-700">
            <div className="">default pg score</div>
            <input
              type="number"
              className="bg-slate-700"
              value={defaultPGScore}
              onChange={(e) => {
                setDefaultPGScore(Number(e.target.value));
                setPGQuestions(
                  PGQuestions.map((question) => {
                    question.score = Number(e.target.value);
                    return question;
                  })
                );
              }}
            />
          </div>
        </div>
        <div className="flex gap-4">
          <div className="border">
            {PGQuestions.map((question, i) => {
              const score = (() => {
                if (EssayQuestions.length > 0) {
                  return question.score;
                } else {
                  return 100 / PGQuestions.length;
                }
              })();
              return (
                <div
                  key={i}
                >{`soal pg: ${question.question} - score: ${score}`}</div>
              );
            })}
          </div>
          <div className="border">
            {EssayQuestions.map((question) => {
              const score = (() => {
                if (question.score > 0) {
                  return question.score;
                } else {
                  const essayQuestionsWithoutScore = EssayQuestions.filter(
                    (question) => {
                      return question.score === 0;
                    }
                  );
                  const baseScore = Math.floor(
                    scorePoolLeft / essayQuestionsWithoutScore.length
                  );
                  const remainingPoints =
                    scorePoolLeft % essayQuestionsWithoutScore.length;
                  // Find index of current question in the unscored questions array
                  const currentIndex = essayQuestionsWithoutScore.findIndex(
                    (q) => q.id === question.id
                  );
                  // Add 1 extra point to first N questions where N is the remainder
                  return baseScore + (currentIndex < remainingPoints ? 1 : 0);
                }
              })();
              return (
                <div className="flex" key={question.id}>
                  <div>{`soal essay: ${question.question} - score: `}</div>
                  <input
                    type="number"
                    value={score}
                    className="border"
                    onChange={(e) => {
                      setEssayQuestions((prev) => {
                        return prev.map((prevQuestion) => {
                          if (prevQuestion.id === question.id) {
                            prevQuestion.score = Number(e.target.value);
                            return prevQuestion;
                          }
                          return prevQuestion;
                        });
                      });
                    }}
                  />
                </div>
              );
            })}
          </div>
        </div>
        <div className="border">
          <div>target total score: {totalScore}</div>
          <div />
          total score:{" "}
          {(() => {
            if (EssayQuestions.length > 0) {
              return totalDefinedScore + scorePoolLeft;
            } else {
              return totalScore;
            }
          })()}
          <div>
            total score pg:{" "}
            {(() => {
              if (EssayQuestions.length > 0) {
                return `${PGQuestionsTotalScore} (${(PGQuestionsTotalScore / totalScore) * 100}%)`;
              } else {
                return totalScore;
              }
            })()}
          </div>
          <div>
            total score essay:{" "}
            {(() => {
              if (EssayQuestions.length > 0) {
                return `${essayQuestionsTotalScore + scorePoolLeft} ( ${
                  (essayQuestionsTotalScore + scorePoolLeft / totalScore) * 100
                }%) `;
              } else {
                return 0;
              }
            })()}
          </div>
          <div>score prool left: {scorePoolLeft}</div>
        </div>
      </div>
    </div>
  );
}
