import { seededShuffle } from '../utils.js';

export const DISC_DIMS = ['D', 'I', 'S', 'C'];

// 24 kelompok pernyataan situasional (forced-choice Paling & Paling Tidak).
// Setiap kelompok disusun setara secara social desirability (semua positif, semua netral/kontekstual,
// atau semua berupa tantangan/kelemahan) agar tidak mudah ditebak dan mengurangi bias "ingin tampil baik".
export const DISC_GROUPS = [
  // 1–6: Blok kekuatan kerja (semua terdengar positif & profesional)
  {
    D: 'Cepat mengambil keputusan saat situasi mendesak',
    I: 'Mampu mencairkan suasana dan menyemangati tim',
    S: 'Tetap tenang dan setia mendampingi tim hingga tuntas',
    C: 'Memeriksa detail agar tidak ada kesalahan prosedur',
  },
  {
    D: 'Berani mengambil risiko demi target yang lebih besar',
    I: 'Mudah meyakinkan orang lain dengan komunikasi hangat',
    S: 'Sabar mendengarkan keluhan tanpa menghakimi',
    C: 'Menyusun rencana kerja secara sistematis dan terukur',
  },
  {
    D: 'Langsung fokus pada inti masalah tanpa bertele-tele',
    I: 'Optimis melihat peluang di setiap situasi baru',
    S: 'Menjaga keharmonisan dan kekompakan antarrekan',
    C: 'Mengutamakan akurasi data sebelum mengambil sikap',
  },
  {
    D: 'Tertantang saat menghadapi persaingan yang ketat',
    I: 'Mudah akrab dan membangun jaringan dengan orang baru',
    S: 'Konsisten menyelesaikan tugas rutin dengan tekun',
    C: 'Berpegang teguh pada standar kualitas yang tinggi',
  },
  {
    D: 'Mandiri dan tidak bergantung pada arahan orang lain',
    I: 'Spontan dan ekspresif dalam menyampaikan gagasan',
    S: 'Akomodatif dan bersedia menyesuaikan diri demi tim',
    C: 'Berhati-hati dan mempertimbangkan dampak jangka panjang',
  },
  {
    D: 'Tegas mengambil alih kendali ketika tim kehilangan arah',
    I: 'Inspiratif dan membuat orang lain antusias bekerja',
    S: 'Dapat diandalkan untuk menjaga stabilitas pekerjaan',
    C: 'Objektif menilai persoalan berdasarkan fakta, bukan emosi',
  },

  // 7–14: Blok jebakan tantangan/kelemahan (semua menggambarkan sisi kurang ideal yang setara)
  {
    D: 'Mudah tidak sabar jika proses kerja berjalan lambat',
    I: 'Sering terdistraksi ide baru sebelum tugas lama selesai',
    S: 'Sulit berkata "tidak" meski beban kerja sudah penuh',
    C: 'Terlalu lama menimbang data sebelum berani memutuskan',
  },
  {
    D: 'Cenderung memaksakan kehendak saat merasa yakin benar',
    I: 'Kurang teliti terhadap hal administratif dan rincian kecil',
    S: 'Cenderung menghindari konfrontasi meski ada masalah nyata',
    C: 'Terlalu kritis terhadap kekurangan pekerjaan orang lain',
  },
  {
    D: 'Kurang peka terhadap perasaan orang saat mengejar target',
    I: 'Mudah berubah suasana hati jika kurang mendapat apresiasi',
    S: 'Lambat beradaptasi ketika aturan berubah mendadak',
    C: 'Kaku terhadap prosedur meski situasi butuh fleksibilitas',
  },
  {
    D: 'Mudah bosan dengan pekerjaan rutin yang berulang',
    I: 'Terlalu banyak bicara sehingga kadang melenceng dari topik',
    S: 'Pasif menunggu arahan daripada berinisiatif lebih dulu',
    C: 'Sulit menerima cara kerja baru yang belum terbukti',
  },
  {
    D: 'Keras kepala saat pendapatnya ditentang secara terbuka',
    I: 'Terlalu optimis sehingga meremehkan potensi hambatan',
    S: 'Menyimpan ketidaksetujuan di dalam hati daripada bicara',
    C: 'Perfeksionis hingga pekerjaan sering tertunda penyelesaiannya',
  },
  {
    D: 'Cepat bereaksi keras ketika otoritasnya dipertanyakan',
    I: 'Kurang teratur dalam mengelola jadwal dan prioritas',
    S: 'Terlalu bergantung pada persetujuan kelompok sebelum bertindak',
    C: 'Menarik diri dan menjadi dingin saat suasana kerja memanas',
  },
  {
    D: 'Menganggap aturan hanya sebagai pedoman yang bisa dilanggar demi hasil',
    I: 'Lebih mengandalkan improvisasi daripada persiapan matang',
    S: 'Mudah merasa tidak enak hati saat harus menegur rekan',
    C: 'Cemas berlebihan jika ada variabel yang tidak bisa diprediksi',
  },
  {
    D: 'Terlalu kompetitif hingga rekan kerja merasa tertekan',
    I: 'Mudah menjanjikan sesuatu tanpa menghitung kapasitas waktu',
    S: 'Bertahan di zona nyaman terlalu lama meski perlu perubahan',
    C: 'Enggan mendelegasikan tugas karena takut hasilnya tidak rapi',
  },

  // 15–24: Blok situasional & dilema perilaku kerja (jebakan konteks)
  {
    D: 'Saat rapat buntu, saya segera memutus arah agar tidak buang waktu',
    I: 'Saat rapat buntu, saya melempar ide segar agar diskusi hidup lagi',
    S: 'Saat rapat buntu, saya merangkum pendapat agar semua merasa didengar',
    C: 'Saat rapat buntu, saya meminta data tambahan agar keputusan akurat',
  },
  {
    D: 'Jika target meleset, saya langsung mengevaluasi siapa yang bertanggung jawab',
    I: 'Jika target meleset, saya memotivasi tim agar tidak patah semangat',
    S: 'Jika target meleset, saya menenangkan tim dan membantu bagian yang tertinggal',
    C: 'Jika target meleset, saya melacak titik kesalahan prosesnya secara rinci',
  },
  {
    D: 'Saya lebih menghargai hasil akhir daripada cara mencapainya',
    I: 'Saya lebih menghargai semangat dan keterlibatan semua orang',
    S: 'Saya lebih menghargai kerja sama yang tenang tanpa drama',
    C: 'Saya lebih menghargai ketepatan prosedur dan minimnya kesalahan',
  },
  {
    D: 'Ketika dikritik, saya langsung membela argumen dengan tegas',
    I: 'Ketika dikritik, saya mencoba mencairkan suasana agar hubungan tetap baik',
    S: 'Ketika dikritik, saya diam mendengarkan dan menerima demi menjaga damai',
    C: 'Ketika dikritik, saya meminta bukti spesifik dan penjelasan logisnya',
  },
  {
    D: 'Saya paling bersemangat jika diberi wewenang penuh dan target menantang',
    I: 'Saya paling bersemangat jika bekerja bersama banyak orang yang ramah',
    S: 'Saya paling bersemangat jika pekerjaan teratur dan suasana tim stabil',
    C: 'Saya paling bersemangat jika tugas menuntut analisis mendalam dan presisi',
  },
  {
    D: 'Dalam perubahan mendadak, saya melihat peluang untuk mengambil kendali',
    I: 'Dalam perubahan mendadak, saya antusias mencoba hal baru yang seru',
    S: 'Dalam perubahan mendadak, saya butuh waktu untuk memastikan semuanya aman',
    C: 'Dalam perubahan mendadak, saya mempertanyakan alasan dan risikonya dulu',
  },
  {
    D: 'Saya kurang nyaman bekerja di bawah pengawasan yang terlalu ketat',
    I: 'Saya kurang nyaman bekerja sendirian tanpa interaksi sosial',
    S: 'Saya kurang nyaman bekerja di lingkungan yang penuh konflik terbuka',
    C: 'Saya kurang nyaman bekerja di tempat yang aturannya sering berubah',
  },
  {
    D: 'Saat memulai proyek baru, saya langsung menentukan target dan tenggat',
    I: 'Saat memulai proyek baru, saya mengajak tim bertukar gagasan secara bebas',
    S: 'Saat memulai proyek baru, saya memastikan pembagian peran adil bagi semua',
    C: 'Saat memulai proyek baru, saya menyusun daftar periksa dan mitigasi risiko',
  },
  {
    D: 'Orang lain sering melihat saya sebagai pribadi yang blak-blakan dan menuntut',
    I: 'Orang lain sering melihat saya sebagai pribadi yang ramai dan mudah bergaul',
    S: 'Orang lain sering melihat saya sebagai pribadi yang kalem dan penuh pengertian',
    C: 'Orang lain sering melihat saya sebagai pribadi yang serius dan penuh perhitungan',
  },
  {
    D: 'Keberhasilan bagi saya adalah memenangkan tantangan dan melampaui standar',
    I: 'Keberhasilan bagi saya adalah diakui, disukai, dan menginspirasi banyak orang',
    S: 'Keberhasilan bagi saya adalah menjaga hubungan baik dan menyelesaikan amanah',
    C: 'Keberhasilan bagi saya adalah menghasilkan karya yang rapi tanpa cacat',
  },
];

// Urutan tampilan kata/frasa diacak secara konsisten per nomor
export const DISC_ORDER = DISC_GROUPS.map((_, i) => seededShuffle(DISC_DIMS, 1000 + i * 7));

export const DISC_PROFILES = {
  D: {
    name: 'Dominance',
    label: 'Dominan',
    color: '#ef4444',
    summary:
      'Berorientasi pada hasil, tegas, cepat mengambil keputusan, dan menyukai tantangan. Fokus pada pencapaian tujuan dan mengendalikan situasi.',
    strengths: ['Tegas dan berani mengambil keputusan', 'Berorientasi pada hasil dan target', 'Menyukai tantangan dan kompetisi', 'Mampu memimpin di situasi krisis'],
    weaknesses: ['Kurang sabar terhadap proses yang lambat', 'Bisa terkesan otoriter atau kurang peka', 'Cenderung mengabaikan detail', 'Sulit mendelegasikan tanpa kendali penuh'],
    communication: 'Langsung pada inti, singkat, fokus pada hasil dan solusi, kurang menyukai basa-basi.',
    motivator: 'Otoritas, tantangan baru, pencapaian target, dan kebebasan bertindak.',
    conflict: 'Menghadapi konflik secara langsung; cenderung mendominasi atau memaksakan solusi cepat.',
    roles: 'Manajer Operasional, Business Development, Team Lead krisis, Wirausaha, Project Director.',
    environment: 'Lingkungan yang memberi otoritas, tantangan, kebebasan bertindak, dan kesempatan berkembang cepat.',
    pressure: 'Di bawah tekanan dapat menjadi menuntut, keras, dan tidak sabar.',
    tips: 'Melatih kesabaran, mendengarkan masukan orang lain, dan memperhatikan dampak keputusan terhadap tim.',
  },
  I: {
    name: 'Influence',
    label: 'Intim / Influence',
    color: '#f59e0b',
    summary:
      'Antusias, optimis, komunikatif, dan persuasif. Senang berinteraksi, membangun relasi, dan memotivasi orang lain.',
    strengths: ['Komunikatif dan persuasif', 'Optimis dan membangkitkan semangat', 'Mudah membangun jaringan', 'Kreatif dalam menyampaikan ide'],
    weaknesses: ['Kurang terorganisir dan detail', 'Bisa terlalu optimis/impulsif', 'Mudah teralihkan oleh hal baru', 'Menghindari konflik yang tidak menyenangkan'],
    communication: 'Hangat, ekspresif, antusias, suka bercerita dan membangun kedekatan.',
    motivator: 'Pengakuan sosial, interaksi tim, suasana positif, dan kebebasan berekspresi.',
    conflict: 'Mencoba mencairkan suasana atau menghindari konfrontasi langsung agar relasi tetap baik.',
    roles: 'Marketing, Public Relations, Sales/Account Manager, Trainer, Event/Community Lead.',
    environment: 'Lingkungan yang ramah, penuh interaksi sosial, memberi pengakuan, dan bebas dari kontrol yang kaku.',
    pressure: 'Di bawah tekanan dapat menjadi tidak teratur, emosional, atau terlalu banyak bicara.',
    tips: 'Melatih manajemen waktu, menindaklanjuti komitmen, dan memperhatikan detail.',
  },
  S: {
    name: 'Steadiness',
    label: 'Stabil / Steadiness',
    color: '#10b981',
    summary:
      'Sabar, stabil, loyal, dan suportif. Menyukai lingkungan yang harmonis, dapat diandalkan, dan menjadi pendengar yang baik.',
    strengths: ['Sabar dan konsisten', 'Loyal serta dapat diandalkan', 'Pendengar yang baik dan suportif', 'Menciptakan harmoni dalam tim'],
    weaknesses: ['Kurang nyaman dengan perubahan mendadak', 'Sulit berkata "tidak"', 'Menghindari konfrontasi', 'Lambat dalam mengambil inisiatif'],
    communication: 'Tenang, sopan, mendengarkan lebih banyak, menjaga perasaan lawan bicara.',
    motivator: 'Stabilitas kerja, keharmonisan tim, rasa aman, dan apresiasi yang tulus.',
    conflict: 'Cenderung mengalah atau memendam ketidaksetujuan demi menjaga kedamaian.',
    roles: 'HR Support, Customer Success, Administrasi Senior, Perawat/Konselor, Coordinator operasional.',
    environment: 'Lingkungan yang stabil, prosedur jelas, kerja sama tim yang baik, dan perubahan yang dikomunikasikan bertahap.',
    pressure: 'Di bawah tekanan cenderung mengalah, pasif, atau memendam ketidaksetujuan.',
    tips: 'Melatih asertivitas, keterbukaan terhadap perubahan, dan keberanian mengambil inisiatif.',
  },
  C: {
    name: 'Compliance',
    label: 'Cermat / Compliance',
    color: '#3b82f6',
    summary:
      'Analitis, teliti, sistematis, dan berstandar tinggi. Mengutamakan akurasi, kualitas, serta kepatuhan pada aturan dan prosedur.',
    strengths: ['Teliti dan akurat', 'Analitis dan logis', 'Berstandar kualitas tinggi', 'Sistematis dan taat prosedur'],
    weaknesses: ['Cenderung perfeksionis', 'Lambat memutuskan karena butuh data lengkap', 'Kritis berlebihan', 'Kurang ekspresif secara sosial'],
    communication: 'Terstruktur, berbasis data dan fakta, formal, hati-hati dalam memilih kata.',
    motivator: 'Kejelasan aturan, standar kualitas tinggi, waktu untuk analisis, dan minim kesalahan.',
    conflict: 'Menggunakan argumen logis dan aturan tertulis; bila terdesak cenderung menarik diri.',
    roles: 'Quality Assurance, Auditor, Analis Data/Keuangan, Software Engineer, Legal/Compliance.',
    environment: 'Lingkungan dengan standar jelas, waktu untuk analisis, tugas yang membutuhkan presisi, dan minim konflik personal.',
    pressure: 'Di bawah tekanan dapat menarik diri, terlalu kritis, atau terjebak analisis berlebihan.',
    tips: 'Melatih fleksibilitas, menerima "cukup baik", dan mengambil keputusan dengan informasi yang tersedia.',
  },
};

export const DISC_PATTERNS = {
  D: {
    name: 'Developer / Pengembang',
    desc: 'Mandiri, berorientasi pada hasil, dan senang membuka peluang baru dengan caranya sendiri.',
    jobs: ['Wirausaha / Founder', 'Operations Manager', 'Business Development', 'Project Director'],
  },
  I: {
    name: 'Promoter / Penggerak',
    desc: 'Sangat sosial dan persuasif, unggul dalam membangun hubungan dan memotivasi orang.',
    jobs: ['Public Relations / Humas', 'Marketing & Branding', 'Trainer / Fasilitator', 'Event & Community Manager'],
  },
  S: {
    name: 'Specialist / Spesialis',
    desc: 'Stabil, sabar, dan konsisten; unggul dalam pekerjaan yang membutuhkan ketekunan.',
    jobs: ['HR Administration / People Ops', 'Customer Success Specialist', 'Staf Operasional Tetap', 'Konselor / Layanan Kesehatan'],
  },
  C: {
    name: 'Objective Thinker / Pemikir Objektif',
    desc: 'Analitis dan logis, mengambil keputusan berdasarkan data dan fakta.',
    jobs: ['Data Analyst / BI', 'Auditor / Quality Assurance', 'Software Engineer', 'Akuntan / Analis Keuangan'],
  },
  DI: {
    name: 'Inspirational / Inspirator',
    desc: 'Tegas sekaligus karismatik; mampu menggerakkan orang menuju tujuan.',
    jobs: ['Sales Manager / Head of Growth', 'Team Lead / Supervisor Lapangan', 'Agency Director', 'Startup Lead'],
  },
  DS: {
    name: 'Achiever / Pencapai',
    desc: 'Berorientasi target namun tekun dan stabil dalam menjalankannya.',
    jobs: ['Production / Plant Manager', 'Project Manager', 'Supply Chain Lead', 'Kepala Cabang'],
  },
  DC: {
    name: 'Creative / Kreatif',
    desc: 'Berorientasi hasil dengan standar tinggi; inovatif sekaligus perfeksionis.',
    jobs: ['Product Manager', 'Arsitek / Engineering Lead', 'Management Consultant', 'Tech Lead'],
  },
  ID: {
    name: 'Persuader / Pembujuk',
    desc: 'Komunikatif dan berani; efektif dalam negosiasi dan memengaruhi orang.',
    jobs: ['Account Executive / B2B Sales', 'Negosiator / Partnership', 'Recruiter / Talent Acquisition', 'Media & Komunikasi'],
  },
  IS: {
    name: 'Counselor / Konselor',
    desc: 'Hangat, empatik, dan suportif; dipercaya orang untuk didengar.',
    jobs: ['HR Business Partner', 'Customer Relations', 'Guru / Dosen / Coach', 'Psikolog / Konselor'],
  },
  IC: {
    name: 'Appraiser / Penilai',
    desc: 'Kreatif dan komunikatif, namun tetap memperhatikan kualitas.',
    jobs: ['UX Researcher / Designer', 'Digital Marketing Analyst', 'Editorial / Content Strategist', 'Product Marketing'],
  },
  SD: {
    name: 'Investigator / Penyelidik',
    desc: 'Tekun, gigih, dan objektif dalam menyelesaikan persoalan.',
    jobs: ['Research & Development', 'System / Business Analyst', 'Investigator / Fraud Analyst', 'Project Controller'],
  },
  SI: {
    name: 'Agent / Agen',
    desc: 'Ramah, suportif, dan berorientasi pada orang; perekat dalam tim.',
    jobs: ['HR Generalist', 'Client Service / Account Support', 'Office Manager', 'Koordinator Tim'],
  },
  SC: {
    name: 'Perfectionist Supporter / Pendukung Teliti',
    desc: 'Stabil, teliti, dan dapat diandalkan dalam prosedur yang rinci.',
    jobs: ['Staf Administrasi & Kepatuhan', 'Quality Control', 'Finance & Tax Staff', 'Database Administrator'],
  },
  CD: {
    name: 'Challenger / Penantang',
    desc: 'Analitis dan tegas; kritis terhadap kualitas dan menuntut hasil.',
    jobs: ['IT / Security Architect', 'Legal & Compliance Manager', 'Risk Manager', 'Senior Auditor'],
  },
  CI: {
    name: 'Practitioner / Praktisi',
    desc: 'Kompeten dan ingin diakui keahliannya; seimbang antara analisis dan relasi.',
    jobs: ['Solutions Consultant', 'Technical Trainer', 'Business Intelligence Consultant', 'Spesialis Produk Teknis'],
  },
  CS: {
    name: 'Perfectionist / Perfeksionis',
    desc: 'Sistematis, presisi, dan sangat memperhatikan prosedur serta kualitas.',
    jobs: ['Quality Assurance Engineer', 'Actuary / Risk Analyst', 'Regulatory / Legal Officer', 'Staf Akuntansi & Pelaporan'],
  },
};
