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
kafka-console-consumer.sh --bootstrap-server 127.0.0.1:9093 --create
```
