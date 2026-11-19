# Simulator Ujian CMRP

Aplikasi latihan soal untuk persiapan sertifikasi **CMRP (Certified Maintenance & Reliability Professional)**.

**Buka langsung:** https://tiero90.github.io/cmrpsims/

- 600 soal pilihan ganda (4 pilihan), 120 per pilar SMRP Body of Knowledge
- Setiap soal punya pembahasan rinci: konsep, alasan setiap pilihan pengecoh salah, dan rujukan bab buku
- 59 soal hitungan dengan rumus dan langkah perhitungan
- Mode **Simulasi Ujian**: 110 soal, 150 menit, distribusi per pilar dapat diatur
- Mode **Latihan per Pilar**, **Soal hitungan saja**, dan **Cari topik** (mis. NPV, OEE, Weibull)
- Riwayat skor dan progres tersimpan di browser masing-masing pengguna (localStorage)

Soal disusun orisinal berdasarkan konsep dalam *Maintenance and Reliability Best Practices* (Ramesh Gulati, edisi ke-3). Bukan soal resmi SMRP. Target 70% adalah patokan latihan, bukan nilai kelulusan resmi.

## Struktur

| Path | Isi |
|---|---|
| `index.html` | Situs jadi (hasil build) — yang ditampilkan GitHub Pages |
| `src/app.html` | Kode aplikasi (HTML/CSS/JS) dengan placeholder `/*QB*/` |
| `src/questions/p1.js` … `p5.js` | Bank soal per pilar: `[soal, jawaban benar, pengecoh 1, pengecoh 2, pengecoh 3, pembahasan, bab]` |
| `tools/build.js` | Menggabungkan `src/` menjadi `index.html` |
| `tools/validate.js` | Pemeriksa mutu bank soal (wajib lulus sebelum commit) |
| `tools/audit.js` | Mengecek bias panjang jawaban (jawaban benar tidak boleh selalu terpanjang) |
| `.claude/skills/cmrp-question-bank/` | Skill Claude Code: aturan dan alur kerja untuk menambah/merevisi soal dan menerbitkan situs |
| `tools/mpatch.js` | Mengubah opsi/pembahasan soal tertentu dari file JSON |

Soal dengan awalan `[Calc] ` ditampilkan sebagai soal hitungan. Urutan pilihan diacak saat aplikasi berjalan.

## Build

```bash
node tools/validate.js && node tools/build.js
```
