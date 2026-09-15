import { useState, useMemo, useEffect } from 'react' 
import './Practice.css' 
 
const API_URL = 'https://raw.githubusercontent.com/msvicky29/zoho-preparation-notes/refs/heads/main/data/problems.json' 
 
const DIFFICULTY = { 
  Easy: 'prac-badge-easy', 
  Medium: 'prac-badge-medium', 
  Hard: 'prac-badge-hard', 
} 
 
function daySeed() { 
  const now = new Date() 
  return now.getFullYear() * 1000 + (now.getMonth() + 1) * 100 + now.getDate() 
} 
 
function pickDaily(list) { 
  if (!list.length) return null 
  const seed = daySeed() 
  return list[seed % list.length] 
} 
 
const JAVA_KEYWORDS = new Set([
  'public', 'private', 'protected', 'class', 'interface', 'implements',
  'extends', 'return', 'if', 'else', 'while', 'for', 'new', 'this',
  'static', 'final', 'void', 'import', 'package', 'throw', 'throws',
  'try', 'catch', 'finally', 'true', 'false', 'null', 'instanceof',
  'int', 'double', 'boolean', 'char', 'long', 'float', 'byte', 'short',
])

function highlightJava(code) {
  const parts = []
  const re =
    /(\/\/[^\n]*|\/\*[\s\S]*?\*\/)|("(?:\\.[^"\\])*")|(\b\d+(?:\.\d+)?\b)|(\b[A-Z][A-Za-z0-9_]*\b)|(\b[a-z][A-Za-z0-9_]*\b)|([^A-Za-z0-9_"/\s]+)|(\s+)/g

  let match
  while ((match = re.exec(code)) !== null) {
    const [full, comment, str, num, typeish, word, punct, space] = match
    if (comment) {
      parts.push(<span key={parts.length} className='prac-tok-cm'>{comment}</span>)
    } else if (str) {
      parts.push(<span key={parts.length} className='prac-tok-str'>{str}</span>)
    } else if (num) {
      parts.push(<span key={parts.length} className='prac-tok-num'>{num}</span>)
    } else if (typeish) {
      parts.push(<span key={parts.length} className='prac-tok-type'>{typeish}</span>)
    } else if (word) {
      if (JAVA_KEYWORDS.has(word)) {
        parts.push(<span key={parts.length} className='prac-tok-kw'>{word}</span>)
      } else {
        parts.push(word)
      }
    } else if (punct) {
      parts.push(punct)
    } else if (space) {
      parts.push(space)
    } else {
      parts.push(full)
    }
  }
  return parts
}

function CodeBlock({ code }) {
  const [copied, setCopied] = useState(false)
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch (e) {}
  }
  return (
    <div className='prac-code'>
      <div className='prac-code__bar'>
        <span className='prac-code__name'>Solution.java</span>
        <button
          className={'prac-copy' + (copied ? ' prac-copy--copied' : '')}
          onClick={copy}
        >
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>
      <pre className='prac-code__pre'>
        <code>{highlightJava(code)}</code>
      </pre>
    </div>
  )
}
 
function ProblemView({ problem }) { 
  const [revealed, setRevealed] = useState(false) 
  return ( 
    <article className='prac-card'> 
      <div className='prac-card__meta'> 
        <span className={'prac-badge ' + (DIFFICULTY[problem.difficulty] || 'prac-badge-medium')}> {problem.difficulty} </span> 
        <span className='prac-card__platform'> {problem.platform} </span> 
        <span className='prac-card__topic'> {problem.topic} </span> 
      </div> 
      <h2 className='prac-card__title'> {problem.title} </h2> 
      <p className='prac-card__question'> {problem.question} </p> 
      <div className='prac-card__rev'> 
        <span> Added {problem.dateAdded} </span> 
        <span> Revised {problem.revisionCount} </span> 
        {problem.lastRevised && <span> Last {problem.lastRevised} </span>} 
      </div> 
      <button className='prac-reveal' onClick={() => setRevealed(!revealed)}> 
        {revealed ? 'Hide Solution' : 'Reveal Solution'} 
      </button> 
      {revealed && <CodeBlock code={problem.code} />} 
    </article> 
  ) 
}
 
export default function Practice() { 
  const [view, setView] = useState('browse') 
  const [activeTopic, setActiveTopic] = useState('All') 
  const [problems, setProblems] = useState([]) 
  const [status, setStatus] = useState('loading') 
 
  async function loadProblems() { 
    setStatus('loading') 
    try { 
      const res = await fetch(API_URL + '?t=' + Date.now()) 
      if (!res.ok) throw new Error('bad status ' + res.status) 
      const data = await res.json() 
      setProblems(Array.isArray(data) ? data : []) 
      setStatus('ok') 
    } catch (e) { 
      setStatus('error') 
    } 
  } 
 
  useEffect(() => { 
    loadProblems() 
  }, [view]) 
 
  const topics = useMemo(() => ['All', ...new Set(problems.map((p) => p.topic))], [problems]) 
  const filtered = useMemo(() => { 
    if (!problems.length) return [] 
    if (view === 'today') return [pickDaily(problems)] 
    return activeTopic === 'All' ? problems : problems.filter((p) => p.topic === activeTopic) 
  }, [view, activeTopic, problems]) 
 
  return ( 
    <div className='prac'> 
      <header className='prac__head'> 
        <h1> Practice and Revision </h1> 
        <p> Your pushed Java solutions, ready on any device. </p> 
      </header> 
      <div className='prac-tabs'> 
        <button className={view === 'browse' ? 'prac-tab prac-tab--active' : 'prac-tab'} onClick={() => setView('browse')}> Browse </button> 
        <button className={view === 'today' ? 'prac-tab prac-tab--active' : 'prac-tab'} onClick={() => setView('today')}> Question of the Day </button> 
      </div> 
      {status === 'loading' && <p className='prac-empty'> Loading solutions... </p>} 
      {status === 'error' && (<div className='prac-empty'> 
        <p> Could not load solutions from GitHub. </p> 
        <button className='prac-reveal' onClick={() => loadProblems()}> Retry </button> 
      </div>)} 
      {status === 'ok' && view === 'browse' && (<div className='prac-topics'> 
        {topics.map((t) => (<button key={t} className={activeTopic === t ? 'prac-topic prac-topic--active' : 'prac-topic'} onClick={() => setActiveTopic(t)}> {t} </button>))} 
      </div>)} 
      {status === 'ok' && (<div className='prac-list'> 
        {filtered.map((p) => <ProblemView key={p.id} problem={p} />)} 
      </div>)} 
      {status === 'ok' && !filtered.length && <p className='prac-empty'> No solutions found for this filter. </p>} 
    </div> 
  ) 
} 
