import React, { useState, useRef } from 'react';
import { Chart as ChartJS, BarController, BarElement, CategoryScale, LinearScale, Legend, Tooltip } from 'chart.js';
import { KPICard } from '@components/KPICard';
import { AlertItem } from '@components/AlertItem';
import { SKUS } from '@data/mockData';
import { safeDivide, safeRound } from '@utils/helpers';
import { useToast } from '@context/ToastContext';

ChartJS.register(BarController, BarElement, CategoryScale, LinearScale, Legend, Tooltip);

export const Simulate: React.FC = () => {
  const [selectedSku, setSelectedSku] = useState('');
  const [units, setUnits] = useState('');
  const [promo, setPromo] = useState('1');
  const [season, setSeason] = useState('1');
  const [weather, setWeather] = useState('0');
  const [trend, setTrend] = useState('10');
  const [holiday, setHoliday] = useState('0');
  const [csvData, setCsvData] = useState('');
  const [simResult, setSimResult] = useState<any>(null);
  const [csvResult, setCsvResult] = useState<{ valid: number; skipped: number; errors: string[] } | null>(null);
  const chartRef = useRef<ChartJS | null>(null);
  const { show: showToast } = useToast();

  const handleSkuChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const skuId = e.target.value;
    setSelectedSku(skuId);
    const sku = SKUS.find(s => s.sku === skuId);
    if (sku) {
      setUnits(sku.demand.toString());
    }
  };

  const runSim = () => {
    if (!selectedSku) {
      showToast('⚠ Please select a product SKU.');
      return;
    }

    const sku = SKUS.find(s => s.sku === selectedSku);
    if (!sku) return;

    const parsedUnits = parseFloat(units);
    const base = parsedUnits > 0 ? parsedUnits : sku.demand || 1;
    const promoMult = parseFloat(promo);
    const seasonMult = parseFloat(season);
    const weatherMult = 1 + parseFloat(weather) / 100;
    const trendMult = 1 + parseFloat(trend) / 100;
    const holidayMult = 1 + parseFloat(holiday) / 100;

    const rawAdj = base * promoMult * seasonMult * weatherMult * trendMult * holidayMult;
    const adj = Math.max(1, safeRound(rawAdj));
    const currentStock = Math.max(0, sku.stock);

    const daysPerUnit = 7 / adj;
    const days = currentStock === 0 ? 0 : safeRound(currentStock * daysPerUnit);
    const reorder = Math.max(0, adj * 4 - currentStock);
    const risk = days === 0 ? '🔴 OUT OF STOCK' : days < 3 ? '🔴 CRITICAL' : days < 10 ? '🟡 WARNING' : '🟢 SAFE';
    const riskCls = days < 3 ? 'danger' : days < 10 ? 'warning' : 'success';

    setSimResult({
      base: safeRound(base),
      adj,
      days,
      risk,
      riskCls,
      reorder,
      cost: reorder * sku.price,
      currentStock,
      sku,
    });

    // Render chart
    const canvas = document.getElementById('c-sim') as HTMLCanvasElement;
    if (canvas && chartRef.current) chartRef.current.destroy();
    if (canvas) {
      chartRef.current = new ChartJS(canvas, {
        type: 'bar',
        data: {
          labels: ['Base Demand', 'AI Adjusted Demand'],
          datasets: [
            {
              data: [safeRound(base), adj],
              backgroundColor: ['#bfdbfe', '#2563eb'],
              borderRadius: 8,
              barPercentage: 0.45,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            tooltip: { callbacks: { label: ctx => `${ctx.parsed.y} units/week` } },
          },
          scales: {
            x: { ticks: { font: { size: 11 } } },
            y: { ticks: { font: { size: 11 } } },
          },
        },
      });
    }
  };

  const processCSV = () => {
    const raw = csvData.trim();
    if (!raw) {
      setCsvResult({ valid: 0, skipped: 0, errors: ['No data entered. Paste CSV rows first.'] });
      return;
    }

    const lines = raw.split('\n').map(l => l.trim()).filter(l => l.length > 0);
    let valid = 0,
      skipped = 0;
    const errors: string[] = [];

    lines.forEach((line, i) => {
      const parts = line.split(',').map(p => p.trim());
      if (parts.length < 3) {
        skipped++;
        errors.push(`Row ${i + 1}: too few columns`);
        return;
      }

      const [date, sku, unitsStr, priceStr] = parts;
      if (!date || !sku) {
        skipped++;
        errors.push(`Row ${i + 1}: missing date or SKU`);
        return;
      }

      const u = parseFloat(unitsStr);
      if (isNaN(u) || u < 0) {
        skipped++;
        errors.push(`Row ${i + 1}: invalid units "${unitsStr}"`);
        return;
      }

      if (priceStr !== undefined) {
        const p = parseFloat(priceStr);
        if (isNaN(p) || p < 0) {
          skipped++;
          errors.push(`Row ${i + 1}: invalid price "${priceStr}"`);
          return;
        }
      }

      valid++;
    });

    setCsvResult({ valid, skipped, errors: errors.slice(0, 3) });
    if (valid > 0) {
      showToast(`${valid} CSV records processed successfully`);
    }
  };

  return (
    <div className="page">
      <div className="ph">
        <h2>🧪 AI Demand Simulator</h2>
        <p>Adjust factors to simulate AI demand predictions</p>
      </div>

      <div className="g2">
        <div className="card">
          <div className="card-hdr">Product & Sales Input</div>
          <div className="frow">
            <div>
              <label className="lbl">
                Select SKU <span style={{ color: 'var(--red)' }}>*</span>
              </label>
              <select id="s-sku" value={selectedSku} onChange={handleSkuChange}>
                <option value="">— Choose a product —</option>
                {SKUS.map(s => (
                  <option key={s.sku} value={s.sku}>
                    {s.sku} – {s.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="lbl">Base Units Sold/wk</label>
              <input
                type="number"
                value={units}
                onChange={e => setUnits(e.target.value)}
                placeholder="Auto-fills from SKU"
                min="0"
                max="10000"
              />
            </div>
          </div>

          <div className="frow">
            <div>
              <label className="lbl">Promotion Active?</label>
              <select value={promo} onChange={e => setPromo(e.target.value)}>
                <option value="1">No Promotion</option>
                <option value="1.2">Flash Sale (+20%)</option>
                <option value="1.35">Major Campaign (+35%)</option>
              </select>
            </div>
            <div>
              <label className="lbl">Seasonal Pattern</label>
              <select value={season} onChange={e => setSeason(e.target.value)}>
                <option value="1">Normal Season</option>
                <option value="1.3">Peak Season (+30%)</option>
                <option value="0.75">Off-Peak (−25%)</option>
                <option value="1.15">Holiday Boost (+15%)</option>
              </select>
            </div>
          </div>

          <button className="btn btn-blue" onClick={runSim}>
            ▶ Run AI Simulation
          </button>
        </div>

        <div className="card">
          <div className="card-hdr">External Factor Controls</div>
          <label className="lbl">Weather Impact on Demand</label>
          <input
            type="range"
            min="-30"
            max="30"
            value={weather}
            step="1"
            onChange={e => setWeather(e.target.value)}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--gray)', marginBottom: '14px' }}>
            <span>Cold ↓</span>
            <b>{weather}%</b>
            <span>Hot ↑</span>
          </div>

          <label className="lbl">Market Trend Boost</label>
          <input
            type="range"
            min="-20"
            max="40"
            value={trend}
            step="1"
            onChange={e => setTrend(e.target.value)}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--gray)', marginBottom: '14px' }}>
            <span>Declining</span>
            <b>{trend}%</b>
            <span>Trending ↑</span>
          </div>

          <label className="lbl">Holiday / Event Uplift</label>
          <input
            type="range"
            min="0"
            max="50"
            value={holiday}
            step="1"
            onChange={e => setHoliday(e.target.value)}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--gray)' }}>
            <span>None</span>
            <b>{holiday}%</b>
            <span>Major event +50%</span>
          </div>
        </div>
      </div>

      {simResult && (
        <div className="card" style={{ display: 'block' }}>
          <div className="card-hdr">🤖 AI Simulation Result</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(135px, 1fr))', gap: '11px', marginBottom: '13px' }}>
            <KPICard label="Adjusted Demand" value={simResult.adj} subtitle="units/week" colorClass="c-blue" />
            <KPICard
              label="Days to Stockout"
              value={simResult.days}
              subtitle={simResult.risk}
              colorClass={simResult.days < 3 ? 'c-red' : simResult.days < 10 ? 'c-amber' : 'c-green'}
            />
            <KPICard label="Reorder Qty" value={simResult.reorder} subtitle="units needed" colorClass="c-amber" />
            <KPICard label="Est. PO Value" value={`$${simResult.cost.toLocaleString()}`} subtitle={`at $${simResult.sku.price}/unit`} colorClass="c-blue" />
          </div>

          <AlertItem
            type={simResult.riskCls}
            icon="🤖"
            message={`AI Recommendation — ${simResult.sku.name} (${simResult.sku.sku})`}
            subtitle={`Base: ${simResult.base} units × Promo ${promo}× Season ${season}× Weather ${(1 + parseFloat(weather) / 100).toFixed(2)}× Trend ${(1 + parseFloat(trend) / 100).toFixed(2)}× Holiday ${(1 + parseFloat(holiday) / 100).toFixed(2)} = ${simResult.adj} units/week. ${
              simResult.currentStock === 0
                ? 'Stock is at ZERO — immediate reorder required.'
                : `Stock of ${simResult.currentStock} units covers ${simResult.days} days.`
            } ${simResult.reorder > 0 ? `Place a PO for ${simResult.reorder} units (est. cost: $${simResult.cost.toLocaleString()}).` : ''}`}
          />

          <div style={{ position: 'relative', height: '175px', marginTop: '15px' }}>
            <canvas id="c-sim" role="img" aria-label="Base vs adjusted demand bar chart">
              Simulation chart.
            </canvas>
          </div>
        </div>
      )}

      <div className="card" style={{ marginTop: simResult ? 0 : '15px' }}>
        <div className="card-hdr">📥 Paste CSV Sales Data</div>
        <p style={{ fontSize: '12px', color: 'var(--gray)', marginBottom: '8px' }}>
          Format: <code style={{ background: '#f1f5f9', padding: '1px 5px', borderRadius: '4px', fontSize: '11px' }}>date, sku, units_sold, price</code> — one row per line
        </p>
        <textarea
          value={csvData}
          onChange={e => setCsvData(e.target.value)}
          style={{ height: '88px', fontFamily: 'monospace', fontSize: '12px', resize: 'vertical' }}
          placeholder="2026-06-01, SKU-001, 45, 89&#10;2026-06-02, SKU-004, 22, 59&#10;2026-06-03, SKU-007, 9, 199"
        />
        <div style={{ display: 'flex', gap: '10px', marginTop: '9px', alignItems: 'center', flexWrap: 'wrap' }}>
          <button className="btn btn-green" onClick={processCSV}>
            📊 Process CSV
          </button>
          {csvResult && (
            <div style={{ fontSize: '12px', color: csvResult.valid > 0 ? 'var(--green)' : 'var(--red)' }}>
              {csvResult.valid > 0 ? `✅ ${csvResult.valid} row${csvResult.valid > 1 ? 's' : ''} ingested` : '✗ No valid rows found'}
              {csvResult.errors.length > 0 && (
                <div style={{ fontSize: '11px', color: 'var(--amber)', marginTop: '5px' }}>
                  ⚠ Skipped: {csvResult.errors.slice(0, 3).join(' · ')}
                  {csvResult.errors.length > 3 ? ` + ${csvResult.errors.length - 3} more` : ''}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
