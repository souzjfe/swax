# Swax CLI

Swax CLI is a command-line tool for generating TypeScript types for API routes from a Swagger JSON file. The CLI can also create a default configuration file to help you get started.

## Installation

To install the CLI globally, run the following command:

```bash
npm install -D swax-cli
```

## Usage

The CLI provides two main commands: `generate` and `init`.

### `generate` Command

The `generate` command fetches the Swagger JSON and generates TypeScript types for API routes and methods.

#### Syntax

```bash
npx swax generate [options]
```

#### Options

- `-c, --config <path>`: Path to the configuration file. Default is `./swax.config.ts`.

#### Example

```bash
npx swax generate -c ./path/to/swax.config.ts
```

### `init` Command

The `init` command creates a default `swax.config.ts` configuration file in the root of your project.

#### Syntax

```bash
npx swax init
```

#### Example

```bash
npx swax init
```

## Configuration File

The `swax.config.ts` file is a TypeScript module that should export an object satisfying the `SwaxConfig` interface. Here is an example of how the file might be structured:

```typescript
import { SwaxConfig } from './src/types';

export default {
  baseURL: 'https://petstore.swagger.io/v2',
  jsonSchemaPath: '/swagger.json',
  outputTypesPath: '@types',
} satisfies SwaxConfig;
```

### Configuration Fields

- `baseURL`: The base URL of your API.
- `jsonSchemaPath`: The path to the Swagger JSON schema.
- `outputTypesPath`: The path to the directory where generated types will be saved.

## Project Structure

The project is organized as follows:

- `src/commands/`: Contains files implementing the CLI commands.
  - `generate.ts`: Logic for generating TypeScript types.
  - `init.ts`: Logic for creating the default configuration file.
- `src/utils/`: Contains utility functions used by the commands.
  - `swaggerUtils.ts`: Functions for normalizing API paths.
  - `fileUtils.ts`: Functions for file handling.
- `src/index.ts`: The main file for the CLI that sets up and executes commands.

## Contributing

If you wish to contribute to the project, please follow these steps:

1. Fork the repository.
2. Create a branch for your changes (`git checkout -b my-new-feature`).
3. Commit your changes (`git commit -am 'Add new feature'`).
4. Push to the branch (`git push origin my-new-feature`).
5. Open a pull request.

## License

Distributed under the MIT License. See `LICENSE` for more information.

## Contact

For more information or inquiries, please contact [Your Name](mailto:your.email@example.com).
