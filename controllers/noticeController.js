const Description = require('../models/Description');

exports.createNotice = async (req, res) => {
  try {
    const { title, description } = req.body;
    const newNotice = new Description({ title, description });
    await newNotice.save();
    res.status(201).json(newNotice);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create notice' });
  }
};

exports.getAllNotices = async (req, res) => {
  try {
    const notices = await Description.find();
    res.json(notices);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch notices' });
  }
};

exports.getNoticeById = async (req, res) => {
  try {
    const notice = await Description.findById(req.params.id);
    if (!notice) return res.status(404).json({ error: 'Notice not found' });
    res.json(notice);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch notice' });
  }
};

exports.updateNotice = async (req, res) => {
    try {
      const { title, description } = req.body;
  
      if (!title || !description) {
        return res.status(400).json({ error: 'Title and Description are required' });
      }
  
      // Check if a notice already exists
      const existing = await Description.findOne();
  
      let result;
  
      if (existing) {
        // Replace the existing document
        result = await Description.findOneAndReplace(
          { _id: existing._id },
          { title, description },
          { new: true, runValidators: true }
        );
      } else {
        // Create the first document
        result = await Description.create({ title, description });
      }
  
      res.status(200).json(result);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to update or create notice' });
    }
  };
  

exports.deleteNotice = async (req, res) => {
  try {
    const deleted = await Description.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Notice not found' });
    res.json({ message: 'Notice deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete notice' });
  }
};
