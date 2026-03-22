// ===== QUESTIONS =====
const questions = [
    {
        question: "Which language is used to structure a webpage?",
        answers: ["CSS", "HTML", "Python", "Java"],
        correct: "HTML"
    },
    {
        question: "Which language is used for styling webpages?",
        answers: ["HTML", "JavaScript", "CSS", "SQL"],
        correct: "CSS"
    },
    {
        question: "Which language makes webpages interactive?",
        answers: ["HTML", "CSS", "JavaScript", "PHP"],
        correct: "JavaScript"
    }
];

// ===== VARIABLES =====
let currentQuestionIndex = 0;
let score = 0;
let selectedAnswers = [];

// ===== ELEMENTS =====
const questionContainer = document.getElementById("questionContainer");
const nextBtn = document.getElementById("nextBtn");
const prevBtn = document.getElementById("prevBtn");

const progressText = document.getElementById("progressText");
const progressFill = document.getElementById("progressFill");

const quizContent = document.getElementById("quizContent");
const quizControls = document.getElementById("quizControls");
const quizResults = document.getElementById("quizResults");

const resultsTitle = document.getElementById("resultsTitle");
const resultsScore = document.getElementById("resultsScore");
const resultsBreakdown = document.getElementById("resultsBreakdown");
const restartBtn = document.getElementById("restartBtn");

// ===== LOAD QUESTION =====
function loadQuestion() {

    questionContainer.innerHTML = "";

    const q = questions[currentQuestionIndex];

    progressText.textContent = `Question ${currentQuestionIndex + 1} of ${questions.length}`;
    progressFill.style.width = ((currentQuestionIndex + 1) / questions.length) * 100 + "%";

    const questionEl = document.createElement("h3");
    questionEl.textContent = q.question;
    questionContainer.appendChild(questionEl);

    const optionsDiv = document.createElement("div");
    optionsDiv.classList.add("options");

    q.answers.forEach(answer => {
        const option = document.createElement("div");
        option.classList.add("option");
        option.textContent = answer;

        option.addEventListener("click", () => selectAnswer(option, q.correct));

        optionsDiv.appendChild(option);
    });

    questionContainer.appendChild(optionsDiv);

    prevBtn.disabled = currentQuestionIndex === 0;
}

// ===== SELECT =====
function selectAnswer(selected, correct) {

    const options = document.querySelectorAll(".option");

    options.forEach(opt => {
        opt.style.pointerEvents = "none";

        if (opt.textContent === correct) {
            opt.classList.add("correct");
        }
    });

    if (selected.textContent === correct) {
        selected.classList.add("correct");
        score++;
    } else {
        selected.classList.add("incorrect");
    }

    selectedAnswers[currentQuestionIndex] = selected.textContent;
}

// ===== NEXT =====
nextBtn.addEventListener("click", () => {

    currentQuestionIndex++;

    if (currentQuestionIndex < questions.length) {
        loadQuestion();
    } else {
        showResults();
    }
});

// ===== PREV =====
prevBtn.addEventListener("click", () => {

    if (currentQuestionIndex > 0) {
        currentQuestionIndex--;
        loadQuestion();
    }
});

// ===== RESULT =====
function showResults() {

    quizContent.classList.add("hidden");
    quizControls.classList.add("hidden");
    quizResults.classList.remove("hidden");

    resultsTitle.textContent = "🎉 Quiz Completed!";
    resultsScore.textContent = `Score: ${score} / ${questions.length}`;

    resultsBreakdown.innerHTML = "";

    questions.forEach((q, index) => {

        const div = document.createElement("div");
        div.classList.add("result-item");

        if (selectedAnswers[index] === q.correct) {
            div.classList.add("correct");
        } else {
            div.classList.add("incorrect");
        }

        div.textContent = `${index + 1}. ${q.question} → Your answer: ${selectedAnswers[index] || "-"}`;

        resultsBreakdown.appendChild(div);
    });
}

// ===== RESTART =====
restartBtn.addEventListener("click", () => {
    location.reload();
});

// ===== START =====
loadQuestion();