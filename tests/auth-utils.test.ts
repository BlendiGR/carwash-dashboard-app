import { describe, it, expect, vi } from "vitest";
import { requireAuth } from "@/lib/auth-utils";
import { auth } from "@/auth";
import { fetchTyres, fetchLocations } from "@/app/actions/tyrehotel";

vi.mock("server-only", () => ({}));

// Mock the auth module
vi.mock("@/auth", () => ({
  auth: vi.fn(),
}));

// Mock prisma
vi.mock("@/prisma/prisma", () => ({
  prisma: {
    tyre: {
      findMany: vi.fn().mockResolvedValue([]),
      count: vi.fn().mockResolvedValue(0),
    },
  },
}));

describe("requireAuth", () => {
  it('should throw "Unauthorized" if no session exists', async () => {
    // Simulate logged out state
    vi.mocked(auth).mockResolvedValue(null as any);

    await expect(requireAuth()).rejects.toThrow("Unauthorized");
  });

  it('should throw "Unauthorized" if user is missing from session', async () => {
    // Simulate invalid session
    vi.mocked(auth).mockResolvedValue({ user: undefined } as any);

    await expect(requireAuth()).rejects.toThrow("Unauthorized");
  });

  it("should return session if user is authenticated", async () => {
    const mockSession = { user: { email: "test@example.com" } };
    vi.mocked(auth).mockResolvedValue(mockSession as any);

    const result = await requireAuth();
    expect(result).toEqual(mockSession);
  });

  it("should return false if user is not authenticated", async () => {
    const mockSession = { user: null };
    vi.mocked(auth).mockResolvedValue(mockSession as any);

    const result = await fetchTyres();
    expect(result.success).toEqual(false);

    const result2 = await fetchLocations();
    expect(result2.success).toEqual(false);
  });

  it("should return data if user is authenticated", async () => {
    const mockSession = { user: { email: "test@example.com" } };
    vi.mocked(auth).mockResolvedValue(mockSession as any);

    const result = await fetchTyres();
    expect(result.success).toEqual(true);
  
    if (result.success) {
      expect(result.data).toBeDefined();
      expect(result.data.tyres).toBeDefined();
    }

    const result2 = await fetchLocations();
    expect(result2.success).toEqual(true);
    
    if (result2.success) {
      expect(result2.data).toBeDefined();
    }
  });
});
