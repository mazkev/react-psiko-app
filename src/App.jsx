import { useEffect, useState } from 'react';
import Home from './components/Home.jsx';
import ISTTest from './components/ISTTest.jsx';
import DISCTest from './components/DISCTest.jsx';
import PairTest from './components/PairTest.jsx';
import BDITest from './components/BDITest.jsx';
import FiguralTest from './components/FiguralTest.jsx';
import Results from './components/Results.jsx';
import History from './components/History.jsx';
import { PAPI_PAIRS } from './data/papi.js';
import { MSDT_PAIRS } from './data/msdt.js';

const KEY = 'psikotes-app-v1';
const HIST_KEY = 'psikotes-history-v1';
const VALID_VIEWS = new Set(['home', 'ist', 'disc', 'papi', 'msdt', 'bdi', 'figural', 'results', 'history']);
const empty = () => ({
  participant: null,
  answers: { ist: {}, disc: {}, papi: {}, msdt: {}, bdi: {}, figural: {} },
  done: {},
  timers: {},
});

function load() {
  try {
    const s = JSON.parse(localStorage.getItem(KEY));
    return s ? { ...empty(), ...s, answers: { ...empty().answers, ...s.answers }, timers: { ...s.timers } } : empty();
  } catch {
    return empty();
  }
}

function loadHistory() {
  try {
    const h = JSON.parse(localStorage.getItem(HIST_KEY));
    return Array.isArray(h) ? h : [];
  } catch {
    return [];
  }
}

function viewFromHash() {
  const h = window.location.hash.replace(/^#/, '');
  return VALID_VIEWS.has(h) ? h : 'home';
}

export default function App() {
  const [state, setState] = useState(load);
  const [history, setHistory] = useState(loadHistory);
  const [historyEntry, setHistoryEntry] = useState(null);
  const [view, setView] = useState(viewFromHash);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    localStorage.setItem(KEY, JSON.stringify(state));
  }, [state]);
  useEffect(() => {
    localStorage.setItem(HIST_KEY, JSON.stringify(history));
  }, [history]);
  useEffect(() => {
    if (window.location.hash !== `#${view}`) window.location.hash = view;
    window.scrollTo(0, 0);
  }, [view]);
  useEffect(() => {
    const onHash = () => setView(viewFromHash());
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 3200);
    return () => clearTimeout(t);
  }, [toast]);

  const saveToHistory = () => {
    if (!Object.keys(state.done).length) return;
    const sig = JSON.stringify({ p: state.participant, d: state.done, a: state.answers });
    const exists = history.some((h) => JSON.stringify({ p: h.participant, d: h.done, a: h.answers }) === sig);
    if (exists) {
      setToast('Sesi ini sudah tersimpan di Riwayat.');
      return;
    }
    const entry = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      savedAt: new Date().toISOString(),
      participant: state.participant,
      answers: state.answers,
      done: state.done,
    };
    setHistory((h) => [entry, ...h]);
    setToast('Hasil sesi berhasil disimpan ke Riwayat!');
  };

  const setAnswer = (test) => (key, value) =>
    setState((s) => ({ ...s, answers: { ...s.answers, [test]: { ...s.answers[test], [key]: value } } }));

  const onTickTime = (timerKey, sec) =>
    setState((s) => (s.timers?.[timerKey] === sec ? s : { ...s, timers: { ...s.timers, [timerKey]: sec } }));

  const clearTimersFor = (timers, test) => {
    const next = { ...timers };
    Object.keys(next).forEach((k) => {
      if (k === test || k.startsWith(`${test}-`)) delete next[k];
    });
    return next;
  };

  const finish = (test) => () => {
    setState((s) => ({
      ...s,
      done: { ...s.done, [test]: new Date().toISOString() },
      timers: clearTimersFor(s.timers, test),
    }));
    setView('home');
  };

  const startTest = (test) => {
    // Mengulang tes yang sudah selesai akan menghapus jawaban & timer sebelumnya
    if (state.done[test]) {
      setState((s) => {
        const done = { ...s.done };
        delete done[test];
        return { ...s, done, answers: { ...s.answers, [test]: {} }, timers: clearTimersFor(s.timers, test) };
      });
    }
    setView(test);
  };

  const resetAll = () => {
    if (window.confirm('Hapus seluruh data peserta dan jawaban?')) {
      setState(empty());
      setView('home');
    }
  };

  const common = (test) => ({
    answers: state.answers[test],
    onAnswer: setAnswer(test),
    onFinish: finish(test),
    onExit: () => setView('home'),
  });

  let content;
  switch (view) {
    case 'ist':
      content = <ISTTest {...common('ist')} timers={state.timers} onTickTime={onTickTime} />;
      break;
    case 'disc':
      content = <DISCTest {...common('disc')} />;
      break;
    case 'papi':
      content = (
        <PairTest
          {...common('papi')}
          testId="papi"
          pairs={PAPI_PAIRS}
          instruction="Pilih SATU pernyataan dari setiap pasangan yang PALING menggambarkan diri Anda dalam bekerja. Jika keduanya sesuai atau keduanya tidak sesuai, tetap pilih yang paling mendekati."
        />
      );
      break;
    case 'msdt':
      content = (
        <PairTest
          {...common('msdt')}
          testId="msdt"
          pairs={MSDT_PAIRS}
          instruction="Bayangkan Anda sedang memimpin/mengelola sebuah tim. Pilih SATU pernyataan dari setiap pasangan yang paling menggambarkan cara Anda bertindak sebagai atasan."
        />
      );
      break;
    case 'bdi':
      content = <BDITest {...common('bdi')} />;
      break;
    case 'figural':
      content = <FiguralTest {...common('figural')} savedTime={state.timers?.figural} onTickTime={onTickTime} />;
      break;
    case 'results':
      content = (
        <Results
          state={historyEntry || state}
          isArchived={!!historyEntry}
          onSaveHistory={!historyEntry ? saveToHistory : null}
          onBack={() => {
            if (historyEntry) {
              setHistoryEntry(null);
              setView('history');
            } else {
              setView('home');
            }
          }}
          onReset={resetAll}
        />
      );
      break;
    case 'history':
      content = (
        <History
          history={history}
          onBack={() => setView('home')}
          onViewEntry={(entry) => {
            setHistoryEntry(entry);
            setView('results');
          }}
          onDeleteEntry={(id) => setHistory((h) => h.filter((x) => x.id !== id))}
          onClearHistory={() => {
            if (window.confirm('Hapus semua riwayat tersimpan?')) setHistory([]);
          }}
        />
      );
      break;
    default:
      content = (
        <Home
          state={state}
          historyCount={history.length}
          onSaveParticipant={(p) => setState((s) => ({ ...s, participant: p }))}
          onStart={startTest}
          onContinue={(t) => setView(t)}
          onResults={() => {
            setHistoryEntry(null);
            setView('results');
          }}
          onSaveHistory={saveToHistory}
          onHistory={() => setView('history')}
          onReset={resetAll}
        />
      );
  }

  const doneCount = Object.keys(state.done).length;

  return (
    <div className="app">
      <header className="topbar no-print">
        <div className="topbar-inner">
          <div
            className="brand"
            onClick={() => {
              setHistoryEntry(null);
              setView('home');
            }}
          >
            <span className="brand-logo">P</span>
            <span>
              <strong>PsikoTes</strong>
              <small>Asesmen Potensi &amp; Karier</small>
            </span>
          </div>

          <nav className="nav-links">
            <button
              type="button"
              className={`nav-link ${view === 'home' ? 'active' : ''}`}
              onClick={() => {
                setHistoryEntry(null);
                setView('home');
              }}
            >
              Beranda
            </button>
            <button
              type="button"
              className={`nav-link ${view === 'history' ? 'active' : ''}`}
              onClick={() => {
                setHistoryEntry(null);
                setView('history');
              }}
            >
              Riwayat <span className="nav-badge">{history.length}</span>
            </button>
            <button
              type="button"
              className={`nav-link ${view === 'results' && !historyEntry ? 'active' : ''}`}
              disabled={!doneCount}
              onClick={() => {
                setHistoryEntry(null);
                setView('results');
              }}
            >
              Laporan Hasil
            </button>
          </nav>

          <div className="row-gap">
            {state.participant ? (
              <div className="topbar-user">
                <span className="avatar">{state.participant.name.charAt(0).toUpperCase()}</span>
                <span>{state.participant.name}</span>
              </div>
            ) : (
              <span className="nav-status">6 Modul Siap</span>
            )}
          </div>
        </div>
      </header>
      <main className="container">{content}</main>
      {toast && <div className="toast no-print">{toast}</div>}
      <footer className="footer no-print">
        Hasil tes ini bersifat indikatif untuk keperluan latihan/edukasi dan tidak menggantikan asesmen oleh psikolog profesional.
      </footer>
    </div>
  );
}
