import { useEffect, useState } from 'react';
import { FIGURAL_ITEMS, FIGURAL_SECONDS } from '../data/figural.js';
import { LETTERS, formatTime } from '../utils.js';
import { TestHeader, QuestionNav, Instruction } from './common.jsx';
import FiguralSvg from './FiguralSvg.jsx';

export default function FiguralTest({ answers, savedTime, onTickTime, onAnswer, onFinish, onExit }) {
  const total = FIGURAL_ITEMS.length;
  const isAnswered = (k) => !!answers[FIGURAL_ITEMS[k].id];
  const firstOpen = FIGURAL_ITEMS.findIndex((_, k) => !isAnswered(k));
  const [i, setI] = useState(firstOpen === -1 ? 0 : firstOpen);
  const [timeLeft, setTimeLeft] = useState(() => (typeof savedTime === 'number' && savedTime > 0 ? savedTime : FIGURAL_SECONDS));

  useEffect(() => {
    onTickTime?.('figural', timeLeft);
    if (timeLeft <= 0) {
      onFinish();
      return;
    }
    const t = setTimeout(() => setTimeLeft((x) => x - 1), 1000);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeLeft]);

  const item = FIGURAL_ITEMS[i];
  const answered = FIGURAL_ITEMS.filter((_, k) => isAnswered(k)).length;

  return (
    <div className="test-page">
      <TestHeader
        title="Tes Figural & Spasial"
        subtitle={`Soal ${i + 1} dari ${total} · Kategori: ${item.category}`}
        answered={answered}
        total={total}
        onExit={onExit}
        right={<span className={`timer ${timeLeft <= 60 ? 'danger' : ''}`}>⏱ {formatTime(timeLeft)}</span>}
      />
      <Instruction>
        Amati pola rotasi, pencerminan, deret bangun, analogi, atau matriks pada gambar, lalu pilih satu jawaban gambar (<b>a–e</b>) yang paling tepat.
      </Instruction>

      <div className="test-workspace">
        <div className="card">
          <div className="row-gap" style={{ justifyContent: 'space-between', marginBottom: 10 }}>
            <span className="pair-no" style={{ margin: 0 }}>Nomor {i + 1}</span>
            <span className="pill" style={{ margin: 0 }}>{item.category}</span>
          </div>
          <p className="q-text">{item.q}</p>
          {item.svg && <FiguralSvg spec={item.svg} />}
          <div className="options inline">
            {item.options.map((o, idx) => (
              <button
                key={idx}
                type="button"
                className={`option figural ${answers[item.id] === LETTERS[idx] ? 'selected' : ''}`}
                onClick={() => onAnswer(item.id, LETTERS[idx])}
              >
                <b>{LETTERS[idx]}.</b>
                <FiguralSvg spec={o.svg} />
              </button>
            ))}
          </div>

          <div className="nav-buttons">
            <button className="btn ghost" disabled={i === 0} onClick={() => setI(i - 1)}>
              ← Sebelumnya
            </button>
            {i < total - 1 ? (
              <button className="btn primary" onClick={() => setI(i + 1)}>
                Berikutnya →
              </button>
            ) : (
              <button
                className="btn primary"
                onClick={() => {
                  const empty = total - answered;
                  if (!empty || window.confirm(`Masih ada ${empty} soal kosong. Selesaikan tes sekarang?`)) onFinish();
                }}
              >
                Selesaikan Tes ✓
              </button>
            )}
          </div>
        </div>

        <QuestionNav total={total} current={i} isAnswered={isAnswered} onJump={setI} />
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
