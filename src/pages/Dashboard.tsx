import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import type { RootState } from '../store';
import { logout } from '../store/slices/authSlice';
import { useGetTasksQuery, useUpdateTaskMutation, useCreateTaskMutation } from '../store/api/taskApi';
import { useGetAllUsersQuery } from '../store/api/userApi';
import {
    LogOut,
    LayoutDashboard,
    CheckSquare,
    Plus,
    User as UserIcon,
    Calendar,
    X,
    Loader2,
    ChevronDown,
    Bell
} from 'lucide-react';

const Dashboard = () => {
    const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { data: tasks, isLoading } = useGetTasksQuery();
    const { data: teamMembers } = useGetAllUsersQuery(undefined, { skip: user?.role !== 1 });
    const [updateTask, { isLoading: isUpdating }] = useUpdateTaskMutation();
    const [createTask, { isLoading: isCreating }] = useCreateTaskMutation();

    const [showModal, setShowModal] = useState(false);
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const [newTask, setNewTask] = useState({ title: '', description: '', dueDate: '', assignedUserId: '' });

    const isAdmin = user?.role === 1;

    // Prevent back navigation to login/verify-otp
    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login', { replace: true });
        }
    }, [isAuthenticated, navigate]);

    const handleStatusUpdate = async (taskId: number, currentStatus: number) => {
        try {
            await updateTask({ id: taskId, status: currentStatus === 1 ? 0 : 1 }).unwrap();
        } catch (err) {
            console.error('Failed to update task', err);
        }
    };

    const handleCreateTask = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await createTask({
                ...newTask,
                assignedUserId: newTask.assignedUserId ? parseInt(newTask.assignedUserId) : undefined,
                dueDate: new Date(newTask.dueDate).toISOString()
            }).unwrap();
            setShowModal(false);
            setNewTask({ title: '', description: '', dueDate: '', assignedUserId: '' });
        } catch (err) {
            console.error('Failed to create task', err);
        }
    };

    return (
        <div style={{ display: 'flex', minHeight: '100vh', background: '#fff', color: '#000' }}>

            {/* 1. Sidebar */}
            <aside style={{
                width: '260px',
                borderRight: '1px solid #eee',
                padding: '32px 20px',
                display: 'flex',
                flexDirection: 'column',
                background: '#fff',
                position: 'fixed',
                height: '100vh',
                zIndex: 10
            }}>
                <div style={{ marginBottom: '40px', padding: '0 12px' }}>
                    <h1 style={{ fontSize: '1.25rem', fontWeight: 900, letterSpacing: '1px' }}>DISPATCHLY</h1>
                </div>

                <nav style={{ flex: 1 }}>
                    <div style={{
                        background: '#000',
                        color: '#fff',
                        padding: '10px 16px',
                        borderRadius: '6px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        marginBottom: '4px',
                        fontWeight: 700,
                        fontSize: '0.85rem',
                        cursor: 'pointer'
                    }}>
                        <LayoutDashboard size={18} /> OVERVIEW
                    </div>

                    {isAdmin && (
                        <div style={{
                            color: '#999',
                            padding: '10px 16px',
                            borderRadius: '6px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            cursor: 'pointer',
                            fontSize: '0.85rem',
                            fontWeight: 600
                        }}>
                            <UserIcon size={18} /> TEAM
                        </div>
                    )}
                </nav>
            </aside>

            {/* Main Container */}
            <div style={{ flex: 1, marginLeft: '260px', position: 'relative' }}>

                {/* 2. Top Header */}
                <header style={{
                    height: '70px',
                    borderBottom: '1px solid #eee',
                    padding: '0 40px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    background: '#fff',
                    position: 'sticky',
                    top: 0,
                    zIndex: 20
                }}>
                    <div>
                        <h2 style={{ fontSize: '0.9rem', fontWeight: 600, color: '#666' }}>Welcome back, <span style={{ color: '#000' }}>{user?.name || 'User'}</span></h2>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
                        <Bell size={18} color="#999" style={{ cursor: 'pointer' }} />

                        <div style={{ position: 'relative' }}>
                            <div
                                onClick={() => setShowProfileMenu(!showProfileMenu)}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '10px',
                                    cursor: 'pointer',
                                    padding: '6px 12px',
                                    borderRadius: '20px',
                                    background: '#f9f9f9',
                                    border: '1px solid #eee'
                                }}
                            >
                                <div style={{
                                    width: '24px',
                                    height: '24px',
                                    borderRadius: '50%',
                                    background: '#000',
                                    color: '#fff',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontWeight: 800,
                                    fontSize: '0.65rem'
                                }}>
                                    {user?.name?.[0] || 'U'}
                                </div>
                                <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>{user?.name || 'Account'}</span>
                                <ChevronDown size={14} color="#999" />
                            </div>

                            {showProfileMenu && (
                                <div style={{
                                    position: 'absolute',
                                    top: '100%',
                                    right: 0,
                                    marginTop: '8px',
                                    width: '180px',
                                    background: '#fff',
                                    border: '1px solid #eee',
                                    borderRadius: '10px',
                                    padding: '4px',
                                    boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
                                }}>
                                    <button
                                        onClick={() => dispatch(logout())}
                                        style={{
                                            width: '100%',
                                            padding: '10px 12px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '10px',
                                            background: 'transparent',
                                            border: 'none',
                                            color: '#ff3333',
                                            fontSize: '0.85rem',
                                            fontWeight: 600,
                                            cursor: 'pointer',
                                            borderRadius: '6px'
                                        }}
                                    >
                                        <LogOut size={16} /> Sign Out
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </header>

                {/* Content Area */}
                <main style={{ padding: '40px' }}>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                        <div>
                            <h3 style={{ fontSize: '1.75rem', fontWeight: 800, letterSpacing: '-0.02em' }}>Task Dashboard</h3>
                            <p style={{ color: '#888', fontSize: '0.85rem' }}>Overview of active and completed dispatch tasks.</p>
                        </div>
                        {isAdmin && (
                            <button onClick={() => setShowModal(true)} className="btn-primary" style={{ height: '42px', padding: '0 20px', fontSize: '0.8rem' }}>
                                <Plus size={16} /> NEW TASK
                            </button>
                        )}
                    </div>

                    {/* Task List Table */}
                    <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #eee', overflow: 'hidden' }}>
                        {isLoading ? (
                            <div style={{ padding: '80px', textAlign: 'center', color: '#999' }}>
                                <Loader2 className="animate-spin" style={{ margin: '0 auto 12px' }} />
                                <p style={{ fontSize: '0.85rem' }}>Updating records...</p>
                            </div>
                        ) : tasks && tasks.length > 0 ? (
                            <div>
                                {tasks.map((task: any) => (
                                    <div key={task.id} style={{
                                        padding: '20px 32px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        borderBottom: '1px solid #f5f5f5'
                                    }}>

                                        <button
                                            onClick={() => handleStatusUpdate(task.id, task.status)}
                                            disabled={isUpdating}
                                            style={{
                                                width: '22px',
                                                height: '22px',
                                                borderRadius: '4px',
                                                border: '2px solid',
                                                borderColor: task.status === 1 ? '#000' : '#ddd',
                                                background: task.status === 1 ? '#000' : 'transparent',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                cursor: 'pointer',
                                                color: '#fff',
                                                marginRight: '20px'
                                            }}
                                        >
                                            {task.status === 1 && <CheckSquare size={12} fill="currentColor" />}
                                        </button>

                                        <div style={{ flex: 1 }}>
                                            <h4 style={{
                                                fontSize: '0.9rem',
                                                fontWeight: 700,
                                                color: task.status === 1 ? '#999' : '#000',
                                                textDecoration: task.status === 1 ? 'line-through' : 'none'
                                            }}>{task.title}</h4>
                                            <p style={{ fontSize: '0.75rem', color: '#888' }}>{task.description}</p>
                                        </div>

                                        <div style={{ display: 'flex', alignItems: 'center', gap: '40px' }}>
                                            <div style={{ width: '100px' }}>
                                                <p style={{ fontSize: '0.6rem', fontWeight: 800, color: '#bbb', textTransform: 'uppercase' }}>Deadline</p>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#666' }}>
                                                    <Calendar size={12} />
                                                    <span style={{ fontSize: '0.75rem', fontWeight: 600 }}>{new Date(task.dueDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
                                                </div>
                                            </div>

                                            <div style={{ width: '80px', textAlign: 'center' }}>
                                                <span style={{
                                                    fontSize: '0.65rem',
                                                    fontWeight: 800,
                                                    padding: '2px 8px',
                                                    borderRadius: '4px',
                                                    background: task.status === 1 ? '#f5f5f5' : '#eefaf5',
                                                    color: task.status === 1 ? '#999' : '#00aa00',
                                                    border: '1px solid',
                                                    borderColor: task.status === 1 ? '#eee' : '#dcf5e9'
                                                }}>
                                                    {task.status === 1 ? 'DONE' : 'ACTIVE'}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div style={{ padding: '80px', textAlign: 'center' }}>
                                <p style={{ color: '#bbb', fontSize: '0.85rem' }}>No tasks found in the system registry.</p>
                            </div>
                        )}
                    </div>
                </main>

                {/* New Task Modal */}
                {showModal && (
                    <div style={{
                        position: 'fixed',
                        inset: 0,
                        background: 'rgba(255,255,255,0.8)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 100,
                        backdropFilter: 'blur(10px)'
                    }}>
                        <div className="glass animate-fade-in" style={{
                            width: '100%',
                            maxWidth: '440px',
                            padding: '40px',
                            background: '#fff'
                        }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '32px' }}>
                                <h2 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Create New Task</h2>
                                <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', color: '#999', cursor: 'pointer' }}><X size={20} /></button>
                            </div>

                            <form onSubmit={handleCreateTask}>
                                <div className="input-group">
                                    <label>Title</label>
                                    <input
                                        type="text"
                                        value={newTask.title}
                                        onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                                        required
                                        placeholder="Task summary"
                                    />
                                </div>

                                <div className="input-group">
                                    <label>Description</label>
                                    <input
                                        type="text"
                                        value={newTask.description}
                                        onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                                        required
                                        placeholder="Detailed instructions"
                                    />
                                </div>

                                <div className="input-group">
                                    <label>Assignee (Name)</label>
                                    <select
                                        value={newTask.assignedUserId}
                                        onChange={(e) => setNewTask({ ...newTask, assignedUserId: e.target.value })}
                                        required
                                        style={{
                                            width: '100%',
                                            background: '#fff',
                                            border: '1px solid #ddd',
                                            padding: '12px',
                                            color: '#000',
                                            borderRadius: '8px',
                                            fontSize: '0.9rem'
                                        }}
                                    >
                                        <option value="">Select an operative</option>
                                        {teamMembers?.map(member => (
                                            <option key={member.id} value={member.id}>
                                                {member.name || member.phone || `Operative #${member.id}`}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="input-group">
                                    <label>Target Date</label>
                                    <input
                                        type="date"
                                        value={newTask.dueDate}
                                        onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                                        required
                                    />
                                </div>

                                <button
                                    className="btn-primary"
                                    type="submit"
                                    disabled={isCreating}
                                    style={{ width: '100%', height: '52px', marginTop: '16px' }}
                                >
                                    {isCreating ? <Loader2 className="animate-spin" /> : 'CONFIRM DISPATCH'}
                                </button>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Dashboard;
