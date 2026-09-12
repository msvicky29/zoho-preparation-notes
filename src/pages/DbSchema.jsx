import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import './DbSchema.css'

const QUESTIONS = [
  {
    id: 'product-browser',
    navTitle: 'Product Browser',
    difficulty: 'medium',
    tags: ['SQL Schema', 'Normalization'],
    title: 'Design a Database Schema for a Product Browser',
    desc: 'Design a normalized relational schema for a product browsing platform (similar to Zoho Showroom / an e-commerce catalog). The system must support companies listing products under multiple categories, tracking stock, and recording price changes over time.',
    requirements: [
      { label: 'Companies', text: 'Each company has a name, contact email, phone, and address. Companies can list one or more products.' },
      { label: 'Products', text: 'Each product has a name, description, SKU (unique), base price, and belongs to exactly one company.' },
      { label: 'Categories', text: 'A product can belong to multiple categories (e.g. Electronics, Mobile Phones, Accessories). Categories are hierarchical.' },
      { label: 'Inventory', text: 'Track current stock quantity per product. Stock should be easy to update on every purchase/restock.' },
      { label: 'Price history', text: 'Every price change must be recorded with its effective date, so historical prices can be queried.' },
      { label: 'Queries', text: 'Support listing products by category, listing all products of a company, and fetching the current price of a product.' },
    ],
    tables: [
      {
        id: 'company',
        name: 'company',
        purpose: 'Stores the companies that list products on the platform.',
        createSql: `CREATE TABLE company (
  id            INT PRIMARY KEY AUTO_INCREMENT,
  name          VARCHAR(120) NOT NULL,
  contact_email VARCHAR(160) NOT NULL,
  phone         VARCHAR(20),
  address       VARCHAR(255),
  created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uq_company_name (name)
);`,
        exampleSql: `INSERT INTO company (name, contact_email, phone, address) VALUES
  ('Zoho Corp',   'sales@zohocorp.com',   '+91-44-1234-5678', 'Chennai, India'),
  ('FreshCart',   'hi@freshcart.in',      '+91-44-8765-4321', 'Bengaluru, India'),
  ('TechNova',    'contact@technova.io',  '+1-415-555-0100',  'San Francisco, USA');`,
        exampleTable: [
          ['id', 'name', 'contact_email', 'phone', 'address', 'created_at'],
          [1, 'Zoho Corp', 'sales@zohocorp.com', '+91-44-1234-5678', 'Chennai, India', '2026-01-05 09:15:00'],
          [2, 'FreshCart', 'hi@freshcart.in', '+91-44-8765-4321', 'Bengaluru, India', '2026-01-05 09:20:00'],
          [3, 'TechNova', 'contact@technova.io', '+1-415-555-0100', 'San Francisco, USA', '2026-01-06 11:02:00'],
        ],
        notes: '`name` is unique so two companies cannot register with the same legal name.',
      },
      {
        id: 'category',
        name: 'category',
        purpose: 'Hierarchical category tree. A category can optionally have a parent for sub-categories.',
        createSql: `CREATE TABLE category (
  id        INT PRIMARY KEY AUTO_INCREMENT,
  name      VARCHAR(100) NOT NULL,
  parent_id INT NULL,
  FOREIGN KEY (parent_id) REFERENCES category (id)
    ON DELETE SET NULL,
  UNIQUE KEY uq_category_name (name, parent_id)
);`,
        exampleSql: `INSERT INTO category (name, parent_id) VALUES
  ('Electronics', NULL),
  ('Mobile Phones', 1),
  ('Laptops', 1),
  ('Accessories', 1),
  ('Home Appliances', NULL),
  ('Kitchen Appliances', 5);`,
        exampleTable: [
          ['id', 'name', 'parent_id'],
          [1, 'Electronics', null],
          [2, 'Mobile Phones', 1],
          [3, 'Laptops', 1],
          [4, 'Accessories', 1],
          [5, 'Home Appliances', null],
          [6, 'Kitchen Appliances', 5],
        ],
        notes: '`parent_id` is self-referencing for the hierarchy. `NULL` means it is a top-level category.',
      },
      {
        id: 'product',
        name: 'product',
        purpose: 'Core product table. Each product belongs to one company.',
        createSql: `CREATE TABLE product (
  id          INT PRIMARY KEY AUTO_INCREMENT,
  company_id  INT NOT NULL,
  name        VARCHAR(150) NOT NULL,
  description TEXT,
  sku         VARCHAR(64) NOT NULL,
  base_price  DECIMAL(12,2) NOT NULL,
  is_active   TINYINT(1) DEFAULT 1,
  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uq_product_sku (sku),
  KEY idx_product_company (company_id),
  FOREIGN KEY (company_id) REFERENCES company (id)
    ON DELETE CASCADE
);`,
        exampleSql: `INSERT INTO product (company_id, name, description, sku, base_price, is_active) VALUES
  (1, 'Zoho CRM Pro',      'Cloud CRM for teams',        'ZH-CRM-PRO-01',  4200.00, 1),
  (1, 'Zoho Books',        'Accounting & invoicing',     'ZH-BKS-STD-02',  2400.00, 1),
  (2, 'FreshCart Groceries','Daily essentials delivery', 'FC-GRC-001',      599.00, 1),
  (3, 'TechNova Laptop',   '14-inch ultrabook',          'TN-LT-14-100',   74999.00, 1),
  (3, 'Type-C Hub',        '7-in-1 USB-C hub',           'TN-HUB-7-001',    1899.00, 0);`,
        exampleTable: [
          ['id', 'company_id', 'name', 'sku', 'base_price', 'is_active'],
          [1, 1, 'Zoho CRM Pro', 'ZH-CRM-PRO-01', 4200.00, true],
          [2, 1, 'Zoho Books', 'ZH-BKS-STD-02', 2400.00, true],
          [3, 2, 'FreshCart Groceries', 'FC-GRC-001', 599.00, true],
          [4, 3, 'TechNova Laptop', 'TN-LT-14-100', 74999.00, true],
          [5, 3, 'Type-C Hub', 'TN-HUB-7-001', 1899.00, false],
        ],
        notes: '`sku` is globally unique. `is_active` soft-deletes a product instead of physically removing it.',
      },
      {
        id: 'product_category',
        name: 'product_category',
        purpose: 'Many-to-many join between products and categories.',
        createSql: `CREATE TABLE product_category (
  product_id  INT NOT NULL,
  category_id INT NOT NULL,
  PRIMARY KEY (product_id, category_id),
  FOREIGN KEY (product_id) REFERENCES product (id)
    ON DELETE CASCADE,
  FOREIGN KEY (category_id) REFERENCES category (id)
    ON DELETE CASCADE
);`,
        exampleSql: `INSERT INTO product_category (product_id, category_id) VALUES
  (1, 1), (1, 2),
  (2, 1), (2, 5),
  (3, 5), (3, 6),
  (4, 1), (4, 3),
  (5, 1), (5, 4);`,
        exampleTable: [
          ['product_id', 'category_id'],
          [1, 1],
          [1, 2],
          [2, 1],
          [2, 5],
          [3, 5],
          [3, 6],
          [4, 1],
          [4, 3],
          [5, 1],
          [5, 4],
        ],
        notes: 'Composite primary key prevents a product being added twice to the same category.',
      },
      {
        id: 'inventory',
        name: 'inventory',
        purpose: 'One-to-one with product. Stores the current stock quantity.',
        createSql: `CREATE TABLE inventory (
  product_id    INT PRIMARY KEY,
  quantity      INT NOT NULL DEFAULT 0,
  reorder_level INT NOT NULL DEFAULT 10,
  updated_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (product_id) REFERENCES product (id)
    ON DELETE CASCADE,
  CONSTRAINT chk_quantity_non_negative CHECK (quantity >= 0)
);`,
        exampleSql: `INSERT INTO inventory (product_id, quantity, reorder_level) VALUES
  (1, 250, 20),
  (2, 180, 20),
  (3, 1200, 100),
  (4, 15, 10),
  (5, 0, 5);`,
        exampleTable: [
          ['product_id', 'quantity', 'reorder_level', 'updated_at'],
          [1, 250, 20, '2026-08-10 18:30:00'],
          [2, 180, 20, '2026-08-10 18:30:00'],
          [3, 1200, 100, '2026-08-10 18:35:00'],
          [4, 15, 10, '2026-08-09 09:00:00'],
          [5, 0, 5, '2026-08-01 14:45:00'],
        ],
        notes: 'Using `product_id` as the primary key keeps a strict 1:1 mapping with the product table.',
      },
      {
        id: 'price_history',
        name: 'price_history',
        purpose: 'Audit log of every price change with effective dates.',
        createSql: `CREATE TABLE price_history (
  id          INT PRIMARY KEY AUTO_INCREMENT,
  product_id  INT NOT NULL,
  price       DECIMAL(12,2) NOT NULL,
  effective_from DATE NOT NULL,
  effective_to   DATE NULL,
  FOREIGN KEY (product_id) REFERENCES product (id)
    ON DELETE CASCADE,
  KEY idx_ph_product_date (product_id, effective_from)
);`,
        exampleSql: `INSERT INTO price_history (product_id, price, effective_from, effective_to) VALUES
  (1, 3999.00, '2026-02-01', '2026-05-31'),
  (1, 4200.00, '2026-06-01', NULL),
  (4, 79999.00, '2026-03-15', '2026-06-30'),
  (4, 74999.00, '2026-07-01', NULL),
  (5, 2099.00, '2026-04-10', '2026-07-31'),
  (5, 1899.00, '2026-08-01', NULL);`,
        exampleTable: [
          ['id', 'product_id', 'price', 'effective_from', 'effective_to'],
          [1, 1, 3999.00, '2026-02-01', '2026-05-31'],
          [2, 1, 4200.00, '2026-06-01', null],
          [3, 4, 79999.00, '2026-03-15', '2026-06-30'],
          [4, 4, 74999.00, '2026-07-01', null],
          [5, 5, 2099.00, '2026-04-10', '2026-07-31'],
          [6, 5, 1899.00, '2026-08-01', null],
        ],
        notes: '`effective_to = NULL` means the price is currently active. This pattern supports point-in-time price queries.',
      },
    ],
    sampleQuery: `-- List all active products under "Electronics" with current price and stock
SELECT
  p.name                         AS product_name,
  c.name                         AS company_name,
  ph.price                       AS current_price,
  i.quantity                     AS stock
FROM product p
JOIN company c          ON c.id = p.company_id
JOIN product_category pc ON pc.product_id = p.id
JOIN category cat       ON cat.id = pc.category_id
JOIN price_history ph   ON ph.product_id = p.id
                       AND ph.effective_to IS NULL
JOIN inventory i        ON i.product_id = p.id
WHERE cat.name = 'Electronics'
  AND p.is_active = 1;`,
    sampleOutput: `+---------------------+-------------+---------------+-------+
| product_name        | company_name| current_price | stock |
+---------------------+-------------+---------------+-------+
| Zoho CRM Pro        | Zoho Corp   |       4200.00 |   250 |
| Zoho Books          | Zoho Corp   |       2400.00 |   180 |
| FreshCart Groceries | FreshCart   |        599.00 |  1200 |
| TechNova Laptop     | TechNova    |      74999.00 |    15 |
| Type-C Hub          | TechNova    |       1899.00 |     0 |
+---------------------+-------------+---------------+-------+`,
  },
]


function SchemaTable({ table }) {
  const [sqlCopied, setSqlCopied] = useState(false)
  const [dataCopied, setDataCopied] = useState(false)

  const copyText = async (text, setCopied) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch {
      /* clipboard unavailable */
    }
  }

  return (
    <section className="dbs-table" aria-label={`${table.name} schema`}>
      <div className="dbs-table__head">
        <div>
          <h3 className="dbs-table__name">{table.name}</h3>
          <p className="dbs-table__purpose">{table.purpose}</p>
        </div>
      </div>

      <div className="dbs-block">
        <div className="dbs-block__row">
          <h4 className="dbs-block__label">CREATE TABLE</h4>
          <button
            type="button"
            className={`dbs-copy${sqlCopied ? ' dbs-copy--copied' : ''}`}
            onClick={() => copyText(table.createSql, setSqlCopied)}
          >
            {sqlCopied ? 'Copied!' : 'Copy DDL'}
          </button>
        </div>
        <pre className="dbs-sql">
          <code>{table.createSql}</code>
        </pre>
      </div>

      <div className="dbs-block">
        <div className="dbs-block__row">
          <h4 className="dbs-block__label">Example Data</h4>
          <button
            type="button"
            className={`dbs-copy${dataCopied ? ' dbs-copy--copied' : ''}`}
            onClick={() => copyText(table.exampleSql, setDataCopied)}
          >
            {dataCopied ? 'Copied!' : 'Copy INSERTs'}
          </button>
        </div>
        <pre className="dbs-sql">
          <code>{table.exampleSql}</code>
        </pre>
      </div>

      <div className="dbs-block">
        <h4 className="dbs-block__label">Table View</h4>
        <div className="dbs-table-wrap">
          <table className="dbs-data">
            <thead>
              <tr>
                {table.exampleTable[0].map((col) => (
                  <th key={col}>{col}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {table.exampleTable.slice(1).map((row, i) => (
                <tr key={i}>
                  {row.map((cell, j) => (
                    <td key={j}>{cell === null ? 'NULL' : String(cell)}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {table.notes && (
        <p className="dbs-table__notes">
          <b>Note:</b> {table.notes}
        </p>
      )}
    </section>
  )
}

function QuestionView({ question }) {
  const [activeTable, setActiveTable] = useState(question.tables[0].id)
  const [queryCopied, setQueryCopied] = useState(false)

  useEffect(() => {
    setActiveTable(question.tables[0].id)
    setQueryCopied(false)
  }, [question])

  const active = question.tables.find((t) => t.id === activeTable) ?? question.tables[0]

  const copyQuery = async () => {
    try {
      await navigator.clipboard.writeText(question.sampleQuery)
      setQueryCopied(true)
      setTimeout(() => setQueryCopied(false), 1500)
    } catch {
      /* clipboard unavailable */
    }
  }

  return (
    <article className="dbs-content">
      <div className="dbs-content__meta">
        <span className={`dbs-badge dbs-badge--${question.difficulty}`}>
          {question.difficulty.toUpperCase()}
        </span>
        {question.tags.map((tag) => (
          <span key={tag} className="dbs-badge dbs-badge--tag">
            {tag}
          </span>
        ))}
      </div>

      <h1 className="dbs-content__title">{question.title}</h1>

      <section className="dbs-content__question" aria-label="Problem statement">
        <h2 className="dbs-content__section-label">Problem</h2>
        <p className="dbs-content__desc">{question.desc}</p>
        <ul className="dbs-content__req">
          {question.requirements.map((req) => (
            <li key={req.label}>
              <b>{req.label}:</b> {req.text}
            </li>
          ))}
        </ul>
      </section>

      <section className="dbs-content__schema" aria-label="Database schema">
        <div className="dbs-content__section-row">
          <h2 className="dbs-content__section-label">Table Schema</h2>
        </div>

        <div className="dbs-editor">
          <div className="dbs-tabbar" role="tablist" aria-label="Schema tables">
            {question.tables.map((table) => (
              <button
                key={table.id}
                type="button"
                role="tab"
                aria-selected={table.id === activeTable}
                className={`dbs-tab${table.id === activeTable ? ' dbs-tab--active' : ''}`}
                onClick={() => setActiveTable(table.id)}
              >
                {table.name}
              </button>
            ))}
          </div>

          <div className="dbs-panel">
            <SchemaTable key={active.id} table={active} />
          </div>
        </div>
      </section>

      <section className="dbs-content__query" aria-label="Sample query">
        <div className="dbs-content__section-row">
          <h2 className="dbs-content__section-label">Sample Query</h2>
          <button
            type="button"
            className={`dbs-copy${queryCopied ? ' dbs-copy--copied' : ''}`}
            onClick={copyQuery}
          >
            {queryCopied ? 'Copied!' : 'Copy Query'}
          </button>
        </div>
        <pre className="dbs-sql dbs-sql--query">
          <code>{question.sampleQuery}</code>
        </pre>
      </section>

      <section className="dbs-content__output" aria-label="Query result">
        <h2 className="dbs-content__section-label">Result</h2>
        <pre className="dbs-output">
          <code>{question.sampleOutput}</code>
        </pre>
      </section>
    </article>
  )
}

export default function DbSchema() {
  const [searchParams] = useSearchParams()
  const requestedId = searchParams.get('q')
  const active =
    QUESTIONS.find((q) => q.id === requestedId) ?? QUESTIONS[0]

  return (
    <div className="dbs-lab">
      <div className="dbs-main">
        <QuestionView key={active.id} question={active} />
      </div>
    </div>
  )
}
