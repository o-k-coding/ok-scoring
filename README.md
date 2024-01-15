# Ok Scoring web mono repo

## Updating nx

most nx major versions require migrations of configurations etc.

https://nx.dev/recipes/tips-n-tricks/advanced-update

```bash
yarn nx migrate latest
yarn nx migrate --run-migrations
# remove migrations.json and commit
```

## Contributions

This project uses yarn, if you do not have it installed then please do so!

### Node >=v16.10

Yarn should be managed via `corepack`. Run the enable command in the project dir and you should be good to go

```bash
corepack enable
yarn install
```

### Node < v16.10

```bash
npm i -g yarn
```

### Running an app locally

Most apps can be run using a package script, passing the app name to the nx command.
The project name is the name of the app directory, and is also the key for the project in the workspace.json file.

```bash
yarn start <project_name>
# example
yarn start player-stats-service
```

## Tasks

- Port models from python [x]
- Connect typeorm entities to a db...
- Port e2e API tests from python
- Port app logic from python -> go and ts (fastify)
- Port routes from python
- Fix fastify generator
- Update fastify
- integrate data layer for fauna for services
- authentication
- player stats service (ml)
- Logging and tracing!!
- Metrics!
- Set up web app for game states
- Create json schema form generator
- Integrate mobile app and backend services
- Update color scheme to rose pine??
- Chakra UI for rules UI
- Create an grpc gateway API, and create a test using ghz, along with graphing.
- deploying everything
- port landing page to astro or svelte

## Using fastify generators

## Creating a fastify ts backend with nx

nx generate @nx/node:app myapp
npm install fastify-cli --global
npm i fastify --save

```json
{
  "name": "ticket-auth-service",
  "version": "1.0.0",
  "description": "",
  "main": "app.ts",
  "directories": {
    "test": "test"
  },
  "scripts": {
    "test": "tap test/**/*.test.ts",
    "start": "npm run build:ts && fastify start -l info dist/app.js",
    "build:ts": "tsc",
    "dev": "tsc && concurrently -k -p \"[{name}]\" -n \"TypeScript,App\" -c \"yellow.bold,cyan.bold\"  \"tsc -w\" \"fastify start -w -l info -P dist/app.js\""
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "dependencies": {
    "fastify": "^3.0.0",
    "fastify-plugin": "^2.0.0",
    "fastify-autoload": "^3.0.2",
    "fastify-cli": "^2.0.2"
  },
  "devDependencies": {
    "@types/node": "^14.0.18",
    "concurrently": "^5.1.0",
    "tap": "^14.0.0",
    "typescript": "^3.9.6"
  }
}
```

typeorm and pg

```bash
npm install typeorm pg reflect-metadata --save
```

docker run -d --name ok-scoring -p 5432:5432 -e POSTGRES_PASSWORD=ok-scoring-dev postgres:11.5

docker exec -it ok-scoring psql -U postgres -c "create database ok-scoring"
Using 11.5 because 12 has a bug with typeorm :(

User will have game stats

game stats will have

<https://dev.to/carlbarrdahl/building-a-rest-api-using-fastify-and-typeorm-39bp>

going to build out the following services

players
games
stats
game-templates

`/Users/letheras/Desktop/Dev/repos/udemy/ok-scoring-web/node_modules/.bin/tsc -p /Users/letheras/Desktop/Dev/repos/udemy/ok-scoring-web/tools/tsconfig.tools.json`

## Deploying landing page to netlify

<https://www.netlify.com/blog/2020/04/21/deploying-nx-monorepos-to-netlify/>

## Useful nx commands

Installing nx cli globally

```bash
npm i -g @nrwl/cli
```

Creating a library

Vanilla

```bash
nx g lib my-lib
```

React

```bash
nx g @nx/react:library
```

## React Native

Guide blog post
<https://blog.nrwl.io/step-by-step-guide-on-creating-a-monorepo-for-react-native-apps-using-nx-704753b6c70e>

### React native dependencies that might require work

- `@expo/vector-icons`
- react-native-responsive-screen
- react-native-svg?

### Running Ok scoring mobile

TODO list

- need to convert all touchable opacity to pressable in mobile app... Also take a look at animations for those.

```bash
yarn ok-scoring:ios
yarn ok-scoring:android
```

If everything is bonkers trying to build and run the mobile apps (especially on a fresh environment or with updated deps)

try upgrading

```bash
nx generate @nx/react-native:upgrade-native ok-scoring-mobile
```

#### IOS

requires cocoapods, I specify an erlier version because newer ones don't work with the built in ruby version on my current macbook

```bash
sudo gem install cocoapods -v 1.11.3
```

#### Android

First install android studio

Currently we rely on NDK (side by side), so fo to apps/ok-scoring-mobile/android/build.gradle to find the correct version, and make sure you have that installed in the SDK Tools section of android studio SDK manager

## Generator history

Generating backend entity library. This is considered a data library because it is low level specifics of defining the data access and validation for backend game data
it relies on the game-models and other data access specific logic.

The data-access would be the raw data

```bash
nx g lib data/game-entities
```

## Creating Remix frontend

Note the plugin for this is in beta

```bash
yarn add -D @nrwl/remix
npx nx g @nrwl/remix:setup
npx nx g @nrwl/remix:app ok-scoring-rules-ui
```

Had to add `scripts` to the app package.json

```json
    "build": "npx remix build",
    "dev": "npx remix dev",
    "postinstall": "npx remix setup node",
    "start": "npx remix-serve build"
```

## Creating a non JS/TS application

Creating a Go application for example

First create a blank node application

```bash
npx nx g @nx/node:app app-name
```

clean out the folder

### GO

run go mod init in the folder to init a module

### Workspace changes

add a target to the workspace json to run the go code.

```bash
nx run rules-service-go:go-run
```

## Docker containers

any of the local docker containers can be started and stopped using the command.

Simply pass the name of the name of the compose file from `infrastructure/ok-scoring-development`

example

```bash
yarn ok-scoring:service:up pg
yarn ok-scoring:service:down pg
```

### Postgres

If you are starting from a fresh volume you may (likely) get the following error

```bash
2023/01/30 11:40:24 error: pq: role "ok-scoring-user" does not exist
```

Initial setup requires you to create this user currently

connect to the db using the default creds of `postgres/postgres` and create the user.

For each service, a different DB is used, so connect to the db with user and password in `.env.development` and create the db as well

```sql
create database "ok-scoring-rules";
```

## Python

To enter the virtual environment

```bash
cd apps/game-service-py/
source .venv/bin/activate
```

Install packages from requirements.txt

```bash
pip3 install -r requirements.txt
```

## Chakra UI

OK Scoring is using the Chakra UI component library for web styling

One note, the remix build says

```bash
The path "@emotion/cache" is imported in app/createEmotionCache.ts but @emotion/cache is not listed in your package.json dependencies. Did you forget to install it?
```

this is not a package installed, it is already included... the build is just confused it seems.

## Yarn

### Troubleshooting

## Kafka

<https://github.com/conduktor/kafka-stack-docker-compose>

### Workspace error

If you see this error

```text
error Running this command will add the dependency to the workspace root rather than the workspace itself, which might not be what you want - if you really meant it, make it explicit by running this command again with the -W flag (or --ignore-workspace-root-check).
```

just run the yarn command with `-W` this will work

## Authentication/Authorization

OK Scoring uses Auth0 for authentication and authorization.

## Data

Currently data for the mobile app is stored in a local sqlite db.
data for the services is stored in postgres, running in supabase or faunadb
caching is done in redis and can be used by any of the apps, or services.

to generate a new library for data access

```bash
nx g @nx/node:lib data/redis
```

## UI Components

to generate a new library for components

```bash
nx g @nx/react:lib components/react/web
```

## OK Scoring Mobile

## OK Scoring Web

Remix web app

```bash
yarn nx g @nx/remix:app ok-scoring-web --directory apps/ok-scoring-web
yarn nx g @nx/remix:lib scoring-web-landing --directory=libs/features/scoring-web-landing
yarn nx g @nx/remix:lib scoring-web-landing --directory=libs/features/scoring-web-game
yarn nx g @nx/remix:lib scoring-web-landing --directory=libs/features/scoring-web-rules

yarn nx serve ok-scoring-web
```

## OK Scoring Rules UI

This is a remix web application that is used as a web interface for game rules.
It uses the rules-service as a backend, which uses postgres as a data source.

To run dev server locally

```bash
yarn nx dev ok-scoring-rules-ui
```

## OK Scoring Rules Service
