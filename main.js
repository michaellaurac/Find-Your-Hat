const prompt = require('prompt-sync')({sigint: true});

const hat = '^';
const hole = 'O';
const fieldCharacter = '░';
const pathCharacter = '*';

class Field {

  constructor(array) {
    this._twoDimensionalArray = array;
  }

  get twoDimensionalArray() {
    return this._twoDimensionalArray;
  }

  print() {
    this._twoDimensionalArray.forEach((line) => {
      line.forEach((char) => {
        process.stdout.write(char);
      })
      process.stdout.write('\n');
    })
  }
}

const myField = new Field([
  ['*', '░', 'O'],
  ['░', 'O', '░'],
  ['░', '^', '░'],
]);

myField.print();
