import axios, { AxiosInstance } from 'axios';
import path from 'path';
import fs from 'fs';
import { SwaxConfig } from './types';
export * from './types';
export * from "axios"
// Helper function to load configuration
const loadConfig = (configPath: string) => {
  const resolvedPath = path.resolve(configPath);
  if (!fs.existsSync(resolvedPath)) {
    throw new Error(`Configuration file not found at ${resolvedPath}`);
  }
  const configModule = require(resolvedPath);
  return configModule.default;
};

// Function to create an Axios instance with Swax configuration
export const createSwaxAxiosInstance = (config: SwaxConfig = loadConfig("./swax.config.ts") ) => {

  // Create Axios instance
  const instance = axios.create({
    baseURL: config.baseURL,
    // Add other default configurations if needed
  });

  // Dynamically type-check and suggest routes
  const routeTypes = loadRouteTypes(config.outputTypesPath);
  
  // Define a type that includes all route methods
  type RouteMethods = keyof typeof routeTypes;
  type RoutePaths = typeof routeTypes[RouteMethods];

  // Add type-checking for request methods
  const swaxInstance = {
    ...instance,
    get: (url: RoutePaths) => instance.get(url),
    post: (url: RoutePaths, ...args: any[]) => instance.post(url, ...args),
    put: (url: RoutePaths, ...args: any[]) => instance.put(url, ...args),
    delete: (url: RoutePaths, ...args: any[]) => instance.delete(url, ...args),
  }
  return swaxInstance;
};

// Function to load route types from the generated types file
const loadRouteTypes = (typesPath: string) => {
  const resolvedPath = path.resolve(typesPath);
  if (!fs.existsSync(resolvedPath)) {
    throw new Error(`Types file not found at ${resolvedPath}`);
  }
  if (resolvedPath[resolvedPath.length] === '/') {
    return require(resolvedPath + 'routes.d.ts');
  }
  return require(resolvedPath + '/routes.d.ts');
};

