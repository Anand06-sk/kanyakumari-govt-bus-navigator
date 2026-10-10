
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import pool from './db.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Kanniyakumari Bus Navigator API is running',
  });
});

app.get('/api/db-check', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT current_database() AS database'
    );

    res.json({
      success: true,
      message: 'PostgreSQL connected successfully',
      database: result.rows[0].database,
    });
  } catch (error) {
    console.error('Database check failed:', error.message);

    res.status(500).json({
      success: false,
      message: 'Database connection failed',
    });
  }
});

app.get('/api/buses', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM buses ORDER BY id DESC'
    );

    res.json({
      success: true,
      buses: result.rows,
    });
  } catch (error) {
    console.error('Get buses error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch buses',
    });
  }
});

app.post('/api/buses', async (req, res) => {
  try {
    const {
      bus_number,
      bus_name,
      bus_type,
      source,
      destination,
      fare,
      women_scheme_eligibility,
    } = req.body;

    if (!bus_number || !source || !destination) {
      return res.status(400).json({
        success: false,
        message: 'Bus number, source, and destination are required',
      });
    }

    const result = await pool.query(
      `INSERT INTO buses (
        bus_number, bus_name, bus_type,
        source, destination, fare,
        women_scheme_eligibility
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *`,
      [
        bus_number,
        bus_name || null,
        bus_type || 'Government',
        source,
        destination,
        fare ?? 0,
        women_scheme_eligibility || 'pending_verification',
      ]
    );

    res.status(201).json({
      success: true,
      message: 'Bus added successfully',
      bus: result.rows[0],
    });
  } catch (error) {
    console.error('Add bus error:', error.message);

    if (error.code === '23505') {
      return res.status(409).json({
        success: false,
        message: 'This bus number already exists',
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to add bus',
    });
  }
});

app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});