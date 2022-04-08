const prompt = require('prompt-sync')({sigint: true});

const hat = '^';
const hole = 'O';
const fieldCharacter = '░';
const pathCharacter = '*';

class Field {

  constructor(array) {
    
    this._dimensionX = 3;
    this._dimensionX = 3;
    this._array = array;

    this._position = { 
      x: 0,
      y: 0
    }

    this._direction = "";
  }

  get array() {
    return this._array;
  }

  get dimensionX() {
    return this._dimensionX;
  }

  get dimensionY() {
    return this._dimensionY;
  }
  
  get position() {
    return this._position;
  }

  get direction() {
    return this._direction;
  }

  set position(newPosition) {
    this._position = newPosition;
  }

  set direction(newDirection) {
    this._direction = newDirection;
  }

  print() {
    console.clear();
    this.array.forEach((line) => {
      line.forEach((char) => {
        process.stdout.write(char);
      })
      process.stdout.write('\n');
    })
  }

  isValid(direction) {
    return direction.match(/^(r|l|d|u){1}$/i);
  }

  getDirection() {
    this.direction = "";
    while (this.direction === "") {
      const direction = prompt("Which way would you like to go?");
      if (this.isValid(direction)) {
        this.direction = direction;
      }
    }
  }

  isOutOfField() {
    return (
      (this.position.x === 0) && (this.direction === "l") ||
      (this.position.y === 0) && (this.direction === "u") ||
      (this.position.y === this.dimensionY - 1) && (this.direction === "d") ||
      (this.position.x === this.dimensionX - 1) && (this.direction === "r")
    );
  }

  isFallenInHole() {
    return this.array[this.position.x][this.position.y] === "O";
  }

  getNewPosition() {
    if (this.direction === "l") {
      this.position.y -= 1;
    }
    if (this.direction === "r") {
      this.position.y += 1;
    }
    if (this.direction === "u") {
      this.position.x -= 1;
    }
    if (this.direction === "d") {
      this.position.x += 1;
    }
  }

  moveToNewPosition() {
    if (!this.isOutOfField()) {
      this.getNewPosition();
      if (!this.isFallenInHole()) {
        this.array[this.position.x][this.position.y] = '*';
        this.print();
      }
      else {
        process.stdout.write('You fell inside a hole!\n');
        process.exit();
      }
    }
    else {
      process.stdout.write('You fell outside the field!\n');
      process.exit();
    }
  }
}

const myField = new Field([
  ['*', '░', 'O'],
  ['░', 'O', '░'],
  ['░', '^', '░'],
]);

myField.print();

myField.getDirection();
myField.moveToNewPosition();

myField.getDirection();
myField.moveToNewPosition();