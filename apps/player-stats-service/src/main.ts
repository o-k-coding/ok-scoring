// Require the framework and instantiate it
import { runApplication } from './app';
import { runCluster } from './cluster';
import { calculatePlayerStatsWorker } from './workers/calculate-player-stats-worker';

// TODO if cluster mode, use cluster, otherwise just start one.
const useClusterMode = process.env['OK_SCORING_PLAYER_STATS_USE_CLUSTER_MODE'] === 'true';
const useQueueWorker = process.env['OK_SCORING_PLAYER_STATS_USE_QUEUE_WORKER'] === 'true';

// TODO it would be better to move the worker into a separate node app in nx lol
if (useQueueWorker) {
    calculatePlayerStatsWorker();
} else if (useClusterMode) {
    console.log('Running player stats service in cluster mode')
    runCluster();
} else {
    runApplication();
}
