# PROJECT CONTEXT - Akai Japanese Restaurant

## 1. Tổng quan Dự án (Project Overview)
- **Tên dự án**: Akai Sushi (Authentic Japanese Cuisine Website)
- **Mô tả**: Landing page giới thiệu nhà hàng Nhật Bản Akai và hệ thống đặt bàn trực tuyến (Table Reservation).
- **Công nghệ**:
  - **Frontend**: HTML5, Vanilla CSS3 (Custom Properties, Dark Theme Design System), JavaScript ES6 (Native Modules).
  - **Backend API**: Cloudflare Workers Serverless API (`https://backend-my-restaurant.truongnd-work.workers.dev`).

---

## 2. Cấu trúc thư mục (Directory Structure)
```
japanese_restaurant/
├── index.html            # Trang đơn Landing Page (Navbar, Hero, About, Menu, Reservation, Footer)
├── PROJECT_CONTEXT.md    # Tài liệu ngữ cảnh dự án dành cho AI/Developers
├── css/
│   └── styles.css        # Toàn bộ CSS (Variables, Layout, Components, Animations, Responsive)
└── js/
    ├── config.js         # Cấu hình ứng dụng (API Base URL, Timeout)
    ├── http-client.js    # Fetch API wrapper xử lý HTTP requests & AbortController timeout
    ├── booking-api.js    # Service layer tương tác API đặt bàn
    ├── menu-flipbook.js   # Module quản lý lật trang 3D Flipbook & Touch Swipe (Desktop spread & Mobile single mode)
    └── script.js         # Entry point chính xử lý UI (Scroll effects, Animations, View Toggle, Form submission)
```

---

## 3. Kiến trúc Hệ thống (Architecture)
- **Mô hình Frontend**: Static Web SPA / HTML Landing Page sử dụng ES6 Native Modules (`type="module"` trong script tag), không phụ thuộc bundler (Vite/Webpack).
- **Phân tầng JS Code (Layered Architecture)**:
  - **Config Layer** (`config.js`): Quản lý hằng số môi trường/API URL.
  - **Network Layer** (`http-client.js`): Xử lý giao tiếp HTTP fetch, timeout tự động ngắt kết nối (AbortController), parse JSON và chuẩn hóa xử lý lỗi.
  - **API Layer** (`booking-api.js`): Đóng gói các hàm gọi endpoint RESTful backend (`BookingApi.create`).
  - **UI/Event Layer** (`script.js`): Xử lý tương tác DOM, hiệu ứng cuộn, animation reveal và submit form.

---

## 4. Flow Xử lý Chính (Processing Flow)

### 4.1. UI & Hiệu ứng Trang Web
1. Khi DOM load xong (`DOMContentLoaded`), khởi tạo các event listener.
2. **Navbar**: Đổi style (thêm class `scrolled`) khi cuộn trang vượt quá 50px.
3. **Mobile Menu**: Toggle class `active` hiển thị menu định vị `top: 100%` phủ tràn toàn bộ chiều rộng và chiều cao màn hình phía dưới Navbar. Tự động đóng menu khi bấm chọn bất kỳ đường link nào.
4. **Scroll Reveal**: Hàm `revealOnScroll` tính toán vị trí viewport để kích hoạt hiệu ứng xuất hiện (`fade-up active`) cho các section.

### 4.2. Luồng Đặt Bàn (Reservation Flow)
1. User điền thông tin vào form `#reservation-form` (`name`, `phone`, `date`, `time`, `guests`).
2. Event `submit` trên form được kích hoạt -> Tạm thời `disabled = true` nút bấm và đổi text thành `"Sending..."`.
3. Thu thập dữ liệu từ các input field và chuẩn hóa thành payload object:
   - `name`: String (đã trim)
   - `phone`: String (đã trim)
   - `booking_date`: String (`YYYY-MM-DD`)
   - `booking_time`: String (`HH:mm`)
   - `guest_count`: Number
4. Gọi `BookingApi.create(payload)` -> chuyển tiếp tới `HttpClient.request("/api/bookings", { method: "POST", body: JSON.stringify(payload) })`.
5. Sau khi nhận phản hồi từ Backend Worker:
   - **Thành công**: Hiển thị thông báo `alert(result.data.message)` và reset form (`form.reset()`).
   - **Thất bại**: Catch lỗi và hiển thị `alert(error.message)`.
6. Cuối cùng (`finally` block): Khôi phục trạng thái nút bấm (`disabled = false`, text = `"Send Reservation Request"`).

---

## 5. Cấu trúc Database / Entity (Data Model)

Dữ liệu chính quản lý trên hệ thống là **Reservation (Đặt bàn)**:

| Field Name | Type | Constraint | Description |
| :--- | :--- | :--- | :--- |
| `name` | String | Required | Họ và tên khách hàng đặt bàn |
| `phone` | String | Required | Số điện thoại liên hệ |
| `booking_date` | String (Date) | Required | Ngày đặt bàn (`YYYY-MM-DD`) |
| `booking_time` | String (Time) | Required | Giờ đặt bàn (`HH:mm`) |
| `guest_count` | Integer | Required, Min: 1, Max: 20 | Số lượng khách hàng |

---

## 6. Chi tiết API Integration

### Base Configuration
- **Base URL**: `https://backend-my-restaurant.truongnd-work.workers.dev`
- **Request Timeout**: 10,000 ms (10 giây)

### Endpoint: Tạo Đặt Bàn Mới
- **Endpoint**: `POST /api/bookings`
- **Headers**: `Content-Type: application/json`
- **Request Payload**:
  ```json
  {
    "name": "Nguyễn Văn A",
    "phone": "0912345678",
    "booking_date": "2026-08-01",
    "booking_time": "19:00",
    "guest_count": 4
  }
  ```
- **Response Success (200 OK)**:
  ```json
  {
    "data": {
      "message": "Xác nhận đặt bàn thành công!"
    }
  }
  ```
- **Response Error (4xx / 5xx)**:
  ```json
  {
    "message": "Nội dung thông báo lỗi từ server"
  }
  ```

---

## 7. Business Logic (Quy tắc Nghiệp vụ)
- **Giới hạn số lượng khách**: Số lượng bàn đặt cho phép từ `1` đến tối đa `20` người trong một lượt đặt.
- **Tránh trùng lặp Form Submit**: Ngăn ngừa bấm gửi form nhiều lần bằng cách khoá nút submit (`disabled`) trong lúc chờ API phản hồi.
- **Quản lý thời gian chờ API**: Ngắt request tự động nếu API Backend không phản hồi sau 10 giây để giữ trải nghiệm người dùng mượt mà.

---

## 8. Quy tắc Đặt tên (Naming Conventions)

### JavaScript
- **Tên file**: `kebab-case` (`booking-api.js`, `http-client.js`).
- **Tên Class**: `PascalCase` (`HttpClient`, `BookingApi`).
- **Hằng số cấu hình**: `UPPER_SNAKE_CASE` (`APP_CONFIG`, `API_BASE_URL`).
- **Hàm & Biến**: `camelCase` (`revealOnScroll`, `navLinks`).
- **Property Payload JSON**: `snake_case` (`booking_date`, `booking_time`, `guest_count`).

### HTML / CSS
- **Class & ID Name**: `kebab-case` (`reservation-form`, `btn-primary`, `nav-links`).
- **CSS Custom Properties**: `--kebab-case` (`--primary-color`, `--bg-color`, `--accent`).

---

## 9. Quy tắc Giới hạn Kích thước File & Phân tách Module (Codebase Rules)
1. **Giới hạn số dòng**: **Không một file nào được vượt quá 1000 dòng code**.
2. **Nguyên tắc Phân tách Module (Modularization)**: Khi có nhiều tính năng hoặc component mới (ví dụ: Flipbook Menu, Modal, Order Cart...), bắt buộc phải tách riêng stylesheet và JS module sang các file độc lập (`css/flipbook.css`, `js/menu-flipbook.js`) thay vì dồn chung vào một file duy nhất.
3. **Thực hiện theo logic đã xác định**: Tuân thủ đúng kiến trúc, quy trình xử lý và logic nghiệp vụ đã thống nhất trong `PROJECT_CONTEXT.md`.

