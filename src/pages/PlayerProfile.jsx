import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft, User, Shield, Target, Swords, Trophy } from 'lucide-react';

const PlayerProfile = () => {
    const { ign } = useParams();
    const navigate = useNavigate();
    const [player, setPlayer] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchPlayer = async () => {
            try {
                const response = await axios.get(`/api/players/${ign}`);
                setPlayer(response.data);
                setLoading(false);
            } catch (err) {
                if (err.response && err.response.status === 404) {
                    // Not in DB, but we still show the profile with default values
                    setPlayer({
                        ign: ign,
                        tier: 'Unranked',
                        wins: 0,
                        kills: 0,
                        beds_broken: 0,
                        rank: 'New Player',
                        last_updated: new Date().toISOString()
                    });
                } else {
                    setError('An error occurred while fetching player data.');
                }
                setLoading(false);
            }
        };

        fetchPlayer();
    }, [ign]);

    if (loading) return <div className="app-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '80vh' }}>
        <div style={{ textAlign: 'center' }}>
            <div className="spinner" style={{ border: '4px solid rgba(255,255,255,0.1)', borderTop: '4px solid var(--primary)', borderRadius: '50%', width: '40px', height: '40px', animation: 'spin 1s linear infinite', margin: '0 auto 1rem' }}></div>
            <p style={{ color: 'var(--text-muted)' }}>Fetching authorized stats...</p>
        </div>
    </div>;

    if (error || !player) {
        return (
            <div className="app-container animate-fade-in">
                <button onClick={() => navigate('/')} className="btn" style={{ marginBottom: '2rem' }}>
                    <ArrowLeft size={20} /> Back
                </button>
                <div className="glass-card" style={{ textAlign: 'center' }}>
                    <h2 style={{ color: 'var(--error)' }}>Error</h2>
                    <p>{error}</p>
                    <button onClick={() => navigate('/')} className="btn btn-primary" style={{ marginTop: '1.5rem' }}>
                        Search Again
                    </button>
                </div>
            </div>
        );
    }

    const getTierClass = (tier) => {
        const t = (tier || '').toLowerCase();
        const tierMap = {
            'god': 'tier-god', 's': 'tier-s', 's tier': 'tier-s',
            'legend': 'tier-legend', 'a': 'tier-a', 'a tier': 'tier-a',
            'pro': 'tier-pro', 'b': 'tier-b', 'b tier': 'tier-b',
            'c': 'tier-c', 'c tier': 'tier-c',
            'd': 'tier-d', 'd tier': 'tier-d',
            'player': 'tier-player', 'unranked': 'tier-unranked'
        };
        return tierMap[t] || 'tier-player';
    };

    return (
        <div className="animate-fade-in" style={{ maxWidth: '900px', margin: '0 auto' }}>
            <button onClick={() => navigate('/')} className="btn" style={{ marginBottom: '2rem', color: 'var(--text-muted)' }}>
                <ArrowLeft size={20} /> BACK TO SEARCH
            </button>

            <div className="glass-card">
                <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', marginBottom: '3rem', flexWrap: 'wrap' }}>
                    <div style={{
                        width: '120px',
                        height: '120px',
                        borderRadius: '20px',
                        background: 'rgba(255, 255, 255, 0.05)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        border: '2px solid var(--glass-border)',
                        overflow: 'hidden'
                    }}>
                        <img
                            src={`https://mc-heads.net/avatar/${player.ign}`}
                            alt={player.ign}
                            style={{ width: '80%', height: '80%', objectFit: 'contain' }}
                            onError={(e) => {
                                e.target.src = 'https://mc-heads.net/avatar/steve';
                            }}
                        />
                    </div>
                    <div>
                        <h1 style={{ fontSize: '3rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            {player.ign}
                            <span style={{ fontSize: '1rem', color: 'var(--text-muted)', fontWeight: 'normal' }}>#{player.rank}</span>
                        </h1>
                        <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                            <div style={{ textAlign: 'center' }}>
                                <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: '0.2rem', textTransform: 'uppercase' }}>Current Tier</p>
                                <span className={`tier-badge ${getTierClass(player.tier)}`} style={{ fontSize: '1.1rem', padding: '0.4rem 1.2rem' }}>
                                    {player.tier}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="stats-grid">
                    <div className="stat-item">
                        <Trophy className="search-icon" style={{ position: 'static', marginBottom: '0.5rem', color: '#ffd700' }} size={24} />
                        <span className="stat-value">{player.wins}</span>
                        <span className="stat-label">WINS</span>
                    </div>
                    <div className="stat-item">
                        <Swords className="search-icon" style={{ position: 'static', marginBottom: '0.5rem', color: '#ff3e3e' }} size={24} />
                        <span className="stat-value">{player.kills}</span>
                        <span className="stat-label">KILLS</span>
                    </div>
                    <div className="stat-item">
                        <Target className="search-icon" style={{ position: 'static', marginBottom: '0.5rem', color: '#00f2ff' }} size={24} />
                        <span className="stat-value">{player.beds_broken}</span>
                        <span className="stat-label">BEDS BROKEN</span>
                    </div>
                    <div className="stat-item">
                        <Shield className="search-icon" style={{ position: 'static', marginBottom: '0.5rem', color: '#9d00ff' }} size={24} />
                        <span className="stat-value">{player.wins === 0 ? '0.00' : (player.wins / (player.kills || 1)).toFixed(2)}</span>
                        <span className="stat-label">W/K RATIO</span>
                    </div>
                </div>

                <div style={{ marginTop: '3rem', padding: '2rem', background: 'rgba(255,255,255,0.02)', borderRadius: '15px', border: '1px solid var(--glass-border)' }}>
                    <h3 style={{ marginBottom: '1rem', fontSize: '1rem' }}>Player Information</h3>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                        This player's stats and tier are managed by the site administrators. If you believe there is an error, please contact a staff member.
                    </p>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: '1rem' }}>
                        Last Updated: {new Date(player.last_updated).toLocaleString()}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default PlayerProfile;
