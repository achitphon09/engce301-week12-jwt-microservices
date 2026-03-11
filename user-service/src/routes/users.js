const express = require('express');
const { pool } = require('../db/db');
const { requireAuth, requireRole } = require('../middleware/authMiddleware');

const router = express.Router();

// GET /api/users/me — ดูโปรไฟล์ตัวเอง (ต้อง login)
router.get('/me', requireAuth, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM user_profiles WHERE user_id = $1',
      [req.user.sub]
    );
    if (!result.rows[0]) {
      return res.status(404).json({ error: 'ไม่พบข้อมูล profile' });
    }
    res.json({ user: result.rows[0] });
  } catch (err) {
    console.error('[USER] /me error:', err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/users/internal/profile — สร้างโปรไฟล์ (Internal Use Only)
router.post('/internal/profile', async (req, res) => {
  const { user_id, name, email, role } = req.body;
  if (!user_id || !name || !email) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  try {
    const result = await pool.query(
      `INSERT INTO user_profiles (user_id, name, email, role)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [user_id, name, email, role || 'member']
    );
    res.status(201).json({ profile: result.rows[0] });
  } catch (err) {
    console.error('[USER] internal /profile error:', err.message);
    // Ignore duplicate key errors if profile already exists
    if (err.code === '23505') {
      return res.status(200).json({ message: 'Profile already exists' });
    }
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/users — ดู users ทั้งหมด (admin only)
router.get('/', requireAuth, requireRole('admin'), async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, user_id, name, email, role, created_at FROM user_profiles ORDER BY created_at DESC'
    );
    res.json({ users: result.rows, total: result.rowCount });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/users/health
router.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'user-service' });
});

module.exports = router;
