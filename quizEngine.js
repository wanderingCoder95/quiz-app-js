

class QuizEngine {
  constructor(questions, userAnswers, timeLimitPerQuestion = 5) {
    this.questions = [...questions]; // copy to avoid mutation
    this.userAnswers = userAnswers;
    this.timeLimit = timeLimitPerQuestion;

    this.score = 0;
    this.report = [];
  }

  /* ---------- Utility: Shuffle (Fisher–Yates) ---------- */
  shuffleQuestions() {
    for (let i = this.questions.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.questions[i], this.questions[j]] = [
        this.questions[j],
        this.questions[i],
      ];
    }
  }

  /* ---------- Run Quiz ---------- */
  start() {
    this.score = 0;
    this.report = [];

    this.questions.forEach((question, index) => {
      const timeTaken = this.simulateTime();
      const userAnswer = this.userAnswers[index];
      const timedOut = timeTaken > this.timeLimit;

      let isCorrect = false;

      if (!timedOut && userAnswer === question.correctAnswer) {
        isCorrect = true;
        this.score++;
      }

      this.report.push({
        question: question.question,
        category: question.category,
        selectedAnswer:
          userAnswer !== undefined
            ? question.options[userAnswer]
            : "No Answer",
        correctAnswer: question.options[question.correctAnswer],
        isCorrect,
        timedOut,
        timeTaken,
      });
    });
  }

  /* ---------- Simulate Time Taken ---------- */
  simulateTime() {
    return Math.floor(Math.random() * 7) + 1; // 1–7 seconds
  }

  /* ---------- Show Final Score ---------- */
  showScore() {
    console.log(`\n🎯 Final Score: ${this.score}/${this.questions.length}`);
  }

  /* ---------- Detailed Report ---------- */
  showDetailedReport() {
    console.log("\n📊 Detailed Quiz Report\n");

    const categorySummary = {};

    this.report.forEach((entry, index) => {
      console.log(`Q${index + 1}: ${entry.question}`);
      console.log(`Category: ${entry.category}`);
      console.log(`Your Answer: ${entry.selectedAnswer}`);
      console.log(`Correct Answer: ${entry.correctAnswer}`);
      console.log(`Time Taken: ${entry.timeTaken}s`);

      if (entry.timedOut) {
        console.log("⏱️ Result: Timed Out");
      } else if (entry.isCorrect) {
        console.log("✅ Result: Correct");
      } else {
        console.log("❌ Result: Wrong");
      }

      console.log("----------------------------------");

      if (!categorySummary[entry.category]) {
        categorySummary[entry.category] = { correct: 0, total: 0 };
      }
      categorySummary[entry.category].total++;
      if (entry.isCorrect) {
        categorySummary[entry.category].correct++;
      }
    });

    console.log("\n📚 Category-wise Performance:");
    for (let category in categorySummary) {
      const { correct, total } = categorySummary[category];
      console.log(`- ${category}: ${correct}/${total}`);
    }
  }
}

/* ---------- Question Bank ---------- */

const questions = [
  {
    question: "What does JVM stand for?",
    options: [
      "Java Variable Machine",
      "Java Virtual Machine",
      "Java Visual Model",
      "Joint Virtual Memory",
    ],
    correctAnswer: 1,
    category: "Java",
  },
  {
    question: "Which keyword is used for inheritance in Java?",
    options: ["this", "super", "extends", "implements"],
    correctAnswer: 2,
    category: "OOP",
  },
  {
    question: "Which collection does not allow duplicates?",
    options: ["List", "Set", "Map", "ArrayList"],
    correctAnswer: 1,
    category: "Collections",
  },
];

/* ---------- Simulated User Answers ---------- */

const userAnswers = [1, 2, 0];

/* ---------- Run Quiz ---------- */

const quiz = new QuizEngine(questions, userAnswers, 10);

quiz.shuffleQuestions();
quiz.start();
quiz.showScore();
quiz.showDetailedReport();
