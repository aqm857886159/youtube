// 简单的CSV数据存储系统
import fs from 'fs';
import path from 'path';

// 数据文件路径
const DATA_DIR = path.join(process.cwd(), 'data');
const SUBMISSIONS_FILE = path.join(DATA_DIR, 'submissions.csv');

// 确保数据目录存在
const ensureDataDir = () => {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
};

// 确保CSV文件存在并有表头
const ensureCSVFile = () => {
  ensureDataDir();
  
  if (!fs.existsSync(SUBMISSIONS_FILE)) {
    const headers = '提交时间,视频链接,视频ID,用户邮箱,IP地址,状态,备注\n';
    fs.writeFileSync(SUBMISSIONS_FILE, headers, 'utf8');
  }
};

// 保存提交记录
export const saveSubmission = (submissionData) => {
  try {
    ensureCSVFile();
    
    const {
      youtubeUrl,
      videoId,
      userEmail,
      ipAddress
    } = submissionData;
    
    const submitTime = new Date().toLocaleString('zh-CN', {
      timeZone: 'Asia/Shanghai'
    });
    
    // CSV行数据（注意处理可能包含逗号的数据）
    const csvRow = [
      submitTime,
      `"${youtubeUrl}"`,
      videoId,
      userEmail,
      ipAddress,
      '待处理',
      ''
    ].join(',') + '\n';
    
    // 追加到文件
    fs.appendFileSync(SUBMISSIONS_FILE, csvRow, 'utf8');
    
    return {
      success: true,
      submissionId: `${Date.now()}_${videoId}`,
      message: '数据保存成功'
    };
    
  } catch (error) {
    console.error('保存数据失败:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

// 读取所有提交记录
export const getAllSubmissions = () => {
  try {
    ensureCSVFile();
    
    if (!fs.existsSync(SUBMISSIONS_FILE)) {
      return [];
    }
    
    const csvContent = fs.readFileSync(SUBMISSIONS_FILE, 'utf8');
    const lines = csvContent.trim().split('\n');
    
    // 跳过表头
    if (lines.length <= 1) {
      return [];
    }
    
    const submissions = lines.slice(1).map((line, index) => {
      // 简单CSV解析（假设数据格式正确）
      const parts = line.split(',');
      return {
        id: index + 1,
        submitTime: parts[0],
        youtubeUrl: parts[1].replace(/"/g, ''),
        videoId: parts[2],
        userEmail: parts[3],
        ipAddress: parts[4],
        status: parts[5] || '待处理',
        notes: parts[6] || ''
      };
    });
    
    return submissions.reverse(); // 最新的在前
    
  } catch (error) {
    console.error('读取数据失败:', error);
    return [];
  }
};

// 获取今日提交统计
export const getTodayStats = () => {
  try {
    const submissions = getAllSubmissions();
    const today = new Date().toLocaleDateString('zh-CN');
    
    const todaySubmissions = submissions.filter(sub => 
      sub.submitTime.includes(today)
    );
    
    return {
      total: submissions.length,
      today: todaySubmissions.length,
      pending: submissions.filter(sub => sub.status === '待处理').length,
      completed: submissions.filter(sub => sub.status === '已完成').length
    };
    
  } catch (error) {
    console.error('获取统计失败:', error);
    return { total: 0, today: 0, pending: 0, completed: 0 };
  }
};