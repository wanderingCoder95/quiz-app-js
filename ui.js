

class UIController {
    constructor(questions) {
        this.questions = questions; // From quizEngine.js
        this.currentIndex = 0;
        this.score = 0;
        this.userAnswers = []; // To store real user input
        this.timer = null;
        this.timeLeft = 5;
        this.isLocked = false; // Prevent double clicking

        // DOM Elements
        this.screens = {
            start: document.getElementById('start-screen'),
            quiz: document.getElementById('quiz-screen'),
            result: document.getElementById('result-screen')
        };
        
        this.els = {
            timer: document.getElementById('timer'),
            progress: document.getElementById('progress'),
            questionText: document.getElementById('question-text'),
            optionsContainer: document.getElementById('options-container'),
            finalScore: document.getElementById('final-score'),
            reportContainer: document.getElementById('report-container'),
            btnStart: document.getElementById('btn-start'),
            btnRestart: document.getElementById('btn-restart')
        };

        this.initEvents();
    }

    initEvents() {
        this.els.btnStart.addEventListener('click', () => this.startGame());
        this.els.btnRestart.addEventListener('click', () => this.startGame());
    }

    showScreen(name) {
        Object.values(this.screens).forEach(s => s.classList.add('hidden'));
        this.screens[name].classList.remove('hidden');
    }

    startGame() {
        this.currentIndex = 0;
        this.score = 0;
        this.userAnswers = [];
        this.isLocked = false;
        
        
        
        this.showScreen('quiz');
        this.loadQuestion();
    }

    loadQuestion() {
        const q = this.questions[this.currentIndex];
        
        // Update UI Text
        this.els.questionText.innerText = q.question;
        this.els.progress.innerText = `Q: ${this.currentIndex + 1}/${this.questions.length}`;
        
        // Generate Options
        this.els.optionsContainer.innerHTML = '';
        q.options.forEach((opt, index) => {
            const btn = document.createElement('div');
            btn.className = 'option-btn';
            btn.innerHTML = `<span style="color:var(--kbc-gold)">${["A","B","C","D"][index]}:</span> ${opt}`;
            btn.onclick = () => this.handleAnswer(index, btn);
            this.els.optionsContainer.appendChild(btn);
        });

        // Start Timer
        this.startTimer();
    }

    startTimer() {
        this.timeLeft = 10; 
        this.els.timer.innerText = this.timeLeft;
        this.els.timer.style.color = 'white';

        if (this.timer) clearInterval(this.timer);

        this.timer = setInterval(() => {
            this.timeLeft--;
            this.els.timer.innerText = this.timeLeft;

            if (this.timeLeft <= 0) {
                clearInterval(this.timer);
                this.handleTimeOut();
            }
        }, 1000);
    }

    handleAnswer(selectedIndex, btnElement) {
        if (this.isLocked) return;
        this.isLocked = true;
        clearInterval(this.timer);

        // Visual Phase 1: Lock Answer (Orange)
        btnElement.classList.add('locked');

        // Logic Check
        const currentQ = this.questions[this.currentIndex];
        const isCorrect = selectedIndex === currentQ.correctAnswer;

        // Save data for report
        this.userAnswers.push({
            question: currentQ.question,
            selected: currentQ.options[selectedIndex],
            correct: currentQ.options[currentQ.correctAnswer],
            isCorrect: isCorrect,
            status: 'answered'
        });

        if (isCorrect) this.score++;

        // Visual Phase 2: Reveal (Wait 1s for dramatic effect)
        setTimeout(() => {
            if (isCorrect) {
                btnElement.classList.remove('locked');
                btnElement.classList.add('correct');
            } else {
                btnElement.classList.remove('locked');
                btnElement.classList.add('wrong');
                // Highlight real answer
                const allBtns = this.els.optionsContainer.children;
                allBtns[currentQ.correctAnswer].classList.add('correct');
            }

            // Move to next question after delay
            setTimeout(() => this.nextQuestion(), 2000);

        }, 1000);
    }

    handleTimeOut() {
        if (this.isLocked) return;
        this.isLocked = true;
        
        const currentQ = this.questions[this.currentIndex];
        
        this.userAnswers.push({
            question: currentQ.question,
            selected: "Timed Out",
            correct: currentQ.options[currentQ.correctAnswer],
            isCorrect: false,
            status: 'timeout'
        });

        // Show correct answer
        const allBtns = this.els.optionsContainer.children;
        allBtns[currentQ.correctAnswer].classList.add('correct');

        setTimeout(() => this.nextQuestion(), 2000);
    }

    nextQuestion() {
        this.isLocked = false;
        this.currentIndex++;
        
        if (this.currentIndex < this.questions.length) {
            this.loadQuestion();
        } else {
            this.endGame();
        }
    }

    endGame() {
        this.showScreen('result');
        this.els.finalScore.innerText = this.score;
        this.renderReport();
    }

    renderReport() {
        this.els.reportContainer.innerHTML = '';
        this.userAnswers.forEach((ans, i) => {
            const div = document.createElement('div');
            div.className = `report-item ${ans.isCorrect ? 'correct' : 'wrong'}`;
            div.innerHTML = `
                <strong>Q${i+1}: ${ans.question}</strong><br>
                <small>You: ${ans.selected} | Correct: ${ans.correct}</small>
            `;
            this.els.reportContainer.appendChild(div);
        });
    }
}


document.addEventListener('DOMContentLoaded', () => {
    new UIController(questions);
});