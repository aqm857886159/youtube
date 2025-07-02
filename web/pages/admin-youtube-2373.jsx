// 管理后台页面
import { useState, useEffect } from 'react';

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [submissions, setSubmissions] = useState([]);
  const [stats, setStats] = useState({ total: 0, today: 0, pending: 0, completed: 0 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // 检查登录状态
  useEffect(() => {
    const savedAuth = localStorage.getItem('admin_auth_youtube');
    if (savedAuth === 'authenticated') {
      setIsAuthenticated(true);
      loadData();
    }
  }, []);
  
  // 登录验证
  const handleLogin = (e) => {
    e.preventDefault();
    if (password === 'youtube2025') {
      setIsAuthenticated(true);
      localStorage.setItem('admin_auth_youtube', 'authenticated');
      loadData();
      setError('');
    } else {
      setError('密码错误');
    }
  };
  
  // 登出
  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('admin_auth_youtube');
    setSubmissions([]);
    setStats({ total: 0, today: 0, pending: 0, completed: 0 });
  };
  
  // 加载数据
  const loadData = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/admin/submissions');
      if (response.ok) {
        const data = await response.json();
        setSubmissions(data.submissions || []);
        setStats(data.stats || { total: 0, today: 0, pending: 0, completed: 0 });
      } else {
        setError('加载数据失败');
      }
    } catch (err) {
      setError('网络错误');
    } finally {
      setLoading(false);
    }
  };
  
  // 导出CSV
  const exportCSV = async () => {
    try {
      const response = await fetch('/api/admin/export');
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `submissions_${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }
    } catch (err) {
      setError('导出失败');
    }
  };
  
  // 格式化时间
  const formatTime = (timeStr) => {
    try {
      return new Date(timeStr).toLocaleString('zh-CN');
    } catch {
      return timeStr;
    }
  };
  
  // 登录页面
  if (!isAuthenticated) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        backgroundColor: '#f5f5f5'
      }}>
        <div style={{
          backgroundColor: 'white',
          padding: '2rem',
          borderRadius: '8px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          width: '100%',
          maxWidth: '400px'
        }}>
          <h2 style={{ textAlign: 'center', marginBottom: '2rem', color: '#000' }}>
            管理后台登录
          </h2>
          <form onSubmit={handleLogin}>
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
                管理密码
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  fontSize: '1rem'
                }}
                required
              />
            </div>
            {error && (
              <p style={{ color: '#dc2626', fontSize: '0.875rem', marginBottom: '1rem' }}>
                {error}
              </p>
            )}
            <button
              type="submit"
              style={{
                width: '100%',
                backgroundColor: '#000',
                color: 'white',
                padding: '0.75rem',
                border: 'none',
                borderRadius: '4px',
                fontSize: '1rem',
                cursor: 'pointer'
              }}
            >
              登录
            </button>
          </form>
        </div>
      </div>
    );
  }
  
  // 管理页面
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f5f5f5', padding: '2rem' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* 头部 */}
        <div style={{ 
          backgroundColor: 'white', 
          padding: '1.5rem', 
          borderRadius: '8px', 
          marginBottom: '2rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <h1 style={{ margin: 0, color: '#000' }}>YouTube AI 管理后台</h1>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button
              onClick={loadData}
              disabled={loading}
              style={{
                backgroundColor: '#10b981',
                color: 'white',
                border: 'none',
                padding: '0.5rem 1rem',
                borderRadius: '4px',
                cursor: loading ? 'not-allowed' : 'pointer'
              }}
            >
              {loading ? '加载中...' : '刷新数据'}
            </button>
            <button
              onClick={exportCSV}
              style={{
                backgroundColor: '#3b82f6',
                color: 'white',
                border: 'none',
                padding: '0.5rem 1rem',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              导出CSV
            </button>
            <button
              onClick={handleLogout}
              style={{
                backgroundColor: '#ef4444',
                color: 'white',
                border: 'none',
                padding: '0.5rem 1rem',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              登出
            </button>
          </div>
        </div>
        
        {/* 统计卡片 */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
          gap: '1rem', 
          marginBottom: '2rem' 
        }}>
          <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '8px' }}>
            <h3 style={{ margin: '0 0 0.5rem 0', color: '#6b7280' }}>总提交数</h3>
            <p style={{ margin: 0, fontSize: '2rem', fontWeight: 'bold', color: '#000' }}>
              {stats.total}
            </p>
          </div>
          <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '8px' }}>
            <h3 style={{ margin: '0 0 0.5rem 0', color: '#6b7280' }}>今日提交</h3>
            <p style={{ margin: 0, fontSize: '2rem', fontWeight: 'bold', color: '#10b981' }}>
              {stats.today}
            </p>
          </div>
          <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '8px' }}>
            <h3 style={{ margin: '0 0 0.5rem 0', color: '#6b7280' }}>待处理</h3>
            <p style={{ margin: 0, fontSize: '2rem', fontWeight: 'bold', color: '#f59e0b' }}>
              {stats.pending}
            </p>
          </div>
          <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '8px' }}>
            <h3 style={{ margin: '0 0 0.5rem 0', color: '#6b7280' }}>已完成</h3>
            <p style={{ margin: 0, fontSize: '2rem', fontWeight: 'bold', color: '#8b5cf6' }}>
              {stats.completed}
            </p>
          </div>
        </div>
        
        {/* 提交记录表格 */}
        <div style={{ backgroundColor: 'white', borderRadius: '8px', overflow: 'hidden' }}>
          <div style={{ padding: '1.5rem', borderBottom: '1px solid #e5e7eb' }}>
            <h2 style={{ margin: 0, color: '#000' }}>提交记录</h2>
          </div>
          
          {loading ? (
            <div style={{ padding: '2rem', textAlign: 'center' }}>
              <p>加载中...</p>
            </div>
          ) : submissions.length === 0 ? (
            <div style={{ padding: '2rem', textAlign: 'center' }}>
              <p style={{ color: '#6b7280' }}>暂无提交记录</p>
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ backgroundColor: '#f9fafb' }}>
                    <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '1px solid #e5e7eb' }}>
                      提交时间
                    </th>
                    <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '1px solid #e5e7eb' }}>
                      用户邮箱
                    </th>
                    <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '1px solid #e5e7eb' }}>
                      视频ID
                    </th>
                    <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '1px solid #e5e7eb' }}>
                      状态
                    </th>
                    <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '1px solid #e5e7eb' }}>
                      操作
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {submissions.map((submission, index) => (
                    <tr key={index} style={{ borderBottom: '1px solid #e5e7eb' }}>
                      <td style={{ padding: '1rem', fontSize: '0.875rem' }}>
                        {formatTime(submission.submitTime)}
                      </td>
                      <td style={{ padding: '1rem', fontSize: '0.875rem' }}>
                        {submission.userEmail}
                      </td>
                      <td style={{ padding: '1rem', fontSize: '0.875rem' }}>
                        <a 
                          href={`https://youtube.com/watch?v=${submission.videoId}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{ color: '#3b82f6', textDecoration: 'none' }}
                        >
                          {submission.videoId}
                        </a>
                      </td>
                      <td style={{ padding: '1rem', fontSize: '0.875rem' }}>
                        <span style={{
                          padding: '0.25rem 0.5rem',
                          borderRadius: '4px',
                          fontSize: '0.75rem',
                          backgroundColor: submission.status === '待处理' ? '#fef3c7' : 
                                         submission.status === '已完成' ? '#d1fae5' : '#fecaca',
                          color: submission.status === '待处理' ? '#92400e' : 
                                submission.status === '已完成' ? '#065f46' : '#991b1b'
                        }}>
                          {submission.status}
                        </span>
                      </td>
                      <td style={{ padding: '1rem', fontSize: '0.875rem' }}>
                        <button
                          onClick={() => window.open(`mailto:${submission.userEmail}`, '_blank')}
                          style={{
                            backgroundColor: '#6b7280',
                            color: 'white',
                            border: 'none',
                            padding: '0.25rem 0.5rem',
                            borderRadius: '4px',
                            fontSize: '0.75rem',
                            cursor: 'pointer'
                          }}
                        >
                          联系用户
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
        
        {error && (
          <div style={{ 
            backgroundColor: '#fee2e2', 
            border: '1px solid #fecaca', 
            borderRadius: '8px', 
            padding: '1rem', 
            marginTop: '1rem' 
          }}>
            <p style={{ color: '#dc2626', margin: 0 }}>
              {error}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}