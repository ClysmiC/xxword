class Game:
    def __init__(self, isGroup, puzzle, code):
        self.isGroup = isGroup
        self.puzzle = puzzle
        self.code = code
        self.users = []

    def serialize(self):
        result = {}
        result['isGroup'] = self.isGroup
        result['puzzle'] = self.puzzle.serialize()
        result['code'] = self.code
        result['users'] = [ user.serialize() for user in self.users ]
        
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


class User:
    def __init__(self, name, color):
        self.name = name
        self.color = color

    def serialize(self):
        return self.__dict__
