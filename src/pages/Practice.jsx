import { useState, useMemo } from 'react' 
import problems from '../../data/problems.json' 
import './Practice.css' 
 
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
      <button className='prac-copy' onClick={copy}> 
        {copied ? 'Copied!' : 'Copy'} 
      </button> 
      <pre className='prac-code__pre'> 
        <code> {code} </code> 
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
  const topics = useMemo(() => ['All', ...new Set(problems.map((p) => p.topic))], []) 
  const filtered = useMemo(() => { 
    if (!problems.length) return [] 
    if (view === 'today') return [pickDaily(problems)] 
    return activeTopic === 'All' ? problems : problems.filter((p) => p.topic === activeTopic) 
  }, [view, activeTopic]) 
 
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
      {view === 'browse' && ( 
        <div className='prac-topics'> 
          {topics.map((t) => ( 
            <button key={t} className={activeTopic === t ? 'prac-topic prac-topic--active' : 'prac-topic'} onClick={() => setActiveTopic(t)}> {t} </button> 
          ))} 
        </div> 
      )} 
      <div className='prac-list'> 
        {filtered.map((p) => <ProblemView key={p.id} problem={p} />)} 
      </div> 
      {!filtered.length && <p className='prac-empty'> No solutions yet. Push a .java file and the pipeline will add it here. </p>} 
    </div> 
  ) 
} 
