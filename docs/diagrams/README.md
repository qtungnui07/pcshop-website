# Sơ đồ hệ thống PC Shop

Các sơ đồ dưới đây được dựng từ mã nguồn hiện tại của project:

- Frontend React trong `src/`
- Bun API trong `backend/index.ts`
- PostgreSQL adapter trong `backend/index.ts` và `backend/sync-json-to-postgres.ts`

Mỗi sơ đồ dùng Mermaid để có thể xem trực tiếp trên GitHub, VS Code hoặc xuất SVG/PNG bằng Mermaid Live Editor.

## Hình 2.1: Sơ đồ ca sử dụng hệ thống PC Shop

```mermaid
flowchart LR
    guest["Khách vãng lai"]
    customer["Khách hàng"]
    admin["Quản trị viên"]
    clerk["Clerk / Google OAuth"]
    resend["Resend Email"]

    subgraph pcshop["HỆ THỐNG PC SHOP"]
        direction TB

        subgraph common["Tra cứu và mua hàng"]
            browse(("Xem danh mục\nvà sản phẩm"))
            search(("Tìm kiếm, lọc\nsản phẩm"))
            detail(("Xem chi tiết\nvà đánh giá"))
            register(("Đăng ký tài khoản"))
            login(("Đăng nhập"))
            googleLogin(("Đăng nhập Google"))
            forgot(("Khôi phục mật khẩu"))
        end

        subgraph shopping["Nghiệp vụ khách hàng"]
            cart(("Quản lý giỏ hàng"))
            checkout(("Nhập thông tin\ngiao hàng"))
            cod(("Đặt hàng COD"))
            qr(("Thanh toán QR\nmô phỏng"))
            orders(("Theo dõi đơn hàng"))
            review(("Viết / cập nhật\nđánh giá"))
            helpful(("Đánh dấu đánh giá\nhữu ích"))
            ticket(("Gửi yêu cầu\nhỗ trợ"))
            profile(("Cập nhật hồ sơ"))
            build(("Tự build cấu hình PC"))
        end

        subgraph management["Nghiệp vụ quản trị"]
            dashboard(("Xem dashboard"))
            products(("Quản lý PC, laptop,\nlinh kiện, phụ kiện"))
            combos(("Quản lý combo\nphụ kiện"))
            manageOrders(("Quản lý đơn hàng"))
            accounts(("Quản lý tài khoản\nvà nhân sự"))
            tickets(("Xử lý ticket"))
            designs(("Thiết kế giao diện\nflashcard"))
        end
    end

    guest --> browse
    guest --> search
    guest --> detail
    guest --> register
    guest --> login
    guest --> googleLogin
    guest --> forgot

    customer --> browse
    customer --> search
    customer --> detail
    customer --> cart
    customer --> checkout
    customer --> orders
    customer --> review
    customer --> helpful
    customer --> ticket
    customer --> profile
    customer --> build

    admin --> dashboard
    admin --> products
    admin --> combos
    admin --> manageOrders
    admin --> accounts
    admin --> tickets
    admin --> designs

    googleLogin -. "ủy quyền OAuth" .-> clerk
    forgot -. "gửi liên kết đặt lại" .-> resend
    checkout --> cod
    checkout --> qr
    cart --> checkout
    review -. "yêu cầu đã mua hàng" .-> orders

    classDef actor fill:#111827,color:#fff,stroke:#111827,stroke-width:2px;
    classDef external fill:#eff6ff,color:#1e3a8a,stroke:#60a5fa;
    class guest,customer,admin actor;
    class clerk,resend external;
```

## Hình 2.2: Biểu đồ tuần tự luồng thanh toán QR

```mermaid
sequenceDiagram
    autonumber
    actor KH as Khách hàng
    participant FE as React Checkout
    participant QR as Thư viện QRCode
    participant API as Bun API
    participant PG as PostgreSQL<br/>app_collections
    participant PAY as Trang thanh toán ảo

    KH->>FE: Chọn sản phẩm và nhập thông tin giao hàng
    FE->>FE: Kiểm tra đăng nhập, giỏ hàng, họ tên, SĐT, địa chỉ
    KH->>FE: Chọn MoMo giả lập hoặc Bank QR giả lập
    FE->>API: POST /api/payments<br/>{paymentMethod, orderPayload}
    API->>API: Kiểm tra userId, email và items
    API->>PG: Ghi session vào collection payments<br/>status = pending, TTL = 5 phút
    PG-->>API: Hoàn tất
    API-->>FE: PaymentSession {id, expiresAt, status}
    FE->>QR: Tạo QR từ /thanh-toan-ao/{paymentId}
    QR-->>FE: QR dạng data URL
    FE->>FE: Lưu phiên chờ vào localStorage
    FE-->>KH: Hiển thị QR và bộ đếm ngược

    loop Mỗi 2 giây khi session còn pending
        FE->>API: GET /api/payments/{paymentId}
        API->>PG: Đọc collection payments
        alt Đã quá expiresAt
            API->>PG: Cập nhật status = expired
            API-->>FE: session.status = expired
            FE-->>KH: Báo QR hết hạn
        else Chưa hết hạn
            API-->>FE: Trạng thái hiện tại
        end
    end

    KH->>PAY: Quét/mở URL trong QR
    PAY->>API: GET /api/payments/{paymentId}
    API-->>PAY: Chi tiết phiên thanh toán
    KH->>PAY: Chọn "Tôi đã thanh toán"
    PAY->>API: POST /api/payments/{paymentId}/confirm
    API->>PG: Đọc payments và kiểm tra trạng thái

    alt Session hợp lệ và chưa thanh toán
        API->>API: Tạo Order<br/>paymentStatus = success
        API->>PG: Ghi Order và cập nhật Payment = paid
        API-->>PAY: Payment + Order thành công
        PAY-->>KH: Hiển thị thanh toán thành công
        FE->>API: Poll trạng thái payment
        API-->>FE: status = paid, orderId
        FE->>FE: Xóa sản phẩm đã mua và dữ liệu phiên chờ
        FE-->>KH: Chuyển đến trang Đơn hàng
    else Session đã hết hạn
        API-->>PAY: 400 - Mã QR đã hết hạn
        PAY-->>KH: Hiển thị lỗi
    else Session đã paid
        API-->>PAY: Trả lại Order đã tạo (idempotent)
    end
```

> Đây là thanh toán giả lập. QR chứa URL nội bộ của PC Shop và nút xác nhận tạo giao dịch, không kết nối trực tiếp với cổng MoMo hoặc ngân hàng.

## Hình 3.1: Sơ đồ dữ liệu JSONB trên PostgreSQL

Schema vật lý hiện tại chỉ có một bảng `app_collections`. Mỗi dòng là một collection và toàn bộ danh sách bản ghi được chứa trong cột `data JSONB`.

```mermaid
erDiagram
    APP_COLLECTIONS {
        TEXT name PK "Tên collection"
        JSONB data "Mảng JSON của collection"
        TIMESTAMPTZ updated_at "Thời điểm cập nhật"
    }

    ACCOUNT {
        STRING id PK
        STRING email
        STRING name
        STRING password
        STRING role
        STRING provider
        STRING avatar
        STRING phone
        STRING address
    }

    ORDER {
        STRING id PK
        STRING userId FK
        STRING email
        JSON items
        NUMBER totalItems
        NUMBER totalPrice
        STRING paymentMethod
        STRING paymentStatus
        STRING status
        DATETIME createdAt
        DATETIME updatedAt
    }

    PAYMENT {
        STRING id PK
        STRING orderId FK
        STRING status
        STRING paymentMethod
        JSON orderPayload
        DATETIME createdAt
        DATETIME expiresAt
        DATETIME paidAt
    }

    REVIEW {
        STRING id PK
        STRING productId FK
        STRING userId FK
        STRING email
        NUMBER rating
        STRING comment
        JSON helpfulUserIds
    }

    PRODUCT {
        STRING id PK
        STRING name
        STRING category
        STRING specs
        NUMBER_OR_STRING price
        STRING image
    }

    ACCESSORY_COMBO {
        STRING id PK
        JSON productIds FK
        NUMBER discountPercent
        BOOLEAN isActive
    }

    TICKET {
        STRING id PK
        STRING email
        STRING subject
        STRING status
    }

    STAFF {
        STRING id PK
        STRING email
        STRING role
    }

    APP_COLLECTIONS ||--o{ ACCOUNT : "data['accounts']"
    APP_COLLECTIONS ||--o{ ORDER : "data['orders']"
    APP_COLLECTIONS ||--o{ PAYMENT : "data['payments']"
    APP_COLLECTIONS ||--o{ REVIEW : "data['reviews']"
    APP_COLLECTIONS ||--o{ PRODUCT : "pcs/laptops/components/accessories"
    APP_COLLECTIONS ||--o{ ACCESSORY_COMBO : "data['accessoryCombos']"
    APP_COLLECTIONS ||--o{ TICKET : "data['tickets']"
    APP_COLLECTIONS ||--o{ STAFF : "data['staff']"

    ACCOUNT ||--o{ ORDER : "userId (logic)"
    ACCOUNT ||--o{ REVIEW : "userId (logic)"
    ACCOUNT ||--o{ TICKET : "email (logic)"
    ORDER o|--o| PAYMENT : "orderId (logic)"
    PRODUCT ||--o{ REVIEW : "productId (logic)"
    PRODUCT }o--o{ ACCESSORY_COMBO : "productIds (logic)"
```

Các collection được nạp bởi backend:

`pcs`, `components`, `laptops`, `accessories`, `accessoryCombos`, `tickets`, `accounts`, `orders`, `payments`, `reviews`, `staff`, `flashcardDesigns`, `flashcardAppliedDesigns`.

Các đường nối ghi “logic” không phải foreign key vật lý. Code tìm và nối dữ liệu bằng các trường nằm bên trong JSONB.

## Hình 4.1: Luồng xác thực Google qua Clerk và trạng thái JWT

```mermaid
sequenceDiagram
    autonumber
    actor ND as Người dùng
    participant FE as React + AuthContext
    participant SDK as Clerk React SDK
    participant CL as Clerk Auth
    participant GG as Google OAuth
    participant API as Bun API
    participant PG as PostgreSQL JSONB
    participant LS as localStorage

    ND->>FE: Chọn "Đăng nhập với Google"
    FE->>SDK: authenticateWithRedirect(oauth_google)
    SDK->>CL: Bắt đầu OAuth
    CL->>GG: Chuyển hướng đến Google
    ND->>GG: Đăng nhập và cấp quyền
    GG-->>CL: OAuth authorization response
    CL->>CL: Xác minh Google và tạo Clerk session
    Note over CL,SDK: Clerk quản lý session token/JWT nội bộ<br/>thông qua ClerkProvider và cookie/session
    CL-->>SDK: Redirect /sso-callback
    SDK->>SDK: AuthenticateWithRedirectCallback
    SDK-->>FE: isSignedIn + clerkUser

    FE->>FE: Lấy email, fullName và imageUrl
    FE->>API: POST /api/auth/google-login<br/>{email, name, avatar}
    Note right of FE: Request hiện tại không gửi<br/>Authorization: Bearer Clerk JWT
    API->>PG: Tìm account theo email

    alt Account đã tồn tại
        API->>PG: Cập nhật avatar/provider khi cần
    else Account chưa tồn tại
        API->>PG: Tạo account provider = google
    end

    PG-->>API: Account
    API-->>FE: User không chứa password
    FE->>LS: Lưu pcshop_user
    FE-->>ND: Hoàn tất đăng nhập

    rect rgb(255, 244, 229)
        Note over FE,API: Ranh giới bảo mật hiện tại
        FE-->>API: Backend tin dữ liệu profile do frontend gửi
        Note over API: Chưa giải mã/xác minh chữ ký JWT Clerk,<br/>issuer, audience hoặc expiration
    end

    ND->>FE: Đăng xuất
    FE->>LS: Xóa pcshop_user
    FE->>SDK: signOut()
    SDK->>CL: Hủy Clerk session
```

Tên chính xác cho sơ đồ theo code hiện tại nên là **“Luồng xác thực Google qua Clerk Auth và đồng bộ tài khoản”**. Nếu báo cáo bắt buộc dùng cụm “mã hóa JWT”, cần lưu ý JWT là **ký/xác minh** chứ không mặc định là mã hóa; đồng thời backend của project chưa có bước xác minh Clerk JWT.

