let num1, num2, correctAnswer, problemCount, score, sign;
let currentProblem = 0;
let problemNumbers = [];
let userAnswers = [];
let wrongAnswers = [];

async function getEasyNumber() {
    const response = await fetch("http://localhost:2000/easy");
    const number = await response.text();
    return parseInt(number);
}

async function getMedNumber() {
    const response = await fetch("http://localhost:2000/medium");
    const number = await response.text();
    return parseInt(number);
}

async function getHardNumber() {
    const response = await fetch("http://localhost:2000/hard");
    const number = await response.text();
    return parseInt(number);
}

async function generateProblem(operation, difficulty) {
    if (problemCount >= 10) {
        endGame();
        return;
    }

    document.getElementById('result').style.display = 'none';



    if (problemNumbers[currentProblem]) {
        [num1, num2] = problemNumbers[currentProblem];
    } else {
        [num1, num2] = await getNumbersByDifficulty(difficulty);
        problemNumbers[currentProblem] = [num1, num2];
    }

    setOperationVariables(operation);
    clearObsolete();
}

async function getNumbersByDifficulty(difficulty) {
    switch (difficulty) {
        case "hard":
            return [await getHardNumber(), await getHardNumber()];
        case "medium":
            return [await getMedNumber(), await getMedNumber()];
        case "easy":
            return [await getEasyNumber(), await getEasyNumber()];
        default:
            throw new Error("Invalid difficulty");
    }
}

function setOperationVariables(operation) {
    sign = (operation === "addition") ? "+" : "-";
    correctAnswer = (operation === "addition") ? num1 + num2 : num1 - num2;
}

function clearObsolete () {
    document.getElementById('problem').textContent = `${num1} ${sign} ${num2} = ?`;
    document.getElementById('answer').value = userAnswers[currentProblem] || '';
    document.getElementById('answer').disabled = false;
    document.getElementById('result').textContent = '';
    document.getElementById('result').style.display = 'none';
    document.getElementById('previous-button').style.display = currentProblem > 0 ? 'inline' : 'none';
}

async function checkAnswer(operation, difficulty) {
    if (problemCount >= 10) { endGame(); }

    const userAnswer = parseInt (document.getElementById('answer').value);
    userAnswers[currentProblem] = userAnswer;
    updateScoreAndWrongAnswers (operation, userAnswer);

    problemCount++;
    currentProblem++;
    displayResult (userAnswer === correctAnswer ? 'Correct!' : 'Incorrect');

    if (problemCount < 10) { generateProblem(operation, difficulty); } 
    else { endGame(); }
}

function updateScoreAndWrongAnswers(operation, userAnswer) {
    if (userAnswer === correctAnswer) {
        score++;
    } else {
        const operator = operation === "addition" ? "+" : "-";
        wrongAnswers.push(`${num1} ${operator} ${num2} = ${userAnswer} (Correct Answer: ${correctAnswer})`);
    }
}

function displayResult(result) {
    document.getElementById('result').textContent = result;
}

async function previousProblem(operation, difficulty) {
    if (currentProblem > 0) {
        currentProblem--;
        problemCount--;
        generateProblem(operation, difficulty);
    }
}

async function endGame() {
    const finalScore = calculateFinalScore();

    hideElements(['problem-container', 'navigation-container', 'previous-button', 'next-button']);
    displayResult(`Final Score: ${finalScore}/10`);
    disableElement('answer');

    if (wrongAnswers.length > 0) {
        displayWrongProblems();
    }

    displayResult(`Final Score: ${score}/10`);
}

function calculateFinalScore() {
    let finalScore = 0;
    for (let i = 0; i < userAnswers.length; i++) {
        if (userAnswers[i] === problemNumbers[i][0] + problemNumbers[i][1]) {
            finalScore++;
        }
    }
    return finalScore;
}

function hideElements(elementIds) {
    elementIds.forEach((id) => {
        document.getElementById(id).style.display = 'none';
    });
}

function displayResult(content) {
    const resultElement = document.getElementById('result');
    resultElement.style.display = 'block';
    resultElement.textContent = content;
}

function disableElement(elementId) {
    document.getElementById(elementId).disabled = true;
}

function displayWrongProblems() {
    const wrongProblemsContainer = createAndAppendElement('div', 'wrong-problems-container');
    const wrongProblemsHeading = createAndAppendElement('h3', null, 'Problems you got wrong:');    
    const wrongProblemsList = createAndAppendElement('p');
    
    wrongProblemsContainer.appendChild(wrongProblemsHeading);
    wrongProblemsContainer.appendChild(wrongProblemsList);

    for (let i = 0; i < wrongAnswers.length; i++) {
        const wrongProblem = createAndAppendElement('p', null, wrongAnswers[i]);
        wrongProblemsContainer.appendChild(wrongProblem);
    }

    document.body.appendChild(wrongProblemsContainer);
}

function createAndAppendElement(tag, id, textContent) {
    const element = document.createElement(tag);
    if (id) { element.id = id; }
    if (textContent) { element.textContent = textContent; }
    return element;
}

window.onload = async function () {
    const pathArray = window.location.pathname.split('_');
    const difficulty = pathArray[0].replace('/', '');
    const operation = pathArray[1]; 

    problemCount = 0;
    score = 0;
    generateProblem(operation, difficulty);
};
