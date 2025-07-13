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
- ระบบลานจอดรถ
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

## โครงสร้างฐานข้อมูล

### **ตาราง**

- `admin_user` - ผู้ดูแลระบบ
- `parking_lot` - ข้อมูลลานจอดรถ
- `parking_slot` - ช่องจอดรถแต่ละช่อง
- `car` - ข้อมูลรถยนต์ (รองรับขนาด เล็ก/กลาง/ใหญ่)
- `ticket` - ตั๋วจอดรถพร้อมเวลาเข้า-ออก
- `activity_log` - บันทึกการตรวจสอบกิจกรรมระบบ

## การเริ่มต้นใช้งาน

### **ข้อกำหนดเบื้องต้น**

- Node.js (เวอร์ชัน 22 )
- yarn หรือ npm
- Docker & Docker Compose

### ** Docker **

1. **รันด้วย Docker Compose**

```bash
docker compose up -d
```

API จะพร้อมใช้งานที่ `http://localhost:3000`

## เอกสาร API
Assignment.postman_collection.json

## Base URL
```
{{localhost}} = http://localhost:3000/api
```


## Authentication

### 1. เข้าสู่ระบบ (Login)

**Endpoint:** `POST /auth/login`

**cURL:**
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@email.com",
    "password": "password"
  }'
```

**Request Body:**
```json
{
    "email": "test@email.com",
    "password": "password"
}
```

**Response (201 Created):**
```json
{
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
        "id": 1,
        "firstName": "narongded",
        "lastName": "pinprechachai",
        "email": "test@email.com"
    }
}
```

**คำอธิบาย:**
- เมื่อเข้าสู่ระบบสำเร็จ จะได้รับ `accessToken` สำหรับใช้ในการเรียก API อื่นๆ
- เก็บ accessToken ไว้ใช้ในการเรียก API อื่นๆ

---

## ระบบลานจอดรถ


### 2. ตรวจสอบสถานะลานจอดรถ

**Endpoint:** `GET /parking-lot/status/{id}`

**cURL:**
```bash
curl -X GET http://localhost:3000/api/parking-lot/status/2
```

**Parameters:**
- `id` (path): ID ของลานจอดรถ

**Response (200 OK):**
```json
{
    "totalSlot": 40,
    "availableSlot": 40
}
```

**คำอธิบาย:**
- แสดงจำนวนช่องจอดรถทั้งหมดและช่องที่ว่าง
- ไม่ต้องการ Authentication

### 3. สร้างลานจอดรถ

**Endpoint:** `POST /parking-lot`

**Authentication:** Bearer Token Required

**cURL:**
```bash
curl -X POST http://localhost:3000/api/parking-lot \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -d '{
    "name": "Parking A",
    "totalSlot": 40
  }'
```

**Request Body:**
```json
{
    "name": "Parking A",
    "totalSlot": 40
}
```

**Response (201 Created):**
```json
{
    "name": "Parking A",
    "totalSlot": 40,
    "availableSlot": 40,
    "createdBy": 1,
    "id": 3,
    "createdAt": "2025-07-13T15:58:36.000Z",
    "updatedAt": "2025-07-13T15:58:36.000Z",
    "deletedAt": null
}
```

**คำอธิบาย:**
- สร้างลานจอดรถใหม่พร้อมกำหนดจำนวนช่องจอดรถ
- `availableSlot` เริ่มต้นเท่ากับ `totalSlot`

---

## ระบบช่องจอดรถ

### 4. สร้างช่องจอดรถ

**Endpoint:** `POST /parking-slot`

**Authentication:** Bearer Token Required

**cURL:**
```bash
curl -X POST http://localhost:3000/api/parking-slot \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -d '{
    "slotNumber": "A14",
    "distanceFromEntry": 0,
    "parkingLotId": 2
  }'
```

**Request Body:**
```json
{
    "slotNumber": "A14",
    "distanceFromEntry": 0,
    "parkingLotId": 2
}
```

**Response (201 Created):**
```json
{
    "slotNumber": "A14",
    "isParking": false,
    "distanceFromEntry": 0,
    "parkingLotId": 2,
    "createdBy": 1,
    "id": 1,
    "createdAt": "2025-07-13T15:58:51.000Z",
    "updatedAt": "2025-07-13T15:58:51.000Z",
    "deletedAt": null
}
```

**คำอธิบาย:**
- สร้างช่องจอดรถในลานจอดรถที่กำหนด
- `distanceFromEntry`: ระยะทางจากทางเข้า (ใช้สำหรับจัดลำดับการจัดสรรช่องจอดรถ)
- `isParking`: สถานะการใช้งานช่องจอดรถ (false = ว่าง)

---

## ระบบตั๋ว

### 5. ดึงรายการป้ายทะเบียนรถตามขนาดรถ

**Endpoint:** `GET /ticket/registration-plate-number/list`

**Authentication:** Bearer Token Required

**cURL:**
```bash
curl -X GET "http://localhost:3000/api/ticket/registration-plate-number/list?carSize=medium&parkingLotId=2" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

**Query Parameters:**
- `carSize`: ขนาดรถ (small/medium/large)
- `parkingLotId`: ID ของลานจอดรถ

**Response (200 OK):**
```json
[
    "AA 1"
]
```

**คำอธิบาย:**
- ดึงรายการป้ายทะเบียนรถที่จอดอยู่ในลานจอดรถตามขนาดรถที่กำหนด

### 6. ดึงรายการหมายเลขช่องจอดรถที่ถูกจัดสรรตามขนาดรถ

**Endpoint:** `GET /ticket/registration-allocated-slot-number/list`

**Authentication:** Bearer Token Required

**cURL:**
```bash
curl -X GET "http://localhost:3000/api/ticket/registration-allocated-slot-number/list?carSize=medium&parkingLotId=2" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

**Query Parameters:**
- `carSize`: ขนาดรถ (small/medium/large)
- `parkingLotId`: ID ของลานจอดรถ

**Response (200 OK):**
```json
[
    "A14"
]
```

**คำอธิบาย:**
- ดึงรายการหมายเลขช่องจอดรถที่ถูกจัดสรรให้กับรถตามขนาดที่กำหนด

### 7. สร้างตั๋วจอดรถ (จอดรถ)

**Endpoint:** `POST /ticket`


**cURL:**
```bash
curl -X POST http://localhost:3000/api/ticket \
  -H "Content-Type: application/json" \
  -d '{
    "plateNumber": "AB 11",
    "size": "medium",
    "parkingLotId": 2
  }'
```

**Request Body:**
```json
{
    "plateNumber": "x11",
    "size": "medium",
    "parkingLotId": 2
}
```

**Response (201 Created):**
```json
{
    "ticketData": {
        "id": 1,
        "plateNumber": "x11",
        "size": "medium",
        "slotNumber": "A14"
    },
    "ticketToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwicGxhdGVOdW1iZXIiOiJ4MTEiLCJzaXplIjoibWVkaXVtIiwic2xvdE51bWJlciI6IkExNCIsImlhdCI6MTc1MjQyMjM3MX0.N432MomsdRocdmZn4LCvT5eqJF3NarUMijnx8Uy72Ec"
}
```

**คำอธิบาย:**
- สร้างตั๋วจอดรถสำหรับรถที่เข้ามาจอด
- ระบบจะจัดสรรช่องจอดรถที่ใกล้ทางเข้าที่สุดให้อัตโนมัติ
- ได้รับ `ticketToken` สำหรับใช้ในการออกจากลานจอดรถ

### 8. ออกจากลานจอดรถ

**Endpoint:** `PUT /ticket/leave-parking`

**Authentication:** Ticket Token Required (ใช้ ticketToken ที่ได้จากการสร้างตั๋ว)

**cURL:**
```bash
curl -X PUT http://localhost:3000/api/ticket/leave-parking \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TICKET_TOKEN" \
  -d '{
    "id": 1,
    "plateNumber": "x11",
    "size": "medium",
    "slotNumber": "A14"
  }'
```

**Request Body:**
```json
{
    "id": 1,
    "plateNumber": "x11",
    "size": "medium",
    "slotNumber": "A14"
}
```

**Response (200 OK):**
```
Car has left the parking successfully
```

**คำอธิบาย:**
- ใช้สำหรับออกจากลานจอดรถ
- ต้องใช้ `ticketToken` ที่ได้จากการสร้างตั๋ว
- ระบบจะปลดล็อคช่องจอดรถให้ว่างอัตโนมัติ

---

## 📋 สรุปขั้นตอนการใช้งาน

### 1. การเข้าสู่ระบบและสร้างลานจอดรถ:
```bash
# 1. Login เพื่อรับ Access Token
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "test@email.com", "password": "password"}'

# 2. สร้างลานจอดรถ
curl -X POST http://localhost:3000/api/parking-lot \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -d '{"name": "Parking A", "totalSlot": 40}'

# 3. สร้างช่องจอดรถ
curl -X POST http://localhost:3000/api/parking-slot \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -d '{"slotNumber": "A01", "distanceFromEntry": 1, "parkingLotId": 1}'
```

### 2. การจอดรถและออกจากลานจอดรถ:
```bash
# 1. จอดรถ (สร้างตั๋ว)
curl -X POST http://localhost:3000/api/ticket \
  -H "Content-Type: application/json" \
  -d '{"plateNumber": "ABC-1234", "size": "medium", "parkingLotId": 1}'

# 2. ออกจากลานจอดรถ (ใช้ ticketToken)
curl -X PUT http://localhost:3000/api/ticket/leave-parking \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TICKET_TOKEN" \
  -d '{"id": 1, "plateNumber": "ABC-1234", "size": "medium", "slotNumber": "A01"}'
```

### 3. การตรวจสอบสถานะ:
```bash
# ตรวจสอบสถานะลานจอดรถ
curl -X GET http://localhost:3000/api/parking-lot/status/1

# ดูรายการป้ายทะเบียนรถ
curl -X GET "http://localhost:3000/api/ticket/registration-plate-number/list?carSize=medium&parkingLotId=1" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"

# ดึงรายการหมายเลขช่องจอดรถที่ถูกจัดสรรตามขนาดรถ
curl -X GET "http://localhost:3000/api/ticket/registration-allocated-slot-number/list?carSize=medium&parkingLotId=2" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

---

## 🔒 ข้อมูลความปลอดภัย

- **Access Token**: ใช้สำหรับ Admin operations (สร้างลานจอดรถ, ช่องจอดรถ, ดูรายงาน)
- **Ticket Token**: ใช้เฉพาะสำหรับการออกจากลานจอดรถเท่านั้น
- Token ทั้งสองชนิดมีระยะเวลาหมดอายุ ตรวจสอบ response เมื่อ token หมดอายุ

## หมายเหตุ

- แทนที่ `YOUR_ACCESS_TOKEN` ด้วย token ที่ได้จาก login endpoint
- แทนที่ `TICKET_TOKEN` ด้วย ticketToken ที่ได้จาก create ticket endpoint
- ขนาดรถที่รองรับ: `small`, `medium`, `large`
- ระบบจะจัดสรรช่องจอดรถที่ใกล้ทางเข้าที่สุดให้อัตโนมัติ



##  ตัวแปร Environment

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
sql/                                # init, seed ข้อมูล
src/
├── activity-log/                   # โมดูลบันทึกกิจกรรม
├── admin-user/                     # การจัดการผู้ดูแลระบบ
├── auth/                           # การยืนยันตัวตนและ JWT
├── car/                            # การจัดการรถยนต์
├── common/                         # ยูทิลิตี้ที่ใช้ร่วม, guards, decorators
│   ├── constants/
│   ├── decorator/
│   ├── enum/
│   ├── guard/
│   └── interface/
├── config/                         # ไฟล์การกำหนดค่า
├── interceptor/                    # Request/Response interceptors
├── parking-lot/                    # การจัดการลานจอดรถ
├── parking-slot/                   # การจัดการช่องจอดรถ
├── ticket/                         # ระบบตั๋วจอดรถ
├── app.module.ts                   # โมดูลหลักของแอปพลิเคชัน
└── main.ts                         # จุดเริ่มต้นของแอปพลิเคชัน
Assignment.postman_collection.json  # ไฟล์สำหรับ import postman
```
