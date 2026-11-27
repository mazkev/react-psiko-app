import { useMemo } from 'react';
import { scoreAll, buildOverall } from '../scoring.js';
import { TESTS } from '../data/tests.js';
import { DISC_PROFILES } from '../data/disc.js';
import { Section, Analysis, pct } from './results/ResultPrimitives.jsx';
import ISTResult from './results/ISTResult.jsx';
import DISCResult from './results/DISCResult.jsx';
import PAPIResult from './results/PAPIResult.jsx';
import MSDTResult from './results/MSDTResult.jsx';
import BDIResult from './results/BDIResult.jsx';
import FiguralResult from './results/FiguralResult.jsx';

export default function Results({ state, isArchived, onSaveHistory, onBack, onReset }) {
  const { participant, answers, done } = state;
  const r = useMemo(() => scoreAll(answers, done), [answers, done]);
  const overall = useMemo(() => buildOverall(r, participant), [r, participant]);
  const doneTests = TESTS.filter((t) => done[t.id]);

  const exportJSON = () => {
    const blob = new Blob([JSON.stringify({ participant, answers, done, results: r }, null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `hasil-psikotes-${(participant?.name || 'peserta').replace(/\s+/g, '_')}.json`;
    a.click();
    URL.revokeObjectURL(a.href);
  };

  return (
    <div className="results">
      <div className="results-toolbar no-print">
        <button className="btn ghost" onClick={onBack}>
          ← Kembali
        </button>
        <div className="row-gap">
          {onSaveHistory && (
            <button className="btn ghost" onClick={onSaveHistory}>
              💾 Simpan ke Riwayat
            </button>
          )}
          <button className="btn ghost" onClick={exportJSON}>
            ⬇ Export JSON
          </button>
          <button className="btn primary" onClick={() => window.print()}>
            🖨 Cetak / PDF
          </button>
        </div>
      </div>

      <div className="card report-head">
        <div>
          <span className="pill">{isArchived ? 'Arsip Laporan Hasil Psikotes' : 'Laporan Hasil Psikotes'}</span>
          <h1>{participant?.name}</h1>
          <p className="muted">
            {participant?.age} tahun · {participant?.gender}
            {participant?.education && ` · ${participant.education}`}
            {participant?.position && ` · Tujuan: ${participant.position}`}
            {participant?.date && ` · Tanggal: ${new Date(participant.date).toLocaleDateString('id-ID', { dateStyle: 'long' })}`}
          </p>
        </div>
        {overall.fit && (
          <div className={`fit fit-${overall.fit.split(' ')[0].toLowerCase()}`}>
            <small>Rekomendasi umum</small>
            <b>{overall.fit}</b>
          </div>
        )}
      </div>

      <nav className="result-nav no-print">
        <a href="#ringkasan">Ringkasan</a>
        {doneTests.map((t) => (
          <a key={t.id} href={`#${t.id}`}>
            {t.icon} {t.name}
          </a>
        ))}
      </nav>

      <Section id="ringkasan" icon="📋" title="Ringkasan & Kesimpulan" subtitle="Integrasi seluruh hasil tes">
        <div className="summary-cards">
          {r.ist && (
            <div className="summary-card" style={{ '--c': '#6366f1' }}>
              <small>IST</small>
              <b>{r.ist.category}</b>
              <span>IQ ≈ {r.ist.iq}</span>
            </div>
          )}
          {r.disc && (
            <div className="summary-card" style={{ '--c': DISC_PROFILES[r.disc.primary].color }}>
              <small>DISC</small>
              <b>
                {r.disc.primary}
                {r.disc.secondary || ''} — {r.disc.profile.name}
              </b>
              <span>{r.disc.pattern.name}</span>
            </div>
          )}
          {r.papi && (
            <div className="summary-card" style={{ '--c': '#0ea5e9' }}>
              <small>PAPI Kostick</small>
              <b>{r.papi.top.slice(0, 3).map((d) => d.code).join(' · ')}</b>
              <span>aspek tertinggi</span>
            </div>
          )}
          {r.msdt && (
            <div className="summary-card" style={{ '--c': '#10b981' }}>
              <small>MSDT</small>
              <b>{r.msdt.finalStyle.name}</b>
              <span>{r.msdt.effective ? 'Efektif' : 'Kurang efektif'}</span>
            </div>
          )}
          {r.bdi && (
            <div className="summary-card" style={{ '--c': r.bdi.level.color }}>
              <small>BDI</small>
              <b>{r.bdi.level.label}</b>
              <span>Skor {r.bdi.total}/63</span>
            </div>
          )}
          {r.figural && (
            <div className="summary-card" style={{ '--c': '#06b6d4' }}>
              <small>Figural &amp; Spasial</small>
              <b>{r.figural.level.label}</b>
              <span>
                {r.figural.raw}/{r.figural.max} ({pct(r.figural.pct)})
              </span>
            </div>
          )}
        </div>

        <Analysis title="Analisa Terpadu">
          {overall.paras.map((p) => (
            <p key={p.title}>
              <b>{p.title}.</b> {p.text}
            </p>
          ))}
        </Analysis>

        {overall.jobs.length > 0 && (
          <div className="recs" style={{ background: '#eff6ff', borderColor: '#bfdbfe' }}>
            <h4 style={{ color: '#1d4ed8' }}>💼 Rekomendasi Pekerjaan yang Cocok</h4>
            <ul>
              {overall.jobs.map((j) => (
                <li key={j.role}>
                  <b>{j.role}</b> <span className="muted small">— {j.reason}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {overall.recs.length > 0 && (
          <div className="recs">
            <h4>🌱 Rekomendasi Pengembangan</h4>
            <ol>
              {overall.recs.map((x) => (
                <li key={x}>{x}</li>
              ))}
            </ol>
          </div>
        )}

        {doneTests.length < TESTS.length && (
          <div className="alert info no-print">
            Tes yang belum dikerjakan: {TESTS.filter((t) => !done[t.id]).map((t) => t.name).join(', ')}. Analisa akan lebih lengkap setelah semua tes selesai.
          </div>
        )}
      </Section>

      {r.ist && <ISTResult r={r.ist} />}
      {r.disc && <DISCResult r={r.disc} answers={answers.disc} />}
      {r.papi && <PAPIResult r={r.papi} answers={answers.papi} />}
      {r.msdt && <MSDTResult r={r.msdt} answers={answers.msdt} />}
      {r.bdi && <BDIResult r={r.bdi} />}
      {r.figural && <FiguralResult r={r.figural} />}

      <div className="card disclaimer-card">
        <b>Catatan:</b> Butir soal pada aplikasi ini disusun ulang mengikuti format dan konstruk masing-masing alat tes untuk
        keperluan latihan/edukasi, bukan butir resmi yang berhak cipta. Skor dan interpretasi bersifat indikatif dan tidak
        menggantikan asesmen, norma baku, maupun interpretasi oleh psikolog profesional.
      </div>

      <div className="actions no-print">
        <button className="btn ghost danger" onClick={onReset}>
          Hapus semua data &amp; mulai baru
        </button>
      </div>
    </div>
  );
}
