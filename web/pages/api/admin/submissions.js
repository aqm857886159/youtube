// 管理后台 - 获取提交记录API
import { getAllSubmissions, getTodayStats } from '../../../lib/dataStorage.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ 
      error: 'Method not allowed',
      message: '只允许GET请求' 
    });
  }
  
  try {
    // 获取所有提交记录和统计
    const submissions = getAllSubmissions();
    const stats = getTodayStats();
    
    return res.status(200).json({
      success: true,
      submissions,
      stats,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('[ERROR] Admin API error:', error);
    
    return res.status(500).json({
      error: 'Internal server error',
      message: '获取数据失败'
    });
  }
}