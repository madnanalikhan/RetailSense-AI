import { Chart as ChartJS, ChartConfiguration } from 'chart.js';

export function safeDivide(a: number, b: number): number {
  return !b || isNaN(b) || !isFinite(b) ? 0 : a / b;
}

export function clamp(v: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, v));
}

export function safeRound(v: number): number {
  return isNaN(v) || !isFinite(v) ? 0 : Math.round(v);
}

export function toast(message: string, duration = 2800): void {
  const event = new CustomEvent('showToast', { detail: message });
  window.dispatchEvent(event);
  setTimeout(() => {
    const hideEvent = new CustomEvent('hideToast');
    window.dispatchEvent(hideEvent);
  }, duration);
}

export function createChart(
  canvas: HTMLCanvasElement,
  config: ChartConfiguration<any>,
  existingChart?: ChartJS | null
): ChartJS | null {
  if (!canvas) return null;
  
  if (existingChart) {
    existingChart.destroy();
  }

  return new ChartJS(canvas, {
    ...config,
    options: {
      ...config.options,
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        ...config.options?.plugins,
      },
    },
  });
}
