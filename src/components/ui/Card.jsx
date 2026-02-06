export function Card({ children, className = "" }) {
    // Reference repo uses rounded-20px (approx rounded-2xl or 3xl) and specific shadows
    return (
        <div className={`rounded-3xl border border-white/5 bg-[#141414] p-6 shadow-xl ${className}`}>
            {children}
        </div>
    )
}
