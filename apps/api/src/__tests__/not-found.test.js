import { apiHelper } from './api-helper';

describe('nonexisting routes', () => {
  it('returns 404 with the path and method info', async () => {
    const api = await apiHelper();
    const response = await api.request.get('/nonexisting');
    expect(response.status).toBe(404);
    expect(response.body.message).toMatch(/GET \/nonexisting/);
  });
});
