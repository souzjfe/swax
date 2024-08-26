#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const commander_1 = require("commander");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const program = new commander_1.Command();
program
    .command('test')
    .description('Fetch and generate TypeScript types for API routes and methods from the Swagger JSON defined in the config')
    .option('-c, --config <path>', 'Path to the configuration file', './swax.config.ts')
    .action(async (options) => {
    try {
        // Load configuration file
        const configPath = path_1.default.resolve(options.config);
        if (!fs_1.default.existsSync(configPath)) {
            console.error(`Configuration file not found at ${configPath}`);
            process.exit(1);
        }
        const configModule = require(configPath);
        const config = configModule.default;
        // Determine URL and output path from configuration file
        const baseURL = config.baseURL;
        const schemaPath = config.schemaPath;
        const outputTypesPath = config.outputTypesPath || './types'; // Usa outputTypesPath ou define um padrão
        // Construct the full URL
        let url = baseURL.endsWith('/')
            ? `${baseURL.slice(0, -1)}${schemaPath}`
            : `${baseURL}${schemaPath.startsWith('/') ? schemaPath : `/${schemaPath}`}`;
        // Check if URL is available
        if (!url) {
            console.error('No valid configuration found. Please ensure swax.config.ts is correctly configured.');
            process.exit(1);
        }
        // Fetch Swagger JSON
        const response = await axios_1.default.get(url, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        const swaggerData = response.data;
        // Extract paths
        const paths = swaggerData.paths;
        // Initialize types for methods
        const methodRoutes = {
            get: [],
            post: [],
            put: [],
            delete: [],
            patch: [],
            options: [],
            head: [],
        };
        // Helper function to normalize paths
        const normalizePath = (path) => {
            if (baseURL) {
                const basePath = new URL(baseURL).pathname;
                if (path.startsWith(basePath)) {
                    path = path.substring(basePath.length);
                }
            }
            return path;
        };
        // Populate method routes
        Object.keys(paths).forEach((path) => {
            const methods = paths[path];
            const normalizedPath = normalizePath(path);
            Object.keys(methods).forEach((method) => {
                if (methodRoutes[method] !== undefined) {
                    methodRoutes[method].push(normalizedPath);
                }
            });
        });
        // Helper function to convert path with dynamic segments
        const convertPathToDynamic = (path) => {
            return "`" + path.replace(/{([^}]+)}/g, '${number | string}') + "`";
        };
        // Create TypeScript types for each method
        const typeDefinitions = Object.entries(methodRoutes)
            .map(([method, routes]) => {
            if (routes.length > 0) {
                const regularRoutes = routes.map(route => `"${route.replace(/{[^}]+}/g, '${}')}"`).join(' | ');
                const dynamicRoutes = routes.map(route => `${convertPathToDynamic(route)}`).join(' | ');
                return [
                    `export type ${capitalize(method)}Routes = ${regularRoutes};`,
                    `export type ${capitalize(method)}DynamicRoutes = ${dynamicRoutes};`,
                ].join('\n\n');
            }
            return null; // Skip empty types
        })
            .filter(type => type !== null) // Remove null values
            .join('\n\n');
        // Ensure output directory exists
        if (!fs_1.default.existsSync(outputTypesPath)) {
            fs_1.default.mkdirSync(outputTypesPath, { recursive: true });
        }
        // Write types to file
        const filePath = path_1.default.join(outputTypesPath, 'routes.d.ts');
        fs_1.default.writeFileSync(filePath, typeDefinitions);
        console.log(`TypeScript types for routes have been generated at ${filePath}`);
    }
    catch (error) {
        console.error('Failed to fetch Swagger JSON or generate types:', error);
        process.exit(1);
    }
});
function capitalize(method) {
    return method.charAt(0).toUpperCase() + method.slice(1);
}
program.parse(process.argv);
