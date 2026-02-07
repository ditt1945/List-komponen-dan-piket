import { useEffect, useState } from "react"
import { supabase } from "./supabase"
import { Header } from "./components/Header"
import { StatsCards } from "./components/StatsCards"
import { InventoryManager } from "./components/InventoryManager"
import { AttendanceTracker } from "./components/AttendanceTracker"
import { DetailModal } from "./components/DetailModal"
import { NotificationBanner } from "./components/NotificationBanner"
import { showToast } from "./utils/toast"
import { getTodayLocal } from "./utils/dateUtils"

export default function App() {
  const [items, setItems] = useState([])
  const [cekMap, setCekMap] = useState({})
  const [checkDates, setCheckDates] = useState({})
  const [absenMap, setAbsenMap] = useState({})
  const [tab, setTab] = useState("inventaris")
  const [modalItem, setModalItem] = useState(null)
  const [loading, setLoading] = useState(true)
  const [anggota, setAnggota] = useState([])
  const [selectedDate, setSelectedDate] = useState(getTodayLocal())


  // --- Data Fetching ---
  async function ambilData() {
    try {
      const { data, error } = await supabase
        .from("komponen")
        .select("*")
        .order("id", { ascending: false })

      if (error) throw error
      setItems(data || [])
    } catch (error) {
      showToast("Gagal memuat data komponen", "error")
      console.error(error)
    }
  }

  async function ambilCeklist() {
    try {
      const tanggal = getTodayLocal()
      const { data, error } = await supabase
        .from("ceklist_komponen")
        .select("komponen_id, checked, tanggal")
        .eq("tanggal", tanggal)

      if (error) throw error
      const map = {}
      const dates = {}
        ; (data || []).forEach(r => {
          map[r.komponen_id] = r.checked
          dates[r.komponen_id] = r.tanggal
        })
      setCekMap(map)
      setCheckDates(dates)
    } catch (error) {
      console.error("Error loading checklist:", error)
    }
  }

  async function ambilAbsen(tanggal = getTodayLocal()) {
    try {
      const { data, error } = await supabase
        .from("absen_harian")
        .select("nama, hadir")
        .eq("tanggal", tanggal)

      if (error) throw error
      const map = {}
        ; (data || []).forEach(r => { map[r.nama] = r.hadir })
      setAbsenMap(map)
    } catch (error) {
      console.error("Error loading attendance:", error)
    }
  }

  async function ambilJadwalPiket(tanggal = getTodayLocal()) {
    try {
      const selectedDay = new Date(tanggal).getDay() // 0=Minggu, 1=Senin, ..., 6=Sabtu
      const { data, error } = await supabase
        .from("jadwal_piket")
        .select("nama_siswa")
        .eq("hari_minggu", selectedDay)
        .order("urutan", { ascending: true })

      if (error) throw error
      const names = (data || []).map(r => r.nama_siswa)
      setAnggota(names)
    } catch (error) {
      console.error("Error loading schedule:", error)
      // Fallback ke hardcoded jika tabel belum ada
      setAnggota(["Bangil", "Neil", "Satya"])
    }
  }

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      await Promise.all([ambilData(), ambilCeklist(), ambilAbsen(), ambilJadwalPiket()])
      setLoading(false)
    }
    load()
  }, [])

  // Re-fetch attendance when date changes
  useEffect(() => {
    if (!loading) {
      ambilAbsen(selectedDate)
      ambilJadwalPiket(selectedDate)
    }
  }, [selectedDate])

  // --- Logic Helpers ---
  function hitungStatus(breakdown) {
    const keys = Object.keys(breakdown || {}).filter(k => (breakdown[k] || 0) > 0)
    if (keys.length === 1) return keys[0]
    if (keys.length === 0) return "NORMAL"
    return "MIXED"
  }

  // --- Actions ---
  async function handleAddItem({ nama, jumlah, status, seri }) {
    if (!nama) return

    const qty = Math.max(1, Number(jumlah) || 1)
    const cleanNama = nama.trim()
    const cleanSeri = seri.trim()

    const existing = items.find(i => (i.nama || "").trim().toLowerCase() === cleanNama.toLowerCase())

    try {
      if (existing) {
        const breakdown = { ...(existing.status_breakdown || {}) }
        breakdown[status] = (breakdown[status] || 0) + qty

        const serials = { ...(existing.serials_by_status || {}) }
        if (cleanSeri) {
          const list = Array.isArray(serials[status]) ? [...serials[status]] : []
          list.push(cleanSeri)
          serials[status] = list
        }

        const newJumlah = (existing.jumlah || 0) + qty
        const newStatus = hitungStatus(breakdown)

        const { error } = await supabase
          .from("komponen")
          .update({
            jumlah: newJumlah,
            status: newStatus,
            status_breakdown: breakdown,
            serials_by_status: serials
          })
          .eq("id", existing.id)

        if (error) throw error
      } else {
        const statusBreakdown = { [status]: qty }
        const serialsByStatus = cleanSeri ? { [status]: [cleanSeri] } : {}

        const { error } = await supabase
          .from("komponen")
          .insert([{
            nama: cleanNama,
            jumlah: qty,
            status,
            status_breakdown: statusBreakdown,
            serials_by_status: serialsByStatus
          }])

        if (error) throw error
      }
      await ambilData()
    } catch (error) {
      showToast("Gagal menyimpan data", "error")
      console.error(error)
      throw error
    }
  }

  async function handleToggleCheck(komponenId, checked) {
    const tanggal = getTodayLocal()
    setCekMap(prev => ({ ...prev, [komponenId]: checked }))

    await supabase
      .from("ceklist_komponen")
      .upsert([
        { komponen_id: komponenId, tanggal, checked }
      ], { onConflict: "komponen_id,tanggal" })
  }

  async function handleToggleAbsen(namaAnggota, hadir) {
    const tanggal = getTodayLocal()
    setAbsenMap(prev => ({ ...prev, [namaAnggota]: hadir }))

    await supabase
      .from("absen_harian")
      .upsert([
        { nama: namaAnggota, tanggal, hadir }
      ], { onConflict: "nama,tanggal" })
  }

  async function handleSaveDetail(id, breakdown, serials) {
    const jumlahBaru = Object.values(breakdown).reduce((a, b) => a + (Number(b) || 0), 0)
    const statusBaru = hitungStatus(breakdown)

    await supabase
      .from("komponen")
      .update({
        jumlah: jumlahBaru,
        status: statusBaru,
        status_breakdown: breakdown,
        serials_by_status: serials
      })
      .eq("id", id)

    setModalItem(null)
    ambilData()
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans selection:bg-orange-500 selection:text-white pb-20">
      <div className="max-w-7xl mx-auto p-4 md:p-8">
        <Header tab={tab} setTab={setTab} />
        <StatsCards items={items} cekMap={cekMap} anggota={anggota} absenMap={absenMap} />
        <NotificationBanner items={items} cekMap={cekMap} anggota={anggota} absenMap={absenMap} />

        <main>
          {tab === "inventaris" ? (
            <InventoryManager
              items={items}
              cekMap={cekMap}
              checkDates={checkDates}
              onToggleCheck={handleToggleCheck}
              onAddItem={handleAddItem}
              onOpenDetail={setModalItem}
              loading={loading}
            />
          ) : (
            <AttendanceTracker
              anggota={anggota}
              absenMap={absenMap}
              selectedDate={selectedDate}
              onDateChange={setSelectedDate}
              onToggleAbsen={handleToggleAbsen}
            />
          )}
        </main>

        <DetailModal
          item={modalItem}
          onClose={() => setModalItem(null)}
          onSave={handleSaveDetail}
        />

      </div>
    </div>
  )
}
