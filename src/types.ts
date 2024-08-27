
/**
 * Represents the configuration options for Swax.
 */
export type SwaxConfig = {
  /**
   * The base URL for requests. Must be the same in the axios configuration
   * @example "https://api.example.com"
   */
  baseURL: string;

  /**
   * The path to the schema file.
   * @example "/path/to/schema.json"
   */
  jsonSchemaPath: string;

  /**
   * The path to the output types file. If not provided, the types will be written to the current working directory.
   * This field is optional.
   * @example "/path/to/output/types"
   */
  outputTypesPath?: string;
};