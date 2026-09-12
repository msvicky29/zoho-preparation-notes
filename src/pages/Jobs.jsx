import { Link } from 'react-router-dom'
import './ComingSoon.css'

export default function Jobs() {
  return (
    <div className="coming-soon">
      <div className="coming-soon__inner">
        <Link to="/" className="coming-soon__back">← Back to Home</Link>
        <span className="coming-soon__emoji">💼</span>
        <h1 className="coming-soon__title">Job Postings</h1>
        <p className="coming-soon__subtitle">Fresh openings, updated regularly</p>
        <div className="coming-soon__badge">Coming Soon</div>
        <p className="coming-soon__text">
          Aggregating fresh Zoho and tech-company job openings relevant to freshers.
          Filterable by role, location, and experience level — updated weekly.
        </p>
        <div className="coming-soon__topics">
          <span className="coming-soon__topic">SDE Roles</span>
          <span className="coming-soon__topic">Internships</span>
          <span className="coming-soon__topic">Off-Campus</span>
          <span className="coming-soon__topic">On-Campus</span>
        </div>
      </div>
    </div>
  )
}