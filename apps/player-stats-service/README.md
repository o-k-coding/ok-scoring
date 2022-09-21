# Player Stats Service

General architecture:

Service will handle game data to calculate player stats, and storing that data in a DB table specific to this service.
That data can then be queried via API.

## Purpose of this service

1. Should this service have an isolated db, take in full game objects via callers and use that to recalculate against the existing state it owns?
2. Should this service have access to all the data, so when invoked it pulls data (either new or all) and use that to recalcuate against the existing state?

I think for a first run, this service should be standalone, and only take in the required data to calculate stats.

## TODOS

- MVP using in memory data []
- API json schema for validaiton
  - Need to figure out where this lives... probably in this app dir since it is specific? but can we do better...
