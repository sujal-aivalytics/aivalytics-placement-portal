/**
 * Safely parse JSON from a fetch response
 * Handles empty responses and non-OK status codes
 */
export async function safeFetchJson<T = any>(
    input: RequestInfo | URL,
    init?: RequestInit
): Promise<T> {
    const response = await fetch(input, init);

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    const text = await response.text();

    if (!text || text.trim() === '') {
        throw new Error('Empty response from server');
    }

    try {
        return JSON.parse(text) as T;
    } catch (error) {
        console.error('Failed to parse JSON:', text);
        throw new Error('Invalid JSON response from server');
    }
}

/**
 * Parse JSON from a Response object safely
 * Use this when you already have a Response object
 */
export async function parseJsonSafely<T = any>(response: Response): Promise<T> {
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    const text = await response.text();

    if (!text || text.trim() === '') {
        throw new Error('Empty response from server');
    }

    try {
        return JSON.parse(text) as T;
    } catch (error) {
        console.error('Failed to parse JSON:', text);
        throw new Error('Invalid JSON response from server');
    }
}
