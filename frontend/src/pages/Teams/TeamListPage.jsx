import { useState, useEffect } from 'react';
import api from '../../utils/api';
import './TeamListPage.css';

const TeamListPage = () => {
    const [teams, setTeams] = useState([]);
    const [loading, setLoading] = useState(true);

    const demoTeams = [
        {
            id: 1,
            name: 'Alpha Squad',
            specialty: 'Heavy Machinery',
            members: [
                { id: 101, name: 'Sarah Tech', role: 'Team Lead' },
                { id: 102, name: 'Mike Fixer', role: 'Technician' }
            ],
            activeJobs: 3
        },
        {
            id: 2,
            name: 'Beta Spark',
            specialty: 'Electrical Systems',
            members: [
                { id: 201, name: 'John Watts', role: 'Team Lead' },
                { id: 202, name: 'Alice Circuits', role: 'Technician' }
            ],
            activeJobs: 1
        },
        {
            id: 3,
            name: 'Gamma Facilities',
            specialty: 'Building Maintenance',
            members: [
                { id: 301, name: 'Dave Plumber', role: 'Team Lead' }
            ],
            activeJobs: 0
        }
    ];

    useEffect(() => {
        fetchTeams();
    }, []);

    const fetchTeams = async () => {
        try {
            setLoading(true);
            // const response = await api.get('/teams');
            // setTeams(response.data.data);
            await new Promise(r => setTimeout(r, 500));
            setTeams(demoTeams);
        } catch (error) {
            console.error('Error fetching teams:', error);
            setTeams(demoTeams);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div>Loading Teams...</div>;

    return (
        <div className="teams-page">
            <div className="page-header">
                <div>
                    <h1>Maintenance Teams</h1>
                    <p>Manage workforce and assignments.</p>
                </div>
                <button className="add-btn">+ Create Team</button>
            </div>

            <div className="teams-grid">
                {teams.map(team => (
                    <div key={team.id} className="team-card">
                        <div className="team-header">
                            <div className="team-icon">{team.name.charAt(0)}</div>
                            <div className="team-info">
                                <h3>{team.name}</h3>
                                <span className="team-specialty">{team.specialty}</span>
                            </div>
                        </div>

                        <div className="team-stats">
                            <div className="stat">
                                <span className="label">Members</span>
                                <span className="value">{team.members.length}</span>
                            </div>
                            <div className="stat">
                                <span className="label">Active Jobs</span>
                                <span className="value">{team.activeJobs}</span>
                            </div>
                        </div>

                        <div className="team-members-preview">
                            <h4>Team Members</h4>
                            <ul>
                                {team.members.map(member => (
                                    <li key={member.id}>
                                        <span className="member-name">{member.name}</span>
                                        <span className="member-role">{member.role}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="team-actions">
                            <button>View Schedule</button>
                            <button>Manage Members</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TeamListPage;
