// 简化版验证库
import { z } from 'zod';

// 简化的YouTube提交验证Schema
export const YouTubeSubmissionSchema = z.object({
  url: z.string()
    .url({ message: "请提供有效的URL" })
    .refine((url) => {
      const youtubeRegex = /^https?:\/\/(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/)[\w-]+(&.*)?$/;
      return youtubeRegex.test(url);
    }, { message: "请提供有效的YouTube链接" }),
    
  email: z.string()
    .email({ message: "请提供有效的邮箱地址" })
    .max(100, { message: "邮箱地址过长" })
});

// YouTube URL验证和视频ID提取
export const validateYouTubeURL = (url) => {
  try {
    const parsed = new URL(url);
    
    const allowedHosts = ['youtube.com', 'www.youtube.com', 'youtu.be', 'm.youtube.com'];
    if (!allowedHosts.includes(parsed.hostname)) {
      return { isValid: false, error: '请提供YouTube链接' };
    }
    
    let videoId;
    if (parsed.hostname === 'youtu.be') {
      videoId = parsed.pathname.slice(1);
    } else {
      videoId = parsed.searchParams.get('v');
    }
    
    if (!videoId || !/^[\w-]{11}$/.test(videoId)) {
      return { isValid: false, error: '无效的YouTube视频' };
    }
    
    return {
      isValid: true,
      videoId,
      sanitizedUrl: `https://www.youtube.com/watch?v=${videoId}`
    };
    
  } catch (error) {
    return { isValid: false, error: 'URL格式错误' };
  }
};

// 简单邮箱验证
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { isValid: false, error: '邮箱格式错误' };
  }
  
  if (email.length > 100) {
    return { isValid: false, error: '邮箱地址过长' };
  }
  
  return { isValid: true };
};