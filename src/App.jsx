import { useEffect, useState } from 'react';
import Home from './components/Home.jsx';
import ISTTest from './components/ISTTest.jsx';
import DISCTest from './components/DISCTest.jsx';
import PairTest from './components/PairTest.jsx';
import BDITest from './components/BDITest.jsx';
import Results from './components/Results.jsx';
import History from './components/History.jsx';
import { PAPI_PAIRS } from './data/papi.js';
import { MSDT_PAIRS } from './data/msdt.js';

const KEY = 'psikotes-app-v1';
const HIST_KEY = 'psikotes-history-v1';
const empty = () => ({
  participant: null,
  answers: { ist: {}, disc: {}, papi: {}, msdt: {}, bdi: {} },
  done: {},
});

function load() {
  try {
    const s = JSON.parse(localStorage.getItem(KEY));
    return s ? { ...empty(), ...s, answers: { ...empty().answers, ...s.answers } } : empty();
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

export default function App() {
  const [state, setState] = useState(load);
  const [history, setHistory] = useState(loadHistory);
  const [historyEntry, setHistoryEntry] = useState(null);
  const [view, setView] = useState('home');

  useEffect(() => {
    localStorage.setItem(KEY, JSON.stringify(state));
  }, [state]);
  useEffect(() => {
    localStorage.setItem(HIST_KEY, JSON.stringify(history));
  }, [history]);
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [view]);

  const saveToHistory = () => {
    if (!Object.keys(state.done).length) return;
    const entry = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      savedAt: new Date().toISOString(),
      participant: state.participant,
      answers: state.answers,
      done: state.done,
    };
    setHistory((h) => [entry, ...h]);
    window.alert('Hasil sesi saat ini berhasil disimpan ke Riwayat!');
  };

  const setAnswer = (test) => (key, value) =>
    setState((s) => ({ ...s, answers: { ...s.answers, [test]: { ...s.answers[test], [key]: value } } }));

  const finish = (test) => () => {
    setState((s) => ({ ...s, done: { ...s.done, [test]: new Date().toISOString() } }));
    setView('home');
  };

  const startTest = (test) => {
    // Mengulang tes yang sudah selesai akan menghapus jawaban sebelumnya
    if (state.done[test]) {
      setState((s) => {
        const done = { ...s.done };
        delete done[test];
        return { ...s, done, answers: { ...s.answers, [test]: {} } };
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
      content = <ISTTest {...common('ist')} />;
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

  return (
    <div className="app">
      <header className="topbar no-print">
        <div
          className="brand"
          onClick={() => {
            setHistoryEntry(null);
            setView('home');
          }}
        >
          <span className="brand-logo">Ψ</span>
          <span>
            <strong>PsikoTes</strong>
            <small>Asesmen Psikologi Terpadu</small>
          </span>
        </div>
        <div className="row-gap">
          <button
            className="btn ghost sm"
            onClick={() => {
              setHistoryEntry(null);
              setView('history');
            }}
          >
            🗂 Riwayat ({history.length})
          </button>
          {state.participant && (
            <div className="topbar-user">
              <span className="avatar">{state.participant.name.charAt(0).toUpperCase()}</span>
              <span>{state.participant.name}</span>
            </div>
          )}
        </div>
      </header>
      <main className="container">{content}</main>
      <footer className="footer no-print">
        Hasil tes ini bersifat indikatif untuk keperluan latihan/edukasi dan tidak menggantikan asesmen oleh psikolog profesional.
      </footer>
    </div>
  );
}
