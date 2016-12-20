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

function drawCellNumber(puzzle, cell) {
	if(cell.number !== -1) {
		puzzle.ctx.font = puzzle.numberFont;
		puzzle.ctx.fillStyle = "rgb(0, 0, 0)";
		puzzle.ctx.textAlign = "start";
		
		puzzle.ctx.fillText(cell.number, cell.canvasX + 2, cell.canvasY + puzzle.numberFontHeight + 2);
	}
}

function drawCellValue(puzzle, cell) {
	if(cell.value !== "") {
		puzzle.ctx.font = puzzle.valueFont;
		puzzle.ctx.fillStyle = "rgb(0, 0, 0)";
		puzzle.ctx.textAlign = "center";
		
		puzzle.ctx.fillText(cell.value, cell.canvasX + puzzle.cellDimension / 2, cell.canvasY + puzzle.cellDimension / 2 + puzzle.valueFontHeight / 2);
	}
}

// note: call this with color = "rgb(255, 255, 255)" to "clear" highlights
function highlightCells(puzzle, cells, color) {
	for (var i = 0; i < cells.length; i++) {
		var cell = cells[i];
		
		puzzle.ctx.fillStyle = color;
		puzzle.ctx.fillRect(cell.canvasX, cell.canvasY, puzzle.cellDimension, puzzle.cellDimension);
		
		drawCellNumber(puzzle, cell);
		drawCellValue(puzzle, cell);
	}
}

function initXWord(xmlString) {
	var puzzle = {};
	var canvas = document.getElementById("xword");
	var ctx = canvas.getContext("2d");

	puzzle.ctx = ctx; // store copy here that we can use when we pass puzzle around to functions

	// Set up canvas position / size
	var canvasPadding = 100;
	canvas.style.left = canvasPadding / 2 + "px";
	canvas.style.top = canvasPadding / 2 + "px";
	ctx.canvas.width = window.innerWidth - canvasPadding;
	ctx.canvas.height = window.innerHeight - canvasPadding;

	var puzzlePadding = 100;
	var puzzleDimension = Math.min(ctx.canvas.width, ctx.canvas.height) - puzzlePadding
	var puzzleX = puzzlePadding / 2;
	var puzzleY = puzzlePadding / 2;
	
	ctx.fillStyle = "rgb(0, 0, 0)";
	ctx.fillRect(puzzleX, puzzleY, puzzleDimension, puzzleDimension);

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
				value: solution, //"",   // user-entered value
			};
		}
	}

	// Draw cells
	var cellMargin = 3;
	var numMargins = puzzle.gridDimension + 1;
	
	puzzle.cellDimension = (puzzleDimension - (cellMargin * numMargins)) / puzzle.gridDimension;
	
	puzzle.numberFontHeight = (puzzle.cellDimension / 4);
	puzzle.numberFont = puzzle.numberFontHeight + "px sans-serif";

	puzzle.valueFontHeight = (puzzle.cellDimension * .75);
	puzzle.valueFont = puzzle.valueFontHeight + "px sans-serif";
	
	for(var i = 0; i < puzzle.cells.length; i++) {
		for(var j = 0; j < puzzle.cells[0].length; j++) {
			var cell = puzzle.cells[i][j];

			cell.canvasX = puzzleX + cellMargin + j * (puzzle.cellDimension + cellMargin);
			cell.canvasY = puzzleY + cellMargin + i * (puzzle.cellDimension + cellMargin);

			if(cell.solution !== "#") {
				highlightCells(puzzle, [cell], "rgb(255, 255, 255)");
			}
		}
	}

	highlightCells(puzzle, getFocusedCells(puzzle, 7, 0, "across"), "rgb(255, 255, 127)");
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
