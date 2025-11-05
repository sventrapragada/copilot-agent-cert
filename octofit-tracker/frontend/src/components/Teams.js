import React, { useState, useEffect } from 'react';

const Teams = () => {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const apiUrl = `https://${process.env.REACT_APP_CODESPACE_NAME}-8000.app.github.dev/api/teams/`;
        console.log('Fetching teams from:', apiUrl);
        
        const response = await fetch(apiUrl);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Teams API response:', data);
        
        // Handle both paginated (.results) and plain array responses
        const teamsData = data.results || data;
        setTeams(Array.isArray(teamsData) ? teamsData : []);
        
      } catch (err) {
        console.error('Error fetching teams:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTeams();
  }, []);

  if (loading) return <div className="text-center">Loading teams...</div>;
  if (error) return <div className="alert alert-danger">Error: {error}</div>;

  return (
    <div className="container mt-4 fade-in-up">
      <div className="row">
        <div className="col-12">
          <div className="card shadow">
            <div className="card-header">
              <h2 className="mb-0">
                <i className="bi bi-people-fill me-2"></i>
                Teams
              </h2>
            </div>
            <div className="card-body">
              {teams.length === 0 ? (
                <div className="alert alert-info">
                  <i className="bi bi-info-circle me-2"></i>
                  No teams found.
                </div>
              ) : (
                <div className="row">
                  {teams.map((team) => (
                    <div key={team.id} className="col-md-6 col-lg-4 mb-4">
                      <div className="card h-100">
                        <div className="card-header bg-gradient">
                          <h5 className="card-title mb-0">
                            <i className="bi bi-flag-fill me-2"></i>
                            {team.name || 'Team'}
                          </h5>
                        </div>
                        <div className="card-body">
                          <div className="row">
                            <div className="col-6">
                              <div className="text-center">
                                <i className="bi bi-people text-primary fs-2"></i>
                                <p className="mb-0 fw-bold">{team.members_count || team.member_count || 0}</p>
                                <small className="text-muted">Members</small>
                              </div>
                            </div>
                            <div className="col-6">
                              <div className="text-center">
                                <i className="bi bi-calendar text-info fs-2"></i>
                                <p className="mb-0 fw-bold">
                                  {team.created_at || team.date_created ? 
                                    new Date(team.created_at || team.date_created).toLocaleDateString() : 
                                    'N/A'
                                  }
                                </p>
                                <small className="text-muted">Created</small>
                              </div>
                            </div>
                          </div>
                          
                          {team.description && (
                            <div className="mt-3">
                              <p className="card-text text-muted">{team.description}</p>
                            </div>
                          )}
                          
                          {team.captain && (
                            <div className="mt-3">
                              <span className="badge bg-success">
                                <i className="bi bi-star-fill me-1"></i>
                                Captain: {team.captain}
                              </span>
                            </div>
                          )}
                        </div>
                        <div className="card-footer bg-light">
                          <div className="d-grid gap-2 d-md-flex justify-content-md-end">
                            <button className="btn btn-outline-primary btn-sm">
                              <i className="bi bi-eye me-1"></i>
                              View Details
                            </button>
                            <button className="btn btn-primary btn-sm">
                              <i className="bi bi-person-plus me-1"></i>
                              Join Team
                            </button>
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

export default Teams;