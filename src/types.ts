import { AxiosRequestConfig } from "axios";



export type SwaxConfig = AxiosRequestConfig & {
  schemaPath: string,
  outputTypesPath: string, 
} 