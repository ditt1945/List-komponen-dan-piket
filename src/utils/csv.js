// Export/Import utilities for CSV

export function exportToCSV(data, filename = 'export.csv') {
    if (!data || data.length === 0) {
        throw new Error('No data to export')
    }

    // Extract headers from first object
    const headers = ['ID', 'Nama', 'Jumlah', 'Status', 'Normal', 'Rusak', 'Dipinjam', 'Hilang', 'Serial Numbers']

    // Map data to CSV rows
    const rows = data.map(item => {
        const breakdown = item.status_breakdown || {}
        const serials = item.serials_by_status || {}
        const serialsStr = Object.entries(serials)
            .map(([status, nums]) => `${status}:${nums.join('|')}`)
            .join(';')

        return [
            item.id,
            item.nama,
            item.jumlah,
            item.status,
            breakdown.NORMAL || 0,
            breakdown.RUSAK || 0,
            breakdown.DIPINJAM || 0,
            breakdown.HILANG || 0,
            serialsStr
        ]
    })

    // Combine headers and rows
    const csvContent = [
        headers.join(','),
        ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n')

    // Create download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)

    link.setAttribute('href', url)
    link.setAttribute('download', filename)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
}

export function parseCSVFile(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader()

        reader.onload = (e) => {
            try {
                const text = e.target.result
                const lines = text.split('\n').filter(line => line.trim())

                if (lines.length < 2) {
                    reject(new Error('File CSV kosong atau tidak valid'))
                    return
                }

                // Skip header
                const dataLines = lines.slice(1)

                const items = dataLines.map(line => {
                    // Simple CSV parser (handles quoted fields)
                    const matches = line.match(/(".*?"|[^,]+)(?=\s*,|\s*$)/g)
                    if (!matches || matches.length < 4) return null

                    const values = matches.map(v => v.replace(/^"|"$/g, '').trim())

                    const [id, nama, jumlah, status, normal, rusak, dipinjam, hilang, serialsStr] = values

                    // Parse status breakdown
                    const breakdown = {}
                    if (normal && Number(normal) > 0) breakdown.NORMAL = Number(normal)
                    if (rusak && Number(rusak) > 0) breakdown.RUSAK = Number(rusak)
                    if (dipinjam && Number(dipinjam) > 0) breakdown.DIPINJAM = Number(dipinjam)
                    if (hilang && Number(hilang) > 0) breakdown.HILANG = Number(hilang)

                    // Parse serials
                    const serials = {}
                    if (serialsStr) {
                        serialsStr.split(';').forEach(part => {
                            const [stat, nums] = part.split(':')
                            if (stat && nums) {
                                serials[stat] = nums.split('|')
                            }
                        })
                    }

                    return {
                        nama: nama || 'Unnamed',
                        jumlah: Number(jumlah) || 1,
                        status: status || 'NORMAL',
                        status_breakdown: breakdown,
                        serials_by_status: serials
                    }
                }).filter(Boolean)

                resolve(items)
            } catch (error) {
                reject(new Error('Gagal memproses file CSV: ' + error.message))
            }
        }

        reader.onerror = () => reject(new Error('Gagal membaca file'))
        reader.readAsText(file)
    })
}
