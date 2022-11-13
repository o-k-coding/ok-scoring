module.exports = {
  apps : [
    {
      name: 'player-stats-service',
      script: 'dist/apps/player-stats-service/main.js',
      instances: 2,
      autorestart: true,
      max_memory_restart: '1G',
      exec_mode: 'cluster',
      source_map_support: true,
      env: {
        NODE_ENV: 'development',
        // in pm2, each process is run as if it is the main, and pm2 handles all the load balancing etc
        OK_SCORING_PLAYER_STATS_USE_CLUSTER_MODE: false,
        OK_SCORING_PLAYER_STATS_STORE: 'redis',
        OK_SCORING_PLAYER_STATS_QUEUE: 'redis',
      },
      env_production: {
        NODE_ENV: 'production',
      }
    },
    // For a more complex setup, could have multiple workers and load balance which messages go to which consumer somehow
    {
      name: 'player-stats-worker',
      script: 'dist/apps/player-stats-service/main.js',
      instances: 1,
      source_map_support: true,
      env: {
        NODE_ENV: 'development',
        OK_SCORING_PLAYER_STATS_USE_QUEUE_WORKER: true,
        OK_SCORING_PLAYER_STATS_QUEUE: 'redis',
        OK_SCORING_PLAYER_STATS_STORE: 'redis',
        OK_SCORING_PLAYER_STATS_USE_CLUSTER_MODE: false,
      },
      env_production: {
        NODE_ENV: 'production',
      }
    },
  ],
};
