export function Select({ children, className = "", ...props }) {
    return (
        <div className="relative">
            <select
                className={`w-full appearance-none rounded-2xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition-all focus:border-[#ff7a00] focus:ring-1 focus:ring-[#ff7a00]/50 [&>option]:bg-white [&>option]:text-gray-900 [&>option]:py-2 ${className}`}
                {...props}
            >
                {children}
            </select>
            <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="m6 9 6 6 6-6" />
                </svg>
            </div>
        </div>
    )
}
