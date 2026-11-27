export function BarList({ items, max }) {
  return (
    <div className="barlist">
      {items.map((it) => {
        const m = it.max ?? max;
        const pct = Math.max(0, Math.min(100, (it.value / m) * 100));
        return (
          <div className="bar-row" key={it.label}>
            <div className="bar-label" title={it.title || it.label}>
              {it.label}
            </div>
            <div className="bar-track">
              <div className="bar-fill" style={{ width: `${pct}%`, background: it.color || 'var(--primary)' }} />
            </div>
            <div className="bar-value">{it.display ?? it.value}</div>
          </div>
        );
      })}
    </div>
  );
}

export function RadarChart({ data, max, size = 380, color = '#0ea5e9' }) {
  const cx = size / 2;
  const cy = size / 2;
  const r = size / 2 - 42;
  const n = data.length;
  const pt = (i, v) => {
    const ang = -Math.PI / 2 + (i * 2 * Math.PI) / n;
    const rr = (r * v) / max;
    return [cx + rr * Math.cos(ang), cy + rr * Math.sin(ang)];
  };
  const rings = [0.25, 0.5, 0.75, 1];
  const poly = data.map((d, i) => pt(i, d.value).join(',')).join(' ');

  return (
    <svg viewBox={`0 0 ${size} ${size}`} className="radar">
      {rings.map((k) => (
        <polygon key={k} points={data.map((_, i) => pt(i, max * k).join(',')).join(' ')} className="radar-ring" />
      ))}
      {data.map((_, i) => {
        const [x, y] = pt(i, max);
        return <line key={i} x1={cx} y1={cy} x2={x} y2={y} className="radar-axis" />;
      })}
      <polygon points={poly} fill={color} fillOpacity="0.25" stroke={color} strokeWidth="2" />
      {data.map((d, i) => {
        const [x, y] = pt(i, d.value);
        return <circle key={i} cx={x} cy={y} r="3.5" fill={color} />;
      })}
      {data.map((d, i) => {
        const [x, y] = pt(i, max * 1.13);
        return (
          <text key={d.label} x={x} y={y} className="radar-label" textAnchor="middle" dominantBaseline="middle">
            {d.label}
          </text>
        );
      })}
    </svg>
  );
}

const DISC_COLORS = { D: '#ef4444', I: '#f59e0b', S: '#10b981', C: '#3b82f6' };

export function DiscGraph({ title, subtitle, values, symmetric }) {
  const dims = ['D', 'I', 'S', 'C'];
  const absMax = Math.max(8, ...dims.map((d) => Math.abs(values[d])));
  const lo = symmetric ? -absMax : 0;
  const hi = absMax;
  const W = 220;
  const H = 220;
  const pad = { l: 28, r: 12, t: 14, b: 26 };
  const x = (i) => pad.l + ((i + 0.5) * (W - pad.l - pad.r)) / 4;
  const y = (v) => pad.t + ((hi - v) * (H - pad.t - pad.b)) / (hi - lo);
  const pts = dims.map((d, i) => [x(i), y(values[d])]);

  return (
    <div className="disc-graph">
      <div className="disc-graph-title">{title}</div>
      <div className="muted small">{subtitle}</div>
      <svg viewBox={`0 0 ${W} ${H}`}>
        {[lo, (lo + hi) / 2, hi].map((v) => (
          <g key={v}>
            <line x1={pad.l} x2={W - pad.r} y1={y(v)} y2={y(v)} className="grid-line" />
            <text x={pad.l - 6} y={y(v)} className="axis-text" textAnchor="end" dominantBaseline="middle">
              {Math.round(v)}
            </text>
          </g>
        ))}
        {symmetric && <line x1={pad.l} x2={W - pad.r} y1={y(0)} y2={y(0)} className="zero-line" />}
        <polyline points={pts.map((p) => p.join(',')).join(' ')} fill="none" stroke="#334155" strokeWidth="2" />
        {dims.map((d, i) => (
          <g key={d}>
            <circle cx={pts[i][0]} cy={pts[i][1]} r="6" fill={DISC_COLORS[d]} />
            <text x={pts[i][0]} y={pts[i][1] - 11} textAnchor="middle" className="point-text">
              {values[d]}
            </text>
            <text x={x(i)} y={H - 8} textAnchor="middle" className="dim-text" fill={DISC_COLORS[d]}>
              {d}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}

export function Gauge({ value, max, label, color }) {
  const pct = Math.min(1, value / max);
  const R = 70;
  const C = Math.PI * R;
  return (
    <div className="gauge">
      <svg viewBox="0 0 180 110">
        <path d="M20 95 A70 70 0 0 1 160 95" className="gauge-bg" />
        <path d="M20 95 A70 70 0 0 1 160 95" stroke={color} className="gauge-fg" strokeDasharray={`${C * pct} ${C}`} />
        <text x="90" y="80" textAnchor="middle" className="gauge-value">
          {value}
        </text>
        <text x="90" y="102" textAnchor="middle" className="gauge-label">
          {label}
        </text>
      </svg>
    </div>
  );
}
