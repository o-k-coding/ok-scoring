# Rules Service

Rules CRUD API for OK Scoring. Used to store the rules templates for CRUD operations.

In the whole application structure, the applications can call to this service to get the rule templates available,
including search functionality

## Backlog

- Observability
- Search functionality
- Caching
- Local docker development

## Development notes

Start the service locally using the custom built command runner for nx

```bash
nx run rules-service-go:go-run
```

### Local development with supabase

Local development relies on using the development supabase account

<https://app.supabase.com/project/jmlxqekruomcjlhaeuyq>

### Local development with docker

TODO

### DB

Install a driver

```bash
go get -u github.com/lib/pq
```

### Supabase

```bash
supabase start
```

this starts the local dev environment, currently not used
