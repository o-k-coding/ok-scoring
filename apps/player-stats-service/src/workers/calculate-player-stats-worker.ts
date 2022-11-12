import { calculatePlayerStats, GameCalculationData, PlayerStats } from '../app/modules/player-stats/player-stats';
import { consumeFromGameQueue } from '../mq';

const db: { [playerKey: string]: PlayerStats } = {

};

function handleGameData(gameData: GameCalculationData) {
  try {
    for (const playerScore of gameData.scoreHistory) {
      const playerStats = db[playerScore.playerKey];
      let games = [gameData];
      if (playerStats?.games) {
        games = [...playerStats.games, gameData]
      }
      const newPlayerStats = calculatePlayerStats(games, playerScore.playerKey);
      db[playerScore.playerKey] = newPlayerStats;
      console.log('successfully updated stats for player', playerScore.playerKey);
    }
  } catch (e) {
    console.error('error updating stats for game');// TODO should have the game id somewhere
  }
}

export async function calculatePlayerStatsWorker() {
  await consumeFromGameQueue(handleGameData)
}
