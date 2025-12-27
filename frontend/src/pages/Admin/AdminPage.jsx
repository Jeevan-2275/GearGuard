import { useState, useEffect } from 'react';
import api from '../../utils/api';
import Card from '../../components/UI/Card';
import Button from '../../components/UI/Button';
import './AdminPage.css';

const AdminPage = () => {
    const [activeTab, setActiveTab] = useState('users');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [data, setData] = useState({
        users: [],
        departments: [],
        teams: []
    });

    // Static Demo Data (Fallback)
    const demoData = {
        users: [
            { id: 1, name: 'John Doe', email: 'john@example.com', role: 'admin' },
            { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'manager' },
            { id: 3, name: 'Bob Wilson', email: 'bob@example.com', role: 'technician' }
        ],
        departments: [
            { id: 1, name: 'Manufacturing', code: 'MFG' },
            { id: 2, name: 'Quality Control', code: 'QC' },
            { id: 3, name: 'Maintenance', code: 'MNT' }
        ],
        teams: [
            { id: 1, name: 'Alpha Team', specialty: 'Heavy Machinery' },
            { id: 2, name: 'Beta Team', specialty: 'Electronics' },
            { id: 3, name: 'Gamma Team', specialty: 'Piping' }
        ]
    };

    useEffect(() => {
        fetchAdminData();
    }, []);

    const fetchAdminData = async () => {
        try {
            setLoading(true);
            setError(null);

            const [usersRes, deptsRes, teamsRes] = await Promise.all([
                api.get('/users').catch(() => ({ data: { data: [] } })),
                api.get('/departments').catch(() => ({ data: { data: [] } })),
                api.get('/teams').catch(() => ({ data: { data: [] } }))
            ]);

            const fetchedData = {
                users: usersRes.data.data.length > 0 ? usersRes.data.data : demoData.users,
                departments: deptsRes.data.data.length > 0 ? deptsRes.data.data : demoData.departments,
                teams: teamsRes.data.data.length > 0 ? teamsRes.data.data : demoData.teams
            };

            setData(fetchedData);
        } catch (err) {
            console.error('Error fetching admin data:', err);
            // On complete failure, still show demo data
            setData(demoData);
            setError('Showing demonstration data as the server could not be reached.');
        } finally {
            setLoading(false);
        }
    };

    const renderUsers = () => (
        <div className="admin-table-container">
            <table className="admin-table">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Role</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {data.users.map(user => (
                        <tr key={user.id}>
                            <td>{user.name}</td>
                            <td>{user.email}</td>
                            <td><span className={`role-badge ${user.role}`}>{user.role}</span></td>
                            <td>
                                <Button variant="secondary" size="small">Edit</Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );

    const renderDepartments = () => (
        <div className="admin-table-container">
            <table className="admin-table">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Code</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {data.departments.map(dept => (
                        <tr key={dept.id}>
                            <td>{dept.name}</td>
                            <td>{dept.code}</td>
                            <td>
                                <Button variant="secondary" size="small">Edit</Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );

    const renderTeams = () => (
        <div className="admin-table-container">
            <table className="admin-table">
                <thead>
                    <tr>
                        <th>Team Name</th>
                        <th>Specialty</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {data.teams.map(team => (
                        <tr key={team.id}>
                            <td>{team.name}</td>
                            <td>{team.specialty}</td>
                            <td>
                                <Button variant="secondary" size="small">Edit</Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );

    if (loading) return <div className="loading-state">Loading administration panel...</div>;

    return (
        <div className="admin-page">
            <header className="admin-header">
                <div>
                    <h1>Administration Panel</h1>
                    <p>Manage users, departments, and maintenance teams</p>
                </div>
                <Button variant="primary">Add New {activeTab.slice(0, -1)}</Button>
            </header>

            {error && (
                <div className="admin-alert warning">
                    <span className="alert-icon">⚠️</span>
                    <p>{error}</p>
                </div>
            )}

            <Card className="admin-main-card">
                <div className="admin-tabs">
                    <button
                        className={`tab-btn ${activeTab === 'users' ? 'active' : ''}`}
                        onClick={() => setActiveTab('users')}
                    >
                        Users
                    </button>
                    <button
                        className={`tab-btn ${activeTab === 'departments' ? 'active' : ''}`}
                        onClick={() => setActiveTab('departments')}
                    >
                        Departments
                    </button>
                    <button
                        className={`tab-btn ${activeTab === 'teams' ? 'active' : ''}`}
                        onClick={() => setActiveTab('teams')}
                    >
                        Teams
                    </button>
                </div>

                <div className="tab-content">
                    {activeTab === 'users' && renderUsers()}
                    {activeTab === 'departments' && renderDepartments()}
                    {activeTab === 'teams' && renderTeams()}
                </div>
            </Card>
        </div>
    );
};

export default AdminPage;
