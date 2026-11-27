import { BarList, Gauge } from '../Charts.jsx';
import { Section, Analysis } from './ResultPrimitives.jsx';

export default function BDIResult({ r }) {
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
          <b>Kesiapan &amp; Stabilitas Emosional:</b> {r.readiness}
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
