# Ok Scoring web mono repo

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

## Tasks

Phase 1, get the code I have working and deployed

- Move Ok Scoring PY into this repo []
- Figure out deployments for the APIs []

Phase 2 improve code I have working

Phase 3 transition/duplication

- Port models from python [x]
- Connect typeorm entities to a db...
- Port e2e API tests from python
- Port app logic from python
- Port routes from python
- Fix fastify generator
- Update fastify
- integrate data layer for fauna for services
- authentication
- player stats service (ml)
- Logging and tracing
- Set up web app for game states
- Create json schema form generator
- Integrate mobile app and backend services
- Update color scheme to rose pine??
- Chakra UI for rules UI

## Using fastify generators

## Creating a fastify ts backend with nx

nx generate @nrwl/node:app myapp
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

```
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
nx g @nrwl/react:library
```

## React Native

Guide blog post
<https://blog.nrwl.io/step-by-step-guide-on-creating-a-monorepo-for-react-native-apps-using-nx-704753b6c70e>

### React native dependencies that might require work

- `@expo/vector-icons`
- react-native-responsive-screen
- react-native-svg?

### Running Ok scoring mobile

```bash
npx nx run-ios ok-scoring-mobile
npx nx run-android ok-scoring-mobile
```

TODO need to convert all touchable opacity to pressable in mobile app... Also take a look at animations for those.

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

## Creating a non JS/TS application

Creating a Go application for example

First create a blank node application

```bash
npx nx g @nrwl/node:app app-name
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

ok-scoring postgres db

```bash
docker compose -f apps/game-service/docker-compose.yml up -d
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

#### Workspace error

If you see this error

```text
error Running this command will add the dependency to the workspace root rather than the workspace itself, which might not be what you want - if you really meant it, make it explicit by running this command again with the -W flag (or --ignore-workspace-root-check).
```

just run the yarn command with `-W` this will work

## Authentication/Authorization

OK Scoring uses Auth0 for authentication and authorization.
