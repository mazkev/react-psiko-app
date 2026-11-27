import { useEffect, useRef, useState } from 'react';
import { BDI_ITEMS } from '../data/bdi.js';
import { TestHeader, QuestionNav, Instruction } from './common.jsx';

export default function BDITest({ answers, onAnswer, onFinish, onExit }) {
  const total = BDI_ITEMS.length;
  const isAnswered = (k) => answers[k] !== undefined;
  const firstOpen = BDI_ITEMS.findIndex((_, k) => !isAnswered(k));
  const [i, setI] = useState(firstOpen === -1 ? 0 : firstOpen);
  const timer = useRef();

  useEffect(() => () => clearTimeout(timer.current), []);
  const answered = BDI_ITEMS.filter((_, k) => isAnswered(k)).length;
  const item = BDI_ITEMS[i];

  const choose = (score) => {
    onAnswer(i, score);
    clearTimeout(timer.current);
    if (i < total - 1) timer.current = setTimeout(() => setI((x) => Math.min(x + 1, total - 1)), 250);
  };

  return (
    <div className="test-page">
      <TestHeader title="BDI — Skrining Suasana Hati" subtitle={`Kelompok ${i + 1} dari ${total}`} answered={answered} total={total} onExit={onExit} />
      <Instruction>
        Bacalah setiap kelompok pernyataan dengan saksama, lalu pilih <b>satu pernyataan</b> yang paling menggambarkan
        perasaan Anda <b>selama dua minggu terakhir, termasuk hari ini</b>. Tidak ada jawaban benar atau salah.
      </Instruction>

      <div className="test-workspace">
        <div className="card">
          <div className="pair-no">
            {i + 1}. {item.title}
          </div>
          <div className="options stack">
            {item.options.map((o, s) => (
              <button key={s} type="button" className={`option block ${answers[i] === s ? 'selected' : ''}`} onClick={() => choose(s)}>
                <span className="radio-dot" /> {o}
              </button>
            ))}
          </div>
          <div className="nav-buttons">
            <button className="btn ghost" disabled={i === 0} onClick={() => setI(i - 1)}>
              ← Sebelumnya
            </button>
            {i < total - 1 ? (
              <button className="btn ghost" disabled={!isAnswered(i)} onClick={() => setI(i + 1)}>
                Berikutnya →
              </button>
            ) : (
              <button className="btn primary" disabled={answered < total} onClick={onFinish}>
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
