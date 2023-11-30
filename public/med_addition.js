let num1, num2, correctAnswer, problemCount, score;
let currentProblem = 0;
let problemNumbers = [];
let userAnswers = [];
let wrongAnswers = [];

async function getMedNumber() {
    console.log("Request Sent")
    const response = await fetch("http://localhost:2000/medium")
    const number = await response.text()
    console.log(number)
    return parseInt(number)
}

async function generateProblem() {
    if (problemCount < 10) {
        if (problemNumbers[currentProblem]) {
            num1 = problemNumbers[currentProblem][0];
            num2 = problemNumbers[currentProblem][1];
        } 
        else {
            num1 = await getMedNumber();
            num2 = await getMedNumber();
            problemNumbers[currentProblem] = [num1, num2];
        }
        
        correctAnswer = num1 + num2;

        document.getElementById('problem').textContent = `${num1} + ${num2} = ?`;
        document.getElementById('answer').value = userAnswers[currentProblem] || '';
        document.getElementById('result').textContent = '';

        document.getElementById('previous-button').style.display = currentProblem > 0 ? 'inline' : 'none';
        document.getElementById('answer').disabled = false;
    } 
    else {
        endGame();
    }
}

async function checkAnswer() {
    if (problemCount < 10) {
        const userAnswer = parseInt(document.getElementById('answer').value);

        userAnswers[currentProblem] = userAnswer; 

        if (userAnswer === correctAnswer) {
            score++;
        } 
        else {
            wrongAnswers.push(`${num1} + ${num2} = ${userAnswer} (Correct Answer: ${correctAnswer})`);
        }

        problemCount++;
        currentProblem++;
        document.getElementById('result').textContent = userAnswer === correctAnswer ? 'Correct!' : 'Incorrect';

        if (problemCount < 10) {
            generateProblem();
        } 
        else {
            endGame();
        }
    }
}

async function previousProblem() {
    if (currentProblem > 0) {
        currentProblem--;
        problemCount--;
        generateProblem();
    }
}

async function endGame() {
    let finalScore = 0;
    for (let i = 0; i < userAnswers.length; i++) {
        if (userAnswers[i] === problemNumbers[i][0] + problemNumbers[i][1]) {
            finalScore++;
        }
    }

    document.getElementById('problem-container').style.display = 'none';
    document.getElementById('navigation-container').style.display = 'none';
    document.getElementById('previous-button').style.display = 'none';
    document.getElementById('next-button').style.display = 'none';

    document.getElementById('result').style.display = 'block';
    document.getElementById('result').textContent = `Final Score: ${finalScore}/10`;
    document.getElementById('answer').disabled = true;


    if (wrongAnswers.length > 0) {
        const wrongProblemsContainer = document.createElement('div');
        wrongProblemsContainer.id = 'wrong-problems-container'; 
      
        const wrongProblemsHeading = document.createElement('h3');
        wrongProblemsHeading.textContent = 'Problems you got wrong:';
        wrongProblemsContainer.appendChild(wrongProblemsHeading);

       const wrongProblemsList = document.createElement('p');
        wrongProblemsContainer.appendChild(wrongProblemsList);
      
        for (let i = 0; i < wrongAnswers.length; i++) {
          const wrongProblem = document.createElement('p');
          wrongProblem.textContent = wrongAnswers[i];
          wrongProblemsContainer.appendChild(wrongProblem);
        }
      
        document.body.appendChild(wrongProblemsContainer);
    }

    document.getElementById('result').textContent = `Final Score: ${score}/10`;
}

window.onload = async function () {
    problemCount = 0;
    score = 0;
    generateProblem();
};