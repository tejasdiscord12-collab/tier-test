import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Lock } from 'lucide-react';

const AdminLogin = () => {
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('/api/admin/login', { password });
            localStorage.setItem('admin_token', response.data.token);
            navigate('/admin');
        } catch (err) {
            console.error('Login error:', err);
            if (err.response) {
                setError(err.response.data.message || 'Invalid password');
            } else {
                setError('Could not connect to server. Make sure the backend is running.');
            }
        }
    };

    return (
        <div className="animate-fade-in" style={{ maxWidth: '400px', margin: '4rem auto' }}>
            <div className="glass-card" style={{ textAlign: 'center' }}>
                <div style={{ marginBottom: '2rem' }}>
                    <div style={{
                        width: '60px',
                        height: '60px',
                        borderRadius: '50%',
                        background: 'rgba(157, 0, 255, 0.1)',
                        margin: '0 auto 1rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                        <Lock color="var(--primary)" size={30} />
                    </div>
                    <h2>Admin Access</h2>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Enter password to manage tiers</p>
                </div>

                <form onSubmit={handleLogin}>
                    <div className="form-group">
                        <input
                            type="password"
                            className="form-input"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    {error && <p style={{ color: 'var(--error)', marginBottom: '1rem', fontSize: '0.9rem' }}>{error}</p>}
                    <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
                        Login
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AdminLogin;
