import { useState } from 'react';
import { TESTS } from '../data/tests.js';

function ParticipantForm({ initial, onSave }) {
  const [f, setF] = useState(
    initial || { name: '', age: '', gender: '', education: '', position: '', date: new Date().toISOString().slice(0, 10) }
  );
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });
  const valid = f.name.trim() && f.age && f.gender;

  return (
    <form
      className="card form-card"
      onSubmit={(e) => {
        e.preventDefault();
        if (valid) onSave({ ...f, name: f.name.trim() });
      }}
    >
      <h2>Data Peserta</h2>
      <p className="muted">Lengkapi data diri sebelum memulai rangkaian tes.</p>
      <div className="grid-2">
        <label>
          Nama lengkap *
          <input value={f.name} onChange={set('name')} placeholder="mis. Budi Santoso" required />
        </label>
        <label>
          Usia *
          <input type="number" min="10" max="100" value={f.age} onChange={set('age')} required />
        </label>
        <label>
          Jenis kelamin *
          <select value={f.gender} onChange={set('gender')} required>
            <option value="">— pilih —</option>
            <option>Laki-laki</option>
            <option>Perempuan</option>
          </select>
        </label>
        <label>
          Pendidikan terakhir
          <select value={f.education} onChange={set('education')}>
            <option value="">— pilih —</option>
            {['SMA/SMK', 'D3', 'S1', 'S2', 'S3'].map((x) => (
              <option key={x}>{x}</option>
            ))}
          </select>
        </label>
        <label>
          Posisi yang dilamar / tujuan tes
          <input value={f.position} onChange={set('position')} placeholder="mis. Staf Administrasi" />
        </label>
        <label>
          Tanggal tes
          <input type="date" value={f.date} onChange={set('date')} />
        </label>
      </div>
      <button className="btn primary" disabled={!valid}>
        Simpan & Lanjutkan →
      </button>
    </form>
  );
}

const CATEGORIES = {
  ist: 'Kognitif & Penalaran',
  disc: 'Kepribadian Perilaku',
  papi: 'Gaya & Peran Kerja',
  msdt: 'Kepemimpinan',
  bdi: 'Skrining Emosional',
  figural: 'Visual & Spasial',
};

export default function Home({ state, historyCount, onSaveParticipant, onStart, onContinue, onResults, onSaveHistory, onHistory, onReset }) {
  const [editing, setEditing] = useState(false);
  const { participant, done, answers } = state;
  const doneCount = TESTS.filter((t) => done[t.id]).length;
  const pct = Math.round((doneCount / TESTS.length) * 100);

  return (
    <div className="home">
      <section className="hero-potensia">
        <div className="hero-copy">
          <span className="pill">Platform Asesmen Psikologi &amp; Karier</span>
          <h1>Kenali Potensi &amp; Arah Karier Anda</h1>
          <p className="muted">
            Ikuti rangkaian 6 alat tes terstruktur (IST, DISC, PAPI Kostick, MSDT, BDI, dan Figural &amp; Spasial) untuk
            memetakan kekuatan kognitif, gaya kerja, kepemimpinan, serta rekomendasi karier yang paling sesuai.
          </p>
          <div className="hero-highlights">
            <span>✓ 6 Alat Tes Terpadu</span>
            <span>✓ Analisa &amp; Career Match Instan</span>
            <span>✓ Cetak PDF &amp; Riwayat</span>
          </div>
        </div>
        <div className="hero-panel">
          <div className="hero-panel-top">
            <span className="muted small">Progres Asesmen</span>
            <b>
              {doneCount}/{TESTS.length} Selesai
            </b>
          </div>
          <div className="progress" style={{ height: 10, margin: '8px 0 10px' }}>
            <div className="progress-fill" style={{ width: `${pct}%` }} />
          </div>
          <p className="muted small" style={{ marginBottom: 14 }}>
            {doneCount === 0
              ? 'Isi data peserta lalu pilih salah satu modul tes di bawah untuk memulai.'
              : doneCount < TESTS.length
              ? `Masih ada ${TESTS.length - doneCount} modul tersisa untuk analisa lengkap.`
              : 'Semua modul selesai! Anda dapat melihat laporan lengkap atau menyimpannya ke riwayat.'}
          </p>
          <button className="btn primary" style={{ width: '100%' }} disabled={!doneCount} onClick={onResults}>
            Lihat Laporan &amp; Analisa →
          </button>
        </div>
      </section>

      {!participant || editing ? (
        <ParticipantForm
          initial={participant}
          onSave={(p) => {
            onSaveParticipant(p);
            setEditing(false);
          }}
        />
      ) : (
        <>
          <div className="card participant-card">
            <div>
              <h3>{participant.name}</h3>
              <p className="muted">
                {participant.age} tahun · {participant.gender}
                {participant.education && ` · ${participant.education}`}
                {participant.position && ` · ${participant.position}`}
              </p>
            </div>
            <div className="row-gap">
              <button className="btn ghost" onClick={() => setEditing(true)}>
                Ubah data
              </button>
              <button className="btn ghost danger" onClick={onReset}>
                Reset
              </button>
            </div>
          </div>

          <div className="section-title-row">
            <div>
              <h2>Daftar Modul Asesmen</h2>
              <p className="muted small">Pilih modul tes yang ingin dikerjakan. Progres tersimpan otomatis.</p>
            </div>
            <span className="muted small">{TESTS.length} Modul Tersedia</span>
          </div>

          <div className="test-grid">
            {TESTS.map((t, i) => {
              const answered = Object.keys(answers[t.id] || {}).length;
              const isDone = !!done[t.id];
              const inProgress = !isDone && answered > 0;
              return (
                <div className={`card test-card ${isDone ? 'done' : ''}`} key={t.id} style={{ '--c': t.color }}>
                  <div className="test-card-head">
                    <span className="test-icon-box">{t.icon}</span>
                    <span className="test-cat">{CATEGORIES[t.id] || `Tes ${i + 1}`}</span>
                  </div>
                  <h3>{t.name}</h3>
                  <p className="test-full">{t.fullName}</p>
                  <p className="muted small">{t.desc}</p>
                  <div className="test-meta">
                    <span>📝 {t.items} soal</span>
                    <span>⏱ ±{t.minutes} menit</span>
                  </div>
                  <div className="test-card-foot">
                    {isDone ? (
                      <div className="row-gap" style={{ width: '100%', justifyContent: 'space-between' }}>
                        <span className="badge good">✓ Selesai</span>
                        <button className="btn ghost sm" onClick={() => window.confirm('Ulangi tes ini? Jawaban sebelumnya akan dihapus.') && onStart(t.id)}>
                          Ulangi
                        </button>
                      </div>
                    ) : inProgress ? (
                      <button className="btn primary" style={{ width: '100%' }} onClick={() => onContinue(t.id)}>
                        Lanjutkan ({answered}/{t.items})
                      </button>
                    ) : (
                      <button className="btn primary" style={{ width: '100%' }} onClick={() => onStart(t.id)}>
                        Mulai Tes →
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="card cta-card">
            <div>
              <h3>Hasil & Analisa</h3>
              <p className="muted">
                {doneCount === TESTS.length
                  ? 'Semua tes telah selesai. Lihat laporan lengkap Anda.'
                  : doneCount > 0
                  ? `Anda telah menyelesaikan ${doneCount} tes. Laporan akan menampilkan hasil tes yang sudah selesai.`
                  : 'Selesaikan minimal satu tes untuk melihat hasil.'}
              </p>
            </div>
            <div className="row-gap">
              {historyCount > 0 && (
                <button className="btn ghost" onClick={onHistory}>
                  🗂 Riwayat ({historyCount})
                </button>
              )}
              <button className="btn ghost" disabled={!doneCount} onClick={onSaveHistory}>
                💾 Simpan ke Riwayat
              </button>
              <button className="btn primary lg" disabled={!doneCount} onClick={onResults}>
                Lihat Hasil & Analisa →
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
