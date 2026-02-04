import { useState } from 'react';
import { useAuthContext } from '../context/AuthContext';
import { login as apiLogin, register as apiRegister } from '../services/api';
import { LoginData, RegisterData } from '../types/auth';

export function useAuth() {
  const { user, isAuthenticated, isLoading, setAuth, logout } = useAuthContext();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const login = async (data: LoginData) => {
    setError(null);
    setLoading(true);
    try {
      const response = await apiLogin(data);
      setAuth(response.user, response.token);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : '登录失败');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const register = async (data: RegisterData) => {
    setError(null);
    setLoading(true);
    try {
      await apiRegister(data);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : '注册失败');
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    user,
    isAuthenticated,
    isLoading,
    error,
    loading,
    login,
    register,
    logout,
    clearError: () => setError(null),
  };
}
