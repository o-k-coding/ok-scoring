import * as TJS from 'typescript-json-schema';
import { resolve, join } from 'path';
import { existsSync, mkdirSync, readdirSync, writeFileSync } from 'fs';

const types = [
    'GameRules',
    'PlayerScoreHistory',
    'Player',
    'GameState',
];

export function createGameModelSchemas() {

    // optionally pass argument to schema generator
    const settings: TJS.PartialArgs = {
        required: true,
    };

    // optionally pass ts compiler options
    const compilerOptions: TJS.CompilerOptions = {
        strictNullChecks: true,
    };

    const basePath = resolve(__dirname, '../../libs/features/game-models/src/lib');

    console.log('base path', basePath);


    const files = readdirSync(join(basePath)).map(file => join(basePath, file));

    console.log('files', files);

    const program = TJS.getProgramFromFiles(files, compilerOptions, basePath);

    const generator = TJS.buildGenerator(
        program,
        settings,
        files,
    ) as TJS.JsonSchemaGenerator;

    // get all symbols which meet regex
    // const symbols = generator.getSymbols();
    // .filter((symbol: TJS.SymbolRef) => !!symbol.match(/(.*)interface/gi));

    // console.log('Symbols', symbols);

    // create directory if it doesn't exist
    if (!existsSync(join(__dirname, 'schema'))) {
        mkdirSync(join(__dirname, 'schema'));
    }

    // // store all schema files
    types.forEach(symbol => {
        const schema = generator.getSchemaForSymbol(symbol);
        const prefix = `export default `;
        const filePath = `${join(basePath, 'schema', `${symbol}JSC.ts`)}`;
        const fileContents = `${prefix}${JSON.stringify(schema, null, 2)}`;
        writeFileSync(filePath, fileContents);
    });

}

console.log('Creating game model schemas');
createGameModelSchemas();
console.log('Game model schemas created');
