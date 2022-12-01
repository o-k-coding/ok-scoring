import { format } from 'date-fns'
import { GameState } from '@ok-scoring/data/game-models';

export type WeekDay = 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat' | 'Sun';
// This type should be the required data accepted by the API to recalculate player stats
// Should contain: winning player, all players, date and score data
export type GameCalculationData = Pick<GameState, 'date' | 'winningPlayerKey' | 'scoreHistory'>

export interface PlayerGameCounts {
    totalWins: number;
    totalGames: number;
}

export interface PlayerStats extends PlayerGameCounts {
    games: GameCalculationData[];
    weekDayWinLikelihood: {
        [k in WeekDay]?: PlayerGameCounts;
    }
}

// Closure to create an add stats function for a given player
const createAddStats = (playerKey: string) => {
    return ({ totalGames, totalWins }: PlayerGameCounts, winningPlayerKey: string): PlayerGameCounts => {
        return {
            totalGames: totalGames + 1,
            totalWins: totalWins + (winningPlayerKey === playerKey ? 1 : 0),
        };
    }
};

export const calculatePlayerStats = (games: GameCalculationData[], playerKey: string): PlayerStats => {
    const addStats = createAddStats(playerKey);
    return games.reduce(({ weekDayWinLikelihood, games, ...playerWins }, game): PlayerStats => {
        // TODO this comes through as a string right now
        const weekDay = format(Number(game.date), 'iii');
        const weekDayStats: PlayerGameCounts = weekDayWinLikelihood[weekDay] ? weekDayWinLikelihood[weekDay] : { totalWins: 0, totalGames: 0 }
        weekDayWinLikelihood[weekDay] = addStats(weekDayStats, game.winningPlayerKey);
        return {
            ...addStats(playerWins, game.winningPlayerKey),
            games: [...games, game],
            weekDayWinLikelihood,
        };
    }, {
        totalWins: 0,
        totalGames: 0,
        games: [],
        weekDayWinLikelihood: {},
    });
};
