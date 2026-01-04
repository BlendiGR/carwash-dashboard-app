import { describe, it, expect, vi, beforeEach } from 'vitest';
import { fetchTyres } from '@/app/actions/tyrehotel';
import { auth } from '@/auth';
import { prisma } from '@/prisma/prisma';

// Mock server-only
vi.mock('server-only', () => ({}));

// Mock auth
vi.mock('@/auth', () => ({
  auth: vi.fn(),
}));

// Mock prisma
vi.mock('@/prisma/prisma', () => ({
  prisma: {
    tyre: {
      findMany: vi.fn(),
      count: vi.fn(),
    },
  },
}));

describe('tyrehotel actions', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('fetchTyres', () => {
    it('should throw "Unauthorized" if user is not logged in', async () => {
      // Simulate logged out
      vi.mocked(auth).mockResolvedValue(null as any);

      await expect(fetchTyres()).rejects.toThrow('Unauthorized');
      
      // Verify prisma was NOT called
      expect(prisma.tyre.findMany).not.toHaveBeenCalled();
    });

    it('should call prisma if user is logged in', async () => {
      // Simulate logged in
      vi.mocked(auth).mockResolvedValue({ user: { id: '1' } } as any);
      
      // Mock prisma response
      vi.mocked(prisma.tyre.findMany).mockResolvedValue([]);
      vi.mocked(prisma.tyre.count).mockResolvedValue(0);

      const result = await fetchTyres();
      
      expect(result.tyres).toEqual([]);
      expect(prisma.tyre.findMany).toHaveBeenCalled();
    });
  });
});
