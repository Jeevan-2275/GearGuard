import { useEffect, useState } from 'react';
import api from '../../utils/api';
import Card from '../../components/UI/Card';
import './EquipmentList.css';

const EquipmentList = () => {
    const [equipment, setEquipment] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchEquipment();
    }, []);

    const fetchEquipment = async () => {
        try {
            setLoading(true);
            const response = await api.get('/equipment').catch(() => ({ data: { data: [] } }));

            const fetchedData = response.data?.data || [];

            if (fetchedData.length > 0) {
                setEquipment(fetchedData);
            } else {
                console.log('Using demo data for Equipment List');
                setEquipment([
                    { id: 1, name: 'CNC Miller XN-500', serial_number: 'CNC-2024-001', type: 'Machining', location: 'Zone A', status: 'operational', department: { name: 'Production' } },
                    { id: 2, name: 'Hydraulic Press 50T', serial_number: 'HP-50-88', type: 'Press', location: 'Zone B', status: 'operational', department: { name: 'Production' } },
                    { id: 3, name: 'Conveyor Belt System', serial_number: 'CV-100-22', type: 'Logistics', location: 'Loading Dock', status: 'under_maintenance', department: { name: 'Logistics' } },
                    { id: 4, name: 'Robot Arm ABB', serial_number: 'RB-ABB-22', type: 'Assembly', location: 'Line 2', status: 'operational', department: { name: 'Assembly' } },
                    { id: 5, name: 'Forklift Toyota 22', serial_number: 'FL-22-99', type: 'Vehicle', location: 'Warehouse', status: 'broken', department: { name: 'Logistics' } }
                ]);
            }
        } catch (err) {
            console.error('Error fetching equipment:', err);
            // Fallback to demo data
            setEquipment([
                { id: 1, name: 'CNC Miller XN-500', serial_number: 'CNC-2024-001', type: 'Machining', location: 'Zone A', status: 'operational', department: { name: 'Production' } },
                { id: 2, name: 'Hydraulic Press 50T', serial_number: 'HP-50-88', type: 'Press', location: 'Zone B', status: 'operational', department: { name: 'Production' } }
            ]);
        } finally {
            setLoading(false);
        }
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case 'operational': return <span className="status-badge status-operational">Operational</span>;
            case 'under_maintenance': return <span className="status-badge status-maintenance">Under Maintenance</span>;
            case 'broken': return <span className="status-badge status-broken">Broken</span>;
            case 'scrapped': return <span className="status-badge status-scrapped">Scrapped</span>;
            default: return <span className="status-badge">{status}</span>;
        }
    };

    const filteredEquipment = equipment.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.serial_number.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return <div className="loading-container">Loading Equipment...</div>;
    if (error) return <div className="error-message">{error}</div>;

    return (
        <div className="equipment-page">
            <div className="page-header">
                <div>
                    <h1>Equipment Inventory</h1>
                    <p>Manage and track all industrial assets</p>
                </div>
                <button className="add-btn">+ Add Equipment</button>
            </div>

            <div className="table-actions">
                <div className="search-bar">
                    <span>🔍</span>
                    <input
                        type="text"
                        placeholder="Search by name or serial..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="filters">
                    <select>
                        <option value="">All Departments</option>
                    </select>
                </div>
            </div>

            <div className="equipment-grid">
                {filteredEquipment.map(item => (
                    <Card key={item.id} className="equipment-card">
                        <div className="card-header">
                            <div className="item-type">{item.type}</div>
                            {getStatusBadge(item.status)}
                        </div>
                        <h3 className="item-name">{item.name}</h3>
                        <div className="item-details">
                            <div className="detail-item">
                                <span className="label">Serial:</span>
                                <span className="value">{item.serial_number}</span>
                            </div>
                            <div className="detail-item">
                                <span className="label">Location:</span>
                                <span className="value">{item.location}</span>
                            </div>
                            <div className="detail-item">
                                <span className="label">Dept:</span>
                                <span className="value">{item.department?.name || 'N/A'}</span>
                            </div>
                        </div>
                        <div className="card-footer">
                            <button className="view-btn">View Details</button>
                            <button className="edit-btn">Edit</button>
                        </div>
                    </Card>
                ))}
            </div>

            {filteredEquipment.length === 0 && (
                <div className="no-results">No equipment found matching your search.</div>
            )}
        </div>
    );
};

export default EquipmentList;
