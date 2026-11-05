import express from 'express';
import Item from '../models/Item.js';
import { auth } from '../middleware/auth.js';
import { findMatches } from '../utils/matchItems.js';

const router = express.Router();

// Campus Hotspot / Zone Analytics
router.get('/stats/zones', async (req, res) => {
  try {
    const zones = [
      'Central Library',
      'Engineering / Tech Block',
      'Cafeteria / Food Court',
      'Sports Complex & Gym',
      'Main Auditorium',
      'Student Hostels',
      'Main Entrance Gate',
      'General Campus Area',
    ];

    const stats = await Promise.all(
      zones.map(async (zone) => {
        const lostCount = await Item.countDocuments({ campusZone: zone, type: 'lost', status: 'open' });
        const foundCount = await Item.countDocuments({ campusZone: zone, type: 'found', status: 'open' });
        return {
          zone,
          lostCount,
          foundCount,
          total: lostCount + foundCount,
        };
      })
    );

    res.json(stats);
  } catch (error) {
    console.error('Error fetching zone stats:', error);
    res.status(500).json({ message: 'Server error while fetching zone statistics' });
  }
});

// Create new Item
router.post('/', auth, async (req, res) => {
  try {
    const {
      title,
      description,
      type,
      category,
      location,
      campusZone,
      secretQuestion,
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
      campusZone: campusZone || 'General Campus Area',
      secretQuestion: secretQuestion || '',
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

// Get all items with filters
router.get('/', async (req, res) => {
  try {
    const { type, category, location, campusZone, q } = req.query;

    const filter = {};

    if (type) {
      filter.type = type;
    }

    if (category) {
      filter.category = category;
    }

    if (campusZone) {
      filter.campusZone = campusZone;
    }

    if (location) {
      filter.location = new RegExp(location, 'i');
    }

    if (q) {
      filter.$text = { $search: q };
    }

    const items = await Item.find(filter)
      .populate('postedBy', 'name email')
      .populate('claims.claimant', 'name email')
      .sort({ createdAt: -1 });

    res.json(items);
  } catch (error) {
    console.error('Error fetching items:', error);
    res.status(500).json({ message: 'Server error while fetching items' });
  }
});

// Get single item by ID
router.get('/:id', async (req, res) => {
  try {
    const item = await Item.findById(req.params.id)
      .populate('postedBy', 'name email')
      .populate('claims.claimant', 'name email');

    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    // Also compute potential matches for this item
    const matches = await findMatches(item);

    res.json({ item, matches });
  } catch (error) {
    console.error('Error fetching item:', error);
    res.status(500).json({ message: 'Server error while fetching item' });
  }
});

// Submit Ownership Proof / Claim for an item
router.post('/:id/claim', auth, async (req, res) => {
  try {
    const { proofDescription, contactInfo } = req.body;

    if (!proofDescription) {
      return res.status(400).json({ message: 'Proof description is required to claim this item' });
    }

    const item = await Item.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    if (item.postedBy.toString() === req.user.id) {
      return res.status(400).json({ message: 'You cannot file an ownership claim on your own post' });
    }

    // Check if user already claimed this item
    const alreadyClaimed = item.claims.some(
      (c) => c.claimant.toString() === req.user.id
    );

    if (alreadyClaimed) {
      return res.status(400).json({ message: 'You have already submitted a claim for this item' });
    }

    item.claims.push({
      claimant: req.user.id,
      proofDescription,
      contactInfo: contactInfo || '',
      status: 'pending',
    });

    await item.save();
    await item.populate('claims.claimant', 'name email');

    res.status(201).json({
      success: true,
      message: 'Ownership proof claim submitted successfully',
      item,
    });
  } catch (error) {
    console.error('Error submitting claim:', error);
    res.status(500).json({ message: 'Server error while submitting claim' });
  }
});

// Review Claim (Approve / Reject) by item poster or admin
router.patch('/:id/claims/:claimId', auth, async (req, res) => {
  try {
    const { status } = req.body; // 'approved' or 'rejected'

    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({ message: 'Status must be approved or rejected' });
    }

    const item = await Item.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    if (item.postedBy.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to review claims for this item' });
    }

    const claim = item.claims.id(req.params.claimId);
    if (!claim) {
      return res.status(404).json({ message: 'Claim not found' });
    }

    claim.status = status;

    if (status === 'approved') {
      item.status = 'matched';
    }

    await item.save();
    await item.populate('postedBy', 'name email');
    await item.populate('claims.claimant', 'name email');

    res.json({
      success: true,
      message: `Claim ${status} successfully`,
      item,
    });
  } catch (error) {
    console.error('Error reviewing claim:', error);
    res.status(500).json({ message: 'Server error while reviewing claim' });
  }
});

// Update item details
router.put('/:id', auth, async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);

    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    if (item.postedBy.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to edit this item' });
    }

    const { title, description, category, location, campusZone, secretQuestion, dateLostOrFound } = req.body;

    if (title) item.title = title;
    if (description) item.description = description;
    if (category) item.category = category;
    if (location) item.location = location;
    if (campusZone) item.campusZone = campusZone;
    if (secretQuestion !== undefined) item.secretQuestion = secretQuestion;
    if (dateLostOrFound) item.dateLostOrFound = dateLostOrFound;

    await item.save();
    await item.populate('postedBy', 'name email');

    res.json(item);
  } catch (error) {
    console.error('Error updating item:', error);
    res.status(500).json({ message: 'Server error while updating item' });
  }
});

// Update item status
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
