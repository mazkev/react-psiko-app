// Bank soal Tes Figural & Spasial mandiri (15 soal berbasis SVG).

export const FIGURAL_SECONDS = 600; // 10 menit

export const FIGURAL_ITEMS = [
  {
    id: 'FG-1',
    category: 'Rotasi',
    q: 'Panah berputar 90° berlawanan arah jarum jam pada setiap langkah. Manakah posisi berikutnya?',
    svg: {
      mode: 'series',
      steps: [
        { kind: 'arrow', rot: 0 },
        { kind: 'arrow', rot: 270 },
        { kind: 'arrow', rot: 180 },
      ],
    },
    options: [
      { label: 'Atas (0°)', svg: { mode: 'shape', kind: 'arrow', rot: 0 } },
      { label: 'Kanan (90°)', svg: { mode: 'shape', kind: 'arrow', rot: 90 } },
      { label: 'Bawah (180°)', svg: { mode: 'shape', kind: 'arrow', rot: 180 } },
      { label: 'Kiri (270°)', svg: { mode: 'shape', kind: 'arrow', rot: 270 } },
      { label: 'Serong kanan (45°)', svg: { mode: 'shape', kind: 'arrow', rot: 45 } },
    ],
    answer: 'b',
  },
  {
    id: 'FG-2',
    category: 'Rotasi',
    q: 'Titik biru di dalam kotak berpindah satu sudut searah jarum jam setiap langkah. Di manakah posisi titik berikutnya?',
    svg: {
      mode: 'series',
      steps: [
        { kind: 'corner-dot', rot: 0 },
        { kind: 'corner-dot', rot: 90 },
        { kind: 'corner-dot', rot: 180 },
      ],
    },
    options: [
      { label: 'Kanan atas', svg: { mode: 'shape', kind: 'corner-dot', rot: 0 } },
      { label: 'Kanan bawah', svg: { mode: 'shape', kind: 'corner-dot', rot: 90 } },
      { label: 'Kiri bawah', svg: { mode: 'shape', kind: 'corner-dot', rot: 180 } },
      { label: 'Kiri atas', svg: { mode: 'shape', kind: 'corner-dot', rot: 270 } },
      { label: 'Kosong tanpa titik', svg: { mode: 'shape', kind: 'square' } },
    ],
    answer: 'd',
  },
  {
    id: 'FG-3',
    category: 'Rotasi',
    q: 'Bentuk T berputar 90° searah jarum jam di setiap langkah. Manakah gambar selanjutnya?',
    svg: {
      mode: 'series',
      steps: [
        { kind: 'tshape', rot: 0 },
        { kind: 'tshape', rot: 90 },
        { kind: 'tshape', rot: 180 },
      ],
    },
    options: [
      { label: 'Tegak (0°)', svg: { mode: 'shape', kind: 'tshape', rot: 0 } },
      { label: 'Menghadap kiri (90°)', svg: { mode: 'shape', kind: 'tshape', rot: 90 } },
      { label: 'Terbalik (180°)', svg: { mode: 'shape', kind: 'tshape', rot: 180 } },
      { label: 'Menghadap kanan (270°)', svg: { mode: 'shape', kind: 'tshape', rot: 270 } },
      { label: 'Miring 45°', svg: { mode: 'shape', kind: 'tshape', rot: 45 } },
    ],
    answer: 'd',
  },
  {
    id: 'FG-4',
    category: 'Pencerminan',
    q: 'Pilih hasil pencerminan (refleksi) bentuk L berikut terhadap garis cermin vertikal merah:',
    svg: {
      mode: 'mirror',
      source: { kind: 'lshape', rot: 0 },
    },
    options: [
      { label: 'Sama (rotasi 0°)', svg: { mode: 'shape', kind: 'lshape', rot: 0 } },
      { label: 'Cermin kiri-kanan (rotasi 270°)', svg: { mode: 'shape', kind: 'lshape', rot: 270 } },
      { label: 'Putar 180°', svg: { mode: 'shape', kind: 'lshape', rot: 180 } },
      { label: 'Putar 90°', svg: { mode: 'shape', kind: 'lshape', rot: 90 } },
      { label: 'Bentuk T', svg: { mode: 'shape', kind: 'tshape', rot: 0 } },
    ],
    answer: 'b',
  },
  {
    id: 'FG-5',
    category: 'Pencerminan',
    q: 'Jika bendera berikut dicerminkan terhadap garis vertikal merah, manakah gambar yang tepat?',
    svg: {
      mode: 'mirror',
      source: { kind: 'flag' },
    },
    options: [
      { label: 'Tidak berubah', svg: { mode: 'shape', kind: 'flag' } },
      { label: 'Cermin atas-bawah', svg: { mode: 'shape', kind: 'flag-flip-v' } },
      { label: 'Cermin kiri-kanan', svg: { mode: 'shape', kind: 'flag-flip' } },
      { label: 'Diputar 90°', svg: { mode: 'shape', kind: 'flag', rot: 90 } },
      { label: 'Diputar 180°', svg: { mode: 'shape', kind: 'flag', rot: 180 } },
    ],
    answer: 'c',
  },
  {
    id: 'FG-6',
    category: 'Deret Pola',
    q: 'Jumlah sisi bangun bertambah 1 di setiap langkah (3 → 4 → 5 → ?). Bangun manakah berikutnya?',
    svg: {
      mode: 'series',
      steps: [
        { kind: 'triangle' },
        { kind: 'square' },
        { kind: 'pentagon' },
      ],
    },
    options: [
      { label: 'Lingkaran', svg: { mode: 'shape', kind: 'circle' } },
      { label: 'Segi enam (6 sisi)', svg: { mode: 'shape', kind: 'hexagon' } },
      { label: 'Segi delapan (8 sisi)', svg: { mode: 'shape', kind: 'octagon' } },
      { label: 'Belah ketupat (4 sisi)', svg: { mode: 'shape', kind: 'diamond' } },
      { label: 'Segitiga (3 sisi)', svg: { mode: 'shape', kind: 'triangle' } },
    ],
    answer: 'b',
  },
  {
    id: 'FG-7',
    category: 'Deret Pola',
    q: 'Perhatikan pola isi dan jumlah titik: 1 titik → 2 titik → 3 titik. Gambar manakah yang melengkapi deret?',
    svg: {
      mode: 'series',
      steps: [
        { kind: 'grid-dots', count: 1 },
        { kind: 'grid-dots', count: 2 },
        { kind: 'grid-dots', count: 3 },
      ],
    },
    options: [
      { label: '2 titik', svg: { mode: 'shape', kind: 'grid-dots', count: 2 } },
      { label: '3 titik', svg: { mode: 'shape', kind: 'grid-dots', count: 3 } },
      { label: '4 titik', svg: { mode: 'shape', kind: 'grid-dots', count: 4 } },
      { label: '4 titik (diputar 45°)', svg: { mode: 'shape', kind: 'grid-dots', count: 4, rot: 45 } },
      { label: '1 titik', svg: { mode: 'shape', kind: 'grid-dots', count: 1 } },
    ],
    answer: 'c',
  },
  {
    id: 'FG-8',
    category: 'Deret Pola',
    q: 'Setengah lingkaran berputar 90° searah jarum jam setiap langkah. Manakah posisi selanjutnya?',
    svg: {
      mode: 'series',
      steps: [
        { kind: 'half-circle', rot: 0 },
        { kind: 'half-circle', rot: 90 },
        { kind: 'half-circle', rot: 180 },
      ],
    },
    options: [
      { label: 'Menghadap atas (0°)', svg: { mode: 'shape', kind: 'half-circle', rot: 0 } },
      { label: 'Menghadap kanan (90°)', svg: { mode: 'shape', kind: 'half-circle', rot: 90 } },
      { label: 'Menghadap bawah (180°)', svg: { mode: 'shape', kind: 'half-circle', rot: 180 } },
      { label: 'Menghadap kiri (270°)', svg: { mode: 'shape', kind: 'half-circle', rot: 270 } },
      { label: 'Lingkaran penuh', svg: { mode: 'shape', kind: 'circle' } },
    ],
    answer: 'd',
  },
  {
    id: 'FG-9',
    category: 'Analogi',
    q: 'Analogi perubahan ukuran & warna: Hubungan gambar 1 ke gambar 2 sama dengan gambar 3 ke gambar mana?',
    svg: {
      mode: 'analogy',
      a: { kind: 'circle', fill: 'none', scale: 1 },
      b: { kind: 'circle', fill: 'solid', scale: 0.65 },
      c: { kind: 'diamond', fill: 'none', scale: 1 },
    },
    options: [
      { label: 'Belah ketupat besar kosong', svg: { mode: 'shape', kind: 'diamond', fill: 'none', scale: 1 } },
      { label: 'Belah ketupat kecil penuh', svg: { mode: 'shape', kind: 'diamond', fill: 'solid', scale: 0.65 } },
      { label: 'Belah ketupat besar penuh', svg: { mode: 'shape', kind: 'diamond', fill: 'solid', scale: 1 } },
      { label: 'Persegi kecil penuh', svg: { mode: 'shape', kind: 'square', fill: 'solid', scale: 0.65 } },
      { label: 'Belah ketupat kecil kosong', svg: { mode: 'shape', kind: 'diamond', fill: 'none', scale: 0.65 } },
    ],
    answer: 'b',
  },
  {
    id: 'FG-10',
    category: 'Analogi',
    q: 'Analogi penambahan titik tengah: Hubungan gambar 1 ke gambar 2 sama dengan gambar 3 ke gambar mana?',
    svg: {
      mode: 'analogy',
      a: { kind: 'square', fill: 'none' },
      b: { kind: 'square', fill: 'none', inner: 'dot' },
      c: { kind: 'hexagon', fill: 'none' },
    },
    options: [
      { label: 'Segi enam kosong', svg: { mode: 'shape', kind: 'hexagon', fill: 'none' } },
      { label: 'Segi enam penuh', svg: { mode: 'shape', kind: 'hexagon', fill: 'solid' } },
      { label: 'Segi enam dengan titik merah', svg: { mode: 'shape', kind: 'hexagon', fill: 'none', inner: 'dot' } },
      { label: 'Lingkaran dengan titik merah', svg: { mode: 'shape', kind: 'circle', fill: 'none', inner: 'dot' } },
      { label: 'Persegi dengan titik merah', svg: { mode: 'shape', kind: 'square', fill: 'none', inner: 'dot' } },
    ],
    answer: 'c',
  },
  {
    id: 'FG-11',
    category: 'Matriks',
    q: 'Matriks 2×2: Baris atas berubah dari kosong menjadi berisi penuh. Gambar manakah yang melengkapi kotak kanan bawah?',
    svg: {
      mode: 'matrix',
      cells: [
        { kind: 'square', fill: 'none' },
        { kind: 'square', fill: 'solid' },
        { kind: 'triangle', fill: 'none' },
      ],
    },
    options: [
      { label: 'Segitiga kosong', svg: { mode: 'shape', kind: 'triangle', fill: 'none' } },
      { label: 'Segitiga berisi penuh', svg: { mode: 'shape', kind: 'triangle', fill: 'solid' } },
      { label: 'Persegi berisi penuh', svg: { mode: 'shape', kind: 'square', fill: 'solid' } },
      { label: 'Lingkaran berisi penuh', svg: { mode: 'shape', kind: 'circle', fill: 'solid' } },
      { label: 'Segitiga dengan titik merah', svg: { mode: 'shape', kind: 'triangle', fill: 'none', inner: 'dot' } },
    ],
    answer: 'b',
  },
  {
    id: 'FG-12',
    category: 'Matriks',
    q: 'Matriks 2×2: Setiap baris berputar 90° searah jarum jam dari kiri ke kanan. Gambar manakah yang tepat?',
    svg: {
      mode: 'matrix',
      cells: [
        { kind: 'arrow', rot: 0 },
        { kind: 'arrow', rot: 90 },
        { kind: 'arrow', rot: 180 },
      ],
    },
    options: [
      { label: 'Atas (0°)', svg: { mode: 'shape', kind: 'arrow', rot: 0 } },
      { label: 'Kanan (90°)', svg: { mode: 'shape', kind: 'arrow', rot: 90 } },
      { label: 'Bawah (180°)', svg: { mode: 'shape', kind: 'arrow', rot: 180 } },
      { label: 'Kiri (270°)', svg: { mode: 'shape', kind: 'arrow', rot: 270 } },
      { label: 'Diagonal (45°)', svg: { mode: 'shape', kind: 'arrow', rot: 45 } },
    ],
    answer: 'd',
  },
  {
    id: 'FG-13',
    category: 'Matriks',
    q: 'Matriks 2×2: Kolom kanan memiliki titik merah di tengah dan bentuk mengikuti barisnya. Manakah jawaban yang tepat?',
    svg: {
      mode: 'matrix',
      cells: [
        { kind: 'circle', fill: 'none' },
        { kind: 'circle', fill: 'none', inner: 'dot' },
        { kind: 'diamond', fill: 'none' },
      ],
    },
    options: [
      { label: 'Belah ketupat kosong', svg: { mode: 'shape', kind: 'diamond', fill: 'none' } },
      { label: 'Belah ketupat dengan titik merah', svg: { mode: 'shape', kind: 'diamond', fill: 'none', inner: 'dot' } },
      { label: 'Lingkaran dengan titik merah', svg: { mode: 'shape', kind: 'circle', fill: 'none', inner: 'dot' } },
      { label: 'Belah ketupat penuh', svg: { mode: 'shape', kind: 'diamond', fill: 'solid' } },
      { label: 'Segilima dengan titik merah', svg: { mode: 'shape', kind: 'pentagon', fill: 'none', inner: 'dot' } },
    ],
    answer: 'b',
  },
  {
    id: 'FG-14',
    category: 'Penggabungan',
    q: 'Jika kedua potongan persegi panjang berikut disatukan tegak lurus (tanpa diputar), bangun apakah yang terbentuk?',
    svg: {
      mode: 'pieces',
      left: { kind: 'rect', rot: 0 },
      right: { kind: 'rect', rot: 90 },
    },
    options: [
      { label: 'Persegi panjang memanjang', svg: { mode: 'shape', kind: 'rect' } },
      { label: 'Bentuk T (atau +)', svg: { mode: 'shape', kind: 'two-rects' } },
      { label: 'Lingkaran', svg: { mode: 'shape', kind: 'circle' } },
      { label: 'Segitiga', svg: { mode: 'shape', kind: 'triangle' } },
      { label: 'Segi delapan', svg: { mode: 'shape', kind: 'octagon' } },
    ],
    answer: 'b',
  },
  {
    id: 'FG-15',
    category: 'Pembedaan',
    q: 'Dari lima gambar berikut, empat merupakan bangun segi banyak (poligon bersisi lurus). Manakah yang BERBEDA?',
    options: [
      { label: 'Segitiga', svg: { mode: 'shape', kind: 'triangle' } },
      { label: 'Persegi', svg: { mode: 'shape', kind: 'square' } },
      { label: 'Lingkaran', svg: { mode: 'shape', kind: 'circle' } },
      { label: 'Segilima', svg: { mode: 'shape', kind: 'pentagon' } },
      { label: 'Segienam', svg: { mode: 'shape', kind: 'hexagon' } },
    ],
    answer: 'c',
  },
];
