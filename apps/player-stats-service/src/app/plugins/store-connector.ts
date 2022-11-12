// src/plugins/db.ts
import 'reflect-metadata'
import fp from 'fastify-plugin'
import { FastifyInstance } from 'fastify';
import { PlayerStats } from '../modules/player-stats/player-stats';

export interface PlayerStatsStore {
    get(key: string): PlayerStats,
    set(key: string, stats: PlayerStats): void,
}

class MemoryStore implements PlayerStatsStore {
    private store: { [playerKey: string]: PlayerStats };
    constructor() {
        this.store = {};
    }

    get(key: string): PlayerStats {
        return this.store[key];
    }

    set(key: string, stats: PlayerStats): void {
        this.store[key] = stats;
    }
}

class RedisStore implements PlayerStatsStore {
    // TODO connection to redis
    private store: RedisStore;
    constructor() {
        this.store;
    }

    get(key: string): PlayerStats {
        return this.store[key];
    }

    set(key: string, stats: PlayerStats): void {
        this.store[key] = stats;
    }
}

// TODO this needs to be wired

function buildStore(): PlayerStatsStore {
    // Can be one of 'memory' | 'redis' currently
    const storeType = process.env['OK_SCORING_PLAYER_STATS_STORE'];

    // TODO this could be done better
    if (!['redis', 'memory'].includes(storeType)) {
        console.log('Using an unsupported value for store!! setting to default "memory"', storeType);
    }
    switch (storeType) {
        case 'redis':
            return new RedisStore();
        default:
            return new MemoryStore();
    }
}

const storeConnector = fp(async (fastify: FastifyInstance, opts, done) => {
    try {
        // TODO does the store need a connect function?
        const store = buildStore;
        // this object will be accessible from any fastify server instance
        fastify.decorate('store', store);

    } catch (error) {
        console.log('Error creating store', error)
    }
    done();
})

export default storeConnector;
