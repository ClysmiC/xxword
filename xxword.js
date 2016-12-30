
var secondaryFocusColor = "#CCCCCC"
var hintedBoxColor = "#FFC3C3"

var userColors = [
	"#FFDC00",  // yellow
	"#0074D9",  // blue
	"#2ECC40",  // green
	"#FF851B",  // orange
	"#F012BE",  // fuchsia
	"#795548",  // brown
	"#7FDBFF",  // aqua
	"#B10DC9",  // purple
];

// TODO: build DOM differently if mobile...
// make xword take up entire screen
// and just give the clue at the top when a cell
// is selected
window.mobileAndTabletcheck = function() {
	var check = false;
	(function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
	return check;
};


//////////////////////////////////////////////////
////////// COLOR CONVERSION
////////// https://gist.github.com/mjackson/5311256
//////////////////////////////////////////////////

function hslToRgb(h, s, l) {
	var r, g, b;

	if (s == 0) {
		r = g = b = l; // achromatic
	} else {
		function hue2rgb(p, q, t) {
			if (t < 0) t += 1;
			if (t > 1) t -= 1;
			if (t < 1/6) return p + (q - p) * 6 * t;
			if (t < 1/2) return q;
			if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
			return p;
		}

		var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
		var p = 2 * l - q;

		r = hue2rgb(p, q, h + 1/3);
		g = hue2rgb(p, q, h);
		b = hue2rgb(p, q, h - 1/3);
	}

	return [ r * 255, g * 255, b * 255 ];
}

function rgbToHsl(r, g, b) {
  r /= 255, g /= 255, b /= 255;

  var max = Math.max(r, g, b), min = Math.min(r, g, b);
  var h, s, l = (max + min) / 2;

  if (max == min) {
    h = s = 0; // achromatic
  } else {
    var d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }

    h /= 6;
  }

  return [ h, s, l ];
}

function rgbStringToHsl(rgbString) {
	var r = parseInt(rgbString.slice(1, 3), 16);
	var g = parseInt(rgbString.slice(3, 5), 16);
	var b = parseInt(rgbString.slice(5, 7), 16);

	return rgbToHsl(r, g, b);
}


function rgbToLighterHslString(rgbString) {
	var colorHSL = rgbStringToHsl(rgbString);
	var colorLighter = "hsl(" + (colorHSL[0] * 360) + ", " + (colorHSL[1] * 100) + "%, " + (colorHSL[2] + 1) * 100 / 2 + "%";
	return colorLighter;
}

//////////////////////////////////////////////////
////////// END COLOR CONVERSION
//////////////////////////////////////////////////


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
		if(wrap && i === puzzle.gridDimension) {
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
		if(wrap && i === -1) {
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
		if(wrap && i === -1) {
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
		if(wrap && i === puzzle.gridDimension) {
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
	if(user.orientation === "across") {
		moveFocusRight(puzzle, user);
	}
	else if(user.orientation === "down") {
		moveFocusDown(puzzle, user);
	}
}

function retreatFocus(puzzle, user) {
	if(user.orientation === "across") {
		moveFocusLeft(puzzle, user);
	}
	else if(user.orientation === "down") {
		moveFocusUp(puzzle, user);
	}
}

function cellToNumber(puzzle, x, y, orientation) {
	var cells = puzzle.cells;

	if(x == -1 || y == -1) {
		return -1;
	}
	
	if(orientation !== "down" && orientation !== "across") {
		return -1;
	}

	if(cells[y][x].solution === "#") {
		return -1;
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

	return cells[y][x].number;
}

// Soft advance won't skip over blocks.
// Used, for example, when typing the last letter of a word and the user
// sets preferences to not skip over block into next word.
// Note: arrow key presses are never soft advances
function softAdvanceFocus(puzzle, user) {
	if(user.orientation === "across") {
		moveFocusRightSoft(puzzle, user);
	}
	else if(user.orientation === "down") {
		moveFocusDownSoft(puzzle, user);
	}
}

function softRetreatFocus(puzzle, user) {
	if(user.orientation === "across") {
		moveFocusLeftSoft(puzzle, user);
	}
	else if(user.orientation === "down") {
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

		if(puzzle.hintsOn && cell.value !== cell.solution) {
			puzzle.ctx.fillStyle = "#FF0000";
			cell.hinted = true;
		}
		else {
			puzzle.ctx.fillStyle = "#000000";
		}
		
		puzzle.ctx.textAlign = "center";
		puzzle.ctx.fillText(cell.value, cell.canvasX + puzzle.cellDimension / 2, cell.canvasY + puzzle.cellDimension / 2 + puzzle.valueFontHeight / 2);
	}
}

// note: call this with color = "#FFFFFF" to "clear" highlights
function drawCells(puzzle, cells, color) {
	for (var i = 0; i < cells.length; i++) {
		drawCell(puzzle, cells[i], color);
	}
}

function drawCell(puzzle, cell, color) {
	if(color == "#FFFFFF" &&
	   (cell.hinted ||
		(puzzle.hintsOn && cell.value !== "" && cell.value !== cell.solution))) {
		color = hintedBoxColor;
	}
	
	puzzle.ctx.fillStyle = color;
	puzzle.ctx.fillRect(cell.canvasX, cell.canvasY, puzzle.cellDimension, puzzle.cellDimension);
	
	if(cell.circled) {
		var startAngle = 0;
		var endAngle = 2 * Math.PI;

		if(cell.number !== -1) {
			startAngle = 1.4 * Math.PI;
			endAngle = 1.1 * Math.PI;
		}
		
		puzzle.ctx.fillStyle = "#000000";
		puzzle.ctx.beginPath();
		puzzle.ctx.arc(
			cell.canvasX + puzzle.cellDimension / 2,
			cell.canvasY + puzzle.cellDimension / 2,
			puzzle.cellDimension / 2,
			startAngle,
			endAngle);
		puzzle.ctx.stroke();
	}
	
	drawCellNumber(puzzle, cell);
	drawCellValue(puzzle, cell);

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

function highlightCluesForUser(puzzle, user) {
	var number = cellToNumber(puzzle, user.focus.x, user.focus.y, user.orientation);
	highlightClue(
		puzzle,
		number,
		user.orientation,
		rgbToLighterHslString(user.color)
	);
	
	highlightClue(
		puzzle,
		cellToNumber(
			puzzle,
			user.focus.x,
			user.focus.y,
			opposite(user.orientation)),
		opposite(user.orientation),
		secondaryFocusColor
	);
}

function drawPuzzle(puzzle) {
	puzzle.ctx.fillStyle = "#000000";
	puzzle.ctx.fillRect(puzzle.x, puzzle.y, puzzle.dimension, puzzle.dimension);
	
	// Draw base puzzle
	for(var i = 0; i < puzzle.cells.length; i++) {
		for(var j = 0; j < puzzle.cells[0].length; j++) {
			var cell = puzzle.cells[i][j];
			
			if(cell.solution !== "#") {
				drawCell(puzzle, cell, "#FFFFFF");
			}
		}
	}


	// Draw user highlights
	for(var i = 0; i < puzzle.users.length; i++) {
		var user = puzzle.users[i];
		
		if(user.focus.x > -1 && user.focus.y > -1) {
			var color = user.color;

			var colorLighter = rgbToLighterHslString(color);

			var focusedCells = getFocusedCells(puzzle, user.focus.x, user.focus.y, user.orientation);
			var perpendicularCells = getFocusedCells(puzzle, user.focus.x, user.focus.y, opposite(user.orientation));

			drawCells(puzzle, perpendicularCells, secondaryFocusColor);		
			drawCells(puzzle, focusedCells, colorLighter);

			// highlight focused cell
			drawCell(puzzle, puzzle.cells[user.focus.y][user.focus.x], color);
		}
	}

	if(!puzzle.solved) {
		if(isCorrect(puzzle)) {
			puzzle.solved = true;

			// timeout to allow last letter to be drawn in
			setTimeout(function() {
				alert("You have completed the puzzle!");
			}, 50);
		}
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

function highlightClue(puzzle, number, orientation, color, autoScroll) {
	if(orientation !== "across" && orientation !== "down") {
		return;
	}

	var clue = document.getElementById(number + orientation);

	if(clue == null) {
		return;
	}

	if(autoScroll == undefined) {
		autoScroll = true;
	}

	var alreadyHighlighted;
	if(orientation === "across") {
		alreadyHighlighted = document.getElementById(puzzle.highlightedAcross + "across");
		puzzle.highlightedAcross = number;
	}
	else {
		alreadyHighlighted = document.getElementById(puzzle.highlightedDown + "down");
		puzzle.highlightedDown = number;
	}
	
	if(alreadyHighlighted != null) {
		alreadyHighlighted.style.background = "#FFFFFF";
	}

	clue.style.background = color;

	if(autoScroll) {
		var list = document.getElementById(orientation + "List");
		list.scrollTop = (clue.offsetTop - list.offsetTop) - (list.clientHeight / 2 - clue.clientHeight / 2);
	}
}

function initXWord(xmlString) {
	var puzzle = {
		solved: false,
		highlightedDown: -1,
		highlightedAcross: -1,
		numToXY: {},
		interfaceFocused: false,
		hintsOn: false
	};
	
	var canvas = document.getElementById("xword");
	var iface = document.getElementById("interface");
	var ctx = canvas.getContext("2d");

	puzzle.ctx = ctx; // store copy here that we can use when we pass puzzle around to functions

	var canvasContainingWidth = Math.max(.65 * (window.innerWidth), 700);
	var canvasContainingHeight = Math.max(.9 * (window.innerHeight), 700);
	
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
	
	iface.style.width = Math.max((window.innerWidth - ifaceLeft - 20), 300) + "px";
	iface.style.height = (window.innerHeight - ifaceTop - 20) + "px";

	// Set up xml parsing
	var parser = new DOMParser();
	var xml = parser.parseFromString(xmlString, "text/xml");

	puzzle.title = xml.getElementsByTagName("title")[0].textContent;
	
	// Draw title
	{
		var fontSize = 24;
		ctx.font = fontSize + "px sans-serif";
		ctx.textAlign = "center";
		ctx.fillText(puzzle.title, puzzle.x + puzzle.dimension / 2, puzzle.y / 2 + fontSize / 2);
	}

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
				puzzle.numToXY[number] = { x: j, y: i };
			}
			else {
				number = -1;
			}

			var circled = cellXml.hasAttribute("background-shape") && cellXml.getAttribute("background-shape") === "circle";
			
			
			puzzle.cells[i][j] = {
				row: i,
				column: j,
				solution: solution,
				number: number,
				value: "",   // user-entered value
				circled: circled,
				hinted: false
			};
		}
	}

	// Calculate x and y positions of each cell
	puzzle.cellMargin = 2;
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
			color: userColors[0],
			focus: { x: -1, y: -1 },
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

		var clueClickListener = function(e) {
			var id = e.target.id;
			puzzle.interfaceFocused = true;
			
			var index = Math.max(id.indexOf("a"), id.indexOf("d"));
			var number = id.slice(0, index);
			var orientation = id.slice(index);

			var user = puzzle.users[0];
			var cellCoords = puzzle.numToXY[number];
			
			user.focus.x = cellCoords.x;
			user.focus.y = cellCoords.y;
			user.orientation = orientation;

			highlightCluesForUser(puzzle, user);


			drawPuzzle(puzzle);
		};
		
		var acrossList = document.getElementById("acrossList");
		for(var i = 0; i < acrossClues.length; i++) {
			var clue = acrossClues[i];
			var number = clue.getAttribute("number");
			var text = clue.textContent;

			var item = document.createElement("div");
			item.id = number + "across";
			item.className = "clue";
			item.innerHTML = number + ". " + text;
			
			item.addEventListener("click", clueClickListener);
			
			acrossList.appendChild(item);
		}

		var downList = document.getElementById("downList");
		for(var i = 0; i < downClues.length; i++) {
			var clue = downClues[i];
			var number = clue.getAttribute("number");
			var text = clue.textContent;

			var item = document.createElement("div");
			item.id = number + "down";
			item.className = "clue";
			item.innerHTML = number + ". " + text;

			item.addEventListener("click", clueClickListener);

			downList.appendChild(item);
		}
	}

	// Add keyboard listeners for navigating with arrow keys
	document.body.addEventListener('keydown', function(e) {
		var user = puzzle.users[0];
		var redrawPuzzle = false;
		var valuesChanged = false;

		if(user.focus.x == -1 || user.focus.y == -1) {
			return;
		}

		if(e.keyCode >= 37 && e.keyCode <= 40 || e.keyCode == 32 || e.keyCode == 8) {
			e.preventDefault(); // prevents scrolling in divs with arrow/space
		}
		
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

		highlightCluesForUser(puzzle, user);
	});

	// add click listener to hints slider
	var hints = document.getElementById("hintToggle");
	hints.addEventListener("click", function() {
		puzzle.hintsOn = !puzzle.hintsOn;
		drawPuzzle(puzzle);
	});
	
	canvas.addEventListener("mousedown", function(e) {
		puzzle.interfaceFocused = false;
		
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

			highlightCluesForUser(puzzle, user, number);
			
			drawPuzzle(puzzle);
		}
	});

	var revealButton = document.getElementById("reveal");
	reveal.addEventListener("click", function(e) {
		var options = document.getElementById("revealOptions");

		if(options.style.visibility === "") {
			options.style.visibility = "hidden";
		}
		
		if(options.style.visibility === "hidden") {
			var buttonRect = this.getBoundingClientRect();
			
			options.style.left = buttonRect.left - 9 + "px";
			options.style.top = buttonRect.top + buttonRect.height + 12 + "px";
			options.style.visibility = "visible";
		}
		else {
			options.style.visibility = "hidden";
			return;
		}

		// invisible when mouse leaves
		setTimeout(function() {
			var t = setInterval(function() {
				var options = document.getElementsByClassName("revealOption");
				var keepAlive = false;

				if(document.getElementById("revealOptions").style.visibility !== "hidden") {
					for(var i = 0; i < options.length; i++) {
						var option = options[i];
						if(option.getAttribute("data-mouseIsOver") === "true") {
							keepAlive = true;
							break;
						}
					}
				}

				if(!keepAlive) {
					clearInterval(t);
					document.getElementById("revealOptions").style.visibility = "hidden";
				}
			}, 100);
		}, 2000);
	});

	// hack-- check the background color of the options
	// if none of the options have the "selected" background
	// color, then the mouse isn't over any of them!
	var options = document.getElementsByClassName("revealOption");
	for(var i = 0; i < options.length; i++) {
		var option = options[i];
		option.addEventListener("mouseover", function(e) {
			this.setAttribute("data-mouseIsOver", "true");
		});
		option.addEventListener("mouseout", function(e) {
			this.setAttribute("data-mouseIsOver", "false");
		});
	}

	var revealLetter = document.getElementById("revealLetter");
	revealLetter.addEventListener("click", function(e) {
		document.getElementById("revealOptions").style.visibility = "hidden";
		
		if(puzzle.solved) { return; }
		
		var user = puzzle.users[0];
		
		if(user.focus.x !== -1 && user.focus.y !== -1) {
			var cell = puzzle.cells[user.focus.y][user.focus.x];
			cell.value = cell.solution;
			cell.hinted = true;

			drawPuzzle(puzzle);
		}
	});

	var revealWord = document.getElementById("revealWord");
	revealWord.addEventListener("click", function(e) {
		document.getElementById("revealOptions").style.visibility = "hidden";
		
		if(puzzle.solved) { return; }
		
		var user = puzzle.users[0];
		
		if(user.focus.x !== -1 && user.focus.y !== -1) {
			var cells = getFocusedCells(
				puzzle,
				user.focus.x,
				user.focus.y,
				user.orientation
			);

			for(var i = 0; i < cells.length; i++) {
				var cell = cells[i];
				if(cell.value !== cell.solution) {
					cell.value = cell.solution;
					cell.hinted = true;
				}
			}

			drawPuzzle(puzzle);
		}
	});

	var revealPuzzle = document.getElementById("revealPuzzle");
	revealPuzzle.addEventListener("click", function(e) {
		document.getElementById("revealOptions").style.visibility = "hidden";

		if(puzzle.solved) { return; }
		
		for(var i = 0; i < puzzle.gridDimension; i++) {
			for(var j = 0; j < puzzle.gridDimension; j++) {
				var cell = puzzle.cells[j][i];

				if(cell.solution !== "#" && cell.value !== cell.solution) {
					cell.value = cell.solution;
					cell.hinted = true;
				}
			}
		}

		drawPuzzle(puzzle);
	});


	var colorPickerButton = document.getElementById("colorPickerButton");
	colorPickerButton.style.background = puzzle.users[0].color;

	var colorSamples = document.getElementsByClassName("colorSample");
	for (var i = 0; i < Math.min(colorSamples.length, userColors.length); i++) {
		var sampleDiv = colorSamples[i];
		sampleDiv.style.background = userColors[i];

		sampleDiv.addEventListener("click", function(e) {
			var i = parseInt(this.getAttribute("data-index"));
			var color = userColors[i];
			puzzle.users[0].color = color;
			colorPickerButton.style.background = color;

			highlightCluesForUser(puzzle, puzzle.users[0]);
			drawPuzzle(puzzle);
		});
	}
	colorPickerButton.addEventListener("click", function(e) {
		var picker = document.getElementById("colorPicker");

		if(picker.style.visibility === "") {
			picker.style.visibility = "hidden";
		}
		
		if(picker.style.visibility === "hidden") {
			var buttonRect = this.getBoundingClientRect();
			var pickerRect = picker.getBoundingClientRect();
			
			picker.style.left = buttonRect.left - pickerRect.width - 8 + "px";
			picker.style.top = buttonRect.top + "px";
			picker.style.visibility = "visible";
		}
		else {
			picker.style.visibility = "hidden";
			return;
		}

		// invisible when mouse leaves
		setTimeout(function() {
			var t = setInterval(function() {
				var samples = document.getElementsByClassName("colorSample");
				var keepAlive = false;

				if(document.getElementById("colorPicker").style.visibility !== "hidden") {
					for(var i = 0; i < samples.length + 1; i++) {
						var sample;
						if(i === samples.length) {
							sample = document.getElementById("colorPicker");
						}
						else {
							sample = samples[i];
						}
						
						if(sample.getAttribute("data-mouseIsOver") === "true") {
							keepAlive = true;
							break;
						}
					}
				}

				if(!keepAlive) {
					clearInterval(t);
					document.getElementById("colorPicker").style.visibility = "hidden";
				}
			}, 100);
		}, 2000);
	});

	// hack-- check the background color of the options
	// if none of the options have the "selected" background
	// color, then the mouse isn't over any of them!
	var samples = document.getElementsByClassName("colorSample");
	for(var i = 0; i < samples.length; i++) {
		var sample = samples[i];
		sample.addEventListener("mouseover", function(e) {
			this.setAttribute("data-mouseIsOver", "true");
		});
		sample.addEventListener("mouseout", function(e) {
			this.setAttribute("data-mouseIsOver", "false");
		});
	}

	var cp = document.getElementById("colorPicker");
	cp.addEventListener("mouseover", function(e) {
		this.setAttribute("data-mouseIsOver", "true");
	});
	cp.addEventListener("mouseout", function(e) {
		this.setAttribute("data-mouseIsOver", "false");
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

// update dev shortcut link
{
	var link = document.getElementById("devShortcut");

	if(link != null) {
		link.href = xwordUrl;
	}
}


var xhttp = new XMLHttpRequest();
xhttp.onreadystatechange = function() {
	if (this.readyState === 4 && this.status === 200) {
		initXWord(this.responseText);
	}
}

xhttp.open("GET", xwordUrl);
xhttp.send();
