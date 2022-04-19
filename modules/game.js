const { PathCell, PlayerCell, Position } = require('./cell');
const Field = require('./field');
const Situation = require('./situation');

//const prompt = require('prompt-sync')({sigint: true});
const readline = require('readline');

class Game {
  constructor(dimensionX, dimensionY, percentageHoles, playingMode) {
    this._playingMode = playingMode;

    this._field = new Field(dimensionX, dimensionY, percentageHoles);

    this._playerDirection = null;

    this._gameOver = false;

    this._minimumMoves = this.distanceFromPlayerToHat();

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
  get playingMode() {
    return this._playingMode;
  }

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

  getPlayer() {
    return this.field.getPlayerCell();
  }

  distanceFromPlayerToHat() {
    return this.field.distanceFromPlayerToHat();
  }

  getCell(position) {
    return this.field.getCellInPosition(position);
  }

  print() {
    this.field.print();
  }

  initializeInterface() {
    readline.emitKeypressEvents(process.stdin);
    process.stdin.setRawMode(true);
  }

  isValid(key) {
    return key.name === 'up' || key.name === 'down' || key.name === 'right' || key.name === 'left';
  }

  getKey() {
    process.stdin.on('keypress', (str, key) => {
      if (key.ctrl && key.name === 'c') {
        process.exit();
      } else {
        if (this.isValid(key)) {
          this.updatePlayerDirection(key.name);
        }
      }
    });
  }

  requestDirection() {
    process.stdout.write("Use arrows on the keyboard to move your player (blue star) and find your hat (yellow caret) avoiding hole (red O) and falling outside the board.\n");
    this.getKey();
  }

  updatePlayerDirection(direction) {
    this.playerDirection = direction;
    this.tryMovingPlayerInDirection();
  }

  tryMovingPlayerInDirection() {
    try {
      this.movePlayer(this.playerDirection);
    }
    catch(situation) {
      this.print();
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
    this.addDifficulty(this.playingMode);
    this.print();
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
    return new Position(nextPosition);
  }

  replaceCell(oldCell, newCell) {
    Field.replaceCell(this.field.array, oldCell, newCell);
  }

  playerOutOfField(position) {
    return this.field.isPositionOutOfField(this.field.dimensionX, this.field.dimensionY, position);
  }

  playerFallenInHole(position) {
    return this.getCell(position).isHole();
  }

  playerFoundHat(position) {
    return this.getCell(position).isHat();
  }

  evaluateNextPosition(position) {
    let checkOk = false;
    let situation = null;
    
    if (this.playerOutOfField(position)) {
      situation = Game.situations.playerOutOfField;
      throw situation;
    }
    if (this.playerFallenInHole(position)) {
      situation = Game.situations.playerFallenInHole;
      throw situation;
    }
    if (this.playerFoundHat(position)) {
      situation = Game.situations.playerFoundHat;
      throw situation;
    }
    checkOk = true;
    return checkOk;
  }

  movePlayerToNextPosition(nextPosition) {
    
    const player = this.getPlayer();
    const currentPosition = new Position(player.position);

    const newPath = new PathCell(currentPosition);
    this.replaceCell(player, newPath);

    const nextCell = this.getCell(nextPosition);
      
    const newPlayer = new PlayerCell(nextPosition);
    this.replaceCell(nextCell, newPlayer);
  }

  movePlayer(direction) {
    
    const player = this.getPlayer();
    
    const currentPosition = new Position(player.position);
    
    const nextPosition = Game.calculateNextPosition(currentPosition, direction);

    const checkOk = this.evaluateNextPosition(nextPosition);
    
    if (checkOk) {
      
      this.movePlayerToNextPosition(nextPosition);
    }
  }

  addDifficulty() {
    this.field.addDifficulty(this.playingMode);
  }

  startGame() {
    this.initializeInterface();
    this.print(this.field);
    this.requestDirection(this);
  }
}

module.exports = Game;