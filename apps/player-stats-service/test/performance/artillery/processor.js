const uuid = require('react-native-uuid').default;


// TODO import the function, need to switch this to TS so I can do the things properly
// Not sure if it would work properly though
// For now, duplicating the functionality from \
// libs/data/game-test-data/src/lib/generate-test-game.ts
// libs/data/generate-uuid/src/lib/generate-uuid.ts


function generateUuid() {
  return uuid.v4().toString();
}


function generateScoreValue(max = 100) {
  return Math.floor(Math.random() * max);
}

function generateScores(playerScoreHistoryKey, numRounds) {
  const scores = [];
  for (let i = 0; i < numRounds; i++) {
    const scoreValue = generateScoreValue();
    scores.push({
      key: generateUuid(),
      playerScoreHistoryKey,
      score: scoreValue,
      initialScore: 0,
      order: i,
      scores: [
        scoreValue
      ]
    })
  }
  return scores;
}

function generateTestGame({ numPlayers, numRounds } = { numPlayers: 2, numRounds: 4 }) {
  const gameKey = generateUuid();
  const gameState = {
    key: gameKey,
    date: Date.now(),
    description: 'Test Game',// TODO some random string attachment
    scoreHistory: [],
  };
  let winningPlayerKey;
  let winningPlayerScore = 0;
  for (let i = 0; i < numPlayers; i++) {
    const playerScoreHistoryKey = generateUuid();
    const playerKey = generateUuid();
    const scores = generateScores(playerScoreHistoryKey, numRounds);
    const playerScore = scores.reduce((total, score) => total + score.score, 0);
    if (playerScore > winningPlayerScore) {
      winningPlayerKey = playerKey;
      winningPlayerScore = playerScore;
    }
    const playerScoreHistory = {
      key: playerScoreHistoryKey,
      playerKey,
      gameKey,
      score: playerScore,
      initialScore: 0,
      order: i,
      scores,
    };
    gameState.scoreHistory?.push(playerScoreHistory);
  }
  gameState.winningPlayerKey = winningPlayerKey
  return gameState
}

function generateGameData(requestParams, ctx, ee, next) {
  ctx.vars.data = generateTestGame();

  return next();
}

module.exports = {
  generateGameData,
};

// For testing the output. Run node apps/player-stats-service/test/performance/artillery/processor.js
// console.log('testing!');
// const game = generateTestGame();
// console.log(game);
