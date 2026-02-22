import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Lock, CheckCircle2, Loader2 } from 'lucide-react';
import { useSetPasswordMutation } from '../store/api/authApi';
import { useDispatch } from 'react-redux';
import { setCredentials } from '../store/slices/authSlice';

const SetPasswordPage = () => {
    const [password, setPassword] = useState('');
    const [confirm, setConfirm] = useState('');
    const [setPasswordMutation, { isLoading }] = useSetPasswordMutation();
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch();

    const { userId, token } = location.state || {};

    useEffect(() => {
        if (!userId) {
            navigate('/login', { replace: true });
        }
    }, [userId, navigate]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (password !== confirm) return alert('Passwords do not match');

        try {
            await setPasswordMutation({ userId, password }).unwrap();
            dispatch(setCredentials({ token, user: { id: userId, role: 1 } }));
            navigate('/dashboard', { replace: true });
        } catch (err) {
            console.error('Failed to set password', err);
        }
    };

    if (!userId) return null;

    return (
        <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '100vh',
            padding: '24px',
            background: '#fff'
        }}>
            <div className="animate-fade-in" style={{
                width: '100%',
                maxWidth: '400px',
                textAlign: 'center'
            }}>
                <div style={{
                    width: '56px',
                    height: '56px',
                    background: '#f5f5f5',
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 32px',
                    color: '#000'
                }}>
                    <Lock size={24} />
                </div>

                <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '8px', letterSpacing: '-0.02em' }}>Admin Security</h2>
                <p style={{ color: '#666', marginBottom: '40px', fontSize: '0.9rem' }}>
                    Assign a secure password for your administrative account.
                </p>

                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <label>New Password</label>
                        <input
                            type="password"
                            required
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    <div className="input-group">
                        <label>Confirm Password</label>
                        <input
                            type="password"
                            required
                            placeholder="••••••••"
                            value={confirm}
                            onChange={(e) => setConfirm(e.target.value)}
                        />
                    </div>

                    <button
                        className="btn-primary"
                        type="submit"
                        disabled={isLoading || password.length < 6}
                        style={{ width: '100%', height: '52px', marginTop: '16px' }}
                    >
                        {isLoading ? <Loader2 className="animate-spin" /> : (
                            <>
                                Save & Continue <CheckCircle2 size={18} />
                            </>
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default SetPasswordPage;
