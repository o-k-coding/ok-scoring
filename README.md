# Ok Scoring web mono repo

## Tasks

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

## React native dependencies that might require work

- `@expo/vector-icons`
- react-native-responsive-screen
- react-native-svg?

## Running Ok scoring mobile

```bash
npx nx run-ios ok-scoring-mobile
npx nx run-android ok-scoring-mobile
```

TODO need to convert all touchable opacity to pressable in mobile app... ALso take a look at animations for those.

## Generator history

Generating backend entity library. This is considered a data library because it is low level specifics of defining the data access and validation for backend game data
it relies on the game-models and other data access specific logic.

The data-access would be the raw data

```bash
nx g lib data/game-entities
```
