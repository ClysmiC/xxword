from flask import Flask, Response, abort
from urllib import request
import re
import flask
import urllib
import xml.etree.ElementTree as ET

import ZODB, transaction
import persistent

app = Flask(__name__)
laTimeDateRegex = re.compile("[0-9]{6}")
db = ZODB.DB(None)

class Game:
    def __init__(self, isGroup, puzzle):
        self.isGroup = isGroup
        self.puzzle = puzzle

    def serialize(self):
        result = {}
        result['isGroup'] = self.isGroup
        result['puzzle'] = self.puzzle.serialize()
        
        return result


    
class Puzzle:
    def __init__(self, title, dimension, cells, acrossClues, downClues):
        self.title = title
        self.dimension = dimension
        self.cells = cells
        self.acrossClues = acrossClues
        self.downClues = downClues

    def serialize(self):
        result = {}
        result['title'] = self.title
        result['dimension'] = self.dimension
        result['cells'] = [[ cell.serialize() for cell in row] for row in self.cells ]
        result['acrossClues'] = [ c.serialize() for c in self.acrossClues ]
        result['downClues'] = [ c.serialize() for c in self.downClues ]

        return result

    
class Cell:
    def __init__(self, x, y, solution, value, number, circled, hinted):
        self.x = x
        self.y = y
        self.solution = solution
        self.value = value
        self.number = number
        self.circled = circled
        self.hinted = hinted

    def serialize(self):
        return self.__dict__
    
class Clue:
    def __init__(self, number, orientation, text):
        self.number = number
        self.orientation = orientation
        self.text = text

    def serialize(self):
        return self.__dict__
        
    
@app.route("/lobby/<username>-la<date>", methods=['GET'])
def startLobby(username, date):
    conn = db.open()
    dbroot = conn.root
    
    if len(username) == 0 or len(username) > 12:
        conn.close()
        abort(400)

    for char in username:
        if ord(char) < 32 or ord(char) > 125:
            conn.close()
            abort(400)
            

    

@app.route("/la<date>", methods=['GET'])
@app.route("/la<date>.xml", methods=['GET'])
def getXwordLaTimes(date):
    if not laTimeDateRegex.match(date):
        abort(400)
        
    url = "http://cdn.games.arkadiumhosted.com/latimes/assets/DailyCrossword/la" + str(date) + ".xml"
    
    try:
        response = request.urlopen(url)
        if response.getcode() == 200:
            xml = response.read()
        else:
            abort(response.getcode())
    except urllib.error.HTTPError as e:
        abort(404) # can't find crossword for the given date

    namespace = "{http://crossword.info/xml/rectangular-puzzle}"
    
    root = ET.fromstring(xml)
    
    title = root.find(".//" + namespace + 'title').text

    gridXml = root.find(".//" + namespace + 'grid')

    if gridXml.attrib['width'] != gridXml.attrib['height']:
        abort(500) # width doesn't match height -- we can't handle this puzzle
        
    dimension = int(gridXml.attrib['width'])

    # set up 2D array that is dimension X dimension
    cells = []
    for i in range(dimension):
        cells.append([None] * dimension)

    cellsXml = gridXml.findall(".//" + namespace + 'cell')
    
    for across in range(dimension):
        for down in range(dimension):
            cellXml = cellsXml[across * dimension + down]
            
            cellX = int(cellXml.attrib['x']) - 1
            cellY = int(cellXml.attrib['y']) - 1

            if 'solution' in cellXml.attrib:
                cellSolution = cellXml.attrib['solution']
            else:
                cellSolution = '#'

            if 'number' in cellXml.attrib:
                cellNumber = int(cellXml.attrib['number'])
            else:
                cellNumber = -1
                
            cellValue = ""
            cellIsCircled = ('background-shape' in cellXml.attrib)
            cellIsHinted = False
            
            cells[down][across] = Cell(cellX, cellY, cellSolution, cellValue, cellNumber, cellIsCircled, cellIsHinted)
            

    acrossClues = []
    downClues = []

    clueArrays = root.findall(".//" + namespace + 'clues')

    if len(clueArrays) != 2:
        abort(500)

    # Across
    for clueXml in clueArrays[0].findall(".//" + namespace + 'clue'):
        number = int(clueXml.attrib['number'])
        text = clueXml.text
        
        acrossClues.append(Clue(number, "across", text))

    # Down
    for clueXml in clueArrays[1].findall(".//" + namespace + 'clue'):
        number = int(clueXml.attrib['number'])
        text = clueXml.text
        
        downClues.append(Clue(number, "down", text))

    puzzle = Puzzle(title, dimension, cells, acrossClues, downClues)
    result = flask.jsonify(**puzzle.serialize())

    # # Allows for cross domain requests
    # # ONLY USE FOR TESTING
    result.headers.add('Access-Control-Allow-Origin', '*')
    
    return result

if __name__ == "__main__":
    app.run()
