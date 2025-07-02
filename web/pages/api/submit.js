// 安全的API端点实现
import { 
  YouTubeSubmissionSchema, 
  createRateLimiter, 
  validateYouTubeURL,
  validateEmail,
  validateCSRFToken,
  logSecurityEvent,
  checkIPReputation,
  getSecurityHeaders
} from '../../lib/security.js';

// 速率限制中间件
const rateLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000, // 15分钟
  max: 3, // 每15分钟最多3次提交
});

// 安全中间件
const securityMiddleware = (req, res, next) => {
  // 设置安全头
  const headers = getSecurityHeaders();
  Object.entries(headers).forEach(([key, value]) => {
    res.setHeader(key, value);
  });
  
  next();
};

export default async function handler(req, res) {
  // 应用安全中间件
  securityMiddleware(req, res, () => {});
  
  // 只允许POST请求
  if (req.method !== 'POST') {
    return res.status(405).json({ 
      error: 'Method not allowed',
      message: '只允许POST请求' 
    });
  }
  
  const startTime = Date.now();
  const clientIP = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  const userAgent = req.headers['user-agent'];
  
  try {
    // 1. IP信誉检查
    const ipCheck = checkIPReputation(clientIP);
    if (!ipCheck.allowed) {
      logSecurityEvent({
        type: 'ip_blocked',
        ip: clientIP,
        userAgent,
        details: ipCheck.reason,
        severity: 'medium'
      });
      
      return res.status(403).json({
        error: 'Access denied',
        message: '访问被拒绝'
      });
    }
    
    // 2. 速率限制
    await new Promise((resolve, reject) => {
      rateLimiter(req, res, (error) => {
        if (error) reject(error);
        else resolve();
      });
    });
    
    // 3. 输入验证
    const validationResult = YouTubeSubmissionSchema.safeParse(req.body);
    if (!validationResult.success) {
      logSecurityEvent({
        type: 'validation_failed',
        ip: clientIP,
        userAgent,
        details: validationResult.error.issues,
        severity: 'low'
      });
      
      return res.status(400).json({
        error: 'Validation failed',
        message: '输入验证失败',
        details: validationResult.error.issues.map(issue => ({
          field: issue.path.join('.'),
          message: issue.message
        }))
      });
    }
    
    const { url, email, csrfToken, _honeypot } = validationResult.data;
    
    // 4. Honeypot检查
    if (_honeypot && _honeypot.length > 0) {
      logSecurityEvent({
        type: 'honeypot_triggered',
        ip: clientIP,
        userAgent,
        details: 'Bot detected via honeypot',
        severity: 'high'
      });
      
      // 假装成功，但不处理请求
      return res.status(200).json({
        success: true,
        message: '提交成功，请检查邮箱'
      });
    }
    
    // 5. CSRF Token验证
    const sessionToken = req.session?.csrfToken || req.headers['x-csrf-token'];
    if (!validateCSRFToken(csrfToken, sessionToken)) {
      logSecurityEvent({
        type: 'csrf_validation_failed',
        ip: clientIP,
        userAgent,
        details: 'Invalid CSRF token',
        severity: 'high'
      });
      
      return res.status(403).json({
        error: 'CSRF validation failed',
        message: '安全验证失败，请刷新页面重试'
      });
    }
    
    // 6. YouTube URL深度验证
    const urlValidation = await validateYouTubeURL(url);
    if (!urlValidation.isValid) {
      logSecurityEvent({
        type: 'invalid_youtube_url',
        ip: clientIP,
        userAgent,
        details: { url, error: urlValidation.error },
        severity: 'medium'
      });
      
      return res.status(400).json({
        error: 'Invalid YouTube URL',
        message: `YouTube链接验证失败: ${urlValidation.error}`
      });
    }
    
    // 7. 邮箱深度验证
    const emailValidation = validateEmail(email);
    if (!emailValidation.isValid) {
      return res.status(400).json({
        error: 'Invalid email',
        message: emailValidation.error
      });
    }
    
    // 8. 检查重复提交 (简单防重复)
    const submissionKey = `${clientIP}-${email}-${urlValidation.videoId}`;
    const recentSubmissions = global.recentSubmissions || new Map();
    const now = Date.now();
    
    // 清理过期记录
    for (const [key, timestamp] of recentSubmissions) {
      if (now - timestamp > 30 * 60 * 1000) { // 30分钟
        recentSubmissions.delete(key);
      }
    }
    
    if (recentSubmissions.has(submissionKey)) {
      logSecurityEvent({
        type: 'duplicate_submission',
        ip: clientIP,
        userAgent,
        details: { email, videoId: urlValidation.videoId },
        severity: 'medium'
      });
      
      return res.status(429).json({
        error: 'Duplicate submission',
        message: '请勿重复提交相同的视频'
      });
    }
    
    // 记录提交
    recentSubmissions.set(submissionKey, now);
    global.recentSubmissions = recentSubmissions;
    
    // 9. 调用预览服务 (这里需要实现)
    const previewResult = await processVideoPreview({
      url: urlValidation.sanitizedUrl,
      email: email,
      videoId: urlValidation.videoId,
      clientIP,
      userAgent
    });
    
    // 10. 记录成功事件
    logSecurityEvent({
      type: 'submission_success',
      ip: clientIP,
      userAgent,
      details: { 
        email, 
        videoId: urlValidation.videoId,
        processingTime: Date.now() - startTime
      },
      severity: 'info'
    });
    
    return res.status(200).json({
      success: true,
      message: '预览处理完成，请查收邮件',
      previewId: previewResult.previewId,
      estimatedCost: previewResult.pricing?.suggested_price_usd
    });
    
  } catch (error) {
    // 记录错误
    logSecurityEvent({
      type: 'submission_error',
      ip: clientIP,
      userAgent,
      details: {
        error: error.message,
        stack: error.stack,
        processingTime: Date.now() - startTime
      },
      severity: 'high'
    });
    
    console.error('Submission error:', error);
    
    return res.status(500).json({
      error: 'Internal server error',
      message: '服务器内部错误，请稍后重试'
    });
  }
}

// 处理视频预览的安全封装
async function processVideoPreview({ url, email, videoId, clientIP, userAgent }) {
  try {
    // 这里集成之前创建的 PreviewService
    const { PreviewService } = await import('../../../preview_service.py');
    
    // 创建安全的预览请求
    const previewService = new PreviewService();
    const result = await previewService.preview_video(url, email);
    
    // 记录预览结果
    logSecurityEvent({
      type: 'preview_completed',
      ip: clientIP,
      userAgent,
      details: {
        email,
        videoId,
        success: result.success,
        cost: result.cost_analysis?.total_cost_usd
      },
      severity: 'info'
    });
    
    return result;
    
  } catch (error) {
    logSecurityEvent({
      type: 'preview_failed',
      ip: clientIP,
      userAgent,
      details: {
        email,
        videoId,
        error: error.message
      },
      severity: 'high'
    });
    
    throw error;
  }
}

// 配置API路由
export const config = {
  api: {
    bodyParser: {
      sizeLimit: '1mb', // 限制请求体大小
    },
    responseLimit: '8mb',
  },
};