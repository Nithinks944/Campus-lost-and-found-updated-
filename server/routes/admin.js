import express from 'express';
import { v2 as cloudinary } from 'cloudinary';
import Item from '../models/Item.js';
import { auth, isAdmin } from '../middleware/auth.js';

const router = express.Router();

router.get('/items/pending', auth, isAdmin, async (req, res) => {
  try {
    const pendingItems = await Item.find({ isVerified: false })
      .populate('postedBy', 'name email')
      .sort({ createdAt: -1 });

    res.json(pendingItems);
  } catch (error) {
    console.error('Error fetching pending items:', error);
    res.status(500).json({ message: 'Server error while fetching pending items' });
  }
});

router.patch('/items/:id/verify', auth, isAdmin, async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);

    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    item.isVerified = true;
    await item.save();
    await item.populate('postedBy', 'name email');

    res.json(item);
  } catch (error) {
    console.error('Error verifying item:', error);
    res.status(500).json({ message: 'Server error while verifying item' });
  }
});

router.delete('/items/:id', auth, isAdmin, async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);

    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    if (item.imagePublicId) {
      try {
        await cloudinary.uploader.destroy(item.imagePublicId);
      } catch (cloudinaryError) {
        console.error('Error deleting image from Cloudinary:', cloudinaryError);
      }
    }

    await Item.findByIdAndDelete(req.params.id);

    res.json({ message: 'Item deleted successfully' });
  } catch (error) {
    console.error('Error deleting item:', error);
    res.status(500).json({ message: 'Server error while deleting item' });
  }
});

export default router;
