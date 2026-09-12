import './Footer.css'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer__inner">
        <div className="footer__left">
          <p className="footer__text">
            Zoho Prep Kit · built by a fresher, for freshers.{' '}
            <span className="footer__text-muted">Not affiliated with Zoho Corp.</span>
          </p>
        </div>
        <div className="footer__right">
          <a
            href="mailto:msvicky29@gmail.com?subject=Zoho%20Prep%20Kit%20Contribution"
            className="footer__cta"
          >
            Share a resource
          </a>
          <a
            href="https://github.com/msvicky29/zoho-preparation-notes"
            target="_blank"
            rel="noopener noreferrer"
            className="footer__link"
          >
            GitHub
          </a>
        </div>
      </div>
    </footer>
  )
}
