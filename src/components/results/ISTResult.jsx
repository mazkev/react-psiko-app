import { LETTERS } from '../../utils.js';
import { BarList } from '../Charts.jsx';
import { Section, Analysis, pct } from './ResultPrimitives.jsx';

export default function ISTResult({ r }) {
  return (
    <Section id="ist" icon="🧠" title="IST — Intelligenz Struktur Test" subtitle="Struktur kecerdasan verbal, numerik, logika & figural">
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
          <span>Verbal / Numerik / Logika / Figural</span>
          <b>
            {pct(r.verbal)} / {pct(r.numeric)} / {pct(r.logic)} / {pct(r.figural)}
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
        <summary>Lihat jawaban &amp; kunci jawaban</summary>
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
                  const fmt = (v) => {
                    if (s.type === 'mc') return v ? `${v}. ${it.options[LETTERS.indexOf(v)]}` : '—';
                    if (s.type === 'figural') return v ? `${v}. ${it.options[LETTERS.indexOf(v)]?.label}` : '—';
                    return v ?? '—';
                  };
                  return (
                    <tr key={it.id}>
                      <td>{n + 1}</td>
                      <td>{it.q}</td>
                      <td>{fmt(it.given) || '—'}</td>
                      <td>{fmt(s.type === 'mc' || s.type === 'figural' ? it.answer : String(it.answer))}</td>
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
