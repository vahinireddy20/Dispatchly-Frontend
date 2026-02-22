import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { User, Mail, ArrowRight, Loader2 } from 'lucide-react';
import { useCompleteProfileMutation } from '../store/api/authApi';
import { useDispatch, useSelector } from 'react-redux';
import { setCredentials } from '../store/slices/authSlice';
import type { RootState } from '../store';

const CompleteProfilePage = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [completeProfile, { isLoading }] = useCompleteProfileMutation();
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch();
    const { isAuthenticated } = useSelector((state: RootState) => state.auth);

    const { userId, identifier, type, otp } = location.state || {};

    useEffect(() => {
        if (isAuthenticated) {
            navigate('/dashboard', { replace: true });
        }
    }, [isAuthenticated, navigate]);

    useEffect(() => {
        if (!userId || !otp) {
            navigate('/login', { replace: true });
        }
    }, [userId, otp, navigate]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const payload = {
                userId,
                name,
                newEmail: email,
                otp,
                [type === 'email' ? 'email' : 'phone']: identifier
            };

            const response = await completeProfile(payload as any).unwrap();

            // Set credentials and open dashboard
            dispatch(setCredentials({
                token: response.token,
                user: response.user
            }));

            navigate('/dashboard', { replace: true });
        } catch (err: any) {
            console.error('Failed to complete profile', err);
        }
    };

    if (!userId || !otp) return null;

    return (
        <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '100vh',
            padding: '24px',
            background: '#fff'
        }}>
            <div className="animate-fade-in" style={{ width: '100%', maxWidth: '400px' }}>
                <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#000' }}>Finish setting up</h2>
                    <p style={{ color: '#666', marginTop: '8px' }}>Enter your name and email to continue to your dashboard.</p>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <label>Full Name</label>
                        <div style={{ position: 'relative' }}>
                            <User size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#999' }} />
                            <input
                                type="text"
                                required
                                placeholder="Your Name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                style={{ paddingLeft: '48px' }}
                                autoFocus
                            />
                        </div>
                    </div>

                    <div className="input-group">
                        <label>Email Address</label>
                        <div style={{ position: 'relative' }}>
                            <Mail size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#999' }} />
                            <input
                                type="email"
                                required
                                placeholder="name@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                style={{ paddingLeft: '48px' }}
                            />
                        </div>
                    </div>

                    <button
                        className="btn-primary"
                        type="submit"
                        disabled={isLoading || !name || !email}
                        style={{ width: '100%', height: '52px', marginTop: '24px' }}
                    >
                        {isLoading ? <Loader2 className="animate-spin" size={20} /> : (
                            <>
                                Open Dashboard <ArrowRight size={18} />
                            </>
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default CompleteProfilePage;
