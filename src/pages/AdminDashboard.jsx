import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { LogOut, Plus, Edit2, Trash2, X, Check } from 'lucide-react';

const AdminDashboard = () => {
    const [players, setPlayers] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [editingPlayer, setEditingPlayer] = useState(null);
    const [successMessage, setSuccessMessage] = useState('');
    const [formData, setFormData] = useState({
        ign: '',
        tier: 'Player',
        wins: 0,
        kills: 0,
        beds_broken: 0,
        rank: 'Player'
    });
    const navigate = useNavigate();

    const getTierClass = (tier) => {
        const t = tier.toLowerCase();
        const tierMap = {
            'god': 'tier-god', 's': 'tier-s',
            'legend': 'tier-legend', 'a': 'tier-a',
            'pro': 'tier-pro', 'b': 'tier-b',
            'c': 'tier-c', 'd': 'tier-d',
            'player': 'tier-player', 'unranked': 'tier-unranked'
        };
        return tierMap[t] || 'tier-player';
    };
    const fetchPlayers = async () => {
        const token = localStorage.getItem('admin_token');
        if (!token) {
            navigate('/admin/login');
            return;
        }

        try {
            const response = await axios.get('/api/players');
            setPlayers(response.data);
        } catch (err) {
            if (err.response && err.response.status === 401) {
                navigate('/admin/login');
            }
        }
    };

    useEffect(() => {
        fetchPlayers();
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('admin_token');
        navigate('/admin/login');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('admin_token');
        try {
            await axios.post('/api/admin/players', formData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setShowModal(false);
            setEditingPlayer(null);
            setFormData({ ign: '', tier: 'Player', wins: 0, kills: 0, beds_broken: 0, rank: 'Player' });
            setSuccessMessage('Player updated successfully!');
            setTimeout(() => setSuccessMessage(''), 3000);
            fetchPlayers();
        } catch (err) {
            alert('Failed to save player');
        }
    };

    const handleDelete = async (ign) => {
        if (!window.confirm(`Delete ${ign}?`)) return;
        const token = localStorage.getItem('admin_token');
        try {
            await axios.delete(`/api/admin/players/${ign}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchPlayers();
        } catch (err) {
            alert('Failed to delete player');
        }
    };

    const openEdit = (player) => {
        setEditingPlayer(player);
        setFormData(player);
        setShowModal(true);
    };

    return (
        <div className="animate-fade-in">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h2>Admin Dashboard</h2>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    {successMessage && <div style={{ background: 'rgba(0, 255, 0, 0.1)', color: '#00ff00', padding: '0.5rem 1rem', borderRadius: '8px', fontSize: '0.9rem', display: 'flex', alignItems: 'center' }}>{successMessage}</div>}
                    <button onClick={() => { setShowModal(true); setEditingPlayer(null); setFormData({ ign: '', tier: 'Player', wins: 0, kills: 0, beds_broken: 0, rank: 'Player' }); }} className="btn btn-primary">
                        <Plus size={18} /> Add Player
                    </button>
                    <button onClick={handleLogout} className="btn" style={{ background: 'rgba(255,255,255,0.05)' }}>
                        <LogOut size={18} /> Logout
                    </button>
                </div>
            </div>

            <div className="glass-card" style={{ padding: '0', overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead style={{ background: 'rgba(255,255,255,0.03)' }}>
                        <tr>
                            <th style={{ padding: '1rem' }}>IGN</th>
                            <th style={{ padding: '1rem' }}>Tier</th>
                            <th style={{ padding: '1rem' }}>Wins</th>
                            <th style={{ padding: '1rem' }}>Rank</th>
                            <th style={{ padding: '1rem' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {players.map(p => (
                            <tr key={p.ign} style={{ borderBottom: '1px solid var(--glass-border)' }}>
                                <td style={{ padding: '1rem' }}>{p.ign}</td>
                                <td style={{ padding: '1rem' }}>
                                    <span style={{ fontSize: '0.7rem' }} className={`tier-badge ${getTierClass(p.tier)}`}>
                                        {p.tier}
                                    </span>
                                </td>
                                <td style={{ padding: '1rem' }}>{p.wins}</td>
                                <td style={{ padding: '1rem' }}>{p.rank}</td>
                                <td style={{ padding: '1rem', display: 'flex', gap: '0.5rem' }}>
                                    <button onClick={() => openEdit(p)} className="btn" style={{ padding: '0.4rem', color: 'var(--secondary)' }}>
                                        <Edit2 size={16} />
                                    </button>
                                    <button onClick={() => handleDelete(p.ign)} className="btn" style={{ padding: '0.4rem', color: 'var(--error)' }}>
                                        <Trash2 size={16} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {showModal && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
                    background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    zIndex: 1000, backdropFilter: 'blur(5px)'
                }}>
                    <div className="glass-card" style={{ width: '500px', maxWidth: '90%' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem' }}>
                            <h3>{editingPlayer ? `Edit ${editingPlayer.ign}` : 'Add New Player'}</h3>
                            <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}>
                                <X size={24} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label>IGN</label>
                                <input
                                    className="form-input"
                                    value={formData.ign}
                                    onChange={(e) => setFormData({ ...formData, ign: e.target.value })}
                                    disabled={editingPlayer ? true : false}
                                    required
                                />
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <div className="form-group">
                                    <label>Tier</label>
                                    <select className="form-input" value={formData.tier} onChange={(e) => setFormData({ ...formData, tier: e.target.value })}>
                                        <option>Owner</option>
                                        <option>Admin</option>
                                        <option>Moderator</option>
                                        <option disabled>--- Skill Tiers ---</option>
                                        <option>S</option>
                                        <option>A</option>
                                        <option>B</option>
                                        <option>C</option>
                                        <option>D</option>
                                        <option disabled>--- Legacy ---</option>
                                        <option>God</option>
                                        <option>Legend</option>
                                        <option>Pro</option>
                                        <option>Player</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>Rank Title</label>
                                    <input className="form-input" value={formData.rank} onChange={(e) => setFormData({ ...formData, rank: e.target.value })} />
                                </div>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                                <div className="form-group">
                                    <label>Wins</label>
                                    <input type="number" className="form-input" value={formData.wins} onChange={(e) => setFormData({ ...formData, wins: parseInt(e.target.value || 0) })} />
                                </div>
                                <div className="form-group">
                                    <label>Kills</label>
                                    <input type="number" className="form-input" value={formData.kills} onChange={(e) => setFormData({ ...formData, kills: parseInt(e.target.value || 0) })} />
                                </div>
                                <div className="form-group">
                                    <label>Beds</label>
                                    <input type="number" className="form-input" value={formData.beds_broken} onChange={(e) => setFormData({ ...formData, beds_broken: parseInt(e.target.value || 0) })} />
                                </div>
                            </div>
                            <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }}>
                                <Check size={18} /> {editingPlayer ? 'Update Player' : 'Add Player'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;
