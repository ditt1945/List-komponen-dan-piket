import { useEffect, useMemo, useState } from "react"
import { supabase } from "./supabase"

export default function App(){

  const [items,setItems] = useState([])
  const [nama,setNama] = useState("")
  const [jumlah,setJumlah] = useState(1)
  const [tab,setTab] = useState("inventaris")
  const [status,setStatus] = useState("NORMAL")
  const [seri,setSeri] = useState("")
  const [query,setQuery] = useState("")
  const [sortKey,setSortKey] = useState("nama")
  const [cekMap,setCekMap] = useState({})
  const [absenMap,setAbsenMap] = useState({})
  const [modalOpen,setModalOpen] = useState(false)
  const [modalItem,setModalItem] = useState(null)
  const [modalBreakdown,setModalBreakdown] = useState({})
  const [modalSerials,setModalSerials] = useState({})

  const anggota = ["Bangil","Neil","Satya",]

  function getTodayLocal(){
    return new Date().toLocaleDateString("en-CA")
  }

  async function ambilData(){
    const { data } = await supabase
      .from("komponen")
      .select("*")
      .order("id",{ascending:false})

    setItems(data || [])
  }

  async function ambilCeklist(){
    const tanggal = getTodayLocal()
    const { data } = await supabase
      .from("ceklist_komponen")
      .select("komponen_id, checked")
      .eq("tanggal", tanggal)

    const map = {}
    ;(data || []).forEach(r => { map[r.komponen_id] = r.checked })
    setCekMap(map)
  }

  async function ambilAbsen(){
    const tanggal = getTodayLocal()
    const { data } = await supabase
      .from("absen_harian")
      .select("nama, hadir")
      .eq("tanggal", tanggal)

    const map = {}
    ;(data || []).forEach(r => { map[r.nama] = r.hadir })
    setAbsenMap(map)
  }

  function hitungStatus(breakdown){
    const keys = Object.keys(breakdown || {}).filter(k => (breakdown[k] || 0) > 0)
    if(keys.length === 1) return keys[0]
    if(keys.length === 0) return "NORMAL"
    return "MIXED"
  }

  async function tambahData(){
    if(!nama) return

    const qty = Math.max(1, Number(jumlah) || 1)
    const cleanNama = nama.trim()
    const cleanSeri = seri.trim()

    const existing = items.find(i => (i.nama || "").trim().toLowerCase() === cleanNama.toLowerCase())

    if(existing){
      const breakdown = { ...(existing.status_breakdown || {}) }
      breakdown[status] = (breakdown[status] || 0) + qty

      const serials = { ...(existing.serials_by_status || {}) }
      if(cleanSeri){
        const list = Array.isArray(serials[status]) ? [...serials[status]] : []
        list.push(cleanSeri)
        serials[status] = list
      }

      const newJumlah = (existing.jumlah || 0) + qty
      const newStatus = hitungStatus(breakdown)

      await supabase
        .from("komponen")
        .update({
          jumlah: newJumlah,
          status: newStatus,
          status_breakdown: breakdown,
          serials_by_status: serials
        })
        .eq("id", existing.id)
    } else {
      const statusBreakdown = { [status]: qty }
      const serialsByStatus = cleanSeri ? { [status]: [cleanSeri] } : {}

      await supabase
        .from("komponen")
        .insert([{
          nama: cleanNama,
          jumlah: qty,
          status,
          status_breakdown: statusBreakdown,
          serials_by_status: serialsByStatus
        }])
    }

    setNama("")
    setStatus("NORMAL")
    setSeri("")
    setJumlah(1)
    ambilData()
  }

  async function toggleCek(komponenId, checked){
    const tanggal = getTodayLocal()
    setCekMap(prev => ({ ...prev, [komponenId]: checked }))

    await supabase
      .from("ceklist_komponen")
      .upsert([
        { komponen_id: komponenId, tanggal, checked }
      ], { onConflict: "komponen_id,tanggal" })
  }

  async function toggleAbsen(namaAnggota, hadir){
    const tanggal = getTodayLocal()
    setAbsenMap(prev => ({ ...prev, [namaAnggota]: hadir }))

    await supabase
      .from("absen_harian")
      .upsert([
        { nama: namaAnggota, tanggal, hadir }
      ], { onConflict: "nama,tanggal" })
  }

  function openModal(item){
    setModalItem(item)
    setModalBreakdown({ ...(item.status_breakdown || {}) })
    setModalSerials({ ...(item.serials_by_status || {}) })
    setModalOpen(true)
  }

  function closeModal(){
    setModalOpen(false)
    setModalItem(null)
  }

  function updateModalBreakdown(key, value){
    const v = Math.max(0, Number(value) || 0)
    setModalBreakdown(prev => ({ ...prev, [key]: v }))
  }

  function updateModalSerials(key, value){
    const list = value.split(",").map(s => s.trim()).filter(Boolean)
    setModalSerials(prev => ({ ...prev, [key]: list }))
  }

  function getSerialCount(serials, key){
    const list = serials?.[key]
    return Array.isArray(list) ? list.length : 0
  }

  async function simpanModal(){
    if(!modalItem) return
    const breakdown = { ...modalBreakdown }
    Object.keys(breakdown).forEach(k => {
      if(!breakdown[k]) delete breakdown[k]
    })

    const serials = { ...modalSerials }
    Object.keys(serials).forEach(k => {
      if(!Array.isArray(serials[k]) || serials[k].length === 0){
        delete serials[k]
      }
    })

    const jumlahBaru = Object.values(breakdown).reduce((a,b) => a + (Number(b)||0), 0)
    const statusBaru = hitungStatus(breakdown)

    await supabase
      .from("komponen")
      .update({
        jumlah: jumlahBaru,
        status: statusBaru,
        status_breakdown: breakdown,
        serials_by_status: serials
      })
      .eq("id", modalItem.id)

    closeModal()
    ambilData()
  }

  useEffect(()=>{
    const load = async()=>{
      await ambilData()
      await ambilCeklist()
      await ambilAbsen()
    }
    load()
  },[])

  const filtered = useMemo(()=>{
    const q = query.trim().toLowerCase()
    let list = items
    if(q){
      list = list.filter(i => (i.nama || "").toLowerCase().includes(q))
    }

    const withMetrics = list.map(i => ({
      ...i,
      rusak: i.status_breakdown?.RUSAK || 0
    }))

    if(sortKey === "nama"){
      return withMetrics.sort((a,b) => (a.nama || "").localeCompare(b.nama || ""))
    }
    if(sortKey === "jumlah"){
      return withMetrics.sort((a,b) => (b.jumlah || 0) - (a.jumlah || 0))
    }
    if(sortKey === "rusak"){
      return withMetrics.sort((a,b) => (b.rusak || 0) - (a.rusak || 0))
    }
    return withMetrics
  },[items, query, sortKey])

  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-6xl px-6 pb-20 pt-14">
        <header className="mb-10">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs uppercase tracking-[0.2em] text-white/70 backdrop-blur">
            ELITE
          </div>
          <h1 className="mt-5 text-4xl font-semibold leading-tight text-white md:text-6xl">
            Kelola komponen dan jadwal piket dengan{" "}
            <span className="bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600 bg-clip-text text-transparent">
              ezzz
            </span>
            .
          </h1>
          <p className="mt-4 max-w-2xl text-base text-white/70 md:text-lg">
            mempermudah hal yang mudah.
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <button
              onClick={()=>setTab("inventaris")}
              className={`rounded-full px-6 py-3 text-sm font-semibold transition ${
                tab === "inventaris"
                  ? "bg-orange-500 text-black"
                  : "border border-white/15 text-white/80 hover:border-white/30 hover:text-white"
              }`}
            >
              Inventaris
            </button>
            <button
              onClick={()=>setTab("absen")}
              className={`rounded-full px-6 py-3 text-sm font-semibold transition ${
                tab === "absen"
                  ? "bg-orange-500 text-black"
                  : "border border-white/15 text-white/80 hover:border-white/30 hover:text-white"
              }`}
            >
              Absen
            </button>
          </div>
        </header>

        <div className="mb-8" />

        <section className="grid gap-6 md:grid-cols-3">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur">
            <p className="text-xs uppercase tracking-[0.2em] text-white/50">Komponen</p>
            <p className="mt-3 text-3xl font-semibold text-white">{items.length}</p>
            <p className="mt-2 text-sm text-white/60">Total item yang tercatat.</p>
          </div>
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur">
            <p className="text-xs uppercase tracking-[0.2em] text-white/50">Tim</p>
            <p className="mt-3 text-3xl font-semibold text-white">{anggota.length}</p>
            <p className="mt-2 text-sm text-white/60">Anggota aktif minggu ini.</p>
          </div>
          <div className="rounded-3xl border border-orange-500/40 bg-gradient-to-br from-orange-500/20 via-white/5 to-white/0 p-6">
            <p className="text-xs uppercase tracking-[0.2em] text-orange-200/70">Status</p>
            <p className="mt-3 text-3xl font-semibold text-white">Berjalan</p>
            <p className="mt-2 text-sm text-white/70">
              List komponen dan piket harian.
            </p>
          </div>
        </section>

        <section className="mt-10 grid gap-6">
          {tab === "inventaris" ? (
            <div className="rounded-3xl border border-white/10 bg-black/60 p-6 shadow-[0_20px_80px_-50px_rgba(0,0,0,0.8)] backdrop-blur">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-white">List Komponen</h2>
                <span className="rounded-full bg-white/10 px-3 py-1 text-xs text-white/60">
                  Doksli asli
                </span>
              </div>
              <p className="mt-2 text-xs text-white/50">Tanggal: {getTodayLocal()}</p>

              <div className="mt-5 grid gap-3 sm:grid-cols-[1fr_140px]">
                <input
                  className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/40 outline-none transition focus:border-orange-500/80 focus:ring-2 focus:ring-orange-500/30"
                  placeholder="Nama Komponen"
                  value={nama}
                  onChange={e=>setNama(e.target.value)}
                />
                <select
                  className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition focus:border-orange-500/80 focus:ring-2 focus:ring-orange-500/30"
                  value={status}
                  onChange={e=>setStatus(e.target.value)}
                >
                  <option className="text-black" value="NORMAL">NORMAL</option>
                  <option className="text-black" value="RUSAK">RUSAK</option>
                  <option className="text-black" value="DIPINJAM">DIPINJAM</option>
                  <option className="text-black" value="HILANG">HILANG</option>
                </select>
              </div>

              <div className="mt-3 grid gap-3 sm:grid-cols-[1fr_120px_160px]">
                <input
                  className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/40 outline-none transition focus:border-orange-500/80 focus:ring-2 focus:ring-orange-500/30"
                  placeholder="Nomor Seri (opsional)"
                  value={seri}
                  onChange={e=>setSeri(e.target.value)}
                />
                <input
                  className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition focus:border-orange-500/80 focus:ring-2 focus:ring-orange-500/30"
                  type="number"
                  min="1"
                  value={jumlah}
                  onChange={e=>setJumlah(e.target.value)}
                />
                <button
                  onClick={tambahData}
                  className="rounded-2xl bg-orange-500 px-4 py-3 text-sm font-semibold text-black transition hover:bg-orange-400"
                >
                  Tambah Item
                </button>
              </div>

              <div className="mt-6 flex flex-wrap items-center gap-3">
                <input
                  className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white placeholder:text-white/40 outline-none"
                  placeholder="Cari komponen..."
                  value={query}
                  onChange={e=>setQuery(e.target.value)}
                />
                <select
                  className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white outline-none"
                  value={sortKey}
                  onChange={e=>setSortKey(e.target.value)}
                >
                  <option className="text-black" value="nama">Urutkan Nama</option>
                  <option className="text-black" value="jumlah">Jumlah Terbanyak</option>
                  <option className="text-black" value="rusak">Rusak Terbanyak</option>
                </select>
                <span className="text-xs text-white/50">{filtered.length} item</span>
              </div>

              <div className="mt-6 space-y-3">
                {filtered.length === 0 && (
                  <div className="rounded-2xl border border-dashed border-white/10 bg-white/5 p-6 text-sm text-white/60">
                    Tidak ada data sesuai pencarian.
                  </div>
                )}
                {filtered.map(i=>{
                  const checked = !!cekMap[i.id]
                  return (
                    <div
                      key={i.id}
                      className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <input
                            type="checkbox"
                            className="h-4 w-4 accent-orange-500"
                            checked={checked}
                            onChange={e=>toggleCek(i.id, e.target.checked)}
                          />
                          <span>{i.nama}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={()=>openModal(i)}
                            className="rounded-full border border-white/10 px-3 py-1 text-[11px] text-white/70 hover:border-white/30 hover:text-white"
                          >
                            Detail
                          </button>
                          <span className="rounded-full bg-orange-500/20 px-3 py-1 text-xs font-semibold text-orange-200">
                            {i.jumlah} unit
                          </span>
                        </div>
                      </div>
                      <div className="mt-2 text-xs text-white/60">
                        {i.status_breakdown
                          ? Object.entries(i.status_breakdown).map(([k,v])=>`${k} ${v}`).join(" | ")
                          : "NORMAL"}
                      </div>
                      {i.serials_by_status && i.serials_by_status.RUSAK && i.serials_by_status.RUSAK.length > 0 && (
                        <details className="mt-2 text-xs text-white/70">
                          <summary className="cursor-pointer text-white/80">Lihat seri rusak</summary>
                          <div className="mt-2 rounded-xl border border-white/10 bg-black/40 px-3 py-2">
                            {i.serials_by_status.RUSAK.join(", ")}
                          </div>
                        </details>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          ) : (
            <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur">
              <h2 className="text-xl font-semibold text-white">Absen Piket</h2>
              <p className="mt-2 text-sm text-white/60">
                Centang nama yang hadir piket.
              </p>
              <p className="mt-1 text-xs text-white/50">Tanggal: {getTodayLocal()}</p>

              <div className="mt-6 space-y-3">
                {anggota.map(a=>(
                  <label
                    key={a}
                    className="flex items-center justify-between rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white/80"
                  >
                    <span>{a}</span>
                    <input
                      type="checkbox"
                      className="h-5 w-5 accent-orange-500"
                      checked={!!absenMap[a]}
                      onChange={e=>toggleAbsen(a, e.target.checked)}
                    />
                  </label>
                ))}
              </div>

              <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-4 text-xs text-white/60">
                Data tersimpan per tanggal.
              </div>
            </div>
          )}
        </section>
      </div>

      {modalOpen && modalItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="w-full max-w-2xl rounded-3xl border border-white/10 bg-[#0b0b0b] p-6 text-white shadow-[0_40px_120px_-60px_rgba(0,0,0,0.9)]">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-white/50">Detail Komponen</p>
                <h3 className="mt-2 text-2xl font-semibold">{modalItem.nama}</h3>
                <p className="mt-1 text-sm text-white/60">Edit nomor seri dan keterangan status.</p>
              </div>
              <button
                onClick={closeModal}
                className="rounded-full border border-white/10 px-3 py-1 text-xs text-white/70 hover:border-white/30 hover:text-white"
              >
                Tutup
              </button>
            </div>

            <div className="mt-6 grid gap-4">
              {(["NORMAL","RUSAK","DIPINJAM","HILANG"]).map(key => {
                const count = Number(modalBreakdown[key] || 0)
                const serialCount = getSerialCount(modalSerials, key)
                const mismatch = serialCount > 0 && serialCount !== count
                return (
                <div key={key} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold">{key}</span>
                    <input
                      className="w-20 rounded-lg border border-white/10 bg-black/40 px-2 py-1 text-sm text-white outline-none"
                      type="number"
                      min="0"
                      value={modalBreakdown[key] || 0}
                      onChange={e=>updateModalBreakdown(key, e.target.value)}
                    />
                  </div>
                  <textarea
                    className="mt-3 w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-xs text-white/80 outline-none"
                    rows={2}
                    placeholder="Nomor seri dipisah koma"
                    value={(modalSerials[key] || []).join(", ")}
                    onChange={e=>updateModalSerials(key, e.target.value)}
                  />
                  {mismatch && (
                    <div className="mt-2 text-[11px] text-orange-200/80">
                      Jumlah {key} = {count}, seri terisi = {serialCount}. Samakan biar rapi.
                    </div>
                  )}
                </div>
              )})}
            </div>

            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                onClick={closeModal}
                className="rounded-full border border-white/15 px-5 py-2 text-sm text-white/70 hover:border-white/30 hover:text-white"
              >
                Batal
              </button>
              <button
                onClick={simpanModal}
                className="rounded-full bg-orange-500 px-5 py-2 text-sm font-semibold text-black hover:bg-orange-400"
              >
                Simpan Perubahan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
