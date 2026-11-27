import { IST_SUBTESTS, IQ_CATEGORIES } from './data/ist.js';
import { DISC_DIMS, DISC_PROFILES, DISC_PATTERNS } from './data/disc.js';
import { PAPI_DIMS, PAPI_PAIRS, PAPI_PER_DIM, PAPI_AREAS } from './data/papi.js';
import { MSDT_STYLES, MSDT_PAIRS, MSDT_BASIC } from './data/msdt.js';
import { BDI_ITEMS, BDI_LEVELS } from './data/bdi.js';

/* ============================ IST ============================ */
function levelFromPct(p) {
  if (p >= 0.8) return { label: 'Tinggi', tone: 'good' };
  if (p >= 0.6) return { label: 'Cukup', tone: 'ok' };
  if (p >= 0.4) return { label: 'Sedang', tone: 'warn' };
  return { label: 'Rendah', tone: 'bad' };
}

function parseNum(v) {
  if (v === undefined || v === null || String(v).trim() === '') return null;
  const n = Number(String(v).replace(/\./g, '').replace(',', '.'));
  return Number.isFinite(n) ? n : null;
}

export function scoreIST(answers = {}) {
  const subtests = IST_SUBTESTS.map((st) => {
    const items = st.items.map((it) => {
      const given = answers[it.id];
      const correct = st.type === 'number' ? parseNum(given) === it.answer : given === it.answer;
      return { ...it, given, correct: !!correct };
    });
    const raw = items.filter((i) => i.correct).length;
    const pct = raw / items.length;
    const level = levelFromPct(pct);
    return { ...st, items, raw, max: items.length, pct, level, interpretation: pct >= 0.6 ? st.high : st.low };
  });

  const raw = subtests.reduce((n, s) => n + s.raw, 0);
  const max = subtests.reduce((n, s) => n + s.max, 0);
  const pct = raw / max;
  const iq = Math.round(70 + 60 * pct); // estimasi linier (bukan norma resmi)
  const category = IQ_CATEGORIES.find((c) => iq >= c.min).label;

  const verbalSt = subtests.filter((s) => ['SE', 'WA', 'AN', 'GE'].includes(s.code));
  const numSt = subtests.filter((s) => ['RA', 'ZR'].includes(s.code));
  const logicSt = subtests.filter((s) => ['LO'].includes(s.code));
  const verbal = verbalSt.reduce((n, s) => n + s.raw, 0) / verbalSt.reduce((n, s) => n + s.max, 0);
  const numeric = numSt.reduce((n, s) => n + s.raw, 0) / numSt.reduce((n, s) => n + s.max, 0);
  const logic = logicSt.length ? logicSt.reduce((n, s) => n + s.raw, 0) / logicSt.reduce((n, s) => n + s.max, 0) : pct;

  const strengths = subtests.filter((s) => s.pct >= 0.8);
  const weaknesses = subtests.filter((s) => s.pct < 0.6);

  let thinking;
  if (Math.abs(verbal - numeric) < 0.15) thinking = 'Kemampuan verbal dan numerik relatif seimbang, menunjukkan pola berpikir yang fleksibel untuk berbagai jenis tugas.';
  else if (verbal > numeric) thinking = 'Kemampuan verbal lebih menonjol dibanding numerik. Cenderung lebih efektif pada tugas berbasis bahasa, komunikasi, dan konsep.';
  else thinking = 'Kemampuan numerik lebih menonjol dibanding verbal. Cenderung lebih efektif pada tugas berbasis angka, logika kuantitatif, dan pola.';

  const summary =
    `Peserta menjawab benar ${raw} dari ${max} soal (${Math.round(pct * 100)}%). ` +
    `Estimasi taraf kecerdasan berada pada kategori ${category} (perkiraan IQ ≈ ${iq}). ${thinking}`;

  return { subtests, raw, max, pct, iq, category, verbal, numeric, logic, strengths, weaknesses, summary };
}

/* ============================ DISC ============================ */
export function scoreDISC(answers = {}) {
  const most = { D: 0, I: 0, S: 0, C: 0 };
  const least = { D: 0, I: 0, S: 0, C: 0 };
  Object.values(answers).forEach((a) => {
    if (a?.most) most[a.most]++;
    if (a?.least) least[a.least]++;
  });
  const change = Object.fromEntries(DISC_DIMS.map((d) => [d, most[d] - least[d]]));
  const sorted = [...DISC_DIMS].sort((a, b) => change[b] - change[a]);
  const primary = sorted[0];
  const second = sorted[1];
  const secondary = change[second] > 0 && change[primary] - change[second] <= 4 ? second : null;
  const patternKey = secondary ? primary + secondary : primary;
  const pattern = DISC_PATTERNS[patternKey] || DISC_PATTERNS[primary];

  const maskPrimary = [...DISC_DIMS].sort((a, b) => most[b] - most[a])[0];
  const corePrimary = [...DISC_DIMS].sort((a, b) => least[a] - least[b])[0];

  const spread = change[sorted[0]] - change[sorted[3]];
  const maxMost = Math.max(...Object.values(most));
  const maxLeast = Math.max(...Object.values(least));

  let validity;
  if (spread <= 4) {
    validity = {
      label: 'Profil Datar (Under-shift)',
      tone: 'warn',
      note: 'Selisih skor antar dimensi sangat tipis (≤ 4). Ini biasanya terjadi jika jawaban kurang konsisten, ragu-ragu memilih, atau berusaha menjawab "aman" di setiap blok.',
    };
  } else if (spread >= 28 || maxMost >= 17 || maxLeast >= 17) {
    validity = {
      label: 'Profil Ekstrem (Over-shift)',
      tone: 'warn',
      note: 'Terdapat dominasi ekstrem pada satu dimensi. Bisa mencerminkan karakter yang sangat kuat, atau kecenderungan menampilkan citra tertentu secara berlebihan.',
    };
  } else {
    validity = {
      label: 'Valid & Konsisten',
      tone: 'good',
      note: 'Sebaran pilihan Paling (P) dan Paling Tidak (K) membentuk diferensiasi profil yang jelas dan terbaca.',
    };
  }

  let consistency;
  if (maskPrimary === corePrimary)
    consistency = `Perilaku yang ditampilkan di lingkungan (Mask) selaras dengan karakter dasar (Core), yaitu ${DISC_PROFILES[maskPrimary].name}. Ini menunjukkan peserta cenderung tampil apa adanya dan tidak sedang mengalami tekanan penyesuaian yang besar.`;
  else
    consistency = `Terdapat perbedaan antara perilaku yang ditampilkan (Mask: ${DISC_PROFILES[maskPrimary].name}) dan karakter dasar (Core: ${DISC_PROFILES[corePrimary].name}). Kemungkinan peserta sedang menyesuaikan diri dengan tuntutan lingkungan/pekerjaan; penyesuaian jangka panjang dapat menimbulkan kelelahan.`;

  const summary =
    `Gaya perilaku dominan adalah ${DISC_PROFILES[primary].name} (${primary})` +
    (secondary ? ` dengan pendukung ${DISC_PROFILES[secondary].name} (${secondary})` : '') +
    ` — pola "${pattern.name}". ${pattern.desc}`;

  return {
    most, least, change, sorted, spread, validity, primary, secondary, patternKey, pattern,
    profile: DISC_PROFILES[primary],
    secondaryProfile: secondary ? DISC_PROFILES[secondary] : null,
    maskPrimary, corePrimary, consistency, summary,
  };
}

/* ============================ PAPI ============================ */
function papiLevel(score) {
  if (score <= 3) return 'low';
  if (score <= 5) return 'mid';
  return 'high';
}
const PAPI_LEVEL_LABEL = { low: 'Rendah', mid: 'Sedang', high: 'Tinggi' };

export function scorePAPI(answers = {}) {
  const raw = Object.fromEntries(PAPI_DIMS.map((d) => [d.code, 0]));
  PAPI_PAIRS.forEach((p, i) => {
    const a = answers[i];
    if (a === 'a') raw[p.a.dim]++;
    else if (a === 'b') raw[p.b.dim]++;
  });
  const dims = PAPI_DIMS.map((d) => {
    const score = Math.round((raw[d.code] * 9) / PAPI_PER_DIM);
    const level = papiLevel(score);
    return { ...d, raw: raw[d.code], score, level, levelLabel: PAPI_LEVEL_LABEL[level], text: d[level] };
  });
  const areas = PAPI_AREAS.map((area) => {
    const ds = dims.filter((d) => d.area === area);
    const avg = ds.reduce((n, d) => n + d.score, 0) / ds.length;
    return { area, dims: ds, avg };
  });
  const sorted = [...dims].sort((a, b) => b.score - a.score);
  const top = sorted.slice(0, 4);
  const bottom = sorted.slice(-4).reverse();
  const get = (c) => dims.find((d) => d.code === c).score;

  const notes = [];
  const leadership = (get('L') + get('P') + get('I')) / 3;
  if (leadership >= 6) notes.push('Potensi kepemimpinan menonjol: percaya diri memimpin, mengarahkan, dan mengambil keputusan.');
  else if (leadership <= 3) notes.push('Lebih efektif berperan sebagai pelaksana/anggota tim dibanding posisi memimpin.');
  if (get('N') >= 6 && get('G') >= 6) notes.push('Etos kerja kuat: tekun dan berkomitmen menuntaskan pekerjaan.');
  if (get('D') >= 6 && get('C') >= 6) notes.push('Sangat cocok untuk pekerjaan yang menuntut ketelitian, keteraturan, dan administrasi.');
  if (get('Z') >= 6 && get('W') <= 3) notes.push('Menyukai kebebasan dan inovasi; kurang cocok di lingkungan yang sangat rutin dan birokratis.');
  if (get('W') >= 6 && get('F') >= 6) notes.push('Loyal dan patuh terhadap aturan serta atasan; dapat diandalkan dalam organisasi yang terstruktur.');
  if (get('S') >= 6 && get('X') >= 6) notes.push('Sangat sosial dan ekspresif; potensial untuk peran yang berhubungan dengan banyak orang (sales, humas).');
  if (get('E') <= 3 && get('K') >= 6) notes.push('Perlu memperhatikan pengendalian emosi ketika terjadi konflik.');
  if (get('R') >= 6) notes.push('Memiliki minat kuat pada analisis dan konsep; cocok untuk peran perencanaan, riset, atau strategi.');
  if (!notes.length) notes.push('Profil kebutuhan relatif seimbang tanpa kecenderungan yang ekstrem.');

  const needs = dims.filter((d) => d.kind === 'need');
  const roles = dims.filter((d) => d.kind === 'role');
  const needAvg = +(needs.reduce((n, d) => n + d.score, 0) / needs.length).toFixed(1);
  const roleAvg = +(roles.reduce((n, d) => n + d.score, 0) / roles.length).toFixed(1);
  let balanceNote;
  if (Math.abs(needAvg - roleAvg) < 0.8)
    balanceNote = `Skor Kebutuhan (${needAvg}/9) dan Peran (${roleAvg}/9) relatif seimbang: dorongan internal selaras dengan peran kerja yang dijalankan.`;
  else if (needAvg > roleAvg)
    balanceNote = `Dorongan Kebutuhan (${needAvg}/9) lebih tinggi daripada Peran (${roleAvg}/9): memiliki ekspektasi/motivasi internal yang kuat, perlu penyaluran peran kerja yang sesuai.`;
  else
    balanceNote = `Skor Peran (${roleAvg}/9) lebih tinggi daripada Kebutuhan (${needAvg}/9): cenderung adaptif menjalankan tuntutan peran kerja secara profesional.`;

  const summary =
    `Aspek paling menonjol: ${top.map((d) => `${d.name} (${d.code}=${d.score})`).join(', ')}. ` +
    `Aspek paling rendah: ${bottom.map((d) => `${d.name} (${d.code}=${d.score})`).join(', ')}.`;

  return { dims, areas, top, bottom, notes, needAvg, roleAvg, balanceNote, summary };
}

/* ============================ MSDT ============================ */
export function scoreMSDT(answers = {}) {
  const counts = Object.fromEntries(MSDT_STYLES.map((s) => [s.key, 0]));
  MSDT_PAIRS.forEach((p, i) => {
    const a = answers[i];
    if (a === 'a') counts[p.a.dim]++;
    else if (a === 'b') counts[p.b.dim]++;
  });
  const total = MSDT_PAIRS.length;
  const styles = MSDT_STYLES.map((s) => ({ ...s, count: counts[s.key] }));
  const TO = styles.filter((s) => s.to).reduce((n, s) => n + s.count, 0);
  const RO = styles.filter((s) => s.ro).reduce((n, s) => n + s.count, 0);
  const EFF = styles.filter((s) => s.eff).reduce((n, s) => n + s.count, 0);
  const half = total / 2;

  const hiTO = TO > half;
  const hiRO = RO > half;
  const basicKey = hiTO ? (hiRO ? 'integrated' : 'dedicated') : hiRO ? 'related' : 'separated';
  const effective = EFF > half;
  const finalStyle = styles.find((s) => s.basic === basicKey && s.eff === (effective ? 1 : 0));
  const dominant = [...styles].sort((a, b) => b.count - a.count)[0];

  const effText = effective
    ? 'Secara umum gaya manajemen cenderung EFEKTIF, yaitu sesuai dengan tuntutan situasi dan diterima oleh lingkungan.'
    : 'Secara umum gaya manajemen cenderung KURANG EFEKTIF; perilaku yang ditampilkan sering kurang sesuai dengan tuntutan situasi.';

  const summary =
    `Gaya dasar: ${MSDT_BASIC[basicKey].name} (${MSDT_BASIC[basicKey].id}). Gaya manajemen yang terbentuk: ${finalStyle.name} (${finalStyle.id}). ` +
    `Gaya dengan skor tertinggi: ${dominant.name} (${dominant.count}). ${effText}`;

  return {
    styles, TO, RO, EFF, total,
    toPct: TO / total, roPct: RO / total, effPct: EFF / total,
    basicKey, basic: MSDT_BASIC[basicKey], effective, finalStyle, dominant, effText, summary,
  };
}

/* ============================ BDI ============================ */
export function scoreBDI(answers = {}) {
  const items = BDI_ITEMS.map((it, i) => ({ ...it, no: i + 1, score: answers[i] ?? 0 }));
  const total = items.reduce((n, i) => n + i.score, 0);
  const level = BDI_LEVELS.find((l) => total <= l.max);
  const clusterSum = (c) => items.filter((i) => i.cluster === c).reduce((n, i) => n + i.score, 0);
  const clusterMax = (c) => items.filter((i) => i.cluster === c).length * 3;
  const clusters = ['afektif', 'kognitif', 'somatik'].map((c) => ({
    key: c,
    label: { afektif: 'Afektif (perasaan)', kognitif: 'Kognitif (pikiran)', somatik: 'Somatik (fisik)' }[c],
    score: clusterSum(c),
    max: clusterMax(c),
  }));
  const prominent = items.filter((i) => i.score >= 2);
  const critical = items.find((i) => i.critical);
  const riskFlag = critical.score > 0;
  const topCluster = [...clusters].sort((a, b) => b.score / b.max - a.score / a.max)[0];

  const summary =
    `Skor total ${total} dari 63 — tingkat gejala depresi ${level.label}. ` +
    (total > 13 ? `Keluhan paling banyak muncul pada aspek ${topCluster.label.toLowerCase()}. ` : '') +
    (riskFlag ? 'Terdapat indikasi pikiran untuk mengakhiri hidup yang memerlukan perhatian segera.' : '');

  const readiness =
    total <= 13
      ? 'Kondisi emosional tergolong stabil dan siap menjalani aktivitas maupun tuntutan kerja.'
      : total <= 19
      ? 'Stabilitas emosional cukup terjaga, namun perlu memperhatikan manajemen stres dan waktu istirahat.'
      : 'Beban emosional tampak cukup tinggi dan berpotensi memengaruhi fokus serta energi kerja.';

  return { items, total, level, clusters, prominent, riskFlag, readiness, summary };
}

/* ============================ RANGKUMAN ============================ */
export function scoreAll(answers, done) {
  const r = {};
  if (done.ist) r.ist = scoreIST(answers.ist);
  if (done.disc) r.disc = scoreDISC(answers.disc);
  if (done.papi) r.papi = scorePAPI(answers.papi);
  if (done.msdt) r.msdt = scoreMSDT(answers.msdt);
  if (done.bdi) r.bdi = scoreBDI(answers.bdi);
  return r;
}

export function buildOverall(r, participant) {
  const name = participant?.name?.split(' ')[0] || 'Peserta';
  const paras = [];

  if (r.ist) {
    paras.push({
      title: 'Kapasitas Intelektual',
      text: `${name} memiliki estimasi taraf kecerdasan ${r.ist.category} (IQ ≈ ${r.ist.iq}). ` +
        (r.ist.strengths.length ? `Kekuatan kognitif terlihat pada ${r.ist.strengths.map((s) => s.label.toLowerCase()).join(', ')}. ` : '') +
        (r.ist.weaknesses.length ? `Area yang masih dapat dikembangkan: ${r.ist.weaknesses.map((s) => s.label.toLowerCase()).join(', ')}.` : 'Tidak ditemukan kelemahan menonjol pada subtes yang diujikan.'),
    });
  }
  if (r.disc) {
    paras.push({
      title: 'Gaya Perilaku',
      text: `Dalam berperilaku, ${name} cenderung bergaya ${r.disc.profile.name}${r.disc.secondaryProfile ? `–${r.disc.secondaryProfile.name}` : ''}: ${r.disc.profile.summary.toLowerCase()} Lingkungan ideal: ${r.disc.profile.environment.toLowerCase()}`,
    });
  }
  if (r.papi) {
    paras.push({
      title: 'Kebutuhan & Peran Kerja',
      text: `Dalam bekerja, kebutuhan paling menonjol adalah ${r.papi.top.slice(0, 3).map((d) => d.name.toLowerCase()).join(', ')}. ${r.papi.notes.join(' ')}`,
    });
  }
  if (r.msdt) {
    paras.push({
      title: 'Gaya Manajemen',
      text: `Sebagai pengelola/pemimpin, ${name} menunjukkan gaya ${r.msdt.finalStyle.name} (${r.msdt.finalStyle.id}): ${r.msdt.finalStyle.desc} ${r.msdt.effText}`,
    });
  }
  if (r.bdi) {
    paras.push({
      title: 'Kondisi Emosional',
      text: `Hasil skrining suasana hati berada pada tingkat ${r.bdi.level.label} (skor ${r.bdi.total}). ${r.bdi.level.desc} ${r.bdi.level.advice}`,
    });
  }

  // Rekomendasi pengembangan & kesesuaian
  const recs = [];
  if (r.disc) recs.push(r.disc.profile.tips);
  if (r.msdt && !r.msdt.effective) recs.push('Mengikuti pelatihan kepemimpinan situasional untuk menyesuaikan gaya manajemen dengan kebutuhan tim.');
  if (r.ist && r.ist.weaknesses.length) recs.push(`Melatih kemampuan ${r.ist.weaknesses.map((s) => s.label.toLowerCase()).join(', ')} melalui latihan soal dan aktivitas terkait.`);
  if (r.papi) {
    const low = r.papi.bottom[0];
    recs.push(`Meninjau aspek "${low.name}" yang relatif rendah agar sesuai dengan tuntutan peran yang dituju.`);
  }
  if (r.bdi && r.bdi.total > 13) recs.push('Memperhatikan kesejahteraan psikologis dan mempertimbangkan konsultasi dengan profesional kesehatan mental.');

  let fit = null;
  if (r.ist || r.disc || r.msdt) {
    const score =
      (r.ist ? (r.ist.iq >= 110 ? 2 : r.ist.iq >= 90 ? 1 : 0) : 1) +
      (r.msdt ? (r.msdt.effective ? 2 : 0) : 1) +
      (r.bdi ? (r.bdi.total <= 19 ? 1 : 0) : 1);
    fit = score >= 4 ? 'Disarankan' : score >= 3 ? 'Dipertimbangkan' : 'Kurang Disarankan';
  }

  // Rekomendasi pekerjaan berdasarkan kombinasi hasil tes yang sudah dikerjakan
  const jobMap = new Map();
  const addJob = (role, source) => {
    if (!jobMap.has(role)) jobMap.set(role, []);
    jobMap.get(role).push(source);
  };
  if (r.disc?.pattern?.jobs) {
    r.disc.pattern.jobs.forEach((j) => addJob(j, `Pola DISC ${r.disc.patternKey} (${r.disc.pattern.name})`));
  }
  if (r.ist) {
    if (r.ist.numeric - r.ist.verbal >= 0.15) {
      addJob('Analis Data / Keuangan', 'Kekuatan numerik IST');
      addJob('Engineering / Akuntansi', 'Kekuatan numerik IST');
    } else if (r.ist.verbal - r.ist.numeric >= 0.15) {
      addJob('Komunikasi / Humas / Legal', 'Kekuatan verbal IST');
      addJob('Penulis / Perencana Strategi', 'Kekuatan verbal IST');
    } else if (r.ist.iq >= 110) {
      addJob('Analis / Perencana Strategis', 'Kapasitas intelektual IST seimbang & tinggi');
    }
  }
  if (r.papi) {
    const get = (c) => r.papi.dims.find((d) => d.code === c).score;
    if ((get('L') + get('P') + get('I')) / 3 >= 6) addJob('Team Lead / Supervisor / Manajer', 'Kepemimpinan PAPI tinggi');
    if (get('D') >= 6 && get('C') >= 6) addJob('Administrasi / QA / Audit', 'Ketelitian & keteraturan PAPI tinggi');
    if (get('S') >= 6 && get('X') >= 6) addJob('Sales / Public Relations', 'Sosial & ekspresif PAPI tinggi');
    if (get('R') >= 6) addJob('Riset / Perencanaan / Analis', 'Minat konseptual PAPI tinggi');
  }
  if (r.msdt) {
    const k = r.msdt.finalStyle.key;
    if (k === 'executive' || k === 'benevolent') addJob('Manajer / Kepala Divisi', `Gaya MSDT ${r.msdt.finalStyle.name}`);
    else if (k === 'developer') addJob('People Manager / Coach / HRD', 'Gaya MSDT Developer');
    else if (k === 'bureaucrat') addJob('Manajer Operasional / Compliance', 'Gaya MSDT Bureaucrat');
  }
  const jobs = [...jobMap.entries()].slice(0, 6).map(([role, reasons]) => ({ role, reason: reasons.join(' · ') }));

  return { paras, recs, fit, jobs };
}
