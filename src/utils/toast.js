// Toast notification utility
let toastTimer = null

export function showToast(message, type = 'info') {
    // Remove existing toast
    const existing = document.getElementById('app-toast')
    if (existing) existing.remove()

    // Create toast element
    const toast = document.createElement('div')
    toast.id = 'app-toast'
    toast.className = `fixed top-4 right-4 z-[100] px-6 py-4 rounded-2xl shadow-2xl border backdrop-blur-sm animate-in slide-in-from-top-2 duration-300 ${getToastStyles(type)}`

    toast.innerHTML = `
    <div class="flex items-center gap-3">
      ${getToastIcon(type)}
      <p class="text-sm font-semibold">${message}</p>
    </div>
  `

    document.body.appendChild(toast)

    // Auto remove after 3s
    if (toastTimer) clearTimeout(toastTimer)
    toastTimer = setTimeout(() => {
        toast.classList.add('animate-out', 'slide-out-to-top-2')
        setTimeout(() => toast.remove(), 200)
    }, 3000)
}

function getToastStyles(type) {
    const styles = {
        success: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400',
        error: 'bg-rose-500/10 border-rose-500/30 text-rose-400',
        warning: 'bg-amber-500/10 border-amber-500/30 text-amber-400',
        info: 'bg-[#ff7a00]/10 border-[#ff7a00]/30 text-[#ff7a00]'
    }
    return styles[type] || styles.info
}

function getToastIcon(type) {
    const icons = {
        success: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>',
        error: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>',
        warning: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>',
        info: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>'
    }
    return icons[type] || icons.info
}
