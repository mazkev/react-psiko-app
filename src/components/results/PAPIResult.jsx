import { PAPI_PAIRS } from '../../data/papi.js';
import { BarList, RadarChart } from '../Charts.jsx';
import { Section, Analysis } from './ResultPrimitives.jsx';

export default function PAPIResult({ r, answers }) {
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
