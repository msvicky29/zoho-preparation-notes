import { useMemo, useState } from 'react'
import questionsData from './DSAquestions.json'
import './Dsa.css'

const DIFFICULTY_CLASS = {
  Easy: 'dsa-badge--easy',
  Medium: 'dsa-badge--medium',
  Hard: 'dsa-badge--hard',
}

function buildCategoryTree(questions) {
  const tree = {}
  for (const q of questions) {
    if (!tree[q.category]) tree[q.category] = {}
    if (!tree[q.category][q.subcategory]) tree[q.category][q.subcategory] = []
    tree[q.category][q.subcategory].push(q)
  }
  return tree
}

function QuestionCard({ question }) {
  return (
    <article className="dsa-card">
      <div className="dsa-card__head">
        <div className="dsa-card__meta">
          <span className={`dsa-badge ${DIFFICULTY_CLASS[question.difficulty] || 'dsa-badge--medium'}`}>
            {question.difficulty}
          </span>
          <span className="dsa-card__source">
            {question.company} · {question.round} · {question.year}
          </span>
        </div>
        <h2 className="dsa-card__title">{question.title}</h2>
      </div>

      <div className="dsa-card__body">
        <div className="dsa-card__section">
          <h3 className="dsa-card__label">Problem</h3>
          <p className="dsa-card__question">{question.question}</p>
        </div>

        <div className="dsa-card__io">
          <div className="dsa-card__io-block">
            <h3 className="dsa-card__label">Sample Input</h3>
            <pre className="dsa-card__code">
              <code>{question.sampleInput}</code>
            </pre>
          </div>
          <div className="dsa-card__io-block">
            <h3 className="dsa-card__label">Sample Output</h3>
            <pre className="dsa-card__code">
              <code>{question.sampleOutput}</code>
            </pre>
          </div>
        </div>

        {question.explanation && (
          <div className="dsa-card__section">
            <h3 className="dsa-card__label">Explanation</h3>
            <p className="dsa-card__explanation">{question.explanation}</p>
          </div>
        )}

        {question.notes && (
          <div className="dsa-card__notes">
            <b>Note:</b> {question.notes}
          </div>
        )}
      </div>
    </article>
  )
}

export default function Dsa() {
  const [activeCategory, setActiveCategory] = useState(null)
  const [activeSubcategory, setActiveSubcategory] = useState(null)
  const [expandedCategories, setExpandedCategories] = useState({})
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const tree = useMemo(() => buildCategoryTree(questionsData), [])
  const categories = Object.keys(tree)

  const filteredQuestions = useMemo(() => {
    if (!activeCategory) return questionsData
    if (!activeSubcategory) {
      return questionsData.filter((q) => q.category === activeCategory)
    }
    return questionsData.filter(
      (q) => q.category === activeCategory && q.subcategory === activeSubcategory
    )
  }, [activeCategory, activeSubcategory])

  const selectCategory = (category) => {
    setActiveCategory(category)
    setActiveSubcategory(null)
    setExpandedCategories((prev) => ({
      ...prev,
      [category]: !prev[category],
    }))
  }

  const selectSubcategory = (category, subcategory) => {
    setActiveCategory(category)
    setActiveSubcategory(subcategory)
    setSidebarOpen(false)
  }

  const resetFilter = () => {
    setActiveCategory(null)
    setActiveSubcategory(null)
  }

  const closeSidebar = () => setSidebarOpen(false)

  return (
    <div className="dsa">
      {/* Mobile top bar */}
      <div className="dsa-topbar">
        <button
          type="button"
          className="dsa-topbar__btn"
          aria-label="Open categories"
          aria-expanded={sidebarOpen}
          onClick={() => setSidebarOpen(true)}
        >
          <span className="dsa-topbar__icon" aria-hidden="true">
            <span />
            <span />
            <span />
          </span>
          Categories
        </button>
        <span className="dsa-topbar__title">
          {activeSubcategory
            ? `${activeCategory} · ${activeSubcategory}`
            : activeCategory || 'All Questions'}
        </span>
      </div>

      {/* Backdrop */}
      <div
        className={`dsa-overlay${sidebarOpen ? ' dsa-overlay--open' : ''}`}
        onClick={closeSidebar}
        aria-hidden="true"
      />

      <div className="dsa-layout">
        {/* Sidebar */}
        <aside
          className={`dsa-sidebar${sidebarOpen ? ' dsa-sidebar--open' : ''}`}
          aria-label="DSA categories"
        >
          <div className="dsa-sidebar__head">
            <span>Topics</span>
            <button
              type="button"
              className="dsa-sidebar__close"
              aria-label="Close categories"
              onClick={closeSidebar}
            >
              ×
            </button>
          </div>

          <nav className="dsa-sidebar__nav">
            <button
              type="button"
              className={`dsa-sidebar__all${!activeCategory ? ' dsa-sidebar__all--active' : ''}`}
              onClick={() => {
                resetFilter()
                closeSidebar()
              }}
            >
              All Questions
              <span className="dsa-sidebar__count">{questionsData.length}</span>
            </button>

            {categories.map((category) => {
              const subcategories = Object.keys(tree[category])
              const expanded = !!expandedCategories[category]
              const isActiveCat = activeCategory === category
              const catCount = tree[category]
                ? Object.values(tree[category]).reduce((sum, arr) => sum + arr.length, 0)
                : 0

              return (
                <div key={category} className="dsa-sidebar__group">
                  <button
                    type="button"
                    className={`dsa-sidebar__cat${isActiveCat ? ' dsa-sidebar__cat--active' : ''}`}
                    aria-expanded={expanded}
                    onClick={() => selectCategory(category)}
                  >
                    <span className="dsa-sidebar__cat-name">{category}</span>
                    <span className="dsa-sidebar__cat-right">
                      <span className="dsa-sidebar__count">{catCount}</span>
                      <span
                        className={`dsa-sidebar__chevron${expanded ? ' dsa-sidebar__chevron--open' : ''}`}
                        aria-hidden="true"
                      >
                        ▾
                      </span>
                    </span>
                  </button>

                  {expanded && (
                    <div className="dsa-sidebar__subs">
                      {subcategories.map((sub) => {
                        const isActiveSub =
                          activeCategory === category && activeSubcategory === sub
                        return (
                          <button
                            key={sub}
                            type="button"
                            className={`dsa-sidebar__sub${isActiveSub ? ' dsa-sidebar__sub--active' : ''}`}
                            onClick={() => selectSubcategory(category, sub)}
                          >
                            {sub}
                            <span className="dsa-sidebar__count">
                              {tree[category][sub].length}
                            </span>
                          </button>
                        )
                      })}
                    </div>
                  )}
                </div>
              )
            })}
          </nav>
        </aside>

        {/* Main content */}
        <main className="dsa-main">
          <div className="dsa-main__head">
            <h1 className="dsa-main__title">
              {activeSubcategory
                ? `${activeCategory} — ${activeSubcategory}`
                : activeCategory || 'All DSA Questions'}
            </h1>
            <p className="dsa-main__subtitle">
              {filteredQuestions.length} question{filteredQuestions.length !== 1 ? 's' : ''}
              {activeSubcategory
                ? ` in ${activeSubcategory}`
                : activeCategory
                  ? ` in ${activeCategory}`
                  : ' across all topics'}
            </p>
          </div>

          <div className="dsa-list">
            {filteredQuestions.map((q) => (
              <QuestionCard key={q.id} question={q} />
            ))}
          </div>

          {filteredQuestions.length === 0 && (
            <div className="dsa-empty">
              <p>No questions found for this filter.</p>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}