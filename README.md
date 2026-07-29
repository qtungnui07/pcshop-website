# PC Shop

Website thương mại điện tử cho PC, laptop, linh kiện và phụ kiện. Project gồm React/Vite ở frontend, Bun API ở backend, PostgreSQL để lưu dữ liệu JSONB, Clerk cho đăng nhập Google và Resend cho luồng đặt lại mật khẩu.

## Chức năng chính

- Xem, tìm kiếm và lọc PC, laptop, linh kiện, phụ kiện và combo.
- Đăng ký/đăng nhập tài khoản cục bộ hoặc Google qua Clerk.
- Giỏ hàng theo từng tài khoản, đặt hàng COD và thanh toán QR mô phỏng.
- Theo dõi đơn hàng, gửi ticket hỗ trợ và đánh giá sản phẩm.
- Trang quản trị cho sản phẩm, combo, đơn hàng, tài khoản, nhân sự và ticket.
- PostgreSQL lưu các collection ứng dụng trong bảng `app_collections` với cột `data JSONB`.

## Yêu cầu

- [Bun](https://bun.sh/) 1.3 trở lên (chạy backend và các lệnh database).
- Node.js 22+ hoặc Bun (cài dependency/chạy frontend).
- Docker Desktop/Engine + Docker Compose nếu chạy theo Docker.
- PostgreSQL 17+ nếu chạy không dùng Docker.

## Cấu hình môi trường

Sao chép file mẫu thành `.env`:

```bash
cp .env.example .env
```

Thiết lập các biến sau trong `.env`:

```dotenv
# Clerk — lấy từ Clerk Dashboard
VITE_CLERK_PUBLISHABLE_KEY=pk_test_your_key

# Resend — cần cho chức năng gửi email đặt lại mật khẩu
RESEND_API_KEY=re_your_key

# Cloudflare Turnstile (tùy chọn cho môi trường local)
VITE_TURNSTILE_SITE_KEY=your_site_key
TURNSTILE_SECRET_KEY=your_secret_key

# PostgreSQL
POSTGRES_DB=pcshop
POSTGRES_USER=pcshop
POSTGRES_PASSWORD=use-a-strong-password
```

`.env` đã được Git bỏ qua. Không commit API key, mật khẩu database hoặc Cloudflare credentials. Nếu một secret từng được đẩy lên repository, hãy thu hồi/rotate secret đó tại nhà cung cấp ngay.

## Chạy nhanh với Docker

### 1. Cài dependency frontend

Docker Compose mount source code vào container frontend, vì vậy hãy cài dependency một lần ở máy host trước:

```bash
bun install
```

### 2. Khởi động dịch vụ

```bash
docker compose up -d --build
```

Các dịch vụ mặc định:

| Dịch vụ | Địa chỉ |
| --- | --- |
| Frontend | http://localhost:5174 |
| Backend API | http://localhost:3001 |
| Adminer | http://localhost:8081 |
| PostgreSQL | chỉ dùng trong Docker network |

Kiểm tra trạng thái và log:

```bash
docker compose ps
docker compose logs -f backend
docker compose logs -f frontend
```

Dừng dịch vụ:

```bash
docker compose down
```

Để xóa cả PostgreSQL volume và dữ liệu Docker (không thể khôi phục bằng lệnh này), dùng:

```bash
docker compose down -v
```

### Truy cập Adminer

Mở http://localhost:8081 và đăng nhập với:

- **System:** `PostgreSQL`
- **Server:** `postgres`
- **Username:** giá trị `POSTGRES_USER` trong `.env`
- **Password:** giá trị `POSTGRES_PASSWORD` trong `.env`
- **Database:** giá trị `POSTGRES_DB` trong `.env`

## Chạy local không dùng Docker

### 1. Khởi động PostgreSQL

Tạo database và user tương ứng với các giá trị trong `.env`, hoặc chỉnh `DATABASE_URL` cho phù hợp:

```bash
export DATABASE_URL='postgres://pcshop:your-password@localhost:5432/pcshop'
```

### 2. Cài dependency

```bash
bun install
```

### 3. Mở hai terminal

Terminal 1 — backend API tại cổng `3001`:

```bash
bun run backend
```

Terminal 2 — frontend Vite tại cổng `5173`:

```bash
bun run dev
```

Mở http://localhost:5173 trong trình duyệt. Frontend tự gọi API tại `http://localhost:3001` khi chạy local.

## Dữ liệu và PostgreSQL

Khi backend khởi động lần đầu, nó tạo bảng `app_collections` và nạp dữ liệu ban đầu từ `backend/db/*.json` nếu collection chưa tồn tại. Các file JSON được giữ lại làm dữ liệu mẫu/backup.

Để ghi đè các collection PostgreSQL bằng dữ liệu JSON hiện tại:

```bash
# Khi dùng Docker
docker compose exec backend bun run db:sync-json

# Khi chạy local, cần DATABASE_URL hợp lệ
bun run db:sync-json
```

Các collection bao gồm `pcs`, `components`, `laptops`, `accessories`, `accessoryCombos`, `accounts`, `orders`, `payments`, `reviews`, `staff` và `tickets`.

## Các lệnh thường dùng

| Lệnh | Mô tả |
| --- | --- |
| `bun run dev` | Chạy Vite development server. |
| `bun run backend` | Chạy Bun API ở chế độ watch. |
| `bun run backend:prod` | Chạy Bun API không watch. |
| `bun run build` | Kiểm tra TypeScript và build frontend. |
| `bun run lint` | Chạy ESLint. |
| `bun run preview` | Xem bản frontend đã build. |
| `bun run db:sync-json` | Đồng bộ JSON mẫu vào PostgreSQL. |

## Lưu ý xác thực và thanh toán

- Clerk đang xử lý đăng nhập Google/session ở frontend. Backend hiện đồng bộ profile Google qua `/api/auth/google-login`; chưa xác minh Clerk JWT ở backend.
- Luồng QR là **thanh toán giả lập**: QR mở trang `/thanh-toan-ao/:id`, và thao tác xác nhận tạo đơn hàng. Nó không kết nối đến MoMo hoặc ngân hàng thật.

## Sơ đồ hệ thống

Các sơ đồ Use Case, thanh toán QR, ERD JSONB và luồng Clerk Auth nằm tại [docs/diagrams/README.md](docs/diagrams/README.md). Các file `.mmd` có thể mở bằng Mermaid preview hoặc Mermaid Live Editor để xuất SVG/PNG.
