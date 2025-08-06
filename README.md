# Finan Wallet Admin Panel

Admin panel quản lý hệ thống Finan Wallet - ứng dụng ví tiền điện tử trên Binance Smart Chain (BSC).

## Tính năng

- 🔐 Đăng nhập admin với JWT authentication
- 📊 Dashboard tổng quan với thống kê đơn hàng
- 🤝 Quản lý đơn hàng P2P (xác nhận/hủy)
- ⚙️ Cấu hình thông tin ngân hàng và ví admin
- 📱 Responsive design với TailwindCSS
- 🔄 Real-time data với API backend

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Styling**: TailwindCSS
- **State Management**: React Context
- **HTTP Client**: Axios
- **Icons**: Lucide React
- **Authentication**: JWT với cookies

## Cài đặt

### 1. Environment Variables

Tạo file `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:3000/api
```

### 2. Cài đặt dependencies

```bash
npm install
```

### 3. Chạy development server

```bash
npm run dev
```

Truy cập [http://localhost:3001](http://localhost:3001) để xem admin panel.

## Đăng nhập

**Thông tin đăng nhập mặc định:**
- Username: `admin`
- Password: `admin123`

⚠️ **Quan trọng**: Thay đổi mật khẩu mặc định trong môi trường production!

## Cấu trúc dự án

```
src/
├── app/                    # Next.js App Router pages
│   ├── login/             # Trang đăng nhập
│   ├── orders/            # Quản lý đơn hàng P2P
│   ├── settings/          # Cấu hình hệ thống
│   └── page.tsx           # Dashboard chính
├── components/            # React components
│   ├── Layout.tsx         # Layout chính với sidebar
│   └── ProtectedRoute.tsx # HOC bảo vệ route
├── contexts/              # React contexts
│   └── AuthContext.tsx    # Context xác thực
└── lib/                   # Utilities
    └── api.ts             # API client với axios
```

## Tính năng chính

### 1. Dashboard
- Thống kê tổng quan đơn hàng
- Danh sách đơn hàng gần đây
- Trạng thái hệ thống

### 2. Quản lý đơn hàng P2P
- Xem danh sách tất cả đơn hàng
- Xác nhận đơn hàng đã thanh toán
- Hủy đơn hàng
- Thêm transaction hash khi xác nhận
- Phân trang và lọc theo trạng thái

### 3. Cấu hình hệ thống
- Thông tin ngân hàng (tên, số TK, chủ TK)
- URL QR code thanh toán
- Ghi chú cho khách hàng
- Địa chỉ ví admin
- Tỷ giá USDT/VND

## API Endpoints

Admin panel kết nối với các API sau:

- `POST /api/admin/login` - Đăng nhập
- `GET /api/admin/p2p/orders` - Lấy danh sách đơn hàng
- `POST /api/admin/p2p/orders/:id/confirm` - Xác nhận đơn hàng
- `POST /api/admin/p2p/orders/:id/cancel` - Hủy đơn hàng
- `GET /api/config` - Lấy cấu hình
- `PUT /api/admin/config` - Cập nhật cấu hình

## Deployment

### Vercel (Khuyến nghị)

1. Push code lên GitHub
2. Kết nối repository với Vercel
3. Thiết lập environment variables:
   - `NEXT_PUBLIC_API_URL`: URL của backend API
4. Deploy tự động

### Render

1. Tạo Web Service mới trên Render
2. Kết nối với GitHub repository
3. Thiết lập:
   - Build Command: `npm run build`
   - Start Command: `npm start`
   - Environment Variables: `NEXT_PUBLIC_API_URL`

### Manual Build

```bash
# Build for production
npm run build

# Start production server
npm start
```

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Thêm tính năng mới

1. Tạo component trong `src/components/`
2. Thêm route mới trong `src/app/`
3. Cập nhật navigation trong `Layout.tsx`
4. Thêm API calls trong `src/lib/api.ts`

## Security

- JWT tokens được lưu trong HTTP-only cookies
- Auto-redirect khi token hết hạn
- Protected routes với `ProtectedRoute` component
- Input validation và sanitization

## Troubleshooting

### Lỗi kết nối API
- Kiểm tra `NEXT_PUBLIC_API_URL` trong `.env.local`
- Đảm bảo backend đang chạy
- Kiểm tra CORS settings

### Lỗi đăng nhập
- Kiểm tra username/password
- Xem Network tab trong DevTools
- Kiểm tra JWT secret trong backend

### Lỗi build
- Chạy `npm run lint` để kiểm tra lỗi
- Kiểm tra TypeScript errors
- Đảm bảo tất cả dependencies được cài đặt

## Contributing

1. Fork repository
2. Tạo feature branch
3. Commit changes
4. Push to branch
5. Tạo Pull Request

## License

MIT License - xem file LICENSE để biết thêm chi tiết.
