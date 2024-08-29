import axios from 'axios';
import fs from 'fs';
import path from 'path';
import { capitalize } from '../utils/fileUtils';
import { normalizePath } from '../utils/swaggerUtils';
import { SwaxConfig } from '../types';

export async function generateTypes(configPath: string) {
  try {
    const resolvedConfigPath = path.resolve(configPath);
    if (!fs.existsSync(resolvedConfigPath)) {
      console.error(`Configuration file not found at ${resolvedConfigPath}`);
      process.exit(1);
    }
    
    const configModule = await import(resolvedConfigPath);
    const config = configModule.default;

    const { baseURL, jsonSchemaPath, outputTypesPath, ignoredPaths }: SwaxConfig = config;

    let url = baseURL.endsWith('/')
      ? `${baseURL.slice(0, -1)}${jsonSchemaPath}`
      : `${baseURL}${jsonSchemaPath.startsWith('/') ? jsonSchemaPath : `/${jsonSchemaPath}`}`;

    if (!url) {
      console.error('No valid configuration found. Please ensure swax.config.ts is correctly configured.');
      process.exit(1);
    }

    const response = await axios.get(url, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const swaggerData = response.data;
    const paths = swaggerData.paths;

    const methodRoutes: { [key: string]: string[] } = {
      get: [],
      post: [],
      put: [],
      delete: [],
      patch: [],
      options: [],
      head: [],
    };

    Object.keys(paths).forEach((path) => {
      const methods = paths[path];
      const normalizedPath = normalizePath(path, baseURL);

      // Verificar se o caminho está em ignoredPaths
      if (!!ignoredPaths && ignoredPaths.some(ignoredPath => normalizedPath.startsWith(ignoredPath))) {
        return; // Se o caminho for ignorado, pule para a próxima iteração
      }

      Object.keys(methods).forEach((method) => {
        if (methodRoutes[method] !== undefined) {
          methodRoutes[method].push(normalizedPath);
        }
      });
    });

    const typeDefinitions = Object.entries(methodRoutes)
      .map(([method, routes]) => {
        const routesString = routes
          .map(route => {
            if (route.match(/{[^}]+}/g)) {
              const dynamicRoute = "`" + route.replace(/{([^}]+)}/g, '${number | string}') + "`";
              const regularRoute = `'${route.replace(/{[^}]+}/g, '${}')}'`;
              return `${dynamicRoute} | ${regularRoute}`;
            }
            return `"${route}"`;
          })
          .join(' | ') || 'string';

        return `\texport type ${capitalize(method)}Routes = ${routesString};`;
      })
      .join('\n\n');
    const axiosBaseURL = `\texport type BaseURLTyped = "${baseURL}";`;
    const swaxTypesDefinition = `
import "axios";
declare module 'axios' {
${axiosBaseURL}
${typeDefinitions}

  export interface AxiosInstance {
    get<T = any, R = AxiosResponse<T>>(url: GetRoutes, config?: AxiosRequestConfig): Promise<R>;
    delete<T = any, R = AxiosResponse<T>>(url: DeleteRoutes, config?: AxiosRequestConfig): Promise<R>;
    head<T = any, R = AxiosResponse<T>>(url: HeadRoutes, config?: AxiosRequestConfig): Promise<R>;
    options<T = any, R = AxiosResponse<T>>(url: OptionsRoutes, config?: AxiosRequestConfig): Promise<R>;
    post<T = any, R = AxiosResponse<T>>(url: PostRoutes, data?: any, config?: AxiosRequestConfig): Promise<R>;
    put<T = any, R = AxiosResponse<T>>(url: PutRoutes, data?: any, config?: AxiosRequestConfig): Promise<R>;
    patch<T = any, R = AxiosResponse<T>>(url: PatchRoutes, data?: any, config?: AxiosRequestConfig): Promise<R>;
  }
  export interface AxiosRequestConfig {
    baseURL?: BaseURLTyped;
  }
}
    `;

    if (!outputTypesPath) {
      fs.writeFileSync('./axios.d.ts', swaxTypesDefinition);
      console.log('TypeScript declaration types for routes have been generated at root directory');
    } else {
      if (!fs.existsSync(outputTypesPath)) {
        fs.mkdirSync(outputTypesPath, { recursive: true });
        console.log(`Created directory at ${outputTypesPath}`);
      }
      const filePath = path.join(outputTypesPath, 'axios.d.ts');
      fs.writeFileSync(filePath, swaxTypesDefinition);
      console.log(`TypeScript declaration types for routes have been generated at ${filePath}`);
    } 

  } catch (error) {
    console.error('Failed to fetch Swagger JSON or generate types:', error);
    process.exit(1);
  }
}
