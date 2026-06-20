import { Link } from 'react-router-dom';
import { navItems } from '../constants/data';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';

const FacebookIcon = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
  </svg>
);

const YoutubeIcon = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"/>
    <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"/>
  </svg>
);

const InstagramIcon = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
  </svg>
);

const SHOWROOM_INFO = {
  name: 'Hệ thống Showroom PC Shop',
  address: '123 Đường Ba Tháng Hai, Phường 11, Quận 10, TP. Hồ Chí Minh',
  hotlineSales: '1900 8080 (phím 1)',
  hotlineSupport: '1900 8080 (phím 2)',
  email: 'contact@pcshop.vn',
  workingHours: '08:00 - 21:30 (Cả CN & Ngày lễ)',
};

const COMPANY_INFO = {
  name: 'CÔNG TY CỔ PHẦN CÔNG NGHỆ PC SHOP',
  license: 'GPDKKD số 0109876543 do Sở KH&ĐT TP.HCM cấp ngày 15/06/2022',
  address: 'Trụ sở chính: 123 Đường Ba Tháng Hai, Phường 11, Quận 10, Thành phố Hồ Chí Minh, Việt Nam',
};

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

const getComponentCatId = (name: string) => {
  if (name.includes('RAM')) return 'ram';
  if (name.includes('CPU')) return 'cpu';
  if (name.includes('VGA')) return 'vga';
  if (name.includes('Mainboard')) return 'mainboard';
  if (name.includes('SSD')) return 'ssd';
  if (name.includes('HDD')) return 'hdd';
  if (name.includes('Nguồn')) return 'psu';
  if (name.includes('Tản Nhiệt')) return 'cooling';
  if (name.includes('Case')) return 'case';
  return generateSlug(name);
};

// Derive footer columns directly from navItems so Navbar & Footer stay in sync.
// - Each nav item with a dropdown or isSplit becomes a column.
function buildFooterColumns() {
  return navItems
    .filter((item) => (item.dropdown && item.dropdown.length > 0) || item.isSplit)
    .map((item) => {
      let links: { label: string; to: string }[] = [];
      const menuSlug = getMenuSlug(item.name);
      if (item.isSplit && item.splitData) {
        links = item.splitData.map((d) => {
          let to = `/${menuSlug}/${generateSlug(d.name)}`;
          if (menuSlug === 'linh-kien') {
            to = `/linh-kien?category=${getComponentCatId(d.name)}`;
          }
          return {
            label: d.name,
            to
          };
        });
      } else if (item.dropdown) {
        links = item.dropdown.flatMap((section) =>
          section.links.map((link) => {
            const linkSlug = generateSlug(link);
            return {
              label: link,
              to: menuSlug === 'phu-kien'
                ? `/phu-kien?category=${linkSlug}`
                : `/${menuSlug}/${linkSlug}`
            };
          })
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

const VisaIcon = () => (
  <svg width="36" height="24" viewBox="0 0 36 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="partner-logo">
    <rect width="36" height="24" rx="3" fill="#1A1F71"/>
    <path d="M12.5 16.2L14.2 7H16.8L15.1 16.2H12.5ZM21.9 7.2C21.4 7 20.6 6.8 19.6 6.8C17 6.8 15.2 8 15.2 9.8C15.2 11.2 16.6 11.9 17.6 12.3C18.7 12.8 19 13.1 19 13.6C19 14.3 18.1 14.6 17.4 14.6C16.2 14.6 15.5 14.3 15 14.1L14.4 16C15 16.2 16.1 16.4 17.2 16.4C19.9 16.4 21.7 15.2 21.7 13.3C21.7 11.1 18.5 11 18.5 10C18.5 9.7 18.8 9.3 19.6 9.3C19.9 9.3 20.7 9.3 21.3 9.6L21.9 7.2ZM27.1 7H25.1C24.5 7 24.1 7.3 23.9 7.8L20.4 16.2H23.1L23.6 14.7H26.9L27.2 16.2H29.6L27.1 7ZM24.3 12.7L25.3 9.8L25.9 12.7H24.3ZM11.1 7H8.5L6 13.3L5 8.2C4.8 7.4 4.2 7 3.5 7H0.2L0 7.4C1.5 7.8 2.7 8.3 3.6 8.8L5.9 16.2H8.6L12.7 7H11.1Z" fill="#F7B600"/>
  </svg>
);

const MastercardIcon = () => (
  <svg width="36" height="24" viewBox="0 0 36 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="partner-logo">
    <rect width="36" height="24" rx="3" fill="#222"/>
    <circle cx="15" cy="12" r="7" fill="#EB001B"/>
    <circle cx="21" cy="12" r="7" fill="#F79E1B" fillOpacity="0.8"/>
  </svg>
);

const MomoIcon = () => (
  <svg width="36" height="24" viewBox="0 0 36 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="partner-logo">
    <rect width="36" height="24" rx="3" fill="#A50064"/>
    <text x="18" y="16" fill="#FFF" fontSize="9" fontWeight="bold" fontFamily="sans-serif" textAnchor="middle">MoMo</text>
  </svg>
);

const VnpayIcon = () => (
  <svg width="36" height="24" viewBox="0 0 36 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="partner-logo">
    <rect width="36" height="24" rx="3" fill="#FFF" stroke="#E2E8F0" strokeWidth="1"/>
    <path d="M6 7H10L13 14L16 7H20L15 17H11L6 7Z" fill="#005BAA"/>
    <path d="M20 7H24L27 12L25 17H21L23 12L20 7Z" fill="#E31E24"/>
    <text x="23" y="15" fill="#005BAA" fontSize="7" fontWeight="bold" fontFamily="sans-serif">PAY</text>
  </svg>
);

const ZalopayIcon = () => (
  <svg width="36" height="24" viewBox="0 0 36 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="partner-logo">
    <rect width="36" height="24" rx="3" fill="#008FE5"/>
    <text x="18" y="15" fill="#FFF" fontSize="8" fontWeight="bold" fontFamily="sans-serif" textAnchor="middle">ZaloPay</text>
  </svg>
);

const GhtkIcon = () => (
  <svg width="48" height="24" viewBox="0 0 48 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="partner-logo">
    <rect width="48" height="24" rx="3" fill="#063"/>
    <text x="24" y="15" fill="#FFF" fontSize="9" fontWeight="bold" fontFamily="sans-serif" textAnchor="middle">GHTK</text>
  </svg>
);

const GhnIcon = () => (
  <svg width="48" height="24" viewBox="0 0 48 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="partner-logo">
    <rect width="48" height="24" rx="3" fill="#F57C00"/>
    <text x="24" y="15" fill="#FFF" fontSize="9" fontWeight="bold" fontFamily="sans-serif" textAnchor="middle">GHN</text>
  </svg>
);

const ViettelPostIcon = () => (
  <svg width="48" height="24" viewBox="0 0 48 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="partner-logo">
    <rect width="48" height="24" rx="3" fill="#D32F2F"/>
    <text x="24" y="15" fill="#FFF" fontSize="9" fontWeight="bold" fontFamily="sans-serif" textAnchor="middle">vtpost</text>
  </svg>
);

const BoCongThuongBadge = () => (
  <a href="http://online.gov.vn" target="_blank" rel="noopener noreferrer" className="bocongthuong-badge">
    <svg width="110" height="40" viewBox="0 0 120 45" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="120" height="45" rx="4" fill="#0E4A8A"/>
      <circle cx="20" cy="22" r="14" fill="#D32F2F" stroke="#FFF" strokeWidth="1.5"/>
      <path d="M20 12L22.5 18H29L24 22L26 28L20 24.5L14 28L16 22L11 18H17.5L20 12Z" fill="#FFF"/>
      <text x="40" y="18" fill="#FFF" fontSize="6.5" fontWeight="bold" fontFamily="sans-serif">ĐÃ THÔNG BÁO</text>
      <text x="40" y="27" fill="#FFF" fontSize="6.5" fontWeight="bold" fontFamily="sans-serif">BỘ CÔNG THƯƠNG</text>
      <rect x="40" y="32" width="72" height="1.5" fill="#FFF"/>
    </svg>
  </a>
);

export default function Footer() {
  const footerColumns = buildFooterColumns();
  const quickLinks = buildQuickLinks();

  // Dynamic grid columns based on count (including the Showroom column)
  const colCount = Math.min(footerColumns.length + 1, 6);

  return (
    <footer className="footer">
      <div className="footer-inner">
        {/* Columns Grid — auto-synced from navItems + Contact Column */}
        <div
          className="footer-columns"
          style={{ gridTemplateColumns: `repeat(${colCount}, 1fr)` }}
        >
          {/* Cột thông tin Showroom & Liên hệ */}
          <div className="footer-col footer-col-contact">
            <h3 className="footer-col-title">Showroom & Liên hệ</h3>
            <ul className="footer-col-links">
              <li className="footer-contact-item">
                <MapPin size={14} className="contact-icon" />
                <span>{SHOWROOM_INFO.address}</span>
              </li>
              <li className="footer-contact-item">
                <Phone size={14} className="contact-icon" />
                <span>Mua hàng: <strong className="highlight-text">{SHOWROOM_INFO.hotlineSales}</strong></span>
              </li>
              <li className="footer-contact-item">
                <Phone size={14} className="contact-icon" />
                <span>Bảo hành: <strong className="highlight-text">{SHOWROOM_INFO.hotlineSupport}</strong></span>
              </li>
              <li className="footer-contact-item">
                <Mail size={14} className="contact-icon" />
                <a href={`mailto:${SHOWROOM_INFO.email}`} className="footer-link">{SHOWROOM_INFO.email}</a>
              </li>
              <li className="footer-contact-item">
                <Clock size={14} className="contact-icon" />
                <span>Mở cửa: {SHOWROOM_INFO.workingHours}</span>
              </li>
            </ul>
          </div>

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

        {/* Partners Row */}
        <div className="footer-partners">
          <div className="partner-group">
            <span className="partner-title">Phương thức thanh toán</span>
            <div className="partner-logos">
              <VisaIcon />
              <MastercardIcon />
              <MomoIcon />
              <ZalopayIcon />
              <VnpayIcon />
            </div>
          </div>
          <div className="partner-group">
            <span className="partner-title">Đối tác vận chuyển</span>
            <div className="partner-logos">
              <GhtkIcon />
              <GhnIcon />
              <ViettelPostIcon />
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="footer-bottom">
          <div className="footer-info-legal">
            <p className="footer-copyright">
              Copyright © {new Date().getFullYear()} {COMPANY_INFO.name}. Bảo lưu mọi quyền.
            </p>
            <p className="footer-legal-desc">
              {COMPANY_INFO.license} <br />
              {COMPANY_INFO.address}
            </p>
          </div>

          <div className="footer-right-widgets">
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

            <div className="footer-actions">
              <div className="footer-socials">
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="social-btn" aria-label="Facebook">
                  <FacebookIcon size={16} />
                </a>
                <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="social-btn" aria-label="YouTube">
                  <YoutubeIcon size={16} />
                </a>
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="social-btn" aria-label="Instagram">
                  <InstagramIcon size={16} />
                </a>
              </div>
              <BoCongThuongBadge />
            </div>
          </div>
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
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 24px;
        }

        /* ── Columns ─────────────────────────── */
        .footer-columns {
          display: grid;
          gap: 36px 32px;
          padding: 48px 0 36px;
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
          }
        }

        @media (max-width: 390px) {
          .footer-columns {
            grid-template-columns: 1fr !important;
          }
        }

        .footer-col {
          padding-right: 12px;
          padding-bottom: 12px;
        }

        .footer-col-title {
          font-size: 12px;
          font-weight: 600;
          color: #1d1d1f;
          letter-spacing: -0.01em;
          margin: 0 0 14px 0;
          line-height: 1.33;
        }

        .footer-col-links {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 10px;
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

        /* ── Contact details ── */
        .footer-contact-item {
          font-size: 12px;
          color: #6e6e73;
          line-height: 1.5;
          display: flex;
          gap: 10px;
          align-items: flex-start;
        }

        .contact-icon {
          color: #86868b;
          margin-top: 2px;
          flex-shrink: 0;
        }

        .highlight-text {
          color: #1d1d1f;
          font-weight: 600;
        }

        /* ── Partners Row ── */
        .footer-partners {
          display: flex;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 20px;
          padding: 28px 0;
          border-bottom: 1px solid #d2d2d7;
        }

        .partner-group {
          display: flex;
          align-items: center;
          gap: 12px;
          flex-wrap: wrap;
        }

        .partner-title {
          font-size: 11px;
          font-weight: 600;
          color: #86868b;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .partner-logos {
          display: flex;
          align-items: center;
          gap: 8px;
          flex-wrap: wrap;
        }

        .partner-logo {
          filter: grayscale(1) opacity(0.55);
          transition: all 0.2s ease;
        }

        .partner-logo:hover {
          filter: none;
          opacity: 1;
        }

        /* ── Bottom bar ──────────────────────── */
        .footer-bottom {
          padding: 28px 0 36px;
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 20px;
        }

        .footer-info-legal {
          flex: 1;
          min-width: 280px;
        }

        .footer-copyright {
          font-size: 12px;
          color: #6e6e73;
          margin: 0 0 6px 0;
          line-height: 1.33;
          font-weight: 500;
        }

        .footer-legal-desc {
          font-size: 11px;
          color: #86868b;
          margin: 0;
          line-height: 1.6;
        }

        .footer-right-widgets {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 12px;
        }

        @media (max-width: 768px) {
          .footer-bottom {
            flex-direction: column;
            align-items: flex-start;
          }
          .footer-right-widgets {
            align-items: flex-start;
            width: 100%;
          }
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

        /* Socials & Certifications */
        .footer-actions {
          display: flex;
          align-items: center;
          gap: 16px;
          flex-wrap: wrap;
        }

        .footer-socials {
          display: flex;
          gap: 8px;
        }

        .social-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 28px;
          height: 28px;
          border-radius: 50%;
          background-color: #e8e8ed;
          color: #515154;
          transition: all 0.2s ease;
        }

        .social-btn:hover {
          background-color: #1d1d1f;
          color: #fff;
        }

        .bocongthuong-badge {
          display: inline-block;
          transition: opacity 0.2s ease;
          opacity: 0.85;
        }

        .bocongthuong-badge:hover {
          opacity: 1;
        }
      `}</style>
    </footer>
  );
}
