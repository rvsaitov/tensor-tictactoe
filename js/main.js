'use strict'

class Game {
	constructor() {
		this.countGame = 0;
		this.playerWins = localStorage.getItem('playerWins') || 0;
		this.computerWins = localStorage.getItem('computerWins') || 0;
		this.cells = Array.from(document.querySelectorAll('.cell'));
		
		this.playerTurn = this.playerTurn.bind(this);
		
		document.querySelector('.continue-button').addEventListener('click', this.start.bind(this));
		document.querySelector('.scoreboard__reset').addEventListener('click', this.clearStat.bind(this));
	}

	/**
	 * Запускает игру заново
	 */
	start() {
		this.updateStat();
		this.clearBoard();
		this.bindCells();
		if (this.countGame % 2 !== 0) {
			this.computerTurn();
		}
		this.countGame++;
		
		document.querySelector('.continue-button').disabled = true;
	}
	
	/**
	 * Подписывает все ячейки на клики
	 */
	bindCells() {
		this.unbindCells();
		this.cells.forEach((cell) => {
			cell.addEventListener('click', this.playerTurn);
		});
	}
	
	/**
	 * Отписывает все ячейки от кликов
	 */
	unbindCells() {
		this.cells.forEach((cell) => {
			cell.removeEventListener('click', this.playerTurn);
		});
	}
	
	/**
	 * Обрабатывает клик по ячейке
	 * Проверяет на выигрыш, если false, вызывается ход компьютера
	 */
	playerTurn(event) {
		event.target.innerText = 'X';
		event.target.removeEventListener('click', this.playerTurn);
		
		if (!this.checkWinner()) {
			this.computerTurn();
		} else {
			this.playerWins++;
			localStorage.setItem('playerWins', this.playerWins);
			this.endGame();
		}
	}
	
	/**
	 * Ход компьютера
	 */
	computerTurn() {
		let availableCells = this.cells.filter((cell) => cell.innerText === '');
		if (availableCells.length) {
			const target = Math.floor(Math.random() * (availableCells.length));
			availableCells[target].innerText = 'O';
			availableCells[target].removeEventListener('click', this.playerTurn);
			

			if (this.checkWinner()) {
				this.computerWins++;
				localStorage.setItem('computerWins', this.computerWins);
				this.endGame();
			}
		} else {
			this.endGame();
		}
	}
	
	/**
	 * Проверяет всё поле на наличие выигрышных комбинаций
	 * Если найдёт, закрашивает их цветом
	 * return {Boolean} Признак выигрыша
	 */
	checkWinner() {
		const winningCombinations = [
			[0, 1, 2],
			[3, 4, 5],
			[6, 7, 8],
			[0, 4, 8],
			[2, 4, 6],
			[0, 3, 6],
			[1, 4, 7],
			[2, 5, 8]
		];

		for (let winningCombo of winningCombinations) {
			const pos0InnerText = this.cells[winningCombo[0]].innerText;
			const pos1InnerText = this.cells[winningCombo[1]].innerText;
			const pos2InnerText = this.cells[winningCombo[2]].innerText;
			const isWinningCombo = pos0InnerText && pos0InnerText === pos1InnerText && pos1InnerText === pos2InnerText;
			if (isWinningCombo) {
				winningCombo.forEach((index) => {
					this.cells[index].className += ' winner';
				})
				return true;
			}
		}

		return false;
	}
	
	/**
	 * Обновляет данные в полях статистики
	 */
	updateStat() {
		document.querySelector('.score__value_player').innerHTML = localStorage.getItem('playerWins') || 0;
		document.querySelector('.score__value_comp').innerHTML = localStorage.getItem('computerWins') || 0;
	}
	
	/**
	 * Сбрасывает статистика
	 */
	clearStat() {
		this.playerWins = 0;
		this.computerWins = 0;
		localStorage.setItem('playerWins', 0);
		localStorage.setItem('computerWins', 0);
		this.updateStat();
	}
	
	/**
	 * Очищает ячейки от символов и класса 'winner'
	 */
	clearBoard() {
		this.cells.forEach((cell) => {
			cell.innerHTML = '';
			cell.classList.remove('winner');
		});
	}
	
	/**
	 * Отписывает от кликов, обновляет статистику после окончания игры
	 */
	endGame() {
		this.unbindCells();
		this.updateStat();
		document.querySelector('.continue-button').disabled = false;
	}
}

function init() {
	const game = new Game();
	game.start();
}

init();