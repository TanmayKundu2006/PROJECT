// Questions and logic
const questions = [
    { id: "A1", text: "Have you been consistently depressed or down, most of the day, nearly every day, for the past two weeks?", weight: 10, nextYes: "A2", nextNo: "A2" },
    { id: "A2", text: "In the past two weeks, have you been less interested in most things or less able to enjoy the things you used to enjoy most of the time?", weight: 10, nextYes: "A3a", nextNo: "A3a" },
    { id: "A3a", text: "Was your appetite decreased or increased nearly every day, or did your weight change without trying intentionally (± 5% of body weight)?", weight: 8, nextYes: "A3b", nextNo: "A3b" },
    { id: "A3b", text: "Did you have trouble sleeping nearly every night (difficulty falling asleep, waking up, or sleeping excessively)?", weight: 9, nextYes: "A3c", nextNo: "A3c" },
    { id: "A3c", text: "Did you talk or move more slowly than normal or were you fidgety or restless almost every day?", weight: 10, nextYes: "A3d", nextNo: "A3d" },
    { id: "A3d", text: "Did you feel tired or without energy almost every day?", weight: 7, nextYes: "A3e", nextNo: "A3e" },
    { id: "A3e", text: "Did you feel worthless or guilty almost every day?", weight: 10, nextYes: "A3f", nextNo: "A3f" },
    { id: "A3f", text: "Did you have difficulty concentrating or making decisions almost every day?", weight: 7, nextYes: "A3g", nextNo: "A3g" },
    { id: "A3g", text: "Did you repeatedly consider hurting yourself, feel suicidal, or wish that you were dead?", weight: 12, nextYes: "A4", nextNo: "A4" },
    { id: "A4", text: "Are 3 or more A3 answers coded Yes?", weight: 0, nextYes: "A5a", nextNo: null },
    { id: "A5a", text: "During your lifetime, did you have other periods of two weeks or more when you felt depressed or uninterested in most things, and had most of the problems we just talked about?", weight: 4, nextYes: "A5b", nextNo: null },
    { id: "A5b", text: "Was there an interval of at least 2 months without depression and/or loss of interest between your current episode and your last episode of depression?", weight: 4, nextYes: "A6a", nextNo: "A6a" },
    { id: "A6a", text: "During the most severe period of the current depressive episode, did you lose your ability to respond to things that previously gave you pleasure?", weight: 8, nextYes: "A6b", nextNo: "A6b" },
    { id: "A6b", text: "When something good happens, does it fail to make you feel better, even temporarily?", weight: 8, nextYes: "A7a", nextNo: "A7a" },
    { id: "A7a", text: "Did you feel depressed in a way that is distinct from the kind of feeling you experience when someone close to you dies?", weight: 6, nextYes: "A7b", nextNo: "A7b" },
    { id: "A7b", text: "Was your depression worse in the morning?", weight: 6, nextYes: "A7c", nextNo: "A7c" },
    { id: "A7c", text: "Did you wake up significantly earlier than usual in the morning?", weight: 7, nextYes: "A7d", nextNo: "A7d" },
    { id: "A7d", text: "Did you experience significant anorexia or weight loss?", weight: 8, nextYes: "A7e", nextNo: "A7e" },
    { id: "A7e", text: "Did you experience psychomotor changes (agitation or retardation)?", weight: 9, nextYes: "A7f", nextNo: "A7f" },
    { id: "A7f", text: "Did you feel excessive guilt?", weight: 9, nextYes: null, nextNo: null }
];



let currentQuestionIndex = 0;
let totalScore = 0;
let symptomCount = 0; // Track the number of symptoms coded Yes
let hasA1OrA2 = false; // Screening criteria
let hasA2 = false;
let timerInterval;

// Load the first question
function loadQuestion() {
    const questionBox = document.getElementById("question-box");
    const questionText = document.getElementById("question-text");

    if (currentQuestionIndex < questions.length) {
        const currentQuestion = questions[currentQuestionIndex];
        questionText.innerText = currentQuestion.text;
    } else {
        calculateResult(); // Show result if no more questions
    }
}


// Handle Yes/No answers
function handleAnswer(answer) {
    const currentQuestion = questions[currentQuestionIndex];

    // If the question has a weight, and the answer is "Yes"
    if (currentQuestion.weight > 0 && answer) {
        totalScore += currentQuestion.weight;
        symptomCount++;
    }

    // Special handling for A1, A2, and A3 where we track if A1 or A2 was answered Yes
    if (currentQuestion.id === "A1" || currentQuestion.id === "A2") {
        if (answer === true) {
            hasA1OrA2 = true;
            if(currentQuestion.id === "A2") hasA2 = true
        }
       if(!hasA1OrA2 && currentQuestion.id === "A2"){
        calculateResult();
        }
    }

    // // Handling for A4: Check if 3 or more A3 answers are Yes
    // if (currentQuestion.id === "A4") {
    //     if (answer === true && symptomCount >= 3) {
    //         currentQuestionIndex = questions.findIndex(q => q.id === "A5"); // Move to A5 if condition met
    //     }
    // }

    // Handle transitions to the next question
    if (currentQuestion.nextYes && answer) {
        currentQuestionIndex = questions.findIndex(q => q.id === currentQuestion.nextYes);
        if(questions[currentQuestionIndex].id === "A4"){
            if (symptomCount >= 3) {
                currentQuestionIndex = questions.findIndex(q => q.id === "A5a"); // Move to A5 if condition met
            }else{
                calculateResult(); 
            }
        }
    } else if (currentQuestion.nextNo && !answer) {
        currentQuestionIndex = questions.findIndex(q => q.id === currentQuestion.nextNo);
        if(questions[currentQuestionIndex].id === "A4"){
            if (symptomCount >= 3) {
                currentQuestionIndex = questions.findIndex(q => q.id === "A5a"); // Move to A5 if condition met
            }else{
                calculateResult(); 
            }
        }
    } else {
        calculateResult(); // If no next question, calculate the result
    }

    loadQuestion(); // Load next question
}



// Calculate and display the result
function startTest() {
    document.getElementById("start-box").style.display = "none";
    document.getElementById("question-box").style.display = "block";
    startTimer(15 * 60); // 15 minutes in seconds
    loadQuestion();
}

function startTimer(duration) {
    const timerDisplay = document.getElementById("timer");
    let timeRemaining = duration;

    timerInterval = setInterval(() => {
        const minutes = Math.floor(timeRemaining / 60);
        const seconds = timeRemaining % 60;

        timerDisplay.textContent = `Time Left: ${minutes}:${seconds < 10 ? "0" + seconds : seconds}`;

        if (--timeRemaining < 0) {
            clearInterval(timerInterval);
            calculateResult(true); // Show result when time's up
        }
    }, 1000);
}

function calculateResult(timeUp = false) {
    clearInterval(timerInterval); // Stop the timer

    const resultBox = document.getElementById("result-box");
    const questionBox = document.getElementById("question-box");
    const resultText = document.getElementById("result-text");

    questionBox.style.display = "none";
    resultBox.style.display = "block";

    const progressCircle = document.querySelector(".progress-ring__circle");
    const radius = 50; // Matches CSS
    const circumference = 2 * Math.PI * radius;

    

    // Clear the ring and set default offset
    progressCircle.style.strokeDasharray = circumference;
    progressCircle.style.strokeDashoffset = circumference;

    const scoreElement = document.createElement("div");
    scoreElement.id = "score-display";
    scoreElement.style.position = "absolute"; // Use absolute positioning for better control
    scoreElement.style.top = "50%"; // Center vertically
    scoreElement.style.left = "50%"; // Center horizontally
    scoreElement.style.transform = "translate(-50%, -50%)"; // Fine-tune centering
    scoreElement.style.fontSize = "24px"; // Adjust font size for clarity
    scoreElement.style.fontWeight = "bold";
    scoreElement.style.color = "black"; // Optional: Customize text color
    resultBox.querySelector(".progress-ring").appendChild(scoreElement);
    

    // Handle timeout
    if (timeUp) {
        resultText.innerText = "Time is up! Please try again.";
        scoreElement.innerText = "0";
        return;
    }

    // Calculate percentage and adjust the ring's offset
    const scorePercentage = Math.min((totalScore / 100) * 100, 100); // Adjust based on maximum score
    const offset = circumference - (scorePercentage / 100) * circumference;
    progressCircle.style.strokeDashoffset = offset;

    // Add severity classification based on the scoring logic
    let severity = "";
    if (totalScore >= 71) {
        severity = "Severe Depression";
        progressCircle.style.stroke = "red"; 
    } else if (totalScore >= 41) {
        severity = "Moderate Depression";
        progressCircle.style.stroke = "orange"; 
    } else if (totalScore >= 20) {
        severity = "Mild Depression";
        progressCircle.style.stroke = "yellow"; 
    } else {
        severity = "No Depression Detected";
        progressCircle.style.stroke = "green"; 
    }

    // Update the center score and result text
    scoreElement.innerText = totalScore;
    resultText.innerHTML = `
        <strong style="color: ${
            severity === "Severe Depression" ? "red" : severity === "Moderate Depression" ? "orange" : "green"
        };">${severity}:</strong>
        You scored <strong>${totalScore}</strong>. ${severity === "No Depression Detected" ? "" : "Consider consulting a mental health professional."}
    `;
}
// Restart the questionnaire
function restart() {
    currentQuestionIndex = 0;
    totalScore = 0;
    symptomCount = 0;
    hasA1OrA2 = false;
    hasA2 = false;
    document.getElementById("result-box").style.display = "none";
    document.getElementById("question-box").style.display = "block";
    document.getElementById("timer").textContent = "Time Left: 15:00";
    const scoreElement = document.getElementById("score-display");
    if (scoreElement) {
        scoreElement.remove();
    }
    startTest()
}
loadQuestion();
