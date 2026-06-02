const pool = require('../config/db');

const getItems = async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT items.*, users.name as posted_by FROM items JOIN users ON items.user_id = users.id ORDER BY items.created_at DESC'
    );
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching items', error: error.message });
  }
};

const createItem = async (req, res) => {
  const { title, description, category, status, location, contact_info } = req.body;
  const image_url = req.file ? `/uploads/${req.file.filename}` : null;
  try {
    const result = await pool.query(
      'INSERT INTO items (title, description, category, status, location, contact_info, image_url, user_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *',
      [title, description, category, status, location, contact_info, image_url, req.user.id]
    );
    res.status(201).json({ message: 'Item created successfully', item: result.rows[0] });
  } catch (error) {
    res.status(500).json({ message: 'Error creating item', error: error.message });
  }
};

const updateItemStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  try {
    const result = await pool.query(
      'UPDATE items SET status=$1 WHERE id=$2 AND user_id=$3 RETURNING *',
      [status, id, req.user.id]
    );
    if (result.rows.length === 0) {
      return res.status(403).json({ message: 'Not authorized to update this item' });
    }
    res.json({ message: 'Status updated successfully', item: result.rows[0] });
  } catch (error) {
    res.status(500).json({ message: 'Error updating item', error: error.message });
  }
};

const deleteItem = async (req, res) => {
  const { id } = req.params;
  try {
    const check = await pool.query('SELECT * FROM items WHERE id=$1 AND user_id=$2', [id, req.user.id]);
    if (check.rows.length === 0) {
      return res.status(403).json({ message: 'Not authorized to delete this item' });
    }
    await pool.query('DELETE FROM items WHERE id=$1', [id]);
    res.json({ message: 'Item deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting item', error: error.message });
  }
};

module.exports = { getItems, createItem, updateItemStatus, deleteItem };