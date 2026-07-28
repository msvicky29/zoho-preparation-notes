import { Link } from 'react-router-dom'
import './Home.css'

const indexRows = [
  {
    num: '01',
    title: 'Documents',
    path: '/documents',
    blurb: '450+ PDFs — aptitude sets, placement papers, interview experiences.',
    status: 'live',
  },
  {
    num: '02',
    title: 'LLD Code Lab',
    path: '/lld',
    blurb: 'Java machine-coding solutions with file tabs, copy, and sample output.',
    status: 'live',
  },
  {
    num: '03',
    title: 'DSA Cheat Sheet',
    path: '/dsa',
    blurb: 'Topic-wise must-solve list — still being written.',
    status: 'soon',
  },
  {
    num: '04',
    title: 'Job Postings',
    path: '/jobs',
    blurb: 'Fresh openings for campus and early-career roles.',
    status: 'soon',
  },
]

const changelog = [
  { date: 'Jul 20', text: 'Car Rental Service LLD' },
  { date: 'Jul 18', text: 'Snake & Ladder LLD' },
  { date: 'Jul 15', text: 'Zoho Aptitude Set 8' },
]

export default function Home() {
  return (
    <div className="home">
      <header className="home-intro">
        <p className="home-intro__brand">Zoho Prep Kit</p>
        <p className="home-intro__lede">
          Notes, papers, and LLD code from my own Zoho prep — kept in one place so the next
          fresher doesn&apos;t have to dig through dead Telegram links.
        </p>
      </header>

      <section className="home-index" aria-label="Kit index">
        <div className="home-index__label">Index</div>
        <ul className="home-index__list">
          {indexRows.map((row) => {
            const Tag = row.status === 'live' ? Link : 'div'
            const linkProps =
              row.status === 'live'
                ? { to: row.path }
                : { 'aria-disabled': true }

            return (
              <li key={row.num} className="home-index__item">
                <Tag
                  {...linkProps}
                  className={`home-index__row${row.status === 'soon' ? ' home-index__row--soon' : ''}`}
                >
                  <span className="home-index__num">{row.num}</span>
                  <span className="home-index__main">
                    <span className="home-index__title">{row.title}</span>
                    <span className="home-index__blurb">{row.blurb}</span>
                  </span>
                  <span
                    className={`home-index__status home-index__status--${row.status}`}
                  >
                    {row.status === 'live' ? 'Open' : 'Soon'}
                  </span>
                  {row.status === 'live' && (
                    <span className="home-index__arrow" aria-hidden="true">
                      →
                    </span>
                  )}
                </Tag>
              </li>
            )
          })}
        </ul>
      </section>

      <section className="home-log" aria-label="Latest additions">
        <div className="home-log__inner">
          <div className="home-log__head">
            <span className="home-log__label">changelog</span>
            <span className="home-log__chip">updated</span>
          </div>
          <ul className="home-log__list">
            {changelog.map((item) => (
              <li key={item.text} className="home-log__item">
                <span className="home-log__date">{item.date}</span>
                <span className="home-log__text">{item.text}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="home-note">
        <p>
          I put this together while prepping for my own interview — tired of scattered PDFs and
          dead links. If it helps you, pass it to someone in your batch.
        </p>
        <p className="home-note__ps">
          p.s.{' '}
          <a href="mailto:msvicky29@gmail.com?subject=Zoho%20Prep%20Kit%20Contribution">
            got a paper or LLD solution? send it over →
          </a>
        </p>
      </section>
    </div>
  )
}
