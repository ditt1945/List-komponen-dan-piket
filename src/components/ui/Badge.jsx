export function Badge({ children, variant = "default", className = "" }) {
    const variants = {
        default: "bg-[#ff7a00]/10 text-[#ff7a00] border border-[#ff7a00]/20",
        outline: "border border-white/20 text-white/60",
        success: "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20",
        danger: "bg-rose-500/10 text-rose-400 border border-rose-500/20",
        warning: "bg-amber-500/10 text-amber-400 border border-amber-500/20",
        info: "bg-blue-500/10 text-blue-400 border border-blue-500/20",
    }

    return (
        <span className={`rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wider ${variants[variant]} ${className}`}>
            {children}
        </span>
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
