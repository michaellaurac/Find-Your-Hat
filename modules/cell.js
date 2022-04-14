const colors = require('colors');
const { distanceFromMToN } = require('./math-functions')

class Position {
  constructor(position) {
    this._x = position.x
    this._y = position.y
  }

  get x() {
    return this._x;
  }

  get y() {
    return this._y;
  }

  isEqualTo(position) {
    return (this.x === position.x) && (this.y === position.y);
  }

  distanceToPosition(position) {
    return distanceFromMToN(this.x, position.x) + distanceFromMToN(this.y, position.y);
  }
}

class Cell {
  
  constructor(position, character) {

    this._position = new Position(position)

    this._character = character
  }

  // Constant definition

  static get hatCharacter() {
    return '^'.yellow;
  }

  static get holeCharacter() {
    return 'O'.red;
  }

  static get grassCharacter() {
    return '░'.green;
  }

  static get pathCharacter() {
    return '*'.white;
  }

  static get playerCharacter() {
    return '*'.blue;
  }

  // Getter and setter functions

  get position() {
    return this._position;
  }

  get character() {
    return this._character;
  }

  // Helper functions

  isGrass() {
    return this.character === Cell.grassCharacter;
  }

  isHat() {
    return this.character === Cell.hatCharacter;
  }

  isHole() {
    return this.character === Cell.holeCharacter;
  }

  isPath() {
    return this.character === Cell.pathCharacter;
  }

  isPlayer() {
    return this.character === Cell.playerCharacter;
  }

  isEmpty() {
    return this.isGrass() || this.isPath();
  }
}

class GrassCell extends Cell {
  constructor(position) {
    super(position)
    this._character = Cell.grassCharacter;
  }
}

class HatCell extends Cell {
  constructor(position) {
    super(position)
    this._character = Cell.hatCharacter;
  }
}

class HoleCell extends Cell {
  constructor(position) {
    super(position)
    this._character = Cell.holeCharacter;
  }
}

class PathCell extends Cell {
  constructor(position) {
    super(position)
    this._character = Cell.pathCharacter;
  }
}

class PlayerCell extends Cell {
  constructor(position) {
    super(position)
    this._character = Cell.playerCharacter;
  }
}

module.exports = { Position, Cell, GrassCell, HatCell, HoleCell, PathCell, PlayerCell };