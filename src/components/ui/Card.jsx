export function Card({ children, className = "" }) {
    // Reference repo uses rounded-20px (approx rounded-2xl or 3xl) and specific shadows
    return (
        <div className={`rounded-3xl border border-gray-200 bg-white p-6 shadow-xl shadow-gray-200/50 ${className}`}>
            {children}
        </div>
    )
}
