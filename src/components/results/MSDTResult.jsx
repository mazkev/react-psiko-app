import { MSDT_PAIRS, MSDT_BASIC } from '../../data/msdt.js';
import { BarList } from '../Charts.jsx';
import { Section, Analysis, pct } from './ResultPrimitives.jsx';

export default function MSDTResult({ r, answers }) {
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
