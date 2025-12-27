import { useState, useEffect } from 'react';
import api from '../../utils/api';
import './CalendarViewPage.css';

const CalendarViewPage = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentMonth, setCurrentMonth] = useState(new Date());

    // Demo Data
    const demoEvents = [
        { id: 1, title: 'Preventive Maintenance: HVAC', date: new Date().toISOString().split('T')[0], type: 'preventive' },
        { id: 2, title: 'Lathe Inspection', date: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0], type: 'inspection' }, // +2 days
        { id: 3, title: 'Forklift Service', date: new Date(Date.now() - 86400000 * 3).toISOString().split('T')[0], type: 'corrective' }, // -3 days
        { id: 4, title: 'Safety Audit', date: new Date(Date.now() + 86400000 * 5).toISOString().split('T')[0], type: 'audit' },
        { id: 5, title: 'Conveyor Belt Lubrication', date: new Date(Date.now() + 86400000 * 10).toISOString().split('T')[0], type: 'preventive' }
    ];

    useEffect(() => {
        fetchEvents();
    }, []);

    const fetchEvents = async () => {
        try {
            setLoading(true);
            // In a real app, we would fetch based on date range
            // const response = await api.get('/requests/calendar');
            // setEvents(response.data.data);

            // For now, simulating fetch with fallback
            await new Promise(r => setTimeout(r, 500)); // Simulate delay
            setEvents(demoEvents);

        } catch (error) {
            console.error('Error fetching calendar events:', error);
            setEvents(demoEvents);
        } finally {
            setLoading(false);
        }
    };

    const daysInMonth = (date) => {
        return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    };

    const firstDayOfMonth = (date) => {
        return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
    };

    const renderCalendarGrid = () => {
        const totalDays = daysInMonth(currentMonth);
        const startDay = firstDayOfMonth(currentMonth);
        const days = [];

        // Empty cells for days before start of month
        for (let i = 0; i < startDay; i++) {
            days.push(<div key={`empty-${i}`} className="calendar-day empty"></div>);
        }

        // Days of the month
        for (let i = 1; i <= totalDays; i++) {
            const dateStr = `${currentMonth.getFullYear()}-${String(currentMonth.getMonth() + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
            const dayEvents = events.filter(e => e.date === dateStr);

            days.push(
                <div key={i} className="calendar-day">
                    <span className="day-number">{i}</span>
                    <div className="day-events">
                        {dayEvents.map(event => (
                            <div key={event.id} className={`event-chip event-${event.type}`}>
                                {event.title}
                            </div>
                        ))}
                    </div>
                </div>
            );
        }

        return days;
    };

    const changeMonth = (offset) => {
        setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + offset, 1));
    };

    if (loading) return <div className="loading-state">Loading Calendar...</div>;

    return (
        <div className="calendar-page">
            <div className="page-header">
                <h1>Maintenance Calendar</h1>
                <p>Schedule and track upcoming maintenance activities.</p>
            </div>

            <div className="calendar-container">
                <div className="calendar-header">
                    <button onClick={() => changeMonth(-1)}>&lt; Prev</button>
                    <h2>{currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' })}</h2>
                    <button onClick={() => changeMonth(1)}>Next &gt;</button>
                </div>
                <div className="calendar-weekdays">
                    <div>Sun</div><div>Mon</div><div>Tue</div><div>Wed</div><div>Thu</div><div>Fri</div><div>Sat</div>
                </div>
                <div className="calendar-grid">
                    {renderCalendarGrid()}
                </div>
            </div>
        </div>
    );
};

export default CalendarViewPage;
