import React, { useState, useEffect } from 'react';

const Workouts = () => {
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWorkouts = async () => {
      try {
        const apiUrl = `https://${process.env.REACT_APP_CODESPACE_NAME}-8000.app.github.dev/api/workouts/`;
        console.log('Fetching workouts from:', apiUrl);
        
        const response = await fetch(apiUrl);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Workouts API response:', data);
        
        // Handle both paginated (.results) and plain array responses
        const workoutsData = data.results || data;
        setWorkouts(Array.isArray(workoutsData) ? workoutsData : []);
        
      } catch (err) {
        console.error('Error fetching workouts:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchWorkouts();
  }, []);

  if (loading) return <div className="text-center">Loading workouts...</div>;
  if (error) return <div className="alert alert-danger">Error: {error}</div>;

  return (
    <div className="container mt-4 fade-in-up">
      <div className="row">
        <div className="col-12">
          <div className="card shadow">
            <div className="card-header">
              <h2 className="mb-0">
                <i className="bi bi-lightning-charge me-2"></i>
                Workouts
              </h2>
            </div>
            <div className="card-body">
              {workouts.length === 0 ? (
                <div className="alert alert-info">
                  <i className="bi bi-info-circle me-2"></i>
                  No workouts found.
                </div>
              ) : (
                <div className="row">
                  {workouts.map((workout) => (
                    <div key={workout.id} className="col-md-6 col-xl-4 mb-4">
                      <div className="card h-100 workout-card">
                        <div className="card-header">
                          <div className="d-flex justify-content-between align-items-center">
                            <h5 className="card-title mb-0">
                              <i className="bi bi-play-circle me-2"></i>
                              {workout.name || workout.title || 'Workout'}
                            </h5>
                            {workout.difficulty && (
                              <span className={`badge ${
                                workout.difficulty.toLowerCase() === 'easy' ? 'bg-success' :
                                workout.difficulty.toLowerCase() === 'medium' ? 'bg-warning' :
                                workout.difficulty.toLowerCase() === 'hard' ? 'bg-danger' :
                                'bg-secondary'
                              }`}>
                                {workout.difficulty}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="card-body">
                          <div className="row text-center mb-3">
                            <div className="col-4">
                              <div className="workout-stat">
                                <i className="bi bi-clock text-primary fs-3"></i>
                                <p className="mb-0 fw-bold">{workout.duration || 'N/A'}</p>
                                <small className="text-muted">Minutes</small>
                              </div>
                            </div>
                            <div className="col-4">
                              <div className="workout-stat">
                                <i className="bi bi-heart-pulse text-danger fs-3"></i>
                                <p className="mb-0 fw-bold">{workout.workout_type || workout.type || 'N/A'}</p>
                                <small className="text-muted">Type</small>
                              </div>
                            </div>
                            <div className="col-4">
                              <div className="workout-stat">
                                <i className="bi bi-list-check text-success fs-3"></i>
                                <p className="mb-0 fw-bold">{workout.exercises?.length || 0}</p>
                                <small className="text-muted">Exercises</small>
                              </div>
                            </div>
                          </div>
                          
                          {workout.description && (
                            <div className="mb-3">
                              <h6 className="text-muted">Description:</h6>
                              <p className="card-text small">{workout.description}</p>
                            </div>
                          )}
                          
                          <div className="mb-2">
                            <small className="text-muted">
                              <i className="bi bi-calendar-event me-1"></i>
                              Created: {workout.created_at || workout.date_created ? 
                                new Date(workout.created_at || workout.date_created).toLocaleDateString() : 
                                'N/A'
                              }
                            </small>
                          </div>
                        </div>
                        <div className="card-footer bg-light">
                          <div className="d-grid gap-2">
                            <button className="btn btn-primary">
                              <i className="bi bi-play-fill me-2"></i>
                              Start Workout
                            </button>
                            <div className="btn-group" role="group">
                              <button className="btn btn-outline-secondary btn-sm">
                                <i className="bi bi-heart me-1"></i>
                                Favorite
                              </button>
                              <button className="btn btn-outline-info btn-sm">
                                <i className="bi bi-share me-1"></i>
                                Share
                              </button>
                              <button className="btn btn-outline-primary btn-sm">
                                <i className="bi bi-eye me-1"></i>
                                Details
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Workouts;