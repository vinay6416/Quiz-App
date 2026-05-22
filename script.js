let allQuestions = JSON.parse(localStorage.getItem("quizQuestions")) || [
    {
        question: "What does HTML stand for?",
        answers: [
            { text: "Hyper Text Markup Language", correct: true },
            { text: "High Text Machine Language", correct: false },
            { text: "Hyper Transfer Markup Language", correct: false },
            { text: "Home Tool Markup Language", correct: false }
        ]
    },
    {
        question: "Which language is used for styling web pages?",
        answers: [
            { text: "CSS", correct: true },
            { text: "HTML", correct: false },
            { text: "Python", correct: false },
            { text: "Java", correct: false }
        ]
    },
    {
        question: "Which language makes web pages interactive?",
        answers: [
            { text: "JavaScript", correct: true },
            { text: "Python", correct: false },
            { text: "Java", correct: false },
            { text: "C++", correct: false }
        ]
    }
];

if (!localStorage.getItem("quizQuestions")) {
    localStorage.setItem(
        "quizQuestions",
        JSON.stringify(allQuestions)
    );
}

let currentUser = null;
let quizQuestions = [];
let currentQuestionIndex = 0;
let score = 0;

const QUESTIONS_PER_QUIZ = 5;

const questionEl =
    document.getElementById("question");

const answerButtons =
    document.getElementById("answer-buttons");

const nextBtn =
    document.getElementById("next-btn");

const message =
    document.getElementById("message");

const loginMessage =
    document.getElementById("login-message");


function showSection(sectionId) {

    const sections = [
        "register-section",
        "login-section",
        "home-section",
        "quiz-section",
        "create-quiz-section",
        "score-section"
    ];

    sections.forEach(id => {

        const section =
            document.getElementById(id);

        if (section) {

            section.style.display =
                id === sectionId ? "block" : "none";
        }
    });
}

function showRegister() {
    showSection("register-section");
}

function showLogin() {
    showSection("login-section");
}

function goHome() {
    showSection("home-section");
}

function logout() {

    currentUser = null;

    document.body.classList.remove("quiz-mode");

    showSection("login-section");
}

function registerUser() {

    const name =
        document.getElementById("reg-name").value.trim();

    const email =
        document.getElementById("reg-email").value.trim();

    const password =
        document.getElementById("reg-password").value.trim();

    if (!name || !email || !password) {

        message.textContent =
            "Please fill all fields.";

        message.style.color = "red";

        return;
    }

    let users =
        JSON.parse(localStorage.getItem("quizUsers")) || [];

    const existingUser =
        users.find(user => user.email === email);

    if (existingUser) {

        message.textContent =
            "Account already exists.";

        message.style.color = "orange";

        return;
    }

    users.push({
        name,
        email,
        password
    });

    localStorage.setItem(
        "quizUsers",
        JSON.stringify(users)
    );

    message.textContent =
        "Registration successful!";

    message.style.color = "green";

    document.getElementById("reg-name").value = "";
    document.getElementById("reg-email").value = "";
    document.getElementById("reg-password").value = "";

    setTimeout(showLogin, 1000);
}

function loginUser() {

    const email =
        document.getElementById("login-email").value.trim();

    const password =
        document.getElementById("login-password").value.trim();

    let users =
        JSON.parse(localStorage.getItem("quizUsers")) || [];

    const user =
        users.find(
            u =>
                u.email === email &&
                u.password === password
        );

    if (!user) {

        loginMessage.textContent =
            "Account not found.";

        loginMessage.style.color = "red";

        return;
    }

    currentUser = user;

    loginMessage.textContent =
        "Login successful!";

    loginMessage.style.color = "green";

    setTimeout(() => {

        document.body.classList.add("quiz-mode");

        showSection("home-section");

    }, 1000);
}

function startQuiz() {

    document.body.classList.add("quiz-mode");

    showSection("quiz-section");

    currentQuestionIndex = 0;

    score = 0;

    allQuestions =
        JSON.parse(localStorage.getItem("quizQuestions")) || [];

    quizQuestions =
        shuffleArray(allQuestions).slice(
            0,
            Math.min(
                QUESTIONS_PER_QUIZ,
                allQuestions.length
            )
        );

    nextBtn.textContent = "Next Question";

    showQuestion();
}

function shuffleArray(array) {

    return [...array].sort(
        () => Math.random() - 0.5
    );
}

function showQuestion() {

    resetState();

    const currentQuestion =
        quizQuestions[currentQuestionIndex];

    questionEl.textContent =
        currentQuestion.question;

    currentQuestion.answers.forEach(answer => {

        const button =
            document.createElement("button");

        button.textContent =
            answer.text;

        button.classList.add("answer-btn");

        button.dataset.correct =
            answer.correct;

        button.addEventListener(
            "click",
            selectAnswer
        );

        answerButtons.appendChild(button);
    });
}

function resetState() {

    nextBtn.style.display = "none";

    answerButtons.innerHTML = "";
}

function selectAnswer(e) {

    const selectedBtn = e.target;

    const isCorrect =
        selectedBtn.dataset.correct === "true";

    if (isCorrect) {
        score++;
    }

    Array.from(answerButtons.children)
        .forEach(button => {

            if (
                button.dataset.correct === "true"
            ) {

                button.style.background =
                    "green";

                button.style.color =
                    "white";
            }

            else if (button === selectedBtn) {

                button.style.background =
                    "red";

                button.style.color =
                    "white";
            }

            button.disabled = true;
        });

    nextBtn.style.display = "block";
}

nextBtn.addEventListener(
    "click",
    function () {

        if (
            nextBtn.textContent ===
            "🔄 Retake Quiz"
        ) {

            startQuiz();

            return;
        }

        currentQuestionIndex++;

        if (
            currentQuestionIndex <
            quizQuestions.length
        ) {

            showQuestion();
        }

        else {

            showScore();
        }
    }
);


function showScore() {

    resetState();

    questionEl.innerHTML =
        `🎉 Congratulations!<br><br>
        ${currentUser.name},
        you scored
        ${score}
        out of
        ${quizQuestions.length}`;

    saveScore();

    nextBtn.textContent =
        "🔄 Retake Quiz";

    nextBtn.style.display =
        "block";
}

function saveScore() {

    let scores =
        JSON.parse(localStorage.getItem("quizScores")) || [];

    scores.push({
        name: currentUser.name,
        email: currentUser.email,
        score: score,
        total: quizQuestions.length,
        date: new Date().toLocaleString()
    });

    localStorage.setItem(
        "quizScores",
        JSON.stringify(scores)
    );
}

function showCreateQuiz() {

    showSection("create-quiz-section");

    displayQuestions();
}

function addQuestion() {

    const question =
        document.getElementById("new-question").value.trim();

    const option1 =
        document.getElementById("option1").value.trim();

    const option2 =
        document.getElementById("option2").value.trim();

    const option3 =
        document.getElementById("option3").value.trim();

    const option4 =
        document.getElementById("option4").value.trim();

    const correctAnswer =
        document.getElementById("correct-option").value.trim();

    if (
        !question ||
        !option1 ||
        !option2 ||
        !option3 ||
        !option4 ||
        !correctAnswer
    ) {

        alert(
            "Please fill all fields."
        );

        return;
    }

    const options = [
        option1,
        option2,
        option3,
        option4
    ];

    if (
        !options.includes(correctAnswer)
    ) {

        alert(
            "Correct answer must match one option."
        );

        return;
    }

    const newQuestion = {

        question: question,

        answers: [

            {
                text: option1,
                correct:
                    option1 === correctAnswer
            },

            {
                text: option2,
                correct:
                    option2 === correctAnswer
            },

            {
                text: option3,
                correct:
                    option3 === correctAnswer
            },

            {
                text: option4,
                correct:
                    option4 === correctAnswer
            }
        ]
    };

    let savedQuestions =
        JSON.parse(localStorage.getItem("quizQuestions")) || [];

    savedQuestions.push(newQuestion);

    localStorage.setItem(
        "quizQuestions",
        JSON.stringify(savedQuestions)
    );

    allQuestions = savedQuestions;

    alert(
        "✅ Question Added Successfully!"
    );

    document.getElementById("new-question").value = "";

    document.getElementById("option1").value = "";

    document.getElementById("option2").value = "";

    document.getElementById("option3").value = "";

    document.getElementById("option4").value = "";

    document.getElementById("correct-option").value = "";

    displayQuestions();
}

function displayQuestions() {

    const container =
        document.getElementById("question-list");

    let savedQuestions =
        JSON.parse(localStorage.getItem("quizQuestions")) || [];

    if (savedQuestions.length === 0) {

        container.innerHTML =
            "<p>No Questions Added.</p>";

        return;
    }

    container.innerHTML = "";

    savedQuestions.forEach((q, index) => {

        const div =
            document.createElement("div");

        div.classList.add("question-box");

        const correctAnswer =
            q.answers.find(
                ans => ans.correct
            );

        div.innerHTML = `
            <h3>
                Question ${index + 1}
            </h3>

            <p>
                <strong>Q:</strong>
                ${q.question}
            </p>

            <p>
                1. ${q.answers[0].text}
            </p>

            <p>
                2. ${q.answers[1].text}
            </p>

            <p>
                3. ${q.answers[2].text}
            </p>

            <p>
                4. ${q.answers[3].text}
            </p>

            <p>
                <strong>
                    Correct:
                </strong>
                ${correctAnswer.text}
            </p>

            <button
                onclick="deleteQuestion(${index})"
            >
                ❌ Delete
            </button>

            <hr>
        `;

        container.appendChild(div);
    });
}

function deleteQuestion(index) {

    let savedQuestions =
        JSON.parse(localStorage.getItem("quizQuestions")) || [];

    savedQuestions.splice(index, 1);

    localStorage.setItem(
        "quizQuestions",
        JSON.stringify(savedQuestions)
    );

    allQuestions = savedQuestions;

    displayQuestions();

    alert(
        "🗑️ Question Deleted Successfully!"
    );
}

function showScoreCard() {

    showSection("score-section");

    const scores =
        JSON.parse(localStorage.getItem("quizScores")) || [];

    const scoreList =
        document.getElementById("score-list");

    if (scores.length === 0) {

        scoreList.innerHTML =
            "<p>No scores available.</p>";

        return;
    }

    scoreList.innerHTML =
        scores.map(item => `

        <div class="question-box">

            <p>
                <strong>
                    ${item.name}
                </strong>
            </p>

            <p>
                ${item.email}
            </p>

            <p>
                Score:
                ${item.score}/${item.total}
            </p>

            <small>
                ${item.date}
            </small>

        </div>

        `).join("");
}

showSection("register-section");
// ======================================
// Add Question
// ======================================
function addQuestion() {

    const question =
        document.getElementById("new-question").value.trim();

    const option1 =
        document.getElementById("option1").value.trim();

    const option2 =
        document.getElementById("option2").value.trim();

    const option3 =
        document.getElementById("option3").value.trim();

    const option4 =
        document.getElementById("option4").value.trim();

    // Validation
    if (
        !question ||
        !option1 ||
        !option2 ||
        !option3 ||
        !option4
    ) {

        alert("Please fill all fields.");

        return;
    }

    // First option becomes correct answer automatically
    const newQuestion = {

        question: question,

        answers: [

            {
                text: option1,
                correct: true
            },

            {
                text: option2,
                correct: false
            },

            {
                text: option3,
                correct: false
            },

            {
                text: option4,
                correct: false
            }
        ]
    };

    // Load existing questions
    let savedQuestions =
        JSON.parse(localStorage.getItem("quizQuestions")) || [];

    // Add question
    savedQuestions.push(newQuestion);

    // Save questions
    localStorage.setItem(
        "quizQuestions",
        JSON.stringify(savedQuestions)
    );

    // Update global variable
    allQuestions = savedQuestions;

    // Success message
    alert("✅ Question Added Successfully!");

    // Clear input fields
    document.getElementById("new-question").value = "";

    document.getElementById("option1").value = "";

    document.getElementById("option2").value = "";

    document.getElementById("option3").value = "";

    document.getElementById("option4").value = "";

    // Refresh question list
    displayQuestions();
}

// ======================================
// Start Quiz
// ======================================
function startQuiz() {

    document.body.classList.add("quiz-mode");

    showSection("quiz-section");

    currentQuestionIndex = 0;

    score = 0;

    // Load latest questions
    allQuestions =
        JSON.parse(localStorage.getItem("quizQuestions")) || [];

    // Shuffle Questions
    let shuffledQuestions =
        shuffleArray(allQuestions);

    // Prevent repeating same order
    quizQuestions =
        shuffledQuestions.slice(
            0,
            Math.min(
                QUESTIONS_PER_QUIZ,
                shuffledQuestions.length
            )
        );

    nextBtn.textContent =
        "Next Question";

    showQuestion();
}

// ======================================
// Shuffle Array
// ======================================
function shuffleArray(array) {

    let shuffled = [...array];

    for (
        let i = shuffled.length - 1;
        i > 0;
        i--
    ) {

        const j =
            Math.floor(
                Math.random() * (i + 1)
            );

        [shuffled[i], shuffled[j]] =
            [shuffled[j], shuffled[i]];
    }

    return shuffled;
}