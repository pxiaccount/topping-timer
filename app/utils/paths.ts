export function getBasePath(): string {
    return process.env.NODE_ENV === 'production'
        ? process.env.NEXT_PUBLIC_BASE_PATH || ''
        : '';
}