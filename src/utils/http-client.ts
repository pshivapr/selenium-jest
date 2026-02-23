import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

export interface HttpClientConfig {
    baseURL?: string;
    timeout?: number;
    headers?: Record<string, string>;
}

export interface ApiResponse<T = unknown> {
    data: T;
    status: number;
    statusText: string;
    headers: Record<string, string>;
}

function toApiResponse<T>(res: AxiosResponse<T>): ApiResponse<T> {
    return {
        data: res.data,
        status: res.status,
        statusText: res.statusText,
        headers: res.headers as Record<string, string>,
    };
}

export class HttpClient {
    private readonly client: AxiosInstance;

    constructor(config: HttpClientConfig = {}) {
        this.client = axios.create({
            baseURL: config.baseURL ?? '',
            timeout: config.timeout ?? 30000,
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                ...config.headers,
            },
        });
    }

    async get<T = unknown>(
        url: string,
        config?: AxiosRequestConfig,
    ): Promise<ApiResponse<T>> {
        const res = await this.client.get<T>(url, config);
        return toApiResponse(res);
    }

    async post<T = unknown>(
        url: string,
        body?: unknown,
        config?: AxiosRequestConfig,
    ): Promise<ApiResponse<T>> {
        const res = await this.client.post<T>(url, body, config);
        return toApiResponse(res);
    }

    async put<T = unknown>(
        url: string,
        body?: unknown,
        config?: AxiosRequestConfig,
    ): Promise<ApiResponse<T>> {
        const res = await this.client.put<T>(url, body, config);
        return toApiResponse(res);
    }

    async delete<T = unknown>(
        url: string,
        config?: AxiosRequestConfig,
    ): Promise<ApiResponse<T>> {
        const res = await this.client.delete<T>(url, config);
        return toApiResponse(res);
    }
}

/** Singleton instance pre-configured for use without a base URL. */
export const httpClient = new HttpClient();
