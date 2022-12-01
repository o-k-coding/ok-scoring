import { calculatePlayerStats, GameCalculationData } from '../app/modules/player-stats/player-stats';
import { PlayerStatsStore } from '../app/store/store';
import { PlayerStatsQueue } from '../app/queue/queue';


async function handleGameData(gameData: GameCalculationData, store: PlayerStatsStore) {
  try {
    for (const playerScore of gameData.scoreHistory) {
      const playerStats = await store.get(playerScore.playerKey);
      let games = [gameData];
      if (playerStats?.games) {
        games = [...playerStats.games, gameData]
      }
      const newPlayerStats = calculatePlayerStats(games, playerScore.playerKey);
      await store.set(playerScore.playerKey, newPlayerStats)
      console.log('successfully updated stats for player', playerScore.playerKey);
    }
  } catch (e) {
    console.error('error updating stats for game'); // TODO should have the game id somewhere
  }
}

export async function calculatePlayerStatsWorker(queue: PlayerStatsQueue, store: PlayerStatsStore) {
  await queue.connect();
  await queue.consumeGame((gameData: GameCalculationData) => handleGameData(gameData, store))
}
