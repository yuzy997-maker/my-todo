import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getStats, UserStats } from '../services/api';

export function StatsPage() {
  const [stats, setStats] = useState<UserStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchStats() {
      try {
        const data = await getStats();
        setStats(data.stats);
      } catch (err) {
        setError(err instanceof Error ? err.message : '获取统计数据失败');
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  return (
    <div className="stats-container">
      <div className="stats-card">
        <div className="stats-header">
          <h1>系统运营统计</h1>
          <button className="back-btn" onClick={() => navigate('/')}>
            返回
          </button>
        </div>
        {error && <div className="auth-error">{error}</div>}
        <div className="stats-table-wrapper">
          <table className="stats-table">
            <thead>
              <tr>
                <th>用户名称（邮箱）</th>
                <th>待办数量</th>
                <th>已完成数量</th>
              </tr>
            </thead>
            <tbody>
              {stats.map((user) => (
                <tr key={user.email}>
                  <td>{user.email}</td>
                  <td>{user.total_todos}</td>
                  <td>{user.completed_todos ?? 0}</td>
                </tr>
              ))}
              {stats.length === 0 && (
                <tr>
                  <td colSpan={3} className="empty-cell">暂无用户数据</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
