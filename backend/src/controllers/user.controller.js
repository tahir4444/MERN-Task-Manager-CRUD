import User from '../models/User.js';
import Role from '../models/Role.js';

// Get all users
export const getUsers = async (req, res) => {
  try {
    const users = await User.find()
      .select('-password')
      .populate('role', 'name description')
      .sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a new user
export const createUser = async (req, res) => {
  try {
    const { name, email, password, roleId, username, mobile, address } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ 
      $or: [
        { email },
        { username },
        { mobile }
      ]
    });
    
    if (existingUser) {
      return res.status(400).json({ 
        message: 'User with this email, username, or mobile number already exists' 
      });
    }

    // Check if role exists
    const role = await Role.findById(roleId);
    if (!role) {
      return res.status(400).json({ message: 'Invalid role' });
    }

    const user = new User({
      name,
      email,
      password,
      role: roleId,
      username,
      mobile,
      address,
      profile_pic: req.file ? req.file.filename : undefined
    });

    const savedUser = await user.save();
    const populatedUser = await User.findById(savedUser._id)
      .select('-password')
      .populate('role', 'name description');

    res.status(201).json(populatedUser);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update a user
export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, roleId, isActive, username, mobile, address } = req.body;

    // Check if user exists
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if new email, username, or mobile conflicts with existing user
    if (email !== user.email || username !== user.username || mobile !== user.mobile) {
      const existingUser = await User.findOne({
        $or: [
          { email, _id: { $ne: id } },
          { username, _id: { $ne: id } },
          { mobile, _id: { $ne: id } }
        ]
      });
      
      if (existingUser) {
        return res.status(400).json({ 
          message: 'User with this email, username, or mobile number already exists' 
        });
      }
    }

    // Check if role exists
    if (roleId) {
      const role = await Role.findById(roleId);
      if (!role) {
        return res.status(400).json({ message: 'Invalid role' });
      }
    }

    const updateData = {
      name,
      email,
      username,
      mobile,
      address,
      ...(roleId && { role: roleId }),
      ...(isActive !== undefined && { isActive })
    };

    if (req.file) {
      updateData.profile_pic = req.file.filename;
    }

    const updatedUser = await User.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    )
      .select('-password')
      .populate('role', 'name description');

    res.json(updatedUser);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete a user
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    await User.findByIdAndDelete(id);
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get user by ID
export const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const user = await User.findById(id)
      .select('-password')
      .populate('role', 'name description');
      
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}; 