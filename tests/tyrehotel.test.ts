import { describe, it, expect, vi, beforeEach } from "vitest";
import { fetchTyres, tyreCounts, customerCount, fetchCustomers, fetchLocations, findCustomerByPhone, createTyre, toggleTyreStatus } from "@/app/actions/tyrehotel";
import { auth } from "@/auth";
import { prisma } from "@/prisma/prisma";

// Mock server-only
vi.mock("server-only", () => ({}));

// Mock auth
vi.mock("@/auth", () => ({
  auth: vi.fn(),
}));

// Mock next/cache
vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
}));

// Mock prisma
vi.mock("@/prisma/prisma", () => ({
  prisma: {
    tyre: {
      findMany: vi.fn(),
      count: vi.fn(),
      create: vi.fn(),
      groupBy: vi.fn(),
      update: vi.fn(),
      findUnique: vi.fn(),
    },
    customer: {
      findMany: vi.fn(),
      count: vi.fn(),
      findFirst: vi.fn(),
    },
  },
}));

// Mock unauthed helper 
const mockUnauthenticated = () => {
  vi.mocked(auth).mockResolvedValue(null as any);
};

//Mock authed helper 
const mockAuthenticated = () => {
  vi.mocked(auth).mockResolvedValue({ user: { id: "1" } } as any);
};

describe("tyrehotel actions", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("fetchTyres", () => {
    it("should return error result if user is not logged in", async () => {
      mockUnauthenticated();

      const result = await fetchTyres();

      expect(result.success).toBe(false);
      expect(prisma.tyre.findMany).not.toHaveBeenCalled();
    });

    it("should return success result with data if user is logged in", async () => {
      mockAuthenticated();

      vi.mocked(prisma.tyre.findMany).mockResolvedValue([]);
      vi.mocked(prisma.tyre.count).mockResolvedValue(0);

      const result = await fetchTyres();

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.tyres).toEqual([]);
      }
      expect(prisma.tyre.findMany).toHaveBeenCalled();
    });
  });

  describe("tyreCounts", () => {
    it("should return error result if user is not logged in", async () => {
      mockUnauthenticated();

      const result = await tyreCounts();

      expect(result.success).toBe(false);
      expect(prisma.tyre.groupBy).not.toHaveBeenCalled();
    });

    it("should return success result with data if user is logged in", async () => {
      mockAuthenticated();

      vi.mocked(prisma.tyre.groupBy).mockResolvedValue([]);

      const result = await tyreCounts();

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.countsByLocation).toEqual([]);
      }
      expect(prisma.tyre.groupBy).toHaveBeenCalled();
    });
  });

  describe("customerCount", () => {
    it("should return error result if user is not logged in", async () => {
      mockUnauthenticated();

      const result = await customerCount();

      expect(result.success).toBe(false);
      expect(prisma.customer.count).not.toHaveBeenCalled();
    });

    it("should return success result with data if user is logged in", async () => {
      mockAuthenticated();

      vi.mocked(prisma.customer.count).mockResolvedValue(0);

      const result = await customerCount();

      expect(result.success).toBe(true);
      expect(prisma.customer.count).toHaveBeenCalled();
    });
  });

  describe("fetchCustomers", () => {
    it("should return error result if user is not logged in", async () => {
      mockUnauthenticated();

      const result = await fetchCustomers();

      expect(result.success).toBe(false);
      expect(prisma.customer.findMany).not.toHaveBeenCalled();
    });

    it("should return success result with data if user is logged in", async () => {
      mockAuthenticated();

      vi.mocked(prisma.customer.findMany).mockResolvedValue([]);

      const result = await fetchCustomers();

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toBeDefined();
      }
      expect(prisma.customer.findMany).toHaveBeenCalled();
    });
  });

  describe("fetchLocations", () => {
    it("should return error result if user is not logged in", async () => {
      mockUnauthenticated();

      const result = await fetchLocations();

      expect(result.success).toBe(false);
      expect(prisma.tyre.findMany).not.toHaveBeenCalled();
    });

    it("should return success result with data if user is logged in", async () => {
      mockAuthenticated();

      const result = await fetchLocations();

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toBeDefined();
      }
      expect(prisma.tyre.findMany).toHaveBeenCalled();
    });
  });

  describe("findCustomersByPhone", () => {
    it("should return error result if user is not logged in", async () => {
      mockUnauthenticated();

      const result = await findCustomerByPhone("0441234567");

      expect(result.success).toBe(false);
      expect(prisma.customer.findMany).not.toHaveBeenCalled();
    });

    it("should return success result if user is logged in", async () => {
      mockAuthenticated();

      const result = await findCustomerByPhone("0441234567");

      expect(result.success).toBe(true);
      expect(prisma.customer.findFirst).toHaveBeenCalled();
    });

    it("should return error if number is not in correct format", async () => {
      mockAuthenticated();

      const result = await findCustomerByPhone("1234");

      expect(result.success).toBe(false);
      expect(prisma.customer.findFirst).not.toHaveBeenCalled();
    });
  });

  describe("createTyre", () => {
    it("should return error result if user is not logged in", async () => {
      mockUnauthenticated();

      const result = await createTyre({
        number: "1234567",
        plate: "ABC-123",
        location: "Helsinki",
        customerId: 1,        
      });

      expect(result.success).toBe(false);
      expect(prisma.tyre.create).not.toHaveBeenCalled();
    });

    it("should return success result with data if user is logged in", async () => {
      mockAuthenticated();

      const result = await createTyre({
        number: "0441234567",
        plate: "ABC-123",
        location: "Helsinki",
      });

      expect(result.success).toBe(true);
      expect(prisma.tyre.create).toHaveBeenCalled();
    });

    it("should return success = false, if data is invalid", async () => {
      mockAuthenticated();

      const result = await createTyre({
        number: "1234",
        plate: "ABCDE12",
        location: "He",
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBeDefined();
      }
      expect(prisma.tyre.create).not.toHaveBeenCalled();
    });

    describe("toggleTyreStatus", () => {
      it("should return error result if user is not logged in", async () => {
        mockUnauthenticated();

        const result = await toggleTyreStatus(1);

        expect(result.success).toBe(false);
        expect(prisma.tyre.update).not.toHaveBeenCalled();
      });

      it("should return success result with data if user is logged in", async () => {
        mockAuthenticated();

        // Mock findUnique to return a tyre (so it passes the "tyre not found" check)
        vi.mocked(prisma.tyre.findUnique).mockResolvedValue({
          id: 100,
          plate: "ABC-123",
          number: "0441234567",
          location: "Helsinki",
          isStored: true,
          dateStored: new Date(),
          deletedAt: null,
          customerId: null,
        });

        // Mock update to return the updated tyre
        vi.mocked(prisma.tyre.update).mockResolvedValue({
          id: 100,
          plate: "ABC-123",
          number: "0441234567",
          location: "Helsinki",
          isStored: false,
          dateStored: new Date(),
          deletedAt: new Date(),
          customerId: null,
          customer: null,
        } as any);

        const result = await toggleTyreStatus(100);

        expect(result.success).toBe(true);
        expect(prisma.tyre.findUnique).toHaveBeenCalledWith({ where: { id: 100 } });
        expect(prisma.tyre.update).toHaveBeenCalled();
      });
    });
  });
});
