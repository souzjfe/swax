# Swax CLI

Swax CLI is a command-line tool for generating TypeScript types for API routes from a Swagger JSON file. The CLI can also create a default configuration file to help you get started.

> For now, it is only possible to generate types to suggest possible endpoints in the API, but soon there will be versions for typing requests and responses. 

## How It Works

When you run the `generate` command, Swax CLI fetches the Swagger JSON from the specified API and generates a TypeScript declaration file, `axios.d.ts`. This file complements the type definitions for the Axios library by providing specific typings for your API routes. You can further customize these types as needed.

## Installation

To install the CLI globally, run the following command:

```bash
npm install -D @souzjfe/swax
```

## Usage

The CLI provides two main commands: `generate` and `init`.


### `init` Command

The `init` command creates a default `swax.config.ts` configuration file in the root of your project.

#### Syntax

```bash
npx swax init
```

### `generate` Command

The `generate` command fetches the Swagger JSON and generates TypeScript types for API routes and methods in `axios.d.ts` file.

#### Syntax

```bash
npx swax generate [options]
```

#### Options

- `-c, --config <path>`: Path to the configuration file. Default is `./swax.config.ts`.

#### Example

```bash
npx swax generate 
```

> If you have changed the swax.config.ts file you will have to inform it:
> 
> ````bash
> npx swax generate -c ./path/to/swax.config.ts
> ````

## Configuration File

The `swax.config.ts` file is a TypeScript module that should export an object satisfying the `SwaxConfig` interface. Here is an example of how the file might be structured:

```typescript
import { SwaxConfig } from './src/types';

export default {
  baseURL: 'https://petstore.swagger.io/v2',
  jsonSchemaPath: '/swagger.json',
  outputTypesPath: '@types/',
  ignoredPaths: ['/pets', '/store'],
} as SwaxConfig;
```

### Configuration Fields

- `baseURL`: The base URL of your API.
- `jsonSchemaPath`: The path to the Swagger JSON schema.
- `outputTypesPath`: The path to the directory where generated types will be saved.
- `ignoredPaths`: A list of paths that should be excluded when generating the route types. These paths will be stripped from the beginning of each route when generating the types.

### Example: Multiple Axios Instances

If you want to create more than one axios isntance and concatenate the baseURL with some path, like the following example:

```typescript
const httpPets = axios.create({ baseURL: baseURL + '/pets' });
const httpStore = axios.create({ baseURL: baseURL + '/store' });
```

You must insert each path that has been concatenated into `ignoredPaths`:

```typescript
export default {
  baseURL: 'https://petstore.swagger.io/v2',
  jsonSchemaPath: '/swagger.json',
  outputTypesPath: '@types/',
  ignoredPaths: ['/pets', '/store'], // here
} as SwaxConfig;
```
## Limitations and Future Versions

Currently, the CLI generates TypeScript types only for the API routes. The following features are planned for future releases:

- **Version 1.0.0**: Type definitions for API responses and request `data`.

## Contributing ❤️

If you wish to contribute to the project, please follow these steps:

1. Fork the repository.
2. Create a branch for your changes (`git checkout -b my-new-feature`).
3. Commit your changes (`git commit -am 'Add new feature'`).
4. Push to the branch (`git push origin my-new-feature`).
5. Open a pull request.

## Project Structure

The project is organized as follows:

- `src/commands/`: Contains files implementing the CLI commands.
  - `generate.ts`: Logic for generating TypeScript types.
  - `init.ts`: Logic for creating the default configuration file.
- `src/utils/`: Contains utility functions used by the commands.
  - `swaggerUtils.ts`: Functions for normalizing API paths.
  - `fileUtils.ts`: Functions for file handling.
- `src/index.ts`: The main file for the CLI that sets up and executes commands.

## License

Distributed under the MIT License. See `LICENSE` for more information.

## Contact

For more information or inquiries, please contact [Jeferson](jefferson.souza@nees.ufal.br).

