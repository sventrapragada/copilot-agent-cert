import React, { useState, useEffect } from 'react';

const Activities = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const apiUrl = `https://${process.env.REACT_APP_CODESPACE_NAME}-8000.app.github.dev/api/activities/`;
        console.log('Fetching activities from:', apiUrl);
        
        const response = await fetch(apiUrl);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Activities API response:', data);
        
        // Handle both paginated (.results) and plain array responses
        const activitiesData = data.results || data;
        setActivities(Array.isArray(activitiesData) ? activitiesData : []);
        
      } catch (err) {
        console.error('Error fetching activities:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, []);

  if (loading) {
    return (
      <div className="d-flex justify-content-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading activities...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger" role="alert">
        <i className="bi bi-exclamation-triangle me-2"></i>
        Error: {error}
      </div>
    );
  }

  return (
    <div className="row">
      <div className="col-12">
        <div className="card shadow-sm">
          <div className="card-header bg-primary text-white">
            <h2 className="card-title mb-0">
              <i className="bi bi-activity me-2"></i>
              Activities
            </h2>
          </div>
          <div className="card-body">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <span className="badge bg-secondary">Total activities: {activities.length}</span>
              <button className="btn btn-success btn-sm">
                <i className="bi bi-plus-circle me-1"></i>
                Add Activity
              </button>
            </div>
            
            {activities.length === 0 ? (
              <div className="text-center py-5">
                <i className="bi bi-clipboard-x display-1 text-muted"></i>
                <p className="lead mt-3">No activities found.</p>
                <button className="btn btn-primary">
                  <i className="bi bi-plus-circle me-2"></i>
                  Create Your First Activity
                </button>
              </div>
            ) : (
              <div className="table-responsive">
                <table className="table table-hover">
                  <thead className="table-light">
                    <tr>
                      <th scope="col">
                        <i className="bi bi-hash me-1"></i>
                        ID
                      </th>
                      <th scope="col">
                        <i className="bi bi-bookmark me-1"></i>
                        Name
                      </th>
                      <th scope="col">
                        <i className="bi bi-tag me-1"></i>
                        Type
                      </th>
                      <th scope="col">
                        <i className="bi bi-clock me-1"></i>
                        Duration
                      </th>
                      <th scope="col">
                        <i className="bi bi-calendar me-1"></i>
                        Date
                      </th>
                      <th scope="col">
                        <i className="bi bi-file-text me-1"></i>
                        Description
                      </th>
                      <th scope="col">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {activities.map((activity, index) => (
                      <tr key={activity.id || index}>
                        <td>
                          <span className="badge bg-light text-dark">{activity.id || index + 1}</span>
                        </td>
                        <td>
                          <strong>{activity.name || activity.title || 'Unnamed Activity'}</strong>
                        </td>
                        <td>
                          <span className="badge bg-info">
                            {activity.activity_type || 'General'}
                          </span>
                        </td>
                        <td>
                          {activity.duration ? (
                            <span className="badge bg-warning text-dark">
                              <i className="bi bi-stopwatch me-1"></i>
                              {activity.duration} min
                            </span>
                          ) : (
                            <span className="text-muted">-</span>
                          )}
                        </td>
                        <td>
                          {activity.date || activity.created_at ? (
                            <small className="text-muted">
                              {new Date(activity.date || activity.created_at).toLocaleDateString()}
                            </small>
                          ) : (
                            <span className="text-muted">-</span>
                          )}
                        </td>
                        <td>
                          {activity.description ? (
                            <span className="text-muted">{activity.description.substring(0, 50)}...</span>
                          ) : (
                            <span className="text-muted fst-italic">No description</span>
                          )}
                        </td>
                        <td>
                          <div className="btn-group btn-group-sm" role="group">
                            <button className="btn btn-outline-primary" title="View">
                              <i className="bi bi-eye"></i>
                            </button>
                            <button className="btn btn-outline-secondary" title="Edit">
                              <i className="bi bi-pencil"></i>
                            </button>
                            <button className="btn btn-outline-danger" title="Delete">
                              <i className="bi bi-trash"></i>
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
  );
};

export default Activities;