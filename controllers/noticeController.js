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
    const { title, description, status } = req.body;
    const profile = req.file?.path; // Only defined if new file is uploaded

    // Get the existing notice by ID
    const existing = await Description.findById(req.body.id);
    if (!existing) {
      return res.status(404).json({ error: 'Notice not found to update' });
    }

    // Create an update object with the fields that are provided
    const updateData = {};
    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (status !== undefined) updateData.status = status;

    // Only update the profile if a new file is uploaded
    if (profile && profile !== existing.profile) {
      updateData.profile = profile;
    }

    const updated = await Description.findByIdAndUpdate(
      req.body.id,  // Use ID from request body or params
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (updated) {
      let updatedFields = Object.keys(updateData);
      res.json({
        message: `Notice updated successfully, updated fields: ${updatedFields.join(', ')}`,
        data: updated,
      });
    } else {
      res.status(400).json({ error: 'No fields were provided for update' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update notice' });
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
