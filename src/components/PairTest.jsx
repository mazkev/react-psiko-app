import { useEffect, useRef, useState } from 'react';
import { TestHeader, QuestionNav, Instruction } from './common.jsx';

const TITLES = {
  papi: 'PAPI Kostick — Kebutuhan & Peran Kerja',
  msdt: 'MSDT — Gaya Manajemen',
};

export default function PairTest({ testId, pairs, instruction, answers, onAnswer, onFinish, onExit }) {
  const total = pairs.length;
  const isAnswered = (k) => answers[k] === 'a' || answers[k] === 'b';
  const firstOpen = pairs.findIndex((_, k) => !isAnswered(k));
  const [i, setI] = useState(firstOpen === -1 ? 0 : firstOpen);
  const timer = useRef();

  useEffect(() => () => clearTimeout(timer.current), []);
  const answered = pairs.filter((_, k) => isAnswered(k)).length;
  const p = pairs[i];

  const choose = (side) => {
    onAnswer(i, side);
    clearTimeout(timer.current);
    if (i < total - 1) timer.current = setTimeout(() => setI((x) => Math.min(x + 1, total - 1)), 250);
  };

  return (
    <div className="test-page">
      <TestHeader title={TITLES[testId]} subtitle={`Soal ${i + 1} dari ${total}`} answered={answered} total={total} onExit={onExit} />
      <Instruction>{instruction}</Instruction>

      <div className="test-workspace">
        <div className="card">
          <div className="pair-no">Nomor {i + 1}</div>
          <div className="pair-options">
            {['a', 'b'].map((side) => (
              <button key={side} type="button" className={`pair-option ${answers[i] === side ? 'selected' : ''}`} onClick={() => choose(side)}>
                <span className="pair-letter">{side.toUpperCase()}</span>
                <span>{p[side].text}</span>
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
