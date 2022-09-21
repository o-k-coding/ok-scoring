// TODO currently these types works as a recursive structure, but now that I have walked away and come back
// I am finding it harder to understand which ones are used in which scenarios.
// If I can break them apart into specifically a score and a score round, that might be better. Best thing on it further

export interface Score<T = number> {
    // Any scores that make up this score
    // score - relevant if multiple scores are received per round like in cribbage
    // score round - relevant in a game with multiple rounds/hands/turns etc.
    // score history - relevant in any game, each object corresponds to a unique player in the game
    scores: T[];
    // Tracks the score received
    score: number;
    // Tracks the score that you start with before doing anything
    // score - not sure the relevance at this level
    // score round - the score a player starts with at the beginning of a round, maybe you start with 10 points then can gain or lose them during a round based on what happens
    // score history - the score a player starts with at the beginning of a game
    initialScore?: number;
    // 0 indexed, used to determine the order of
    // score - relevant if multiple scores per round like in cribbage
    // score round - relevant to show the order the rounds happened, round 1, round 2 etc.
    // score history - which is used to determine what order the players go in
    order: number;
}
