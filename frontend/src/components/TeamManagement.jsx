import { useState, useEffect } from 'react';
import { getOrganizationTeams, createTeam, addTeamMember, removeTeamMember } from '../services/api';

function TeamManagement({ organizationId }) {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newTeamName, setNewTeamName] = useState('');
  const [newTeamDescription, setNewTeamDescription] = useState('');

  useEffect(() => {
    fetchTeams();
  }, [organizationId]);

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

  const handleCreateTeam = async (e) => {
    e.preventDefault();
    try {
      await createTeam({
        name: newTeamName,
        description: newTeamDescription,
        organization_id: organizationId
      });
      setNewTeamName('');
      setNewTeamDescription('');
      fetchTeams();
    } catch (err) {
      setError('Failed to create team');
    }
  };

  if (loading) return <div>Loading teams...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="space-y-6">
      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-medium mb-4">Create New Team</h3>
        <form onSubmit={handleCreateTeam} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Team Name</label>
            <input
              type="text"
              value={newTeamName}
              onChange={(e) => setNewTeamName(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              value={newTeamDescription}
              onChange={(e) => setNewTeamDescription(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              rows={3}
            />
          </div>
          <button
            type="submit"
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Create Team
          </button>
        </form>
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-medium mb-4">Teams</h3>
        <div className="space-y-4">
          {teams.map((team) => (
            <div key={team.id} className="border rounded-lg p-4">
              <h4 className="font-medium">{team.name}</h4>
              <p className="text-gray-600 text-sm">{team.description}</p>
              <div className="mt-2">
                <h5 className="text-sm font-medium text-gray-700">Members:</h5>
                <ul className="mt-1 space-y-1">
                  {team.members.map((member) => (
                    <li key={member.id} className="text-sm text-gray-600">
                      {member.full_name} ({member.email})
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default TeamManagement; 