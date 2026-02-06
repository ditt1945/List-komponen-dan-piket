import { formatIndonesianDate } from "../utils/dateUtils"

export function DatePicker({ selectedDate, onDateChange }) {
    const isToday = selectedDate === new Date().toLocaleDateString("en-CA")

    const changeDate = (offset) => {
        const current = new Date(selectedDate)
        current.setDate(current.getDate() + offset)
        onDateChange(current.toLocaleDateString("en-CA"))
    }

    const goToToday = () => {
        onDateChange(new Date().toLocaleDateString("en-CA"))
    }

    const displayDate = formatIndonesianDate(new Date(selectedDate))

    return (
        <div className="flex items-center justify-between gap-4 p-4 bg-[#1a1a1a] rounded-xl border border-white/5 mb-6">
            <button
                onClick={() => changeDate(-1)}
                className="p-2 hover:bg-white/5 rounded-lg transition-colors"
                aria-label="Hari sebelumnya"
            >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M15 18l-6-6 6-6" />
                </svg>
            </button>

            <div className="flex-1 text-center">
                <div className="text-sm font-bold text-white">{displayDate}</div>
                {!isToday && (
                    <button
                        onClick={goToToday}
                        className="text-xs text-[#ff7a00] hover:underline mt-1"
                    >
                        Kembali ke Hari Ini
                    </button>
                )}
                {isToday && (
                    <div className="text-xs text-white/40 mt-1">Hari Ini</div>
                )}
            </div>

            <button
                onClick={() => changeDate(1)}
                className="p-2 hover:bg-white/5 rounded-lg transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                disabled={isToday}
                aria-label="Hari berikutnya"
            >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 18l6-6-6-6" />
                </svg>
            </button>
        </div>
    )
}
