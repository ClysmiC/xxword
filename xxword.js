// TODO: build DOM differently if mobile...
// make xword take up entire screen
// and just give the clue at the top when a cell
// is selected
window.mobileAndTabletcheck = function() {
  var check = false;
  (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
  return check;
};

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
