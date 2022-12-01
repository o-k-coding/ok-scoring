import { GameState, PlayerScoreHistory, ScoreRound } from '@ok-scoring/data/game-models';
import { generateUuid } from '@ok-scoring/data/generate-uuid';

// TODO can definitely make this more flexible, but for now this is good
// Examples
// range that a score can be in
// initial score
// negative vs positive scores
// number of "sub rounds" or scores per round

function generateScoreValue(max = 100): number {
  return Math.floor(Math.random() * max);
}

function generateScores(playerScoreHistoryKey: string, numRounds: number): ScoreRound[] {
  const scores: ScoreRound[] = [];
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

export function generateTestGame({ numPlayers, numRounds } = { numPlayers: 2, numRounds: 4 }): GameState {
  const gameKey = generateUuid();
  const gameState: GameState = {
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
    const playerScoreHistory: PlayerScoreHistory = {
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
