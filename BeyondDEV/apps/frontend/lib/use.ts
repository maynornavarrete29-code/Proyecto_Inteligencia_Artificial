export interface Use<T> {
    data: T | null;
    loading: boolean;
    error: Error | null;
}