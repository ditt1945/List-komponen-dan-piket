export function Loading() {
    return (
        <div className="flex items-center justify-center py-20">
            <div className="flex flex-col items-center gap-4">
                <div className="relative">
                    <div className="w-16 h-16 border-4 border-gray-200 border-t-[#ff7a00] rounded-full animate-spin"></div>
                    <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-b-[#ff7a00]/50 rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1s' }}></div>
                </div>
                <p className="text-sm text-gray-500 font-medium">Memuat data...</p>
            </div>
        </div>
    )
}

export function EmptyState({ title, description, onAction, actionLabel }) {
    return (
        <div className="flex items-center justify-center py-20">
            <div className="text-center max-w-md">
                <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gray-100 flex items-center justify-center">
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-gray-400">
                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                        <line x1="9" y1="9" x2="15" y2="15" />
                        <line x1="15" y1="9" x2="9" y2="15" />
                    </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{title || "Tidak ada data"}</h3>
                <p className="text-gray-500 mb-6">{description || "Mulai tambahkan data pertama Anda."}</p>
                {onAction && (
                    <button
                        onClick={onAction}
                        className="inline-flex items-center gap-2 bg-[#ff7a00] text-white px-6 py-3 rounded-full font-semibold hover:bg-[#ff9933] transition-all"
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <line x1="12" y1="5" x2="12" y2="19" />
                            <line x1="5" y1="12" x2="19" y2="12" />
                        </svg>
                        {actionLabel || "Tambah Data"}
                    </button>
                )}
            </div>
        </div>
    )
}
