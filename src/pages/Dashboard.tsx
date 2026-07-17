import React, { useRef, useEffect } from 'react';
import { Chart as ChartJS, BarController, LineController, BarElement, LineElement, CategoryScale, LinearScale, PointElement, Legend, Tooltip } from 'chart.js';
import { KPICard } from '@components/KPICard';
import { AlertItem } from '@components/AlertItem';
import { SKUS, DASHBOARD_ALERTS, WEEKS, ACTUAL_ALL, FORECAST_ALL } from '@data/mockData';

ChartJS.register(BarController, LineController, BarElement, LineElement, CategoryScale, LinearScale, PointElement, Legend, Tooltip);

export const Dashboard: React.FC = () => {
  const chartRefs = useRef<{ [key: string]: ChartJS | null }>({});

  useEffect(() => {
    renderCharts();
    return () => {
      Object.values(chartRefs.current).forEach(chart => chart?.destroy());
    };
  }, []);

  const renderCharts = () => {
    const low = SKUS.filter(s => s.status === 'low').length;
    const over = SKUS.filter(s => s.status === 'over').length;
    const ok = SKUS.filter(s => s.status === 'ok').length;

    // Sales Chart
    const salesCanvas = document.getElementById('c-sales') as HTMLCanvasElement;
    if (salesCanvas && chartRefs.current['sales']) chartRefs.current['sales']?.destroy();
    if (salesCanvas) {
      chartRefs.current['sales'] = new ChartJS(salesCanvas, {
        type: 'bar',
        data: {
          labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
          datasets: [
            {
              label: 'Actual',
              data: [42, 38, 51, 47, 55, 62],
              backgroundColor: '#2563eb',
              borderRadius: 5,
              barPercentage: 0.55,
            },
            {
              label: 'Target',
              data: [40, 42, 45, 46, 50, 55],
              backgroundColor: '#bfdbfe',
              borderRadius: 5,
              barPercentage: 0.55,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false } },
          scales: {
            x: { grid: { color: '#f3f4f6' }, ticks: { font: { size: 11 } } },
            y: { grid: { color: '#f3f4f6' }, ticks: { font: { size: 11 } } },
          },
        },
      });
    }

    // Forecast Chart
    const fcCanvas = document.getElementById('c-fc8') as HTMLCanvasElement;
    if (fcCanvas && chartRefs.current['forecast']) chartRefs.current['forecast']?.destroy();
    if (fcCanvas) {
      chartRefs.current['forecast'] = new ChartJS(fcCanvas, {
        type: 'line',
        data: {
          labels: WEEKS,
          datasets: [
            {
              data: [...ACTUAL_ALL, null, null, null, null],
              borderColor: '#2563eb',
              backgroundColor: 'rgba(37, 99, 235, 0.07)',
              tension: 0.4,
              pointRadius: 4,
              fill: true,
              spanGaps: false,
            },
            {
              data: FORECAST_ALL,
              borderColor: '#10b981',
              borderDash: [6, 3],
              tension: 0.4,
              pointRadius: 3,
              fill: false,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false } },
          scales: {
            x: { grid: { color: '#f3f4f6' }, ticks: { font: { size: 11 } } },
            y: { grid: { color: '#f3f4f6' }, ticks: { font: { size: 11 } } },
          },
        },
      });
    }

    // Inventory Chart
    const invCanvas = document.getElementById('c-invd') as HTMLCanvasElement;
    if (invCanvas && chartRefs.current['inventory']) chartRefs.current['inventory']?.destroy();
    if (invCanvas) {
      chartRefs.current['inventory'] = new ChartJS(invCanvas, {
        type: 'bar',
        data: {
          labels: SKUS.map(s => s.sku),
          datasets: [
            {
              label: 'Stock',
              data: SKUS.map(s => s.stock),
              backgroundColor: SKUS.map(s => (s.status === 'low' ? '#ef4444' : s.status === 'over' ? '#f59e0b' : '#10b981')),
              borderRadius: 5,
              barPercentage: 0.5,
            },
            {
              label: 'Demand/wk',
              data: SKUS.map(s => s.demand),
              backgroundColor: 'rgba(37, 99, 235, 0.22)',
              borderRadius: 5,
              barPercentage: 0.5,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false } },
          scales: {
            x: { grid: { color: '#f3f4f6' }, ticks: { font: { size: 11 } } },
            y: { grid: { color: '#f3f4f6' }, ticks: { font: { size: 11 } } },
          },
        },
      });
    }
  };

  const low = SKUS.filter(s => s.status === 'low').length;
  const over = SKUS.filter(s => s.status === 'over').length;
  const ok = SKUS.filter(s => s.status === 'ok').length;

  return (
    <div className="page active">
      <div className="ph">
        <h2>📊 Overview Dashboard</h2>
        <p id="dash-ts">{`Last updated: ${new Date().toLocaleTimeString()}`}</p>
      </div>

      <div className="kpi-row">
        <KPICard label="Low Stock SKUs" value={low} subtitle="⚠ Needs reorder" colorClass="c-red" icon="📦" />
        <KPICard label="Overstocked" value={over} subtitle="↓ Reduce next PO" colorClass="c-amber" icon="📤" />
        <KPICard label="Optimal Stock" value={ok} subtitle="On target" colorClass="c-green" icon="✅" />
        <KPICard label="Forecast Accuracy" value="91.4%" subtitle="MAPE 8.6% ✓" colorClass="c-blue" icon="🎯" />
        <KPICard label="Monthly Revenue" value="$62K" subtitle="↑ +12.7% vs target" colorClass="c-green" icon="💰" />
        <KPICard label="Fill Rate" value="96.2%" subtitle="Target >95% ✓" colorClass="c-blue" icon="📋" />
      </div>

      <div className="g2">
        <div className="card">
          <div className="card-hdr">
            📈 Sales Trend vs Target (Jan–Jun)
            <span className="chip">Monthly</span>
          </div>
          <div style={{ position: 'relative', height: '195px' }}>
            <canvas id="c-sales" role="img" aria-label="Monthly sales vs target bar chart">
              Sales vs target chart.
            </canvas>
          </div>
          <div style={{ display: 'flex', gap: '16px', marginTop: '9px', fontSize: '11px', color: 'var(--gray)' }}>
            <span>
              <span style={{ display: 'inline-block', width: '10px', height: '10px', borderRadius: '2px', background: '#2563eb', marginRight: '5px' }} />
              Actual
            </span>
            <span>
              <span style={{ display: 'inline-block', width: '10px', height: '10px', borderRadius: '2px', background: '#bfdbfe', marginRight: '5px' }} />
              Target
            </span>
          </div>
        </div>

        <div className="card">
          <div className="card-hdr">
            🔮 8-Week Demand Forecast
            <span className="chip">AI Model</span>
          </div>
          <div style={{ position: 'relative', height: '195px' }}>
            <canvas id="c-fc8" role="img" aria-label="8-week demand forecast line chart">
              Forecast chart.
            </canvas>
          </div>
          <div style={{ display: 'flex', gap: '16px', marginTop: '9px', fontSize: '11px', color: 'var(--gray)' }}>
            <span>
              <span style={{ display: 'inline-block', width: '18px', height: '3px', background: '#2563eb', verticalAlign: 'middle', marginRight: '5px' }} />
              Actual
            </span>
            <span>
              <span style={{ display: 'inline-block', width: '18px', borderTop: '2px dashed #10b981', verticalAlign: 'middle', marginRight: '5px' }} />
              Forecast
            </span>
          </div>
        </div>
      </div>

      <div className="g2">
        <div className="card">
          <div className="card-hdr">
            📦 Stock vs Weekly Demand by SKU
            <span className="chip">Live</span>
          </div>
          <div style={{ position: 'relative', height: '210px' }}>
            <canvas id="c-invd" role="img" aria-label="Inventory vs demand comparison chart">
              Inventory vs demand chart.
            </canvas>
          </div>
          <div style={{ display: 'flex', gap: '16px', marginTop: '9px', fontSize: '11px', color: 'var(--gray)' }}>
            <span>
              <span style={{ display: 'inline-block', width: '10px', height: '10px', borderRadius: '2px', background: '#10b981', marginRight: '5px' }} />
              Stock
            </span>
            <span>
              <span style={{ display: 'inline-block', width: '10px', height: '10px', borderRadius: '2px', background: 'rgba(37, 99, 235, 0.25)', marginRight: '5px' }} />
              Demand/wk
            </span>
          </div>
        </div>

        <div className="card">
          <div className="card-hdr">
            🔔 Active Alerts <span className="badge-count">{DASHBOARD_ALERTS.length}</span>
          </div>
          <div>
            {DASHBOARD_ALERTS.map((alert, idx) => (
              <AlertItem key={idx} type={alert.type} icon={alert.icon} message={alert.message} subtitle={alert.subtitle} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
