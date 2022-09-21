// import { calculatePlayerStats, GameCalculationData } from './player-stats';

// // TODO adjust tests to use date number
// describe('Player Stats Functions', () => {
//     const testPlayerOneKey = 'f3a96d83-4c0d-4739-8a49-48115a26f57d';
//     const testPlayerTwoKey = 'b2c50e39-5b5e-4b4e-9ea6-34fab6cd4b7d';
//     const gameScenarioOne: GameCalculationData[] = [
//         { date: '10/25/2020', winningPlayerKey: testPlayerOneKey },
//         { date: '10/26/2020', winningPlayerKey: testPlayerOneKey },
//         { date: '10/27/2020', winningPlayerKey: testPlayerOneKey },
//         { date: '10/28/2020', winningPlayerKey: testPlayerOneKey },
//         { date: '10/29/2020', winningPlayerKey: testPlayerOneKey },
//         { date: '10/30/2020', winningPlayerKey: testPlayerOneKey },
//         { date: '10/31/2020', winningPlayerKey: testPlayerOneKey },
//     ];
//     describe('calculatePlayerStats', () => {
//         it('should calculate if no games', () => {
//             const stats = calculatePlayerStats([], testPlayerOneKey);
//             expect(stats).toEqual({
//                 totalGames: 0,
//                 totalWins: 0,
//                 weekDayWinLikelihood: {},
//             });
//         });

//         it('should calculate stats for games where player wins all of them', () => {
//             const stats = calculatePlayerStats(gameScenarioOne, testPlayerOneKey);
//             const weekDayStats = {
//                 totalWins: 1,
//                 totalGames: 1,
//             };
//             expect(stats).toEqual({
//                 totalGames: 7,
//                 totalWins: 7,
//                 weekDayWinLikelihood: {
//                     'Mon': weekDayStats,
//                     'Tue': weekDayStats,
//                     'Wed': weekDayStats,
//                     'Thu': weekDayStats,
//                     'Fri': weekDayStats,
//                     'Sat': weekDayStats,
//                     'Sun': weekDayStats,
//                 },
//             });
//         });

//         it('should calculate stats for games where player loses all of them', () => {
//             const stats = calculatePlayerStats(gameScenarioOne, testPlayerTwoKey);
//             const weekDayStats = {
//                 totalWins: 0,
//                 totalGames: 1,
//             };
//             expect(stats).toEqual({
//                 totalGames: 7,
//                 totalWins: 0,
//                 weekDayWinLikelihood: {
//                     'Mon': weekDayStats,
//                     'Tue': weekDayStats,
//                     'Wed': weekDayStats,
//                     'Thu': weekDayStats,
//                     'Fri': weekDayStats,
//                     'Sat': weekDayStats,
//                     'Sun': weekDayStats,
//                 },
//             });
//         });
//     });
// });
