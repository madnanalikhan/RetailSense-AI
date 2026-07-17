import React, { useState, useRef, useEffect } from 'react';
import { Chart as ChartJS, LineController, BarController, BarElement, LineElement, CategoryScale, LinearScale, PointElement, Legend, Tooltip } from 'chart.js';
import { KPICard } from '@components/KPICard';
import { StatusPill } from '@components/StatusPill';
import { ProgressBar } from '@components/ProgressBar';
import { SKUS, WEEKS, ACTUAL_ALL, FORECAST_ALL } from '@data/mockData';
import { safeRound } from '@utils/helpers';

ChartJS.register(LineController, BarController, BarElement, LineElement, CategoryScale, LinearScale, PointElement, Legend, Tooltip);

export const Forecast: React.FC = () => {
  const [selectedSku, setSelectedSku] = useState<string>('all');
  const chartRef = useRef<ChartJS | null>(null);

  useEffect(() => {
    renderFcChart();
    return () => chartRef.current?.destroy();
  }, [selectedSku]);

  const renderFcChart = () => {
    const val = selectedSku;
    let act, fc;

    if (!val || val === 'all') {
      act = ACTUAL_ALL;
      fc = FORECAST_ALL;
    } else {
      const s = SKUS.find(x => x.sku === val);
      if (!s) return;

      const base = Math.max(s.demand, 1);
      act = [Math.round(base * 0.88), Math.round(base * 1.04), Math.round(base * 0.93), Math.round(base * 1.09)];
      fc = [
        Math.round(base * 0.91),
        Math.round(base * 1.01),
        Math.round(base * 0.95),
        Math.round(base * 1.07),
        Math.round(base * 1.13),
        Math.round(base * 1.19),
        Math.round(base * 1.11),
        Math.round(base * 1.23),
      ];
    }

    const canvas = document.getElementById('c-fc-main') as HTMLCanvasElement;
    if (canvas && chartRef.current) chartRef.current.destroy();
    if (canvas) {
      chartRef.current = new ChartJS(canvas, {
        type: 'line',
        data: {
          labels: WEEKS,
          datasets: [
            {
              data: [...act, null, null, null, null],
              borderColor: '#2563eb',
              backgroundColor: 'rgba(37, 99, 235, 0.07)',
              tension: 0.4,
              pointRadius: 5,
              fill: true,
              spanGaps: false,
            },
            {
              data: fc,
              borderColor: '#10b981',
              borderDash: [7, 4],
              tension: 0.4,
              pointRadius: 4,
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
  };

  const sku = selectedSku === 'all' ? null : SKUS.find(s => s.sku === selectedSku);
  const mape = sku ? (sku.status === 'low' ? 7.8 : sku.status === 'over' ? 9.1 : 8.3).toFixed(1) : '8.6';
  const acc = sku ? (100 - parseFloat(mape)).toFixed(1) : '91.4';

  return (
    <div className="page">
      <div className="ph">
        <h2>🔮 Demand Forecasting</h2>
        <p>Simulated XGBoost + Prophet — 8-week projection</p>
      </div>

      <div className="kpi-row">
        <KPICard label="Model MAPE" value={`${mape}%`} subtitle="Target <10% ✓" colorClass="c-blue" />
        <KPICard label="Accuracy Score" value={`${acc}%`} subtitle={`${acc >= '90' ? 'Above 90% ✓' : 'Needs tuning'}`} colorClass="c-green" />
        <KPICard label="Forecast Horizon" value="8 wks" subtitle="Updated daily" colorClass="c-blue" />
        <KPICard label="SKUs Tracked" value={SKUS.length} subtitle="All active" colorClass="c-amber" />
      </div>

      <div className="card" style={{ marginBottom: '15px' }}>
        <div className="card-hdr">
          Actual vs AI Forecast — Weekly Units
          <select id="fc-sku" value={selectedSku} onChange={e => setSelectedSku(e.target.value)} style={{ width: '190px', padding: '5px 9px', fontSize: '12px' }}>
            <option value="all">All SKUs Combined</option>
            {SKUS.map(s => (
              <option key={s.sku} value={s.sku}>
                {s.sku} – {s.name}
              </option>
            ))}
          </select>
        </div>
        <div style={{ position: 'relative', height: '235px' }}>
          <canvas id="c-fc-main" role="img" aria-label="Actual vs AI forecast line chart">
            Forecast line chart.
          </canvas>
        </div>
        <div style={{ display: 'flex', gap: '18px', marginTop: '9px', fontSize: '11px', color: 'var(--gray)' }}>
          <span>
            <span style={{ display: 'inline-block', width: '18px', height: '3px', background: '#2563eb', verticalAlign: 'middle', marginRight: '5px' }} />
            Actual (W1–W4)
          </span>
          <span>
            <span style={{ display: 'inline-block', width: '18px', borderTop: '2px dashed #10b981', verticalAlign: 'middle', marginRight: '5px' }} />
            AI Forecast (W5–W8 projected)
          </span>
        </div>
      </div>

      <div className="card">
        <div className="card-hdr">Per-SKU Demand Forecast — Next Week</div>
        <div className="tbl-wrap">
          <table>
            <thead>
              <tr>
                <th>SKU</th>
                <th>Product</th>
                <th>Category</th>
                <th>Forecast (units/wk)</th>
                <th>Confidence</th>
                <th>Trend</th>
                <th>Risk Level</th>
              </tr>
            </thead>
            <tbody>
              {SKUS.map(s => {
                const conf = s.status === 'low' ? 92 : s.status === 'over' ? 88 : 91;
                const trend = s.demand > 80 ? '🔺 Rising' : s.demand < 55 ? '🔻 Falling' : '➡ Stable';
                const riskCls = s.status === 'low' ? 'red' : s.status === 'over' ? 'amber' : 'green';
                const riskLbl = s.status === 'low' ? 'High' : s.status === 'over' ? 'Medium' : 'Normal';
                return (
                  <tr key={s.sku}>
                    <td style={{ fontFamily: 'monospace', fontSize: '11px', color: 'var(--gray)' }}>{s.sku}</td>
                    <td style={{ fontWeight: '600' }}>{s.name}</td>
                    <td>{s.cat}</td>
                    <td>
                      <b style={{ color: s.demand > 80 ? 'var(--red)' : s.demand > 60 ? 'var(--amber)' : 'var(--green)' }}>{s.demand}</b> units
                    </td>
                    <td>
                      <div style={{ fontSize: '12px', marginBottom: '2px' }}>{conf}%</div>
                      <ProgressBar percentage={conf} color={conf > 90 ? 'green' : 'amber'} />
                    </td>
                    <td>{trend}</td>
                    <td>
                      <StatusPill status={riskCls} label={riskLbl} />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
