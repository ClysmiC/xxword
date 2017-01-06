from flask import Flask, Response, abort
from urllib import request
import re
import urllib

app = Flask(__name__)
laTimeDateRegex = re.compile("[0-9]{6}")

@app.route("/la<date>", methods=['GET'])
def getXwordLaTimes(date):
    if not laTimeDateRegex.match(date):
        abort(400)
        
    url = "http://cdn.games.arkadiumhosted.com/latimes/assets/DailyCrossword/la" + date + ".xml"
    try:
        response = request.urlopen(url)
        if response.getcode() == 200:
            xml = response.read()
        else:
            abort(response.getcode())
    except urllib.error.HTTPError as e:
        abort(404) # can't find crossword for the given date
        
    return Response(xml, mimetype="text/xml")

if __name__ == "__main__":
    app.run()
