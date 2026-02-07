import { Card } from "./ui/Card"

export function StatsCards({ items = [], cekMap = {}, anggota = [], absenMap = {} }) {
    // Calculate statistics
    const today = new Date().toLocaleDateString("en-CA")

    // Total items checked today
    const checkedToday = Object.values(cekMap).filter(Boolean).length
    const totalItems = items.length
    const checkPercentage = totalItems > 0 ? Math.round((checkedToday / totalItems) * 100) : 0

    // Attendance today
    const presentToday = Object.values(absenMap).filter(Boolean).length
    const totalScheduled = anggota.length
    const attendancePercentage = totalScheduled > 0 ? Math.round((presentToday / totalScheduled) * 100) : 0

    // Items needing attention (rusak + hilang)
    const needsAttention = items.filter(item => {
        const status = item.status_breakdown
        if (status) {
            return (status.RUSAK > 0) || (status.HILANG > 0)
        }
        return item.status === "RUSAK" || item.status === "HILANG"
    }).length

    return (
        <div className="grid gap-4 md:grid-cols-3 mb-8">
            {/* Total Komponen */}
            <Card className="p-6">
                <div className="flex items-start justify-between">
                    <div className="flex-1">
                        <div className="text-sm font-medium text-gray-500 mb-2">Total Komponen</div>
                        <div className="text-3xl font-bold text-gray-900 mb-1">{totalItems}</div>
                        <div className="flex items-center gap-2 text-xs">
                            <span className={`px-2 py-1 rounded-full ${checkPercentage >= 80 ? 'bg-emerald-50 text-emerald-600' : checkPercentage >= 50 ? 'bg-amber-50 text-amber-600' : 'bg-rose-50 text-rose-600'}`}>
                                {checkedToday}/{totalItems} di-cek
                            </span>
                            <span className="text-gray-400">{checkPercentage}%</span>
                        </div>
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-orange-50 flex items-center justify-center">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ff7a00" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                            <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
                            <line x1="12" y1="22.08" x2="12" y2="12" />
                        </svg>
                    </div>
                </div>
            </Card>

            {/* Kehadiran Piket */}
            <Card className="p-6">
                <div className="flex items-start justify-between">
                    <div className="flex-1">
                        <div className="text-sm font-medium text-gray-500 mb-2">Kehadiran Piket</div>
                        <div className="text-3xl font-bold text-gray-900 mb-1">
                            {totalScheduled > 0 ? `${presentToday}/${totalScheduled}` : "0"}
                        </div>
                        <div className="flex items-center gap-2 text-xs">
                            <span className={`px-2 py-1 rounded-full ${attendancePercentage === 100 ? 'bg-emerald-50 text-emerald-600' : attendancePercentage >= 50 ? 'bg-amber-50 text-amber-600' : 'bg-rose-50 text-rose-600'}`}>
                                {totalScheduled > 0 ? `${attendancePercentage}% hadir` : 'No schedule'}
                            </span>
                        </div>
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                            <circle cx="9" cy="7" r="4" />
                            <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                        </svg>
                    </div>
                </div>
            </Card>

            {/* Status Alert */}
            <Card className="p-6">
                <div className="flex items-start justify-between">
                    <div className="flex-1">
                        <div className="text-sm font-medium text-gray-500 mb-2">Status Alert</div>
                        <div className="text-3xl font-bold text-gray-900 mb-1">{needsAttention}</div>
                        <div className="flex items-center gap-2 text-xs">
                            <span className={`px-2 py-1 rounded-full ${needsAttention === 0 ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                                {needsAttention === 0 ? 'Semua Normal' : 'Perlu Perhatian'}
                            </span>
                        </div>
                    </div>
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${needsAttention === 0 ? 'bg-emerald-50' : 'bg-rose-50'}`}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={needsAttention === 0 ? '#10b981' : '#f43f5e'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                            <line x1="12" y1="9" x2="12" y2="13" />
                            <line x1="12" y1="17" x2="12.01" y2="17" />
                        </svg>
                    </div>
                </div>
            </Card>
        </div>
    )
}
