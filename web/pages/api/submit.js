// 简化版提交API - 只做数据收集
import { YouTubeSubmissionSchema, validateYouTubeURL, validateEmail } from '../../lib/validation.js';
import { saveSubmission } from '../../lib/dataStorage.js';

// 简单的内存速率限制
const rateLimitMap = new Map();

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ 
      error: 'Method not allowed',
      message: '只允许POST请求' 
    });
  }
  
  const clientIP = req.headers['x-forwarded-for'] || req.connection.remoteAddress || 'unknown';
  
  try {
    // 简单速率限制 - 每IP每分钟最多5次
    const now = Date.now();
    const rateLimitKey = clientIP;
    const rateLimit = rateLimitMap.get(rateLimitKey) || { count: 0, lastReset: now };
    
    if (now - rateLimit.lastReset > 60 * 1000) {
      rateLimit.count = 0;
      rateLimit.lastReset = now;
    }
    
    if (rateLimit.count >= 5) {
      return res.status(429).json({
        error: 'Rate limit exceeded',
        message: '提交过于频繁，请稍后再试'
      });
    }
    
    rateLimit.count++;
    rateLimitMap.set(rateLimitKey, rateLimit);
    
    // 输入验证
    const validationResult = YouTubeSubmissionSchema.safeParse(req.body);
    if (!validationResult.success) {
      return res.status(400).json({
        error: 'Validation failed',
        message: '输入验证失败',
        details: validationResult.error.issues.map(issue => ({
          field: issue.path.join('.'),
          message: issue.message
        }))
      });
    }
    
    const { url, email } = validationResult.data;
    
    // YouTube URL验证
    const urlValidation = validateYouTubeURL(url);
    if (!urlValidation.isValid) {
      return res.status(400).json({
        error: 'Invalid YouTube URL',
        message: urlValidation.error
      });
    }
    
    // 邮箱验证
    const emailValidation = validateEmail(email);
    if (!emailValidation.isValid) {
      return res.status(400).json({
        error: 'Invalid email',
        message: emailValidation.error
      });
    }
    
    // 保存到CSV
    const saveResult = saveSubmission({
      youtubeUrl: urlValidation.sanitizedUrl,
      videoId: urlValidation.videoId,
      userEmail: email,
      ipAddress: clientIP
    });
    
    if (!saveResult.success) {
      return res.status(500).json({
        error: 'Save failed',
        message: '数据保存失败，请稍后重试'
      });
    }
    
    console.log('[NEW SUBMISSION]', {
      ip: clientIP,
      email,
      videoId: urlValidation.videoId,
      time: new Date().toLocaleString('zh-CN')
    });
    
    return res.status(200).json({
      success: true,
      message: '提交成功！我们会在24小时内将预览版和收款码发送到您的邮箱。',
      submissionId: saveResult.submissionId
    });
    
  } catch (error) {
    console.error('[ERROR] Submission error:', error);
    
    return res.status(500).json({
      error: 'Internal server error',
      message: '服务器内部错误，请稍后重试'
    });
  }
}

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '1mb',
    },
  },
};