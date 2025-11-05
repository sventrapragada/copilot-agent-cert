import React, { useState, useEffect } from 'react';

const Leaderboard = () => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const apiUrl = `https://${process.env.REACT_APP_CODESPACE_NAME}-8000.app.github.dev/api/leaderboard/`;
        console.log('Fetching leaderboard from:', apiUrl);
        
        const response = await fetch(apiUrl);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Leaderboard API response:', data);
        
        // Handle both paginated (.results) and plain array responses
        const leaderboardData = data.results || data;
        setLeaderboard(Array.isArray(leaderboardData) ? leaderboardData : []);
        
      } catch (err) {
        console.error('Error fetching leaderboard:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  if (loading) {
    return (
      <div className="d-flex justify-content-center">
        <div className="spinner-border text-warning" role="status">
          <span className="visually-hidden">Loading leaderboard...</span>
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

  const getRankIcon = (rank) => {
    switch(rank) {
      case 1: return <i className="bi bi-trophy-fill text-warning"></i>;
      case 2: return <i className="bi bi-award-fill text-secondary"></i>;
      case 3: return <i className="bi bi-award-fill text-warning"></i>;
      default: return <span className="badge bg-light text-dark">{rank}</span>;
    }
  };

  const getRankClass = (rank) => {
    switch(rank) {
      case 1: return 'table-warning';
      case 2: return 'table-secondary';
      case 3: return 'table-info';
      default: return '';
    }
  };

  return (
    <div className="row">
      <div className="col-12">
        <div className="card shadow-sm">
          <div className="card-header bg-warning text-dark">
            <h2 className="card-title mb-0">
              <i className="bi bi-bar-chart me-2"></i>
              Leaderboard
            </h2>
          </div>
          <div className="card-body">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <span className="badge bg-secondary">Total participants: {leaderboard.length}</span>
              <button className="btn btn-outline-primary btn-sm">
                <i className="bi bi-arrow-clockwise me-1"></i>
                Refresh
              </button>
            </div>
            
            {leaderboard.length === 0 ? (
              <div className="text-center py-5">
                <i className="bi bi-trophy display-1 text-muted"></i>
                <p className="lead mt-3">No leaderboard data found.</p>
                <p className="text-muted">Start tracking activities to see rankings!</p>
                <button className="btn btn-primary">
                  <i className="bi bi-plus-circle me-2"></i>
                  Add Your First Activity
                </button>
              </div>
            ) : (
              <div className="table-responsive">
                <table className="table table-hover">
                  <thead className="table-dark">
                    <tr>
                      <th scope="col" className="text-center">
                        <i className="bi bi-hash me-1"></i>
                        Rank
                      </th>
                      <th scope="col">
                        <i className="bi bi-person me-1"></i>
                        User
                      </th>
                      <th scope="col" className="text-center">
                        <i className="bi bi-star me-1"></i>
                        Points
                      </th>
                      <th scope="col" className="text-center">
                        <i className="bi bi-activity me-1"></i>
                        Activities
                      </th>
                      <th scope="col" className="text-center">
                        <i className="bi bi-graph-up me-1"></i>
                        Progress
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {leaderboard.map((entry, index) => {
                      const rank = index + 1;
                      const points = entry.points || entry.score || 0;
                      const activities = entry.activities_count || entry.total_activities || 0;
                      const maxPoints = Math.max(...leaderboard.map(e => e.points || e.score || 0));
                      const progressPercentage = maxPoints > 0 ? (points / maxPoints) * 100 : 0;
                      
                      return (
                        <tr key={entry.id || index} className={getRankClass(rank)}>
                          <td className="text-center">
                            {getRankIcon(rank)}
                          </td>
                          <td>
                            <div className="d-flex align-items-center">
                              <div className="avatar bg-primary text-white rounded-circle d-flex align-items-center justify-content-center me-3" 
                                   style={{width: '40px', height: '40px'}}>
                                {(entry.user || entry.username || entry.name || 'U').charAt(0).toUpperCase()}
                              </div>
                              <div>
                                <strong>{entry.user || entry.username || entry.name || 'Unknown User'}</strong>
                                {rank <= 3 && (
                                  <div>
                                    <small className="text-muted">Top Performer</small>
                                  </div>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="text-center">
                            <span className="badge bg-success fs-6">
                              {points.toLocaleString()}
                            </span>
                          </td>
                          <td className="text-center">
                            <span className="badge bg-info">
                              {activities}
                            </span>
                          </td>
                          <td className="text-center">
                            <div className="progress" style={{height: '20px', minWidth: '100px'}}>
                              <div 
                                className="progress-bar bg-success" 
                                role="progressbar" 
                                style={{width: `${progressPercentage}%`}}
                                aria-valuenow={progressPercentage} 
                                aria-valuemin="0" 
                                aria-valuemax="100"
                              >
                                {progressPercentage.toFixed(0)}%
                              </div>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
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

export default Leaderboard;