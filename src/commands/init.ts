import fs from 'fs';
import path from 'path';

export function createConfigFile() {
  const configPath = path.resolve('swax.config.ts');
  const configContent = `
import { SwaxConfig } from '@souzjfe/swax';

export default {
  baseURL: 'https://petstore.swagger.io/v2',
  jsonSchemaPath: '/swagger.json',
  outputTypesPath: '@types/',
  ignoredPaths: ['/pets', '/store'],
} as SwaxConfig; // or satisfies SwaxConfig;
  `;
  fs.writeFileSync(configPath, configContent.trim());
  console.log(`Default configuration file created at ${configPath}`);
}
