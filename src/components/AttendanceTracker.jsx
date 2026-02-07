import { Card } from "./ui/Card"
import { Badge } from "./ui/Badge"
import { DatePicker } from "./DatePicker"
import { getTodayLocal } from "../utils/dateUtils"

export function AttendanceTracker({ anggota, absenMap, selectedDate, onDateChange, onToggleAbsen }) {
    const getTodayFormatted = () => {
        const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu']
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des']

        const now = new Date()
        return `${days[now.getDay()]}, ${now.getDate()} ${months[now.getMonth()]} ${now.getFullYear()}`
    }

    const isToday = selectedDate === getTodayLocal()
    const isHistorical = !isToday

    return (
        <div className="max-w-3xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
            <DatePicker selectedDate={selectedDate} onDateChange={onDateChange} />

            <Card className="p-8 md:p-12 text-center border-orange-200 shadow-[0_0_50px_-20px_rgba(255,122,0,0.15)]">
                <div className="inline-block p-4 rounded-full bg-orange-50 text-[#ff7a00] mb-4">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                        <line x1="16" y1="2" x2="16" y2="6" />
                        <line x1="8" y1="2" x2="8" y2="6" />
                        <line x1="3" y1="10" x2="21" y2="10" />
                    </svg>
                </div>

                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                    {isHistorical ? "Riwayat Absen Piket" : "Absensi Piket Harian"}
                </h2>
                <div className="flex items-center justify-center gap-2 mb-1">
                    <span className="text-[#ff7a00] font-bold text-lg">{getTodayFormatted()}</span>
                </div>
                <p className="text-gray-500 text-sm mb-8">
                    {isHistorical
                        ? "Data absen dari tanggal sebelumnya (read-only)"
                        : "Centang untuk konfirmasi kehadiran piket"}
                </p>

                <div className="grid gap-3 text-left">
                    {anggota.length === 0 && (
                        <div className="text-center py-8 text-gray-400">
                            <p>Tidak ada jadwal piket untuk hari ini</p>
                        </div>
                    )}

                    {anggota.map(nama => {
                        const isHadir = !!absenMap[nama]
                        return (
                            <label
                                key={nama}
                                className={`group flex items-center justify-between p-4 rounded-2xl border transition-all duration-300 ${isHistorical
                                    ? 'cursor-default'
                                    : 'cursor-pointer'
                                    } ${isHadir
                                        ? "border-[#ff7a00] bg-orange-50 shadow-[0_4px_20px_-5px_rgba(255,122,0,0.3)]"
                                        : "border-gray-200 bg-white hover:border-orange-300"
                                    }`}
                            >
                                <div className="flex items-center gap-4">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg transition-colors ${isHadir ? 'bg-[#ff7a00] text-white' : 'bg-gray-100 text-gray-400'
                                        }`}>
                                        {nama.charAt(0)}
                                    </div>
                                    <span className={`text-lg font-medium transition-colors ${isHadir ? 'text-gray-900' : 'text-gray-500'}`}>
                                        {nama}
                                    </span>
                                </div>

                                <div className="relative">
                                    <input
                                        type="checkbox"
                                        className="peer sr-only"
                                        checked={isHadir}
                                        disabled={isHistorical}
                                        onChange={e => !isHistorical && onToggleAbsen(nama, e.target.checked)}
                                    />
                                    <Badge variant={isHadir ? 'default' : 'outline'} className={isHadir ? 'bg-[#ff7a00] text-white border-[#ff7a00]' : ''}>
                                        {isHadir ? 'HADIR' : 'BELUM'}
                                    </Badge>
                                </div>
                            </label>
                        )
                    })}
                </div>

                <div className="mt-8 p-4 bg-gray-50 rounded-xl border border-gray-200">
                    <p className="text-xs text-gray-500 flex items-start gap-2">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mt-0.5 flex-shrink-0">
                            <circle cx="12" cy="12" r="10" />
                            <line x1="12" y1="16" x2="12" y2="12" />
                            <line x1="12" y1="8" x2="12.01" y2="8" />
                        </svg>
                        <span><span className="font-semibold text-gray-700">Catatan:</span> {isHistorical ? "Data historis tidak dapat diubah. Gunakan navigasi tanggal untuk kembali ke hari ini." : "Daftar piket berdasarkan jadwal hari ini. Pastikan semua anggota piket sudah centang sebelum pulang."}</span>
                    </p>
                </div>
            </Card>
        </div>
    )
}
