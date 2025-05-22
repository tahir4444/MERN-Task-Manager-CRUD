import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import PermissionsManager from '../components/roles/PermissionsManager';
import axiosInstance from '../services/axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../index.css';

const EmptyState = ({ onAddClick }) => (
  <div className="text-center py-5">
    <i className="bi bi-people-fill display-1 text-muted mb-3"></i>
    <h3 className="mb-3">No Roles Found</h3>
    <p className="text-muted mb-4">
      Get started by creating your first role. Roles help you manage permissions and access control in your application.
    </p>
    <button
      className="btn btn-primary btn-lg"
      onClick={onAddClick}
    >
      Create Your First Role
    </button>
  </div>
);

const RolesManager = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [roles, setRoles] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingRole, setEditingRole] = useState(null);
  const [roleName, setRoleName] = useState('');
  const [roleDescription, setRoleDescription] = useState('');
  const [permissions, setPermissions] = useState([]);
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchRoles();
  }, [user, navigate]);

  const fetchRoles = async () => {
    try {
      const response = await axiosInstance.get('/roles');
      setRoles(response.data);
    } catch (error) {
      console.error('Error fetching roles:', error);
      toast.error('Failed to fetch roles');
    }
  };

  const handleOpenDialog = (role = null) => {
    if (role) {
      setEditingRole(role);
      setRoleName(role.name);
      setRoleDescription(role.description);
      setPermissions(role.permissions || []);
      setIsActive(role.isActive);
    } else {
      setEditingRole(null);
      setRoleName('');
      setRoleDescription('');
      setPermissions([]);
      setIsActive(true);
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingRole(null);
    setRoleName('');
    setRoleDescription('');
    setPermissions([]);
    setIsActive(true);
  };

  const handleSubmit = async () => {
    if (!roleName.trim()) {
      toast.error('Role name is required');
      return;
    }

    try {
      if (editingRole) {
        await axiosInstance.put(`/roles/${editingRole._id}`, {
          name: roleName.trim(),
          description: roleDescription.trim(),
          permissions,
          isActive
        });
        toast.success('Role updated successfully');
      } else {
        await axiosInstance.post('/roles', {
          name: roleName.trim(),
          description: roleDescription.trim(),
          permissions,
          isActive
        });
        toast.success('Role created successfully');
      }
      fetchRoles();
      handleCloseDialog();
    } catch (error) {
      console.error('Error saving role:', error);
      toast.error(error.response?.data?.message || 'Failed to save role');
    }
  };

  const handleDelete = async (roleId) => {
    if (window.confirm('Are you sure you want to delete this role?')) {
      try {
        await axiosInstance.delete(`/roles/${roleId}`);
        toast.success('Role deleted successfully');
        fetchRoles();
      } catch (error) {
        console.error('Error deleting role:', error);
        toast.error('Failed to delete role');
      }
    }
  };

  return (
    <div className="container py-5">
      <div className="row mb-4">
        <div className="col">
          <h1>Roles Management</h1>
        </div>
      </div>

      <div className="row">
        <div className="col">
          <div className="card bg-light text-dark border-dark">
            <div className="card-header d-flex justify-content-between align-items-center">
              <h5 className="mb-0">Roles List</h5>
              {roles.length > 0 && (
                <button
                  className="btn btn-primary"
                  onClick={() => handleOpenDialog()}
                >
                  Add Role
                </button>
              )}
            </div>
            <div className="card-body">
              {roles.length === 0 ? (
                <EmptyState onAddClick={() => handleOpenDialog()} />
              ) : (
                <div className="table-responsive">
                  <table className="table table-hover">
                    <thead>
                      <tr>
                        <th>Role Name</th>
                        <th>Description</th>
                        <th>Status</th>
                        <th>Created At</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {roles.map((role) => (
                        <tr key={role._id}>
                          <td>{role.name}</td>
                          <td>{role.description}</td>
                          <td>
                            <span className={`badge ${role.isActive ? 'bg-success' : 'bg-danger'}`}>
                              {role.isActive ? 'Active' : 'Inactive'}
                            </span>
                          </td>
                          <td>{new Date(role.createdAt).toLocaleDateString()}</td>
                          <td>
                            <div className="d-flex gap-2">
                              <button
                                className="btn btn-sm btn-info"
                                onClick={() => handleOpenDialog(role)}
                              >
                                Edit
                              </button>
                              <button
                                className="btn btn-sm btn-danger"
                                onClick={() => handleDelete(role._id)}
                              >
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Edit/Add Role Modal */}
      {openDialog && (
        <div className="modal fade show" style={{ display: 'block' }} tabIndex="-1">
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {editingRole ? 'Edit Role' : 'Add New Role'}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={handleCloseDialog}
                ></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label htmlFor="roleName" className="form-label">Role Name</label>
                  <input
                    type="text"
                    className="form-control"
                    id="roleName"
                    value={roleName}
                    onChange={(e) => setRoleName(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="roleDescription" className="form-label">Description</label>
                  <textarea
                    className="form-control"
                    id="roleDescription"
                    rows="3"
                    value={roleDescription}
                    onChange={(e) => setRoleDescription(e.target.value)}
                  ></textarea>
                </div>
                <div className="mb-3">
                  <div className="form-check form-switch">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="roleStatus"
                      checked={isActive}
                      onChange={(e) => setIsActive(e.target.checked)}
                    />
                    <label className="form-check-label" htmlFor="roleStatus">
                      Active
                    </label>
                  </div>
                </div>
                <PermissionsManager
                  permissions={permissions}
                  onChange={setPermissions}
                />
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={handleCloseDialog}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleSubmit}
                >
                  {editingRole ? 'Update' : 'Create'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RolesManager; 