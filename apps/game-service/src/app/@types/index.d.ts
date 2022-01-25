import fastify from 'fastify';
import { OkScoringDB } from '../src/plugins/db-connector'
declare module 'fastify' {
    export interface FastifyInstance<
        HttpServer = Server,
        HttpRequest = IncomingMessage,
        HttpResponse = ServerResponse,
        > {
        db: OkScoringDB;
    }
}
