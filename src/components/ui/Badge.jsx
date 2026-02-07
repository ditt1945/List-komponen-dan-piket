export function Badge({ children, variant = "default", className = "" }) {
    const variants = {
        default: "bg-orange-50 text-orange-600 border border-orange-200",
        outline: "border border-gray-200 text-gray-500 bg-gray-50",
        success: "bg-emerald-50 text-emerald-600 border border-emerald-200",
        danger: "bg-rose-50 text-rose-600 border border-rose-200",
        warning: "bg-amber-50 text-amber-600 border border-amber-200",
        info: "bg-blue-50 text-blue-600 border border-blue-200",
    }

    return (
        <span className={`rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wider ${variants[variant]} ${className}`} >
            {children}
        </span >
    )
}

// Helper to get badge variant by status
export function getStatusVariant(status) {
    const statusMap = {
        'NORMAL': 'success',
        'RUSAK': 'danger',
        'DIPINJAM': 'warning',
        'HILANG': 'outline'
    }
    return statusMap[status] || 'default'
}
