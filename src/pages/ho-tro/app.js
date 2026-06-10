// ================================================================= //
// SUPPORT MODULE LOGIC: STATE MANAGEMENT & ROUTING                  //
// ================================================================= //

// Initial Seed Data for E-Commerce demo (to prevent empty look on first load)
const INITIAL_MOCK_TICKETS = [
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
        status: "processing", // pending | processing | completed | cancelled
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

class SupportTicketSystem {
    constructor() {
        this.tickets = [];
        this.activeFiles = []; // Temporary store for files selected in form
        this.currentView = "support-home"; // support-home | create-ticket
        this.activeFilterStatus = "all";
        this.activeSortOrder = "newest";
        this.activePreselectedCategory = "warranty";

        this.init();
    }

    init() {
        // Load existing tickets or seed mock data
        const localData = localStorage.getItem("pcstore_tickets");
        if (localData) {
            this.tickets = JSON.parse(localData);
        } else {
            this.tickets = [...INITIAL_MOCK_TICKETS];
            localStorage.setItem("pcstore_tickets", JSON.stringify(this.tickets));
        }

        // Cache DOM elements
        this.cacheDOM();
        // Bind UI Events
        this.bindEvents();
        // Initial Page Render
        this.render();
    }

    cacheDOM() {
        // Layout views
        this.viewSupportHome = document.getElementById("view-support-home");
        this.viewCreateTicket = document.getElementById("view-create-ticket");
        
        // Navigation / Breadcrumbs elements
        this.navSupportLink = document.getElementById("nav-support-link");
        this.navLogo = document.getElementById("nav-logo");
        this.btnScrollTickets = document.getElementById("btn-scroll-tickets");
        this.btnBreadcrumbHome = document.querySelector(".btn-breadcrumb-home");
        this.btnBreadcrumbSupport = document.querySelector(".btn-breadcrumb-support");
        
        // Form & Inputs
        this.ticketForm = document.getElementById("ticket-form");
        this.btnCancelForm = document.getElementById("btn-cancel-form");
        this.textareaDescription = document.getElementById("ticket-description");
        this.charCounter = document.getElementById("textarea-char-count");
        this.fileDropArea = document.getElementById("file-drop-area");
        this.fileInputHidden = document.getElementById("fileAttachment");
        this.uploadedFilesList = document.getElementById("uploaded-files-list");

        // Filter / Listing nodes
        this.statusTabsContainer = document.getElementById("status-tabs-container");
        this.sortSelect = document.getElementById("sort-select");
        this.requestsListContainer = document.getElementById("requests-list-container");
        this.bannerTicketCountText = document.getElementById("banner-ticket-count-text");

        // Details Modal nodes
        this.detailModal = document.getElementById("ticket-detail-modal");
        this.btnCloseDetailModal = document.getElementById("btn-close-detail-modal");
        this.btnCloseDetailFooter = document.getElementById("btn-close-detail-footer");
        this.btnCancelTicketAction = document.getElementById("btn-cancel-ticket-action");
        this.modalTicketId = document.getElementById("modal-ticket-id");
        this.modalTicketTitle = document.getElementById("modal-ticket-title");
        this.modalTicketStatus = document.getElementById("modal-ticket-status");
        
        // Modal detail fields
        this.modalDetailService = document.getElementById("modal-detail-service");
        this.modalDetailCategory = document.getElementById("modal-detail-category");
        this.modalDetailName = document.getElementById("modal-detail-name");
        this.modalDetailSerial = document.getElementById("modal-detail-serial");
        this.modalDetailPurchaseDate = document.getElementById("modal-detail-purchasedate");
        this.modalDetailLocation = document.getElementById("modal-detail-location");
        this.modalDetailFullName = document.getElementById("modal-detail-fullname");
        this.modalDetailPhone = document.getElementById("modal-detail-phone");
        this.modalDetailEmail = document.getElementById("modal-detail-email");
        this.modalDetailAddress = document.getElementById("modal-detail-address");
        this.modalDetailDescription = document.getElementById("modal-detail-description");
        this.modalDetailAttachments = document.getElementById("modal-detail-attachments");
        this.modalDetailFilesBlock = document.getElementById("modal-detail-files-block");

        // Toast
        this.toastNotification = document.getElementById("toast-notification");
        this.toastMessageText = document.getElementById("toast-message-text");
    }

    bindEvents() {
        // SPA View routing buttons
        if (this.navLogo) this.navLogo.addEventListener("click", (e) => { e.preventDefault(); this.switchView("support-home"); });
        if (this.navSupportLink) this.navSupportLink.addEventListener("click", (e) => { e.preventDefault(); this.switchView("support-home"); });
        if (this.btnBreadcrumbHome) this.btnBreadcrumbHome.addEventListener("click", (e) => { e.preventDefault(); this.switchView("support-home"); });
        if (this.btnBreadcrumbSupport) this.btnBreadcrumbSupport.addEventListener("click", (e) => { e.preventDefault(); this.switchView("support-home"); });
        
        // Scroll banner button
        if (this.btnScrollTickets) {
            this.btnScrollTickets.addEventListener("click", () => {
                const reqSec = document.getElementById("section-my-requests");
                if (reqSec) {
                    reqSec.scrollIntoView({ behavior: "smooth" });
                }
            });
        }

        // Support Cards Grid creates pre-selected ticket category
        document.querySelectorAll(".btn-create-ticket-from-card").forEach(button => {
            button.addEventListener("click", (e) => {
                const cat = e.target.getAttribute("data-category");
                this.openCreateTicketForm(cat);
            });
        });

        // Tabs status filter clicks
        if (this.statusTabsContainer) {
            this.statusTabsContainer.addEventListener("click", (e) => {
                const tab = e.target.closest(".tab-btn");
                if (!tab) return;
                
                // Set active tab class
                this.statusTabsContainer.querySelectorAll(".tab-btn").forEach(b => b.classList.remove("active"));
                tab.classList.add("active");

                this.activeFilterStatus = tab.getAttribute("data-status");
                this.renderTicketList();
            });
        }

        // Sorting selects change
        if (this.sortSelect) {
            this.sortSelect.addEventListener("change", (e) => {
                this.activeSortOrder = e.target.value;
                this.renderTicketList();
            });
        }

        // Form Description text-counter check
        if (this.textareaDescription) {
            this.textareaDescription.addEventListener("input", (e) => {
                const length = e.target.value.length;
                this.charCounter.textContent = `${length}/1000`;
            });
        }

        // Drag and Drop files
        if (this.fileDropArea) {
            ["dragenter", "dragover"].forEach(eventName => {
                this.fileDropArea.addEventListener(eventName, (e) => {
                    e.preventDefault();
                    this.fileDropArea.classList.add("drag-over");
                }, false);
            });

            ["dragleave", "drop"].forEach(eventName => {
                this.fileDropArea.addEventListener(eventName, (e) => {
                    e.preventDefault();
                    this.fileDropArea.classList.remove("drag-over");
                }, false);
            });

            this.fileDropArea.addEventListener("drop", (e) => {
                const dt = e.dataTransfer;
                const files = dt.files;
                this.handleFiles(files);
            });

            this.fileDropArea.addEventListener("click", () => {
                this.fileInputHidden.click();
            });

            this.fileInputHidden.addEventListener("change", (e) => {
                this.handleFiles(e.target.files);
            });
        }

        // Form Submit
        if (this.ticketForm) {
            this.ticketForm.addEventListener("submit", (e) => {
                e.preventDefault();
                this.submitTicket();
            });
        }

        // Form Cancel
        if (this.btnCancelForm) {
            this.btnCancelForm.addEventListener("click", () => {
                this.switchView("support-home");
            });
        }

        // Modal closures
        if (this.btnCloseDetailModal) this.btnCloseDetailModal.addEventListener("click", () => this.closeDetailModal());
        if (this.btnCloseDetailFooter) this.btnCloseDetailFooter.addEventListener("click", () => this.closeDetailModal());
        
        // Window click closing modals
        window.addEventListener("click", (e) => {
            if (e.target === this.detailModal) {
                this.closeDetailModal();
            }
        });
    }

    switchView(viewName) {
        this.currentView = viewName;
        window.scrollTo({ top: 0, behavior: "smooth" });

        if (viewName === "support-home") {
            this.viewSupportHome.classList.add("active");
            this.viewCreateTicket.classList.remove("active");
            this.navSupportLink.classList.add("active");
            this.render(); // Redraw homepage to pick up updates
        } else if (viewName === "create-ticket") {
            this.viewSupportHome.classList.remove("active");
            this.viewCreateTicket.classList.add("active");
            this.navSupportLink.classList.remove("active"); // hide active navigation styling if typing ticket
            this.resetForm();
        }
    }

    openCreateTicketForm(preselectedCategory = "warranty") {
        this.activePreselectedCategory = preselectedCategory;
        this.switchView("create-ticket");

        // Find the matching radio button and check it
        const radio = this.ticketForm.querySelector(`input[name="requestType"][value="${preselectedCategory}"]`);
        if (radio) {
            radio.checked = true;
        }
    }

    handleFiles(fileList) {
        for (let i = 0; i < fileList.length; i++) {
            const file = fileList[i];
            
            // Check size (10MB limit)
            if (file.size > 10 * 1024 * 1024) {
                alert(`File "${file.name}" vượt quá giới hạn dung lượng 10MB.`);
                continue;
            }

            // Check if already in list
            if (this.activeFiles.some(f => f.name === file.name && f.size === file.size)) {
                continue;
            }

            this.activeFiles.push(file);
        }
        this.renderUploadedFiles();
    }

    removeFile(index) {
        this.activeFiles.splice(index, 1);
        this.renderUploadedFiles();
    }

    renderUploadedFiles() {
        this.uploadedFilesList.innerHTML = "";
        
        this.activeFiles.forEach((file, index) => {
            const sizeMB = (file.size / (1024 * 1024)).toFixed(2);
            const item = document.createElement("div");
            item.className = "uploaded-file-item";
            item.innerHTML = `
                <div class="file-item-info">
                    <svg class="file-item-icon" viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2.5" fill="none">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                        <polyline points="14 2 14 8 20 8"></polyline>
                        <line x1="16" y1="13" x2="8" y2="13"></line>
                        <line x1="16" y1="17" x2="8" y2="17"></line>
                    </svg>
                    <span><strong>${file.name}</strong> (${sizeMB} MB)</span>
                </div>
                <button type="button" class="file-item-remove-btn" data-index="${index}" aria-label="Xóa">
                    <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2.5" fill="none"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                </button>
            `;

            // Bind click remove
            item.querySelector(".file-item-remove-btn").addEventListener("click", () => {
                this.removeFile(index);
            });

            this.uploadedFilesList.appendChild(item);
        });
    }

    resetForm() {
        this.ticketForm.reset();
        this.activeFiles = [];
        this.renderUploadedFiles();
        if (this.charCounter) this.charCounter.textContent = "0/1000";

        // Remove invalid classes
        this.ticketForm.querySelectorAll(".form-group").forEach(group => {
            group.classList.remove("invalid");
        });
    }

    // ================================================================= //
    // SUPPORT MODULE LOGIC: FORM VALIDATION & SUBMISSION               //
    // ================================================================= //
    submitTicket() {
        let isFormValid = true;
        const requiredInputs = this.ticketForm.querySelectorAll("[required]");

        requiredInputs.forEach(input => {
            const formGroup = input.closest(".form-group");
            
            // Standard validation checks
            let isFieldValid = true;
            if (input.type === "email") {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                isFieldValid = emailRegex.test(input.value);
            } else if (input.type === "tel") {
                const phoneRegex = /^[0-9]{9,11}$/;
                isFieldValid = phoneRegex.test(input.value.trim());
            } else {
                isFieldValid = input.value.trim() !== "";
            }

            if (!isFieldValid) {
                formGroup.classList.add("invalid");
                isFormValid = false;
            } else {
                formGroup.classList.remove("invalid");
            }

            // Real-time error removal when typing/selecting
            const clearError = () => {
                formGroup.classList.remove("invalid");
                input.removeEventListener("input", clearError);
                input.removeEventListener("change", clearError);
            };
            input.addEventListener("input", clearError);
            input.addEventListener("change", clearError);
        });

        if (!isFormValid) {
            // Scroll to the first invalid field
            const firstInvalid = this.ticketForm.querySelector(".form-group.invalid");
            if (firstInvalid) {
                firstInvalid.scrollIntoView({ behavior: "smooth", block: "center" });
                const field = firstInvalid.querySelector("input, select, textarea");
                if (field) field.focus();
            }
            return;
        }

        // Construct ticket data
        const formData = new FormData(this.ticketForm);
        const category = formData.get("requestType");
        const categoryLabels = {
            warranty: "Bảo hành",
            repair: "Sửa chữa",
            cleaning: "Vệ sinh",
            consulting: "Tư vấn kỹ thuật"
        };

        const newTicketId = `TK-${Math.floor(1000 + Math.random() * 9000)}`;

        const newTicket = {
            id: newTicketId,
            category: category,
            categoryLabel: categoryLabels[category] || "Yêu cầu khác",
            productCategory: formData.get("productCategory"),
            productName: formData.get("productName").trim(),
            serialNumber: formData.get("serialNumber").trim() || "N/A",
            purchaseDate: formData.get("purchaseDate") || "N/A",
            purchaseLocation: formData.get("purchaseLocation") || "N/A",
            contactName: formData.get("contactName").trim(),
            contactPhone: formData.get("contactPhone").trim(),
            contactEmail: formData.get("contactEmail").trim(),
            contactAddress: formData.get("contactAddress").trim(),
            title: formData.get("ticketTitle").trim(),
            description: formData.get("ticketDescription").trim(),
            attachments: this.activeFiles.map(file => file.name),
            status: "pending", // Always starts as Chờ xử lý
            createdAt: new Date().toISOString()
        };

        // Add to array, save to localStorage
        this.tickets.unshift(newTicket);
        localStorage.setItem("pcstore_tickets", JSON.stringify(this.tickets));

        // Show Toast Feedback
        this.showToast(`Yêu cầu ${newTicketId} của bạn đã được gửi thành công!`);

        // Navigate home
        setTimeout(() => {
            this.switchView("support-home");
        }, 1500);
    }

    showToast(message) {
        if (!this.toastNotification) return;
        this.toastMessageText.textContent = message;
        this.toastNotification.classList.add("active");
        
        setTimeout(() => {
            this.toastNotification.classList.remove("active");
        }, 4000);
    }

    // ================================================================= //
    // SUPPORT MODULE LOGIC: RENDERING DYNAMIC LIST & TIMELINES          //
    // ================================================================= //
    render() {
        // Update Banner counter
        this.updateBannerCount();
        // Draw Ticket Listing
        this.renderTicketList();
    }

    updateBannerCount() {
        if (!this.bannerTicketCountText) return;
        const activeCount = this.tickets.filter(t => t.status !== "cancelled" && t.status !== "completed").length;
        this.bannerTicketCountText.textContent = `Bạn đang hiện có ${activeCount} yêu cầu cần xử lý`;
    }

    renderTicketList() {
        this.requestsListContainer.innerHTML = "";

        // 1. Filter tickets
        let filtered = [...this.tickets];
        if (this.activeFilterStatus !== "all") {
            filtered = filtered.filter(ticket => ticket.status === this.activeFilterStatus);
        }

        // 2. Sort tickets by date
        filtered.sort((a, b) => {
            const dateA = new Date(a.createdAt);
            const dateB = new Date(b.createdAt);
            return this.activeSortOrder === "newest" ? dateB - dateA : dateA - dateB;
        });

        // 3. Render list or Empty state
        if (filtered.length === 0) {
            this.renderEmptyState();
        } else {
            this.renderGridItems(filtered);
        }
    }

    renderEmptyState() {
        const emptyBox = document.createElement("div");
        emptyBox.className = "empty-requests-box";
        emptyBox.innerHTML = `
            <div class="empty-icon-wrapper">
                <svg viewBox="0 0 24 24" width="72" height="72" stroke="currentColor" stroke-width="1.2" fill="none">
                    <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
                </svg>
                <div class="empty-badge-zero">0</div>
            </div>
            <h4 class="empty-title">Bạn chưa có yêu cầu nào</h4>
            <p class="empty-subtitle">Hãy tạo yêu cầu hỗ trợ mới, đội ngũ kĩ thuật của chúng tôi sẽ liên hệ trong thời gian sớm nhất.</p>
            <button class="btn btn-dark" id="btn-create-ticket-empty">Tạo yêu cầu mới</button>
        `;

        emptyBox.querySelector("#btn-create-ticket-empty").addEventListener("click", () => {
            this.openCreateTicketForm("warranty");
        });

        this.requestsListContainer.appendChild(emptyBox);
    }

    renderGridItems(ticketsList) {
        const grid = document.createElement("div");
        grid.className = "requests-grid-list";

        const categoryIcons = {
            warranty: `<svg viewBox="0 0 24 24" width="22" height="22" stroke="currentColor" stroke-width="2" fill="none"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>`,
            repair: `<svg viewBox="0 0 24 24" width="22" height="22" stroke="currentColor" stroke-width="2" fill="none"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path></svg>`,
            cleaning: `<svg viewBox="0 0 24 24" width="22" height="22" stroke="currentColor" stroke-width="2" fill="none"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>`,
            consulting: `<svg viewBox="0 0 24 24" width="22" height="22" stroke="currentColor" stroke-width="2" fill="none"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>`
        };

        const themeClasses = {
            warranty: "red-theme",
            repair: "orange-theme",
            cleaning: "blue-theme",
            consulting: "green-theme"
        };

        const statusLabels = {
            pending: "Chờ xử lý",
            processing: "Đang xử lý",
            completed: "Hoàn thành",
            cancelled: "Đã hủy"
        };

        ticketsList.forEach(ticket => {
            const dateObj = new Date(ticket.createdAt);
            const dateStr = `${String(dateObj.getDate()).padStart(2, '0')}/${String(dateObj.getMonth() + 1).padStart(2, '0')}/${dateObj.getFullYear()}`;
            
            const row = document.createElement("div");
            row.className = "ticket-row-item";
            row.innerHTML = `
                <div class="ticket-row-icon-box ${themeClasses[ticket.category] || 'blue-theme'}">
                    ${categoryIcons[ticket.category] || categoryIcons.warranty}
                </div>
                <div class="ticket-row-details">
                    <div class="ticket-row-id-date">
                        <span class="ticket-id-tag"><strong>#${ticket.id}</strong></span>
                        <span class="divider-dot">•</span>
                        <div class="ticket-row-date">
                            <svg viewBox="0 0 24 24" width="13" height="13" stroke="currentColor" stroke-width="2.5" fill="none"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                            <span>${dateStr}</span>
                        </div>
                        <span class="divider-dot">•</span>
                        <span class="ticket-cat-label">${ticket.categoryLabel}</span>
                    </div>
                    <div class="ticket-row-subject">${ticket.title}</div>
                </div>
                <div class="ticket-row-status">
                    <span class="ticket-status-badge badge-${ticket.status}">${statusLabels[ticket.status]}</span>
                </div>
                <div class="ticket-row-action">
                    <button class="btn btn-secondary btn-view-ticket-detail" data-id="${ticket.id}">Xem chi tiết</button>
                </div>
            `;

            row.querySelector(".btn-view-ticket-detail").addEventListener("click", () => {
                this.openDetailModal(ticket.id);
            });

            grid.appendChild(row);
        });

        this.requestsListContainer.appendChild(grid);
    }

    // ================================================================= //
    // SUPPORT MODULE LOGIC: DETAIL POPUP & PROGRESS TRACKER             //
    // ================================================================= //
    openDetailModal(ticketId) {
        const ticket = this.tickets.find(t => t.id === ticketId);
        if (!ticket) return;

        // Fill modal static texts
        this.modalTicketId.textContent = `#${ticket.id}`;
        this.modalTicketTitle.textContent = ticket.title;
        
        // Status badge style mapping
        this.modalTicketStatus.className = `ticket-status-badge badge-${ticket.status}`;
        const statusLabels = {
            pending: "Chờ xử lý",
            processing: "Đang xử lý",
            completed: "Hoàn thành",
            cancelled: "Đã hủy"
        };
        this.modalTicketStatus.textContent = statusLabels[ticket.status];

        // Fill table information
        this.modalDetailService.textContent = ticket.categoryLabel;
        
        const prodCategories = {
            pc: "Máy tính để bàn (PC)",
            laptop: "Laptop / Notebook",
            component: "Linh kiện PC",
            peripheral: "Thiết bị ngoại vi",
            other: "Khác"
        };
        this.modalDetailCategory.textContent = prodCategories[ticket.productCategory] || ticket.productCategory;
        this.modalDetailName.textContent = ticket.productName;
        this.modalDetailSerial.textContent = ticket.serialNumber;
        
        // Purchase Date formatting
        if (ticket.purchaseDate && ticket.purchaseDate !== "N/A") {
            const dateObj = new Date(ticket.purchaseDate);
            this.modalDetailPurchaseDate.textContent = !isNaN(dateObj) 
                ? `${String(dateObj.getDate()).padStart(2, '0')}/${String(dateObj.getMonth() + 1).padStart(2, '0')}/${dateObj.getFullYear()}`
                : ticket.purchaseDate;
        } else {
            this.modalDetailPurchaseDate.textContent = "N/A";
        }

        const locationLabels = {
            hanoi_store: "Chi nhánh Hà Nội",
            hcm_store: "Chi nhánh TP. HCM",
            online: "Mua Online",
            other: "Nơi khác"
        };
        this.modalDetailLocation.textContent = locationLabels[ticket.purchaseLocation] || ticket.purchaseLocation;
        
        this.modalDetailFullName.textContent = ticket.contactName;
        this.modalDetailPhone.textContent = ticket.contactPhone;
        this.modalDetailEmail.textContent = ticket.contactEmail;
        this.modalDetailAddress.textContent = ticket.contactAddress;
        this.modalDetailDescription.textContent = ticket.description;

        // Render File attachments
        this.modalDetailAttachments.innerHTML = "";
        if (ticket.attachments && ticket.attachments.length > 0) {
            this.modalDetailFilesBlock.style.display = "block";
            ticket.attachments.forEach(filename => {
                const link = document.createElement("a");
                link.href = "#";
                link.className = "detail-attachment-link";
                link.innerHTML = `
                    <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" stroke-width="2.5" fill="none">
                        <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"></path>
                    </svg>
                    <span>${filename}</span>
                `;
                link.addEventListener("click", (e) => {
                    e.preventDefault();
                    alert(`Đang mở tải file: ${filename} (Đây là demo đính kèm hỗ trợ)`);
                });
                this.modalDetailAttachments.appendChild(link);
            });
        } else {
            this.modalDetailFilesBlock.style.display = "none";
        }

        // Draw progress status indicator nodes
        this.renderTimelineWorkflow(ticket.status);

        // Cancel Ticket Option inside details (only allowed for 'pending' state)
        if (ticket.status === "pending") {
            this.btnCancelTicketAction.style.display = "block";
            // Re-bind click event cleanly
            this.btnCancelTicketAction.onclick = () => {
                if (confirm(`Bạn có chắc chắn muốn hủy bỏ yêu cầu hỗ trợ #${ticket.id}?`)) {
                    ticket.status = "cancelled";
                    localStorage.setItem("pcstore_tickets", JSON.stringify(this.tickets));
                    this.showToast(`Đã hủy yêu cầu #${ticket.id}`);
                    this.closeDetailModal();
                    this.render();
                }
            };
        } else {
            this.btnCancelTicketAction.style.display = "none";
        }

        // Show Modal
        this.detailModal.classList.add("active");
        document.body.style.overflow = "hidden"; // disable scroll
    }

    renderTimelineWorkflow(status) {
        const step1 = document.getElementById("step-node-1");
        const step2 = document.getElementById("step-node-2");
        const step3 = document.getElementById("step-node-3");
        const step4 = document.getElementById("step-node-4");

        const line1 = document.getElementById("step-line-1");
        const line2 = document.getElementById("step-line-2");
        const line3 = document.getElementById("step-line-3");

        // Clear previous state classes
        [step1, step2, step3, step4].forEach(node => {
            node.className = "modal-step-node";
            // Reset node icon circle
            const circle = node.querySelector(".node-circle");
            if (node === step1) {
                circle.innerHTML = `<svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" stroke-width="3" fill="none"><polyline points="20 6 9 17 4 12"></polyline></svg>`;
            } else {
                circle.innerHTML = node.id.replace("step-node-", "");
            }
        });
        [line1, line2, line3].forEach(line => line.className = "modal-step-line");

        // Status configurations
        if (status === "pending") {
            // Step 1: Completed, Step 2: Active
            step1.classList.add("completed");
            line1.classList.add("completed");
            step2.classList.add("active");
        } else if (status === "processing") {
            // Step 1, 2: Completed, Step 3: Active
            step1.classList.add("completed");
            line1.classList.add("completed");
            step2.classList.add("completed");
            // Set double checkmark icons on completed nodes
            step2.querySelector(".node-circle").innerHTML = `<svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" stroke-width="3" fill="none"><polyline points="20 6 9 17 4 12"></polyline></svg>`;
            
            line2.classList.add("completed");
            step3.classList.add("active");
        } else if (status === "completed") {
            // All steps completed
            step1.classList.add("completed");
            line1.classList.add("completed");
            
            step2.classList.add("completed");
            step2.querySelector(".node-circle").innerHTML = `<svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" stroke-width="3" fill="none"><polyline points="20 6 9 17 4 12"></polyline></svg>`;
            line2.classList.add("completed");
            
            step3.classList.add("completed");
            step3.querySelector(".node-circle").innerHTML = `<svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" stroke-width="3" fill="none"><polyline points="20 6 9 17 4 12"></polyline></svg>`;
            line3.classList.add("completed");
            
            step4.classList.add("completed");
            step4.querySelector(".node-circle").innerHTML = `<svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" stroke-width="3" fill="none"><polyline points="20 6 9 17 4 12"></polyline></svg>`;
        } else if (status === "cancelled") {
            // Set nodes as Cancelled (red label look)
            step1.classList.add("cancelled");
            step1.querySelector(".node-circle").innerHTML = `✕`;
            
            step2.classList.add("cancelled");
            step2.querySelector(".node-circle").innerHTML = `✕`;
            
            step3.classList.add("cancelled");
            step3.querySelector(".node-circle").innerHTML = `✕`;
            
            step4.classList.add("cancelled");
            step4.querySelector(".node-circle").innerHTML = `✕`;
        }
    }

    closeDetailModal() {
        this.detailModal.classList.remove("active");
        document.body.style.overflow = ""; // restore scroll
    }
}

// Instantiate support dashboard on load
document.addEventListener("DOMContentLoaded", () => {
    window.AppSupport = new SupportTicketSystem();
});
