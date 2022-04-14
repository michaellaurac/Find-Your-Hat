const { remainderDivisionMByN, quotientDivisionMByN, randomInteger } = require('./math-functions');

function indexToPosition(index, dimensionX) {
  return {
    x: remainderDivisionMByN(index, dimensionX),
    y: quotientDivisionMByN(index, dimensionX)
  };
}

function positionToIndex(position, dimensionX) {
  return (position.y * dimensionX) + position.x ;
}

function isLastIndexOfDimensionX(index, dimensionX) {
  return remainderDivisionMByN(index, dimensionX) === ( dimensionX - 1 );
}

function randomIndex(array) {
  return randomInteger(array.length);
}

module.exports.indexToPosition = indexToPosition;
module.exports.positionToIndex = positionToIndex;
module.exports.isLastIndexOfDimensionX = isLastIndexOfDimensionX;
module.exports.randomIndex = randomIndex;