// Komponen SVG untuk subtes IST Figural/Spasial (FA).
// Mendukung render stimulus soal ('series', 'mirror', 'analogy', 'pieces') dan opsi bentuk ('shape').

function Shape({ s, cx = 32, cy = 32 }) {
  const {
    kind = 'square',
    fill = 'none',
    stroke = '#1e293b',
    rot = 0,
    scale = 1,
    dot,
    inner,
  } = s;

  const color = fill === 'solid' ? '#4f46e5' : fill === 'accent' ? '#0ea5e9' : 'none';
  const strokeColor = fill === 'solid' ? '#312e81' : stroke;

  let el = null;
  if (kind === 'square') {
    el = <rect x={-18} y={-18} width={36} height={36} rx={3} fill={color} stroke={strokeColor} strokeWidth="2.5" />;
  } else if (kind === 'circle') {
    el = <circle cx={0} cy={0} r={18} fill={color} stroke={strokeColor} strokeWidth="2.5" />;
  } else if (kind === 'triangle') {
    el = <polygon points="0,-20 19,15 -19,15" fill={color} stroke={strokeColor} strokeWidth="2.5" strokeLinejoin="round" />;
  } else if (kind === 'diamond') {
    el = <polygon points="0,-20 18,0 0,20 -18,0" fill={color} stroke={strokeColor} strokeWidth="2.5" strokeLinejoin="round" />;
  } else if (kind === 'pentagon') {
    el = <polygon points="0,-20 19,-6 12,17 -12,17 -19,-6" fill={color} stroke={strokeColor} strokeWidth="2.5" strokeLinejoin="round" />;
  } else if (kind === 'arrow') {
    // Panah menunjuk ke atas pada rot=0
    el = (
      <g>
        <line x1="0" y1="16" x2="0" y2="-12" stroke="#4f46e5" strokeWidth="3.5" strokeLinecap="round" />
        <polyline points="-9,-4 0,-15 9,-4" fill="none" stroke="#4f46e5" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
        {dot && <circle cx={dot[0]} cy={dot[1]} r="4" fill="#ef4444" />}
      </g>
    );
  } else if (kind === 'flag') {
    // Bentuk asimetris untuk soal pencerminan (tiang di kiri, bendera di kanan atas, kaki di kanan bawah)
    el = (
      <g>
        <line x1="-10" y1="-18" x2="-10" y2="18" stroke="#1e293b" strokeWidth="3" strokeLinecap="round" />
        <polygon points="-10,-18 14,-10 -10,-2" fill="#4f46e5" stroke="#312e81" strokeWidth="2" />
        <circle cx="6" cy="12" r="4.5" fill="#0ea5e9" />
      </g>
    );
  } else if (kind === 'flag-flip') {
    el = (
      <g transform="scale(-1, 1)">
        <line x1="-10" y1="-18" x2="-10" y2="18" stroke="#1e293b" strokeWidth="3" strokeLinecap="round" />
        <polygon points="-10,-18 14,-10 -10,-2" fill="#4f46e5" stroke="#312e81" strokeWidth="2" />
        <circle cx="6" cy="12" r="4.5" fill="#0ea5e9" />
      </g>
    );
  } else if (kind === 'flag-flip-v') {
    el = (
      <g transform="scale(1, -1)">
        <line x1="-10" y1="-18" x2="-10" y2="18" stroke="#1e293b" strokeWidth="3" strokeLinecap="round" />
        <polygon points="-10,-18 14,-10 -10,-2" fill="#4f46e5" stroke="#312e81" strokeWidth="2" />
        <circle cx="6" cy="12" r="4.5" fill="#0ea5e9" />
      </g>
    );
  } else if (kind === 'grid-dots') {
    // 1..4 titik di sudut-sudut kotak
    const coords = [
      [-10, -10],
      [10, -10],
      [10, 10],
      [-10, 10],
    ];
    el = (
      <g>
        <rect x={-19} y={-19} width={38} height={38} rx={4} fill="none" stroke="#94a3b8" strokeWidth="2" />
        {coords.slice(0, s.count || 1).map(([x, y], idx) => (
          <circle key={idx} cx={x} cy={y} r="4.5" fill={s.dotColor || '#4f46e5'} />
        ))}
      </g>
    );
  } else if (kind === 'lshape') {
    el = (
      <path
        d="M-14,-16 H-2 V6 H14 V18 H-14 Z"
        fill="#e0e7ff"
        stroke="#4f46e5"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
    );
  } else if (kind === 'house') {
    // Gabungan persegi + segitiga atap
    el = (
      <g>
        <polygon points="0,-20 18,-2 -18,-2" fill="#e0e7ff" stroke="#4f46e5" strokeWidth="2.2" strokeLinejoin="round" />
        <rect x={-14} y={-2} width={28} height={20} fill="#e0e7ff" stroke="#4f46e5" strokeWidth="2.2" />
      </g>
    );
  } else if (kind === 'rect') {
    el = <rect x={-20} y={-12} width={40} height={24} rx={2} fill="#e0e7ff" stroke="#4f46e5" strokeWidth="2.2" />;
  } else if (kind === 'octagon') {
    el = (
      <polygon
        points="-8,-19 8,-19 19,-8 19,8 8,19 -8,19 -19,8 -19,-8"
        fill="#e0e7ff"
        stroke="#4f46e5"
        strokeWidth="2.2"
      />
    );
  } else if (kind === 'hexagon') {
    el = (
      <polygon
        points="0,-20 17,-10 17,10 0,20 -17,10 -17,-10"
        fill={color}
        stroke={strokeColor}
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
    );
  } else if (kind === 'cross') {
    el = (
      <path
        d="M-6,-18 H6 V-6 H18 V6 H6 V18 H-6 V6 H-18 V-6 H-6 Z"
        fill={color === 'none' ? '#e0e7ff' : color}
        stroke={strokeColor}
        strokeWidth="2.2"
        strokeLinejoin="round"
      />
    );
  } else if (kind === 'tshape') {
    el = (
      <path
        d="M-16,-16 H16 V-6 H5 V18 H-5 V-6 H-16 Z"
        fill="#e0e7ff"
        stroke="#4f46e5"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
    );
  } else if (kind === 'corner-dot') {
    // Kotak dengan 1 titik di sudut kanan atas pada rot=0
    el = (
      <g>
        <rect x={-18} y={-18} width={36} height={36} rx={4} fill="none" stroke="#1e293b" strokeWidth="2.2" />
        <circle cx={10} cy={-10} r="5" fill="#4f46e5" />
      </g>
    );
  } else if (kind === 'half-circle') {
    el = (
      <path
        d="M-18,4 A18,18 0 0,1 18,4 Z"
        fill={color === 'none' ? '#e0e7ff' : color}
        stroke="#4f46e5"
        strokeWidth="2.4"
        strokeLinejoin="round"
      />
    );
  } else if (kind === 'two-rects') {
    // Dua persegi panjang membentuk T/sudut untuk soal gabungan
    el = (
      <g>
        <rect x={-18} y={-14} width={36} height={12} fill="#e0e7ff" stroke="#4f46e5" strokeWidth="2.2" />
        <rect x={-6} y={-2} width={12} height={18} fill="#e0e7ff" stroke="#4f46e5" strokeWidth="2.2" />
      </g>
    );
  }

  return (
    <g transform={`translate(${cx}, ${cy}) rotate(${rot}) scale(${scale})`}>
      {el}
      {inner === 'dot' && <circle cx={0} cy={0} r="4" fill="#ef4444" />}
    </g>
  );
}

export default function FiguralSvg({ spec, size = 'stimulus' }) {
  if (!spec) return null;

  if (spec.mode === 'shape') {
    return (
      <svg viewBox="0 0 64 64" width={size === 'sm' ? 44 : 56} height={size === 'sm' ? 44 : 56} className="figural-opt">
        <Shape s={spec} cx={32} cy={32} />
      </svg>
    );
  }

  if (spec.mode === 'series') {
    const n = spec.steps.length;
    const w = (n + 1) * 68;
    return (
      <svg viewBox={`0 0 ${w} 68`} className="figural-stimulus" style={{ maxWidth: w }}>
        {spec.steps.map((st, idx) => (
          <g key={idx}>
            <rect x={idx * 68 + 4} y={4} width={60} height={60} rx={10} fill="#f8fafc" stroke="#cbd5e1" strokeWidth="1.5" />
            <Shape s={st} cx={idx * 68 + 34} cy={34} />
          </g>
        ))}
        <rect x={n * 68 + 4} y={4} width={60} height={60} rx={10} fill="#eef2ff" stroke="#6366f1" strokeWidth="2" strokeDasharray="4 3" />
        <text x={n * 68 + 34} y={41} textAnchor="middle" fontSize="22" fontWeight="800" fill="#4f46e5">
          ?
        </text>
      </svg>
    );
  }

  if (spec.mode === 'mirror') {
    return (
      <svg viewBox="0 0 180 72" className="figural-stimulus" style={{ maxWidth: 210 }}>
        <rect x={6} y={6} width={60} height={60} rx={10} fill="#f8fafc" stroke="#cbd5e1" strokeWidth="1.5" />
        <Shape s={spec.source} cx={36} cy={36} />
        <line x1="90" y1="6" x2="90" y2="66" stroke="#ef4444" strokeWidth="2.5" strokeDasharray="5 4" />
        <rect x={114} y={6} width={60} height={60} rx={10} fill="#eef2ff" stroke="#6366f1" strokeWidth="2" strokeDasharray="4 3" />
        <text x={144} y={43} textAnchor="middle" fontSize="22" fontWeight="800" fill="#4f46e5">
          ?
        </text>
      </svg>
    );
  }

  if (spec.mode === 'analogy') {
    // A : B = C : ?
    return (
      <svg viewBox="0 0 300 72" className="figural-stimulus" style={{ maxWidth: 320 }}>
        <rect x={4} y={6} width={60} height={60} rx={10} fill="#f8fafc" stroke="#cbd5e1" strokeWidth="1.5" />
        <Shape s={spec.a} cx={34} cy={36} />
        <text x={74} y={42} textAnchor="middle" fontSize="18" fontWeight="800" fill="#64748b">→</text>
        <rect x={84} y={6} width={60} height={60} rx={10} fill="#f8fafc" stroke="#cbd5e1" strokeWidth="1.5" />
        <Shape s={spec.b} cx={114} cy={36} />
        <text x={156} y={42} textAnchor="middle" fontSize="18" fontWeight="800" fill="#64748b">::</text>
        <rect x={168} y={6} width={60} height={60} rx={10} fill="#f8fafc" stroke="#cbd5e1" strokeWidth="1.5" />
        <Shape s={spec.c} cx={198} cy={36} />
        <text x={238} y={42} textAnchor="middle" fontSize="18" fontWeight="800" fill="#64748b">→</text>
        <rect x={248} y={6} width={48} height={60} rx={10} fill="#eef2ff" stroke="#6366f1" strokeWidth="2" strokeDasharray="4 3" />
        <text x={272} y={43} textAnchor="middle" fontSize="22" fontWeight="800" fill="#4f46e5">?</text>
      </svg>
    );
  }

  if (spec.mode === 'pieces') {
    // Potongan bangun: default persegi + segitiga, atau custom pieces
    return (
      <svg viewBox="0 0 180 72" className="figural-stimulus" style={{ maxWidth: 210 }}>
        <rect x={6} y={6} width={76} height={60} rx={10} fill="#f8fafc" stroke="#cbd5e1" strokeWidth="1.5" />
        {spec.left ? (
          <Shape s={spec.left} cx={44} cy={36} />
        ) : (
          <rect x={26} y={18} width={36} height={36} fill="#e0e7ff" stroke="#4f46e5" strokeWidth="2.2" />
        )}
        <text x={92} y={42} textAnchor="middle" fontSize="18" fontWeight="800" fill="#64748b">+</text>
        <rect x={102} y={6} width={72} height={60} rx={10} fill="#f8fafc" stroke="#cbd5e1" strokeWidth="1.5" />
        {spec.right ? (
          <Shape s={spec.right} cx={138} cy={36} />
        ) : (
          <polygon points="138,16 160,50 116,50" fill="#e0e7ff" stroke="#4f46e5" strokeWidth="2.2" strokeLinejoin="round" />
        )}
      </svg>
    );
  }

  if (spec.mode === 'matrix') {
    // Matriks 2x2: [tl, tr, bl, ?]
    return (
      <svg viewBox="0 0 144 144" className="figural-stimulus" style={{ maxWidth: 160 }}>
        <rect x={4} y={4} width={64} height={64} rx={10} fill="#f8fafc" stroke="#cbd5e1" strokeWidth="1.5" />
        <Shape s={spec.cells[0]} cx={36} cy={36} />
        <rect x={76} y={4} width={64} height={64} rx={10} fill="#f8fafc" stroke="#cbd5e1" strokeWidth="1.5" />
        <Shape s={spec.cells[1]} cx={108} cy={36} />
        <rect x={4} y={76} width={64} height={64} rx={10} fill="#f8fafc" stroke="#cbd5e1" strokeWidth="1.5" />
        <Shape s={spec.cells[2]} cx={36} cy={108} />
        <rect x={76} y={76} width={64} height={64} rx={10} fill="#eef2ff" stroke="#6366f1" strokeWidth="2" strokeDasharray="4 3" />
        <text x={108} y={116} textAnchor="middle" fontSize="24" fontWeight="800" fill="#4f46e5">?</text>
      </svg>
    );
  }

  return null;
}
