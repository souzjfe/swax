import { SwaxConfig } from './types';
export * from './types';
export * from "axios";
export declare const createSwaxAxiosInstance: (config?: SwaxConfig) => {
    get: (url: any) => Promise<import("axios").AxiosResponse<any>>;
    post: (url: any, ...args: any[]) => Promise<import("axios").AxiosResponse<any>>;
    put: (url: any, ...args: any[]) => Promise<import("axios").AxiosResponse<any>>;
    delete: (url: any, ...args: any[]) => Promise<import("axios").AxiosResponse<any>>;
    defaults: import("axios").AxiosRequestConfig;
    interceptors: {
        request: import("axios").AxiosInterceptorManager<import("axios").AxiosRequestConfig>;
        response: import("axios").AxiosInterceptorManager<import("axios").AxiosResponse<any>>;
    };
    getUri(config?: import("axios").AxiosRequestConfig | undefined): string;
    request<T = any, R = import("axios").AxiosResponse<T>>(config: import("axios").AxiosRequestConfig): Promise<R>;
    head<T_1 = any, R_1 = import("axios").AxiosResponse<T_1>>(url: string, config?: import("axios").AxiosRequestConfig | undefined): Promise<R_1>;
    options<T_2 = any, R_2 = import("axios").AxiosResponse<T_2>>(url: string, config?: import("axios").AxiosRequestConfig | undefined): Promise<R_2>;
    patch<T_3 = any, R_3 = import("axios").AxiosResponse<T_3>>(url: string, data?: any, config?: import("axios").AxiosRequestConfig | undefined): Promise<R_3>;
};
//# sourceMappingURL=lib.d.ts.map