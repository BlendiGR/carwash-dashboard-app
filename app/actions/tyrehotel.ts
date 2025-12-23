"use server";

import { prisma } from "@/prisma/prisma";

const PAGE_SIZE = 12;

export async function fetchTyres(query?: string | null, page: number = 1) {
    const skip = (page - 1) * PAGE_SIZE;
    
    const whereClause = {
        ...(query && {
            OR: [
                { plate: { contains: query, mode: "insensitive" as const } },
                { number: { contains: query, mode: "insensitive" as const } },
                { location: { contains: query, mode: "insensitive" as const } },
                { customer: { name: { contains: query, mode: "insensitive" as const } } },
            ]
        }),
    };

    const [tyres, total] = await Promise.all([
        prisma.tyre.findMany({
            where: whereClause,
            include: { customer: true },
            orderBy: { dateStored: 'desc' },
            skip,
            take: PAGE_SIZE
        }),
        prisma.tyre.count({ where: whereClause })
    ]);

    return {
        tyres,
        pagination: {
            currentPage: page,
            totalPages: Math.ceil(total / PAGE_SIZE),
            totalItems: total
        }
    };
}

export async function tyreCounts() {

    const byLocation = await prisma.tyre.groupBy({
        by: ['location'],
        _count: { id: true },
        where: { isStored: true }
    });

    const countsByLocation = byLocation.map(l => ({
        location: l.location ?? 'Unknown',
        count: l._count.id
    }));

    const total = countsByLocation.reduce((acc, l) => acc + l.count, 0);

    return {
        countsByLocation,
        total
    };
}