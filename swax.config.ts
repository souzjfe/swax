import { SwaxConfig } from './src/types';
export default {
  baseURL: 'https://petstore.swagger.io/v2',
  jsonSchemaPath: '/swagger.json',
  ignoredPaths: ['/pet']
} satisfies SwaxConfig;