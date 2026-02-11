import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Search, Trophy, TrendingUp } from 'lucide-react';
import axios from 'axios';

const Home = () => {
    const [ign, setIgn] = useState('');
    const [error, setError] = useState('');
    const [topPlayers, setTopPlayers] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchTopPlayers = async () => {
            try {
                const response = await axios.get('/api/players/top');
                setTopPlayers(response.data);
            } catch (err) {
                console.error('Failed to fetch top players', err);
            }
        };
        fetchTopPlayers();
    }, []);

    const handleSearch = (e) => {
        e.preventDefault();
        if (ign.trim()) {
            navigate(`/player/${ign.trim()}`);
        } else {
            setError('Please enter an IGN');
        }
    };

    const getTierClass = (tier) => {
        const t = (tier || '').toLowerCase();
        const tierMap = {
            'god': 'tier-god', 's': 'tier-s',
            'legend': 'tier-legend', 'a': 'tier-a',
            'pro': 'tier-pro', 'b': 'tier-b',
            'c': 'tier-c', 'd': 'tier-d',
            'player': 'tier-player', 'unranked': 'tier-unranked'
        };
        return tierMap[t] || 'tier-player';
    };

    return (
        <div className="search-container animate-fade-in">
            <div style={{ marginBottom: '3rem' }}>
                <Trophy size={64} className="primary-glow-icon" style={{ marginBottom: '1rem', filter: 'drop-shadow(0 0 10px var(--primary))' }} />
                <h1 style={{ fontSize: '3.5rem', letterSpacing: '4px' }}>TIER TESTER</h1>
                <p style={{ color: '#b0b0b0', maxWidth: '600px', margin: '0.5rem auto' }}>
                    The official Bedwars tier verification platform. Search any player to view their authorized stats and rank.
                </p>
            </div>

            <form onSubmit={handleSearch} className="search-input-group" style={{ marginBottom: '4rem' }}>
                <Search className="search-icon" size={24} />
                <input
                    type="text"
                    className="search-input"
                    placeholder="Enter Minecraft IGN to find their tier..."
                    value={ign}
                    onChange={(e) => setIgn(e.target.value)}
                />
                <button type="submit" className="btn btn-primary" style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', padding: '0.6rem 1.5rem' }}>
                    VERIFY
                </button>
            </form>

            {error && <p style={{ color: '#ff3e3e', marginTop: '-3rem', marginBottom: '3rem' }}>{error}</p>}

            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '2rem', textAlign: 'left' }}>
                <div className="glass-card">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '1.5rem' }}>
                        <TrendingUp size={24} color="var(--secondary)" />
                        <h3 style={{ fontSize: '1.2rem' }}>LEADERBOARD TOP 5</h3>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {topPlayers.length > 0 ? topPlayers.map((player, index) => (
                            <div
                                key={player.ign}
                                className="leaderboard-item"
                                onClick={() => navigate(`/player/${player.ign}`)}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    padding: '0.8rem',
                                    background: 'rgba(255,255,255,0.03)',
                                    borderRadius: '12px',
                                    cursor: 'pointer',
                                    transition: '0.3s'
                                }}
                            >
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                    <span style={{ width: '20px', fontWeight: 'bold', color: 'var(--text-muted)' }}>{index + 1}</span>
                                    <img
                                        src={`https://mc-heads.net/avatar/${player.ign}`}
                                        alt={player.ign}
                                        style={{ width: '32px', height: '32px', borderRadius: '4px' }}
                                    />
                                    <span style={{ fontWeight: '600' }}>{player.ign}</span>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                    <span style={{ fontSize: '0.7rem' }} className={`tier-badge ${getTierClass(player.tier)}`}>
                                        {player.tier}
                                    </span>
                                    <strong style={{ color: 'var(--secondary)', minWidth: '60px', textAlign: 'right' }}>{player.wins} W</strong>
                                </div>
                            </div>
                        )) : (
                            <p style={{ color: 'var(--text-muted)', textAlign: 'center' }}>No players ranked yet.</p>
                        )}
                    </div>
                </div>

                <div>
                    <div className="glass-card" style={{ marginBottom: '1.5rem' }}>
                        <h4 style={{ color: '#00f2ff', marginBottom: '0.5rem' }}>Verified Tiers</h4>
                        <p style={{ fontSize: '0.85rem', color: '#888' }}>All player tiers are manually reviewed and verified by server admins to ensure authenticity.</p>
                    </div>
                    <div className="glass-card">
                        <h4 style={{ color: '#9d00ff', marginBottom: '0.5rem' }}>Skin Integration</h4>
                        <p style={{ fontSize: '0.85rem', color: '#888' }}>Real-time Minecraft skin synchronization for every player in our records.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;
