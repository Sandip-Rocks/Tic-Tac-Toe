var origBoard;
const huPlayer = 'O';
const aiPlayer = 'X';
var hu=0,ai=0,tie=0;
const winCombos = [
	[0, 1, 2],
	[3, 4, 5],
	[6, 7, 8],
	[0, 3, 6],
	[1, 4, 7],
	[2, 5, 8],
	[0, 4, 8],
	[6, 4, 2]
]

const cells = document.querySelectorAll('.cell');
startGame();
function startGame() {
	document.querySelector(".endgame").style.display = "none";
	origBoard = Array.from(Array(9).keys());	//Initialize Board array with 0-8 number 
	game_start();
	console.log(cells);
	for (var i = 0; i < cells.length; i++) {
		cells[i].innerText = '';
		cells[i].style.removeProperty('background-color');	//Remove Background Color after Game over
		cells[i].addEventListener('click', turnClick, false);
	}
	document.querySelector(".score_cal").style.display = "none";	//Hide Score Board
}

function turnClick(square) {
	if (typeof origBoard[square.target.id] == 'number') {
		turn(square.target.id, huPlayer)	//Turn of Human Player
		if (!checkWin(origBoard, huPlayer) && !checkTie()) turn(bestSpot(), aiPlayer);	//Turn of Computer
	}
}

function turn(squareId, player) {
	origBoard[squareId] = player;
	play_audio();
	document.getElementById(squareId).innerText = player;
	let gameWon = checkWin(origBoard, player)
	if (gameWon) gameOver(gameWon)	// If game is Won call the Gameover function with gamewon as argument
}

function checkWin(board, player) {
	let plays = board.reduce((a, e, i) =>
		(e === player) ? a.concat(i) : a, []);
	let gameWon = null;
	for (let [index, win] of winCombos.entries()) {
		if (win.every(elem => plays.indexOf(elem) > -1)) {
			gameWon = {index: index, player: player};
			break;
		}
	}
	return gameWon;
}

function gameOver(gameWon) {
	for (let index of winCombos[gameWon.index]) {	//Highlight the Winning Indexes
		document.getElementById(index).style.backgroundColor =
			gameWon.player == huPlayer ? "blue" : "red";
	}
	for (var i = 0; i < cells.length; i++) {	// Remove the Event Listener
		cells[i].removeEventListener('click', turnClick, false);
	}
	declareWinner(gameWon.player == huPlayer ? "You win!" : "You lose."); 	//Declare Winner
}

function declareWinner(who) {
	document.querySelector(".endgame").style.display = "block";		//Display the Winner without Text
	if(who==="You win!")	// Increment the counter of Winner
	{
	hu++;
	play_win();
	}
	else if(who=="You lose.")
	{
	ai++;
	play_win();
	}
	else 
	{
	tie++;
	game_tie();
	}
	document.getElementById("computer-score").innerText = ai;
	document.getElementById("human-score").innerText = hu;
	document.getElementById("tie-score").innerText = tie;
	if(document.querySelector(".endgame").style.display){
		document.querySelector(".score_cal").style.display = "block"; 	//Display Score Board
	}
	document.querySelector(".endgame .text").innerText = who;	//Display the Winnner with Text
	
}

function emptySquares() {
	return origBoard.filter(s => typeof s == 'number');		//Find the Empty squares
}

function bestSpot() {
	return minimax(origBoard, aiPlayer).index;		//Returns the an Object with index as property
}

function checkTie() {
	if (emptySquares().length == 0) {	//Check if there is any empty square left or not
		for (var i = 0; i < cells.length; i++) {
			cells[i].style.backgroundColor = "green";	//If game is Tie then fill the background with green
			cells[i].removeEventListener('click', turnClick, false);	//Remove the Event Listener
		}
		declareWinner("Tie Game!")
		return true;
	}
	return false;
}

function minimax(newBoard, player) {
	var availSpots = emptySquares();

	if (checkWin(newBoard, huPlayer)) {	//Check for terminal State
		return {score: -10};
	} else if (checkWin(newBoard, aiPlayer)) {
		return {score: 10};
	} else if (availSpots.length === 0) {
		return {score: 0};
	}
	var moves = [];
	//console.log("Available Sports Length :"+availSpots.length);
	for (var i = 0; i < availSpots.length; i++) {
		var move = {};
		move.index = newBoard[availSpots[i]];
		newBoard[availSpots[i]] = player;

		if (player == aiPlayer) {
			var result = minimax(newBoard, huPlayer);
			move.score = result.score;
		} else {
			var result = minimax(newBoard, aiPlayer);
			move.score = result.score;
		}

		newBoard[availSpots[i]] = move.index;

		moves.push(move);
	}

	var bestMove;
	if(player === aiPlayer) {
		var bestScore = -10000;
		for(var i = 0; i < moves.length; i++) {
			if (moves[i].score > bestScore) {
				bestScore = moves[i].score;
				bestMove = i;
			}
		}
	} else {
		var bestScore = 10000;
		for(var i = 0; i < moves.length; i++) {
			if (moves[i].score < bestScore) {
				bestScore = moves[i].score;
				bestMove = i;
			}
		}
	}

	return moves[bestMove];
}
function play_audio(){

	let audio=new Audio('click.mp3');
	audio.play();
	}
	function play_win(){
	
		let audio=new Audio('Tada-sound.mp3');
		audio.play();
		}
		function game_start(){
	
			let audio=new Audio('start.mp3');
			audio.play();
			}
			function game_tie(){
	
				let audio=new Audio('tie.mp3');
				audio.play();
				}