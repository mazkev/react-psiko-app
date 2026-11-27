import { useState } from 'react';
import { DISC_GROUPS, DISC_ORDER } from '../data/disc.js';
import { TestHeader, QuestionNav, Instruction } from './common.jsx';

export default function DISCTest({ answers, onAnswer, onFinish, onExit }) {
  const total = DISC_GROUPS.length;
  const isComplete = (i) => answers[i]?.most && answers[i]?.least;
  const firstOpen = DISC_GROUPS.findIndex((_, i) => !isComplete(i));
  const [i, setI] = useState(firstOpen === -1 ? 0 : firstOpen);
  const answered = DISC_GROUPS.filter((_, k) => isComplete(k)).length;
  const ans = answers[i] || {};
  const group = DISC_GROUPS[i];

  const pick = (type, dim) => {
    const next = { ...ans, [type]: dim };
    const other = type === 'most' ? 'least' : 'most';
    if (next[other] === dim) delete next[other];
    onAnswer(i, next);
  };

  return (
    <div className="test-page">
      <TestHeader title="DISC — Gaya Perilaku" subtitle={`Kelompok ${i + 1} dari ${total}`} answered={answered} total={total} onExit={onExit} />
      <Instruction>
        Pada setiap kelompok, pilih <b>satu pernyataan yang PALING (P)</b> menggambarkan diri Anda dan <b>satu pernyataan yang PALING TIDAK (K)</b> menggambarkan diri Anda. Beberapa kelompok berisi 4 pernyataan yang sama-sama baik atau sama-sama berupa tantangan — pilih yang paling jujur dan spontan sesuai keseharian Anda.
      </Instruction>

      <div className="test-workspace">
        <div className="card">
          <table className="disc-table">
            <thead>
              <tr>
                <th>Pernyataan</th>
                <th className="col-m">P (Paling)</th>
                <th className="col-l">K (Paling Tidak)</th>
              </tr>
            </thead>
            <tbody>
              {DISC_ORDER[i].map((dim) => (
                <tr key={dim}>
                  <td className="disc-word">{group[dim]}</td>
                  <td className="col-m">
                    <button type="button" className={`radio m ${ans.most === dim ? 'on' : ''}`} onClick={() => pick('most', dim)} aria-label="Paling">
                      P
                    </button>
                  </td>
                  <td className="col-l">
                    <button type="button" className={`radio l ${ans.least === dim ? 'on' : ''}`} onClick={() => pick('least', dim)} aria-label="Paling tidak">
                      K
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="nav-buttons">
            <button className="btn ghost" disabled={i === 0} onClick={() => setI(i - 1)}>
              ← Sebelumnya
            </button>
            {i < total - 1 ? (
              <button className="btn primary" disabled={!isComplete(i)} onClick={() => setI(i + 1)}>
                Berikutnya →
              </button>
            ) : (
              <button className="btn primary" disabled={answered < total} onClick={onFinish}>
                Selesaikan Tes ✓
              </button>
            )}
          </div>
        </div>

        <QuestionNav total={total} current={i} isAnswered={isComplete} onJump={setI} />
      </div>
      {answered === total && i !== total - 1 && (
        <div className="actions">
          <button className="btn primary lg" onClick={onFinish}>
            Semua terjawab — Selesaikan Tes ✓
          </button>
        </div>
      )}
    </div>
  );
}
