export function Input({ className = "", ...props }) {
    return (
        <input
            className={`w-full rounded-2xl border border-white/10 bg-[#1a1a1a] px-4 py-3 text-sm text-white placeholder:text-white/30 outline-none transition-all focus:border-[#ff7a00] focus:ring-1 focus:ring-[#ff7a00]/50 ${className}`}
            {...props}
        />
    )
}
