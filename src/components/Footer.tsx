import { Link } from 'react-router-dom';
import { navItems } from '../constants/data';

const generateSlug = (text: string) => {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
};

const getMenuSlug = (name: string) => {
  if (name === 'Cửa hàng') return 'store';
  return generateSlug(name);
};

// Derive footer columns directly from navItems so Navbar & Footer stay in sync.
// - Each nav item with a dropdown or isSplit becomes a column.
function buildFooterColumns() {
  return navItems
    .filter((item) => (item.dropdown && item.dropdown.length > 0) || item.isSplit)
    .map((item) => {
      let links: { label: string; to: string }[] = [];
      if (item.isSplit && item.splitData) {
        links = item.splitData.map((d) => ({
          label: d.name,
          to: `/${getMenuSlug(item.name)}/${generateSlug(d.name)}`
        }));
      } else if (item.dropdown) {
        links = item.dropdown.flatMap((section) =>
          section.links.map((link) => ({
            label: link,
            to: `/${getMenuSlug(item.name)}/${generateSlug(link)}`
          }))
        );
      }
      return {
        title: item.name,
        links
      };
    });
}

// Nav items without a dropdown and not split become "quick links" in the footer bottom bar
function buildQuickLinks() {
  return navItems
    .filter((item) => (!item.dropdown || item.dropdown.length === 0) && !item.isSplit)
    .map((item) => ({
      label: item.name,
      to: `/${getMenuSlug(item.name)}`
    }));
}

export default function Footer() {
  const footerColumns = buildFooterColumns();
  const quickLinks = buildQuickLinks();

  // Dynamic grid columns based on count
  const colCount = Math.min(footerColumns.length, 6);

  return (
    <footer className="footer">
      <div className="footer-inner">
        {/* Columns Grid — auto-synced from navItems */}
        <div
          className="footer-columns"
          style={{ gridTemplateColumns: `repeat(${colCount}, 1fr)` }}
        >
          {footerColumns.map((col) => (
            <div key={col.title} className="footer-col">
              <h3 className="footer-col-title">{col.title}</h3>
              <ul className="footer-col-links">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link to={link.to} className="footer-link">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="footer-bottom">
          <p className="footer-copyright">
            Copyright © {new Date().getFullYear()} PC Shop. Bảo lưu mọi quyền.
          </p>

          {/* Quick links for nav items without dropdown */}
          {quickLinks.length > 0 && (
            <div className="footer-quick-links">
              {quickLinks.map((link, i) => (
                <span key={link.label} className="footer-quick-link-wrap">
                  <Link to={link.to} className="footer-bottom-link">
                    {link.label}
                  </Link>
                  {i < quickLinks.length - 1 && (
                    <span className="footer-sep">|</span>
                  )}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      <style>{`
        .footer {
          background-color: #f5f5f7;
          border-top: 1px solid #d2d2d7;
          font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Segoe UI', Roboto, sans-serif;
          margin-top: 60px;
        }

        .auth-page .footer {
          background: transparent;
          border-top: 1px solid rgba(0, 0, 0, 0.05);
          margin-top: 40px;
        }

        .footer-inner {
          max-width: 980px;
          margin: 0 auto;
          padding: 0 22px;
        }

        /* ── Columns ─────────────────────────── */
        .footer-columns {
          display: grid;
          gap: 0;
          padding: 36px 0 28px;
          border-bottom: 1px solid #d2d2d7;
        }

        @media (max-width: 1024px) {
          .footer-columns {
            grid-template-columns: repeat(3, 1fr) !important;
          }
        }

        @media (max-width: 640px) {
          .footer-columns {
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 20px 0;
          }
        }

        @media (max-width: 390px) {
          .footer-columns {
            grid-template-columns: 1fr !important;
          }
        }

        .footer-col {
          padding-right: 20px;
          padding-bottom: 12px;
        }

        .footer-col-title {
          font-size: 12px;
          font-weight: 600;
          color: #1d1d1f;
          letter-spacing: -0.01em;
          margin: 0 0 10px 0;
          line-height: 1.33;
        }

        .footer-col-links {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 7px;
        }

        .footer-link {
          font-size: 12px;
          color: #6e6e73;
          text-decoration: none;
          line-height: 1.4;
          transition: color 0.15s ease;
          display: inline-block;
        }

        .footer-link:hover {
          color: #1d1d1f;
        }

        /* ── Bottom bar ──────────────────────── */
        .footer-bottom {
          padding: 14px 0 18px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 8px;
        }

        .footer-copyright {
          font-size: 12px;
          color: #6e6e73;
          margin: 0;
          line-height: 1.33;
        }

        /* Quick links (nav items without dropdown) */
        .footer-quick-links {
          display: flex;
          align-items: center;
          gap: 4px;
          flex-wrap: wrap;
        }

        .footer-quick-link-wrap {
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .footer-bottom-link {
          font-size: 12px;
          color: #6e6e73;
          text-decoration: none;
          transition: color 0.15s ease;
        }

        .footer-bottom-link:hover {
          color: #1d1d1f;
        }

        .footer-sep {
          font-size: 12px;
          color: #d2d2d7;
        }
      `}</style>
    </footer>
  );
}
