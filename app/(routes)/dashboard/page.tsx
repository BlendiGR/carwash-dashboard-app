import DashboardSearch from '@/components/dashboard/dashboardSearch'
import TyreCardSection from '@/components/dashboard/tyreCardSection'

export default function DashboardPage() {
    return (
        <div className="flex flex-col bg-gray-100 m-4 rounded-2xl p-4 max-w-[1450px] mx-auto sm:p-6 md:p-8 gap-4 shadow-md">
            <DashboardSearch />
            <TyreCardSection />
        </div>
    )
}