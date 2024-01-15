import { chain, externalSchematic, Rule } from '@angular-devkit/schematics';
import { generateFastifyApp } from './generate-fastify-app.factory';
import { GenerateFastityAppSchema } from './schema';

export default function (schema: GenerateFastityAppSchema): Rule {
  return chain([
    externalSchematic('@nrwl/node', 'app', {
      name: schema.name,
    }),
    generateFastifyApp(schema),
  ]);
}
