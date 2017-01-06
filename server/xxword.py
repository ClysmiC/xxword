from flask import Flask, Response, abort
from urllib import request
import re
import flask
import urllib
import xml.etree.ElementTree as ET

app = Flask(__name__)
laTimeDateRegex = re.compile("[0-9]{6}")

@app.route("/la<date>", methods=['GET'])
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
    puzzle = {}
    
    puzzle['title'] = root.find(".//" + namespace + 'title').text

    grid = root.find(".//" + namespace + 'grid')

    if grid.attrib['width'] != grid.attrib['height']:
        abort(500) # width doesn't match height -- we can't handle this puzzle
        
    puzzle['dimension'] = int(grid.attrib['width'])

    # set up 2D array that is dimension X dimension
    puzzle['cells'] = []
    for i in range(puzzle['dimension']):
        puzzle['cells'].append([None] * puzzle['dimension'])

    cells = grid.findall(".//" + namespace + 'cell')
    
    for across in range(puzzle['dimension']):
        for down in range(puzzle['dimension']):
            cell = cells[across * puzzle['dimension'] + down]
            
            myCell = {}
            myCell['x'] = int(cell.attrib['x']) - 1
            myCell['y'] = int(cell.attrib['y']) - 1

            if 'solution' in cell.attrib:
                myCell['solution'] = cell.attrib['solution']
            else:
                myCell['solution'] = '#'

            if 'number' in cell.attrib:
                myCell['number'] = int(cell.attrib['number'])
            else:
                myCell['number'] = -1
                
            myCell['value'] = ""
            myCell['circled'] = ('background-shape' in cell.attrib)
            myCell['hinted'] = False
            
            puzzle['cells'][down][across] = myCell
            

    puzzle['clues'] = [[], []]

    clueArrays = root.findall(".//" + namespace + 'clues')

    if len(clueArrays) != 2:
        abort(500)

    # Across
    for clue in clueArrays[0].findall(".//" + namespace + 'clue'):
        myClue = {}
        myClue['text'] = clue.text
        myClue['number'] = int(clue.attrib['number'])
        
        puzzle['clues'][0].append(myClue)

    # Down
    for clue in clueArrays[1].findall(".//" + namespace + 'clue'):
        myClue = {}
        myClue['text'] = clue.text
        myClue['number'] = int(clue.attrib['number'])
        
        puzzle['clues'][1].append(myClue)
    
    result = flask.jsonify(**puzzle)
    

    # # Allows for cross domain requests
    # # ONLY USE FOR TESTING
    result.headers.add('Access-Control-Allow-Origin', '*')
    
    return result

if __name__ == "__main__":
    app.run()
