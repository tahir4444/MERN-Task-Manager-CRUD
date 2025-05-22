import Role from '../models/Role.js';

// Get all roles
export const getRoles = async (req, res) => {
  try {
    const roles = await Role.find().sort({ createdAt: -1 });
    res.json(roles);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a new role
export const createRole = async (req, res) => {
  try {
    const { name, description, permissions } = req.body;
    
    // Check if role already exists
    const existingRole = await Role.findOne({ name });
    if (existingRole) {
      return res.status(400).json({ message: 'Role with this name already exists' });
    }

    const role = new Role({
      name,
      description,
      permissions: permissions || []
    });

    const savedRole = await role.save();
    res.status(201).json(savedRole);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update a role
export const updateRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, permissions, isActive } = req.body;

    // Check if role exists
    const role = await Role.findById(id);
    if (!role) {
      return res.status(404).json({ message: 'Role not found' });
    }

    // Check if new name conflicts with existing role
    if (name !== role.name) {
      const existingRole = await Role.findOne({ name });
      if (existingRole) {
        return res.status(400).json({ message: 'Role with this name already exists' });
      }
    }

    const updatedRole = await Role.findByIdAndUpdate(
      id,
      { 
        name, 
        description, 
        permissions: permissions || role.permissions,
        isActive: isActive !== undefined ? isActive : role.isActive
      },
      { new: true, runValidators: true }
    );

    res.json(updatedRole);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete a role
export const deleteRole = async (req, res) => {
  try {
    const { id } = req.params;
    
    const role = await Role.findById(id);
    if (!role) {
      return res.status(404).json({ message: 'Role not found' });
    }

    await Role.findByIdAndDelete(id);
    res.json({ message: 'Role deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get available resources and actions
export const getAvailablePermissions = (req, res) => {
  const availableResources = [
    'users',
    'roles',
    'todos',
    'dashboard'
  ];

  const availableActions = [
    'create',
    'read',
    'update',
    'delete'
  ];

  res.json({
    resources: availableResources,
    actions: availableActions
  });
}; 