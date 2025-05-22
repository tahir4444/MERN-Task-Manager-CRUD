import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import Role from './Role.js';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  username: {
    type: String,
    required: true,
    unique: true
  },
  mobile: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: function(v) {
        return /^[0-9+\-() ]+$/.test(v);
      },
      message: props => `${props.value} is not a valid mobile number!`
    }
  },
  address: {
    type: String,
    required: true
  },
  profile_pic: {
    type: String
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: function(v) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
      },
      message: props => `${props.value} is not a valid email!`
    }
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Role',
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare password
userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Method to check if user has a specific role
userSchema.methods.hasRole = async function(roleName) {
  await this.populate('role');
  return this.role.name === roleName;
};

// Method to check if user has permission for a specific action on a resource
userSchema.methods.hasPermission = async function(resource, action) {
  await this.populate('role');
  return this.role.permissions.some(permission => 
    permission.resource === resource && 
    permission.actions.includes(action)
  );
};

const User = mongoose.model('User', userSchema);

export default User;
