import React, { useState, useRef, useEffect } from 'react';
import { Chart as ChartJS, BarController, BarElement, CategoryScale, LinearScale, Legend, Tooltip } from 'chart.js';
import { KPICard } from '@components/KPICard';
import { StatusPill } from '@components/StatusPill';
import { ProgressBar } from '@components/ProgressBar';
import { SKUS } from '@data/mockData';
import { safeDivide, clamp, safeRound } from '@utils/helpers';
import { useToast } from '@context/ToastContext';

ChartJS.register(BarController, BarElement, CategoryScale, LinearScale, Legend, Tooltip);

export const Inventory: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const chartRef = useRef<ChartJS | null>(null);
  const { show: showToast } = useToast();

  useEffect(() => {
    renderHeatmap();
    return () => chartRef.current?.destroy();
  }, [filterStatus, searchQuery]);

  const renderHeatmap = () => {
    const rows = getFilteredRows();
    const canvas = document.getElementById('c-heatmap') as HTMLCanvasElement;

    if (canvas && chartRef.current) chartRef.current.destroy();

    if (rows.length && canvas) {
      const covData = rows.map(s => (s.demand > 0 ? parseFloat(safeDivide(s.stock, s.demand).toFixed(1)) : 0));

      chartRef.current = new ChartJS(canvas, {
        type: 'bar',
        data: {
          labels: rows.map(s => s.sku),
          datasets: [
            {
              label: 'Weeks of Supply',
              data: covData,
              backgroundColor: rows.map(s => (s.status === 'low' ? 'rgba(220, 38, 38, 0.75)' : s.status === 'over' ? 'rgba(217, 119, 6, 0.75)' : 'rgba(5, 150, 105, 0.75)')),
              borderRadius: 6,
              barPercentage: 0.65,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false }, tooltip: { callbacks: { label: ctx => `${ctx.parsed.y} weeks of supply` } } },
          scales: {
            x: { ticks: { font: { size: 11 } } },
            y: { ticks: { font: { size: 11 } }, title: { display: true, text: 'Weeks', font: { size: 11 } } },
          },
        },
      });
    }
  };

  const getFilteredRows = () => {
    const q = searchQuery.toLowerCase().trim();
    return SKUS.filter(s => (filterStatus === 'all' || s.status === filterStatus) && (s.name.toLowerCase().includes(q) || s.sku.toLowerCase().includes(q)));
  };

  const rows = getFilteredRows();
  const counts = { low: 0, over: 0, ok: 0 };
  SKUS.forEach(s => counts[s.status]++);

  return (
    <div className="page">
      <div className="ph">
        <h2>📦 Inventory Status</h2>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <input
            type="text"
            placeholder="Search SKU or name…"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            style={{ width: '185px' }}
          />
          <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} style={{ width: '140px' }}>
            <option value="all">All Status</option>
            <option value="low">Low Stock</option>
            <option value="over">Overstocked</option>
            <option value="ok">Optimal</option>
          </select>
        </div>
      </div>

      <div className="kpi-row">
        <KPICard label="Low Stock" value={counts.low} subtitle="Need reorder" colorClass="c-red" icon="📦" />
        <KPICard label="Overstocked" value={counts.over} subtitle="Reduce order" colorClass="c-amber" icon="📤" />
        <KPICard label="Optimal" value={counts.ok} subtitle="Healthy levels" colorClass="c-green" icon="✅" />
        <KPICard label="Showing" value={`${rows.length}/${SKUS.length}`} subtitle="Filtered SKUs" colorClass="c-blue" icon="📋" />
      </div>

      <div className="card" style={{ marginBottom: '15px' }}>
        <div className="tbl-wrap">
          <table>
            <thead>
              <tr>
                <th>SKU</th>
                <th>Product</th>
                <th>Category</th>
                <th>In Stock</th>
                <th>Demand/wk</th>
                <th>Coverage</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {rows.length
                ? rows.map(s => {
                    const covRaw = safeDivide(s.stock, s.demand);
                    const cov = covRaw === 0 && s.demand === 0 ? 'N/A' : covRaw.toFixed(1) + ' wks';
                    const pct = clamp(safeDivide(s.stock, s.demand * 4) * 100, 0, 100);
                    const statusLabel = s.status === 'low' ? 'Low Stock' : s.status === 'over' ? 'Overstocked' : 'Optimal';

                    const action = s.status === 'low' ? (
                      <button
                        className="btn btn-blue btn-sm"
                        onClick={() => showToast(`PO for ${s.name} submitted ✓`)}
                      >
                        Reorder {Math.max(0, s.demand * 4 - s.stock)}
                      </button>
                    ) : s.status === 'over' ? (
                      <button
                        className="btn btn-outline btn-sm"
                        onClick={() => showToast(`Reduction flag set for ${s.name}`)}
                      >
                        Reduce PO
                      </button>
                    ) : (
                      <span style={{ color: 'var(--gray)', fontSize: '12px' }}>Maintain</span>
                    );

                    return (
                      <tr key={s.sku}>
                        <td style={{ fontFamily: 'monospace', fontSize: '11px', color: 'var(--gray)' }}>{s.sku}</td>
                        <td style={{ fontWeight: '600' }}>{s.name}</td>
                        <td>{s.cat}</td>
                        <td style={{ fontWeight: '700', color: s.status === 'low' ? 'var(--red)' : s.status === 'over' ? 'var(--amber)' : 'var(--green)' }}>
                          {s.stock}
                        </td>
                        <td>{s.demand}/wk</td>
                        <td>
                          {cov}
                          <ProgressBar
                            percentage={pct}
                            color={s.status === 'low' ? 'red' : s.status === 'over' ? 'amber' : 'green'}
                          />
                        </td>
                        <td>
                          <StatusPill status={s.status as 'red' | 'green' | 'amber' | 'blue'} label={statusLabel} />
                        </td>
                        <td>{action}</td>
                      </tr>
                    );
                  })
                : (
                  <tr>
                    <td colSpan={8} className="empty">
                      No SKUs match your filter criteria.
                    </td>
                  </tr>
                )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="card">
        <div className="card-hdr">Stock Coverage Heatmap (weeks of supply)</div>
        <div style={{ position: 'relative', height: '205px' }}>
          <canvas id="c-heatmap" role="img" aria-label="Weeks of supply heatmap bar chart">
            Coverage heatmap.
          </canvas>
        </div>
      </div>
    </div>
  );
};
