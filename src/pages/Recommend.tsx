import React, { useRef, useEffect } from 'react';
import { Chart as ChartJS, BarController, LineController, BarElement, LineElement, CategoryScale, LinearScale, PointElement, Legend, Tooltip } from 'chart.js';
import { KPICard } from '@components/KPICard';
import { StatusPill } from '@components/StatusPill';
import { SKUS, RECOMMENDATIONS } from '@data/mockData';
import { safeDivide, safeRound } from '@utils/helpers';
import { useToast } from '@context/ToastContext';

ChartJS.register(BarController, LineController, BarElement, LineElement, CategoryScale, LinearScale, PointElement, Legend, Tooltip);

export const Recommend: React.FC = () => {
  const chartRef = useRef<ChartJS | null>(null);
  const { show: showToast } = useToast();

  useEffect(() => {
    renderROPChart();
    return () => chartRef.current?.destroy();
  }, []);

  const renderROPChart = () => {
    const canvas = document.getElementById('c-rop') as HTMLCanvasElement;
    if (canvas && chartRef.current) chartRef.current.destroy();

    if (canvas) {
      chartRef.current = new ChartJS(canvas, {
        type: 'bar',
        data: {
          labels: SKUS.map(s => s.sku),
          datasets: [
            {
              type: 'bar',
              label: 'Current Stock',
              data: SKUS.map(s => s.stock),
              backgroundColor: SKUS.map(s => (s.status === 'low' ? 'rgba(220, 38, 38, 0.7)' : s.status === 'over' ? 'rgba(217, 119, 6, 0.7)' : 'rgba(5, 150, 105, 0.7)')),
              borderRadius: 5,
              barPercentage: 0.55,
            },
            {
              type: 'line',
              label: 'Reorder Point',
              data: SKUS.map(s => safeRound(s.demand * 1.5)),
              borderColor: '#dc2626',
              borderWidth: 2.5,
              pointRadius: 5,
              pointBackgroundColor: '#dc2626',
              fill: false,
              tension: 0,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: true, labels: { font: { size: 11 }, boxWidth: 10, padding: 16 } } },
          scales: {
            x: { ticks: { font: { size: 11 } } },
            y: { ticks: { font: { size: 11 } } },
          },
        },
      });
    }
  };

  const lowStockSkus = SKUS.filter(s => s.status === 'low');

  return (
    <div className="page">
      <div className="ph">
        <h2>🤖 AI Recommendations</h2>
        <button className="btn btn-outline btn-sm" onClick={() => renderROPChart()}>
          ↻ Refresh Analysis
        </button>
      </div>

      <div className="kpi-row">
        <KPICard label="Urgent Reorders" value="3" subtitle="Action needed today" colorClass="c-red" icon="🚨" />
        <KPICard label="Overstock Actions" value="2" subtitle="Reduce next PO" colorClass="c-amber" icon="📤" />
        <KPICard label="Est. Savings" value="$18K" subtitle="If actioned this week" colorClass="c-green" icon="💰" />
        <KPICard label="Stockout Prevention" value="35%" subtitle="vs baseline method" colorClass="c-blue" icon="📉" />
      </div>

      <div className="card" style={{ marginBottom: '15px' }}>
        <div className="card-hdr">Prioritized AI Recommendations</div>
        <div>
          {RECOMMENDATIONS.map((rec, idx) => (
            <div key={idx} className={`rec ${rec.type}`}>
              <div className="rec-ico">{rec.icon}</div>
              <div>
                <div className="rec-title">{rec.title}</div>
                <div className="rec-body">{rec.body}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="card" style={{ marginBottom: '15px' }}>
        <div className="card-hdr">📋 Purchase Order Action Plan</div>
        <div className="tbl-wrap">
          <table>
            <thead>
              <tr>
                <th>Priority</th>
                <th>SKU</th>
                <th>Product</th>
                <th>Reorder Qty</th>
                <th>Unit Price</th>
                <th>Est. PO Value</th>
                <th>Days to Stockout</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {lowStockSkus.map((s, i) => {
                const qty = Math.max(0, s.demand * 4 - s.stock);
                const days = safeRound(safeDivide(s.stock, s.demand) * 7);
                return (
                  <tr key={s.sku}>
                    <td>
                      <StatusPill status="red" label={`P${i + 1} Urgent`} />
                    </td>
                    <td style={{ fontFamily: 'monospace', fontSize: '11px' }}>{s.sku}</td>
                    <td style={{ fontWeight: '600' }}>{s.name}</td>
                    <td style={{ fontWeight: '700', color: 'var(--blue)' }}>{qty}</td>
                    <td>${s.price}</td>
                    <td style={{ fontWeight: '700' }}>${(qty * s.price).toLocaleString()}</td>
                    <td style={{ color: days < 3 ? 'var(--red)' : days < 7 ? 'var(--amber)' : 'var(--green)', fontWeight: '700' }}>
                      {days}d
                    </td>
                    <td>
                      <button
                        className="btn btn-blue btn-sm"
                        onClick={() => {
                          showToast(`PO for ${s.name} placed ✓`);
                        }}
                      >
                        Place PO
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div className="card">
        <div className="card-hdr">📊 Current Stock vs Reorder Point</div>
        <div style={{ position: 'relative', height: '225px' }}>
          <canvas id="c-rop" role="img" aria-label="Stock vs reorder point combo chart">
            Reorder point chart.
          </canvas>
        </div>
      </div>
    </div>
  );
};
