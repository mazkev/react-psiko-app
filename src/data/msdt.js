import { roundRobin, seededShuffle } from '../utils.js';

// Model 3-D W.J. Reddin: Orientasi Tugas (TO), Orientasi Hubungan (RO), Efektivitas (E).
export const MSDT_STYLES = [
  {
    key: 'deserter', name: 'Deserter', id: 'Pembelot', to: 0, ro: 0, eff: 0, basic: 'separated',
    desc: 'Kurang terlibat dalam tugas maupun hubungan; cenderung pasif, menghindari tanggung jawab, dan dapat menghambat kinerja tim.',
    statements: [
      'Saya cenderung menghindari keterlibatan dalam masalah tim.',
      'Saya membiarkan bawahan menyelesaikan persoalan tanpa campur tangan saya.',
      'Saya lebih suka tidak mengambil keputusan yang berisiko.',
      'Saya jarang memberikan masukan dalam rapat.',
      'Saya membatasi komunikasi dengan bawahan seperlunya saja.',
      'Saya menunda penanganan konflik dengan harapan akan reda sendiri.',
      'Saya tidak terlalu memantau perkembangan pekerjaan tim.',
    ],
  },
  {
    key: 'missionary', name: 'Missionary', id: 'Misionaris', to: 0, ro: 1, eff: 0, basic: 'related',
    desc: 'Mengutamakan keharmonisan secara berlebihan sehingga sering mengorbankan target; ingin disukai semua orang.',
    statements: [
      'Saya menghindari memberi teguran agar suasana tetap menyenangkan.',
      'Saya lebih mementingkan bawahan merasa senang daripada target tercapai.',
      'Saya mudah menyetujui permintaan bawahan agar tidak mengecewakan mereka.',
      'Saya mengalah ketika ada perbedaan pendapat demi menjaga keharmonisan.',
      'Saya enggan memberikan penilaian kinerja yang buruk.',
      'Saya menutupi kesalahan bawahan agar mereka tidak tersinggung.',
      'Saya berusaha disukai oleh semua anggota tim.',
    ],
  },
  {
    key: 'autocrat', name: 'Autocrat', id: 'Otokrat', to: 1, ro: 0, eff: 0, basic: 'dedicated',
    desc: 'Sangat berorientasi tugas tanpa memperhatikan hubungan; memerintah, menuntut kepatuhan, dan kurang mempercayai bawahan.',
    statements: [
      'Saya menuntut bawahan mengikuti perintah tanpa banyak bertanya.',
      'Saya jarang meminta pendapat bawahan sebelum memutuskan sesuatu.',
      'Saya menegur keras bawahan yang tidak mencapai target.',
      'Saya menganggap hasil kerja jauh lebih penting daripada perasaan bawahan.',
      'Saya mengawasi bawahan dengan ketat setiap saat.',
      'Saya tidak menoleransi cara kerja yang berbeda dari cara saya.',
      'Saya menggunakan wewenang untuk memastikan perintah dijalankan.',
    ],
  },
  {
    key: 'compromiser', name: 'Compromiser', id: 'Kompromis', to: 1, ro: 1, eff: 0, basic: 'integrated',
    desc: 'Memperhatikan tugas dan hubungan, namun keputusan sering setengah hati dan mudah dipengaruhi tekanan yang paling kuat.',
    statements: [
      'Saya mencari jalan tengah agar semua pihak puas walaupun hasilnya kurang optimal.',
      'Saya sering berubah sikap tergantung pada tekanan yang paling kuat.',
      'Saya membuat keputusan yang tidak sepenuhnya memuaskan siapa pun.',
      'Saya berusaha menyenangkan atasan dan bawahan sekaligus.',
      'Saya ragu-ragu ketika harus memilih antara target dan kepentingan tim.',
      'Saya menawarkan kompromi meskipun inti masalah belum terselesaikan.',
      'Saya mudah mengubah keputusan jika ada yang keberatan.',
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
