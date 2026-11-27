// Butir skrining suasana hati yang mengikuti 21 area gejala BDI (disusun ulang dalam Bahasa Indonesia).
// Skor tiap butir 0–3. Kerangka waktu: dua minggu terakhir, termasuk hari ini.

export const BDI_ITEMS = [
  { title: 'Kesedihan', cluster: 'afektif', options: ['Saya tidak merasa sedih.', 'Saya cukup sering merasa sedih.', 'Saya merasa sedih hampir sepanjang waktu.', 'Saya merasa sangat sedih atau tidak bahagia hingga sulit menahannya.'] },
  { title: 'Pesimisme', cluster: 'kognitif', options: ['Saya tidak merasa putus asa tentang masa depan.', 'Saya merasa kurang yakin terhadap masa depan dibanding biasanya.', 'Saya tidak berharap keadaan akan membaik bagi saya.', 'Saya merasa masa depan saya tanpa harapan dan hanya akan memburuk.'] },
  { title: 'Perasaan gagal', cluster: 'kognitif', options: ['Saya tidak merasa sebagai orang yang gagal.', 'Saya merasa lebih sering gagal daripada yang seharusnya.', 'Ketika melihat ke belakang, saya melihat banyak kegagalan.', 'Saya merasa diri saya benar-benar gagal sebagai pribadi.'] },
  { title: 'Kehilangan kesenangan', cluster: 'afektif', options: ['Saya masih menikmati hal-hal yang biasa saya sukai.', 'Saya kurang menikmati hal-hal seperti dulu.', 'Saya hanya sedikit merasakan kesenangan dari hal yang dulu saya sukai.', 'Saya sama sekali tidak bisa menikmati hal-hal yang dulu saya sukai.'] },
  { title: 'Rasa bersalah', cluster: 'kognitif', options: ['Saya tidak merasa terlalu bersalah.', 'Saya merasa bersalah atas banyak hal yang telah atau seharusnya saya lakukan.', 'Saya cukup sering merasa bersalah.', 'Saya merasa bersalah sepanjang waktu.'] },
  { title: 'Perasaan dihukum', cluster: 'kognitif', options: ['Saya tidak merasa sedang dihukum.', 'Saya merasa mungkin akan dihukum.', 'Saya yakin akan dihukum.', 'Saya merasa sedang dihukum.'] },
  { title: 'Tidak menyukai diri sendiri', cluster: 'kognitif', options: ['Perasaan saya terhadap diri sendiri tetap seperti biasa.', 'Saya kehilangan kepercayaan diri.', 'Saya kecewa terhadap diri saya sendiri.', 'Saya tidak menyukai diri saya sendiri.'] },
  { title: 'Mengkritik diri sendiri', cluster: 'kognitif', options: ['Saya tidak lebih menyalahkan diri dibanding biasanya.', 'Saya lebih kritis terhadap diri sendiri dibanding dulu.', 'Saya menyalahkan diri atas semua kesalahan saya.', 'Saya menyalahkan diri atas semua hal buruk yang terjadi.'] },
  { title: 'Pikiran untuk mengakhiri hidup', cluster: 'kognitif', critical: true, options: ['Saya tidak punya pikiran untuk mengakhiri hidup.', 'Saya punya pikiran untuk mengakhiri hidup, tetapi tidak akan melakukannya.', 'Saya ingin mengakhiri hidup saya.', 'Saya akan mengakhiri hidup jika ada kesempatan.'] },
  { title: 'Menangis', cluster: 'afektif', options: ['Saya tidak menangis lebih sering dari biasanya.', 'Saya lebih sering menangis dari biasanya.', 'Saya menangis karena hal-hal kecil.', 'Saya ingin menangis tetapi tidak bisa.'] },
  { title: 'Gelisah', cluster: 'somatik', options: ['Saya tidak lebih gelisah atau tegang dari biasanya.', 'Saya merasa lebih gelisah atau tegang dari biasanya.', 'Saya sangat gelisah sehingga sulit untuk diam.', 'Saya sangat gelisah sehingga harus terus bergerak atau melakukan sesuatu.'] },
  { title: 'Kehilangan minat', cluster: 'afektif', options: ['Saya tidak kehilangan minat terhadap orang lain atau aktivitas.', 'Minat saya terhadap orang lain atau aktivitas berkurang.', 'Saya kehilangan sebagian besar minat terhadap orang lain atau aktivitas.', 'Sulit bagi saya untuk tertarik pada apa pun.'] },
  { title: 'Sulit mengambil keputusan', cluster: 'kognitif', options: ['Saya dapat mengambil keputusan sebaik biasanya.', 'Saya merasa lebih sulit mengambil keputusan dari biasanya.', 'Saya jauh lebih sulit mengambil keputusan dibanding dulu.', 'Saya kesulitan membuat keputusan apa pun.'] },
  { title: 'Merasa tidak berharga', cluster: 'kognitif', options: ['Saya tidak merasa diri saya tidak berharga.', 'Saya merasa kurang berharga dan berguna dibanding dulu.', 'Saya merasa kurang berharga dibandingkan orang lain.', 'Saya merasa sama sekali tidak berharga.'] },
  { title: 'Kehilangan energi', cluster: 'somatik', options: ['Energi saya tetap seperti biasa.', 'Energi saya lebih sedikit dari biasanya.', 'Saya tidak cukup berenergi untuk melakukan banyak hal.', 'Saya tidak punya energi untuk melakukan apa pun.'] },
  { title: 'Perubahan pola tidur', cluster: 'somatik', options: ['Tidak ada perubahan pada pola tidur saya.', 'Saya tidur sedikit lebih banyak atau lebih sedikit dari biasanya.', 'Saya tidur jauh lebih banyak atau jauh lebih sedikit dari biasanya.', 'Saya tidur hampir sepanjang hari, atau terbangun 1–2 jam lebih awal dan tidak bisa tidur lagi.'] },
  { title: 'Mudah tersinggung / marah', cluster: 'afektif', options: ['Saya tidak lebih mudah marah dari biasanya.', 'Saya lebih mudah marah dari biasanya.', 'Saya jauh lebih mudah marah dari biasanya.', 'Saya mudah marah sepanjang waktu.'] },
  { title: 'Perubahan nafsu makan', cluster: 'somatik', options: ['Tidak ada perubahan pada nafsu makan saya.', 'Nafsu makan saya sedikit berkurang atau bertambah.', 'Nafsu makan saya jauh berkurang atau jauh bertambah.', 'Saya sama sekali tidak nafsu makan, atau ingin makan terus-menerus.'] },
  { title: 'Sulit berkonsentrasi', cluster: 'kognitif', options: ['Saya dapat berkonsentrasi sebaik biasanya.', 'Saya tidak dapat berkonsentrasi sebaik biasanya.', 'Sulit bagi saya untuk fokus pada sesuatu dalam waktu lama.', 'Saya sama sekali tidak dapat berkonsentrasi.'] },
  { title: 'Kelelahan', cluster: 'somatik', options: ['Saya tidak lebih lelah dari biasanya.', 'Saya lebih mudah lelah dari biasanya.', 'Saya terlalu lelah untuk melakukan banyak hal yang biasa saya lakukan.', 'Saya terlalu lelah untuk melakukan hampir semua hal.'] },
  { title: 'Minat terhadap hubungan intim', cluster: 'somatik', options: ['Tidak ada perubahan pada minat saya terhadap hubungan intim.', 'Minat saya sedikit berkurang dari biasanya.', 'Minat saya jauh berkurang dibanding dulu.', 'Saya sama sekali kehilangan minat terhadap hubungan intim.'] },
];

export const BDI_LEVELS = [
  {
    max: 13, label: 'Minimal', color: '#10b981',
    desc: 'Tidak tampak gejala depresi yang berarti. Fluktuasi suasana hati masih dalam batas normal kehidupan sehari-hari.',
    advice: 'Pertahankan pola hidup sehat: tidur cukup, aktivitas fisik, dan relasi sosial yang suportif.',
  },
  {
    max: 19, label: 'Ringan', color: '#eab308',
    desc: 'Terdapat beberapa gejala suasana hati menurun dengan intensitas ringan yang mungkin mulai memengaruhi kenyamanan sehari-hari.',
    advice: 'Perhatikan manajemen stres, istirahat, dan bicarakan perasaan dengan orang tepercaya. Bila gejala menetap >2 minggu, pertimbangkan konsultasi dengan psikolog.',
  },
  {
    max: 28, label: 'Sedang', color: '#f97316',
    desc: 'Gejala depresi tampak cukup jelas dan kemungkinan mengganggu fungsi pekerjaan, sosial, atau kegiatan sehari-hari.',
    advice: 'Disarankan berkonsultasi dengan psikolog atau psikiater untuk evaluasi lebih lanjut.',
  },
  {
    max: 63, label: 'Berat', color: '#ef4444',
    desc: 'Gejala depresi tampak berat dan kemungkinan sangat mengganggu fungsi sehari-hari.',
    advice: 'Sangat disarankan segera mencari bantuan profesional (psikolog/psikiater) untuk penanganan yang tepat.',
  },
];
