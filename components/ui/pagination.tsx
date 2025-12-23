'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from './button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useTranslations } from 'next-intl';

interface PaginationProps {
    currentPage: number;
    totalPages: number;
}

export default function Pagination({ currentPage, totalPages }: PaginationProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const t = useTranslations('Dashboard');

    const goToPage = (page: number) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set('page', String(page));
        router.push(`?${params.toString()}`);
    };

    if (totalPages <= 1) return null;

    return (
        <div className="flex items-center justify-center gap-4 mt-6">
            <Button
                variant="outline"
                size="sm"
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage <= 1}
                className="rounded-xl"
            >
                <ChevronLeft size={18} />
            </Button>
            
            <span className="text-sm text-gray-600">
                {t('page')} {currentPage} {t('of')} {totalPages}
            </span>
            
            <Button
                variant="outline"
                size="sm"
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage >= totalPages}
                className="rounded-xl"
            >
                <ChevronRight size={18} />
            </Button>
        </div>
    );
}
