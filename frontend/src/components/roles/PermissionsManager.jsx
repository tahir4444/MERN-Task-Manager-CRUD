import React, { useState, useEffect } from 'react';
import axiosInstance from '../../services/axios';

const PermissionsManager = ({ permissions = [], onChange }) => {
  const [availablePermissions, setAvailablePermissions] = useState({
    resources: [],
    actions: []
  });

  useEffect(() => {
    fetchAvailablePermissions();
  }, []);

  const fetchAvailablePermissions = async () => {
    try {
      const response = await axiosInstance.get('/roles/permissions');
      setAvailablePermissions(response.data);
    } catch (error) {
      console.error('Error fetching permissions:', error);
    }
  };

  const handlePermissionChange = (resource, action, checked) => {
    const newPermissions = [...permissions];
    const resourceIndex = newPermissions.findIndex(p => p.resource === resource);

    if (checked) {
      if (resourceIndex === -1) {
        newPermissions.push({
          resource,
          actions: [action]
        });
      } else if (!newPermissions[resourceIndex].actions.includes(action)) {
        newPermissions[resourceIndex].actions.push(action);
      }
    } else {
      if (resourceIndex !== -1) {
        newPermissions[resourceIndex].actions = newPermissions[resourceIndex].actions.filter(a => a !== action);
        if (newPermissions[resourceIndex].actions.length === 0) {
          newPermissions.splice(resourceIndex, 1);
        }
      }
    }

    onChange(newPermissions);
  };

  const isActionChecked = (resource, action) => {
    const resourcePermission = permissions.find(p => p.resource === resource);
    return resourcePermission?.actions.includes(action) || false;
  };

  return (
    <div className="permissions-manager">
      <h6 className="mb-3">Permissions</h6>
      <div className="table-responsive">
        <table className="table table-sm">
          <thead>
            <tr>
              <th>Resource</th>
              {availablePermissions.actions.map(action => (
                <th key={action} className="text-center">
                  {action.charAt(0).toUpperCase() + action.slice(1)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {availablePermissions.resources.map(resource => (
              <tr key={resource}>
                <td>{resource.charAt(0).toUpperCase() + resource.slice(1)}</td>
                {availablePermissions.actions.map(action => (
                  <td key={action} className="text-center">
                    <div className="form-check form-check-inline d-flex justify-content-center">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id={`${resource}-${action}`}
                        checked={isActionChecked(resource, action)}
                        onChange={(e) => handlePermissionChange(resource, action, e.target.checked)}
                      />
                    </div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PermissionsManager; 