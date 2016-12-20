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

function initXWord(xmlString) {
	var canvas = document.getElementById("xword");
	var ctx = canvas.getContext("2d");

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
		alert("Retrieved invalid crossword (rows not equal to columns)\nRows: " + gridRows + "\nCols: " + gridCols);
		return;
	}

	var gridDimension = gridRows;

	// cache xml element for each cell in 'cells'
	// cells is accessed via cells[row][column]
	var cells = new Array(gridDimension);
	for(var i = 0; i < cells.length; i++) {
		cells[i] = new Array(gridDimension);
	}

	for(var i = 0; i < gridDimension; i++) {
		for(var j = 0; j < gridDimension; j++) {
			// the xml iterates in column major order, but cells is in row major order,
			//which is why j and i may seem backwards in the math below
			var cellXml = gridXml.children[1 + j * gridDimension + i];
			
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
			
			cells[i][j] = {
				row: i,
				column: j,
				solution: solution,
				number: number,
			};
		}
	}

	// Draw cells
	var cellMargin = 3;
	var numMargins = gridDimension + 1;
	
	var cellDimension = (puzzleDimension - (cellMargin * numMargins)) / gridDimension;
	
	var fontHeight = (cellDimension / 3.5);
	ctx.font = fontHeight + "px sans-serif";

	for(var i = 0; i < cells.length; i++) {
		for(var j = 0; j < cells[0].length; j++) {
			var cell = cells[i][j];

			cell.canvasX = puzzleX + cellMargin + j * (cellDimension + cellMargin);
			cell.canvasY = puzzleY + cellMargin + i * (cellDimension + cellMargin);

			if(cell.solution !== "#") {
				ctx.fillStyle = "rgb(255, 255, 255)";
				ctx.fillRect(cell.canvasX, cell.canvasY, cellDimension, cellDimension);

				if(cell.number !== -1) {
					ctx.fillStyle = "rgb(0, 0, 0)";
					ctx.fillText(cell.number, cell.canvasX + 2, cell.canvasY + fontHeight + 2);
				}
			}
		}
	}
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
