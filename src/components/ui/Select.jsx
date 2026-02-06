export function Select({ children, className = "", ...props }) {
    return (
        <div className="relative">
            <select
                className={`w-full appearance-none rounded-2xl border border-white/10 bg-[#1a1a1a] px-4 py-3 text-sm text-white outline-none transition-all focus:border-[#ff7a00] focus:ring-1 focus:ring-[#ff7a00]/50 [&>option]:bg-[#1a1a1a] [&>option]:text-white [&>option]:py-2 ${className}`}
                {...props}
            >
                {children}
            </select>
            <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-white/30">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="m6 9 6 6 6-6" />
                </svg>
            </div>
        </div>
    )
}
