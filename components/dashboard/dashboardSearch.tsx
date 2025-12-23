'use client';

import SearchInput from './searchInput';
import { Package } from 'lucide-react';
import { Button } from '../ui/button';
import { Plus } from 'lucide-react';
import { useTranslations } from 'next-intl';

export default function DashboardSearch() {
    const t = useTranslations('Dashboard');
    
    return (
        <div className="flex flex-col gap-4 rounded-2xl">
            <div className="flex flex-col sm:flex-row justify-between gap-4">
                <div className="flex items-center gap-2">
                    <div className="p-3 text-white bg-[#111827] rounded-2xl w-fit">
                        <Package size={30} />
                    </div>
                    <div>
                        <p className="text-lg font-semibold">{t('title')}</p>
                        <p className="text-sm text-gray-500">{t('subtitle')}</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Button
                        className="rounded-xl"
                        size="lg"
                    >
                        <Plus size={20} />
                        <span className="ml-2">{t('addStorageUnit')}</span>
                    </Button>
                </div>
            </div>
            <div className="flex items-center w-full">
                <SearchInput className="bg-white" />
            </div>
        </div>
    )
}
