// 安全工具库
import { z } from 'zod';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';

// 1. 输入验证 Schema
export const YouTubeSubmissionSchema = z.object({
  url: z.string()
    .url({ message: "请提供有效的URL" })
    .refine((url) => {
      // 验证是否为YouTube URL
      const youtubeRegex = /^https?:\/\/(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/)[\w-]+(&.*)?$/;
      return youtubeRegex.test(url);
    }, { message: "请提供有效的YouTube链接" })
    .refine((url) => {
      // 防止过长URL (潜在的DoS攻击)
      return url.length <= 500;
    }, { message: "URL长度超出限制" }),
    
  email: z.string()
    .email({ message: "请提供有效的邮箱地址" })
    .max(100, { message: "邮箱地址过长" })
    .refine((email) => {
      // 防止临时邮箱服务
      const suspiciousDomains = ['10minutemail.com', 'tempmail.org', 'guerrillamail.com'];
      const domain = email.split('@')[1]?.toLowerCase();
      return !suspiciousDomains.includes(domain);
    }, { message: "请使用常规邮箱服务" }),
    
  // Honeypot字段 - 对用户隐藏，机器人可能会填写
  _honeypot: z.string().max(0, { message: "机器人检测" }).optional(),
  
  // CSRF Token
  csrfToken: z.string().min(1, { message: "安全验证失败" })
});

// 2. 速率限制配置
export const createRateLimiter = (options = {}) => {
  return rateLimit({
    windowMs: options.windowMs || 15 * 60 * 1000, // 15分钟
    max: options.max || 5, // 每个IP限制5次请求
    message: {
      error: "请求过于频繁，请稍后再试",
      retryAfter: Math.ceil(options.windowMs / 1000 / 60)
    },
    standardHeaders: true,
    legacyHeaders: false,
    // 基于IP和邮箱的组合限制
    keyGenerator: (req) => {
      return `${req.ip}-${req.body?.email || 'anonymous'}`;
    },
    // 跳过成功的请求
    skipSuccessfulRequests: true,
    // 自定义存储(可选，用于分布式系统)
    store: options.store
  });
};

// 3. URL安全检查
export const validateYouTubeURL = async (url) => {
  try {
    const parsed = new URL(url);
    
    // 检查协议
    if (!['http:', 'https:'].includes(parsed.protocol)) {
      throw new Error('不支持的协议');
    }
    
    // 检查域名
    const allowedHosts = ['youtube.com', 'www.youtube.com', 'youtu.be', 'm.youtube.com'];
    if (!allowedHosts.includes(parsed.hostname)) {
      throw new Error('不支持的域名');
    }
    
    // 检查路径和参数
    if (parsed.hostname === 'youtu.be') {
      // youtu.be/VIDEO_ID 格式
      const videoId = parsed.pathname.slice(1);
      if (!/^[\w-]{11}$/.test(videoId)) {
        throw new Error('无效的视频ID');
      }
    } else {
      // youtube.com/watch?v=VIDEO_ID 格式
      const videoId = parsed.searchParams.get('v');
      if (!videoId || !/^[\w-]{11}$/.test(videoId)) {
        throw new Error('无效的视频ID');
      }
    }
    
    return {
      isValid: true,
      videoId: extractVideoId(url),
      sanitizedUrl: sanitizeUrl(url)
    };
    
  } catch (error) {
    return {
      isValid: false,
      error: error.message
    };
  }
};

// 4. URL清理
export const sanitizeUrl = (url) => {
  try {
    const parsed = new URL(url);
    const videoId = extractVideoId(url);
    
    // 返回标准化的YouTube URL，移除多余参数
    return `https://www.youtube.com/watch?v=${videoId}`;
  } catch (error) {
    throw new Error('URL格式错误');
  }
};

// 5. 提取视频ID
export const extractVideoId = (url) => {
  const patterns = [
    /youtube\.com\/watch\?v=([^&\n?#]+)/,
    /youtu\.be\/([^&\n?#]+)/,
    /youtube\.com\/embed\/([^&\n?#]+)/
  ];
  
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  
  throw new Error('无法提取视频ID');
};

// 6. 邮箱格式验证和安全检查
export const validateEmail = (email) => {
  // 基础格式验证
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { isValid: false, error: '邮箱格式错误' };
  }
  
  // 长度检查
  if (email.length > 100) {
    return { isValid: false, error: '邮箱地址过长' };
  }
  
  // 域名黑名单检查
  const suspiciousDomains = [
    '10minutemail.com', 'tempmail.org', 'guerrillamail.com',
    'mailinator.com', 'trash-mail.com', 'temp-mail.org'
  ];
  
  const domain = email.split('@')[1]?.toLowerCase();
  if (suspiciousDomains.includes(domain)) {
    return { isValid: false, error: '请使用常规邮箱服务' };
  }
  
  return { isValid: true };
};

// 7. 内容安全策略 (CSP)
export const getSecurityHeaders = () => {
  return {
    'Content-Security-Policy': [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval'", // 生产环境需要更严格
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: https:",
      "font-src 'self'",
      "connect-src 'self'",
      "frame-ancestors 'none'"
    ].join('; '),
    'X-Frame-Options': 'DENY',
    'X-Content-Type-Options': 'nosniff',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
    'Strict-Transport-Security': 'max-age=31536000; includeSubDomains'
  };
};

// 8. CSRF Token生成和验证
export const generateCSRFToken = () => {
  return require('crypto').randomBytes(32).toString('hex');
};

export const validateCSRFToken = (token, sessionToken) => {
  return token && sessionToken && token === sessionToken;
};

// 9. 日志记录 (用于安全监控)
export const logSecurityEvent = (event) => {
  const timestamp = new Date().toISOString();
  const logEntry = {
    timestamp,
    type: event.type,
    ip: event.ip,
    userAgent: event.userAgent,
    details: event.details,
    severity: event.severity || 'info'
  };
  
  // 在生产环境中，应该发送到安全监控系统
  console.log('[SECURITY]', JSON.stringify(logEntry));
  
  // 可以集成 Sentry, LogRocket 等监控服务
  if (event.severity === 'high') {
    // 发送告警
    console.error('[SECURITY ALERT]', logEntry);
  }
};

// 10. IP白名单/黑名单检查 (可选)
export const checkIPReputation = (ip) => {
  // 简单的IP检查，生产环境可以集成第三方服务
  const bannedIPs = new Set([
    // 这里可以添加已知的恶意IP
  ]);
  
  const whitelistedIPs = new Set([
    '127.0.0.1', // 本地测试
    // 可以添加信任的IP
  ]);
  
  if (bannedIPs.has(ip)) {
    return { allowed: false, reason: 'IP在黑名单中' };
  }
  
  if (whitelistedIPs.has(ip)) {
    return { allowed: true, reason: 'IP在白名单中' };
  }
  
  return { allowed: true, reason: 'IP检查通过' };
};