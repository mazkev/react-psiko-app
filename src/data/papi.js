import { roundRobin, seededShuffle } from '../utils.js';

// 20 dimensi PAPI Kostick. Setiap dimensi muncul 6 kali dalam 60 pasangan pernyataan.
export const PAPI_DIMS = [
  {
    code: 'N', kind: 'need', name: 'Kebutuhan menyelesaikan tugas', area: 'Arah Kerja',
    low: 'Cenderung berpindah tugas sebelum tuntas; fleksibel namun perlu pengawasan dalam penyelesaian pekerjaan.',
    mid: 'Cukup bertanggung jawab menuntaskan tugas, dan dapat beralih bila prioritas berubah.',
    high: 'Sangat terdorong menuntaskan tugas secara pribadi; tekun, namun bisa sulit beralih atau mendelegasikan.',
  },
  {
    code: 'G', kind: 'role', name: 'Peran pekerja keras', area: 'Arah Kerja',
    low: 'Bekerja sebatas tuntutan dan mengutamakan keseimbangan hidup.',
    mid: 'Mau bekerja keras pada saat dibutuhkan.',
    high: 'Pekerja keras dan berdedikasi tinggi; perlu mewaspadai risiko kelelahan.',
  },
  {
    code: 'A', kind: 'need', name: 'Kebutuhan berprestasi', area: 'Arah Kerja',
    low: 'Kurang ambisius, cenderung puas dengan pencapaian saat ini.',
    mid: 'Memiliki dorongan berprestasi yang wajar.',
    high: 'Ambisius, menetapkan target tinggi, dan termotivasi oleh tantangan.',
  },
  {
    code: 'L', kind: 'role', name: 'Peran kepemimpinan', area: 'Kepemimpinan',
    low: 'Lebih nyaman berperan sebagai anggota tim daripada pemimpin.',
    mid: 'Bersedia memimpin apabila situasi membutuhkan.',
    high: 'Percaya diri dalam memimpin dan mengarahkan orang lain.',
  },
  {
    code: 'P', kind: 'need', name: 'Kebutuhan mengatur orang lain', area: 'Kepemimpinan',
    low: 'Enggan mengontrol orang lain; cenderung memberi kebebasan penuh.',
    mid: 'Mampu mengarahkan orang lain secara seimbang.',
    high: 'Kuat dalam mengontrol dan mengarahkan orang lain; perlu waspada terhadap kesan otoriter.',
  },
  {
    code: 'I', kind: 'role', name: 'Kemudahan mengambil keputusan', area: 'Kepemimpinan',
    low: 'Berhati-hati dan cenderung lambat atau ragu dalam memutuskan.',
    mid: 'Mengambil keputusan dengan pertimbangan yang cukup.',
    high: 'Cepat dan berani memutuskan; perlu memastikan keputusan tidak tergesa-gesa.',
  },
  {
    code: 'T', kind: 'role', name: 'Peran sibuk (tempo kerja)', area: 'Aktivitas',
    low: 'Bekerja dengan tempo santai dan terencana.',
    mid: 'Tempo kerja sedang, menyesuaikan tuntutan.',
    high: 'Bekerja dengan tempo cepat, dinamis, dan menyukai kesibukan.',
  },
  {
    code: 'V', kind: 'role', name: 'Peran penuh semangat (vigor)', area: 'Aktivitas',
    low: 'Lebih menyukai pekerjaan di belakang meja dan aktivitas yang tenang.',
    mid: 'Cukup aktif secara fisik; seimbang antara lapangan dan kantor.',
    high: 'Energik, menyukai aktivitas fisik dan pekerjaan lapangan.',
  },
  {
    code: 'X', kind: 'need', name: 'Kebutuhan untuk diperhatikan', area: 'Pergaulan',
    low: 'Rendah hati dan tidak menonjolkan diri.',
    mid: 'Kebutuhan akan pengakuan dalam batas wajar.',
    high: 'Membutuhkan perhatian dan pengakuan; senang tampil di depan.',
  },
  {
    code: 'S', kind: 'role', name: 'Hubungan sosial', area: 'Pergaulan',
    low: 'Selektif dalam bergaul; lebih menyukai lingkup sosial yang kecil.',
    mid: 'Cukup supel dan mampu bersosialisasi.',
    high: 'Sangat sosial, mudah bergaul, dan menikmati interaksi dengan banyak orang.',
  },
  {
    code: 'B', kind: 'need', name: 'Kebutuhan diterima kelompok', area: 'Pergaulan',
    low: 'Mandiri, tidak terlalu bergantung pada penerimaan kelompok.',
    mid: 'Menghargai kelompok namun tetap memiliki pendirian.',
    high: 'Sangat membutuhkan penerimaan kelompok; mudah menyesuaikan diri namun bisa mudah terpengaruh.',
  },
  {
    code: 'O', kind: 'need', name: 'Kebutuhan kedekatan & kasih sayang', area: 'Pergaulan',
    low: 'Menjaga jarak emosional dalam relasi kerja; cenderung profesional.',
    mid: 'Hangat secara wajar dalam berelasi.',
    high: 'Membutuhkan kedekatan personal; peka dan peduli, namun bisa mudah tersinggung.',
  },
  {
    code: 'R', kind: 'role', name: 'Peran teoretis', area: 'Gaya Kerja',
    low: 'Praktis, lebih suka tindakan langsung daripada teori.',
    mid: 'Seimbang antara berpikir konseptual dan praktis.',
    high: 'Berpikir teoretis dan analitis; senang mengolah konsep dan gagasan.',
  },
  {
    code: 'D', kind: 'role', name: 'Minat pada hal rinci', area: 'Gaya Kerja',
    low: 'Melihat gambaran besar; kurang menyukai pekerjaan detail.',
    mid: 'Cukup memperhatikan detail bila diperlukan.',
    high: 'Sangat teliti dan berorientasi pada detail.',
  },
  {
    code: 'C', kind: 'role', name: 'Peran mengatur (keteraturan)', area: 'Gaya Kerja',
    low: 'Fleksibel dan spontan, kurang menyukai keteraturan yang kaku.',
    mid: 'Cukup teratur dan terencana dalam bekerja.',
    high: 'Sangat terorganisir, sistematis, dan terencana.',
  },
  {
    code: 'Z', kind: 'need', name: 'Kebutuhan akan perubahan', area: 'Sifat / Temperamen',
    low: 'Menyukai stabilitas dan rutinitas; kurang nyaman dengan perubahan.',
    mid: 'Dapat menerima perubahan secara wajar.',
    high: 'Menyukai perubahan dan hal baru; inovatif namun mudah bosan.',
  },
  {
    code: 'E', kind: 'role', name: 'Pengendalian emosi', area: 'Sifat / Temperamen',
    low: 'Ekspresif; perasaan mudah terlihat oleh orang lain.',
    mid: 'Cukup mampu mengendalikan emosi.',
    high: 'Sangat mampu menahan emosi; tenang, namun bisa terkesan dingin.',
  },
  {
    code: 'K', kind: 'need', name: 'Kebutuhan untuk agresif / asertif', area: 'Sifat / Temperamen',
    low: 'Menghindari konflik dan cenderung mengalah.',
    mid: 'Cukup asertif dalam mempertahankan pendapat.',
    high: 'Sangat asertif; berani berkonfrontasi, perlu menjaga cara penyampaian.',
  },
  {
    code: 'F', kind: 'need', name: 'Kebutuhan mendukung atasan', area: 'Ketaatan',
    low: 'Mandiri terhadap otoritas; tidak selalu mengikuti kehendak atasan.',
    mid: 'Cukup loyal dan mendukung atasan.',
    high: 'Sangat loyal dan mendukung atasan maupun organisasi.',
  },
  {
    code: 'W', kind: 'need', name: 'Kebutuhan akan aturan & pengarahan', area: 'Ketaatan',
    low: 'Mandiri, nyaman bekerja tanpa banyak arahan.',
    mid: 'Mengikuti aturan namun tetap mampu berinisiatif.',
    high: 'Membutuhkan aturan dan arahan yang jelas; patuh terhadap prosedur.',
  },
];

export const PAPI_AREAS = ['Arah Kerja', 'Kepemimpinan', 'Aktivitas', 'Pergaulan', 'Gaya Kerja', 'Sifat / Temperamen', 'Ketaatan'];

const STATEMENTS = {
  N: [
    'Saya suka menyelesaikan satu pekerjaan sampai tuntas sebelum memulai yang lain.',
    'Saya merasa tidak tenang jika ada tugas yang belum selesai.',
    'Saya tetap bertahan pada tugas yang sulit sampai selesai.',
    'Saya lebih suka menuntaskan pekerjaan daripada meninggalkannya setengah jalan.',
    'Saya bertanggung jawab penuh atas tugas yang diberikan kepada saya.',
    'Saya jarang menunda pekerjaan sampai menit terakhir.',
  ],
  G: [
    'Saya bekerja sangat keras.',
    'Saya rela bekerja lembur demi hasil yang baik.',
    'Saya menikmati pekerjaan yang menuntut banyak usaha.',
    'Saya senang jika jadwal kerja saya padat.',
    'Saya mencurahkan banyak energi untuk pekerjaan saya.',
    'Saya merasa puas setelah bekerja keras seharian.',
  ],
  A: [
    'Saya ingin menjadi yang terbaik di bidang saya.',
    'Saya menetapkan target yang tinggi untuk diri sendiri.',
    'Saya ingin meraih kesuksesan besar dalam karier.',
    'Saya terdorong oleh tantangan untuk berprestasi.',
    'Saya ingin hasil kerja saya diakui sebagai yang unggul.',
    'Saya selalu berusaha melampaui pencapaian saya sebelumnya.',
  ],
  L: [
    'Saya senang memimpin sekelompok orang.',
    'Saya sering dipilih menjadi ketua dalam kelompok.',
    'Saya mampu mengarahkan orang lain untuk mencapai tujuan.',
    'Saya nyaman mengambil peran sebagai pemimpin.',
    'Orang lain sering meminta arahan dari saya.',
    'Saya suka bertanggung jawab atas kinerja tim.',
  ],
  P: [
    'Saya suka mengatur apa yang harus dikerjakan orang lain.',
    'Saya ingin orang lain bekerja sesuai dengan cara saya.',
    'Saya senang mengawasi pekerjaan orang lain.',
    'Saya merasa perlu mengendalikan jalannya pekerjaan tim.',
    'Saya suka memberi instruksi kepada orang lain.',
    'Saya memastikan orang lain menjalankan tugasnya dengan benar.',
  ],
  I: [
    'Saya dapat mengambil keputusan dengan cepat.',
    'Saya tidak ragu memutuskan sesuatu yang penting.',
    'Saya mudah menentukan pilihan.',
    'Saya berani mengambil keputusan meskipun informasinya terbatas.',
    'Saya jarang menyesali keputusan yang saya buat.',
    'Saya lebih suka memutuskan sendiri daripada menunggu orang lain.',
  ],
  T: [
    'Saya bekerja dengan tempo yang cepat.',
    'Saya selalu terlihat sibuk.',
    'Saya suka menangani banyak hal sekaligus.',
    'Saya tidak suka bekerja dengan lambat.',
    'Saya cepat bosan jika tidak ada yang dikerjakan.',
    'Saya bergerak cepat dalam menyelesaikan urusan.',
  ],
  V: [
    'Saya suka kegiatan fisik seperti olahraga.',
    'Saya lebih suka bekerja di lapangan daripada di belakang meja.',
    'Saya memiliki stamina yang kuat.',
    'Saya senang bepergian dan bergerak aktif.',
    'Saya merasa segar setelah beraktivitas fisik.',
    'Saya tidak betah duduk diam terlalu lama.',
  ],
  X: [
    'Saya nyaman menyampaikan gagasan di hadapan banyak orang.',
    'Saya termotivasi ketika kontribusi saya diapresiasi secara terbuka.',
    'Saya senang membagikan capaian tim agar mendapat pengakuan yang layak.',
    'Saya bersedia menjadi perwakilan tim saat presentasi di depan umum.',
    'Saya menikmati peran yang membuat saya dikenal luas di lingkungan kerja.',
    'Saya memperhatikan citra dan penampilan profesional di tempat kerja.',
  ],
  S: [
    'Saya mudah bergaul dengan orang baru.',
    'Saya senang menghadiri acara sosial.',
    'Saya memiliki banyak teman.',
    'Saya suka mengobrol dengan rekan kerja.',
    'Saya menikmati bekerja bersama banyak orang.',
    'Saya aktif dalam kegiatan kemasyarakatan.',
  ],
  B: [
    'Saya ingin diterima sebagai bagian dari kelompok.',
    'Saya menyesuaikan diri dengan pendapat kelompok.',
    'Saya merasa nyaman jika kelompok menyetujui tindakan saya.',
    'Saya suka bekerja dalam tim yang kompak.',
    'Saya menghindari hal yang membuat saya dikucilkan.',
    'Saya senang menjadi anggota sebuah organisasi.',
  ],
  O: [
    'Saya ingin memiliki hubungan yang dekat dengan rekan kerja.',
    'Saya peduli pada perasaan orang-orang di sekitar saya.',
    'Saya senang disukai oleh orang lain.',
    'Saya mudah akrab secara pribadi dengan orang lain.',
    'Saya menghargai kehangatan dalam hubungan kerja.',
    'Saya ingin orang lain menganggap saya sebagai teman.',
  ],
  R: [
    'Saya suka memikirkan konsep dan teori.',
    'Saya senang menganalisis masalah secara mendalam.',
    'Saya suka membaca untuk memperluas wawasan.',
    'Saya berpikir matang terlebih dahulu sebelum bertindak.',
    'Saya tertarik memahami alasan di balik suatu hal.',
    'Saya menikmati diskusi tentang gagasan-gagasan abstrak.',
  ],
  D: [
    'Saya teliti terhadap hal-hal kecil.',
    'Saya suka pekerjaan yang membutuhkan ketelitian.',
    'Saya memeriksa ulang pekerjaan sampai ke detailnya.',
    'Saya senang mengolah data dan angka secara rinci.',
    'Saya memperhatikan detail yang sering terlewat oleh orang lain.',
    'Saya tidak keberatan dengan pekerjaan administratif yang rinci.',
  ],
  C: [
    'Saya selalu menyusun rencana sebelum bekerja.',
    'Saya menjaga meja kerja saya tetap rapi.',
    'Saya suka segala sesuatu tertata dengan baik.',
    'Saya bekerja sesuai jadwal yang telah saya buat.',
    'Saya mengelompokkan berkas dengan sistematis.',
    'Saya tidak suka keadaan yang berantakan.',
  ],
  Z: [
    'Saya suka mencoba hal-hal baru.',
    'Saya cepat bosan dengan rutinitas.',
    'Saya senang jika ada perubahan dalam pekerjaan.',
    'Saya suka bereksperimen dengan cara kerja yang baru.',
    'Saya tertarik pada ide-ide inovatif.',
    'Saya menikmati suasana dan tempat yang berbeda-beda.',
  ],
  E: [
    'Saya mampu menyembunyikan perasaan saya.',
    'Saya tetap tenang dalam situasi yang tegang.',
    'Saya jarang menunjukkan kemarahan di depan orang lain.',
    'Saya dapat mengendalikan emosi dengan baik.',
    'Saya tetap berpikir jernih meskipun sedang kesal.',
    'Saya tidak mudah terbawa perasaan.',
  ],
  K: [
    'Saya menyampaikan ketidaksetujuan secara langsung ketika ada hal yang keliru.',
    'Saya mempertahankan argumen dengan kuat jika yakin data saya benar.',
    'Saya berani menghadapi perdebatan terbuka demi menyelesaikan masalah.',
    'Saya akan bersikap tegas jika hak atau keputusan tim saya dilanggar.',
    'Saya menuntut kejelasan dari pihak yang menghambat jalannya pekerjaan.',
    'Saya tidak mudah menyerah saat bernegosiasi mempertahankan posisi saya.',
  ],
  F: [
    'Saya setia kepada atasan saya.',
    'Saya mendukung keputusan pimpinan.',
    'Saya berusaha menyenangkan atasan.',
    'Saya bekerja keras untuk membantu atasan mencapai target.',
    'Saya menghormati orang yang memiliki wewenang.',
    'Saya loyal terhadap organisasi tempat saya bekerja.',
  ],
  W: [
    'Saya suka bekerja dengan petunjuk yang jelas.',
    'Saya mengikuti aturan yang berlaku dengan cermat.',
    'Saya lebih nyaman jika ada prosedur yang baku.',
    'Saya ingin atasan menjelaskan secara rinci apa yang harus dikerjakan.',
    'Saya patuh pada kebijakan perusahaan.',
    'Saya merasa lebih aman bekerja di bawah pengawasan yang jelas.',
  ],
};

export const PAPI_PER_DIM = 6;

function buildPairs() {
  const codes = PAPI_DIMS.map((d) => d.code);
  const raw = seededShuffle(roundRobin(codes.length, PAPI_PER_DIM), 2024);
  const counter = Object.fromEntries(codes.map((c) => [c, 0]));
  return raw.map(([x, y]) => {
    const a = codes[x];
    const b = codes[y];
    return {
      a: { dim: a, text: STATEMENTS[a][counter[a]++] },
      b: { dim: b, text: STATEMENTS[b][counter[b]++] },
    };
  });
}

export const PAPI_PAIRS = buildPairs();
