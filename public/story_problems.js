// Global variables
let num1, num2, correctAnswer, problemCount, score;

// Generates a new problem based on the specified operation and difficulty
function generateProblem (operation, difficulty) {
    if (problemCount < 10) {
        clearObsolete(operation, difficulty);

        num1 = Math.floor(Math.random() * 10) + 1;
        num2 = Math.floor(Math.random() * num1) + 1;

        if (operation === "addition") {
            correctAnswer = num1 + num2;
            document.getElementById('problem-story').textContent = `Patty has ${num1} bananas and Timmy has ${num2} apples. How many fruits are there in total?`;
        } else if (operation === "subtraction") {
            correctAnswer = num1 - num2;
            document.getElementById('problem-story').textContent = `Susie has ${num1} stickers but gives Dan ${num2} of them. How many does she have now?`;
        }
    }

    else { endGame(operation, difficulty); }
}

// Clears obsolete elements in the DOM
function clearObsolete (operation, difficulty) {
    document.getElementById('feedback').textContent = '';
    document.getElementById('answer').value = '';
    document.getElementById('result').textContent = '';
}

// Checks the user's answer and updates the score and problem count
function checkAnswer (operation, difficulty) {
    const userAnswer = parseInt(document.getElementById('answer').value);

    if (userAnswer === correctAnswer) {
        score++;
        problemCount++;
        document.getElementById('score').textContent = `Score: ${score}/10`;
        generateProblem(operation, difficulty);
    } 
    else { document.getElementById('feedback').textContent = 'Your answer is incorrect. Please try again.'; }
}

// Ends the game and displays the final score if the score is 10
function endGame (operation, difficulty){
    if (score == 10) {
        document.getElementById('problem-container').style.display = 'none';
        document.getElementById('score').textContent = `Final Score: ${score}/10`;
    }
}

// On page load, initialize variables and generate the first problem
window.onload = function () {
    const pathArray = window.location.pathname.split('_');
    const difficulty = pathArray[0].replace('/', '');
    const operation = pathArray[1]; 

    problemCount = 0;
    score = 0;
    generateProblem (operation, difficulty);
};