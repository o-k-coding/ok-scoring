// Require the framework and instantiate it
import { runApplication } from './app';
import { runCluster } from './cluster';
// import dbConnector from './plugins/db-connector';


// TODO if cluster mode, use cluster, otherwise just start one.
const useClusterMode = process.env['OK_SCORING_PLAYER_STATS_USE_CLUSTER_MODE'] === 'true';

if (useClusterMode) {
    console.log('Running player stats service in cluster mode')
    runCluster();
} else {
    runApplication();
}
