from flask import Flask, Response, abort
from urllib import request
import re
import flask
import urllib
import xml.etree.ElementTree as ET

import ZODB, transaction

import string
import random
import json

from model import *

app = Flask(__name__)
laTimeDateRegex = re.compile("[0-9]{6}")
db = ZODB.DB(None)

MAX_GAMES = 1

userColors = [
    "#FFDC00",  # yellow
    "#0074D9",  # blue
    "#2ECC40",  # green
    "#FF851B",  # orange
    "#F012BE",  # fuchsia
    "#795548",  # brown
    "#7FDBFF",  # aqua
    "#B10DC9",  # purple
];

@app.before_first_request
def dbinit():
    conn = db.open()
    dbroot = conn.root
    
    dbroot.games = {}

    transaction.commit()
    conn.close()

@app.route("/lobby/<username>-la<date>", methods=['GET'])
@app.route("/lobby/<username>-la<date>.xml", methods=['GET'])
def startLobby(username, date):
    if len(username) == 0 or len(username) > 12:
        abort(400)

    for char in username:
        if ord(char) < 32 or ord(char) > 125:
            abort(400)
            
    conn = db.open()
    dbroot = conn.root

    if len(dbroot.games) >= MAX_GAMES:
        print("Not enough resources to start game")
        abort(500)
        
    duplicate = True
    while duplicate:
        code = ''.join(random.choice(string.ascii_uppercase + string.digits) for _ in range(4))
        if code not in dbroot.games:
            duplicate = False

    print("Starting lobby: " + code)

    puzzle = getXwordLaTimesObject(date)
    game = Game(True, puzzle, code)
    user = User(username, userColors[0])

    game.users.append(user)

    dbroot.games[code] = game 

    transaction.commit()
    conn.close()

    resultStr = '{ "type": "groupPuzzleStart", "payload": ' + json.dumps(game.serialize()) + '}'

    # # Allows for cross domain requests
    # # ONLY USE FOR TESTING
    result = Response(resultStr)
    result.headers.add('Access-Control-Allow-Origin', '*')

    return result

def getXwordLaTimesObject(date):
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
    
    return puzzle

@app.route("/la<date>", methods=['GET'])
@app.route("/la<date>.xml", methods=['GET'])
def getXwordLaTimes(date):
    resultStr = '{ "type": "soloPuzzle", "payload": ' + json.dumps(getXwordLaTimesObject(date).serialize()) + '}'
    # result = flask.jsonify(**getXwordLaTimesObject(date).serialize())

    # # Allows for cross domain requests
    # # ONLY USE FOR TESTING
    result = Response(resultStr)
    result.headers.add('Access-Control-Allow-Origin', '*')
    
    return result

if __name__ == "__main__":
    app.run()
