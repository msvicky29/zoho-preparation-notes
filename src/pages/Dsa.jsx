import { Link } from 'react-router-dom'
import './ComingSoon.css'

export default function Dsa() {
  return (
    <div className="coming-soon">
      <div className="coming-soon__inner">
        <Link to="/" className="coming-soon__back">← Back to Home</Link>
        <span className="coming-soon__emoji">🧠</span>
        <h1 className="coming-soon__title">DSA Cheat Sheet</h1>
        <p className="coming-soon__subtitle">Topic-wise must-solve questions</p>
        <div className="coming-soon__badge">In Progress</div>
        <p className="coming-soon__text">
          Curating the most frequently asked DSA problems from Zoho interviews,
          organized by topic with solutions and explanations. This will be your
          go-to revision sheet.
        </p>
        <div className="coming-soon__topics">
          <span className="coming-soon__topic">Arrays</span>
          <span className="coming-soon__topic">Strings</span>
          <span className="coming-soon__topic">Matrices</span>
          <span className="coming-soon__topic">Sorting</span>
          <span className="coming-soon__topic">Dynamic Programming</span>
          <span className="coming-soon__topic">Graphs</span>
        </div>
      </div>
    </div>
  )
}