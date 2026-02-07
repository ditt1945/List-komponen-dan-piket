import { useEffect, useState } from "react"

export function NotificationBanner({ items = [], cekMap = {}, anggota = [], absenMap = {} }) {
    const [dismissed, setDismissed] = useState({})

    // Calculate notification conditions
    const uncheckedCount = items.length - Object.values(cekMap).filter(Boolean).length
    const presentCount = Object.values(absenMap).filter(Boolean).length
    const allPresent = anggota.length > 0 && presentCount === anggota.length

    const needsAttention = items.filter(item => {
        const status = item.status_breakdown
        if (status) {
            return (status.RUSAK > 0) || (status.HILANG > 0)
        }
        return item.status === "RUSAK" || item.status === "HILANG"
    }).length

    const currentHour = new Date().getHours()

    // Load dismissed state from localStorage
    useEffect(() => {
        const stored = localStorage.getItem('dismissed_notifications')
        if (stored) {
            setDismissed(JSON.parse(stored))
        }
    }, [])

    const dismiss = (key) => {
        const newDismissed = { ...dismissed, [key]: true }
        setDismissed(newDismissed)
        localStorage.setItem('dismissed_notifications', JSON.stringify(newDismissed))
    }

    const notifications = []

    // Warning: Unchecked items (show after 2pm)
    if (uncheckedCount > 0 && currentHour >= 14 && !dismissed.unchecked) {
        notifications.push({
            key: 'unchecked',
            type: 'warning',
            icon: (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                    <line x1="12" y1="9" x2="12" y2="13" />
                    <line x1="12" y1="17" x2="12.01" y2="17" />
                </svg>
            ),
            message: `${uncheckedCount} komponen belum di-cek hari ini`
        })
    }

    // Success: All present
    if (allPresent && !dismissed.allPresent) {
        notifications.push({
            key: 'allPresent',
            type: 'success',
            icon: (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                    <polyline points="22 4 12 14.01 9 11.01" />
                </svg>
            ),
            message: 'Semua piket sudah hadir!'
        })
    }

    // Danger: Items need attention
    if (needsAttention > 0 && !dismissed.attention) {
        notifications.push({
            key: 'attention',
            type: 'danger',
            icon: (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="8" x2="12" y2="12" />
                    <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
            ),
            message: `${needsAttention} komponen rusak/hilang perlu perhatian`
        })
    }

    if (notifications.length === 0) return null

    const colors = {
        warning: 'bg-amber-50 border border-amber-200 text-amber-800',
        success: 'bg-emerald-50 border border-emerald-200 text-emerald-800',
        danger: 'bg-rose-50 border border-rose-200 text-rose-800'
    }

    return (
        <div className="space-y-3 mb-6">
            {notifications.map(notif => (
                <div
                    key={notif.key}
                    className={`flex items-center justify-between p-4 rounded-xl ${colors[notif.type]} animate-in fade-in slide-in-from-top-2 duration-300`}
                >
                    <div className="flex items-center gap-3">
                        {notif.icon}
                        <span className="text-sm font-medium">{notif.message}</span>
                    </div>
                    <button
                        onClick={() => dismiss(notif.key)}
                        className="p-1 hover:bg-black/5 rounded-lg transition-colors"
                        aria-label="Tutup"
                    >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <line x1="18" y1="6" x2="6" y2="18" />
                            <line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                    </button>
                </div>
            ))}
        </div>
    )
}
