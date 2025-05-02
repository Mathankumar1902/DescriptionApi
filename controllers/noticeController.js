const Description = require('../models/Description');

// Create new notice
exports.createNotice = async (req, res) => {
  try {
    const { title, description, status } = req.body || {};
    const profile = req.file?.path;  // If a profile image is uploaded, get the file path

    const newNotice = new Description({
      title,
      description,
      status,
      profile,
    });

    await newNotice.save();
    res.status(201).json({ message: 'Notice created successfully', data: newNotice });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create notice' });
  }
};

// Get all notices
exports.getAllNotices = async (req, res) => {
  try {
    const notices = await Description.find();

    // Check if no notices exist
    if (notices.length === 0) {
      return res.status(404).json({ message: 'No notices found in the database' });
    }

    res.json({ message: 'Notices retrieved successfully', data: notices });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch notices' });
  }
};


// Get notice by ID
exports.getNoticeById = async (req, res) => {
  try {
    const notice = await Description.findById(req.params.id);
    if (!notice) return res.status(404).json({ error: 'Notice not found' });
    res.json({ message: 'Notice retrieved successfully', data: notice });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch notice' });
  }
};

// Update notice
exports.updateNotice = async (req, res) => {
  try {
    // Get the one and only existing document
    const existing = await Description.findOne();
    if (!existing) {
      return res.status(404).json({ message: 'No notice found to update' });
    }

    const profile = req.file?.path;
    const updateData = {};
    const updatedFields = [];

    if (req.body.title !== undefined) {
      updateData.title = req.body.title;
      updatedFields.push('title');
    }
    if (req.body.description !== undefined) {
      updateData.description = req.body.description;
      updatedFields.push('description');
    }
    if (req.body.status !== undefined) {
      updateData.status = req.body.status;
      updatedFields.push('status');
    }

    if (profile && profile !== existing.profile) {
      updateData.profile = profile;
      updatedFields.push('profile');
    }

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ message: 'No valid fields provided for update' });
    }

    const updated = await Description.findByIdAndUpdate(
      existing._id,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    return res.status(200).json({
      message: `Updated fields: ${updatedFields.join(', ')}`,
      data: updated
    });
  } catch (err) {
    console.error('Update Error:', err);
    return res.status(500).json({ message: 'Failed to update notice' });
  }
};


// Delete notice
exports.deleteNotice = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await Description.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ error: 'Notice not found' });
    }

    res.json({ message: 'Notice deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete notice' });
  }
};
