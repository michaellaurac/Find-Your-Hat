const { PathCell, PlayerCell } = require('./cell');
const Field = require('./field');
const Situation = require('./situation');

const prompt = require('prompt-sync')({sigint: true});

class Game {
  constructor(dimensionX, dimensionY, percentageHoles) {
    this._gameOver = false;

    this._field = new Field(dimensionX, dimensionY, percentageHoles);

    this._player = Game.getPlayer(this._field);

    this._playerDirection = null;
  }
  
  static get situations() {
    return {
      playerOutOfField: new Situation("You fell outside the field!\n"),
      playerFallenInHole: new Situation("You fell inside a hole!\n"),
      playerFoundHat: new Situation("You found your hat!!! You won!!!\n")
    };
  }

  // Getter and setter functions

  get gameOver() {
    return this._gameOver;
  }

  get field() {
    return this._field;
  }

  get playerDirection() {
    return this._playerDirection;
  }

  set gameOver(happened) {
    this._gameOver = happened;
  }

  set playerDirection(direction) {
    this._playerDirection = direction;
  }

  // Helper functions

  static getPlayer(field) {
    return Field.getPlayerCell(field.array);
  }

  static getCell(field, position) {
    return Field.getCellInPosition(field.array, position);
  }

  static print(field) {
    Field.print(field.array, field.dimensionX);
  }

  static requestDirection() {
    let direction = null;
    while (direction === null) {
      const newDirection = prompt("Which way would you like to go?");
      if (Game.isValid(newDirection)) {
        direction = newDirection;
      }
    }
    return direction;
  }

  static isValid(direction) {
    return direction.match(/^(r|l|d|u){1}$/i);
  }

  static calculateNextPosition(currentPosition, direction) {
    const nextPosition = {
      x: currentPosition.x,
      y: currentPosition.y
    };
    if (direction === "l") {
      nextPosition.x -= 1;
    }
    if (direction === "r") {
      nextPosition.x += 1;
    }
    if (direction === "u") {
      nextPosition.y -= 1;
    }
    if (direction === "d") {
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
    const currentPosition = {
      x: player.position.x,
      y: player.position.y
    };

    const newPath = new PathCell(currentPosition);
    Game.replaceCell(field, player, newPath);

    const nextCell = Game.getCell(field, nextPosition);
      
    const newPlayer = new PlayerCell(nextPosition);
    Game.replaceCell(field, nextCell, newPlayer);
  }

  static movePlayer(field, direction) {
    const player = Game.getPlayer(field);
    const currentPosition = {
      x: player.position.x,
      y: player.position.y
    };

    const nextPosition = Game.calculateNextPosition(currentPosition, direction);

    const checkOk = Game.evaluateNextPosition(field, nextPosition);
    
    if (checkOk) {
      Game.movePlayerToNextPosition(field, nextPosition);
    }
  }

  startGame() {
    Game.print(this.field);

    while (!this.gameOver) {
      this.playerDirection = Game.requestDirection();
      try {
        Game.movePlayer(this.field, this.playerDirection);
      }
      catch(situation) {
        Game.print(this.field);
        process.stdout.write(situation.message);
        this.gameOver = situation.message === Game.situations.playerFallenInHole.message || situation.message === Game.situations.playerOutOfField.message;
        if (this.gameOver) {
          process.stdout.write("---GAME OVER---");
        }
        if (!this.gameOver && situation.message === Game.situations.playerFoundHat.message) {
          process.stdout.write("---GAME WON---");
        }
        process.exit();
      }
      this._playerDirection = null;
      Game.print(this.field);
      process.stdout.write("You are safely moving along your path...\n");
    }
  }
}

module.exports = Game;