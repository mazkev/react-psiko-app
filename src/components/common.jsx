export function ProgressBar({ value, max, color }) {
  const pct = max ? Math.round((value / max) * 100) : 0;
  return (
    <div className="progress">
      <div className="progress-fill" style={{ width: `${pct}%`, background: color }} />
    </div>
  );
}

export function TestHeader({ title, subtitle, answered, total, onExit, right }) {
  return (
    <div className="test-header card">
      <div className="test-header-top">
        <div>
          <h2>{title}</h2>
          {subtitle && <p className="muted small">{subtitle}</p>}
        </div>
        <div className="row-gap">
          {right}
          <button className="btn ghost sm" onClick={onExit}>
            ✕ Keluar
          </button>
        </div>
      </div>
      {total != null && (
        <>
          <ProgressBar value={answered} max={total} />
          <div className="muted small">
            {answered} dari {total} terjawab
          </div>
        </>
      )}
    </div>
  );
}

export function QuestionNav({ total, current, isAnswered, onJump }) {
  return (
    <div className="qnav">
      {Array.from({ length: total }, (_, i) => (
        <button
          key={i}
          className={`qnav-item ${i === current ? 'current' : ''} ${isAnswered(i) ? 'answered' : ''}`}
          onClick={() => onJump(i)}
          type="button"
        >
          {i + 1}
        </button>
      ))}
    </div>
  );
}

export function Instruction({ children }) {
  return <div className="instruction">ℹ️ {children}</div>;
}
