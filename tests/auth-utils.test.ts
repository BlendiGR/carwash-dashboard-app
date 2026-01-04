import { describe, it, expect, vi } from 'vitest';
import { requireAuth } from '@/lib/auth-utils';
import { auth } from '@/auth';

vi.mock('server-only', () => ({}));

// Mock the auth module
vi.mock('@/auth', () => ({
  auth: vi.fn(),
}));

describe('requireAuth', () => {
  it('should throw "Unauthorized" if no session exists', async () => {
    // Simulate logged out state
    vi.mocked(auth).mockResolvedValue(null as any);

    await expect(requireAuth()).rejects.toThrow('Unauthorized');
  });

  it('should throw "Unauthorized" if user is missing from session', async () => {
     // Simulate invalid session
    vi.mocked(auth).mockResolvedValue({ user: undefined } as any);

    await expect(requireAuth()).rejects.toThrow('Unauthorized');
  });

  it('should return session if user is authenticated', async () => {
    const mockSession = { user: { email: 'test@example.com' } };
    vi.mocked(auth).mockResolvedValue(mockSession as any);

    const result = await requireAuth();
    expect(result).toEqual(mockSession);
  });
});
