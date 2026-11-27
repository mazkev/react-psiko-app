# PsikoTes — Asesmen Psikologi Terpadu (React + Vite)

Aplikasi psikotes berbasis React dengan 5 alat tes dan laporan hasil + analisa otomatis.

| Tes | Format | Jumlah | Output analisa |
|---|---|---|---|
| **IST** (Intelligenz Struktur Test) | 6 subtes berwaktu: SE, WA, AN, GE (pilihan ganda), RA, ZR (isian angka) | 30 | Skor per subtes, estimasi IQ & kategori, profil verbal vs numerik, kunci jawaban |
| **DISC** | 24 kelompok kata, pilih P (Paling) & K (Paling Tidak) | 24 | Grafik Most/Least/Change, tipe dominan & pola, kekuatan, kelemahan, konsistensi Mask–Core |
| **PAPI Kostick** | 60 pasangan pernyataan (pilih A/B), 20 aspek × 6 kemunculan | 60 | Skor 0–9 per aspek, radar chart, rata-rata 7 area, interpretasi rendah/sedang/tinggi |
| **MSDT** (Reddin 3-D) | 28 pasangan pernyataan, 8 gaya × 7 kemunculan | 28 | TO / RO / Efektivitas, gaya dasar (kuadran), gaya manajemen akhir |
| **BDI** | 21 kelompok pernyataan, skor 0–3 | 21 | Skor total & tingkat (Minimal/Ringan/Sedang/Berat), klaster gejala, peringatan butir kritis |

Halaman **Hasil & Analisa** berisi ringkasan terpadu, rekomendasi pengembangan, detail tiap tes, rekap jawaban, serta tombol **Cetak/PDF** dan **Export JSON**. Progres tersimpan otomatis di `localStorage`.

## Menjalankan

```bash
npm install
npm run dev      # buka http://localhost:5173
npm run build    # build produksi ke /dist
```

## Struktur

```
src/
  App.jsx               # state global, routing antar-halaman, persistensi
  scoring.js            # logika skoring & penyusunan analisa semua tes
  utils.js              # seeded shuffle, round-robin pairing, format waktu
  data/                 # butir soal + teks interpretasi per tes
  components/           # Home, ISTTest, DISCTest, PairTest (PAPI & MSDT), BDITest, Results, Charts
scripts/sanity.mjs      # cek distribusi butir & skoring (node scripts/sanity.mjs)
```

## Catatan penting

- Butir soal **disusun ulang** mengikuti format & konstruk masing-masing tes, bukan butir resmi berhak cipta.
- Estimasi IQ dihitung linier dari persentase benar (bukan norma IST resmi).
- Hasil bersifat indikatif untuk latihan/edukasi dan **tidak menggantikan** asesmen oleh psikolog. BDI adalah alat skrining, bukan diagnosis.
