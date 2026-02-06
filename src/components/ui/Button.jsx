export function Button({ children, onClick, variant = "primary", className = "", ...props }) {
    const baseStyles = "rounded-full px-6 py-3 text-sm font-semibold transition-all duration-300 outline-none flex items-center justify-center gap-2"

    const variants = {
        primary: "bg-[#ff7a00] text-white hover:bg-[#ff9933] hover:-translate-y-0.5 shadow-lg shadow-orange-500/20",
        secondary: "border border-white/10 bg-transparent text-white/70 hover:border-[#ff7a00] hover:text-[#ff7a00]",
        ghost: "text-white/50 hover:text-[#ff7a00] hover:bg-white/5",
        icon: "p-2 aspect-square rounded-full text-white/70 hover:text-[#ff7a00] hover:bg-white/5 border border-transparent hover:border-white/10"
    }

    return (
        <button
            onClick={onClick}
            className={`${baseStyles} ${variants[variant]} ${className}`}
            {...props}
        >
            {children}
        </button>
    )
}
