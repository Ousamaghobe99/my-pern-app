import express from 'express';
import emailService from '../services/emailService.js';
import EmailLog from '../models/EmailLog.js';
import { validateEmail } from '../utils/validation.js';

const router = express.Router();

// Send email directly (REST endpoint as backup)
router.post('/send', async (req, res) => {
  try {
    const { error } = validateEmail(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const result = await emailService.sendEmail(req.body);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get email logs
router.get('/logs', async (req, res) => {
  try {
    const { status, page = 1, limit = 50 } = req.query;
    const query = status ? { status } : {};

    const logs = await EmailLog.find(query)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));

    const total = await EmailLog.countDocuments(query);

    res.json({
      logs,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get specific email log
router.get('/logs/:id', async (req, res) => {
  try {
    const log = await EmailLog.findById(req.params.id);
    if (!log) {
      return res.status(404).json({ error: 'Email log not found' });
    }
    res.json(log);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;