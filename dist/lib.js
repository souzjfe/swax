"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createSwaxAxiosInstance = void 0;
const axios_1 = __importDefault(require("axios"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
__exportStar(require("./types"), exports);
__exportStar(require("axios"), exports);
// Helper function to load configuration
const loadConfig = (configPath) => {
    const resolvedPath = path_1.default.resolve(configPath);
    if (!fs_1.default.existsSync(resolvedPath)) {
        throw new Error(`Configuration file not found at ${resolvedPath}`);
    }
    const configModule = require(resolvedPath);
    return configModule.default;
};
// Function to create an Axios instance with Swax configuration
const createSwaxAxiosInstance = (config = loadConfig("./swax.config.ts")) => {
    // Create Axios instance
    const instance = axios_1.default.create({
        baseURL: config.baseURL,
        // Add other default configurations if needed
    });
    // Dynamically type-check and suggest routes
    const routeTypes = loadRouteTypes(config.outputTypesPath);
    // Add type-checking for request methods
    const swaxInstance = {
        ...instance,
        get: (url) => instance.get(url),
        post: (url, ...args) => instance.post(url, ...args),
        put: (url, ...args) => instance.put(url, ...args),
        delete: (url, ...args) => instance.delete(url, ...args),
    };
    return swaxInstance;
};
exports.createSwaxAxiosInstance = createSwaxAxiosInstance;
// Function to load route types from the generated types file
const loadRouteTypes = (typesPath) => {
    const resolvedPath = path_1.default.resolve(typesPath);
    if (!fs_1.default.existsSync(resolvedPath)) {
        throw new Error(`Types file not found at ${resolvedPath}`);
    }
    if (resolvedPath[resolvedPath.length] === '/') {
        return require(resolvedPath + 'routes.d.ts');
    }
    return require(resolvedPath + '/routes.d.ts');
};
