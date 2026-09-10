import { Navigate, Outlet } from 'react-router';
import { useSelector } from 'react-redux';
import type { RootState } from '../../redux/app/store';

export default function AdminGuard() {
    const { accessToken, user } = useSelector((state: RootState) => state.auth);

    if (!accessToken || !user) return <Navigate to="/admin" replace />;
    if (user.role !== 'ADMIN') return <Navigate to="/dashboard" replace />;

    return <Outlet />;
}
