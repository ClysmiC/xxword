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
	
	ctx.fillStyle = "rgb(200, 0, 0)";
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

	var cellMargin = 3;
	var numMargins = gridDimension + 1;
	
	var cellDimension = (puzzleDimension - (cellMargin * numMargins)) / gridDimension;

	ctx.fillStyle = "rgb(0, 0, 0)";

	for(var i = 0; i < gridDimension; i++) {
		for(var j = 0; j < gridDimension; j++) {
			var x = puzzleX + cellMargin + j * (cellDimension + cellMargin);
			var y = puzzleY + cellMargin + i * (cellDimension + cellMargin);
			
			ctx.fillRect(x, y, cellDimension, cellDimension);
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
