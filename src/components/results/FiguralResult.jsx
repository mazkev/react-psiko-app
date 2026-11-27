import { LETTERS } from '../../utils.js';
import { BarList } from '../Charts.jsx';
import { Section, Analysis, pct } from './ResultPrimitives.jsx';

export default function FiguralResult({ r }) {
  return (
    <Section id="figural" icon="🔷" title="Figural & Spasial" subtitle="Penalaran gambar, rotasi, refleksi & matriks">
      <div className="kpis">
        <div className="kpi">
          <span>Skor Benar</span>
          <b>
            {r.raw}/{r.max}
          </b>
        </div>
        <div className="kpi">
          <span>Persentase</span>
          <b>{pct(r.pct)}</b>
        </div>
        <div className="kpi">
          <span>Kategori</span>
          <b>{r.level.label}</b>
        </div>
      </div>

      <h4>Profil per Kategori</h4>
      <BarList
        items={r.categories.map((c) => ({
          label: c.name,
          value: c.raw,
          max: c.max,
          display: `${c.raw}/${c.max}`,
          color: c.pct >= 0.8 ? '#10b981' : c.pct >= 0.6 ? '#06b6d4' : '#f59e0b',
        }))}
      />

      <Analysis>
        <p>{r.summary}</p>
      </Analysis>

      <details className="answers">
        <summary>Lihat jawaban &amp; kunci jawaban</summary>
        <table className="table compact">
          <thead>
            <tr>
              <th>No</th>
              <th>Kategori</th>
              <th>Soal</th>
              <th>Jawaban Anda</th>
              <th>Kunci</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {r.items.map((it, n) => {
              const fmt = (v) => (v ? `${v}. ${it.options[LETTERS.indexOf(v)]?.label}` : '—');
              return (
                <tr key={it.id}>
                  <td>{n + 1}</td>
                  <td>{it.category}</td>
                  <td>{it.q}</td>
                  <td>{fmt(it.given)}</td>
                  <td>{fmt(it.answer)}</td>
                  <td>{it.correct ? '✅' : '❌'}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </details>
    </Section>
  );
}
