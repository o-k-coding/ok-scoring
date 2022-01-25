import { format } from 'date-fns'

export type WeekDay = 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat' | 'Sun';
export type GameCalculationData = Pick<GameState, 'date' | 'winningPlayerKey'>;
export interface PlayerWins {
    totalWins: number;
    totalGames: number;
}

export interface PlayerStats extends PlayerWins {
    weekDayWinLikelihood: {
        [k in WeekDay]?: PlayerWins;
    }
}

const createAddStats = (playerKey: string) => {
    return ({ totalGames, totalWins }: PlayerWins, winningPlayerKey: string): PlayerWins => {
        return {
            totalGames: totalGames + 1,
            totalWins: totalWins + (winningPlayerKey === playerKey ? 1 : 0),
        };
    }
};

export const calculatePlayerStats = (games: GameCalculationData[], playerKey: string): PlayerStats => {
    const addStats = createAddStats(playerKey);
    return games.reduce(({ weekDayWinLikelihood, ...playerWins }, { date, winningPlayerKey }): PlayerStats => {
        const weekDay = format(new Date(date), 'iii');
        const weekDayStats: PlayerWins = weekDayWinLikelihood[weekDay] ? weekDayWinLikelihood[weekDay] : { totalWins: 0, totalGames: 0 }
        weekDayWinLikelihood[weekDay] = addStats(weekDayStats, winningPlayerKey);
        return {
            ...addStats(playerWins, winningPlayerKey),
            weekDayWinLikelihood,
        };
    }, {
        totalWins: 0,
        totalGames: 0,
        weekDayWinLikelihood: {},
    });
};
