// Utility functions for Wemezekr platform

export function formatDate(dateString?: string): string {
  if (!dateString) return 'Undated';
  try {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return dateString;
    return d.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  } catch {
    return dateString;
  }
}

export function formatFileSize(bytes?: number): string {
  if (!bytes) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

export function truncateText(text: string, maxLength: number): string {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength)}...`;
}

export const DEMO_MODE_KEY = 'wemezekr_demo_mode_enabled';

export function getDemoMode(): boolean {
  // Default to false unless explicitly toggled by user
  return localStorage.getItem(DEMO_MODE_KEY) === 'true';
}

export function setDemoMode(enabled: boolean): void {
  localStorage.setItem(DEMO_MODE_KEY, enabled ? 'true' : 'false');
  window.dispatchEvent(new Event('wemezekr_demo_mode_change'));
}
