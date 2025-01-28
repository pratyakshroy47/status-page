import { useState, useEffect } from 'react';
import { getOrganizationTeams, createTeam, addTeamMember, removeTeamMember } from '../services/api';

function TeamManagement({ organizationId }) {
  const [teams, setTeams] = useState([]);
  const [newTeam, setNewTeam] = useState({ name: '', description: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchTeams();
  }, [organizationId]);

  const validateTeam = (data) => {
    const newErrors = {};
    if (!data.name?.trim()) {
      newErrors.name = 'Team name is required';
    } else if (data.name.trim().length < 2) {
      newErrors.name = 'Team name must be at least 2 characters';
    }
    if (data.description?.trim().length > 500) {
      newErrors.description = 'Description must be less than 500 characters';
    }
    return newErrors;
  };

  const handleCreateTeam = async (e) => {
    e.preventDefault();
    const validationErrors = validateTeam(newTeam);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) return;

    try {
      setLoading(true);
      const trimmedData = {
        ...newTeam,
        name: newTeam.name.trim(),
        description: newTeam.description?.trim(),
        organization_id: organizationId
      };
      await createTeam(trimmedData);
      await fetchTeams();
      setNewTeam({ name: '', description: '' });
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to create team');
    } finally {
      setLoading(false);
    }
  };

  const fetchTeams = async () => {
    try {
      const data = await getOrganizationTeams(organizationId);
      setTeams(data);
    } catch (err) {
      setError('Failed to fetch teams');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading teams...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="space-y-6">
      <form onSubmit={handleCreateTeam} className="bg-dark-700 rounded-lg p-6 space-y-4">
        <h3 className="text-lg font-medium text-white">Create New Team</h3>
        
        <div>
          <label className="block text-sm font-medium text-gray-300">
            Team Name
          </label>
          <input
            type="text"
            value={newTeam.name}
            onChange={(e) => {
              setNewTeam(prev => ({ ...prev, name: e.target.value }));
              if (errors.name) {
                setErrors(prev => ({ ...prev, name: '' }));
              }
            }}
            className={`input ${errors.name ? 'border-red-500' : ''}`}
            placeholder="Enter team name"
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-400">{errors.name}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300">
            Description
          </label>
          <textarea
            value={newTeam.description}
            onChange={(e) => {
              setNewTeam(prev => ({ ...prev, description: e.target.value }));
              if (errors.description) {
                setErrors(prev => ({ ...prev, description: '' }));
              }
            }}
            className={`input ${errors.description ? 'border-red-500' : ''}`}
            rows={3}
            placeholder="Enter team description"
          />
          {errors.description && (
            <p className="mt-1 text-sm text-red-400">{errors.description}</p>
          )}
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="btn-primary"
        >
          {loading ? 'Creating...' : 'Create Team'}
        </button>
      </form>

      <div className="space-y-4">
        {teams.map((team) => (
          <div key={team.id} className="bg-dark-700 rounded-lg p-6">
            <h4 className="text-lg font-medium text-white">{team.name}</h4>
            {team.description && (
              <p className="text-gray-400 mt-2">{team.description}</p>
            )}
            <div className="mt-4">
              <h5 className="text-sm font-medium text-gray-300">Members:</h5>
              <div className="mt-2 space-y-2">
                {team.members?.map((member) => (
                  <div key={member.id} className="flex items-center justify-between">
                    <span className="text-gray-400">{member.full_name}</span>
                    <button
                      onClick={() => handleRemoveMember(team.id, member.id)}
                      className="text-red-400 hover:text-red-300"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default TeamManagement; 