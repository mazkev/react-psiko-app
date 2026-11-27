// Sanity check: distribusi dimensi pada pasangan & skoring
import { PAPI_PAIRS } from '../src/data/papi.js';
import { MSDT_PAIRS } from '../src/data/msdt.js';
import { scoreIST, scoreDISC, scorePAPI, scoreMSDT, scoreBDI, buildOverall } from '../src/scoring.js';

const count = (pairs) => {
  const c = {};
  pairs.forEach((p) => { c[p.a.dim] = (c[p.a.dim] || 0) + 1; c[p.b.dim] = (c[p.b.dim] || 0) + 1; if (p.a.dim === p.b.dim) throw new Error('same dim'); if (!p.a.text || !p.b.text) throw new Error('missing text'); });
  return c;
};
console.log('PAPI', PAPI_PAIRS.length, count(PAPI_PAIRS));
console.log('MSDT', MSDT_PAIRS.length, count(MSDT_PAIRS));

const ist = scoreIST({ 'SE-1': 'b', 'RA-1': '84', 'ZR-5': '1', 'WA-3': 'e' });
console.log('IST', ist.raw, ist.iq, ist.category);
const disc = scoreDISC(Object.fromEntries([...Array(24)].map((_, i) => [i, { most: i % 3 ? 'D' : 'I', least: 'S' }])));
console.log('DISC', disc.change, disc.patternKey, disc.pattern.name);
const papi = scorePAPI(Object.fromEntries(PAPI_PAIRS.map((_, i) => [i, 'a'])));
console.log('PAPI', papi.dims.map((d) => d.code + d.score).join(' '));
const msdt = scoreMSDT(Object.fromEntries(MSDT_PAIRS.map((p, i) => [i, ['executive', 'developer', 'benevolent'].includes(p.a.dim) ? 'a' : 'b'])));
console.log('MSDT', msdt.TO, msdt.RO, msdt.EFF, msdt.finalStyle.name);
const bdi = scoreBDI(Object.fromEntries([...Array(21)].map((_, i) => [i, 1])));
console.log('BDI', bdi.total, bdi.level.label, bdi.riskFlag);
console.log(buildOverall({ ist, disc, papi, msdt, bdi }, { name: 'Budi Santoso' }).fit);
