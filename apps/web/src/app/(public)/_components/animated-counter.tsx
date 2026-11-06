'use client';

import { useEffect, useState } from 'react';

export interface AnimatedCounterProps {
  value: string;
  duration?: number; // thời gian chạy hiệu ứng (ms), mặc định 1400ms
  className?: string;
}

interface ParsedNumber {
  prefix: string;
  target: number;
  suffix: string;
  decimals: number;
  separator: string;
}

function parseStatValue(raw: string): ParsedNumber | null {
  const match = raw.match(/^([^\d]*)([\d.,]+)(.*)$/);
  if (!match) return null;

  const prefix = match[1] || '';
  const numStr = match[2] || '';
  const suffix = match[3] || '';

  // Định dạng hàng nghìn tiếng Việt: '5.000', '12.000'
  if (numStr.includes('.') && numStr.split('.')[1]?.length === 3) {
    const parsed = parseFloat(numStr.replace(/\./g, ''));
    return { prefix, target: parsed, suffix, decimals: 0, separator: '.' };
  }

  // Định dạng số thập phân: '99.2'
  if (numStr.includes('.')) {
    const decimals = numStr.split('.')[1]?.length || 0;
    const parsed = parseFloat(numStr);
    return { prefix, target: parsed, suffix, decimals, separator: '.' };
  }

  if (numStr.includes(',')) {
    const decimals = numStr.split(',')[1]?.length || 0;
    const parsed = parseFloat(numStr.replace(',', '.'));
    return { prefix, target: parsed, suffix, decimals, separator: ',' };
  }

  const parsed = parseInt(numStr, 10);
  if (Number.isNaN(parsed)) return null;

  return { prefix, target: parsed, suffix, decimals: 0, separator: '' };
}

// Hàm gia tốc mượt mà: chạy nhanh lúc đầu và hãm chậm dần tự nhiên
function easeOutExpo(x: number): number {
  return x === 1 ? 1 : 1 - Math.pow(2, -10 * x);
}

function formatCurrent(current: number, parsed: ParsedNumber): string {
  const { prefix, suffix, decimals, separator } = parsed;

  if (decimals > 0) {
    const formatted = current.toFixed(decimals);
    return `${prefix}${separator === ',' ? formatted.replace('.', ',') : formatted}${suffix}`;
  }

  const rounded = Math.round(current);
  if (separator === '.') {
    return `${prefix}${rounded.toLocaleString('vi-VN')}${suffix}`;
  }

  return `${prefix}${rounded}${suffix}`;
}

export function AnimatedCounter({
  value,
  duration = 1400,
  className,
}: AnimatedCounterProps) {
  // SSR & Fallback ban đầu giữ đúng chuỗi tĩnh để crawler SEO đọc được
  const [displayValue, setDisplayValue] = useState(value);
  const [triggerKey, setTriggerKey] = useState(0);

  // Kích hoạt lại hiệu ứng nhảy số khi người dùng bấm Logo về trang chủ
  useEffect(() => {
    const handleResetHome = () => {
      setTriggerKey((k) => k + 1);
    };
    window.addEventListener('vietvi:reset-home', handleResetHome);
    return () => {
      window.removeEventListener('vietvi:reset-home', handleResetHome);
    };
  }, []);

  useEffect(() => {
    // 1. Kiểm tra tuân thủ a11y: nếu người dùng cài đặt giảm hiệu ứng chuyển động, giữ số tĩnh
    if (
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      setDisplayValue(value);
      return;
    }

    const parsed = parseStatValue(value);
    if (!parsed) {
      setDisplayValue(value);
      return;
    }

    let animationFrameId: number;
    let startTime: number | null = null;
    const startValue = 0;
    const targetValue = parsed.target;

    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = easeOutExpo(progress);

      const current = startValue + (targetValue - startValue) * easedProgress;
      setDisplayValue(formatCurrent(current, parsed));

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(step);
      } else {
        // Đảm bảo hiển thị chính xác giá trị gốc khi kết thúc
        setDisplayValue(value);
      }
    };

    animationFrameId = requestAnimationFrame(step);

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [value, duration, triggerKey]);

  return <span className={className}>{displayValue}</span>;
}
