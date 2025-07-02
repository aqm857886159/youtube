// 首页
import Head from 'next/head';
import SimpleForm from '../components/SimpleForm';

export default function Home() {
  return (
    <>
      <Head>
        <title>YouTube AI 处理服务</title>
        <meta name="description" content="智能YouTube视频分析和翻译服务，预览免费，满意付费" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      <main style={{
        minHeight: '100vh',
        backgroundColor: '#f5f5f5',
        padding: '2rem 1rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <SimpleForm />
      </main>
      
      {/* 页脚信息 */}
      <footer style={{
        backgroundColor: '#fff',
        borderTop: '1px solid #e5e7eb',
        padding: '2rem 1rem',
        textAlign: 'center'
      }}>
        <div style={{ maxWidth: '500px', margin: '0 auto' }}>
          <p style={{ color: '#6b7280', fontSize: '0.875rem', marginBottom: '1rem' }}>
            YouTube AI 智能处理服务 - 专业的视频分析和翻译解决方案
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '2rem', fontSize: '0.75rem', color: '#9ca3af' }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <span style={{ marginRight: '0.5rem' }}>🔒</span>
              数据安全保护
            </div>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <span style={{ marginRight: '0.5rem' }}>⚡</span>
              24小时快速处理
            </div>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <span style={{ marginRight: '0.5rem' }}>💰</span>
              预览免费
            </div>
          </div>
          <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid #e5e7eb' }}>
            <p style={{ color: '#9ca3af', fontSize: '0.75rem', margin: 0 }}>
              如有问题请联系：<a href="mailto:2373272608@qq.com" style={{ color: '#3b82f6' }}>2373272608@qq.com</a>
            </p>
          </div>
        </div>
      </footer>
    </>
  );
}