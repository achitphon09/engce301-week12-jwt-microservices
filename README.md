# engce301-week12-jwt-microservices

**ชื่อ-นามสกุล:** อชิตพล เอาชารส 
**รหัสนักศึกษา:** -

## ใบงาน Week 12: Security Architecture Analysis

โปรเจ็กต์นี้เป็นการนำ Microservices (Auth, User, Task) มาใช้งานร่วมกับ JWT Authentication โดยอ้างอิงจากโครงสร้างโปรเจ็กต์ของ `maythiwat/engce301-lab-jwt-microservices` (แต่อาจมีการปรับปรุงและแก้ไขบัค)

### การแก้ไข Bug ฝั่ง Backend (Sync Profiles)
ในตัวอย่างดั้งเดิม เมื่อทำการ `POST /api/auth/register` แอคเคาท์จะถูกสร้างใน `auth_db` แต่ไม่ได้มีการสร้างข้อมูล Profile พื้นฐานในฝั่งของ `user_service` ทำให้เมื่อเรียกใช้งาน `GET /api/users/me` จะเกิด 404 Not Found

**การแก้ไขที่ทำ:**
1. เพิ่ม Route `POST /api/users/internal/profile` ภายใน `user-service` สำหรับให้ Service ภายในเรียกใช้งานเพื่อสร้าง User Profile พื้นฐาน
2. แก้ไข `POST /api/auth/register` ใน `auth-service` ให้หลังจากสร้าง Account ใน `auth_users` เสร็จสิ้นแล้ว จะทำการยิ่ง Request ไปที่ API ของ `user-service` ที่สร้างในข้อ 1 เพื่อทำการ Sync ข้อมูลโปรไฟล์ทันที

### วิธีการรัน

1. เตรียมไฟล์ `.env` ตาม `.env.example`
2. รัน Docker Compose:
   ```bash
   docker-compose up -d --build
   ```
3. สามารถทดสอบ API ผ่านหน้า Frontend ที่ `http://localhost/` หรือเรียก API โดยตรงผ่าน `http://localhost/api/...`

### เอกสารแนบ
- **ส่วนที่ 1** การทดสอบ Test Case อยู่ในไฟล์ [REPORT.md](./REPORT.md)
- **ส่วนที่ 2** Architecture Comparison ก่อนและหลัง อยู่ในไฟล์ [docs/c2-security-architecture-week6.drawio](./docs/c2-security-architecture-week6.drawio) และ [docs/c2-security-architecture.drawio](./docs/c2-security-architecture.drawio)
- **ส่วนที่ 3** Architecture Decision Record อยู่ในไฟล์ [docs/ADR-001-auth-service.md](./docs/ADR-001-auth-service.md)

### ผลลัพธ์การทดสอบหลังจากการแก้ไขบั๊ก

(ภาพผลลัพธ์จะถูกเพิ่มในภายหลังจากการรัน Test)
