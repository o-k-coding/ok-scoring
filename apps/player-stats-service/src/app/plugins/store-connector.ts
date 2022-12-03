// src/plugins/db.ts
import 'reflect-metadata'
import fp from 'fastify-plugin'
import { FastifyInstance } from 'fastify';
import { buildStore } from '../store/store';

const storeConnector = fp(async (fastify: FastifyInstance, opts, done) => {
    try {
        // TODO does the store need a connect function?
        const store = buildStore();
        // TODO disconnect?
        await store.connect();
        // this object will be accessible from any fastify server instance
        fastify.decorate('store', store);

    } catch (error) {
        console.log('Error creating store', error)
    }
    done();
})

export default storeConnector;
