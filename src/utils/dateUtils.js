// Utility functions for date and time formatting

export function getRelativeTime(dateString) {
    if (!dateString) return "Belum pernah"

    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now - date
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 1) return "Baru saja"
    if (diffMins < 60) return `${diffMins} menit lalu`
    if (diffHours < 24) return `${diffHours} jam lalu`
    if (diffDays === 1) return "Kemarin"
    if (diffDays < 7) return `${diffDays} hari lalu`

    // More than 7 days, show actual date
    return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
}

export function getTodayLocal() {
    return new Date().toLocaleDateString("en-CA")
}

export function formatIndonesianDate(date = new Date()) {
    const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu']
    const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember']

    const dayName = days[date.getDay()]
    const dateNum = date.getDate()
    const monthName = months[date.getMonth()]
    const year = date.getFullYear()

    return `${dayName}, ${dateNum} ${monthName} ${year}`
}
