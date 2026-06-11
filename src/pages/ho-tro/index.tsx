import { useEffect, useState, useRef } from "react";
import "./style.css";
import pcBanner from "./pc_banner.png";

interface Ticket {
  id: string;
  category: string;
  categoryLabel: string;
  productCategory: string;
  productName: string;
  serialNumber: string;
  purchaseDate: string;
  purchaseLocation: string;
  contactName: string;
  contactPhone: string;
  contactEmail: string;
  contactAddress: string;
  title: string;
  description: string;
  attachments: string[];
  status: string; // pending | processing | completed | cancelled
  createdAt: string;
}

const INITIAL_MOCK_TICKETS: Ticket[] = [
  {
    id: "TK-1024",
    category: "warranty",
    categoryLabel: "Bảo hành",
    productCategory: "pc",
    productName: "PC Showcase Ultra White AMD",
    serialNumber: "SN-982736154",
    purchaseDate: "2026-01-15",
    purchaseLocation: "online",
    contactName: "Nguyễn Hoàng Long",
    contactPhone: "0901234567",
    contactEmail: "long.nh@gmail.com",
    contactAddress: "123 Đường Láng, Đống Đa, Hà Nội",
    title: "Lỗi đèn LED quạt tản nhiệt không sáng",
    description: "Máy tính mình mua về chạy rất tốt nhưng hôm qua tự dưng bộ 3 quạt tản nhiệt phía trước bị mất đèn LED ARGB, cánh quạt vẫn quay bình thường. Mình đã kiểm tra phần mềm điều khiển LED nhưng không thấy nhận diện quạt.",
    attachments: ["led_loi.png", "mat_sau_case.jpg"],
    status: "processing",
    createdAt: "2026-06-08T10:30:00.000Z"
  },
  {
    id: "TK-1023",
    category: "consulting",
    categoryLabel: "Tư vấn kỹ thuật",
    productCategory: "laptop",
    productName: "Laptop ASUS ROG Strix G16",
    serialNumber: "ASUS-ROG-G16-2025",
    purchaseDate: "2025-11-20",
    purchaseLocation: "hcm_store",
    contactName: "Trần Minh Quân",
    contactPhone: "0987654321",
    contactEmail: "tmquan@yahoo.com",
    contactAddress: "456 Nguyễn Thị Minh Khai, Quận 1, TP. HCM",
    title: "Tư vấn nâng cấp RAM lên 32GB",
    description: "Mình đang sử dụng bản RAM 16GB (8GBx2) bus 4800MHz. Muốn hỏi bên kỹ thuật xem laptop này hỗ trợ nâng lên tối đa bao nhiêu GB? Nên lắp 1 thanh 32GB hay chạy dual channel 16GBx2? Bên cửa hàng có sẵn hàng không để mình mang qua nâng cấp lấy ngay.",
    attachments: [],
    status: "completed",
    createdAt: "2026-06-05T14:15:00.000Z"
  }
];

export default function HoTroIndex() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [currentView, setCurrentView] = useState<"home" | "create">("home");
  const [activeFilter, setActiveFilter] = useState<string>("all");
  const [activeSort, setActiveSort] = useState<string>("newest");

  // Form State
  const [requestType, setRequestType] = useState<string>("warranty");
  const [productCategory, setProductCategory] = useState<string>("");
  const [productName, setProductName] = useState<string>("");
  const [serialNumber, setSerialNumber] = useState<string>("");
  const [purchaseDate, setPurchaseDate] = useState<string>("");
  const [purchaseLocation, setPurchaseLocation] = useState<string>("");
  const [contactName, setContactName] = useState<string>("");
  const [contactPhone, setContactPhone] = useState<string>("");
  const [contactEmail, setContactEmail] = useState<string>("");
  const [contactAddress, setContactAddress] = useState<string>("");
  const [ticketTitle, setTicketTitle] = useState<string>("");
  const [ticketDescription, setTicketDescription] = useState<string>("");
  const [activeFiles, setActiveFiles] = useState<File[]>([]);
  
  // Validation classes
  const [errors, setErrors] = useState<Record<string, boolean>>({});

  // Dropdown drag state
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Detail Modal State
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Toast feedback
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Load tickets on mount
  useEffect(() => {
    fetch("http://localhost:3001/api/tickets")
      .then((res) => res.json())
      .then((data) => {
        setTickets(data);
      })
      .catch((err) => {
        console.error("Failed to fetch tickets from backend, falling back to localStorage:", err);
        const localData = localStorage.getItem("pcstore_tickets");
        if (localData) {
          setTickets(JSON.parse(localData));
        } else {
          setTickets(INITIAL_MOCK_TICKETS);
          localStorage.setItem("pcstore_tickets", JSON.stringify(INITIAL_MOCK_TICKETS));
        }
      });
  }, []);

  const saveTickets = (updated: Ticket[]) => {
    setTickets(updated);
    localStorage.setItem("pcstore_tickets", JSON.stringify(updated));
  };

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const scrollToTickets = () => {
    const section = document.getElementById("section-my-requests");
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  const openCreateForm = (cat: string) => {
    setRequestType(cat);
    setProductCategory("");
    setProductName("");
    setSerialNumber("");
    setPurchaseDate("");
    setPurchaseLocation("");
    setContactName("");
    setContactPhone("");
    setContactEmail("");
    setContactAddress("");
    setTicketTitle("");
    setTicketDescription("");
    setActiveFiles([]);
    setErrors({});
    setCurrentView("create");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Drag and Drop File Handlers
  const handleFiles = (fileList: FileList) => {
    const updated = [...activeFiles];
    for (let i = 0; i < fileList.length; i++) {
      const file = fileList[i];
      if (file.size > 10 * 1024 * 1024) {
        alert(`File "${file.name}" vượt quá giới hạn 10MB.`);
        continue;
      }
      if (!updated.some(f => f.name === file.name && f.size === file.size)) {
        updated.push(file);
      }
    }
    setActiveFiles(updated);
  };

  const removeFile = (idx: number) => {
    setActiveFiles(activeFiles.filter((_, i) => i !== idx));
  };

  const submitTicket = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validations
    const newErrors: Record<string, boolean> = {};
    if (!productCategory) newErrors.productCategory = true;
    if (!productName.trim()) newErrors.productName = true;
    if (!contactName.trim()) newErrors.contactName = true;
    
    const phoneRegex = /^[0-9]{9,11}$/;
    if (!contactPhone.trim() || !phoneRegex.test(contactPhone.trim())) newErrors.contactPhone = true;
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!contactEmail.trim() || !emailRegex.test(contactEmail.trim())) newErrors.contactEmail = true;
    
    if (!contactAddress.trim()) newErrors.contactAddress = true;
    if (!ticketTitle.trim()) newErrors.ticketTitle = true;
    if (!ticketDescription.trim()) newErrors.ticketDescription = true;

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      // Focus first error
      const firstErrorKey = Object.keys(newErrors)[0];
      const element = document.getElementById(firstErrorKey);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "center" });
        element.focus();
      }
      return;
    }

    const categoryLabels: Record<string, string> = {
      warranty: "Bảo hành",
      repair: "Sửa chữa",
      cleaning: "Vệ sinh",
      consulting: "Tư vấn kỹ thuật"
    };

    const newTicketId = `TK-${Math.floor(1000 + Math.random() * 9000)}`;
    const newTicket: Ticket = {
      id: newTicketId,
      category: requestType,
      categoryLabel: categoryLabels[requestType] || "Yêu cầu khác",
      productCategory,
      productName: productName.trim(),
      serialNumber: serialNumber.trim() || "N/A",
      purchaseDate: purchaseDate || "N/A",
      purchaseLocation: purchaseLocation || "N/A",
      contactName: contactName.trim(),
      contactPhone: contactPhone.trim(),
      contactEmail: contactEmail.trim(),
      contactAddress: contactAddress.trim(),
      title: ticketTitle.trim(),
      description: ticketDescription.trim(),
      attachments: activeFiles.map(f => f.name),
      status: "pending",
      createdAt: new Date().toISOString()
    };

    const updatedList = [newTicket, ...tickets];
    saveTickets(updatedList);

    fetch("http://localhost:3001/api/tickets", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newTicket)
    }).catch(err => console.error("Error submitting ticket to backend:", err));

    showToast(`Yêu cầu ${newTicketId} của bạn đã được gửi thành công!`);

    setTimeout(() => {
      setCurrentView("home");
    }, 1500);
  };

  const handleCancelTicket = (ticketId: string) => {
    if (confirm(`Bạn có chắc chắn muốn hủy bỏ yêu cầu hỗ trợ #${ticketId}?`)) {
      const updated = tickets.map(t => t.id === ticketId ? { ...t, status: "cancelled" } : t);
      saveTickets(updated);

      fetch("http://localhost:3001/api/tickets/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: ticketId, status: "cancelled" })
      }).catch(err => console.error("Error updating ticket on backend:", err));

      showToast(`Đã hủy yêu cầu #${ticketId}`);
      setIsModalOpen(false);
    }
  };

  // Filter & Sort dynamic data
  const filteredTickets = tickets
    .filter(t => activeFilter === "all" || t.status === activeFilter)
    .sort((a, b) => {
      const timeA = new Date(a.createdAt).getTime();
      const timeB = new Date(b.createdAt).getTime();
      return activeSort === "newest" ? timeB - timeA : timeA - timeB;
    });

  const activeCount = tickets.filter(t => t.status !== "cancelled" && t.status !== "completed").length;

  return (
    <div className="w-full bg-[#f8fafc] min-h-screen py-6 font-sans">
      <main className="main-content">
        
        {/* ═════════════════════════════════════════════════════════════════ */}
        {/* VIEW 1: SUPPORT HOME                                              */}
        {/* ═════════════════════════════════════════════════════════════════ */}
        {currentView === "home" && (
          <section className="view-section active">
            {/* Hero Banner */}
            <div className="support-hero">
              <div className="hero-content">
                <span className="hero-tag">HỖ TRỢ</span>
                <h1 className="hero-title text-zinc-950">Luôn bên bạn,<br />mọi lúc mọi nơi.</h1>
                <p className="hero-subtitle">Đội ngũ của chúng tôi luôn sẵn sàng hỗ trợ bạn nhanh chóng và tận tâm.</p>
                
                <button className="my-tickets-badge-btn" onClick={scrollToTickets}>
                  <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                    <polyline points="14 2 14 8 20 8"></polyline>
                    <line x1="16" y1="13" x2="8" y2="13"></line>
                    <line x1="16" y1="17" x2="8" y2="17"></line>
                    <polyline points="10 9 9 9 8 9"></polyline>
                  </svg>
                  <span>Bạn đang hiện có {activeCount} yêu cầu cần xử lý</span>
                  <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2.5" fill="none"><polyline points="9 18 15 12 9 6"></polyline></svg>
                </button>
              </div>
              <div className="hero-image-container">
                <img src={pcBanner} alt="Hỗ trợ PCStore" className="hero-image" />
              </div>
            </div>

            {/* Support Categories Grid */}
            <div className="support-cards-grid">
              {/* Warranty Card */}
              <div className="support-card">
                <div className="card-icon-wrapper red-theme">
                  <svg viewBox="0 0 24 24" width="28" height="28" stroke="currentColor" strokeWidth="2" fill="none">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                  </svg>
                </div>
                <h3 className="card-title">Bảo hành</h3>
                <p className="card-description">Hỗ trợ bảo hành chính hãng sản phẩm nhanh chóng.</p>
                <button className="btn btn-primary w-full cursor-pointer" onClick={() => openCreateForm("warranty")}>Tạo Ticket</button>
              </div>

              {/* Repair Card */}
              <div className="support-card">
                <div className="card-icon-wrapper orange-theme">
                  <svg viewBox="0 0 24 24" width="28" height="28" stroke="currentColor" stroke-width="2" fill="none">
                    <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path>
                  </svg>
                </div>
                <h3 className="card-title">Sửa chữa</h3>
                <p className="card-description">Tiếp nhận và xử lý các vấn đề sự cố kỹ thuật.</p>
                <button className="btn btn-primary w-full cursor-pointer" onClick={() => openCreateForm("repair")}>Tạo Ticket</button>
              </div>

              {/* Cleaning Card */}
              <div className="support-card">
                <div className="card-icon-wrapper blue-theme">
                  <svg viewBox="0 0 24 24" width="28" height="28" stroke="currentColor" stroke-width="2" fill="none">
                    <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                  </svg>
                </div>
                <h3 className="card-title">Vệ sinh</h3>
                <p className="card-description">Vệ sinh PC, laptop giúp thiết bị hoạt động ổn định hơn.</p>
                <button className="btn btn-primary w-full cursor-pointer" onClick={() => openCreateForm("cleaning")}>Tạo Ticket</button>
              </div>

              {/* Consulting Card */}
              <div className="support-card">
                <div className="card-icon-wrapper green-theme">
                  <svg viewBox="0 0 24 24" width="28" height="28" stroke="currentColor" stroke-width="2" fill="none">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                  </svg>
                </div>
                <h3 className="card-title">Tư vấn kỹ thuật</h3>
                <p className="card-description">Giải đáp thắc mắc và tư vấn cấu hình phù hợp.</p>
                <button className="btn btn-primary w-full cursor-pointer" onClick={() => openCreateForm("consulting")}>Tạo Ticket</button>
              </div>
            </div>

            {/* Your Requests Section */}
            <div id="section-my-requests" className="my-requests-section">
              <div className="section-header-row">
                <h2 className="section-title">Yêu cầu của bạn</h2>
                <div className="filter-controls">
                  {/* Status Tabs */}
                  <div className="status-tabs">
                    {["all", "pending", "processing", "completed", "cancelled"].map((status) => (
                      <button
                        key={status}
                        onClick={() => setActiveFilter(status)}
                        className={`tab-btn ${activeFilter === status ? "active" : ""}`}
                      >
                        {status === "all" ? "Tất cả" : status === "pending" ? "Chờ xử lý" : status === "processing" ? "Đang xử lý" : status === "completed" ? "Hoàn thành" : "Đã hủy"}
                      </button>
                    ))}
                  </div>
                  {/* Sort Select */}
                  <div className="sort-wrapper">
                    <select
                      value={activeSort}
                      onChange={(e) => setActiveSort(e.target.value)}
                      className="sort-select outline-none"
                    >
                      <option value="newest">Mới nhất</option>
                      <option value="oldest">Cũ nhất</option>
                    </select>
                    <svg className="select-arrow" viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none"><polyline points="6 9 12 15 18 9"></polyline></svg>
                  </div>
                </div>
              </div>

              {/* Dynamic list */}
              {filteredTickets.length === 0 ? (
                <div className="empty-requests-box">
                  <div className="empty-icon-wrapper">
                    <svg viewBox="0 0 24 24" width="72" height="72" stroke="currentColor" strokeWidth="1.2" fill="none">
                      <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
                    </svg>
                    <div className="empty-badge-zero">0</div>
                  </div>
                  <h4 className="empty-title">Bạn chưa có yêu cầu nào</h4>
                  <p className="empty-subtitle">Hãy tạo yêu cầu hỗ trợ mới, đội ngũ kĩ thuật của chúng tôi sẽ liên hệ trong thời gian sớm nhất.</p>
                  <button className="btn btn-dark cursor-pointer" onClick={() => openCreateForm("warranty")}>Tạo yêu cầu mới</button>
                </div>
              ) : (
                <div className="requests-grid-list">
                  {filteredTickets.map((ticket) => {
                    const dateObj = new Date(ticket.createdAt);
                    const dateStr = `${String(dateObj.getDate()).padStart(2, '0')}/${String(dateObj.getMonth() + 1).padStart(2, '0')}/${dateObj.getFullYear()}`;
                    
                    const themeClasses: Record<string, string> = {
                      warranty: "red-theme",
                      repair: "orange-theme",
                      cleaning: "blue-theme",
                      consulting: "green-theme"
                    };

                    const statusLabels: Record<string, string> = {
                      pending: "Chờ xử lý",
                      processing: "Đang xử lý",
                      completed: "Hoàn thành",
                      cancelled: "Đã hủy"
                    };

                    return (
                      <div key={ticket.id} className="ticket-row-item">
                        <div className={`ticket-row-icon-box ${themeClasses[ticket.category] || "blue-theme"}`}>
                          {ticket.category === "warranty" && (
                            <svg viewBox="0 0 24 24" width="22" height="22" stroke="currentColor" strokeWidth="2" fill="none"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
                          )}
                          {ticket.category === "repair" && (
                            <svg viewBox="0 0 24 24" width="22" height="22" stroke="currentColor" strokeWidth="2" fill="none"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path></svg>
                          )}
                          {ticket.category === "cleaning" && (
                            <svg viewBox="0 0 24 24" width="22" height="22" stroke="currentColor" strokeWidth="2" fill="none"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
                          )}
                          {ticket.category === "consulting" && (
                            <svg viewBox="0 0 24 24" width="22" height="22" stroke="currentColor" strokeWidth="2" fill="none"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
                          )}
                        </div>
                        <div className="ticket-row-details">
                          <div className="ticket-row-id-date">
                            <span className="ticket-id-tag"><strong>#{ticket.id}</strong></span>
                            <span className="divider-dot">•</span>
                            <div className="ticket-row-date">
                              <svg viewBox="0 0 24 24" width="13" height="13" stroke="currentColor" strokeWidth="2.5" fill="none"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                              <span>{dateStr}</span>
                            </div>
                            <span className="divider-dot">•</span>
                            <span className="ticket-cat-label">{ticket.categoryLabel}</span>
                          </div>
                          <div className="ticket-row-subject">{ticket.title}</div>
                        </div>
                        <div className="ticket-row-status">
                          <span className={`ticket-status-badge badge-${ticket.status}`}>{statusLabels[ticket.status]}</span>
                        </div>
                        <div className="ticket-row-action">
                          <button
                            className="btn btn-secondary cursor-pointer"
                            onClick={() => {
                              setSelectedTicket(ticket);
                              setIsModalOpen(true);
                            }}
                          >
                            Xem chi tiết
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Benefit Row */}
            <div className="benefits-row">
              <div className="benefit-item">
                <div className="benefit-icon">
                  <svg viewBox="0 0 24 24" width="22" height="22" stroke="currentColor" strokeWidth="2" fill="none"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                </div>
                <div>
                  <h4>Hỗ trợ nhanh chóng</h4>
                  <p>Phản hồi trong 24h</p>
                </div>
              </div>
              <div className="benefit-item">
                <div className="benefit-icon">
                  <svg viewBox="0 0 24 24" width="22" height="22" stroke="currentColor" strokeWidth="2" fill="none"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                </div>
                <div>
                  <h4>Kỹ thuật chuyên nghiệp</h4>
                  <p>Đội ngũ nhiều kinh nghiệm</p>
                </div>
              </div>
              <div className="benefit-item">
                <div className="benefit-icon">
                  <svg viewBox="0 0 24 24" width="22" height="22" stroke="currentColor" strokeWidth="2" fill="none"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
                </div>
                <div>
                  <h4>Theo dõi dễ dàng</h4>
                  <p>Cập nhật trạng thái liên tục</p>
                </div>
              </div>
              <div className="benefit-item">
                <div className="benefit-icon">
                  <svg viewBox="0 0 24 24" width="22" height="22" stroke="currentColor" strokeWidth="2" fill="none"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
                </div>
                <div>
                  <h4>Bảo mật thông tin</h4>
                  <p>Thông tin được bảo vệ</p>
                </div>
              </div>
            </div>

            {/* Workflow Section */}
            <div className="workflow-section">
              <h3 className="workflow-title">Quy trình hỗ trợ</h3>
              <p className="workflow-subtitle">Đơn giản – Nhanh chóng – Hiệu quả</p>

              <div className="workflow-steps-horizontal">
                <div className="step-card">
                  <div className="step-num">1</div>
                  <div className="step-icon-box">
                    <svg viewBox="0 0 24 24" width="28" height="28" stroke="currentColor" strokeWidth="2" fill="none">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                      <polyline points="14 2 14 8 20 8"></polyline>
                      <line x1="16" y1="13" x2="8" y2="13"></line>
                      <line x1="16" y1="17" x2="8" y2="17"></line>
                      <polyline points="10 9 9 9 8 9"></polyline>
                    </svg>
                  </div>
                  <h5>Tạo yêu cầu</h5>
                  <p>Chọn dịch vụ và gửi yêu cầu hỗ trợ của bạn.</p>
                </div>

                <div className="step-arrow">
                  <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2.5" fill="none"><polyline points="9 18 15 12 9 6"></polyline></svg>
                </div>

                <div className="step-card">
                  <div className="step-num">2</div>
                  <div className="step-icon-box">
                    <svg viewBox="0 0 24 24" width="28" height="28" stroke="currentColor" strokeWidth="2" fill="none">
                      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                    </svg>
                  </div>
                  <h5>Tiếp nhận</h5>
                  <p>Chúng tôi tiếp nhận và kiểm tra yêu cầu của bạn.</p>
                </div>

                <div className="step-arrow">
                  <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2.5" fill="none"><polyline points="9 18 15 12 9 6"></polyline></svg>
                </div>

                <div className="step-card">
                  <div className="step-num">3</div>
                  <div className="step-icon-box">
                    <svg viewBox="0 0 24 24" width="28" height="28" stroke="currentColor" strokeWidth="2" fill="none">
                      <circle cx="12" cy="12" r="3"></circle>
                      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
                    </svg>
                  </div>
                  <h5>Xử lý</h5>
                  <p>Kỹ thuật viên tiến hành xử lý và cập nhật trạng thái.</p>
                </div>

                <div className="step-arrow">
                  <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" stroke-width="2.5" fill="none"><polyline points="9 18 15 12 9 6"></polyline></svg>
                </div>

                <div className="step-card">
                  <div className="step-num">4</div>
                  <div className="step-icon-box">
                    <svg viewBox="0 0 24 24" width="28" height="28" stroke="currentColor" strokeWidth="2.5" fill="none">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  </div>
                  <h5>Hoàn thành</h5>
                  <p>Gửi kết quả và hỗ trợ sau dịch vụ.</p>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ═════════════════════════════════════════════════════════════════ */}
        {/* VIEW 2: CREATE TICKET FORM                                        */}
        {/* ═════════════════════════════════════════════════════════════════ */}
        {currentView === "create" && (
          <section className="view-section active">
            {/* Breadcrumbs */}
            <div className="breadcrumbs">
              <button onClick={() => setCurrentView("home")} className="hover:text-black transition-colors cursor-pointer bg-transparent border-none outline-none font-semibold">Trang chủ</button>
              <span className="divider">/</span>
              <button onClick={() => setCurrentView("home")} className="hover:text-black transition-colors cursor-pointer bg-transparent border-none outline-none font-semibold">Hỗ trợ</button>
              <span className="divider">/</span>
              <span className="current">Tạo Ticket</span>
            </div>

            {/* Page Title */}
            <div className="page-title-area">
              <h1 className="page-title text-zinc-950 font-extrabold">Tạo Ticket</h1>
              <p className="page-subtitle">Vui lòng điền đầy đủ thông tin để chúng tôi hỗ trợ bạn nhanh chóng.</p>
            </div>

            {/* Double-column Form Layout */}
            <div className="form-layout-grid">
              
              {/* Left Column Form */}
              <form onSubmit={submitTicket} className="ticket-form-card" noValidate>
                {/* SECTION 1: Select Request Type */}
                <div className="form-section">
                  <h3 className="form-section-title">1. Chọn loại yêu cầu</h3>
                  <div className="request-type-selector-grid">
                    
                    <label className={`type-selector-card ${requestType === "warranty" ? "active" : ""}`}>
                      <input type="radio" name="requestType" value="warranty" checked={requestType === "warranty"} onChange={() => setRequestType("warranty")} className="hidden" />
                      <span className="card-radio-custom">
                        {requestType === "warranty" && <svg className="check-icon" viewBox="0 0 24 24" width="12" height="12" stroke="white" strokeWidth="3" fill="none"><polyline points="20 6 9 17 4 12"></polyline></svg>}
                      </span>
                      <div className="type-icon-wrapper red-theme">
                        <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2.2" fill="none">
                          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                        </svg>
                      </div>
                      <span className="type-name">Bảo hành</span>
                      <span className="type-desc">Hỗ trợ bảo hành chính hãng sản phẩm nhanh chóng.</span>
                    </label>

                    <label className={`type-selector-card ${requestType === "repair" ? "active" : ""}`}>
                      <input type="radio" name="requestType" value="repair" checked={requestType === "repair"} onChange={() => setRequestType("repair")} className="hidden" />
                      <span className="card-radio-custom">
                        {requestType === "repair" && <svg className="check-icon" viewBox="0 0 24 24" width="12" height="12" stroke="white" strokeWidth="3" fill="none"><polyline points="20 6 9 17 4 12"></polyline></svg>}
                      </span>
                      <div className="type-icon-wrapper orange-theme">
                        <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2.2" fill="none">
                          <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path>
                        </svg>
                      </div>
                      <span className="type-name">Sửa chữa</span>
                      <span className="type-desc">Tiếp nhận và xử lý các vấn đề sự cố kỹ thuật.</span>
                    </label>

                    <label className={`type-selector-card ${requestType === "cleaning" ? "active" : ""}`}>
                      <input type="radio" name="requestType" value="cleaning" checked={requestType === "cleaning"} onChange={() => setRequestType("cleaning")} className="hidden" />
                      <span className="card-radio-custom">
                        {requestType === "cleaning" && <svg className="check-icon" viewBox="0 0 24 24" width="12" height="12" stroke="white" strokeWidth="3" fill="none"><polyline points="20 6 9 17 4 12"></polyline></svg>}
                      </span>
                      <div className="type-icon-wrapper blue-theme">
                        <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2.2" fill="none">
                          <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                        </svg>
                      </div>
                      <span className="type-name">Vệ sinh</span>
                      <span className="type-desc">Vệ sinh PC, laptop giúp thiết bị hoạt động ổn định hơn.</span>
                    </label>

                    <label className={`type-selector-card ${requestType === "consulting" ? "active" : ""}`}>
                      <input type="radio" name="requestType" value="consulting" checked={requestType === "consulting"} onChange={() => setRequestType("consulting")} className="hidden" />
                      <span className="card-radio-custom">
                        {requestType === "consulting" && <svg className="check-icon" viewBox="0 0 24 24" width="12" height="12" stroke="white" strokeWidth="3" fill="none"><polyline points="20 6 9 17 4 12"></polyline></svg>}
                      </span>
                      <div className="type-icon-wrapper green-theme">
                        <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2.2" fill="none">
                          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                        </svg>
                      </div>
                      <span className="type-name">Tư vấn kỹ thuật</span>
                      <span className="type-desc">Giải đáp thắc mắc và tư vấn cấu hình phù hợp.</span>
                    </label>

                  </div>
                </div>

                {/* SECTION 2: Product Information */}
                <div className="form-section">
                  <h3 className="form-section-title">2. Thông tin sản phẩm</h3>
                  
                  <div className="form-row two-cols">
                    <div className={`form-group ${errors.productCategory ? "invalid" : ""}`}>
                      <label htmlFor="productCategory" className="field-label required">Loại sản phẩm</label>
                      <div className="select-field-wrapper">
                        <select
                          id="productCategory"
                          value={productCategory}
                          onChange={(e) => {
                            setProductCategory(e.target.value);
                            setErrors({ ...errors, productCategory: false });
                          }}
                          required
                        >
                          <option value="" disabled>Chọn loại sản phẩm</option>
                          <option value="pc">Máy tính để bàn (PC)</option>
                          <option value="laptop">Laptop / Notebook</option>
                          <option value="component">Linh kiện PC (VGA, CPU, RAM...)</option>
                          <option value="peripheral">Thiết bị ngoại vi (Bàn phím, Chuột, Tai nghe...)</option>
                          <option value="other">Thiết bị khác</option>
                        </select>
                        <svg className="select-arrow" viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none"><polyline points="6 9 12 15 18 9"></polyline></svg>
                      </div>
                      {errors.productCategory && <span className="error-msg">Vui lòng chọn loại sản phẩm.</span>}
                    </div>

                    <div className={`form-group ${errors.productName ? "invalid" : ""}`}>
                      <label htmlFor="productName" className="field-label required">Tên sản phẩm / Model</label>
                      <input
                        type="text"
                        id="productName"
                        value={productName}
                        onChange={(e) => {
                          setProductName(e.target.value);
                          setErrors({ ...errors, productName: false });
                        }}
                        placeholder="Nhập tên sản phẩm hoặc model"
                        required
                      />
                      {errors.productName && <span className="error-msg">Vui lòng nhập tên sản phẩm.</span>}
                    </div>
                  </div>

                  <div className="form-row two-cols">
                    <div className="form-group">
                      <label htmlFor="serialNumber" className="field-label">Số serial / IMEI (nếu có)</label>
                      <input
                        type="text"
                        id="serialNumber"
                        value={serialNumber}
                        onChange={(e) => setSerialNumber(e.target.value)}
                        placeholder="Nhập số serial / IMEI"
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="purchaseDate" className="field-label">Ngày mua</label>
                      <div className="date-field-wrapper">
                        <input
                          type="date"
                          id="purchaseDate"
                          value={purchaseDate}
                          onChange={(e) => setPurchaseDate(e.target.value)}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="purchaseLocation" className="field-label">Nơi mua hàng</label>
                    <div className="select-field-wrapper">
                      <select
                        id="purchaseLocation"
                        value={purchaseLocation}
                        onChange={(e) => setPurchaseLocation(e.target.value)}
                      >
                        <option value="" disabled>Chọn nơi mua hàng</option>
                        <option value="hanoi_store">Chi nhánh Hà Nội (Thanh Xuân)</option>
                        <option value="hcm_store">Chi nhánh TP. HCM (Quận 1)</option>
                        <option value="online">Mua hàng Online (Website / Shopee / Lazada)</option>
                        <option value="other">Mua tại đại lý / Khác</option>
                      </select>
                      <svg className="select-arrow" viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none"><polyline points="6 9 12 15 18 9"></polyline></svg>
                    </div>
                  </div>
                </div>

                {/* SECTION 3: Contact Information */}
                <div className="form-section">
                  <h3 className="form-section-title">3. Thông tin liên hệ</h3>
                  
                  <div className="form-row two-cols">
                    <div className={`form-group ${errors.contactName ? "invalid" : ""}`}>
                      <label htmlFor="contactName" className="field-label required">Họ và tên</label>
                      <input
                        type="text"
                        id="contactName"
                        value={contactName}
                        onChange={(e) => {
                          setContactName(e.target.value);
                          setErrors({ ...errors, contactName: false });
                        }}
                        placeholder="Nhập họ và tên của bạn"
                        required
                      />
                      {errors.contactName && <span className="error-msg">Vui lòng nhập họ và tên của bạn.</span>}
                    </div>

                    <div className={`form-group ${errors.contactPhone ? "invalid" : ""}`}>
                      <label htmlFor="contactPhone" className="field-label required">Số điện thoại</label>
                      <input
                        type="tel"
                        id="contactPhone"
                        value={contactPhone}
                        onChange={(e) => {
                          setContactPhone(e.target.value);
                          setErrors({ ...errors, contactPhone: false });
                        }}
                        placeholder="Nhập số điện thoại"
                        required
                      />
                      {errors.contactPhone && <span className="error-msg">Vui lòng nhập số điện thoại hợp lệ.</span>}
                    </div>
                  </div>

                  <div className="form-row two-cols">
                    <div className={`form-group ${errors.contactEmail ? "invalid" : ""}`}>
                      <label htmlFor="contactEmail" className="field-label required">Email</label>
                      <input
                        type="email"
                        id="contactEmail"
                        value={contactEmail}
                        onChange={(e) => {
                          setContactEmail(e.target.value);
                          setErrors({ ...errors, contactEmail: false });
                        }}
                        placeholder="Nhập email của bạn"
                        required
                      />
                      {errors.contactEmail && <span className="error-msg">Vui lòng nhập địa chỉ email hợp lệ.</span>}
                    </div>

                    <div className={`form-group ${errors.contactAddress ? "invalid" : ""}`}>
                      <label htmlFor="contactAddress" className="field-label required">Địa chỉ</label>
                      <input
                        type="text"
                        id="contactAddress"
                        value={contactAddress}
                        onChange={(e) => {
                          setContactAddress(e.target.value);
                          setErrors({ ...errors, contactAddress: false });
                        }}
                        placeholder="Nhập địa chỉ của bạn"
                        required
                      />
                      {errors.contactAddress && <span className="error-msg">Vui lòng nhập địa chỉ để hỗ trợ dịch vụ.</span>}
                    </div>
                  </div>
                </div>

                {/* SECTION 4: Problem Description */}
                <div className="form-section">
                  <h3 className="form-section-title">4. Mô tả vấn đề</h3>
                  
                  <div className={`form-group ${errors.ticketTitle ? "invalid" : ""}`}>
                    <label htmlFor="ticketTitle" className="field-label required">Tiêu đề yêu cầu</label>
                    <input
                      type="text"
                      id="ticketTitle"
                      value={ticketTitle}
                      onChange={(e) => {
                        setTicketTitle(e.target.value);
                        setErrors({ ...errors, ticketTitle: false });
                      }}
                      placeholder="Nhập tiêu đề ngắn gọn"
                      required
                    />
                    {errors.ticketTitle && <span className="error-msg">Vui lòng nhập tiêu đề yêu cầu hỗ trợ.</span>}
                  </div>

                  <div className={`form-group ${errors.ticketDescription ? "invalid" : ""}`}>
                    <label htmlFor="ticketDescription" className="field-label required">Mô tả chi tiết</label>
                    <div className="textarea-wrapper">
                      <textarea
                        id="ticketDescription"
                        value={ticketDescription}
                        onChange={(e) => {
                          setTicketDescription(e.target.value);
                          setErrors({ ...errors, ticketDescription: false });
                        }}
                        rows={6}
                        maxLength={1000}
                        placeholder="Vui lòng mô tả chi tiết vấn đề..."
                        required
                      />
                      <span className="char-count">{ticketDescription.length}/1000</span>
                    </div>
                    {errors.ticketDescription && <span className="error-msg">Vui lòng mô tả chi tiết vấn đề.</span>}
                  </div>

                  <div className="form-group">
                    <label className="field-label">Tệp đính kèm (nếu có)</label>
                    <div
                      className={`file-drop-area ${isDragOver ? "drag-over" : ""}`}
                      onDragEnter={(e) => { e.preventDefault(); setIsDragOver(true); }}
                      onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
                      onDragLeave={(e) => { e.preventDefault(); setIsDragOver(false); }}
                      onDrop={(e) => { e.preventDefault(); setIsDragOver(false); if (e.dataTransfer.files) handleFiles(e.dataTransfer.files); }}
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <input
                        type="file"
                        ref={fileInputRef}
                        multiple
                        className="hidden"
                        accept="image/*,application/pdf,video/*"
                        onChange={(e) => { if (e.target.files) handleFiles(e.target.files); }}
                      />
                      <div className="drop-area-content">
                        <svg className="upload-icon" viewBox="0 0 24 24" width="36" height="36" stroke="currentColor" strokeWidth="1.8" fill="none">
                          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                          <polyline points="17 8 12 3 7 8"></polyline>
                          <line x1="12" y1="3" x2="12" y2="15"></line>
                        </svg>
                        <p className="drop-text-primary">Kéo thả file vào đây hoặc bấm để chọn file</p>
                        <p className="drop-text-secondary">Hỗ trợ: JPG, PNG, PDF, MP4 (Tối đa 10MB / file)</p>
                      </div>
                    </div>
                    
                    {/* Uploaded Files */}
                    {activeFiles.length > 0 && (
                      <div className="uploaded-files-list">
                        {activeFiles.map((file, index) => {
                          const sizeMB = (file.size / (1024 * 1024)).toFixed(2);
                          return (
                            <div key={index} className="uploaded-file-item">
                              <div className="file-item-info">
                                <svg className="file-item-icon" viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2.5" fill="none">
                                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                                  <polyline points="14 2 14 8 20 8"></polyline>
                                  <line x1="16" y1="13" x2="8" y2="13"></line>
                                  <line x1="16" y1="17" x2="8" y2="17"></line>
                                </svg>
                                <span><strong>{file.name}</strong> ({sizeMB} MB)</span>
                              </div>
                              <button type="button" className="file-item-remove-btn" onClick={(e) => { e.stopPropagation(); removeFile(index); }} aria-label="Xóa">
                                <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2.5" fill="none"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>

                {/* Form Action Controls */}
                <div className="form-actions-row">
                  <button type="button" className="btn btn-secondary cursor-pointer" onClick={() => setCurrentView("home")}>Hủy bỏ</button>
                  <button type="submit" className="btn btn-dark cursor-pointer">Gửi yêu cầu</button>
                </div>
              </form>

              {/* Right Column Help Sidebar */}
              <aside className="form-helper-sidebar">
                <div className="sidebar-widget info-widget">
                  <h4 className="widget-title">Quy trình hỗ trợ</h4>
                  <div className="vertical-steps-timeline">
                    <div className="vertical-step active">
                      <div className="step-badge">1</div>
                      <div className="step-details">
                        <h5>Tạo yêu cầu</h5>
                        <p>Chọn dịch vụ và gửi yêu cầu hỗ trợ của bạn.</p>
                      </div>
                    </div>
                    <div className="vertical-step">
                      <div className="step-badge">2</div>
                      <div className="step-details">
                        <h5>Tiếp nhận</h5>
                        <p>Chúng tôi tiếp nhận và kiểm tra yêu cầu của bạn.</p>
                      </div>
                    </div>
                    <div className="vertical-step">
                      <div className="step-badge">3</div>
                      <div className="step-details">
                        <h5>Xử lý</h5>
                        <p>Kỹ thuật viên tiến hành xử lý và cập nhật trạng thái.</p>
                      </div>
                    </div>
                    <div className="vertical-step">
                      <div className="step-badge">4</div>
                      <div className="step-details">
                        <h5>Hoàn thành</h5>
                        <p>Gửi kết quả và hỗ trợ sau dịch vụ.</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="sidebar-widget notices-widget">
                  <h4 className="widget-title">Thông tin lưu ý</h4>
                  <ul className="notices-list">
                    <li>
                      <div className="notice-icon orange-theme">
                        <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                      </div>
                      <div className="notice-body">
                        <h5>Thời gian phản hồi</h5>
                        <p>Chúng tôi phản hồi trong vòng 24 giờ làm việc.</p>
                      </div>
                    </li>
                    <li>
                      <div className="notice-icon green-theme">
                        <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                      </div>
                      <div className="notice-body">
                        <h5>Thông tin chính xác</h5>
                        <p>Cung cấp đầy đủ thông tin giúp hỗ trợ nhanh hơn.</p>
                      </div>
                    </li>
                    <li>
                      <div className="notice-icon blue-theme">
                        <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                      </div>
                      <div className="notice-body">
                        <h5>Bảo mật thông tin</h5>
                        <p>Thông tin của bạn được bảo mật tuyệt đối.</p>
                      </div>
                    </li>
                    <li>
                      <div className="notice-icon red-theme">
                        <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                      </div>
                      <div className="notice-body">
                        <h5>Hỗ trợ khẩn cấp</h5>
                        <p>Liên hệ <strong>1900 1234</strong> hoặc email <strong>support@pcstore.vn</strong></p>
                      </div>
                    </li>
                  </ul>
                </div>
              </aside>

            </div>
          </section>
        )}

      </main>

      {/* ═════════════════════════════════════════════════════════════════ */}
      {/* TICKET DETAIL MODAL                                               */}
      {/* ═════════════════════════════════════════════════════════════════ */}
      {isModalOpen && selectedTicket && (
        <div className="modal-overlay active" onClick={() => setIsModalOpen(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={() => setIsModalOpen(false)} aria-label="Đóng">
              <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>
            <div className="modal-header">
              <span className="modal-ticket-id">#{selectedTicket.id}</span>
              <h3 className="modal-title">{selectedTicket.title}</h3>
              <span className={`ticket-status-badge badge-${selectedTicket.status}`}>
                {selectedTicket.status === "pending" ? "Chờ xử lý" : selectedTicket.status === "processing" ? "Đang xử lý" : selectedTicket.status === "completed" ? "Hoàn thành" : "Đã hủy"}
              </span>
            </div>
            
            <div className="modal-body-content">
              {/* Timeline Status */}
              <div className="modal-timeline-container">
                <h4 className="details-section-heading">Trạng thái xử lý</h4>
                <div className="modal-steps-horizontal">
                  <div className={`modal-step-node ${selectedTicket.status !== "cancelled" ? "completed" : "cancelled"}`}>
                    <div className="node-circle">
                      {selectedTicket.status !== "cancelled" ? (
                        <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" strokeWidth="3" fill="none"><polyline points="20 6 9 17 4 12"></polyline></svg>
                      ) : "✕"}
                    </div>
                    <span className="node-label">Tạo yêu cầu</span>
                  </div>
                  
                  <div className={`modal-step-line ${["processing", "completed"].includes(selectedTicket.status) ? "completed" : selectedTicket.status === "cancelled" ? "cancelled" : ""}`}></div>
                  
                  <div className={`modal-step-node ${["processing", "completed"].includes(selectedTicket.status) ? "completed" : selectedTicket.status === "cancelled" ? "cancelled" : selectedTicket.status === "pending" ? "active" : ""}`}>
                    <div className="node-circle">
                      {["processing", "completed"].includes(selectedTicket.status) ? (
                        <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" strokeWidth="3" fill="none"><polyline points="20 6 9 17 4 12"></polyline></svg>
                      ) : selectedTicket.status === "cancelled" ? "✕" : "2"}
                    </div>
                    <span className="node-label">Tiếp nhận</span>
                  </div>
                  
                  <div className={`modal-step-line ${selectedTicket.status === "completed" ? "completed" : selectedTicket.status === "cancelled" ? "cancelled" : ""}`}></div>
                  
                  <div className={`modal-step-node ${selectedTicket.status === "completed" ? "completed" : selectedTicket.status === "cancelled" ? "cancelled" : selectedTicket.status === "processing" ? "active" : ""}`}>
                    <div className="node-circle">
                      {selectedTicket.status === "completed" ? (
                        <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" strokeWidth="3" fill="none"><polyline points="20 6 9 17 4 12"></polyline></svg>
                      ) : selectedTicket.status === "cancelled" ? "✕" : "3"}
                    </div>
                    <span className="node-label">Xử lý</span>
                  </div>
                  
                  <div className={`modal-step-line ${selectedTicket.status === "completed" ? "completed" : selectedTicket.status === "cancelled" ? "cancelled" : ""}`}></div>
                  
                  <div className={`modal-step-node ${selectedTicket.status === "completed" ? "completed" : selectedTicket.status === "cancelled" ? "cancelled" : ""}`}>
                    <div className="node-circle">
                      {selectedTicket.status === "completed" ? (
                        <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" strokeWidth="3" fill="none"><polyline points="20 6 9 17 4 12"></polyline></svg>
                      ) : selectedTicket.status === "cancelled" ? "✕" : "4"}
                    </div>
                    <span className="node-label">Hoàn thành</span>
                  </div>
                </div>
              </div>

              <div className="modal-details-grid">
                {/* Col 1 */}
                <div className="details-column">
                  <div className="details-block">
                    <h4 className="details-section-heading">Thông tin sản phẩm</h4>
                    <table className="details-table">
                      <tbody>
                        <tr>
                          <th>Loại dịch vụ:</th>
                          <td>{selectedTicket.categoryLabel}</td>
                        </tr>
                        <tr>
                          <th>Loại sản phẩm:</th>
                          <td>{selectedTicket.productCategory === "pc" ? "Máy tính để bàn (PC)" : selectedTicket.productCategory === "laptop" ? "Laptop / Notebook" : selectedTicket.productCategory === "component" ? "Linh kiện PC" : selectedTicket.productCategory === "peripheral" ? "Thiết bị ngoại vi" : "Khác"}</td>
                        </tr>
                        <tr>
                          <th>Tên sản phẩm:</th>
                          <td>{selectedTicket.productName}</td>
                        </tr>
                        <tr>
                          <th>Số Serial/IMEI:</th>
                          <td>{selectedTicket.serialNumber}</td>
                        </tr>
                        <tr>
                          <th>Ngày mua:</th>
                          <td>{selectedTicket.purchaseDate}</td>
                        </tr>
                        <tr>
                          <th>Nơi mua:</th>
                          <td>{selectedTicket.purchaseLocation === "hanoi_store" ? "Chi nhánh Hà Nội" : selectedTicket.purchaseLocation === "hcm_store" ? "Chi nhánh TP. HCM" : selectedTicket.purchaseLocation === "online" ? "Mua Online" : "Nơi khác"}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  <div className="details-block">
                    <h4 className="details-section-heading">Thông tin liên hệ</h4>
                    <table className="details-table">
                      <tbody>
                        <tr>
                          <th>Khách hàng:</th>
                          <td>{selectedTicket.contactName}</td>
                        </tr>
                        <tr>
                          <th>Số điện thoại:</th>
                          <td>{selectedTicket.contactPhone}</td>
                        </tr>
                        <tr>
                          <th>Email:</th>
                          <td>{selectedTicket.contactEmail}</td>
                        </tr>
                        <tr>
                          <th>Địa chỉ:</th>
                          <td>{selectedTicket.contactAddress}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Col 2 */}
                <div className="details-column">
                  <div className="details-block">
                    <h4 className="details-section-heading">Chi tiết vấn đề</h4>
                    <p className="detail-description-text">{selectedTicket.description}</p>
                  </div>

                  {selectedTicket.attachments && selectedTicket.attachments.length > 0 && (
                    <div className="details-block">
                      <h4 className="details-section-heading">Tệp đính kèm</h4>
                      <div className="detail-attachments-list">
                        {selectedTicket.attachments.map((file, fidx) => (
                          <button
                            key={fidx}
                            onClick={() => alert(`Đang mở tải file: ${file}`)}
                            className="detail-attachment-link bg-transparent border-none cursor-pointer flex items-center gap-1.5"
                          >
                            <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" strokeWidth="2.5" fill="none">
                              <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"></path>
                            </svg>
                            <span>{file}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            <div className="modal-footer">
              <button className="btn btn-secondary cursor-pointer" onClick={() => setIsModalOpen(false)}>Đóng</button>
              {selectedTicket.status === "pending" && (
                <button className="btn btn-danger cursor-pointer" onClick={() => handleCancelTicket(selectedTicket.id)}>Hủy yêu cầu này</button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TOAST FEEDBACK */}
      {toastMessage && (
        <div className="toast-card active">
          <div className="toast-icon-wrapper">
            <svg viewBox="0 0 24 24" width="20" height="20" stroke="white" strokeWidth="3" fill="none"><polyline points="20 6 9 17 4 12"></polyline></svg>
          </div>
          <div className="toast-body">
            <h5 className="toast-title text-white">Thành công!</h5>
            <p className="toast-message text-white/95">{toastMessage}</p>
          </div>
        </div>
      )}

    </div>
  );
}
