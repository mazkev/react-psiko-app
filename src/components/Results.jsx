import { useMemo } from 'react';
import { scoreAll, buildOverall } from '../scoring.js';
import { TESTS } from '../data/tests.js';
import { DISC_GROUPS, DISC_PROFILES } from '../data/disc.js';
import { PAPI_PAIRS } from '../data/papi.js';
import { MSDT_PAIRS, MSDT_BASIC } from '../data/msdt.js';
import { LETTERS } from '../utils.js';
import { BarList, RadarChart, DiscGraph, Gauge } from './Charts.jsx';

const pct = (x) => `${Math.round(x * 100)}%`;

function Section({ id, icon, title, subtitle, children }) {
  return (
    <section id={id} className="card result-section">
      <div className="section-head">
        <span className="section-icon">{icon}</span>
        <div>
          <h2>{title}</h2>
          {subtitle && <p className="muted small">{subtitle}</p>}
        </div>
      </div>
      {children}
    </section>
  );
}

function Analysis({ title = 'Analisa', children }) {
  return (
    <div className="analysis">
      <h4>🔎 {title}</h4>
      {children}
    </div>
  );
}

/* ----------------------------- IST ----------------------------- */
function ISTResult({ r }) {
  return (
    <Section id="ist" icon="🧠" title="IST — Intelligenz Struktur Test" subtitle="Struktur kecerdasan verbal & numerik">
      <div className="kpis">
        <div className="kpi">
          <span>Skor Benar</span>
          <b>
            {r.raw}/{r.max}
          </b>
        </div>
        <div className="kpi">
          <span>Estimasi IQ</span>
          <b>{r.iq}</b>
        </div>
        <div className="kpi">
          <span>Kategori</span>
          <b>{r.category}</b>
        </div>
        <div className="kpi">
          <span>Verbal / Numerik / Logika</span>
          <b>
            {pct(r.verbal)} / {pct(r.numeric)} / {pct(r.logic)}
          </b>
        </div>
      </div>

      <h4>Profil Subtes</h4>
      <BarList
        items={r.subtests.map((s) => ({
          label: `${s.code} · ${s.label}`,
          value: s.raw,
          max: s.max,
          display: `${s.raw}/${s.max}`,
          color: s.pct >= 0.8 ? '#10b981' : s.pct >= 0.6 ? '#0ea5e9' : s.pct >= 0.4 ? '#f59e0b' : '#ef4444',
        }))}
      />

      <Analysis>
        <p>{r.summary}</p>
        <table className="table">
          <thead>
            <tr>
              <th>Subtes</th>
              <th>Aspek yang diukur</th>
              <th>Level</th>
              <th>Interpretasi</th>
            </tr>
          </thead>
          <tbody>
            {r.subtests.map((s) => (
              <tr key={s.code}>
                <td>
                  <b>{s.code}</b>
                  <div className="muted small">{s.label}</div>
                </td>
                <td className="small">{s.measures}</td>
                <td>
                  <span className={`badge ${s.level.tone}`}>{s.level.label}</span>
                </td>
                <td className="small">{s.interpretation}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Analysis>

      <details className="answers">
        <summary>Lihat jawaban & kunci jawaban</summary>
        {r.subtests.map((s) => (
          <div key={s.code} className="answer-group">
            <h5>
              {s.code} — {s.label}
            </h5>
            <table className="table compact">
              <thead>
                <tr>
                  <th>No</th>
                  <th>Soal</th>
                  <th>Jawaban Anda</th>
                  <th>Kunci</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {s.items.map((it, n) => {
                  const fmt = (v) => (s.type === 'mc' ? (v ? `${v}. ${it.options[LETTERS.indexOf(v)]}` : '—') : v ?? '—');
                  return (
                    <tr key={it.id}>
                      <td>{n + 1}</td>
                      <td>{it.q}</td>
                      <td>{fmt(it.given) || '—'}</td>
                      <td>{fmt(s.type === 'mc' ? it.answer : String(it.answer))}</td>
                      <td>{it.correct ? '✅' : '❌'}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ))}
      </details>
      <p className="disclaimer">* Estimasi IQ dihitung secara linier dari persentase jawaban benar dan bukan berdasarkan norma IST resmi.</p>
    </Section>
  );
}

/* ----------------------------- DISC ----------------------------- */
function DISCResult({ r, answers }) {
  const p = r.profile;
  return (
    <Section id="disc" icon="🎯" title="DISC — Gaya Perilaku" subtitle={`Pola: ${r.pattern.name}`}>
      <div className="disc-graphs">
        <DiscGraph title="Grafik I — MOST" subtitle="Mask / perilaku di depan publik" values={r.most} />
        <DiscGraph title="Grafik II — LEAST" subtitle="Core / respons di bawah tekanan" values={r.least} />
        <DiscGraph title="Grafik III — CHANGE" subtitle="Mirror / gambaran diri (P − K)" values={r.change} symmetric />
      </div>

      <div className="disc-type" style={{ '--c': p.color }}>
        <div className="disc-letter">
          {r.primary}
          {r.secondary && <small>{r.secondary}</small>}
        </div>
        <div>
          <h3>
            {p.name}
            {r.secondaryProfile && ` – ${r.secondaryProfile.name}`}
          </h3>
          <p>{p.summary}</p>
        </div>
      </div>

      <Analysis>
        <div className="row-gap" style={{ marginBottom: 10 }}>
          <span><b>Validitas Profil:</b></span>
          <span className={`badge ${r.validity.tone}`}>{r.validity.label}</span>
          <span className="muted small">(Rentang skor: {r.spread})</span>
        </div>
        <p className="muted small">{r.validity.note}</p>
        <p>{r.summary}</p>

        <table className="table compact" style={{ marginBottom: 14 }}>
          <thead>
            <tr>
              <th>Dimensi</th>
              <th>Paling (MOST)</th>
              <th>Paling Tidak (LEAST)</th>
              <th>Selisih (CHANGE)</th>
            </tr>
          </thead>
          <tbody>
            {r.sorted.map((d) => (
              <tr key={d}>
                <td><b>{d}</b> — {DISC_PROFILES[d].name}</td>
                <td>{r.most[d]}</td>
                <td>{r.least[d]}</td>
                <td><b>{r.change[d] > 0 ? `+${r.change[d]}` : r.change[d]}</b></td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="grid-2">
          <div>
            <h5>💪 Kekuatan</h5>
            <ul>
              {p.strengths.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ul>
          </div>
          <div>
            <h5>⚠️ Area Perhatian</h5>
            <ul>
              {p.weaknesses.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ul>
          </div>
        </div>
        <p>
          <b>Gaya komunikasi:</b> {p.communication}
        </p>
        <p>
          <b>Motivator utama:</b> {p.motivator}
        </p>
        <p>
          <b>Menghadapi konflik:</b> {p.conflict}
        </p>
        <p>
          <b>Peran kerja yang cocok (pola {r.pattern.name}):</b> {(r.pattern.jobs || []).join(', ') || p.roles}
        </p>
        <p>
          <b>Lingkungan kerja ideal:</b> {p.environment}
        </p>
        <p>
          <b>Di bawah tekanan:</b> {p.pressure}
        </p>
        <p>
          <b>Saran pengembangan:</b> {p.tips}
        </p>
        <p>
          <b>Konsistensi Mask–Core:</b> {r.consistency}
        </p>
      </Analysis>

      <details className="answers">
        <summary>Lihat jawaban</summary>
        <table className="table compact">
          <thead>
            <tr>
              <th>No</th>
              <th>P (Paling)</th>
              <th>K (Paling Tidak)</th>
            </tr>
          </thead>
          <tbody>
            {DISC_GROUPS.map((g, i) => (
              <tr key={i}>
                <td>{i + 1}</td>
                <td>
                  {g[answers[i]?.most]} <span className="muted">({answers[i]?.most})</span>
                </td>
                <td>
                  {g[answers[i]?.least]} <span className="muted">({answers[i]?.least})</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </details>
    </Section>
  );
}

/* ----------------------------- PAPI ----------------------------- */
function PAPIResult({ r, answers }) {
  const tone = { low: 'warn', mid: 'ok', high: 'good' };
  return (
    <Section id="papi" icon="📊" title="PAPI Kostick — Kebutuhan & Peran Kerja" subtitle="20 aspek, skala 0–9">
      <div className="papi-layout">
        <RadarChart data={r.dims.map((d) => ({ label: d.code, value: d.score }))} max={9} />
        <div>
          <h4>Rata-rata per Area</h4>
          <BarList items={r.areas.map((a) => ({ label: a.area, value: +a.avg.toFixed(1), max: 9, color: '#0ea5e9' }))} />
          <h4>Aspek Tertinggi</h4>
          <div className="chips">
            {r.top.map((d) => (
              <span key={d.code} className="chip good">
                {d.code} · {d.name} ({d.score})
              </span>
            ))}
          </div>
          <h4>Aspek Terendah</h4>
          <div className="chips">
            {r.bottom.map((d) => (
              <span key={d.code} className="chip warn">
                {d.code} · {d.name} ({d.score})
              </span>
            ))}
          </div>
        </div>
      </div>

      <Analysis>
        <p>{r.summary}</p>
        <p>
          <b>Keseimbangan Kebutuhan vs Peran:</b> {r.balanceNote}
        </p>
        <ul>
          {r.notes.map((n) => (
            <li key={n}>{n}</li>
          ))}
        </ul>
        {r.areas.map((a) => (
          <div key={a.area} className="papi-area">
            <h5>{a.area}</h5>
            <table className="table compact">
              <tbody>
                {a.dims.map((d) => (
                  <tr key={d.code}>
                    <td className="papi-code">{d.code}</td>
                    <td style={{ width: '28%' }}>{d.name}</td>
                    <td style={{ width: 70 }}>
                      <b>{d.score}</b>/9
                    </td>
                    <td style={{ width: 80 }}>
                      <span className={`badge ${tone[d.level]}`}>{d.levelLabel}</span>
                    </td>
                    <td className="small">{d.text}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}
      </Analysis>

      <details className="answers">
        <summary>Lihat jawaban</summary>
        <table className="table compact">
          <thead>
            <tr>
              <th>No</th>
              <th>Pernyataan yang dipilih</th>
              <th>Aspek</th>
            </tr>
          </thead>
          <tbody>
            {PAPI_PAIRS.map((p, i) => {
              const c = answers[i] ? p[answers[i]] : null;
              return (
                <tr key={i}>
                  <td>{i + 1}</td>
                  <td>
                    {c ? (
                      <>
                        <b>{answers[i].toUpperCase()}.</b> {c.text}
                      </>
                    ) : (
                      '—'
                    )}
                  </td>
                  <td>{c?.dim}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </details>
    </Section>
  );
}

/* ----------------------------- MSDT ----------------------------- */
function MSDTResult({ r, answers }) {
  const quad = [
    ['related', 'integrated'],
    ['separated', 'dedicated'],
  ];
  return (
    <Section id="msdt" icon="🧭" title="MSDT — Gaya Manajemen" subtitle="Model 3-D Reddin">
      <div className="kpis">
        <div className="kpi">
          <span>Gaya Manajemen</span>
          <b>{r.finalStyle.name}</b>
          <small>{r.finalStyle.id}</small>
        </div>
        <div className="kpi">
          <span>Gaya Dasar</span>
          <b>{r.basic.name}</b>
          <small>{r.basic.id}</small>
        </div>
        <div className="kpi">
          <span>Efektivitas</span>
          <b className={r.effective ? 'text-good' : 'text-bad'}>{r.effective ? 'Efektif' : 'Kurang Efektif'}</b>
          <small>{pct(r.effPct)}</small>
        </div>
      </div>

      <div className="msdt-layout">
        <div>
          <h4>Dimensi</h4>
          <BarList
            items={[
              { label: 'Orientasi Tugas (TO)', value: r.TO, max: r.total, display: pct(r.toPct), color: '#f97316' },
              { label: 'Orientasi Hubungan (RO)', value: r.RO, max: r.total, display: pct(r.roPct), color: '#8b5cf6' },
              { label: 'Efektivitas (E)', value: r.EFF, max: r.total, display: pct(r.effPct), color: '#10b981' },
            ]}
          />
          <h4>Skor Tiap Gaya</h4>
          <BarList
            items={r.styles.map((s) => ({
              label: `${s.name}${s.eff ? '' : ' *'}`,
              value: s.count,
              max: 7,
              color: s.eff ? '#10b981' : '#f87171',
            }))}
          />
          <p className="muted small">* gaya kurang efektif</p>
        </div>
        <div>
          <h4>Kuadran Gaya Dasar</h4>
          <div className="quad">
            <div className="quad-y">Orientasi Hubungan →</div>
            <div className="quad-grid">
              {quad.flat().map((k) => (
                <div key={k} className={`quad-cell ${r.basicKey === k ? 'on' : ''}`}>
                  <b>{MSDT_BASIC[k].name}</b>
                  <small>{MSDT_BASIC[k].id}</small>
                </div>
              ))}
            </div>
            <div className="quad-x">Orientasi Tugas →</div>
          </div>
        </div>
      </div>

      <Analysis>
        <p>{r.summary}</p>
        <p>
          <b>Gaya dasar {r.basic.name}:</b> {r.basic.desc}
        </p>
        <p>
          <b>
            {r.finalStyle.name} ({r.finalStyle.id}):
          </b>{' '}
          {r.finalStyle.desc}
        </p>
        {r.dominant.key !== r.finalStyle.key && (
          <p>
            <b>Kecenderungan tambahan — {r.dominant.name}:</b> {r.dominant.desc}
          </p>
        )}
      </Analysis>

      <details className="answers">
        <summary>Lihat jawaban</summary>
        <table className="table compact">
          <thead>
            <tr>
              <th>No</th>
              <th>Pernyataan yang dipilih</th>
              <th>Gaya</th>
            </tr>
          </thead>
          <tbody>
            {MSDT_PAIRS.map((p, i) => {
              const c = answers[i] ? p[answers[i]] : null;
              return (
                <tr key={i}>
                  <td>{i + 1}</td>
                  <td>
                    {c ? (
                      <>
                        <b>{answers[i].toUpperCase()}.</b> {c.text}
                      </>
                    ) : (
                      '—'
                    )}
                  </td>
                  <td>{c ? r.styles.find((s) => s.key === c.dim).name : ''}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </details>
    </Section>
  );
}

/* ----------------------------- BDI ----------------------------- */
function BDIResult({ r }) {
  return (
    <Section id="bdi" icon="💙" title="BDI — Skrining Suasana Hati" subtitle="Kondisi 2 minggu terakhir">
      {r.riskFlag && (
        <div className="alert danger">
          <b>Perhatian penting:</b> Anda menyatakan memiliki pikiran untuk mengakhiri hidup. Anda tidak sendirian, dan
          bantuan tersedia. Segera hubungi orang yang Anda percaya, psikolog/psikiater, atau layanan darurat
          <b> 112</b> / <b>119 ext. 8</b> (layanan kesehatan jiwa Kemenkes), atau datangi IGD rumah sakit terdekat.
        </div>
      )}
      <div className="bdi-top">
        <Gauge value={r.total} max={63} label={`Tingkat ${r.level.label}`} color={r.level.color} />
        <div className="bdi-scale">
          {[
            ['0–13', 'Minimal', '#10b981'],
            ['14–19', 'Ringan', '#eab308'],
            ['20–28', 'Sedang', '#f97316'],
            ['29–63', 'Berat', '#ef4444'],
          ].map(([range, label, c]) => (
            <div key={label} className={`scale-item ${r.level.label === label ? 'on' : ''}`} style={{ '--c': c }}>
              <b>{label}</b>
              <small>{range}</small>
            </div>
          ))}
        </div>
      </div>

      <h4>Sebaran Gejala</h4>
      <BarList items={r.clusters.map((c) => ({ label: c.label, value: c.score, max: c.max, display: `${c.score}/${c.max}`, color: '#8b5cf6' }))} />

      <Analysis>
        <p>{r.summary}</p>
        <p>{r.level.desc}</p>
        <p>
          <b>Kesiapan & Stabilitas Emosional:</b> {r.readiness}
        </p>
        <p>
          <b>Saran:</b> {r.level.advice}
        </p>
        {r.prominent.length > 0 && (
          <>
            <h5>Gejala yang menonjol (skor ≥ 2)</h5>
            <div className="chips">
              {r.prominent.map((i) => (
                <span key={i.no} className="chip warn">
                  {i.no}. {i.title} ({i.score})
                </span>
              ))}
            </div>
          </>
        )}
      </Analysis>

      <details className="answers">
        <summary>Lihat jawaban</summary>
        <table className="table compact">
          <thead>
            <tr>
              <th>No</th>
              <th>Area</th>
              <th>Pernyataan yang dipilih</th>
              <th>Skor</th>
            </tr>
          </thead>
          <tbody>
            {r.items.map((i) => (
              <tr key={i.no}>
                <td>{i.no}</td>
                <td>{i.title}</td>
                <td>{i.options[i.score]}</td>
                <td>{i.score}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </details>
      <p className="disclaimer">* Hasil ini adalah skrining, bukan diagnosis. Diagnosis hanya dapat ditegakkan oleh tenaga profesional kesehatan mental.</p>
    </Section>
  );
}

/* ----------------------------- MAIN ----------------------------- */
export default function Results({ state, onBack, onReset }) {
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
          <span className="pill">Laporan Hasil Psikotes</span>
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

      <div className="card disclaimer-card">
        <b>Catatan:</b> Butir soal pada aplikasi ini disusun ulang mengikuti format dan konstruk masing-masing alat tes untuk
        keperluan latihan/edukasi, bukan butir resmi yang berhak cipta. Skor dan interpretasi bersifat indikatif dan tidak
        menggantikan asesmen, norma baku, maupun interpretasi oleh psikolog profesional.
      </div>

      <div className="actions no-print">
        <button className="btn ghost danger" onClick={onReset}>
          Hapus semua data & mulai baru
        </button>
      </div>
    </div>
  );
}
