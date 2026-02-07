import { useState, useEffect } from "react"
import { Card } from "./ui/Card"
import { Button } from "./ui/Button"
import { Input } from "./ui/Input"
import { Badge } from "./ui/Badge"

export function DetailModal({ item, onClose, onSave }) {
    const [breakdown, setBreakdown] = useState({})
    const [serials, setSerials] = useState({})

    useEffect(() => {
        if (item) {
            setBreakdown({ ...(item.status_breakdown || {}) })
            setSerials({ ...(item.serials_by_status || {}) })
        }
    }, [item])

    const getSerialCount = (key) => serials[key]?.length || 0

    const updateBreakdown = (key, value) => {
        const v = Math.max(0, Number(value) || 0)
        setBreakdown(prev => ({ ...prev, [key]: v }))
    }

    const updateSerials = (key, value) => {
        const list = value.split(",").map(s => s.trim()).filter(Boolean)
        setSerials(prev => ({ ...prev, [key]: list }))
    }

    const handleSave = () => {
        const cleanBreakdown = { ...breakdown }
        Object.keys(cleanBreakdown).forEach(k => {
            if (!cleanBreakdown[k]) delete cleanBreakdown[k]
        })

        const cleanSerials = { ...serials }
        Object.keys(cleanSerials).forEach(k => {
            if (!Array.isArray(cleanSerials[k]) || cleanSerials[k].length === 0) {
                delete cleanSerials[k]
            }
        })

        onSave(item.id, cleanBreakdown, cleanSerials)
    }

    if (!item) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
            <div className="w-full max-w-2xl animate-in zoom-in-95 duration-200">
                <Card className="border-orange-200 shadow-2xl">
                    <div className="flex items-center justify-between border-b border-gray-200 pb-6 mb-6">
                        <div>
                            <Badge variant="outline" className="mb-2">Edit Mode</Badge>
                            <h3 className="text-2xl font-bold text-gray-900">{item.nama}</h3>
                        </div>
                        <Button variant="ghost" onClick={onClose} className="w-10 h-10 p-0 rounded-full flex items-center justify-center">✕</Button>
                    </div>

                    <div className="grid gap-4 max-h-[50vh] overflow-y-auto custom-scrollbar pr-2">
                        {(["NORMAL", "RUSAK", "DIPINJAM", "HILANG"]).map(key => {
                            const count = Number(breakdown[key] || 0)
                            const serialCount = getSerialCount(key)
                            const mismatch = serialCount > 0 && serialCount !== count

                            return (
                                <div key={key} className="p-4 rounded-2xl bg-gray-50 border border-gray-200">
                                    <div className="flex items-center justify-between mb-4">
                                        <span className={`text-sm font-bold tracking-wider ${key === 'RUSAK' ? 'text-rose-600' : 'text-gray-700'}`}>
                                            {key}
                                        </span>
                                        <div className="flex items-center gap-3">
                                            <span className="text-xs text-gray-500 uppercase font-bold">Total Unit</span>
                                            <Input
                                                className="w-20 py-1 h-8 text-right bg-white border-gray-300"
                                                type="number"
                                                min="0"
                                                value={breakdown[key] || 0}
                                                onChange={e => updateBreakdown(key, e.target.value)}
                                            />
                                        </div>
                                    </div>
                                    <textarea
                                        className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 outline-none transition-all focus:border-orange-500 resize-none h-24"
                                        placeholder={`Masukkan nomor seri untuk item ${key}... (pisahkan dengan koma)`}
                                        value={(serials[key] || []).join(", ")}
                                        onChange={e => updateSerials(key, e.target.value)}
                                    />
                                    {mismatch && (
                                        <div className="mt-3 flex items-center gap-2 text-[11px] text-orange-700 bg-orange-100 p-2 rounded-lg">
                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" /></svg>
                                            Jumlah unit ({count}) tidak sama dengan jumlah seri ({serialCount}).
                                        </div>
                                    )}
                                </div>
                            )
                        })}
                    </div>

                    <div className="mt-8 flex justify-end gap-3 pt-6 border-t border-gray-200">
                        <Button variant="secondary" onClick={onClose}>Batal</Button>
                        <Button variant="primary" onClick={handleSave}>Simpan Perubahan</Button>
                    </div>
                </Card>
            </div>
        </div>
    )
}
