import { PlayerScoreHistory, Player, GameScoreHistory, ScoreRound, Score } from '@ok-scoring/data/game-models';
import { generateUuid } from '@ok-scoring/data/generate-uuid';


export function recalcCurrentScoreRecursive<T extends Score<number | Score>>(score: T): T {
  if (!score?.scores) return score;
  // TODO might need to also sort the scores?
  return score.scores.reduce((newScore: T, s): T => {
    let amount: number = 0;
    if (typeof s === 'object' && s.hasOwnProperty('scores')) {
      const innerScore = recalcCurrentScoreRecursive(s);
      newScore.scores.push(innerScore);
      amount = innerScore.score;
    } else if (typeof s === 'number') {
      amount = s as number;
      newScore.scores.push(s)
    }
    newScore.score += amount;
    return newScore;
  }, { ...score, score: score.initialScore || 0, scores: [] });
}

/**
 * @param scoreHistory @deprecated
 */
export function reCalcCurrentScore(scoreHistory: PlayerScoreHistory): PlayerScoreHistory {
  scoreHistory.score = scoreHistory.scores.reduce((sum, s) => sum + s.score, 0);
  return scoreHistory;
}


/**
 * @deprecated use in favor the of an array based history
 */
export function buildInitialHistory(players: Player[], startingScore: number): GameScoreHistory {
  return players.reduce(
    (history, player, playerIndex): GameScoreHistory => ({
      ...history,
      [player.key]: {
        key: generateUuid(),
        playerKey: player.key,
        score: startingScore,
        initialScore: startingScore,
        scores: [],
        order: playerIndex,
      } as PlayerScoreHistory
    }),
    {}
  );
}

export function buildScoreHistory(playerKeys: string[], gameKey: string, startingScore = 0): PlayerScoreHistory[] {
  return playerKeys?.map((playerKey, playerIndex) => ({
    key: generateUuid(),
    playerKey,
    gameKey,
    scores: [],
    score: startingScore,
    initialScore: startingScore,
    order: playerIndex,
  })
  ) || [];
}

export function buildScoreHistoryRounds(scoreHistory: GameScoreHistory): number[] {
  const numberRounds = Math.max(...Object.values(scoreHistory).map(v => v.scores.length));
  return Array.from({ length: numberRounds }, (_, i) => i + 1);
}
