#!/usr/bin/env node
import { Command } from 'commander';
import { generateTypes } from './commands/generate';
import { createConfigFile } from './commands/init';
import { register } from 'ts-node';

// Register ts-node to handle TypeScript files
register({
  transpileOnly: true, // Transpile only without type-checking for performance
  compilerOptions: {
    module: 'commonjs', // Ensure that modules are CommonJS
  },
});
const program = new Command();

program
  .command('generate')
  .description('Fetch and generate TypeScript types for API routes and methods from the Swagger JSON defined in the config')
  .option('-c, --config <path>', 'Path to the configuration file', './swax.config.ts')
  .action((options) => generateTypes(options.config));

program
  .command('init')
  .description('Generate a default configuration file for swax')
  .action(() => createConfigFile());

program.parse(process.argv);
