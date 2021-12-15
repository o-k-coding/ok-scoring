import { Score, ScoreRound } from '@ok-scoring/features/game-models';
import { buildScoreHistory, recalcCurrentScoreRecursive } from './player-score-history-fns';

describe('buildScoreHistory', () => {
  it('should return an empty array if no player keys passed', () => {
    expect(buildScoreHistory([], 'one')).toEqual([]);
  });

  it('should create one score history for each player in the same order', () => {
    expect(buildScoreHistory(['one', 'two', 'four',], 'one')).toEqual([
      { playerKey: 'one', gameKey: 'one', scores: [], score: 0, order: 0, },
      { playerKey: 'two', gameKey: 'one', scores: [], score: 0, order: 1, },
      { playerKey: 'four', gameKey: 'one', scores: [], score: 0, order: 2, },
    ]);
  });

  it('should create one score history for each player with a starting score', () => {
    expect(buildScoreHistory(['one', 'two', 'four',], 'one', 100)).toEqual([
      { playerKey: 'one', gameKey: 'one', scores: [], score: 100, order: 0, },
      { playerKey: 'two', gameKey: 'one', scores: [], score: 100, order: 1, },
      { playerKey: 'four', gameKey: 'one', scores: [], score: 100, order: 2, },
    ]);
  });
});

fdescribe('recalcCurrentScoreRecursive', () => {
  it('should do nothing if no score passed', () => {
    const result = recalcCurrentScoreRecursive(null);
    expect(result).toBeNull();
  });

  it('should do nothing if no scores exist', () => {
    const score: Score = {
      score: 10,
      scores: null,
      order: 0
    };
    const result = recalcCurrentScoreRecursive(score);
    expect(result).toBe(score);
    expect(result).toEqual(score);
  });

  it('should handle an empty scores array', () => {
    const score: Score = {
      score: 10,
      scores: [],
      order: 0
    };
    const result = recalcCurrentScoreRecursive(score);
    // Function should treat the score immutably
    expect(result).not.toBe(score);
    expect(result).toEqual({
      score: 0,
      scores: [],
      order: 0
    });
  });


  it('should handle an empty scores array and honor the initial score', () => {
    const score: Score = {
      score: 10,
      initialScore: 10,
      scores: [],
      order: 0
    };
    const result = recalcCurrentScoreRecursive(score);
    // Function should treat the score immutably
    expect(result).not.toBe(score);
    expect(result).toEqual(score);
  });

  it('should recalculate with an array of numbers and no initial score', () => {
    const score: Score = {
      score: 100,
      scores: [10, 15, -5, 11, 42, -7, 21],
      order: 0
    };
    const result = recalcCurrentScoreRecursive(score);
    // Function should treat the score immutably
    expect(result).not.toBe(score);
    expect(result.scores).not.toBe(score.scores);
    expect(result).toEqual({
      score: 87,
      scores: [10, 15, -5, 11, 42, -7, 21],
      order: 0
    });
  });

  it('should recalculate with an array of numbers and an initial score', () => {
    const score: Score = {
      score: 100,
      initialScore: 100,
      scores: [10, 15, -5, 11, 42, -7, 21],
      order: 0
    };
    const result = recalcCurrentScoreRecursive(score);
    // Function should treat the score immutably
    expect(result).not.toBe(score);
    expect(result.scores).not.toBe(score.scores);
    expect(result).toEqual({
      score: 187,
      initialScore: 100,
      scores: [10, 15, -5, 11, 42, -7, 21],
      order: 0
    });
  });

  it('should recalculate with an array of scores and no initial score', () => {
    const score: Score<Score> = {
      score: 100,
      scores: [
        { score: 10, scores: [5, 5,], order: 0 },
        { score: 15, scores: [5, 5, 5,], order: 1 },
        { score: -5, scores: [-5], order: 2 },
        { score: 11, scores: [10, 1], order: 3 },
        { score: 42, scores: [42], order: 4 },
        { score: -7, scores: [5, -12], order: 5 },
        { score: 21, scores: [42, -21], order: 6 },
      ],
      order: 0
    };
    const result = recalcCurrentScoreRecursive(score);
    // Function should treat the score immutably
    expect(result).not.toBe(score);
    expect(result.scores).not.toBe(score.scores);
    result.scores.forEach((s, i) => {
      expect(s).not.toBe(score.scores[i]);
      expect(s).toEqual(score.scores[i]);
    });
    expect(result).toEqual({
      score: 87,
      scores: [
        { score: 10, scores: [5, 5,], order: 0 },
        { score: 15, scores: [5, 5, 5,], order: 1 },
        { score: -5, scores: [-5], order: 2 },
        { score: 11, scores: [10, 1], order: 3 },
        { score: 42, scores: [42], order: 4 },
        { score: -7, scores: [5, -12], order: 5 },
        { score: 21, scores: [42, -21], order: 6 },
      ],
      order: 0
    });
  });

  it('should recalculate with an array of scores and initial score', () => {
    const score: Score<Score> = {
      score: 100,
      initialScore: 100,
      scores: [
        { score: 10, scores: [5, 5,], order: 0 },
        { score: 15, scores: [5, 5, 5,], order: 1 },
        { score: -5, scores: [-5], order: 2 },
        { score: 11, scores: [10, 1], order: 3 },
        { score: 42, scores: [42], order: 4 },
        { score: -7, scores: [5, -12], order: 5 },
        { score: 21, scores: [42, -21], order: 6 },
      ],
      order: 0
    };
    const result = recalcCurrentScoreRecursive(score);
    // Function should treat the score immutably
    expect(result).not.toBe(score);
    expect(result.scores).not.toBe(score.scores);
    result.scores.forEach((s, i) => {
      expect(s).not.toBe(score.scores[i]);
      expect(s).toEqual(score.scores[i]);
    });
    expect(result).toEqual({
      score: 187,
      initialScore: 100,
      scores: [
        { score: 10, scores: [5, 5,], order: 0 },
        { score: 15, scores: [5, 5, 5,], order: 1 },
        { score: -5, scores: [-5], order: 2 },
        { score: 11, scores: [10, 1], order: 3 },
        { score: 42, scores: [42], order: 4 },
        { score: -7, scores: [5, -12], order: 5 },
        { score: 21, scores: [42, -21], order: 6 },
      ],
      order: 0
    });
  });

  it('should recalculate inner scores', () => {
    const score: Score<Score> = {
      score: 100,
      scores: [
        { score: 10, scores: [5], order: 0 },
        { score: 15, scores: [5, 5], order: 1 },
        { score: -5, scores: [-5], order: 2 },
        { score: 11, scores: [1], order: 3 },
        { score: 42, scores: [42], order: 4 },
        { score: -7, scores: [5], order: 5 },
        { score: 21, scores: [42, -21], order: 6 },
      ],
      order: 0
    };
    const result = recalcCurrentScoreRecursive(score);
    // Function should treat the score immutably
    expect(result).not.toBe(score);
    expect(result.scores).not.toBe(score.scores);
    result.scores.forEach((s, i) => {
      expect(s).not.toBe(score.scores[i]);
    });
    expect(result).toEqual({
      score: 79,
      scores: [
        { score: 5, scores: [5], order: 0 },
        { score: 10, scores: [5, 5], order: 1 },
        { score: -5, scores: [-5], order: 2 },
        { score: 1, scores: [1], order: 3 },
        { score: 42, scores: [42], order: 4 },
        { score: 5, scores: [5], order: 5 },
        { score: 21, scores: [42, -21], order: 6 },
      ],
      order: 0
    });
  });
});
