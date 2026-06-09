import { navItems } from '../constants/data';

// Derive footer columns directly from navItems so Navbar & Footer stay in sync.
// - Each nav item with a dropdown becomes a column (title = nav item name).
// - Items without a dropdown are listed as standalone quick-links at the bottom.
function buildFooterColumns() {
  return navItems
    .filter((item) => item.dropdown && item.dropdown.length > 0)
    .map((item) => ({
      title: item.name,
      // Flatten all links across every dropdown section of this nav item
      links: item.dropdown!.flatMap((section) =>
        section.links.map((link) => ({ label: link, href: '#' }))
      ),
    }));
}

// Nav items without a dropdown become "quick links" in the footer bottom bar
function buildQuickLinks() {
  return navItems
    .filter((item) => !item.dropdown || item.dropdown.length === 0)
    .map((item) => ({ label: item.name, href: '#' }));
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
                    <a href={link.href} className="footer-link">
                      {link.label}
                    </a>
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
                  <a href={link.href} className="footer-bottom-link">
                    {link.label}
                  </a>
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
          background: linear-gradient(135deg, rgba(96, 165, 250, 0.15) 0%, #f5f5f7 55%, rgba(192, 132, 252, 0.15) 100%);
          border-top: 1px solid rgba(147, 197, 253, 0.3);
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
