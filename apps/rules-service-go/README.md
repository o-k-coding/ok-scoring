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

First, must make sure that the db `ok-scoring-rules` exists in the DB

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

Basic way to test if tracing is working.

1. start the obs stack locally with docker compose

```bash
yarn ok-scoring:service:up observability
```

2. navigate to jaeger UI locally <http://localhost:16686/search>
3. start the service

```bash
yarn rules-service:go
```

4. send a few requests (a few needed because of sampling) to ... this one is instrumented
5. Wait a bit of time and search in the UI
