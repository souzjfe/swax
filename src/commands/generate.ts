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

    const { baseURL, jsonSchemaPath, outputTypesPath, ignoredPaths = [] }: SwaxConfig= config;

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

    const methodRoutes: Record<string, string[]> = {
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
      let normalizedPath = normalizePath(path, baseURL);

      // Remover partes da rota que correspondem a qualquer string em ignoredPaths
      ignoredPaths.forEach(ignoredPath => {
        if (normalizedPath.startsWith(ignoredPath)) {
          normalizedPath = normalizedPath.replace(ignoredPath, '');
        }
      });

      Object.keys(methods).forEach((method) => {
        if (methodRoutes[method] !== undefined) {
          methodRoutes[method].push(normalizedPath);
        }
      });
    });
    // Create TypeScript types for each method
    const typeDefinitions = Object.entries(methodRoutes)
      .map(([method, routes]) => {
        const regularRoutes = [...routes.map(route => `"${route.replace(/{[^}]+}/g, '${}')}"`), "String"].join(' | ');
        const dynamicRoutes = [...routes.map(route => `${"`" + route.replace(/{([^}]+)}/g, '${number}') + "`"}`), "String"].join(' | ');

        return [
          `\texport type ${capitalize(method)}Routes = ${regularRoutes};`,
          `\texport type ${capitalize(method)}DynamicRoutes = ${dynamicRoutes};`,
        ].join('\n\n');
      })
      .join('\n\n');

    const swaxTypesDefinition = `
import "axios";
declare module 'axios' {
  import { AxiosRequestConfig, AxiosResponse } from 'axios';
${typeDefinitions}

  export interface AxiosInstance {
    get<T = any, R = AxiosResponse<T>>(url: GetRoutes | GetDynamicRoutes, config?: AxiosRequestConfig): Promise<R>;
    delete<T = any, R = AxiosResponse<T>>(url: DeleteRoutes | DeleteDynamicRoutes, config?: AxiosRequestConfig): Promise<R>;
    head<T = any, R = AxiosResponse<T>>(url: HeadRoutes | HeadDynamicRoutes, config?: AxiosRequestConfig): Promise<R>;
    options<T = any, R = AxiosResponse<T>>(url: OptionsRoutes | OptionsDynamicRoutes, config?: AxiosRequestConfig): Promise<R>;
    post<T = any, R = AxiosResponse<T>>(url: PostRoutes | PostDynamicRoutes, data?: any, config?: AxiosRequestConfig): Promise<R>;
    put<T = any, R = AxiosResponse<T>>(url: PutRoutes | PutDynamicRoutes, data?: any, config?: AxiosRequestConfig): Promise<R>;
    patch<T = any, R = AxiosResponse<T>>(url: PatchRoutes | PatchDynamicRoutes, data?: any, config?: AxiosRequestConfig): Promise<R>;
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
