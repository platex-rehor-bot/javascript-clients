import axios from 'axios';
import { RbacClient } from '../src/api';

describe('generated object parameters', () => {
  it('passes path parameters and nested Axios options through the injected instance', async () => {
    const instance = axios.create();
    const response = { data: { name: 'example' }, status: 200 } as Awaited<ReturnType<typeof instance.request>>;
    const request = jest.spyOn(instance, 'request').mockResolvedValue(response);
    const client = RbacClient('https://example.test', { axios: instance });

    const result = await client.getGroup({ uuid: 'group/id', options: { headers: { 'X-Test': 'yes' } } });

    expect(request).toHaveBeenCalledWith(expect.objectContaining({
      url: 'https://example.test/groups/group%2Fid/',
      method: 'GET',
      headers: expect.objectContaining({ 'X-Test': 'yes' }),
    }));
    expect(result).toBe(response);
  });

  it('accepts an empty object for an operation without parameters', async () => {
    const instance = axios.create();
    const response = { data: {}, status: 200 } as Awaited<ReturnType<typeof instance.request>>;
    const request = jest.spyOn(instance, 'request').mockResolvedValue(response);
    const client = RbacClient('https://example.test', { axios: instance });

    await client.getStatus({});
    expect(request).toHaveBeenCalledWith(expect.objectContaining({ url: 'https://example.test/status/' }));
  });
});

// These calls must remain compile-time errors and are never executed.
function positionalCallsAreRejected(client: ReturnType<typeof RbacClient>) {
  // @ts-expect-error positional arguments are no longer supported
  client.getGroup('group-id', {});
  // @ts-expect-error required properties must be provided
  client.getGroup({});
}
void positionalCallsAreRejected;
