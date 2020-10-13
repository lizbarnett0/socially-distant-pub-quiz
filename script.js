////////////Variables//////////////

//Scoring, tracking, and other game-wide variables
let score = 0;
const hard = 20;
const medium = 10;
const easy = 5;
let questionIndex = 0;
let currentUsername = '';
let currentCategory = '';
const url = `https://opentdb.com/api.php?amount=1&type=multiple`;


//Document element selectors Welcome Area Section
const username = document.getElementById('username-input');
const letsPlayButton = document.getElementById('lets-play-button');
const welcomeArea = document.getElementById('welcome-area');
const categorySelectionArea = document.getElementById('category-section');
const instructionsButton = document.getElementById('openInstructionsModal');
const instructionsModal = document.getElementById('instructions-modal');
const closeLink = document.getElementById('close-modal');
const headerText = document.getElementById('header-text')


//Document element selectors Gameplay - Question Div
const gameplayArea = document.getElementById('gameplay-area');
const nextButton = document.getElementById('next-button');
const scoreDisplay = document.getElementById('current-score');
const questionNumDisplay = document.getElementById('question-number');
const difficultyDisplay = document.getElementById('difficulty-level');
const pointValueDisplay = document.getElementById('point-value');
const categoryDisplay = document.getElementById('category');
const questionTextDisplay = document.getElementById('question-text');

//Document element selectors Gameplay - Answers Div
const answersDisplayArea = document.getElementById('answer-area');
const answerMessage = document.getElementById('#answer-message');
const allAnswerButtons = document.querySelectorAll('.answer-button');
const answerButtonA = document.getElementById('answer-a');
const answerButtonB = document.getElementById('answer-b');
const answerButtonC = document.getElementById('answer-c');
const answerButtonD = document.getElementById('answer-d');

//Document element selectors game-over
const gameOverDisplayArea = document.getElementById('game-over');
const newGameButton = document.getElementById('new-game-button');
const finalScore = document.getElementById('final-score');
const gameOverMessage = document.getElementById('game-over-message');

//////////Initial Game State///////////////
nextButton.style.display = 'none';
answersDisplayArea.style.display = 'none'
gameplayArea.style.display = 'none';
gameOverDisplayArea.style.display = 'none';
newGameButton.style.display = 'none';
categorySelectionArea.style.display = 'none';
headerText.style.display = 'none'

////////////Event Handlers//////////////

instructionsButton.addEventListener('click', openModal);
closeLink.addEventListener('click', closeModal)

//Event handler for the Let's Play button that is click after entering a name.  It stores the username, then triggers the begining of the game.
letsPlayButton.addEventListener('click', (event) => {
	event.preventDefault();
	currentUsername = username.value;
	if (currentUsername === '' || currentUsername === username.placeholder) {
		return alert('You must enter a username to continue!');
	} else {
		//gameplayArea.style.display = 'block';
		//answersDisplayArea.style.display = 'block';
		//gameStart();
		welcomeArea.style.display = 'none';

		categorySelectionArea.style.display = 'block';

	}
});

//Event handler for selecting the category
categorySelectionArea.addEventListener('click', (event) => {
	event.preventDefault();
	if (event.target.tagName === 'BUTTON') {
		if (event.target.dataset.name === 'random') {
			currentCategory = '';
		} else {
			currentCategory = `&category=${event.target.dataset.name}`;
		}
		gameStart();
	}
});

//Event handler for 'Next' Button - will go to the next question
nextButton.addEventListener('click', (event) => {
	event.preventDefault();
	answersDisplayArea.setAttribute('data-correct', '');
	answerButtonA.disabled = false;
	answerButtonA.style.backgroundColor = 'lightGray';
	answerButtonB.disabled = false;
	answerButtonB.style.backgroundColor = 'lightGray';
	answerButtonC.disabled = false;
	answerButtonC.style.backgroundColor = 'lightGray';
	answerButtonD.disabled = false;
	answerButtonD.style.backgroundColor = 'lightGray';
	answerMessage.innerText = '';

	questionIndex++;
	if (questionIndex < 10) {
		askQuestionAPI();
	} else {
		gameOverDisplayArea.style.display = 'inline';
		gameOver();
	}
});

//Event handler for selecting answer button click
answersDisplayArea.addEventListener('click', (event) => {
	event.preventDefault();
	if (event.target.tagName === 'BUTTON') {
		gradeAnswerAPI(event);
		answerButtonA.disabled = true;
		answerButtonB.disabled = true;
		answerButtonC.disabled = true;
		answerButtonD.disabled = true;
	}
});

newGameButton.addEventListener('click',(event) => {
	questionIndex = 0;
	score = 0;
	currentCategory = '';
	gameOverDisplayArea.style.display = 'none';
	//gameplayArea.style.display = 'block';
	//answersDisplayArea.style.display = 'block';
	//gameStart();
	categorySelectionArea.style.display = 'block';
})


////////////Functions//////////////
function openModal() {
	instructionsModal.style.display = 'block';
}

function closeModal() {
	instructionsModal.style.display = 'none';
}

//Begins the gameplay by setting current user name to the input value, resets the score, clears the welcome/instructions screen, and triggers the first question
function gameStart() {
	questionIndex = 0;
	score = 0;
	categorySelectionArea.style.display = 'none';
	gameplayArea.style.display = 'block';
	answersDisplayArea.style.display = 'block';
	askQuestionAPI();
}


//Triggers the Game Over Screen once 10 questions have been asked
function gameOver() {
	gameplayArea.style.display = 'none';
	gameOverDisplayArea.style.display = 'block'
	newGameButton.style.display = 'block';

	finalScore.innerText = `${currentUsername}'s Final Score is ${score}`;
	if (score < 30) {
		gameOverMessage.innerText = 'That wasn\'t a great round...keep working at it.'
	} else if (score < 70) {
		gameOverMessage.innerText = 'Pretty good work, keep it up!';
	} else {
		gameOverMessage.innerText = 'Look at the big brain on you! \nGenius Level. \nGreat job!';
	}
}


//Function to Decode HTML in from Trivia Database - Source for this code: gomakethings.com/decoding-html-entities-with-vanilla-javascript/

const decodeHTML = function (html) {
	const txt = document.createElement('textarea');
	txt.innerHTML = html;
	return txt.value;
};

//////////////API Integration/////////////

//API Variables


//API Functions
function askQuestionAPI() {
	nextButton.style.display = 'none';
	questionNumDisplay.innerText = `Question ${questionIndex + 1}`;
	scoreDisplay.innerHTML = `${currentUsername}'s Score: ${score}`;

	if (questionIndex < 5) {
		fetch(`${url}&difficulty=easy${currentCategory}`)
			.then((res) => res.json())
			.then((resJson) => {
				difficultyDisplay.innerText = `Difficulty: ${resJson.results[0].difficulty.toUpperCase()}`;
				categoryDisplay.innerText = `${resJson.results[0].category}`;
				questionTextDisplay.innerText = decodeHTML(resJson.results[0].question);
				answersDisplayArea.setAttribute('data-correct', resJson.results[0].correct_answer);
				console.log(answersDisplayArea)
				answerAssignmentAPI(resJson);
			});
	} else if (questionIndex < 8) {
		fetch(`${url}&difficulty=medium${currentCategory}`)
			.then((res) => res.json())
			.then((resJson) => {
				difficultyDisplay.innerText = `Difficulty: ${resJson.results[0].difficulty.toUpperCase()}`;
				categoryDisplay.innerText = `${resJson.results[0].category}`;
				questionTextDisplay.innerText = decodeHTML(resJson.results[0].question);
				answerAssignmentAPI(resJson);
				console.log(resJson);
			});
	} else {
		fetch(`${url}&difficulty=hard${currentCategory}`)
			.then((res) => res.json())
			.then((resJson) => {
				difficultyDisplay.innerText = `Difficulty: ${resJson.results[0].difficulty.toUpperCase()}`;
				categoryDisplay.innerText = `${resJson.results[0].category}`;
				questionTextDisplay.innerText = decodeHTML(resJson.results[0].question);
				answerAssignmentAPI(resJson);
			});
	}
	
}

//Assign answers from API question
function answerAssignmentAPI(resJson) {
	let answersArrIndex = [0, 1, 2, 3];
	let arrStartIndex1;
	let arrStartIndex2;
	let arrStartIndex3;
	let tempIndex;
	answersDisplayArea.setAttribute('data-correct',resJson.results[0].correct_answer);
	answerButtonA.setAttribute('data-answer','')
	answerButtonB.setAttribute('data-answer', '');
	answerButtonC.setAttribute('data-answer','')
	answerButtonD.setAttribute('data-answer', '');

	arrStartIndex1 = Math.floor(Math.random() * answersArrIndex.length);
	tempIndex = answersArrIndex[arrStartIndex1];
	

	if (tempIndex === 3) {
		answerButtonA.innerText = decodeHTML(resJson.results[0].correct_answer);
		answerButtonA.setAttribute('data-answer','correct')
	} else {
		answerButtonA.innerText = decodeHTML(resJson.results[0].incorrect_answers[tempIndex]);
		answerButtonA.setAttribute('data-answer', 'incorrect');
	}
	answersArrIndex.splice(arrStartIndex1, 1);

	arrStartIndex2 = Math.floor(Math.random() * answersArrIndex.length);
	tempIndex = answersArrIndex[arrStartIndex2];
	
	if (tempIndex === 3) {
		answerButtonB.innerText = decodeHTML(resJson.results[0].correct_answer);
		answerButtonB.setAttribute('data-answer', 'correct');
	} else {
		answerButtonB.innerText = decodeHTML(resJson.results[0].incorrect_answers[tempIndex]);
		answerButtonB.setAttribute('data-answer', 'incorrect');
	}
	answersArrIndex.splice(arrStartIndex2, 1);

	arrStartIndex3 = Math.floor(Math.random() * answersArrIndex.length);
	tempIndex = answersArrIndex[arrStartIndex3];
	if (tempIndex === 3) {
		answerButtonC.innerText = decodeHTML(resJson.results[0].correct_answer);
		answerButtonC.setAttribute('data-answer', 'correct');
	} else {
		answerButtonC.innerText = decodeHTML(resJson.results[0].incorrect_answers[tempIndex]);
		answerButtonC.setAttribute('data-answer', 'incorrect');
	}
	answersArrIndex.splice(arrStartIndex3, 1);

	tempIndex = answersArrIndex[0];
	if (tempIndex === 3) {
		answerButtonD.innerText = decodeHTML(resJson.results[0].correct_answer);
		answerButtonD.setAttribute('data-answer', 'correct');
	} else {
		answerButtonD.innerText = decodeHTML(resJson.results[0].incorrect_answers[tempIndex]);
	}
}


//Grades the answer based on the button selected
function gradeAnswerAPI(event) {
	allAnswerButtons.disabled = true;
	if (event.target.dataset.answer === 'correct') {
		answerMessage.innerText = 'Wow, you are so smart! 🧠 ';
		event.target.style.backgroundColor = 'DarkSeaGreen';
		if (difficultyDisplay.innerText === 'Difficulty: HARD') {
			score += 20;
		} else if (difficultyDisplay.innerText === 'Difficulty: MEDIUM') {
			score += 10;
		} else if (difficultyDisplay.innerText === 'Difficulty: EASY') {
			score += 5;
		} else {
			score += 0;
		}
	} else {
		event.target.style.backgroundColor = 'PaleVioletRed';
		answerMessage.innerText = `NOPE!  The correct answer is: ${answersDisplayArea.dataset.correct} \nYou should really study some more! 📚 `
	}
	scoreDisplay.innerHTML = `${currentUsername}'s Score: ${score}`;
	nextButton.style.display = 'inline';
}
