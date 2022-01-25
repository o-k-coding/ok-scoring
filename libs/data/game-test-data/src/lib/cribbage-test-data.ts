
// import * as validStateSchema from './schema/cribbage-valid-state-schema.json';
// import * as winStateSchema from './schema/cribbage-win-state-schema.json';
import { readFileSync } from 'fs';
import { join } from 'path';

// TODO can probably go back to import * as now just test that no caching happens
const validateSchemaPath = join(__dirname, './schema/cribbage-valid-state-schema.json');
const winSchemaPath = join(__dirname, './schema/cribbage-win-state-schema.json');

export const cribbageValidStateSchema = JSON.parse(readFileSync(validateSchemaPath).toString());
export const cribbageWinStateSchema = JSON.parse(readFileSync(winSchemaPath).toString());
