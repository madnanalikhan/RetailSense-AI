export type SKUStatus = 'low' | 'over' | 'ok';

export interface SKU {
  sku: string;
  name: string;
  cat: string;
  stock: number;
  demand: number;
  price: number;
  status: SKUStatus;
}

export interface AlertConfig {
  type: 'danger' | 'warning' | 'info' | 'success';
  icon: string;
  message: string;
  subtitle: string;
}

export interface RecommendationItem {
  type: 'urgent' | 'warn' | 'ok';
  icon: string;
  title: string;
  body: string;
}

export const SKUS: SKU[] = [
  { sku: 'SKU-001', name: 'Running Shoes', cat: 'Footwear', stock: 42, demand: 80, price: 89, status: 'low' },
  { sku: 'SKU-002', name: 'Winter Jacket', cat: 'Apparel', stock: 210, demand: 60, price: 149, status: 'over' },
  { sku: 'SKU-003', name: 'Yoga Mat', cat: 'Sports', stock: 95, demand: 90, price: 35, status: 'ok' },
  { sku: 'SKU-004', name: 'Earbuds', cat: 'Electronics', stock: 18, demand: 120, price: 59, status: 'low' },
  { sku: 'SKU-005', name: 'Coffee Maker', cat: 'Appliances', stock: 300, demand: 40, price: 119, status: 'over' },
  { sku: 'SKU-006', name: 'Protein Powder', cat: 'Nutrition', stock: 65, demand: 70, price: 45, status: 'ok' },
  { sku: 'SKU-007', name: 'Smart Watch', cat: 'Electronics', stock: 12, demand: 95, price: 199, status: 'low' },
  { sku: 'SKU-008', name: 'Desk Lamp', cat: 'Home', stock: 88, demand: 55, price: 29, status: 'ok' },
];

export const STATUS = {
  low: { lbl: 'Low Stock', cls: 'red' },
  over: { lbl: 'Overstocked', cls: 'amber' },
  ok: { lbl: 'Optimal', cls: 'green' },
};

export const WEEKS = ['W1', 'W2', 'W3', 'W4', 'W5', 'W6', 'W7', 'W8'];
export const ACTUAL_ALL = [320, 410, 375, 490];
export const FORECAST_ALL = [310, 390, 380, 470, 520, 545, 510, 560];

export const DASHBOARD_ALERTS: AlertConfig[] = [
  {
    type: 'danger',
    icon: '🚨',
    message: 'SKU-007 Smart Watch — Critical stockout risk',
    subtitle: '12 units · Demand 95/wk · Stockout in <1 day',
  },
  {
    type: 'danger',
    icon: '📦',
    message: 'SKU-001 Running Shoes — Low stock warning',
    subtitle: '42 units · Demand 80/wk · ~3.7 days coverage',
  },
  {
    type: 'warning',
    icon: '⚠️',
    message: 'SKU-004 Earbuds — Below reorder threshold',
    subtitle: '18 units · Demand 120/wk · Reorder needed',
  },
  {
    type: 'info',
    icon: '📊',
    message: 'SKU-002 Winter Jacket — Overstocked by 150 units',
    subtitle: 'Promote or reduce next PO by 50%',
  },
  {
    type: 'info',
    icon: '☕',
    message: 'SKU-005 Coffee Maker — 7.5 weeks excess',
    subtitle: 'Reduce next order by 40%',
  },
];

export const RECOMMENDATIONS: RecommendationItem[] = [
  {
    type: 'urgent',
    icon: '🚨',
    title: 'Immediate Reorder: Smart Watch (SKU-007)',
    body: 'Only 12 units remaining against demand of 95/week — stockout in under 1 day. Reorder 368 units now. AI confidence: 94%. Est. PO: $73,232.',
  },
  {
    type: 'urgent',
    icon: '🎧',
    title: 'Critical Reorder: Earbuds (SKU-004)',
    body: 'Only 18 units left, demand 120/week. Reorder 462 units. AI detects a rising trend (+15%) — increase PO size accordingly. Est. cost: $27,258.',
  },
  {
    type: 'urgent',
    icon: '👟',
    title: 'Reorder Alert: Running Shoes (SKU-001)',
    body: '42 units, demand 80/week = 3.7 days coverage. Reorder 278 units. Q3 seasonal spike typically adds +22% — factor into your PO.',
  },
  {
    type: 'warn',
    icon: '🧥',
    title: 'Overstock: Winter Jacket (SKU-002)',
    body: '210 units vs 60/week = 3.5 weeks excess. Run a 15% promo to accelerate sell-through. Reduce next PO by 50 units.',
  },
  {
    type: 'warn',
    icon: '☕',
    title: 'Overstock: Coffee Maker (SKU-005)',
    body: '300 units vs 40/week = 7.5 weeks excess. Holding costs rising. Reduce next order by 40%. Consider bundle pricing.',
  },
  {
    type: 'ok',
    icon: '✅',
    title: 'Optimal: Yoga Mat, Protein Powder, Desk Lamp',
    body: 'SKU-003, SKU-006, SKU-008 are within the optimal band. Maintain current reorder cadence. Stable demand forecast for next 6 weeks.',
  },
];
