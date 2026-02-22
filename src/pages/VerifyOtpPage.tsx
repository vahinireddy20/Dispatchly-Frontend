import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { KeyRound, ArrowRight, Loader2, Mail, Smartphone } from 'lucide-react';
import { useVerifyOtpMutation } from '../store/api/authApi';
import { useDispatch, useSelector } from 'react-redux';
import { setCredentials } from '../store/slices/authSlice';
import type { RootState } from '../store';

const VerifyOtpPage = () => {
    const [otp, setOtp] = useState('');
    const [verifyOtp, { isLoading, error }] = useVerifyOtpMutation();
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch();
    const { isAuthenticated } = useSelector((state: RootState) => state.auth);

    const { identifier, type, deliveryMethod } = location.state || {};

    useEffect(() => {
        if (isAuthenticated) {
            navigate('/dashboard', { replace: true });
        }
    }, [isAuthenticated, navigate]);

    useEffect(() => {
        if (!identifier) {
            navigate('/login', { replace: true });
        }
    }, [identifier, navigate]);

    const handleVerify = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const payload = {
                [type === 'email' ? 'email' : 'phone']: identifier,
                otp
            };

            const response = await verifyOtp(payload as any).unwrap();

            if (response.onboardingRequired) {
                navigate('/complete-profile', {
                    state: {
                        userId: response.userId,
                        identifier,
                        type,
                        otp
                    },
                    replace: true
                });
            } else if (response.needsPassword) {
                navigate('/set-password', { state: { userId: response.userId, token: response.token } });
            } else {
                dispatch(setCredentials({ token: response.token, user: response.user }));
                navigate('/dashboard', { replace: true });
            }
        } catch (err: any) {
            console.error('Verification failed', err);
        }
    };

    if (!identifier) return null;

    const isEmailDelivery = deliveryMethod === 'email';

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
                    width: '64px',
                    height: '64px',
                    background: '#f8f8f8',
                    borderRadius: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 32px',
                    color: '#000',
                    border: '1px solid #eee'
                }}>
                    {isEmailDelivery ? <Mail size={28} /> : <Smartphone size={28} />}
                </div>

                <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '8px', color: '#000' }}>
                    {isEmailDelivery ? 'Check your email' : 'Enter otp sent to mobile'}
                </h2>
                <p style={{ color: '#666', marginBottom: '40px', fontSize: '0.9rem' }}>
                    We've sent a 6-digit code to <br />
                    <span style={{ color: '#000', fontWeight: 600 }}>{identifier}</span>
                </p>

                <form onSubmit={handleVerify}>
                    <div className="input-group">
                        <input
                            type="text"
                            placeholder="0 0 0 0 0 0"
                            required
                            maxLength={6}
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            autoFocus
                            style={{
                                letterSpacing: '8px',
                                textAlign: 'center',
                                fontSize: '1.5rem',
                                fontWeight: '700',
                                height: '64px',
                                background: '#fcfcfc'
                            }}
                        />
                    </div>

                    {error && (
                        <p style={{ color: 'var(--error)', fontSize: '0.85rem', marginBottom: '20px', fontWeight: 500 }}>
                            The code you entered is invalid or expired.
                        </p>
                    )}

                    <button
                        className="btn-primary"
                        type="submit"
                        disabled={isLoading || otp.length < 6}
                        style={{ width: '100%', height: '56px' }}
                    >
                        {isLoading ? <Loader2 className="animate-spin" size={20} /> : (
                            <>
                                Verify & Continue <ArrowRight size={18} />
                            </>
                        )}
                    </button>
                </form>

                <button
                    onClick={() => navigate('/login')}
                    style={{
                        marginTop: '32px',
                        background: 'none',
                        border: 'none',
                        color: '#999',
                        fontSize: '0.85rem',
                        cursor: 'pointer',
                        fontWeight: 500
                    }}
                >
                    Entered the wrong {type}? <span style={{ color: '#000', textDecoration: 'underline' }}>Change it</span>
                </button>
            </div>
        </div>
    );
};

export default VerifyOtpPage;
