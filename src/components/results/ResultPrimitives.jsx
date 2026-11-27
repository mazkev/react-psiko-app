export const pct = (x) => `${Math.round(x * 100)}%`;

export function Section({ id, icon, title, subtitle, children }) {
  return (
    <section id={id} className="card result-section">
      <div className="section-head">
        <span className="section-icon">{icon}</span>
        <div>
          <h2>{title}</h2>
          {subtitle && <p className="muted small">{subtitle}</p>}
        </div>
      </div>
      {children}
    </section>
  );
}

export function Analysis({ title = 'Analisa', children }) {
  return (
    <div className="analysis">
      <h4>🔎 {title}</h4>
      {children}
    </div>
  );
}
