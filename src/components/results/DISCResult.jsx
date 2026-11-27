import { DISC_GROUPS, DISC_PROFILES } from '../../data/disc.js';
import { DiscGraph } from '../Charts.jsx';
import { Section, Analysis } from './ResultPrimitives.jsx';

export default function DISCResult({ r, answers }) {
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
        <p><b>Gaya komunikasi:</b> {p.communication}</p>
        <p><b>Motivator utama:</b> {p.motivator}</p>
        <p><b>Menghadapi konflik:</b> {p.conflict}</p>
        <p><b>Peran kerja yang cocok (pola {r.pattern.name}):</b> {(r.pattern.jobs || []).join(', ') || p.roles}</p>
        <p><b>Lingkungan kerja ideal:</b> {p.environment}</p>
        <p><b>Di bawah tekanan:</b> {p.pressure}</p>
        <p><b>Saran pengembangan:</b> {p.tips}</p>
        <p><b>Konsistensi Mask–Core:</b> {r.consistency}</p>
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
