/**
 * Postcodes API Tests
 *
 * Uses the free, open-source postcodes.io API (https://api.postcodes.io)
 * to validate the HttpClient utility (GET, POST, PUT, DELETE).
 *
 * API docs: https://postcodes.io/docs
 */

import { HttpClient } from '../src/utils/http-client';
import axios from 'axios';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface PostcodeResult {
    postcode: string;
    country: string;
    region: string;
    admin_district: string;
    latitude: number;
    longitude: number;
    [key: string]: unknown;
}

interface PostcodeApiResponse<T> {
    status: number;
    result: T;
}

interface BulkLookupResult {
    query: string;
    result: PostcodeResult | null;
}

// ---------------------------------------------------------------------------
// Test Suite
// ---------------------------------------------------------------------------

describe('Postcodes API – HttpClient integration', () => {
    const BASE_URL = 'https://api.postcodes.io';
    let client: HttpClient;

    beforeAll(() => {
        client = new HttpClient({ baseURL: BASE_URL, timeout: 15000 });
    });

    // -------------------------------------------------------------------------
    // GET – single postcode lookup
    // -------------------------------------------------------------------------

    describe('GET /postcodes/:postcode', () => {
        it('returns 200 and full details for a valid UK postcode', async () => {
            const response = await client.get<PostcodeApiResponse<PostcodeResult>>(
                '/postcodes/SW1A1AA',
            );

            expect(response.status).toBe(200);
            expect(response.data.status).toBe(200);

            const result = response.data.result;
            expect(result.postcode).toBe('SW1A 1AA');
            expect(result.country).toBe('England');
            expect(typeof result.latitude).toBe('number');
            expect(typeof result.longitude).toBe('number');
        });

        it('returns 404 for an invalid / non-existent postcode', async () => {
            await expect(client.get('/postcodes/INVALID99')).rejects.toMatchObject({
                response: { status: 404 },
            });
        });

        it('returns correct fields for postcode EC1A1BB', async () => {
            const response = await client.get<PostcodeApiResponse<PostcodeResult>>(
                '/postcodes/EC1A1BB',
            );

            expect(response.status).toBe(200);
            const result = response.data.result;
            expect(result).toHaveProperty('postcode');
            expect(result).toHaveProperty('admin_district');
            expect(result).toHaveProperty('region');
        });
    });

    // -------------------------------------------------------------------------
    // GET – validate a postcode
    // -------------------------------------------------------------------------

    describe('GET /postcodes/:postcode/validate', () => {
        it('returns true for a valid postcode', async () => {
            const response = await client.get<PostcodeApiResponse<boolean>>(
                '/postcodes/SW1A1AA/validate',
            );

            expect(response.status).toBe(200);
            expect(response.data.result).toBe(true);
        });

        it('returns false for an invalid postcode format', async () => {
            const response = await client.get<PostcodeApiResponse<boolean>>(
                '/postcodes/BADCODE/validate',
            );

            expect(response.status).toBe(200);
            expect(response.data.result).toBe(false);
        });
    });

    // -------------------------------------------------------------------------
    // GET – random postcode
    // -------------------------------------------------------------------------

    describe('GET /random/postcodes', () => {
        it('returns a random postcode with required fields', async () => {
            const response = await client.get<PostcodeApiResponse<PostcodeResult>>(
                '/random/postcodes',
            );

            expect(response.status).toBe(200);
            const result = response.data.result;
            expect(result.postcode).toBeTruthy();
            expect(typeof result.latitude).toBe('number');
            expect(typeof result.longitude).toBe('number');
        });
    });

    // -------------------------------------------------------------------------
    // POST – bulk postcode lookup
    // -------------------------------------------------------------------------

    describe('POST /postcodes (bulk lookup)', () => {
        it('returns results for multiple valid postcodes', async () => {
            const response = await client.post<
                PostcodeApiResponse<BulkLookupResult[]>
            >('/postcodes', { postcodes: ['SW1A1AA', 'EC1A1BB', 'W1A0AX'] });

            expect(response.status).toBe(200);
            expect(Array.isArray(response.data.result)).toBe(true);
            expect(response.data.result).toHaveLength(3);

            response.data.result.forEach((item) => {
                expect(item).toHaveProperty('query');
                expect(item).toHaveProperty('result');
            });
        });

        it('returns null result entry for an invalid postcode in bulk request', async () => {
            const response = await client.post<
                PostcodeApiResponse<BulkLookupResult[]>
            >('/postcodes', { postcodes: ['SW1A1AA', 'INVALID99'] });

            expect(response.status).toBe(200);

            const invalidEntry = response.data.result.find(
                (item) => item.query === 'INVALID99',
            );
            expect(invalidEntry?.result).toBeNull();
        });

        it('returns 400 when postcodes array exceeds the 100-item limit', async () => {
            const tooMany = Array.from({ length: 101 }, (_, i) => `SW${i}A1AA`);

            await expect(
                client.post('/postcodes', { postcodes: tooMany }),
            ).rejects.toMatchObject({ response: { status: 400 } });
        });
    });

    // -------------------------------------------------------------------------
    // PUT – not supported by postcodes.io (error handling demo)
    // -------------------------------------------------------------------------

    describe('PUT – error handling', () => {
        it('throws an AxiosError when PUT is not supported by the endpoint', async () => {
            await expect(
                client.put('/postcodes/SW1A1AA', {}),
            ).rejects.toThrow();
        });

        it('catches PUT error and exposes HTTP status via axios.isAxiosError', async () => {
            try {
                await client.put('/postcodes/SW1A1AA', {});
                fail('Expected an error to be thrown');
            } catch (err) {
                expect(axios.isAxiosError(err)).toBe(true);
                if (axios.isAxiosError(err)) {
                    expect(err.response?.status).toBeGreaterThanOrEqual(400);
                }
            }
        });
    });

    // -------------------------------------------------------------------------
    // DELETE – not supported by postcodes.io (error handling demo)
    // -------------------------------------------------------------------------

    describe('DELETE – error handling', () => {
        it('throws an AxiosError when DELETE is not supported by the endpoint', async () => {
            await expect(client.delete('/postcodes/SW1A1AA')).rejects.toThrow();
        });

        it('catches DELETE error and exposes HTTP status via axios.isAxiosError', async () => {
            try {
                await client.delete('/postcodes/SW1A1AA');
                fail('Expected an error to be thrown');
            } catch (err) {
                expect(axios.isAxiosError(err)).toBe(true);
                if (axios.isAxiosError(err)) {
                    expect(err.response?.status).toBeGreaterThanOrEqual(400);
                }
            }
        });
    });
});
