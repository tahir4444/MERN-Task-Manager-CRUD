import User from '../models/User.js';

export const checkPermission = (resource, action) => {
  return async (req, res, next) => {
    try {
      const user = await User.findById(req.user.id).populate('roles');
      
      if (!user) {
        return res.status(401).json({ message: 'User not found' });
      }

      const hasPermission = user.roles.some(role => 
        role.permissions.some(permission => 
          permission.resource === resource && 
          permission.actions.includes(action)
        )
      );

      if (!hasPermission) {
        return res.status(403).json({ 
          message: 'You do not have permission to perform this action' 
        });
      }

      next();
    } catch (error) {
      console.error('Permission check error:', error);
      res.status(500).json({ message: 'Error checking permissions' });
    }
  };
}; 