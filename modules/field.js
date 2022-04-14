const { GrassCell, HatCell, HoleCell, PlayerCell } = require('./cell.js');
const { randomInteger, numberFromPercentage } = require('./math-functions');
const { indexToPosition, isLastIndexOfDimensionX } = require('./array-functions');

class Field {

  constructor(dimensionX, dimensionY, percentageHoles) {
    
    this._dimensionX = dimensionX;
    this._dimensionY = dimensionY;

    this._array = Field.generateField(dimensionX, dimensionY, percentageHoles);
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

  // Helper functions
  
  static cellFromIndex(array, index) {
    return array[index];
  }

  static findEmptyPosition(array) {
    const emptyCells = Field.getEmptyCells(array);
    const emptyIndex = randomInteger(emptyCells.length);
    return Field.cellFromIndex(emptyCells, emptyIndex);
  }

  static isPositionOutOfField(dimensionX, dimensionY, position) {
    return (
      (position.x < 0) || 
      (position.x >= dimensionX) ||
      (position.y < 0) || 
      (position.y >= dimensionY)
    );
  }

  static replaceCell(array, oldCell, newCell) {
    array[array.indexOf(oldCell)] = newCell;
  }

  static createCellAnywhere(array, cellClass) {
    let emptyCell = Field.findEmptyPosition(array);
    let newCell = new cellClass(emptyCell.position);
    Field.replaceCell(array, emptyCell, newCell);
  }

  static createCellsAnywhere(array, cellClass, times) {
    for (let i = 1; i <= times; i++) {
      Field.createCellAnywhere(array, cellClass);
    }
  }

  static getEmptyCells(array) {
    return array.filter(cell => cell.isEmpty());
  }

  static getPlayerCell(array) {
    return array.find(cell => cell.isPlayer());
  }

  static getCellInPosition(array, position) {
    return array.find(cell => cell.position.x === position.x && cell.position.y === position.y);
  }

  static generateEmptyArray(dimensionX, dimensionY) {
    return Array(dimensionX * dimensionY).fill().map((value, index) => new GrassCell({
      x: indexToPosition(index, dimensionX).x, 
      y: indexToPosition(index, dimensionX).y 
    }));
  }

  static generateField(dimensionX, dimensionY, percentageHoles) {
    let newArray = Field.generateEmptyArray(dimensionX, dimensionY);

    // Blue * character on the start position
    Field.createCellAnywhere(newArray, PlayerCell);
    
    // Red O characters on a number of unoccupied random position
    const numberHoles = numberFromPercentage( dimensionX * dimensionY, percentageHoles);
    Field.createCellsAnywhere(newArray, HoleCell, numberHoles);

    // Yellow ^ character in an unoccupied random position
    Field.createCellAnywhere(newArray, HatCell);

    return newArray;
  }

  static print(array, dimensionX) {
    console.clear();

    array.forEach((cell, index) => {
      process.stdout.write(cell.character);
      if (isLastIndexOfDimensionX(index, dimensionX)) {
        process.stdout.write('\n');
      }
    });
  }
}

module.exports = Field;