const prompt = require('prompt-sync')({sigint: true});
const colors = require('colors');

class Situation extends Error {
  constructor(message) {
    super(message);
  }
}

class Field {

  constructor(dimensionX, dimensionY, percentageHoles) {
    
    this._dimensionX = dimensionX;
    this._dimensionY = dimensionY;
    this._numberHoles = Math.floor ( dimensionX * dimensionY * percentageHoles / 100 );

    this._occupiedCells = [];

    this._array = this.generateField();

    this._position = this._occupiedCells[0];

    this._nextPosition = {};

    this._direction = null;

    this._situations = {
      playerOutOfField: new Situation("You fell outside the field!\n"),
      playerFallenInHole: new Situation("You fell inside a hole!\n"),
      playerFoundHat: new Situation("You found your hat!!! You won!!!\n")
    }

    this._gameOver = false;
  }
  
  // Constant definition

  static get hatCharacter() {
    return '^'.yellow;
  }

  static get holeCharacter() {
    return 'O'.red;
  }

  static get fieldCharacter() {
    return '░'.green;
  }

  static get pathCharacter() {
    return '.';
  }

  static get currentPathCharacter() {
    return '*'.blue;
  }
  
  // Getter and setter functions
  get array() {
    return this._array;
  }

  get dimensionX() {
    return this._dimensionX;
  }

  get dimensionY() {
    return this._dimensionY;
  }

  get numberHoles() {
    return this._numberHoles;
  }
  
  get position() {
    return this._position;
  }

  get nextPosition() {
    return this._nextPosition;
  }

  get direction() {
    return this._direction;
  }

  get occupiedCells() {
    return this._occupiedCells;
  }

  get situations() {
    return this._situations;
  }

  get gameOver() {
    return this._gameOver;
  }

  set position(newPosition) {
    this._position = newPosition;
  }

  set nextPosition(newPosition) {
    this._nextPosition = newPosition;
  }

  set direction(newDirection) {
    this._direction = newDirection;
  }

  set occupiedCells(newOccupiedCells) {
    this.occupiedCells = newOccupiedCells;
  }

  set gameOver(hasHappened) {
    this._gameOver = hasHappened;
  }

  // Helper functions

  findUnoccupiedRandomPosition() {
    let randomPosition;

    do {
      randomPosition = {
        x: Math.floor(Math.random() * this.dimensionX),
        y: Math.floor(Math.random() * this.dimensionY)
      }
    } while (this.occupiedCells.some(occupiedCell => occupiedCell.x === randomPosition.x && occupiedCell.y === randomPosition.y));

    return randomPosition;
  }

  isValid(direction) {
    return direction.match(/^(r|l|d|u){1}$/i);
  }

  readCharacterInArrayOn(array, position) {
    return array[position.x][position.y];
  }

  writeCharacterInArrayOn(array, position, character) {
    array[position.x][position.y] = character;
  }

  addCells(array, number, character) {
    
    for (let i = 0; i < number; i++) {
      let newRandomCellPosition = this.findUnoccupiedRandomPosition();
      this.writeCharacterInArrayOn(array, newRandomCellPosition, character);
      this.occupiedCells.push(newRandomCellPosition);
    }
  }

  generateField() {
    let field = Array.from({ length: this.dimensionX }, x => Array.from({ length: this.dimensionY }, y => Field.fieldCharacter));

    // Blue * character on the start position
    this.addCells(field, 1, Field.currentPathCharacter);
  
    // Red O characters on a number of unoccupied random position
    this.addCells(field, this.numberHoles, Field.holeCharacter);
  
    // Yellow ^ character in an unoccupied random position
    this.addCells(field, 1, Field.hatCharacter);
    
    return field;
  } 

  // Gameplay functions

  print() {
    console.clear();
    this.array.forEach((line) => {
      line.forEach((char) => {
        process.stdout.write(char);
      })
      process.stdout.write('\n');
    })
  }

  requestDirection() {
    this.direction = null;
    while (this.direction === null) {
      const direction = prompt("Which way would you like to go?");
      if (this.isValid(direction)) {
        this.direction = direction;
      }
    }
  }

  playerOutOfField() {
    return (
      (this.nextPosition.x < 0) || 
      (this.nextPosition.x >= this.dimensionX) ||
      (this.nextPosition.y < 0) || 
      (this.nextPosition.y >= this.dimensionY)
    );
  }

  playerFallenInHole() {
    return this.readCharacterInArrayOn(this.array, this.nextPosition) === Field.holeCharacter;
  }

  playerFoundHat() {
    return this.readCharacterInArrayOn(this.array, this.nextPosition) === Field.hatCharacter;
  }

  checkSituation() {
    let situation = {};
    if (this.playerOutOfField()) {
      situation = this._situations.playerOutOfField;
      this.gameOver = true;
      throw situation;
    }
    if (this.playerFallenInHole()) {
      situation = this._situations.playerFallenInHole;
      this.gameOver = true;
      throw situation;
    }
    if (this.playerFoundHat()) {
      situation = this._situations.playerFoundHat;
      throw situation;
    }
  }

  calculateNextPosition() {
    this.nextPosition = this.position;
    if (this.direction === "l") {
      this.nextPosition.y -= 1;
    }
    if (this.direction === "r") {
      this.nextPosition.y += 1;
    }
    if (this.direction === "u") {
      this.nextPosition.x -= 1;
    }
    if (this.direction === "d") {
      this.nextPosition.x += 1;
    }
  }

  moveToNewPosition() {
    this.writeCharacterInArrayOn(this.array, this.position, '.');
    this.position = this.nextPosition;
    this.writeCharacterInArrayOn(this.array, this.position, Field.currentPathCharacter);
    this.nextPosition = {};
    this.direction = null;
    this.print();
  }

  startGame() {
    this.print();
    while (!this.gameOver) {
      this.requestDirection();
      this.calculateNextPosition();
      try {
        this.checkSituation();
      }
      catch(situation) {
        process.stdout.write(situation.message);
        if (this.gameOver) {
          process.stdout.write("---GAME OVER---");
        }
        process.exit();
      }
      this.moveToNewPosition();
      process.stdout.write("You are safely moving along your path...\n");
    }
  }
}

const myField = new Field(+process.argv[2], +process.argv[3], +process.argv[4]);
myField.startGame();


