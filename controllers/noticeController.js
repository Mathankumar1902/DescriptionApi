const Description = require('../models/Description');

// Create new notice
exports.createNotice = async (req, res) => {
  try {
    const { title, description, status } = req.body;
    const profile = req.file?.path;

    const newNotice = new Description({
      title,
      description,
      status,
      profile,
    });

    await newNotice.save();
    res.status(201).json(newNotice);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create notice' });
  }
};


// Get all notices
exports.getAllNotices = async (req, res) => {
  try {
    const notices = await Description.find();
    res.json(notices);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch notices' });
  }
};

// Get notice by ID
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
    const { title, description, status } = req.body;
    const profile = req.file?.path; // Only defined if new file is uploaded

    // Get the existing document (there should be only one)
    const existing = await Description.findOne();
    if (!existing) {
      return res.status(404).json({ error: 'No notice found to update' });
    }

    // Create an update object only with provided fields
    const updateData = {};
    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (status !== undefined) updateData.status = status;

    // Only update profile if a new file is uploaded and different from existing
    if (profile && profile !== existing.profile) {
      updateData.profile = profile;
    }

    const updated = await Description.findByIdAndUpdate(
      existing._id,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    res.status(200).json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update notice' });
  }
};


// Delete notice
exports.deleteNotice = async (req, res) => {
  try {
    const { id } = req.params;
    const fieldsToDelete = req.body; // expects: { status: true, title: true } etc.

    // If no fields provided, delete the whole document
    if (!fieldsToDelete || Object.keys(fieldsToDelete).length === 0) {
      const deleted = await Description.findByIdAndDelete(id);
      if (!deleted) return res.status(404).json({ error: 'Notice not found' });
      return res.json({ message: 'Entire notice deleted' });
    }

    // Build $unset object from provided field keys
    const unsetFields = {};
    for (const key of Object.keys(fieldsToDelete)) {
      unsetFields[key] = "";
    }

    const updated = await Description.findByIdAndUpdate(
      id,
      { $unset: unsetFields },
      { new: true }
    );

    if (!updated) return res.status(404).json({ error: 'Notice not found' });

    res.json({ message: 'Selected fields deleted', data: updated });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete notice or fields' });
  }
};

