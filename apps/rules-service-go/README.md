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

## Development notes

Start the service locally using the custom built command runner for nx

```bash
nx run rules-service-go:go-run
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

Using <https://github.com/golang-migrate/migrate/tree/master/cmd/migrate>

used "Go Toolchain" to install, all other methods failed for me in WSL2 lol.

```bash
go install -tags 'postgres' github.com/golang-migrate/migrate/v4/cmd/migrate@latest
```

```bash
migrate create -ext sql -dir db/migrations -seq init_schema
```

note -seq adds a sequence number to the schema.

to run migrations

- manually

```bash
source .env
migrate -path db/migrations -database "postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@${POSTGRES_HOST}:${POSTGRES_PORT}/${POSTGRES_DB}?sslmode=disable" -verbose up
```

### Supabase

```bash
supabase start
```

this starts the local dev environment, currently not used
