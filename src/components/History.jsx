import { useMemo, useState } from 'react';
import { scoreAll, buildOverall } from '../scoring.js';
import { TESTS } from '../data/tests.js';

const pct = (x) => `${Math.round(x * 100)}%`;

export default function History({ history, onBack, onViewEntry, onDeleteEntry, onClearHistory }) {
  const [selected, setSelected] = useState([]);

  const scored = useMemo(
    () =>
      history.map((h) => {
        const r = scoreAll(h.answers, h.done);
        const overall = buildOverall(r, h.participant);
        const doneCount = TESTS.filter((t) => h.done[t.id]).length;
        return { ...h, r, overall, doneCount };
      }),
    [history]
  );

  const toggle = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : prev.length < 4 ? [...prev, id] : prev
    );
  };

  const compared = scored.filter((s) => selected.includes(s.id));

  return (
    <div className="results">
      <div className="results-toolbar no-print">
        <button className="btn ghost" onClick={onBack}>
          ← Kembali ke Beranda
        </button>
        {history.length > 0 && (
          <button className="btn ghost danger" onClick={onClearHistory}>
            🗑 Hapus Semua Riwayat
          </button>
        )}
      </div>

      <div className="card">
        <span className="pill">Arsip & Komparasi</span>
        <h2>Riwayat Tes & Perbandingan Hasil</h2>
        <p className="muted">
          Simpan hasil sesi tes untuk membandingkan perkembangan antar percobaan atau membandingkan hingga 4 peserta
          secara berdampingan.
        </p>

        {scored.length === 0 ? (
          <div className="alert info">
            Belum ada riwayat tersimpan. Selesaikan minimal 1 tes lalu klik <b>Simpan ke Riwayat</b> di halaman Beranda
            atau Laporan Hasil.
          </div>
        ) : (
          <div className="history-list">
            {scored.map((item) => {
              const isChecked = selected.includes(item.id);
              const { r, overall } = item;
              return (
                <div key={item.id} className={`history-item ${isChecked ? 'selected' : ''}`}>
                  <label className="history-check">
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => toggle(item.id)}
                      disabled={!isChecked && selected.length >= 4}
                    />
                    <span>Bandingkan</span>
                  </label>
                  <div className="history-info">
                    <div className="row-gap">
                      <b>{item.participant?.name || 'Peserta'}</b>
                      <span className="badge ok">{item.doneCount}/{TESTS.length} tes</span>
                      {overall.fit && (
                        <span className={`badge ${overall.fit === 'Disarankan' ? 'good' : overall.fit === 'Dipertimbangkan' ? 'warn' : 'bad'}`}>
                          {overall.fit}
                        </span>
                      )}
                    </div>
                    <div className="muted small">
                      {item.participant?.position ? `${item.participant.position} · ` : ''}
                      Disimpan {new Date(item.savedAt).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' })}
                    </div>
                    <div className="chips" style={{ marginTop: 6 }}>
                      {r.ist && <span className="chip good">IST: IQ ≈ {r.ist.iq} ({r.ist.category})</span>}
                      {r.disc && <span className="chip good">DISC: {r.disc.patternKey} ({r.disc.profile.name})</span>}
                      {r.papi && <span className="chip good">PAPI: {r.papi.top.slice(0, 3).map((d) => d.code).join('·')}</span>}
                      {r.msdt && <span className="chip good">MSDT: {r.msdt.finalStyle.name}</span>}
                      {r.bdi && <span className="chip warn">BDI: {r.bdi.level.label} ({r.bdi.total})</span>}
                    </div>
                  </div>
                  <div className="row-gap">
                    <button className="btn primary sm" onClick={() => onViewEntry(item)}>
                      Lihat Laporan
                    </button>
                    <button className="btn ghost sm danger" onClick={() => onDeleteEntry(item.id)}>
                      Hapus
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {compared.length >= 2 && (
        <div className="card">
          <h3>📊 Perbandingan Hasil ({compared.length} Sesi)</h3>
          <p className="muted small">Centang 2–4 riwayat di atas untuk membandingkan hasilnya secara berdampingan.</p>
          <div style={{ overflowX: 'auto' }}>
            <table className="table">
              <thead>
                <tr>
                  <th>Aspek</th>
                  {compared.map((c) => (
                    <th key={c.id}>
                      <div>{c.participant?.name || 'Peserta'}</div>
                      <div className="muted small" style={{ fontWeight: 500 }}>
                        {new Date(c.savedAt).toLocaleDateString('id-ID')}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><b>Posisi / Tujuan</b></td>
                  {compared.map((c) => (
                    <td key={c.id}>{c.participant?.position || '—'}</td>
                  ))}
                </tr>
                <tr>
                  <td><b>Rekomendasi Umum</b></td>
                  {compared.map((c) => (
                    <td key={c.id}>
                      {c.overall.fit ? (
                        <span className={`badge ${c.overall.fit === 'Disarankan' ? 'good' : c.overall.fit === 'Dipertimbangkan' ? 'warn' : 'bad'}`}>
                          {c.overall.fit}
                        </span>
                      ) : '—'}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td><b>IST (Kecerdasan)</b></td>
                  {compared.map((c) => (
                    <td key={c.id}>
                      {c.r.ist ? (
                        <>
                          <b>IQ ≈ {c.r.ist.iq}</b> ({c.r.ist.category})
                          <div className="muted small">
                            Benar {c.r.ist.raw}/{c.r.ist.max} · V:{pct(c.r.ist.verbal)} N:{pct(c.r.ist.numeric)} L:{pct(c.r.ist.logic)}
                          </div>
                        </>
                      ) : '—'}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td><b>DISC (Perilaku)</b></td>
                  {compared.map((c) => (
                    <td key={c.id}>
                      {c.r.disc ? (
                        <>
                          <b>{c.r.disc.patternKey}</b> — {c.r.disc.pattern.name}
                          <div className="muted small">
                            D:{c.r.disc.change.D} I:{c.r.disc.change.I} S:{c.r.disc.change.S} C:{c.r.disc.change.C} · {c.r.disc.validity.label}
                          </div>
                        </>
                      ) : '—'}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td><b>PAPI Kostick</b></td>
                  {compared.map((c) => (
                    <td key={c.id}>
                      {c.r.papi ? (
                        <>
                          <b>Top:</b> {c.r.papi.top.slice(0, 3).map((d) => `${d.code}(${d.score})`).join(', ')}
                          <div className="muted small">
                            Kebutuhan {c.r.papi.needAvg} · Peran {c.r.papi.roleAvg}
                          </div>
                        </>
                      ) : '—'}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td><b>MSDT (Manajemen)</b></td>
                  {compared.map((c) => (
                    <td key={c.id}>
                      {c.r.msdt ? (
                        <>
                          <b>{c.r.msdt.finalStyle.name}</b> ({c.r.msdt.basic.name})
                          <div className="muted small">
                            {c.r.msdt.effective ? 'Efektif' : 'Kurang Efektif'} ({pct(c.r.msdt.effPct)})
                          </div>
                        </>
                      ) : '—'}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td><b>BDI (Suasana Hati)</b></td>
                  {compared.map((c) => (
                    <td key={c.id}>
                      {c.r.bdi ? (
                        <>
                          <b>{c.r.bdi.level.label}</b> (Skor {c.r.bdi.total}/63)
                          <div className="muted small">{c.r.bdi.riskFlag ? '⚠️ Indikasi butir kritis' : 'Normal / stabil'}</div>
                        </>
                      ) : '—'}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td><b>Pekerjaan Cocok</b></td>
                  {compared.map((c) => (
                    <td key={c.id} className="small">
                      {c.overall.jobs?.length ? c.overall.jobs.slice(0, 3).map((j) => j.role).join(', ') : '—'}
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
