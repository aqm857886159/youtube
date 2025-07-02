// 管理后台 - 导出CSV API
import fs from 'fs';
import path from 'path';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ 
      error: 'Method not allowed',
      message: '只允许GET请求' 
    });
  }
  
  try {
    const dataDir = path.join(process.cwd(), 'data');
    const submissionsFile = path.join(dataDir, 'submissions.csv');
    
    // 检查文件是否存在
    if (!fs.existsSync(submissionsFile)) {
      return res.status(404).json({
        error: 'File not found',
        message: '数据文件不存在'
      });
    }
    
    // 读取CSV文件
    const csvContent = fs.readFileSync(submissionsFile, 'utf8');
    
    // 设置响应头，触发下载
    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="submissions_${new Date().toISOString().split('T')[0]}.csv"`);
    
    // 添加BOM以支持中文显示
    const bom = '\uFEFF';
    return res.status(200).send(bom + csvContent);
    
  } catch (error) {
    console.error('[ERROR] Export error:', error);
    
    return res.status(500).json({
      error: 'Internal server error',
      message: '导出失败'
    });
  }
}