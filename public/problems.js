// Global variables
let num1, num2, correctAnswer, problemCount, score, sign;
let currentProblem = 0;
let problemNumbers = [];
let userAnswers = [];
let wrongAnswers = [];

// Fetches a number from a given URL
async function fetchNumber(url) {
    try {
        console.log("Request Sent")
        const response = await fetch(url);
        const number = await response.text();
        console.log(number)
        return parseInt(number);
    } catch (error) {
        console.error(`Error fetching number from ${url}: ${error}`);
        throw error;
    }
}

// Fetches a pair of numbers based on the specified difficulty level
async function fetchNumbersByDifficulty(difficulty) {
    switch (difficulty) {
        case "hard":
            return [await fetchNumber("http://localhost:2000/hard"), await fetchNumber("http://localhost:2000/hard")];
        case "medium":
            return [await fetchNumber("http://localhost:2000/medium"), await fetchNumber("http://localhost:2000/medium")];
        case "easy":
            return [await fetchNumber("http://localhost:2000/easy"), await fetchNumber("http://localhost:2000/easy")];
        default:
            throw new Error("Invalid difficulty");
    }
}

// Sets operation-related variables based on the type of operation
function setOperationVariables(operation) {
    sign = (operation === "addition") ? "+" : "-";
    correctAnswer = (operation === "addition") ? num1 + num2 : num1 - num2;
}


// Clears obsolete objects in the DOM
function clearObsolete() {
    const problemElement = document.getElementById('problem');
    problemElement.textContent = `${num1} ${sign} ${num2} = ?`;

    const answerElement = document.getElementById('answer');
    answerElement.value = userAnswers[currentProblem] || '';
    answerElement.disabled = false;

    const resultElement = document.getElementById('result');
    resultElement.textContent = '';
    resultElement.style.display = 'none';

    const prevButton = document.getElementById('previous-button');
    prevButton.style.display = currentProblem > 0 ? 'inline' : 'none';
}

// Displays a result in the DOM
function displayResult(content) {
    const resultElement = document.getElementById('result');
    resultElement.textContent = content;
    resultElement.style.display = 'block';
}

// Hides specified elements in the DOM
function hideElements(elementIds) {
    elementIds.forEach((id) => {
        document.getElementById(id).style.display = 'none';
    });
}

// Disables a specified element in the DOM
function disableElement(elementId) {
    document.getElementById(elementId).disabled = true;
}

// Displays a list of wrong problems in the DOM
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

// Creates and appends an element to the DOM
function createAndAppendElement(tag, id, textContent) {
    const element = document.createElement(tag);
    if (id) {
        element.id = id;
    }
    if (textContent) {
        element.textContent = textContent;
    }
    return element;
}

// Generates a new problem based on the specified operation and difficulty
async function generateProblem(operation, difficulty) {
    if (problemCount >= 10) {
        endGame(operation, difficulty);
        return;
    }

    document.getElementById('result').style.display = 'none';

    if (problemNumbers[currentProblem]) {
        [num1, num2] = problemNumbers[currentProblem];
    } else {
        [num1, num2] = await fetchNumbersByDifficulty(difficulty);
        problemNumbers[currentProblem] = [num1, num2];
    }

    setOperationVariables(operation);
    clearObsolete();
}

// Checks the user's answer, updates the game state, and displays the result
async function checkAnswer(operation, difficulty) {
    if (problemCount >= 10) {
        endGame(operation, difficulty);
        return;
    }

    const userAnswer = parseInt(document.getElementById('answer').value);
    userAnswers[currentProblem] = userAnswer;

    updateScoreAndWrongAnswers(operation, userAnswer);

    problemCount++;
    currentProblem++;
    displayResult(userAnswer === correctAnswer ? 'Correct!' : 'Incorrect');

    if (problemCount < 10) {
        generateProblem(operation, difficulty);
    } else {
        endGame(operation, difficulty);
    }
}

// Updates the score and appends wrong answers to the list
function updateScoreAndWrongAnswers(operation, userAnswer) {
    if (userAnswer === correctAnswer) {
        score++;
    } else {
        const operator = operation === "addition" ? "+" : "-";
        wrongAnswers.push(`${num1} ${operator} ${num2} = ${userAnswer} (Correct Answer: ${correctAnswer})`);
    }
}

// Navigates to the previous problem
async function previousProblem(operation, difficulty) {
    if (currentProblem > 0) {
        currentProblem--;
        problemCount--;
        generateProblem(operation, difficulty);
    }
}

// Ends the game and displays the final score
async function endGame(operation, difficulty) {
    const finalScore = calculateFinalScore(operation, difficulty);

    hideElements(['problem-container', 'navigation-container', 'previous-button', 'next-button']);
    displayResult(`Final Score: ${finalScore}/10`);
    disableElement('answer');

    if (wrongAnswers.length > 0) {
        displayWrongProblems();
    }
}

// Calculates the final score
function calculateFinalScore(operation, difficulty) {
    let finalScore = 0;
    for (let i = 0; i < userAnswers.length; i++) {
        if (operation === "addition") {
            expectedAnswer = problemNumbers[i][0] + problemNumbers[i][1];
            if (userAnswers[i] === expectedAnswer) { finalScore++; }
        } else if (operation === "subtraction") {
            expectedAnswer = problemNumbers[i][0] - problemNumbers[i][1];
            if (userAnswers[i] === expectedAnswer) { finalScore++;}
        }
    }
    return finalScore;
}


// On page load, do this
window.onload = async function () {
    const pathArray = window.location.pathname.split('_');
    const difficulty = pathArray[0].replace('/', '');
    const operation = pathArray[1]; 

    problemCount = 0;
    score = 0;
    generateProblem(operation, difficulty);
};