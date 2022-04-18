const { PathCell, PlayerCell, Position } = require('./cell');
const Field = require('./field');
const Situation = require('./situation');

//const prompt = require('prompt-sync')({sigint: true});
const readline = require('readline');

class Game {
  constructor(dimensionX, dimensionY, percentageHoles) {
    this._field = new Field(dimensionX, dimensionY, percentageHoles);

    this._playerDirection = null;

    this._gameOver = false;

    this._minimumMoves = Game.distanceFromPlayerToHat(this.field);

    this._countMoves = 0;
  }
  
  static get situations() {
    return {
      playerOutOfField: new Situation("You fell outside the field!\n"),
      playerFallenInHole: new Situation("You fell inside a hole!\n"),
      playerFoundHat: new Situation("You found your hat!!! You won!!!\n")
    };
  }

  // Getter and setter functions

  get field() {
    return this._field;
  }

  get playerDirection() {
    return this._playerDirection;
  }

  get gameOver() {
    return this._gameOver;
  }

  get countMoves() {
    return this._countMoves;
  }

  get minimumMoves() {
    return this._minimumMoves;
  }

  set playerDirection(direction) {
    this._playerDirection = direction;
  }

  set gameOver(happened) {
    this._gameOver = happened;
  }

  set countMoves(count) {
    this._countMoves = count;
  }

  // Helper functions

  static getPlayer(field) {
    return Field.getPlayerCell(field.array);
  }

  static distanceFromPlayerToHat(field) {
    return field.distanceFromPlayerToHat;
  }

  static getCell(field, position) {
    return Field.getCellInPosition(field.array, position);
  }

  static print(field) {
    Field.print(field.array, field.dimensionX);
  }

  static initializeInterface() {
    readline.emitKeypressEvents(process.stdin);
    process.stdin.setRawMode(true);
  }

  getKey() {
    process.stdin.on('keypress', (str, key) => {
      if (key.ctrl && key.name === 'c') {
        process.exit();
      } else {
        if (Game.isValid(key)) {
          this.playerDirection = key.name;
          this.tryMovingPlayerInDirection();
        }
      }
    });
  }

  static requestDirection(game) {
    process.stdout.write("Which direction woud like to follow?\n");
    game.getKey();
  }

  static isValid(key/*direction*/) {
    //return direction.match(/^(r|l|d|u){1}$/i);
    return key.name === 'up' || key.name === 'down' || key.name === 'right' || key.name === 'left';
  }

  tryMovingPlayerInDirection() {
    try {
      Game.movePlayer(this.field, this.playerDirection);
    }
    catch(situation) {
      process.stdout.write(situation.message);
      Game.print(this.field);
      process.stdout.write(situation.message);
      this.gameOver = situation.message === Game.situations.playerFallenInHole.message || situation.message === Game.situations.playerOutOfField.message;
      if (this.gameOver) {
        process.stdout.write("---GAME OVER---");
      }
      if (!this.gameOver && situation.message === Game.situations.playerFoundHat.message) {
        this.countMoves++;
        process.stdout.write(`---GAME WON IN ${this.countMoves} MOVES AGAINST A MINIMUM OF ${this.minimumMoves} MOVES---`);
      }
      process.exit();
    }
    this.countMoves++;
    Game.print(this.field);
    process.stdout.write("You are safely moving along your path...\n");
  }

  static calculateNextPosition(currentPosition, direction) {
    const nextPosition = {
      x: currentPosition.x,
      y: currentPosition.y
    };
    if (direction === "left") {
      nextPosition.x -= 1;
    }
    if (direction === "right") {
      nextPosition.x += 1;
    }
    if (direction === "up") {
      nextPosition.y -= 1;
    }
    if (direction === "down") {
      nextPosition.y += 1;
    }
    return nextPosition;
  }

  static replaceCell(field, oldCell, newCell) {
    Field.replaceCell(field.array, oldCell, newCell);
  }

  static playerOutOfField(field, position) {
    return Field.isPositionOutOfField(field.dimensionX, field.dimensionY, position);
  }

  static playerFallenInHole(field, position) {
    return Game.getCell(field, position).isHole();
  }

  static playerFoundHat(field, position) {
    return Game.getCell(field, position).isHat();
  }

  static evaluateNextPosition(field, position) {
    let checkOk = false;
    let situation = null;
    
    if (Game.playerOutOfField(field, position)) {
      situation = Game.situations.playerOutOfField;
      throw situation;
    }
    if (Game.playerFallenInHole(field, position)) {
      situation = Game.situations.playerFallenInHole;
      throw situation;
    }
    if (Game.playerFoundHat(field, position)) {
      situation = Game.situations.playerFoundHat;
      throw situation;
    }
    checkOk = true;
    return checkOk;
  }

  static movePlayerToNextPosition(field, nextPosition) {
    const player = Game.getPlayer(field);
    const currentPosition = new Position(player.position);

    const newPath = new PathCell(currentPosition);
    Game.replaceCell(field, player, newPath);

    const nextCell = Game.getCell(field, nextPosition);
      
    const newPlayer = new PlayerCell(nextPosition);
    Game.replaceCell(field, nextCell, newPlayer);
  }

  static movePlayer(field, direction) {
    console.log(direction);
    const player = Game.getPlayer(field);
    
    const currentPosition =  new Position(player.position);
    

    const nextPosition = Game.calculateNextPosition(currentPosition, direction);

    const checkOk = Game.evaluateNextPosition(field, nextPosition);
    
    if (checkOk) {
      Game.movePlayerToNextPosition(field, nextPosition);
    }
  }

  startGame() {
    Game.initializeInterface();
    Game.print(this.field);
    Game.requestDirection(this);
  }
}

module.exports = Game;