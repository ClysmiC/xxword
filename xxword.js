function padNum(num, desiredLength) {
	var result = "";
	var numStr = num.toString();
	var zeroes = desiredLength - numStr.length;

	for(var i = 0; i < zeroes; i++) {
		result += "0";
	}

	result += numStr;
	return result;
}

function toggleOrientation(user) {
	if(user.orientation === "down") {
		user.orientation = "across";
	}
	else if(user.orientation === "across") {
		user.orientation = "down";
	}
}

function opposite(orientation) {
	if(orientation === "down") {
		return "across";
	}
	else if(orientation === "across") {
		return "down";
	}

	return null;
}

// Returns all the cells that get focused when the focus
// is on cell X, Y with orientation either "down" or "across".
// The cells returned are in order, from first letter of the word
// to the last letter
function getFocusedCells(puzzle, x, y, orientation) {
	var result = [];
	
	var cells = puzzle.cells;
	
	if(orientation !== "down" && orientation !== "across") {
		return [];
	}

	if(cells[y][x].solution === "#") {
		return [];
	}

	var deltaX = 0;
	var deltaY = 0;

	if(orientation === "down") {
		deltaY = 1;
	}
	else {
		deltaX = 1;
	}

	// Iterate backwards until at the first letter of the word
	while(x - deltaX >= 0 && y - deltaY >= 0 && cells[y - deltaY][x - deltaX].solution !== "#") {
		x -= deltaX;
		y -= deltaY;
	}

	// Iterate forwards and add each cell to our list
	while(x < puzzle.gridDimension && y < puzzle.gridDimension && cells[y][x].solution !== "#") {
		result.push(cells[y][x]);
		
		x += deltaX;
		y += deltaY;
	}

	return result;
}

function moveFocusRight(puzzle, user, wrap) {
	var cells = puzzle.cells;

	if(wrap === undefined) {
		wrap = false;
	}

	for(var i = user.focus.x + 1; wrap || i < puzzle.gridDimension; i++) {
		if(wrap && i == puzzle.gridDimension) {
			i = 0;
		}
		
		if(cells[user.focus.y][i].solution !== "#") {
			user.focus.x = i;
			return;
		}
	}
}

function moveFocusLeft(puzzle, user, wrap) {
	var cells = puzzle.cells;
	
	if(wrap === undefined) {
		wrap = false;
	}
	
	for(var i = user.focus.x - 1; wrap || i >= 0; i--) {
		if(wrap && i == -1) {
			i = puzzle.gridDimension - 1;
		}
		
		if(cells[user.focus.y][i].solution !== "#") {
			user.focus.x = i;
			return;
		}
	}
}

function moveFocusUp(puzzle, user, wrap) {
	var cells = puzzle.cells;
	
	if(wrap === undefined) {
		wrap = false;
	}
	
	for(var i = user.focus.y - 1; wrap || i >= 0; i--) {
		if(wrap && i == -1) {
			i = puzzle.gridDimension - 1;
		}
		
		if(cells[i][user.focus.x].solution !== "#") {
			user.focus.y = i;
			return;
		}
	}
}

function moveFocusDown(puzzle, user, wrap) {
	var cells = puzzle.cells;
	
	if(wrap === undefined) {
		wrap = false;
	}
	
	for(var i = user.focus.y + 1; wrap || i < puzzle.gridDimension; i++) {
		if(wrap && i == puzzle.gridDimension) {
			i = 0;
		}
		
		if(cells[i][user.focus.x].solution !== "#") {
			user.focus.y = i;
			return;
		}
	}
}

function moveFocusRightSoft(puzzle, user) {
	var cells = puzzle.cells;

	if(user.focus.x < puzzle.gridDimension - 1 && cells[user.focus.y][user.focus.x + 1].solution !== "#") {
		user.focus.x += 1;
	}
}

function moveFocusLeftSoft(puzzle, user) {
	var cells = puzzle.cells;
	
	if(user.focus.x > 0 && cells[user.focus.y][user.focus.x - 1].solution !== "#") {
		user.focus.x -= 1;
	}
}

function moveFocusUpSoft(puzzle, user) {
	var cells = puzzle.cells;
	
	if(user.focus.y > 0 && cells[user.focus.y - 1][user.focus.x].solution !== "#") {
		user.focus.y -= 1;
	}
}

function moveFocusDownSoft(puzzle, user) {
	var cells = puzzle.cells;

	if(user.focus.y < puzzle.gridDimension - 1 && cells[user.focus.y + 1][user.focus.x].solution !== "#") {
		user.focus.y += 1;
	}
}

function advanceFocus(puzzle, user) {
	if(user.orientation == "across") {
		moveFocusRight(puzzle, user);
	}
	else if(user.orientation == "down") {
		moveFocusDown(puzzle, user);
	}
}

function retreatFocus(puzzle, user) {
	if(user.orientation == "across") {
		moveFocusLeft(puzzle, user);
	}
	else if(user.orientation == "down") {
		moveFocusUp(puzzle, user);
	}
}

// Soft advance won't skip over blocks.
// Used, for example, when typing the last letter of a word and the user
// sets preferences to not skip over block into next word.
// Note: arrow key presses are never soft advances
function softAdvanceFocus(puzzle, user) {
	if(user.orientation == "across") {
		moveFocusRightSoft(puzzle, user);
	}
	else if(user.orientation == "down") {
		moveFocusDownSoft(puzzle, user);
	}
}

function softRetreatFocus(puzzle, user) {
	if(user.orientation == "across") {
		moveFocusLeftSoft(puzzle, user);
	}
	else if(user.orientation == "down") {
		moveFocusUpSoft(puzzle, user);
	}
}

function drawCellNumber(puzzle, cell) {
	if(cell.number !== -1) {
		puzzle.ctx.font = puzzle.numberFont;
		puzzle.ctx.fillStyle = "rgb(0, 0, 0)";
		puzzle.ctx.textAlign = "start";
		
		puzzle.ctx.fillText(cell.number, cell.canvasX + 2, cell.canvasY + puzzle.numberFontHeight + 2);
	}
}

function drawCellValue(puzzle, cell) {
	if(cell.value !== "" && cell.value !== " ") {
		puzzle.ctx.font = puzzle.valueFont;
		puzzle.ctx.fillStyle = "rgb(0, 0, 0)";
		puzzle.ctx.textAlign = "center";
		
		puzzle.ctx.fillText(cell.value, cell.canvasX + puzzle.cellDimension / 2, cell.canvasY + puzzle.cellDimension / 2 + puzzle.valueFontHeight / 2);
	}
}

// note: call this with color = "#FFFFFF" to "clear" highlights
function highlightCells(puzzle, cells, color) {
	for (var i = 0; i < cells.length; i++) {
		var cell = cells[i];
		
		puzzle.ctx.fillStyle = color;
		puzzle.ctx.fillRect(cell.canvasX, cell.canvasY, puzzle.cellDimension, puzzle.cellDimension);
		
		drawCellNumber(puzzle, cell);
		drawCellValue(puzzle, cell);
	}
}

function cellAtCanvasPos(puzzle, x, y) {
	var cells = puzzle.cells;

	var xIndex = Math.floor((x - (puzzle.x + puzzle.cellMargin / 2)) / (puzzle.cellDimension + puzzle.cellMargin));
	var yIndex = Math.floor((y - (puzzle.y + puzzle.cellMargin / 2)) / (puzzle.cellDimension + puzzle.cellMargin));

	if(xIndex >= 0 && xIndex < puzzle.gridDimension && yIndex >= 0 && yIndex < puzzle.gridDimension) {
		return cells[yIndex][xIndex];
	}

	return null;
}

function drawPuzzle(puzzle) {
	puzzle.ctx.fillStyle = "#000000";
	puzzle.ctx.fillRect(puzzle.x, puzzle.y, puzzle.dimension, puzzle.dimension);
	
	// Draw base puzzle
	for(var i = 0; i < puzzle.cells.length; i++) {
		for(var j = 0; j < puzzle.cells[0].length; j++) {
			var cell = puzzle.cells[i][j];
			
			if(cell.solution !== "#") {
				highlightCells(puzzle, [cell], "rgb(255, 255, 255)");
			}
		}
	}

	// Draw user highlights
	for(var i = 0; i < puzzle.users.length; i++) {
		var user = puzzle.users[i];
		var color = "hsl(" + user.color.h + ", " + user.color.s + "%, " + user.color.l + "%)";

		// note: color's l should be somewhere in the neighborhood of 50.
		// lighter colors have fixed l -- so make sure the base color doesn't
		// have a higher l than that
		var colorLighter = "hsl(" + user.color.h + ", " + user.color.s + "%, 75%";

		var focusedCells = getFocusedCells(puzzle, user.focus.x, user.focus.y, user.orientation);
		var perpendicularCells = getFocusedCells(puzzle, user.focus.x, user.focus.y, opposite(user.orientation));

		highlightCells(puzzle, perpendicularCells, "#DDDDDD");		
		highlightCells(puzzle, focusedCells, colorLighter);

		// highlight focused cell
		highlightCells(puzzle, [puzzle.cells[user.focus.y][user.focus.x]], color);
	}
}

function isCorrect(puzzle) {
	for(var i = 0; i < puzzle.cells.length; i++) {
		for(var j = 0; j < puzzle.cells[0].length; j++) {
			var cell = puzzle.cells[i][j];
			
			if(cell.solution !== "#" && cell.value !== cell.solution) {
				return false;
			}
		}
	}

	return true;
}

function initXWord(xmlString) {
	var puzzle = {
		solved: false,
	};
	
	var canvas = document.getElementById("xword");
	var iface = document.getElementById("interface");
	var ctx = canvas.getContext("2d");

	puzzle.ctx = ctx; // store copy here that we can use when we pass puzzle around to functions

	var canvasContainingWidth = .65 * (window.innerWidth);
	var canvasContainingHeight = .9 * (window.innerHeight);
	
	ctx.canvas.height = Math.min(
		canvasContainingWidth,
		canvasContainingHeight
	);
	ctx.canvas.width = ctx.canvas.height;

	canvas.style.left = ((canvasContainingWidth - ctx.canvas.width) / 2) + "px";
	
	canvas.style.top = ((canvasContainingHeight - ctx.canvas.height) / 2) + "px";

	var puzzlePadding = 75;
	puzzle.dimension = ctx.canvas.width - 2 * puzzlePadding;
	puzzle.x = puzzlePadding;
	puzzle.y = puzzlePadding;

	var ifaceLeft = canvasContainingWidth;
	var ifaceTop = 20;
	
	iface.style.left = ifaceLeft + "px";
	iface.style.top = ifaceTop + "px";
	
	iface.style.width = (window.innerWidth - ifaceLeft - 20) + "px";
	iface.style.height = (window.innerHeight - ifaceTop - 20) + "px";

	// black rect to fill puzzle area
	ctx.fillStyle = "rgb(0, 0, 0)";
	ctx.fillRect(puzzle.x, puzzle.y, puzzle.dimension, puzzle.dimension);

	// Set up xml parsing
	var parser = new DOMParser();
	var xml = parser.parseFromString(xmlString, "text/xml");

	var gridXml = xml.getElementsByTagName("grid")[0]
	var gridRows = parseInt(gridXml.getAttribute("height"));
	var gridCols = parseInt(gridXml.getAttribute("width"));
	
	if(gridRows !== gridCols) {
		alert("ERROR: Retrieved invalid crossword (rows not equal to columns)\nRows: " + gridRows + "\nCols: " + gridCols);
		return;
	}

	puzzle.gridDimension = gridRows;

	// cache xml element for each cell in 'cells'
	// cells is accessed via cells[row][column]
	puzzle.cells = new Array(puzzle.gridDimension);
	for(var i = 0; i < puzzle.cells.length; i++) {
		puzzle.cells[i] = new Array(puzzle.gridDimension);
	}

	for(var i = 0; i < puzzle.gridDimension; i++) {
		for(var j = 0; j < puzzle.gridDimension; j++) {
			// the xml iterates in column major order, but cells is in row major order,
			//which is why j and i may seem backwards in the math below
			var cellXml = gridXml.children[1 + j * puzzle.gridDimension + i];
			
			var solution;
			if(cellXml.hasAttribute("type") && cellXml.getAttribute("type") === "block") {
				solution = "#";
			}
			else {				
				solution = cellXml.getAttribute("solution");
			}

			var number;
			if(cellXml.hasAttribute("number")) {
				number = parseInt(cellXml.getAttribute("number"));
			}
			else {
				number = -1;
			}			
			
			puzzle.cells[i][j] = {
				row: i,
				column: j,
				solution: solution,
				number: number,
				value: "",   // user-entered value
			};
		}
	}

	// Calculate x and y positions of each cell
	puzzle.cellMargin = 3;
	var numMargins = puzzle.gridDimension + 1;
	
	puzzle.cellDimension = (puzzle.dimension - (puzzle.cellMargin * numMargins)) / puzzle.gridDimension;
	
	for(var i = 0; i < puzzle.cells.length; i++) {
		for(var j = 0; j < puzzle.cells[0].length; j++) {
			var cell = puzzle.cells[i][j];

			cell.canvasX = puzzle.x + puzzle.cellMargin + j * (puzzle.cellDimension + puzzle.cellMargin);
			cell.canvasY = puzzle.y + puzzle.cellMargin + i * (puzzle.cellDimension + puzzle.cellMargin);
		}
	}

	// Calculate font metrics
	puzzle.numberFontHeight = (puzzle.cellDimension / 4);
	puzzle.numberFont = puzzle.numberFontHeight + "px sans-serif";

	puzzle.valueFontHeight = (puzzle.cellDimension * .75);
	puzzle.valueFont = puzzle.valueFontHeight + "px sans-serif";

	// Set up initial user list
	puzzle.users = [
		{
			name: "Andrew", // TODO: customizable
			color: { h: 60, s: 100, l: 45 },
			focus: { x: 0, y: 0 },
			orientation: "across"
		},
	];

	// Parse and add across and down clues to html
	{		
		var cluesXml = xml.getElementsByTagName("clues");
		var acrossXml = cluesXml[0];
		var downXml = cluesXml[1];

		var acrossClues = acrossXml.getElementsByTagName("clue");
		var downClues = downXml.getElementsByTagName("clue");
		
		var acrossSelect = document.getElementById("acrossSelect");
		for(var i = 0; i < acrossClues.length; i++) {
			var clue = acrossClues[i];
			var number = clue.getAttribute("number");
			var text = clue.textContent;

			var o = document.createElement("option");
			o.text = number + ". " + text;
			
			acrossSelect.add(o);
		}

		var downSelect = document.getElementById("downSelect");
		for(var i = 0; i < downClues.length; i++) {
			var clue = downClues[i];
			var number = clue.getAttribute("number");
			var text = clue.textContent;

			var o = document.createElement("option");
			o.text = number + ". " + text;
			
			downSelect.add(o);
		}
	}

	// Add keyboard listeners for navigating with arrow keys
	document.body.addEventListener('keydown', function(e) {
		var user = puzzle.users[0];
		var redrawPuzzle = false;
		var valuesChanged = false;
		
		// TODO: setting option for wraparound or not
		// arrow left
		if(e.keyCode === 37) {
			moveFocusLeft(puzzle, user, true);
			redrawPuzzle = true;
		}
		// arrow up
		else if(e.keyCode === 38) {
			moveFocusUp(puzzle, user, true);
			redrawPuzzle = true;
		}
		// arrow right
		else if(e.keyCode === 39) {
			moveFocusRight(puzzle, user, true);
			redrawPuzzle = true;
		}
		// arrow down
		else if(e.keyCode === 40) {
			moveFocusDown(puzzle, user, true);
			redrawPuzzle = true;
		}

		
		// space bar
		else if(e.keyCode === 32) {
			toggleOrientation(user);
			redrawPuzzle = true;
		}

		else if (!puzzle.solved) {
			// a-z
			if(e.keyCode >= 65 && e.keyCode <= 90) {
				var letter = e.key.toUpperCase();
				
				if(letter.length !== 1) {
					alert("Letter length is not 1 for the entered letter: " + letter);
					return;
				}

				puzzle.cells[user.focus.y][user.focus.x].value = letter;

				// TODO: use setting on page to determine whether to soft- or hard-advance here
				softAdvanceFocus(puzzle, user);

				redrawPuzzle = true;
				valuesChanged = true;
			}

			// backspace
			else if(e.keyCode === 8) {
				puzzle.cells[user.focus.y][user.focus.x].value = "";

				// TODO: use setting on page to determine whether to soft- or hard-retreat here
				softRetreatFocus(puzzle, user);

				redrawPuzzle = true;
				valuesChanged = true;
			}

			// delete
			else if(e.keyCode === 46) {
				puzzle.cells[user.focus.y][user.focus.x].value = "";

				redrawPuzzle = true;
				valuesChanged = true;
			}
		}

		if(redrawPuzzle) {
			drawPuzzle(puzzle);
		}

		if(!puzzle.solved && valuesChanged) {
			if(isCorrect(puzzle)) {
				puzzle.solved = true;
				alert("You have completed the puzzle!");
			}
		}
	});

	canvas.addEventListener("mousedown", function(e) {
		var user = puzzle.users[0];
		
		var canvasX = e.offsetX;
		var canvasY = e.offsetY;

		var clickedCell = cellAtCanvasPos(puzzle, canvasX, canvasY);

		if(clickedCell !== null && clickedCell.solution !== "#") {
			// if already in focus, flip orientation
			if(clickedCell.row === user.focus.y && clickedCell.column === user.focus.x) {
				toggleOrientation(user);
			}
			else {
				user.focus.x = clickedCell.column;
				user.focus.y = clickedCell.row;
			}
		}

		drawPuzzle(puzzle);
	});

	
	drawPuzzle(puzzle);
}

var xwordBaseUrl = "http://cdn.games.arkadiumhosted.com/latimes/assets/DailyCrossword/";
var currentDate = new Date();
var currentYear = currentDate.getFullYear();
var currentMonth = currentDate.getMonth() + 1; // getMonth() returns 0-11, so add 1
var currentDay = currentDate.getDate();

// This will break beyond year 2100... but so will latimes' url format!
var xwordUrlSuffix = "la" + (currentYear - 2000) + padNum(currentMonth, 2) + padNum(currentDay, 2) + ".xml";

var xwordUrl = xwordBaseUrl + xwordUrlSuffix;

var xhttp = new XMLHttpRequest();
xhttp.onreadystatechange = function() {
	if (this.readyState == 4 && this.status == 200) {
		initXWord(this.responseText);
	}
}

xhttp.open("GET", xwordUrl);
xhttp.send();
