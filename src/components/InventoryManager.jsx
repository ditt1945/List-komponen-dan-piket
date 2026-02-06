import { useState, useMemo } from "react"
import { Card } from "./ui/Card"
import { Button } from "./ui/Button"
import { Input } from "./ui/Input"
import { Select } from "./ui/Select"
import { Badge, getStatusVariant } from "./ui/Badge"
import { Loading, EmptyState } from "./ui/Loading"
import { showToast } from "../utils/toast"
import { getRelativeTime, getTodayLocal } from "../utils/dateUtils"

export function InventoryManager({
    items,
    cekMap,
    onToggleCheck,
    onAddItem,
    onOpenDetail,
    checkDates = {},
    loading = false
}) {
    const [nama, setNama] = useState("")
    const [jumlah, setJumlah] = useState(1)
    const [status, setStatus] = useState("NORMAL")
    const [seri, setSeri] = useState("")

    const [query, setQuery] = useState("")
    const [sortKey, setSortKey] = useState("nama")
    const [statusFilter, setStatusFilter] = useState("ALL")

    // Input validation
    const isFormValid = nama.trim().length > 0 && jumlah > 0

    const handleSubmit = () => {
        if (!isFormValid) {
            showToast("Nama komponen wajib diisi", "error")
            return
        }

        try {
            onAddItem({ nama, jumlah: Number(jumlah), status, seri })
            setNama("")
            setStatus("NORMAL")
            setSeri("")
            setJumlah(1)
            showToast("Komponen berhasil ditambahkan", "success")
        } catch (error) {
            showToast("Gagal menambahkan komponen", "error")
        }
    }

    // Simplified filtering (removed quantity range)
    const filtered = useMemo(() => {
        const q = query.trim().toLowerCase()
        let list = items

        // Search filter
        if (q) {
            list = list.filter(i => (i.nama || "").toLowerCase().includes(q))
        }

        // Status filter
        if (statusFilter !== "ALL") {
            list = list.filter(i => {
                if (statusFilter === "BREAKDOWN") {
                    return i.status_breakdown && Object.keys(i.status_breakdown).length > 0
                }
                return i.status === statusFilter || i.status_breakdown?.[statusFilter] > 0
            })
        }

        // Add metrics for sorting
        const withMetrics = list.map(i => ({
            ...i,
            rusak: i.status_breakdown?.RUSAK || 0
        }))

        // Sorting
        if (sortKey === "nama") {
            return withMetrics.sort((a, b) => (a.nama || "").localeCompare(b.nama || ""))
        }
        if (sortKey === "jumlah") {
            return withMetrics.sort((a, b) => (b.jumlah || 0) - (a.jumlah || 0))
        }
        if (sortKey === "rusak") {
            return withMetrics.sort((a, b) => (b.rusak || 0) - (a.rusak || 0))
        }
        return withMetrics
    }, [items, query, sortKey, statusFilter])

    if (loading) {
        return <Loading />
    }

    const today = getTodayLocal()

    return (
        <div className="space-y-6">
            {/* Form Section - More Prominent */}
            <Card className="border-[#ff7a00]/30 relative overflow-hidden shadow-lg shadow-[#ff7a00]/5">
                <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-[#ff7a00] to-[#ff9933]"></div>
                <div className="mb-6">
                    <h2 className="text-xl font-bold text-white tracking-tight">Tambah Komponen</h2>
                    <p className="text-sm text-white/50 mt-1">Daftarkan item baru ke inventaris.</p>
                </div>

                <div className="space-y-4">
                    <div className="grid gap-3 sm:grid-cols-2">
                        <Input
                            placeholder="Nama Komponen *"
                            value={nama}
                            onChange={e => setNama(e.target.value)}
                            className={!nama.trim() && nama.length > 0 ? "border-rose-500/50" : ""}
                        />
                        <Select
                            value={status}
                            onChange={e => setStatus(e.target.value)}
                        >
                            <option className="bg-[#1a1a1a] text-white" value="NORMAL">Kondisi: NORMAL</option>
                            <option className="bg-[#1a1a1a] text-white" value="RUSAK">Kondisi: RUSAK</option>
                            <option className="bg-[#1a1a1a] text-white" value="DIPINJAM">Kondisi: DIPINJAM</option>
                            <option className="bg-[#1a1a1a] text-white" value="HILANG">Kondisi: HILANG</option>
                        </Select>
                    </div>

                    <div className="grid gap-3 grid-cols-[1fr_80px_auto]">
                        <Input
                            placeholder="No. Seri (Opsional)"
                            value={seri}
                            onChange={e => setSeri(e.target.value)}
                        />
                        <Input
                            type="number"
                            min="1"
                            value={jumlah}
                            onChange={e => setJumlah(Math.max(1, Number(e.target.value) || 1))}
                            className="text-center font-bold tabular-nums"
                        />
                        <Button
                            onClick={handleSubmit}
                            variant="primary"
                            disabled={!isFormValid}
                            className={!isFormValid ? "opacity-50 cursor-not-allowed" : ""}
                        >
                            TAMBAH
                        </Button>
                    </div>
                </div>
            </Card>

            {/* List Section */}
            <section>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                    <div>
                        <h2 className="text-xl font-bold text-white tracking-tight">Cek Komponen Harian</h2>
                        <p className="text-white/40 text-xs mt-0.5">{filtered.length} dari {items.length} item • Centang yang sudah di-cek hari ini</p>
                    </div>
                </div>

                {/* Simplified Filters - Inline & Subtle */}
                <div className="flex flex-wrap items-center gap-3 mb-4 p-3 bg-white/[0.02] rounded-xl border border-white/5">
                    <div className="relative flex-1 min-w-[200px]">
                        <Input
                            className="w-full bg-transparent border-white/10 py-2 pl-9 pr-3 text-sm"
                            placeholder="Cari komponen..."
                            value={query}
                            onChange={e => setQuery(e.target.value)}
                        />
                        <svg className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/50" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>

                    <Select
                        className="bg-transparent border-white/10 py-2 px-3 text-sm w-auto min-w-[140px]"
                        value={statusFilter}
                        onChange={e => setStatusFilter(e.target.value)}
                    >
                        <option className="bg-[#1a1a1a] text-white" value="ALL">Semua Status</option>
                        <option className="bg-[#1a1a1a] text-white" value="NORMAL">Normal</option>
                        <option className="bg-[#1a1a1a] text-white" value="RUSAK">Rusak</option>
                        <option className="bg-[#1a1a1a] text-white" value="DIPINJAM">Dipinjam</option>
                        <option className="bg-[#1a1a1a] text-white" value="HILANG">Hilang</option>
                        <option className="bg-[#1a1a1a] text-white" value="BREAKDOWN">Breakdown</option>
                    </Select>

                    <Select
                        className="bg-transparent border-white/10 py-2 px-3 text-sm w-auto"
                        value={sortKey}
                        onChange={e => setSortKey(e.target.value)}
                    >
                        <option className="bg-[#1a1a1a] text-white" value="nama">A-Z</option>
                        <option className="bg-[#1a1a1a] text-white" value="jumlah">Terbanyak</option>
                        <option className="bg-[#1a1a1a] text-white" value="rusak">Rusak ↓</option>
                    </Select>
                </div>

                <div className="space-y-2">
                    {filtered.length === 0 && (
                        <EmptyState
                            title={items.length === 0 ? "Belum Ada Komponen" : "Tidak Ditemukan"}
                            description={items.length === 0 ? "Mulai dengan menambahkan item pertama." : "Ubah kata kunci atau filter."}
                        />
                    )}

                    {filtered.map(item => {
                        const checked = !!cekMap[item.id]
                        const lastCheckedDate = checkDates[item.id]
                        const isCheckedToday = lastCheckedDate === today
                        const relativeTime = getRelativeTime(lastCheckedDate)

                        return (
                            <div
                                key={item.id}
                                className={`group flex items-center justify-between p-4 rounded-xl border bg-[#141414]/50 hover:bg-[#141414] hover:border-[#ff7a00]/20 transition-all ${checked ? 'opacity-50 border-white/5' : 'border-white/5'}`}
                            >
                                <div className="flex items-center gap-4 flex-1">
                                    <label className="cursor-pointer relative">
                                        <input
                                            type="checkbox"
                                            className="peer h-5 w-5 appearance-none border-2 border-white/20 rounded-lg checked:bg-[#ff7a00] checked:border-[#ff7a00] transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ff7a00]"
                                            checked={checked}
                                            onChange={e => onToggleCheck(item.id, e.target.checked)}
                                        />
                                        <svg className="absolute w-3.5 h-3.5 text-white opacity-0 peer-checked:opacity-100 pointer-events-none left-0.5 top-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                        </svg>
                                    </label>

                                    <div className="flex-1 min-w-0">
                                        <div className="font-semibold text-white text-base truncate">{item.nama}</div>
                                        <div className="flex flex-wrap items-center gap-1.5 mt-1.5">
                                            {item.status_breakdown
                                                ? Object.entries(item.status_breakdown).map(([k, v]) => (
                                                    <Badge key={k} variant={getStatusVariant(k)}>
                                                        {k}: {v}
                                                    </Badge>
                                                ))
                                                : <Badge variant="success">NORMAL</Badge>
                                            }
                                            {/* Last checked indicator */}
                                            {!isCheckedToday && lastCheckedDate && (
                                                <span className="text-[10px] text-white/30 ml-1">
                                                    {relativeTime}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4">
                                    <div className="text-right hidden sm:block">
                                        <div className="text-xl font-bold text-white tabular-nums">{item.jumlah}</div>
                                        <div className="text-[9px] uppercase text-white/20 font-bold tracking-wider">Unit</div>
                                    </div>
                                    <Button
                                        variant="secondary"
                                        onClick={() => onOpenDetail(item)}
                                        className="px-4 py-1.5 text-sm"
                                    >
                                        Edit
                                    </Button>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </section>
        </div>
    )
}
