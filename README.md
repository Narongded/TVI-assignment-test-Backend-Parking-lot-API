# TVI Assignment Test - Backend Parking Lot API

## ภาพรวมโปรเจค

นี่คือระบบ **API สำหรับจัดการลานจอดรถ** ที่พัฒนาด้วย **NestJS** สำหรับ TVI Assignment Test ครับ
\*ขอชี้แจงเพิ่มเติมนิดนึงครับ ในส่วนของ Volumn ของ Database โดยปกติจะไม่ได้ push ขึ้น git ครับแต่อันนี้เพื่อความสะดวกในการเข้าตรวจสอบเลยขอ push ขึ้นมาด้วย ยังไงก็ขออภัยล่วงหน้าด้วยนะครับ

### **แหล่งอ้างอิง**

- project structor https://medium.com/the-crowdlinker-chronicle/best-way-to-structure-your-directory-code-nestjs-a06c7a641401
- cls -> https://docs.nestjs.com/recipes/async-local-storage
- local, jwt guard -> https://docs.nestjs.com/recipes/passport

### **ฟีเจอร์หลัก**

- ระบบการบันทึก ActivityLog
- ระบบลาดจอดรถ
  การสร้างลาดจอดรถ Admin
  การเช็คสถานะลานจอดรถ Admin, User
- ระบบช่องจอดรถ
  การสร้างช่องจอดรถ Admin
- ระบบตั๋ว
  การออกตั๋วจอดรถ User
  การคืนตั๋วจอดรถ User
  ดึงข้อมูลทะเบียนรถจากขนาดรถ Admin
  ดึงข้อมูลช่องจอดรถจากขนาดรถ Admin

### **เทคโนโลยีที่ใช้**

- **Backend Framework**: NestJS + TypeScript
- **Database**: MySQL 8.0 + TypeORM
- **Security**: JWT + Passport.js
- **Logger**: Winston
- **Test**: Jest (Unit & E2E tests)
- **Container**: Docker + Docker Compose

## 🗄️ โครงสร้างฐานข้อมูล

### **ตาราง**

- `admin_user` - ผู้ดูแลระบบ
- `parking_lot` - ข้อมูลลานจอดรถ
- `parking_slot` - ช่องจอดรถแต่ละช่อง
- `car` - ข้อมูลรถยนต์ (รองรับขนาด เล็ก/กลาง/ใหญ่)
- `ticket` - ตั๋วจอดรถพร้อมเวลาเข้า-ออก
- `activity_log` - บันทึกการตรวจสอบกิจกรรมระบบ

## 🚀 การเริ่มต้นใช้งาน

### **ข้อกำหนดเบื้องต้น**

- Node.js (เวอร์ชัน 22 )
- yarn
- Docker & Docker Compose

### ** Docker **

1. **รันด้วย Docker Compose**

```bash
docker compose up -d
```

API จะพร้อมใช้งานที่ `http://localhost:3000`

## 📚 เอกสาร API

### **การยืนยันตัวตน**

```bash
# เข้าสู่ระบบ (Admin)
POST /auth/login
Content-Type: application/json
{
  "email": "admin@example.com",
  "password": "password"
}
```

### **การจัดการลานจอดรถ**

```bash
# สร้างลานจอดรถ (ต้องมี Token)
POST /parking-lot
Authorization: Bearer <token>
{
  "name": "ลานจอดรถกลางเมือง",
  "totalSlot": 100
}

# ดูสถานะลานจอดรถ (เปิดให้ทุกคน)
GET /parking-lot/status/:id
```

### **การจัดการช่องจอดรถ**

```bash
# สร้างช่องจอดรถ (ต้องมี Token)
POST /parking-slot
Authorization: Bearer <token>
{
  "slotNumber": "A1",
  "distanceFromEntry": 5,
  "parkingLotId": 1
}

# ดูช่องที่ว่าง (เปิดให้ทุกคน)
GET /parking-slot/available/:parkingLotId
```

### **ระบบตั๋วจอดรถ**

```bash
# สร้างตั๋วจอดรถ (เปิดให้ทุกคน)
POST /ticket
{
  "plateNumber": "ABC1234",
  "carSize": "medium",
  "parkingLotId": 1
}

# ออกจากลานจอดรถ (ต้องมี Ticket Token)
PUT /ticket/leave-parking
Authorization: Bearer <ticket-token>
{
  "ticketId": 123
}

# ดูข้อมูลการลงทะเบียน (เปิดให้ทุกคน)
GET /ticket/registration-data?startDate=2023-01-01&endDate=2023-01-31
```

### **การจัดการผู้ดูแลระบบ**

```bash
# สร้างผู้ดูแลระบบ (ต้องมี Token)
POST /admin-user
Authorization: Bearer <token>
{
  "firstName": "สมชาย",
  "lastName": "ใจดี",
  "email": "john@example.com",
  "password": "รหัสผ่านปลอดภัย"
}
```

## 🔧 ตัวแปร Environment

สร้างไฟล์ `.env` ในโฟลเดอร์หลัก:

```env
# App
PORT=3000
NODE_ENV=development

# Database
TYPEORM_CONNECTION=mysql
TYPEORM_HOST=localhost
TYPEORM_PORT=3306
TYPEORM_USERNAME=devuser
TYPEORM_PASSWORD=devpassword
TYPEORM_DATABASE=assignment
TYPEORM_SYNCHRONIZE=false
TYPEORM_LOGGING=true

# JWT
JWT_SECRET=
JWT_EXPIRES_IN=24h
JWT_GLOBAL=true

# Ticket
TICKET_SECRET=
```

## 🧪 การทดสอบ

```bash
# รัน unit tests
npm run test

# สร้างรายงานการทดสอบ
npm run test:cov
```

## 🏛️ โครงสร้างโปรเจค

```
sql/                       # init, seed ข้อมูล
src/
├── activity-log/          # โมดูลบันทึกกิจกรรม
├── admin-user/            # การจัดการผู้ดูแลระบบ
├── auth/                  # การยืนยันตัวตนและ JWT
├── car/                   # การจัดการรถยนต์
├── common/                # ยูทิลิตี้ที่ใช้ร่วม, guards, decorators
│   ├── constants/
│   ├── decorator/
│   ├── enum/
│   ├── guard/
│   └── interface/
│   ├── unit-test/
├── config/                # ไฟล์การกำหนดค่า
├── interceptor/           # Request/Response interceptors
├── parking-lot/           # การจัดการลานจอดรถ
├── parking-slot/          # การจัดการช่องจอดรถ
├── ticket/                # ระบบตั๋วจอดรถ
├── app.module.ts          # โมดูลหลักของแอปพลิเคชัน
└── main.ts                # จุดเริ่มต้นของแอปพลิเคชัน
```
