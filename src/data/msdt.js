import { roundRobin, seededShuffle } from '../utils.js';

// Model 3-D W.J. Reddin: Orientasi Tugas (TO), Orientasi Hubungan (RO), Efektivitas (E).
export const MSDT_STYLES = [
  {
    key: 'deserter', name: 'Deserter', id: 'Pembelot', to: 0, ro: 0, eff: 0, basic: 'separated',
    desc: 'Kurang terlibat dalam tugas maupun hubungan; cenderung pasif, menghindari tanggung jawab, dan dapat menghambat kinerja tim.',
    statements: [
      'Saya memberi kebebasan penuh kepada tim untuk menyelesaikan masalahnya sendiri tanpa campur tangan saya.',
      'Saya memilih tidak langsung turun tangan agar anggota tim belajar mandiri menghadapi situasi.',
      'Saya menunda mengambil keputusan berisiko hingga situasinya benar-benar jelas.',
      'Dalam rapat, saya lebih banyak mengamati daripada mengarahkan jalannya diskusi.',
      'Saya berkomunikasi dengan anggota tim hanya ketika ada hal mendesak yang perlu disampaikan.',
      'Saya membiarkan perbedaan pendapat di tim mereda secara alami tanpa intervensi langsung.',
      'Saya percaya tim dapat berjalan sendiri tanpa perlu pemantauan rutin dari saya.',
    ],
  },
  {
    key: 'missionary', name: 'Missionary', id: 'Misionaris', to: 0, ro: 1, eff: 0, basic: 'related',
    desc: 'Mengutamakan keharmonisan secara berlebihan sehingga sering mengorbankan target; ingin disukai semua orang.',
    statements: [
      'Saya lebih memilih pendekatan yang halus dan menjaga perasaan daripada menegur secara langsung.',
      'Bagi saya, suasana kerja yang nyaman dan tim yang bahagia sama pentingnya dengan pencapaian target.',
      'Saya berusaha mengakomodasi permintaan anggota tim agar mereka merasa didukung.',
      'Ketika terjadi perbedaan pendapat, saya bersedia mengalah demi menjaga kekompakan.',
      'Saya mempertimbangkan dampak emosional terhadap tim sebelum memberi penilaian kinerja yang rendah.',
      'Saya membantu menutupi kekurangan anggota tim agar mereka tidak kehilangan kepercayaan diri.',
      'Saya menjaga hubungan baik agar semua anggota tim merasa nyaman bekerja dengan saya.',
    ],
  },
  {
    key: 'autocrat', name: 'Autocrat', id: 'Otokrat', to: 1, ro: 0, eff: 0, basic: 'dedicated',
    desc: 'Sangat berorientasi tugas tanpa memperhatikan hubungan; memerintah, menuntut kepatuhan, dan kurang mempercayai bawahan.',
    statements: [
      'Saya memastikan instruksi dijalankan persis sesuai arahan agar tidak terjadi penyimpangan.',
      'Dalam situasi mendesak, saya mengambil keputusan sendiri demi kecepatan eksekusi.',
      'Saya bersikap tegas dan langsung menindak anggota tim yang gagal memenuhi target.',
      'Menurut saya, pencapaian hasil kerja harus menjadi prioritas utama di atas pertimbangan pribadi.',
      'Saya memantau progres kerja tim secara ketat dan berkala agar tidak ada kelengahan.',
      'Saya meminta tim mengikuti metode kerja yang sudah saya tetapkan karena terbukti efektif.',
      'Saya menggunakan kewenangan jabatan untuk memastikan seluruh rencana berjalan sesuai jadwal.',
    ],
  },
  {
    key: 'compromiser', name: 'Compromiser', id: 'Kompromis', to: 1, ro: 1, eff: 0, basic: 'integrated',
    desc: 'Memperhatikan tugas dan hubungan, namun keputusan sering setengah hati dan mudah dipengaruhi tekanan yang paling kuat.',
    statements: [
      'Saya mencari jalan tengah agar semua pihak merasa diakomodasi meskipun hasilnya perlu disesuaikan.',
      'Saya menyesuaikan keputusan mengikuti aspirasi yang paling kuat di antara tim dan atasan.',
      'Saya memilih solusi kompromi yang cukup aman bagi semua pihak daripada memaksakan satu opsi.',
      'Saya berusaha menyeimbangkan harapan atasan sekaligus menjaga agar tim tidak keberatan.',
      'Ketika target dan kenyamanan tim berbenturan, saya cenderung menimbang ulang keputusan awal.',
      'Saya menawarkan titik temu sementara agar ketegangan mereda dan pekerjaan tetap berjalan.',
      'Saya terbuka mengubah keputusan yang sudah dibuat jika ada pihak yang merasa kurang cocok.',
    ],
  },
  {
    key: 'bureaucrat', name: 'Bureaucrat', id: 'Birokrat', to: 0, ro: 0, eff: 1, basic: 'separated',
    desc: 'Efektif dalam menjalankan sistem, aturan, dan prosedur; adil, konsisten, dan menjaga stabilitas organisasi.',
    statements: [
      'Saya menjalankan pekerjaan sesuai prosedur dan aturan yang berlaku.',
      'Saya mengutamakan ketertiban dan konsistensi dalam tim.',
      'Saya memastikan setiap keputusan memiliki dasar aturan yang jelas.',
      'Saya mendokumentasikan pekerjaan dengan rapi.',
      'Saya bersikap adil dengan menerapkan aturan yang sama kepada semua orang.',
      'Saya menangani masalah melalui jalur dan mekanisme yang resmi.',
      'Saya menjaga agar sistem kerja berjalan stabil dan terkendali.',
    ],
  },
  {
    key: 'developer', name: 'Developer', id: 'Pengembang', to: 0, ro: 1, eff: 1, basic: 'related',
    desc: 'Efektif dalam mengembangkan potensi bawahan; membangun kepercayaan, memberi kesempatan, dan memotivasi.',
    statements: [
      'Saya mendorong bawahan untuk mengembangkan kemampuan mereka.',
      'Saya mempercayakan tanggung jawab kepada bawahan agar mereka berkembang.',
      'Saya mendengarkan aspirasi bawahan dengan sungguh-sungguh.',
      'Saya meluangkan waktu untuk membimbing anggota tim.',
      'Saya menciptakan suasana kerja yang saling percaya.',
      'Saya memberi kesempatan bawahan untuk belajar dari kesalahan.',
      'Saya memperhatikan kebutuhan dan motivasi setiap anggota tim.',
    ],
  },
  {
    key: 'benevolent', name: 'Benevolent Autocrat', id: 'Otokrat Bijak', to: 1, ro: 0, eff: 1, basic: 'dedicated',
    desc: 'Berorientasi tugas secara efektif; tegas, tahu apa yang diinginkan, dan mampu mencapainya tanpa menimbulkan penolakan.',
    statements: [
      'Saya memberikan arahan yang jelas agar target tercapai.',
      'Saya mengambil keputusan dengan tegas dan menjelaskan alasannya.',
      'Saya menetapkan standar kerja yang tinggi dan membantu tim mencapainya.',
      'Saya mengatur pekerjaan secara efisien tanpa membuat tim merasa tertekan.',
      'Saya tahu apa yang saya inginkan dan mampu mewujudkannya melalui tim.',
      'Saya memberikan penghargaan kepada bawahan yang berprestasi.',
      'Saya mengendalikan pekerjaan dengan tegas namun tetap menghargai bawahan.',
    ],
  },
  {
    key: 'executive', name: 'Executive', id: 'Eksekutif', to: 1, ro: 1, eff: 1, basic: 'integrated',
    desc: 'Efektif memadukan orientasi tugas dan hubungan; memotivasi, membangun kerja tim, dan menetapkan standar tinggi.',
    statements: [
      'Saya melibatkan tim dalam menetapkan tujuan bersama.',
      'Saya menyeimbangkan pencapaian target dengan kesejahteraan tim.',
      'Saya mendorong kerja sama tim untuk menghasilkan keputusan terbaik.',
      'Saya menetapkan target tinggi dan memotivasi tim untuk mencapainya bersama.',
      'Saya menyelesaikan konflik dengan mencari solusi yang menguntungkan semua pihak.',
      'Saya memanfaatkan kekuatan setiap anggota tim secara optimal.',
      'Saya berkomitmen pada hasil maupun pada pengembangan orang.',
    ],
  },
];

export const MSDT_BASIC = {
  separated: { name: 'Separated', id: 'Terpisah', desc: 'Orientasi tugas dan hubungan sama-sama rendah; berfokus pada sistem, aturan, dan kontrol prosedural.' },
  related: { name: 'Related', id: 'Berhubungan', desc: 'Orientasi hubungan tinggi, tugas rendah; berfokus pada orang, penerimaan, dan suasana kerja.' },
  dedicated: { name: 'Dedicated', id: 'Berdedikasi', desc: 'Orientasi tugas tinggi, hubungan rendah; berfokus pada produktivitas, target, dan pengarahan.' },
  integrated: { name: 'Integrated', id: 'Terpadu', desc: 'Orientasi tugas dan hubungan sama-sama tinggi; berfokus pada partisipasi dan kerja tim.' },
};

export const MSDT_PER_STYLE = 7;

function buildPairs() {
  const raw = seededShuffle(roundRobin(MSDT_STYLES.length, MSDT_PER_STYLE), 77);
  const counter = MSDT_STYLES.map(() => 0);
  return raw.map(([x, y]) => ({
    a: { dim: MSDT_STYLES[x].key, text: MSDT_STYLES[x].statements[counter[x]++] },
    b: { dim: MSDT_STYLES[y].key, text: MSDT_STYLES[y].statements[counter[y]++] },
  }));
}

export const MSDT_PAIRS = buildPairs();
