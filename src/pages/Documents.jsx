import { useState, useMemo, useEffect } from "react";
import DOCUMENTS from "./documents.json";
import "./Documents.css";

/**
 * Expects the same documents.json shape as before:
 * { pdf: [...], image: [...], doc: [...], zip: [...], other: [...] }
 * where each entry has: name, path, folder, company, topics[]
 */

const TYPE_LABEL = { pdf: "PDF", image: "Image", doc: "Doc", zip: "Archive", other: "Other" };
const TYPE_CHIP = { pdf: "PDF", image: "IMG", doc: "DOC", zip: "ZIP", other: "•••" };
const TOPIC_LABEL = {
  aptitude: "Aptitude", dsa: "DSA", level2: "Level 2",
  level3: "Level 3", lld: "LLD", important: "Important",
};
const IMAGE_EXTS = ["jpg", "jpeg", "png", "gif", "webp", "svg", "ico", "jpe", "jfif"];

function getExt(name) {
  return name.split(".").pop().toLowerCase();
}

function FilterGroup({ title, options, active, onSelect }) {
  return (
    <div className="fg">
      <h3 className="fg-title">{title}</h3>
      <ul className="fg-list">
        {options.map((opt) => (
          <li key={opt.value}>
            <button
              className={"fg-option" + (active === opt.value ? " fg-option--active" : "")}
              onClick={() => onSelect(active === opt.value && opt.value !== "all" ? "all" : opt.value)}
            >
              <span className="fg-dot" aria-hidden="true" />
              <span className="fg-label">{opt.label}</span>
              <span className="fg-count">{opt.count}</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function Documents() {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [companyFilter, setCompanyFilter] = useState("all");
  const [tagFilter, setTagFilter] = useState("all");
  const [sheetOpen, setSheetOpen] = useState(false);
  const [modal, setModal] = useState(null);

  const allDocs = useMemo(() => {
    const docs = [];
    Object.entries(DOCUMENTS).forEach(([type, list]) => {
      list.forEach((d) => docs.push({ ...d, type, ext: getExt(d.name) }));
    });
    return docs;
  }, []);

  const companies = useMemo(
    () => [...new Set(allDocs.map((d) => d.company || "Other"))].sort(),
    [allDocs]
  );

  useEffect(() => {
    document.body.style.overflow = modal || sheetOpen ? "hidden" : "";
  }, [modal, sheetOpen]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key !== "Escape") return;
      if (modal) setModal(null);
      else if (sheetOpen) setSheetOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [modal, sheetOpen]);

  const filtered = useMemo(() => {
    let list = allDocs;
    if (typeFilter !== "all") list = list.filter((d) => d.type === typeFilter);
    if (companyFilter !== "all") list = list.filter((d) => (d.company || "Other") === companyFilter);
    if (tagFilter !== "all") list = list.filter((d) => d.topics?.includes(tagFilter));
    if (search.trim()) {
      const q = search.toLowerCase().trim();
      list = list.filter((d) => d.name.toLowerCase().includes(q));
    }
    return list;
  }, [allDocs, typeFilter, companyFilter, tagFilter, search]);

  const grouped = useMemo(() => {
    const groups = {};
    filtered.forEach((d) => {
      const comp = d.company || "Other";
      groups[comp] ??= [];
      groups[comp].push(d);
    });
    return Object.entries(groups).sort((a, b) => b[1].length - a[1].length);
  }, [filtered]);

  const typeOptions = useMemo(
    () => [
      { value: "all", label: "All types", count: allDocs.length },
      ...Object.keys(TYPE_LABEL)
        .filter((t) => DOCUMENTS[t]?.length)
        .map((t) => ({ value: t, label: TYPE_LABEL[t], count: DOCUMENTS[t].length })),
    ],
    [allDocs]
  );

  const companyOptions = useMemo(
    () => [
      { value: "all", label: "All companies", count: allDocs.length },
      ...companies.map((c) => ({
        value: c,
        label: c,
        count: allDocs.filter((d) => (d.company || "Other") === c).length,
      })),
    ],
    [allDocs, companies]
  );

  const topicOptions = useMemo(
    () => [
      { value: "all", label: "All topics", count: allDocs.length },
      ...Object.keys(TOPIC_LABEL).map((t) => ({
        value: t,
        label: TOPIC_LABEL[t],
        count: allDocs.filter((d) => d.topics?.includes(t)).length,
      })),
    ],
    [allDocs]
  );

  const activeFilterCount = [typeFilter, companyFilter, tagFilter].filter((f) => f !== "all").length;

  const clearAll = () => {
    setTypeFilter("all");
    setCompanyFilter("all");
    setTagFilter("all");
  };

  const filterPanel = (
    <>
      <FilterGroup title="Type" options={typeOptions} active={typeFilter} onSelect={setTypeFilter} />
      <FilterGroup title="Company" options={companyOptions} active={companyFilter} onSelect={setCompanyFilter} />
      <FilterGroup title="Topic" options={topicOptions} active={tagFilter} onSelect={setTagFilter} />
      {activeFilterCount > 0 && (
        <button className="fg-clear" onClick={clearAll}>Clear all filters</button>
      )}
    </>
  );

  return (
    <div className="lib-root">
      {/* ---------- Hero / search ---------- */}
      <header className="lib-hero">
        <p className="lib-eyebrow">The Index</p>
        <h1 className="lib-heading">Placement Preparation Library</h1>
        <p className="lib-sub">{allDocs.length} documents, indexed and searchable — find what you need before the interview does.</p>

        <div className="lib-search-row">
          <svg className="lib-search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <circle cx="11" cy="11" r="7" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            className="lib-search"
            type="search"
            placeholder="Search by filename…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            aria-label="Search documents"
          />
        </div>
        <p className="lib-result-count">
          {filtered.length} of {allDocs.length} documents{search.trim() && <> matching &ldquo;{search}&rdquo;</>}
        </p>
      </header>

      {/* ---------- Layout: sidebar (desktop) + list ---------- */}
      <div className="lib-layout">
        <aside className="lib-sidebar" aria-label="Filters">
          {filterPanel}
        </aside>

        <main className="lib-main">
          {grouped.length === 0 && (
            <div className="lib-empty">
              <p>No matches found in the index.</p>
              <button onClick={clearAll}>Clear filters and try again</button>
            </div>
          )}

          {grouped.map(([company, docs]) => (
            <section className="lib-section" key={company}>
              <h2 className="lib-section-title">
                {company} <span className="lib-section-count">{docs.length}</span>
              </h2>
              <ul className="lib-list">
                {docs.map((d) => (
                  <li className="lib-row" key={d.path}>
                    <button className="lib-row-btn" onClick={() => setModal({ name: d.name, path: d.path, ext: d.ext })}>
                      <span className={`lib-chip lib-chip--${d.type}`}>{TYPE_CHIP[d.type]}</span>
                      <span className="lib-row-text">
                        <span className="lib-row-name">{d.name}</span>
                        <span className="lib-row-meta">
                          {d.folder}
                          {d.topics?.length > 0 && (
                            <>
                              {" "}&middot;{" "}
                              {d.topics.map((t) => TOPIC_LABEL[t] || t).join(", ")}
                            </>
                          )}
                        </span>
                      </span>
                      <svg className="lib-row-arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <polyline points="9 18 15 12 9 6" />
                      </svg>
                    </button>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </main>
      </div>

      {/* ---------- Mobile floating filter button ---------- */}
      <button className="lib-fab" onClick={() => setSheetOpen(true)}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <line x1="4" y1="6" x2="20" y2="6" /><line x1="8" y1="12" x2="16" y2="12" /><line x1="11" y1="18" x2="13" y2="18" />
        </svg>
        Filters
        {activeFilterCount > 0 && <span className="lib-fab-badge">{activeFilterCount}</span>}
      </button>

      {/* ---------- Mobile bottom sheet ---------- */}
      <div className={"lib-sheet-overlay" + (sheetOpen ? " lib-sheet-overlay--open" : "")} onClick={() => setSheetOpen(false)}>
        <div className="lib-sheet" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true" aria-label="Filters">
          <div className="lib-sheet-handle" />
          <div className="lib-sheet-header">
            <h2>Filters</h2>
            <button className="lib-sheet-close" onClick={() => setSheetOpen(false)} aria-label="Close filters">&times;</button>
          </div>
          <div className="lib-sheet-body">{filterPanel}</div>
          <div className="lib-sheet-footer">
            <button className="lib-sheet-apply" onClick={() => setSheetOpen(false)}>
              Show {filtered.length} document{filtered.length !== 1 ? "s" : ""}
            </button>
          </div>
        </div>
      </div>

      {/* ---------- Preview modal ---------- */}
      <div className={"lib-modal-overlay" + (modal ? " lib-modal-overlay--open" : "")}>
        {modal && (
          <div className="lib-modal" role="dialog" aria-modal="true" aria-label="Document preview">
            <div className="lib-modal-header">
              <span className="lib-modal-title">{modal.name}</span>
              <div className="lib-modal-actions">
                <a className="lib-modal-btn" href={modal.path} download={modal.name}>Download</a>
                <button className="lib-modal-btn lib-modal-btn--close" onClick={() => setModal(null)} aria-label="Close preview">&times;</button>
              </div>
            </div>
            <div className="lib-modal-body">
              {modal.ext === "pdf" ? (
                <iframe src={modal.path} title={modal.name} />
              ) : IMAGE_EXTS.includes(modal.ext) ? (
                <img src={modal.path} alt={modal.name} />
              ) : (
                <div className="lib-modal-placeholder">
                  Preview not available for this file type.<br />Use Download instead.
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}