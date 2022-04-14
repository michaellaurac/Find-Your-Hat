const Game = require('./modules/game');

const myGame = new Game(+process.argv[2], +process.argv[3], +process.argv[4]);
myGame.startGame();


