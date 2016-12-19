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

function initXWord(xml) {
	var canvas = document.getElementById("xword");
	var ctx = canvas.getContext("2d");

	var canvasPadding = 100;
	canvas.style.left = canvasPadding / 2 + "px";
	canvas.style.top = canvasPadding / 2 + "px";
	ctx.canvas.width = window.innerWidth - canvasPadding;
	ctx.canvas.height = window.innerHeight - canvasPadding;

	var puzzlePadding = 100;
	var puzzleDimension = Math.min(ctx.canvas.width, ctx.canvas.height) - puzzlePadding
		
	ctx.fillStyle = "rgb(200, 0, 0)";
	ctx.fillRect(puzzlePadding / 2, puzzlePadding / 2, puzzleDimension, puzzleDimension);
	
	// TODO: google DOPMarser
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
