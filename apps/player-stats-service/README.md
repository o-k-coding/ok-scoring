# Player Stats Service

General architecture:

Service will handle game data to calculate player stats, and storing that data in a DB table specific to this service.
That data can then be queried via API.

## Local development

This service currently runs all data in memory.

## Research

Using cluster mode

This was done following along with udemy course <https://okta.udemy.com/course/node-js-cluster> for learning

Used this exampleas well

<https://github.com/joseluisq/fastify-cluster-example>

When a request is sent, the main process will pass it to a worker process. You can determine which process based on the pid in the log

example

```json
{"level":30,"time":1666465566935,"pid":5797,"hostname":"LAPTOP-8B8RCQC5","reqId":"req-1","req":{"method":"GET","url":"/api/player-stats/b2c50e39-5b5e-4b4e-9ea6-34fab6cd4b7d","hostname":"127.0.0.1:3001","remoteAddress":"127.0.0.1","remotePort":37708},"msg":"incoming request"}
```

### Load testing

#### Vegeta

```bash
vegeta attack -targets='apps/player-stats-service/test/performance/vegeta/target.list' -rate=5 -duration=5s > apps/player-stats-service/test/performance/vegeta/result.5ps.bin

cat apps/player-stats-service/test/performance/vegeta/result.5ps.bin | vegeta plot > apps/player-stats-service/test/performance/vegeta/plot.50qps.html
# this is how you can combine multiple plots  vegeta plot results.50qps.bin results.100qps.bin > plot.html
```

TODO want to look into how to generate data. Maybe just a script that outputs to json would be the best option? Or a js script that just prints to stdout and pipe it in?
But also could be cool to figure out how to use jq for this for learning

```bash
jq -ncM 'while(true; .+1) | {method: "POST", url: "http://:6060", body: {id: .} | @base64 }' | \
  vegeta attack -rate=50/s -lazy -format=json -duration=30s | \
  tee results.bin | \
  vegeta report
```

#### Loadtest

Uses the loadtest library added as a dev dependency

-n max num requests
-c concurrent requests
-rps requests per second

Wonder if I could use a file instead?

```bash
yarn loadtest -- -n 1000 -c 100 -rps 200 http://127.0.0.1:3001/api/player-stats -P '{"key":"8e231613-1e16-4ec9-9366-2cfd1700edd1","date":"1663789971740","description":"Test Game","duration":null,"winningPlayerKey":"f3a96d83-4c0d-4739-8a49-48115a26f57d","scoreHistory":[{"key":"546d988f-50e5-49d6-b4fe-352f5f363691","playerKey":"b2c50e39-5b5e-4b4e-9ea6-34fab6cd4b7d","gameKey":"8e231613-1e16-4ec9-9366-2cfd1700edd1","score":23,"initialScore":0,"order":0,"scores":[{"key":"ee1b478b-1e9d-472b-8b16-638182964c94","playerScoreHistoryKey":"546d988f-50e5-49d6-b4fe-352f5f363691","score":23,"initialScore":0,"order":0,"scores":[23]}]},{"key":"2870af7f-632d-4f75-995f-da5ced263fa7","playerKey":"008b31f7-7d3b-45ab-aa3d-7ba46a1c2d7f","gameKey":"8e231613-1e16-4ec9-9366-2cfd1700edd1","score":12,"initialScore":0,"order":0,"scores":[{"key":"b3c08053-18a1-48cc-b60f-f1f748357738","playerScoreHistoryKey":"2870af7f-632d-4f75-995f-da5ced263fa7","score":12,"initialScore":0,"order":0,"scores":[12]}]}]}'
```

#### Artillery

install artillery globally <https://www.artillery.io/docs/guides/getting-started/installing-artillery>

```bash
artillery run apps/player-stats-service/test/performance/artillery/create_player_stats.yml
or
yarn player-stats:perf
```

references

<https://blog.appsignal.com/2021/11/10/a-guide-to-load-testing-nodejs-apis-with-artillery.html>
<https://github.com/artilleryio/artillery/issues/791>

## Purpose of this service

1. Should this service have an isolated db, take in full game objects via callers and use that to recalculate against the existing state it owns?
2. Should this service have access to all the data, so when invoked it pulls data (either new or all) and use that to recalcuate against the existing state?

I think for a first run, this service should be standalone, and only take in the required data to calculate stats.

## TODOS

- MVP using in memory data []
- API json schema for validaiton
  - Need to figure out where this lives... probably in this app dir since it is specific? but can we do better...
