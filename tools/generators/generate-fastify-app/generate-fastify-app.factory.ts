import { Rule, apply, url, template, move, Tree, SchematicContext, chain, mergeWith } from '@angular-devkit/schematics';
import { strings } from '@angular-devkit/core';
import { GenerateFastityAppSchema } from './schema';
import { getProjectConfig } from '@nrwl/workspace';

export function generateFastifyApp(schema: GenerateFastityAppSchema): Rule {
    return (host: Tree, context: SchematicContext) => {
        // TODO figure out how they calculate the path in nx schematics
        const path = getProjectConfig(host, schema.name).root;
        const appFilesSource = apply(
            url('./files/app'),
            [
                template({
                    ...strings, // This is were dasherize and classify etc. come from
                    ...schema
                }),
                move(`${path}/src/app`)
            ]);
        const mainFileSource = apply(
            url('./files/main.ts'),
            [
                template({
                    ...strings, // This is were dasherize and classify etc. come from
                    ...schema
                }),
                move(`${path}/src`)
            ]);
        const rule = chain([
            mergeWith(appFilesSource),
            mergeWith(mainFileSource),
        ]);
        return rule(host, context);
    };
}
