import express from 'express';
import Item from '../models/Item.js';
import { auth } from '../middleware/auth.js';
import { findMatches } from '../utils/matchItems.js';

const router = express.Router();

router.post('/', auth, async (req, res) => {
  try {
    const {
      title,
      description,
      type,
      category,
      location,
      dateLostOrFound,
      imageUrl,
      imagePublicId,
    } = req.body;

    if (!title || !description || !type || !category || !location) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    const item = new Item({
      title,
      description,
      type,
      category,
      location,
      dateLostOrFound,
      imageUrl,
      imagePublicId,
      postedBy: req.user.id,
    });

    await item.save();
    await item.populate('postedBy', 'name email');

    const matches = await findMatches(item);

    res.status(201).json({ item, matches });
  } catch (error) {
    console.error('Error creating item:', error);
    res.status(500).json({ message: 'Server error while creating item' });
  }
});

router.get('/', async (req, res) => {
  try {
    const { type, category, location, q } = req.query;

    const filter = {};

    if (type) {
      filter.type = type;
    }

    if (category) {
      filter.category = category;
    }

    if (location) {
      filter.location = new RegExp(location, 'i');
    }

    if (q) {
      filter.$text = { $search: q };
    }

    const items = await Item.find(filter)
      .populate('postedBy', 'name email')
      .sort({ createdAt: -1 });

    res.json(items);
  } catch (error) {
    console.error('Error fetching items:', error);
    res.status(500).json({ message: 'Server error while fetching items' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const item = await Item.findById(req.params.id).populate('postedBy', 'name email');

    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    res.json(item);
  } catch (error) {
    console.error('Error fetching item:', error);
    res.status(500).json({ message: 'Server error while fetching item' });
  }
});

router.put('/:id', auth, async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);

    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    if (item.postedBy.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to edit this item' });
    }

    const { title, description, category, location, dateLostOrFound } = req.body;

    if (title) item.title = title;
    if (description) item.description = description;
    if (category) item.category = category;
    if (location) item.location = location;
    if (dateLostOrFound) item.dateLostOrFound = dateLostOrFound;

    await item.save();
    await item.populate('postedBy', 'name email');

    res.json(item);
  } catch (error) {
    console.error('Error updating item:', error);
    res.status(500).json({ message: 'Server error while updating item' });
  }
});

router.patch('/:id/status', auth, async (req, res) => {
  try {
    const { status } = req.body;

    if (!['open', 'matched', 'closed'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status value' });
    }

    const item = await Item.findById(req.params.id);

    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    if (item.postedBy.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to update this item' });
    }

    item.status = status;
    await item.save();
    await item.populate('postedBy', 'name email');

    res.json(item);
  } catch (error) {
    console.error('Error updating item status:', error);
    res.status(500).json({ message: 'Server error while updating status' });
  }
});

export default router;
