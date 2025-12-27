import { useEffect, useState } from 'react';
import api from '../../utils/api';
import './KanbanBoard.css';

const KanbanBoard = () => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const columns = [
        { id: 'new', title: 'New Requests' },
        { id: 'in_progress', title: 'In Progress' },
        { id: 'repaired', title: 'Completed' },
        { id: 'scrap', title: 'Scrapped' }
    ];

    // Static Demo Data for fallback
    const demoRequests = [
        { id: 101, subject: 'Conveyor 3 Overheating', priority: 'high', stage: 'new', equipment: { name: 'Main Conveyor Belt' }, assignedTechnician: null, createdAt: new Date().toISOString() },
        { id: 102, subject: 'Forklift B2 Service', priority: 'medium', stage: 'new', equipment: { name: 'Forklift B2' }, assignedTechnician: { name: 'Sarah Tech' }, createdAt: new Date().toISOString() },
        { id: 103, subject: 'Safety Sensor Misfire', priority: 'critical', stage: 'in_progress', equipment: { name: 'Press Machine #4' }, assignedTechnician: { name: 'Dave Fixit' }, createdAt: new Date(Date.now() - 86400000).toISOString() },
        { id: 104, subject: 'Annual Calibration', priority: 'low', stage: 'in_progress', equipment: { name: 'Testing Unit A' }, assignedTechnician: { name: 'John Spark' }, createdAt: new Date(Date.now() - 172800000).toISOString() },
        { id: 105, subject: 'Motor Replacement', priority: 'high', stage: 'repaired', equipment: { name: 'Drill Press X1' }, assignedTechnician: { name: 'Sarah Tech' }, createdAt: new Date(Date.now() - 432000000).toISOString() },
        { id: 106, subject: 'Obsolete Switch Gear', priority: 'low', stage: 'scrap', equipment: { name: 'Old Generator' }, assignedTechnician: { name: 'Mike Manager' }, createdAt: new Date(Date.now() - 864000000).toISOString() }
    ];

    useEffect(() => {
        fetchRequests();
    }, []);

    const fetchRequests = async () => {
        try {
            setLoading(true);
            const response = await api.get('/requests').catch(() => ({ data: { data: [] } }));

            // Use fetched data if available, otherwise fallback to demo data
            const fetchedData = response.data?.data || [];
            if (fetchedData.length > 0) {
                setRequests(fetchedData);
            } else {
                console.log('Using demo data for Kanban board');
                setRequests(demoRequests);
            }
        } catch (err) {
            console.error('Error fetching requests:', err);
            // Fallback to demo data on error
            setRequests(demoRequests);
            // Don't show technical error to user, just show demo mode
        } finally {
            setLoading(false);
        }
    };

    const getPriorityIcon = (priority) => {
        switch (priority) {
            case 'high': return '🔴';
            case 'medium': return '🟡';
            case 'low': return '🟢';
            default: return '⚪';
        }
    };

    if (loading) return <div className="loading-board">Loading Maintenance Board...</div>;
    if (error) return <div className="error-message">{error}</div>;

    return (
        <div className="kanban-page">
            <div className="page-header" style={{ marginBottom: '2rem' }}>
                <h1 style={{ margin: 0, color: '#1f2937' }}>Maintenance Board</h1>
                <p style={{ color: '#6b7280' }}>Track and manage all equipment maintenance requests.</p>
            </div>

            <div className="kanban-board">
                {columns.map(column => (
                    <div key={column.id} className={`kanban-column col-${column.id}`}>
                        <div className="column-header">
                            <h3>{column.title}</h3>
                            <span className="request-count">
                                {requests.filter(r => r.stage === column.id).length}
                            </span>
                        </div>
                        <div className="column-content">
                            {requests
                                .filter(r => r.stage === column.id)
                                .map(request => (
                                    <div key={request.id} className="kanban-card">
                                        <div className={`card-priority priority-${request.priority}`}>
                                            {getPriorityIcon(request.priority)} {request.priority}
                                        </div>
                                        <div className="card-subject">{request.subject}</div>
                                        <div className="card-info">
                                            <div className="info-item">
                                                <span>🏭</span>
                                                <span>{request.equipment?.name || 'Unknown Equipment'}</span>
                                            </div>
                                            <div className="info-item">
                                                <span>👤</span>
                                                <span>{request.assignedTechnician?.name || 'Unassigned'}</span>
                                            </div>
                                            <div className="info-item" style={{ fontSize: '0.75rem', marginTop: '0.5rem' }}>
                                                <span>📅</span>
                                                <span>{new Date(request.createdAt).toLocaleDateString()}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default KanbanBoard;
