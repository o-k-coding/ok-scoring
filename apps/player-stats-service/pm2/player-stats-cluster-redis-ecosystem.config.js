module.exports = {
  apps : [
    {
      name: 'player-stats-service-cluster',
      script: 'dist/apps/player-stats-service/main.js',
      instances: 'max',
      autorestart: true,
      max_memory_restart: '1G',
      exec_mode: 'cluster',
      source_map_support: true,
      env: {
        NODE_ENV: 'development',
        // in pm2, each process is run as if it is the main, and pm2 handles all the load balancing etc
        OK_SCORING_PLAYER_STATS_USE_CLUSTER_MODE: false,
        OK_SCORING_PLAYER_STATS_STORE: 'redis',
      },
      env_production: {
        NODE_ENV: 'production',
      }
    },
  ],
};
