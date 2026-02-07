export function Button({ children, onClick, variant = "primary", className = "", ...props }) {
    const baseStyles = "rounded-full px-6 py-3 text-sm font-semibold transition-all duration-300 outline-none flex items-center justify-center gap-2"

    const variants = {
        primary: "bg-[#ff7a00] text-white hover:bg-[#eb7100] hover:-translate-y-0.5 shadow-lg shadow-orange-500/20 active:translate-y-0",
        secondary: "border border-gray-200 bg-transparent text-gray-600 hover:border-[#ff7a00] hover:text-[#ff7a00] hover:bg-orange-50/50",
        ghost: "text-gray-500 hover:text-[#ff7a00] hover:bg-orange-50/50",
        icon: "p-2 aspect-square rounded-full text-gray-400 hover:text-[#ff7a00] hover:bg-orange-50/50 border border-transparent hover:border-gray-200"
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
