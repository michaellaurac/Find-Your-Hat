function randomInteger(integer) {
  return Math.floor( Math.random() * integer);
}

function remainderDivisionMByN(m, n) {
  return m % n;
}

function quotientDivisionMByN(m, n) {
  return Math.floor( m / n );
}

function numberFromPercentage(total, percentage) {
  return Math.floor( total * percentage / 100);
}

module.exports.randomInteger = randomInteger;
module.exports.remainderDivisionMByN = remainderDivisionMByN;
module.exports.quotientDivisionMByN = quotientDivisionMByN;
module.exports.numberFromPercentage = numberFromPercentage;