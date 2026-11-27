import { useEffect, useState } from 'react';
import { IST_SUBTESTS, IST_TOTAL_ITEMS } from '../data/ist.js';
import { LETTERS, formatTime } from '../utils.js';
import { TestHeader, Instruction } from './common.jsx';
import FiguralSvg from './FiguralSvg.jsx';

export default function ISTTest({ answers, onAnswer, onFinish, onExit }) {
  // Saat melanjutkan, mulai dari subtes pertama yang belum dijawab penuh
  const [idx, setIdx] = useState(() => {
    const k = IST_SUBTESTS.findIndex((s) => s.items.some((it) => !answers[it.id]));
    return k === -1 ? 0 : k;
  });
  const [phase, setPhase] = useState('intro'); // intro | test
  const [timeLeft, setTimeLeft] = useState(0);
  const st = IST_SUBTESTS[idx];
  const isLast = idx === IST_SUBTESTS.length - 1;
  const answered = Object.values(answers).filter((v) => v !== '' && v != null).length;

  const next = () => {
    if (isLast) onFinish();
    else {
      setIdx(idx + 1);
      setPhase('intro');
      window.scrollTo(0, 0);
    }
  };

  useEffect(() => {
    if (phase !== 'test') return;
    if (timeLeft <= 0) {
      next();
      return;
    }
    const t = setTimeout(() => setTimeLeft((x) => x - 1), 1000);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, timeLeft]);

  const start = () => {
    setTimeLeft(st.seconds);
    setPhase('test');
    window.scrollTo(0, 0);
  };

  const steps = (
    <div className="steps">
      {IST_SUBTESTS.map((s, i) => (
        <span key={s.code} className={`step ${i === idx ? 'current' : i < idx ? 'past' : ''}`}>
          {s.code}
        </span>
      ))}
    </div>
  );

  if (phase === 'intro') {
    return (
      <div className="test-page">
        <TestHeader title="IST — Intelligenz Struktur Test" subtitle={`Subtes ${idx + 1} dari ${IST_SUBTESTS.length}`} answered={answered} total={IST_TOTAL_ITEMS} onExit={onExit} />
        {steps}
        <div className="card">
          <span className="pill">Subtes {st.code}</span>
          <h2>{st.label}</h2>
          <p className="muted">Mengukur: {st.measures}</p>
          <Instruction>{st.instruction}</Instruction>
          <div className="example">
            <strong>Contoh:</strong>
            <p>{st.example.q}</p>
            {st.example.svg && <FiguralSvg spec={st.example.svg} />}
            {st.example.options && (
              <div className="options inline">
                {st.example.options.map((o, i) => (
                  <span key={i} className={`option static ${st.type === 'figural' ? 'figural' : ''} ${LETTERS[i] === st.example.answer ? 'selected' : ''}`}>
                    <b>{LETTERS[i]}.</b>{' '}
                    {st.type === 'figural' ? <FiguralSvg spec={o.svg} size="sm" /> : o}
                  </span>
                ))}
              </div>
            )}
            <p className="muted small">{st.example.note}</p>
          </div>
          <p>
            ⏱ Waktu pengerjaan: <b>{Math.round(st.seconds / 60)} menit</b> untuk {st.items.length} soal. Ketika waktu
            habis, subtes otomatis berpindah ke subtes berikutnya.
          </p>
          <button className="btn primary lg" onClick={start}>
            Mulai Subtes {st.code} →
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="test-page">
      <TestHeader
        title={`IST · ${st.code} — ${st.label}`}
        subtitle={st.instruction}
        answered={answered}
        total={IST_TOTAL_ITEMS}
        onExit={onExit}
        right={<span className={`timer ${timeLeft <= 30 ? 'danger' : ''}`}>⏱ {formatTime(timeLeft)}</span>}
      />
      {steps}
      {st.items.map((it, n) => (
        <div className="card question" key={it.id}>
          <div className="q-no">{n + 1}</div>
          <div className="q-body">
            <p className="q-text">{it.q}</p>
            {it.svg && <FiguralSvg spec={it.svg} />}
            {st.type === 'mc' || st.type === 'figural' ? (
              <div className="options inline">
                {it.options.map((o, i) => (
                  <button
                    key={i}
                    type="button"
                    className={`option ${st.type === 'figural' ? 'figural' : ''} ${answers[it.id] === LETTERS[i] ? 'selected' : ''}`}
                    onClick={() => onAnswer(it.id, LETTERS[i])}
                  >
                    <b>{LETTERS[i]}.</b>{' '}
                    {st.type === 'figural' ? <FiguralSvg spec={o.svg} /> : o}
                  </button>
                ))}
              </div>
            ) : (
              <input
                className="num-input"
                inputMode="decimal"
                placeholder="Jawaban (angka)"
                value={answers[it.id] ?? ''}
                onChange={(e) => onAnswer(it.id, e.target.value.replace(/[^0-9.,-]/g, ''))}
              />
            )}
          </div>
        </div>
      ))}
      <div className="actions">
        <button
          className="btn primary lg"
          onClick={() => {
            const empty = st.items.filter((it) => !answers[it.id]).length;
            if (!empty || window.confirm(`Masih ada ${empty} soal kosong di subtes ini. Lanjutkan?`)) next();
          }}
        >
          {isLast ? 'Selesaikan Tes IST ✓' : 'Lanjut ke Subtes Berikutnya →'}
        </button>
      </div>
    </div>
  );
}
