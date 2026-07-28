import { Link } from 'react-router-dom'
import './PlaceholderPage.css'

const folderSections = [
  { name: 'Zoho Aptitude & Interview Sets', files: '15+ PDFs' },
  { name: 'Company-wise Placement Materials', files: '30+ PDFs' },
  { name: 'LLD Case Studies & Code', files: '10+ solutions' },
  { name: 'Previous Year Questions', files: '20+ sets' },
]

export default function Documents() {
  return (
    <div className="placeholder-page">
      <div className="placeholder-page__inner">
        <Link to="/" className="placeholder-page__back">← Back to Home</Link>
        <span className="placeholder-page__emoji">📄</span>
        <h1 className="placeholder-page__title">Document Hub</h1>
        <p className="placeholder-page__subtitle">
          450+ PDFs covering aptitude, placement papers, interview experiences, and more.
        </p>

        <div className="placeholder-page__grid">
          {folderSections.map((section, i) => (
            <div key={i} className="placeholder-page__card">
              <h3 className="placeholder-page__card-title">{section.name}</h3>
              <p className="placeholder-page__card-meta">{section.files}</p>
            </div>
          ))}
        </div>

        <p className="placeholder-page__note">
          Full file browser with search and filtering coming soon.
          <br />
          Browse the raw collection on{' '}
          <a href="https://github.com/msvicky29/zoho-preparation-notes" target="_blank" rel="noopener noreferrer">
            GitHub
          </a>.
        </p>
      </div>
    </div>
  )
}