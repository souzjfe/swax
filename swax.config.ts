import { SwaxConfig } from './src/types';
export default {
  baseURL: 'https://pnld-formacao-dev.nees.ufal.br/backend/api',
  jsonSchemaPath: '/schemas/?format=json',
  ignoredPaths: ['/acesso', '/cms', '/contato', '/ead'],
} as SwaxConfig
