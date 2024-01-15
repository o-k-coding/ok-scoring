# Rules Service

Rules CRUD API for OK Scoring. Used to store the rules templates for CRUD operations.

In the whole application structure, the applications can call to this service to get the rule templates available,
including search functionality

## Backlog

- Observability
- Search functionality
- Caching
- Local docker development
- grpc gateway and other practices from simple bank
- refactor to be a cli interface for starting and using the different pieces
- Auth
- Migrations on startup?

## Development notes

Start the service locally using the custom built command runner for nx

```bash
nx run rules-service-go:go-run
```

to convert json file to string for curl command

```bash
cat test/cribbage-rules-template.json | tr -d '\n' | tr -d ' '
```

### Local development with supabase

Local development relies on using the development supabase account

<https://app.supabase.com/project/jmlxqekruomcjlhaeuyq>

### Local development with docker

Start the minimum required backing services
TODO I should create `start-backing-services` target

This service leverages a database (pg), messaging system (kafka or rabbitmq), search system (opensearch) and observability stack (tracing: file or jaeger)
the DB, message and search systems are required to run the service

```bash
yarn ok-scoring:service:up pg
yarn ok-scoring:service:up kafka
yarn ok-scoring:service:up opensearch
```

First, must make sure that the user, db and extensions exist in the DB

```sql
create user "ok-scoring-user" with password <password>;
create database "ok-scoring-rules";
grant ALL on database "ok-scoring-rules" to "ok-scoring-user";
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
```

Then run the migrations

```bash
make migratedb
```

Then run the service

```bash
yarn rules-service:go
```

### DB

Install a driver

```bash
go get -u github.com/lib/pq
```

#### Migrations

NOTE, migrations expect the ok-scoring-rules db to already exist in the pg db. This currently needs to be created manually the first time in local development.

Using <https://github.com/golang-migrate/migrate/tree/master/cmd/migrate>

used "Go Toolchain" to install, all other methods failed for me in WSL2 lol.

```bash
go install -tags 'postgres' github.com/golang-migrate/migrate/v4/cmd/migrate@latest
```

```bash
make generatemigration <migration_name>
```

note -seq adds a sequence number to the schema.

to run migrations

- manually

```bash
make migratedb
```

If you get an error on applying migrations

```text
2023/01/30 12:10:49 error: Dirty database version 1. Fix and force version.
```

you need to...

### Supabase

```bash
supabase start
```

this starts the local dev environment, currently not used

### Kafka

To connect to the container and use the cli

```bash
docker exec -it ok-scoring-kafka "bash"
```

Testing consuming messages from the producer

```bash
kafka-console-consumer.sh --bootstrap-server 127.0.0.1:9093 --topic favoriterulestemplates --group ok-scoring-rules-service
```

Then use `apps/rules-service-go/test/rules-templates.http` to send a message to the queue

When tearing down, right now I need to run

```bash
docker-compose -f ./infrastructure/ok-scoring-development/OK.Scoring.kafka.docker-compose.yml rm
docker volume rm  ok-scoring-development_ok-scoring-kafka
```

In order for it to work... persistence does not work between sessions.

Ideally, the process for the kafka consumption would be separate, and could have more than 1 process to increase consumer throughput.
Would do some load testing with the DB to figure out what our max could be. and also figure out how many partitions to have.

#### Rules templates sent to opensearch

go client for open search <https://opensearch.org/docs/latest/clients/go/>

docker open search <https://opensearch.org/docs/latest/install-and-configure/install-opensearch/docker/>

### Observability

#### Open telemetry

<https://opentelemetry.io/docs/instrumentation/go/getting-started/>

when installing an sdk, install the jaeger exporter

```bash
go get go.opentelemetry.io/otel/sdk \
         go.opentelemetry.io/otel/exporters/jaeger
```

Basic way to test tracing

##### Save Traces To File

```bash
TRACE_TYPE=console
CONSOLE_TRACE_FILE_PATH=traces.txt
```

By default traces.txt will be saved locally and is in the gitignore file.

1. start the service

  ```bash
  yarn rules-service:go
  ```

2. send a few requests (a few needed because of sampling) to fetch one template this one is instrumented

[curl requests](./test/rules-templates.http)

1. Open the [traces.json](./src/cmd/api/traces.json) file
2. Explore the traces file

TODO I have been exploring

How to convert the file format from open telemetry go into jaegers format
use the script `convert-trace-json-for-jaeger.js`

relevant links

- <https://github.com/open-telemetry/opentelemetry-go/issues/3588>

Start the observability stack with jaeger
navigate to the [UI](http://localhost:16686/search) and select `JSON File`
upload `traces.json`
profit

##### Save Traces To Jaeger

set env variables

```bash
TRACE_TYPE=jaeger
TRACE_AGENT_PORT=6831
TRACE_AGENT_HOST=localhost
```

1. start the obs stack locally with docker compose

```bash
yarn ok-scoring:service:up observability
```

2. navigate to jaeger UI locally <http://localhost:16686/search>
3. start the service

```bash
yarn rules-service:go
```

4. send a few requests (a few needed because of sampling) to fetch one template this one is instrumented

[curl requests](./test/rules-templates.http)

1. Wait a bit of time and search in the UI

TODO this is not currently working with jaeger. I am going to follow the tutorial for outputting to a file first.
Run it like the events etc. have options. Then implement the jaeger version.
