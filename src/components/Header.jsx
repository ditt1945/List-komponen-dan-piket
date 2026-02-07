import { Button } from "./ui/Button"

export function Header({ tab, setTab, currentDate }) {
    // Format date: "Jumat, 7 Februari 2025"
    const formatDate = () => {
        const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu']
        const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember']

        const now = new Date()
        const dayName = days[now.getDay()]
        const date = now.getDate()
        const monthName = months[now.getMonth()]
        const year = now.getFullYear()

        return `${dayName}, ${date} ${monthName} ${year}`
    }

    return (
        <header className="mb-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-white/5">
                <div className="flex items-center gap-4">
                    {/* Logo */}
                    <div className="w-12 h-12 rounded-xl bg-[#ff7a00] flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-orange-500/20">
                        E
                    </div>
                    <div>
                        <div className="text-xs font-bold uppercase tracking-[0.2em] text-[#ff7a00]">
                             Elite
                        </div>
                        <h1 className="text-2xl font-bold text-white mt-1">
                            Dashboard Piket
                        </h1>
                        <p className="text-xs text-white/40 mt-0.5">{formatDate()}</p>
                    </div>
                </div>

                <div className="flex items-center gap-2 bg-[#1a1a1a] p-1 rounded-full border border-white/5">
                    <Button
                        variant={tab === "inventaris" ? "primary" : "ghost"}
                        onClick={() => setTab("inventaris")}
                        className="rounded-full px-6 py-2 text-sm flex items-center gap-2"
                    >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                            <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
                            <line x1="12" y1="22.08" x2="12" y2="12" />
                        </svg>
                        Cek Komponen
                    </Button>
                    <Button
                        variant={tab === "absen" ? "primary" : "ghost"}
                        onClick={() => setTab("absen")}
                        className="rounded-full px-6 py-2 text-sm flex items-center gap-2"
                    >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                            <polyline points="22 4 12 14.01 9 11.01" />
                        </svg>
                        Piket Harian
                    </Button>
                </div>
            </div>
        </header>
    )
}
