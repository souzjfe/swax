
export * from './types';

const endpointWithStringId = <T extends String>(endpoint: T, ...ids: string[]) => {
  return endpoint.replace(/{[^}]+}/g, ids.shift() as string);
}
