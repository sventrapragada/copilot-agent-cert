import React, { useState, useEffect } from 'react';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const apiUrl = `https://${process.env.REACT_APP_CODESPACE_NAME}-8000.app.github.dev/api/users/`;
        console.log('Fetching users from:', apiUrl);
        
        const response = await fetch(apiUrl);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Users API response:', data);
        
        // Handle both paginated (.results) and plain array responses
        const usersData = data.results || data;
        setUsers(Array.isArray(usersData) ? usersData : []);
        
      } catch (err) {
        console.error('Error fetching users:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  if (loading) return <div className="text-center">Loading users...</div>;
  if (error) return <div className="alert alert-danger">Error: {error}</div>;

  return (
    <div className="container mt-4 fade-in-up">
      <div className="row">
        <div className="col-12">
          <div className="card shadow">
            <div className="card-header">
              <h2 className="mb-0">
                <i className="bi bi-person-circle me-2"></i>
                Users
              </h2>
            </div>
            <div className="card-body">
              {users.length === 0 ? (
                <div className="alert alert-info">
                  <i className="bi bi-info-circle me-2"></i>
                  No users found.
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-striped table-hover">
                    <thead>
                      <tr>
                        <th><i className="bi bi-person me-1"></i>User</th>
                        <th><i className="bi bi-envelope me-1"></i>Email</th>
                        <th><i className="bi bi-calendar me-1"></i>Joined</th>
                        <th><i className="bi bi-shield me-1"></i>Role</th>
                        <th><i className="bi bi-gear me-1"></i>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((user) => (
                        <tr key={user.id}>
                          <td>
                            <div className="d-flex align-items-center">
                              <div className="avatar-circle me-3">
                                <i className="bi bi-person-fill"></i>
                              </div>
                              <div>
                                <div className="fw-bold">
                                  {user.username || user.name || 'User'}
                                </div>
                                <small className="text-muted">
                                  {user.first_name && user.last_name ? 
                                    `${user.first_name} ${user.last_name}` : 
                                    'No name provided'
                                  }
                                </small>
                              </div>
                            </div>
                          </td>
                          <td>
                            <span className="text-muted">
                              <i className="bi bi-envelope-fill me-1"></i>
                              {user.email || 'No email'}
                            </span>
                          </td>
                          <td>
                            <span className="text-muted">
                              {user.date_joined || user.created_at ? 
                                new Date(user.date_joined || user.created_at).toLocaleDateString() : 
                                'N/A'
                              }
                            </span>
                          </td>
                          <td>
                            <div>
                              {user.is_superuser && (
                                <span className="badge bg-danger me-1">
                                  <i className="bi bi-shield-fill-exclamation me-1"></i>
                                  Admin
                                </span>
                              )}
                              {user.is_staff && !user.is_superuser && (
                                <span className="badge bg-primary me-1">
                                  <i className="bi bi-person-badge me-1"></i>
                                  Staff
                                </span>
                              )}
                              {!user.is_staff && !user.is_superuser && (
                                <span className="badge bg-success">
                                  <i className="bi bi-person-check me-1"></i>
                                  User
                                </span>
                              )}
                            </div>
                          </td>
                          <td>
                            <div className="btn-group" role="group">
                              <button className="btn btn-outline-primary btn-sm">
                                <i className="bi bi-eye"></i>
                              </button>
                              <button className="btn btn-outline-secondary btn-sm">
                                <i className="bi bi-pencil"></i>
                              </button>
                              <button className="btn btn-outline-info btn-sm">
                                <i className="bi bi-chat"></i>
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
    </div>
  );
};

export default Users;