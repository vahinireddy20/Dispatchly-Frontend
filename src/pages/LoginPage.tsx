import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRequestOtpMutation, useLoginMutation } from '../store/api/authApi';
import { useSelector, useDispatch } from 'react-redux';
import { setCredentials } from '../store/slices/authSlice';
import type { RootState } from '../store';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { ArrowRight, Loader2, ShieldCheck, Mail, Smartphone } from 'lucide-react';

const LoginPage = () => {
    const [inputType, setInputType] = useState<'phone' | 'email'>('phone');
    const [identifier, setIdentifier] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');

    const [requestOtp, { isLoading: isRequesting }] = useRequestOtpMutation();
    const [login, { isLoading: isLoggingIn }] = useLoginMutation();

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { isAuthenticated } = useSelector((state: RootState) => state.auth);

    useEffect(() => {
        if (isAuthenticated) {
            navigate('/dashboard', { replace: true });
        }
    }, [isAuthenticated, navigate]);

    const handleOtpRequest = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        try {
            const body = inputType === 'phone'
                ? { phone: phone.startsWith('+') ? phone : `+${phone}` }
                : { email: identifier };

            const res = await requestOtp(body).unwrap();

            if (res.isAdmin) {
                setShowPassword(true);
            } else {
                navigate('/verify-otp', {
                    state: {
                        identifier: inputType === 'phone' ? (phone.startsWith('+') ? phone : `+${phone}`) : identifier,
                        type: inputType,
                        deliveryMethod: res.deliveryMethod // "email" or "sms"
                    }
                });
            }
        } catch (err: any) {
            setError(err?.data?.message || 'Failed to request code.');
        }
    };

    const handleAdminLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        try {
            const adminIdentifier = inputType === 'phone'
                ? (phone.startsWith('+') ? phone : `+${phone}`)
                : identifier;

            const res = await login({ identifier: adminIdentifier, password }).unwrap();
            dispatch(setCredentials({ token: res.token, user: res.user }));
            navigate('/dashboard', { replace: true });
        } catch (err: any) {
            setError(err?.data?.message || 'Invalid admin credentials.');
        }
    };

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '24px',
            background: '#fff'
        }}>
            <div className="animate-fade-in" style={{
                width: '100%',
                maxWidth: '400px',
                padding: '24px'
            }}>
                <div style={{ textAlign: 'center', marginBottom: '48px' }}>
                    <p style={{ color: '#000', fontSize: '1.25rem', fontWeight: 600 }}>
                        {showPassword ? 'Admin Verification' : 'Welcome to Dispatchly'}
                    </p>
                    <p style={{ color: '#666', fontSize: '0.9rem', marginTop: '8px' }}>
                        {showPassword ? 'Enter your admin password' : 'Log in or create an account to continue'}
                    </p>
                </div>

                {!showPassword && (
                    <div style={{
                        display: 'flex',
                        gap: '8px',
                        marginBottom: '32px',
                        background: '#f5f5f5',
                        padding: '4px',
                        borderRadius: '10px'
                    }}>
                        <button
                            onClick={() => setInputType('phone')}
                            style={{
                                flex: 1,
                                padding: '10px',
                                borderRadius: '8px',
                                border: 'none',
                                background: inputType === 'phone' ? '#fff' : 'transparent',
                                color: inputType === 'phone' ? '#000' : '#666',
                                fontWeight: 600,
                                fontSize: '0.85rem',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '8px',
                                boxShadow: inputType === 'phone' ? '0 2px 8px rgba(0,0,0,0.05)' : 'none'
                            }}
                        >
                            <Smartphone size={16} /> Mobile
                        </button>
                        <button
                            onClick={() => setInputType('email')}
                            style={{
                                flex: 1,
                                padding: '10px',
                                borderRadius: '8px',
                                border: 'none',
                                background: inputType === 'email' ? '#fff' : 'transparent',
                                color: inputType === 'email' ? '#000' : '#666',
                                fontWeight: 600,
                                fontSize: '0.85rem',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '8px',
                                boxShadow: inputType === 'email' ? '0 2px 8px rgba(0,0,0,0.05)' : 'none'
                            }}
                        >
                            <Mail size={16} /> Email
                        </button>
                    </div>
                )}

                {!showPassword ? (
                    <form onSubmit={handleOtpRequest}>
                        <div className="input-group">
                            <label>{inputType === 'phone' ? 'Phone Number' : 'Email Address'}</label>
                            {inputType === 'phone' ? (
                                <PhoneInput
                                    country={'in'}
                                    value={phone}
                                    onChange={setPhone}
                                    containerStyle={{ width: '100%' }}
                                    inputStyle={{ width: '100%', height: '48px' }}
                                    autoFormat={true}
                                />
                            ) : (
                                <input
                                    type="email"
                                    placeholder="Enter your email"
                                    value={identifier}
                                    onChange={(e) => setIdentifier(e.target.value)}
                                    required
                                    style={{ height: '48px' }}
                                />
                            )}
                        </div>

                        {error && <p style={{ color: 'var(--error)', fontSize: '0.85rem', marginBottom: '16px' }}>{error}</p>}

                        <button
                            className="btn-primary"
                            type="submit"
                            disabled={isRequesting}
                            style={{ width: '100%', height: '52px' }}
                        >
                            {isRequesting ? <Loader2 className="animate-spin" size={20} /> : (
                                <>
                                    Get OTP <ArrowRight size={18} />
                                </>
                            )}
                        </button>
                    </form>
                ) : (
                    <form onSubmit={handleAdminLogin}>
                        <div className="input-group">
                            <label>Account</label>
                            <input
                                type="text"
                                value={inputType === 'phone' ? `+${phone}` : identifier}
                                readOnly
                                style={{ background: '#f5f5f5', color: '#999' }}
                            />
                        </div>

                        <div className="input-group">
                            <label>Admin Password</label>
                            <input
                                type="password"
                                placeholder="Enter password"
                                value={password}
                                required
                                onChange={(e) => setPassword(e.target.value)}
                                autoFocus
                                style={{ height: '48px' }}
                            />
                        </div>

                        {error && <p style={{ color: 'var(--error)', fontSize: '0.85rem', marginBottom: '16px' }}>{error}</p>}

                        <button
                            className="btn-primary"
                            type="submit"
                            disabled={isLoggingIn}
                            style={{ width: '100%', height: '48px' }}
                        >
                            {isLoggingIn ? <Loader2 className="animate-spin" size={20} /> : (
                                <>
                                    Log In <ShieldCheck size={18} />
                                </>
                            )}
                        </button>

                        <button
                            type="button"
                            onClick={() => setShowPassword(false)}
                            style={{
                                width: '100%',
                                background: 'none',
                                border: 'none',
                                color: '#666',
                                marginTop: '16px',
                                fontSize: '0.85rem',
                                cursor: 'pointer',
                                textDecoration: 'underline'
                            }}
                        >
                            Go back
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
};

export default LoginPage;
