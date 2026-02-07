export function Input({ className = "", ...props }) {
    return (
        <input
            className={`w-full rounded-2xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 outline-none transition-all focus:border-[#ff7a00] focus:ring-1 focus:ring-[#ff7a00]/50 ${className}`}
            {...props}
        />
    )
}
