import React, { useState, useEffect, useRef } from 'react';
import * as d3 from 'd3';
import {
  TrendingUp,
  Wallet,
  Bike,
  Star,
  Calendar,
  CheckCircle2,
  Clock,
  Zap,
  Filter,
} from 'lucide-react';

export interface MonthlyDataPoint {
  monthKey: string;
  monthLabel: string;
  fullMonth: string;
  completedTrips: number;
  totalEarnings: number;
  averageRating: number;
  shiftHours: number;
  bonusEarnings: number;
}

const MONTHLY_PERFORMANCE_DATA: MonthlyDataPoint[] = [
  {
    monthKey: '2026-05',
    monthLabel: 'Mayıs',
    fullMonth: 'Mayıs 2026',
    completedTrips: 142,
    totalEarnings: 24650,
    averageRating: 4.88,
    shiftHours: 156,
    bonusEarnings: 1850,
  },
  {
    monthKey: '2026-06',
    monthLabel: 'Haziran',
    fullMonth: 'Haziran 2026',
    completedTrips: 184,
    totalEarnings: 32180,
    averageRating: 4.91,
    shiftHours: 178,
    bonusEarnings: 2400,
  },
  {
    monthKey: '2026-07',
    monthLabel: 'Temmuz',
    fullMonth: 'Temmuz 2026',
    completedTrips: 226,
    totalEarnings: 39820,
    averageRating: 4.93,
    shiftHours: 195,
    bonusEarnings: 3100,
  },
  {
    monthKey: '2026-08',
    monthLabel: 'Ağustos',
    fullMonth: 'Ağustos 2026',
    completedTrips: 254,
    totalEarnings: 45600,
    averageRating: 4.95,
    shiftHours: 210,
    bonusEarnings: 3800,
  },
  {
    monthKey: '2026-09',
    monthLabel: 'Eylül',
    fullMonth: 'Eylül 2026',
    completedTrips: 278,
    totalEarnings: 51240,
    averageRating: 4.97,
    shiftHours: 218,
    bonusEarnings: 4250,
  },
  {
    monthKey: '2026-10',
    monthLabel: 'Ekim',
    fullMonth: 'Ekim 2026 (Mevcut Ay)',
    completedTrips: 304,
    totalEarnings: 56980,
    averageRating: 4.98,
    shiftHours: 226,
    bonusEarnings: 4900,
  },
];

export const PerformanceSummary: React.FC = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const svgRef = useRef<SVGSVGElement | null>(null);

  // Active stream toggles for the three requested data streams
  const [showEarnings, setShowEarnings] = useState(true);
  const [showTrips, setShowTrips] = useState(true);
  const [showRating, setShowRating] = useState(true);

  const [selectedMonth, setSelectedMonth] = useState<MonthlyDataPoint>(
    MONTHLY_PERFORMANCE_DATA[MONTHLY_PERFORMANCE_DATA.length - 1]
  );
  const [hoveredData, setHoveredData] = useState<MonthlyDataPoint | null>(null);

  // D3 Rendering
  useEffect(() => {
    if (!svgRef.current || !containerRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const containerWidth = containerRef.current.clientWidth || 340;
    const width = containerWidth;
    const height = 230;
    const margin = { top: 28, right: 40, bottom: 36, left: 48 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    svg.attr('viewBox', `0 0 ${width} ${height}`);

    const g = svg
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Define gradients for areas
    const defs = svg.append('defs');

    // Total Earnings Gradient (Monochrome White)
    const earningsGrad = defs
      .append('linearGradient')
      .attr('id', 'ps-earnings-gradient')
      .attr('x1', '0%')
      .attr('y1', '0%')
      .attr('x2', '0%')
      .attr('y2', '100%');
    earningsGrad
      .append('stop')
      .attr('offset', '0%')
      .attr('stop-color', '#ffffff')
      .attr('stop-opacity', 0.25);
    earningsGrad
      .append('stop')
      .attr('offset', '100%')
      .attr('stop-color', '#ffffff')
      .attr('stop-opacity', 0.0);

    // Completed Trips Gradient (Zinc / Silver)
    const tripsGrad = defs
      .append('linearGradient')
      .attr('id', 'ps-trips-gradient')
      .attr('x1', '0%')
      .attr('y1', '0%')
      .attr('x2', '0%')
      .attr('y2', '100%');
    tripsGrad
      .append('stop')
      .attr('offset', '0%')
      .attr('stop-color', '#a1a1aa')
      .attr('stop-opacity', 0.2);
    tripsGrad
      .append('stop')
      .attr('offset', '100%')
      .attr('stop-color', '#a1a1aa')
      .attr('stop-opacity', 0.0);

    // Scales
    const xScale = d3
      .scalePoint<string>()
      .domain(MONTHLY_PERFORMANCE_DATA.map((d) => d.monthLabel))
      .range([0, innerWidth])
      .padding(0.35);

    // Left Y-axis: Total Earnings (0 to max + 15%)
    const maxEarnings = d3.max(MONTHLY_PERFORMANCE_DATA, (d) => d.totalEarnings) || 60000;
    const yScaleEarnings = d3
      .scaleLinear()
      .domain([0, maxEarnings * 1.15])
      .range([innerHeight, 0]);

    // Right Y-axis: Completed Trips (0 to max + 15%)
    const maxTrips = d3.max(MONTHLY_PERFORMANCE_DATA, (d) => d.completedTrips) || 350;
    const yScaleTrips = d3
      .scaleLinear()
      .domain([0, maxTrips * 1.2])
      .range([innerHeight, 0]);

    // Overlay Y-scale: Average Rating (4.70 to 5.00)
    const yScaleRating = d3
      .scaleLinear()
      .domain([4.75, 5.02])
      .range([innerHeight, 0]);

    // Grid Lines (Horizontal)
    const yTicks = [0.25, 0.5, 0.75, 1];
    yTicks.forEach((ratio) => {
      const yPos = innerHeight * (1 - ratio);
      g.append('line')
        .attr('x1', 0)
        .attr('x2', innerWidth)
        .attr('y1', yPos)
        .attr('y2', yPos)
        .attr('stroke', '#1E293B')
        .attr('stroke-width', 1)
        .attr('stroke-dasharray', '3,3');
    });

    // 1. DATA STREAM: TOTAL EARNINGS (Area & Line)
    if (showEarnings) {
      const areaEarnings = d3
        .area<MonthlyDataPoint>()
        .x((d) => xScale(d.monthLabel) || 0)
        .y0(innerHeight)
        .y1((d) => yScaleEarnings(d.totalEarnings))
        .curve(d3.curveMonotoneX);

      const lineEarnings = d3
        .line<MonthlyDataPoint>()
        .x((d) => xScale(d.monthLabel) || 0)
        .y((d) => yScaleEarnings(d.totalEarnings))
        .curve(d3.curveMonotoneX);

      g.append('path')
        .datum(MONTHLY_PERFORMANCE_DATA)
        .attr('fill', 'url(#ps-earnings-gradient)')
        .attr('d', areaEarnings);

      g.append('path')
        .datum(MONTHLY_PERFORMANCE_DATA)
        .attr('fill', 'none')
        .attr('stroke', '#ffffff')
        .attr('stroke-width', 2.5)
        .attr('d', lineEarnings);

      MONTHLY_PERFORMANCE_DATA.forEach((d) => {
        const cx = xScale(d.monthLabel) || 0;
        const cy = yScaleEarnings(d.totalEarnings);
        const isSelected = selectedMonth.monthKey === d.monthKey;

        g.append('circle')
          .attr('cx', cx)
          .attr('cy', cy)
          .attr('r', isSelected ? 5.5 : 4)
          .attr('fill', '#ffffff')
          .attr('stroke', '#000000')
          .attr('stroke-width', 2);
      });
    }

    // 2. DATA STREAM: COMPLETED TRIPS (Line & Area if isolated)
    if (showTrips) {
      const lineTrips = d3
        .line<MonthlyDataPoint>()
        .x((d) => xScale(d.monthLabel) || 0)
        .y((d) => yScaleTrips(d.completedTrips))
        .curve(d3.curveMonotoneX);

      if (!showEarnings) {
        const areaTrips = d3
          .area<MonthlyDataPoint>()
          .x((d) => xScale(d.monthLabel) || 0)
          .y0(innerHeight)
          .y1((d) => yScaleTrips(d.completedTrips))
          .curve(d3.curveMonotoneX);

        g.append('path')
          .datum(MONTHLY_PERFORMANCE_DATA)
          .attr('fill', 'url(#ps-trips-gradient)')
          .attr('d', areaTrips);
      }

      g.append('path')
        .datum(MONTHLY_PERFORMANCE_DATA)
        .attr('fill', 'none')
        .attr('stroke', '#a1a1aa')
        .attr('stroke-width', 2.2)
        .attr('stroke-dasharray', showEarnings ? '5,3' : 'none')
        .attr('d', lineTrips);

      MONTHLY_PERFORMANCE_DATA.forEach((d) => {
        const cx = xScale(d.monthLabel) || 0;
        const cy = yScaleTrips(d.completedTrips);
        const isSelected = selectedMonth.monthKey === d.monthKey;

        g.append('circle')
          .attr('cx', cx)
          .attr('cy', cy)
          .attr('r', isSelected ? 5 : 3.5)
          .attr('fill', '#a1a1aa')
          .attr('stroke', '#000000')
          .attr('stroke-width', 1.5);
      });
    }

    // 3. DATA STREAM: AVERAGE RATING (Curve & Silver Points)
    if (showRating) {
      const lineRating = d3
        .line<MonthlyDataPoint>()
        .x((d) => xScale(d.monthLabel) || 0)
        .y((d) => yScaleRating(d.averageRating))
        .curve(d3.curveMonotoneX);

      g.append('path')
        .datum(MONTHLY_PERFORMANCE_DATA)
        .attr('fill', 'none')
        .attr('stroke', '#d4d4d8')
        .attr('stroke-width', 2)
        .attr('stroke-dasharray', '2,3')
        .attr('d', lineRating);

      MONTHLY_PERFORMANCE_DATA.forEach((d) => {
        const cx = xScale(d.monthLabel) || 0;
        const cy = yScaleRating(d.averageRating);
        const isSelected = selectedMonth.monthKey === d.monthKey;

        g.append('circle')
          .attr('cx', cx)
          .attr('cy', cy)
          .attr('r', isSelected ? 5 : 3.5)
          .attr('fill', '#e4e4e7')
          .attr('stroke', '#000000')
          .attr('stroke-width', 1.5);
      });
    }

    // X-Axis Month Labels
    MONTHLY_PERFORMANCE_DATA.forEach((d) => {
      const cx = xScale(d.monthLabel) || 0;
      const isSelected = selectedMonth.monthKey === d.monthKey;

      g.append('text')
        .attr('x', cx)
        .attr('y', innerHeight + 18)
        .attr('text-anchor', 'middle')
        .attr('fill', isSelected ? '#ffffff' : '#71717a')
        .attr('font-size', '10px')
        .attr('font-family', 'ui-monospace, monospace')
        .attr('font-weight', isSelected ? '700' : '500')
        .text(d.monthLabel);
    });

    // Left Y-Axis Label (Total Earnings)
    g.append('text')
      .attr('x', -8)
      .attr('y', -10)
      .attr('text-anchor', 'start')
      .attr('fill', '#ffffff')
      .attr('font-size', '9px')
      .attr('font-family', 'ui-monospace, monospace')
      .attr('font-weight', '700')
      .text('₺ Kazanç');

    // Right Y-Axis Label (Completed Trips / Rating)
    g.append('text')
      .attr('x', innerWidth + 8)
      .attr('y', -10)
      .attr('text-anchor', 'end')
      .attr('fill', '#a1a1aa')
      .attr('font-size', '9px')
      .attr('font-family', 'ui-monospace, monospace')
      .attr('font-weight', '700')
      .text('Sefer · ★ Puan');

    // Interactive Hover & Click Columns
    MONTHLY_PERFORMANCE_DATA.forEach((d) => {
      const cx = xScale(d.monthLabel) || 0;
      const colWidth = innerWidth / MONTHLY_PERFORMANCE_DATA.length;

      const overlay = g
        .append('rect')
        .attr('x', cx - colWidth / 2)
        .attr('y', 0)
        .attr('width', colWidth)
        .attr('height', innerHeight)
        .attr('fill', 'transparent')
        .attr('cursor', 'pointer');

      overlay
        .on('mouseenter', () => setHoveredData(d))
        .on('mouseleave', () => setHoveredData(null))
        .on('click', () => setSelectedMonth(d));
    });
  }, [showEarnings, showTrips, showRating, selectedMonth]);

  // Aggregate numbers
  const totalEarningsAll = MONTHLY_PERFORMANCE_DATA.reduce(
    (sum, d) => sum + d.totalEarnings,
    0
  );
  const totalTripsAll = MONTHLY_PERFORMANCE_DATA.reduce(
    (sum, d) => sum + d.completedTrips,
    0
  );
  const latestRating =
    MONTHLY_PERFORMANCE_DATA[MONTHLY_PERFORMANCE_DATA.length - 1].averageRating;

  return (
    <div className="space-y-4 select-none">
      {/* Header - Luxury Monochrome */}
      <div className="space-y-1">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-mono font-bold text-white uppercase tracking-widest flex items-center gap-1.5">
            <TrendingUp className="w-3.5 h-3.5 text-white" />
            <span>PERFORMANS VE TREND ANALİZİ</span>
          </span>
          <span className="text-[9px] font-mono text-zinc-300 bg-zinc-900 px-2 py-0.5 rounded-full border border-zinc-700 font-bold">
            D3.JS ÇİZİMİ
          </span>
        </div>
        <h2 className="text-lg font-black font-display text-white">
          Aylık Performans Özeti
        </h2>
        <p className="text-zinc-400 text-[11px] leading-relaxed">
          Statik liste yerine; tamamlanan seferlerinizi, toplam kazancınızı ve ortalama puanınızı etkileşimli D3.js trend grafiğinde inceleyin.
        </p>
      </div>

      {/* 3 Requested Data Stream Toggle Buttons */}
      <div className="flex items-center gap-1.5 p-1 bg-zinc-950 rounded-2xl border border-zinc-800 text-[11px] flex-wrap">
        <button
          type="button"
          onClick={() => setShowEarnings(!showEarnings)}
          className={`px-3 py-1.5 rounded-xl font-bold transition-all flex items-center gap-1.5 ${
            showEarnings
              ? 'bg-white text-black shadow-md'
              : 'bg-black text-zinc-400 hover:text-white border border-zinc-800'
          }`}
        >
          <Wallet className="w-3.5 h-3.5" />
          <span>Total Earnings</span>
        </button>

        <button
          type="button"
          onClick={() => setShowTrips(!showTrips)}
          className={`px-3 py-1.5 rounded-xl font-bold transition-all flex items-center gap-1.5 ${
            showTrips
              ? 'bg-white text-black shadow-md'
              : 'bg-black text-zinc-400 hover:text-white border border-zinc-800'
          }`}
        >
          <Bike className="w-3.5 h-3.5" />
          <span>Completed Trips</span>
        </button>

        <button
          type="button"
          onClick={() => setShowRating(!showRating)}
          className={`px-3 py-1.5 rounded-xl font-bold transition-all flex items-center gap-1.5 ${
            showRating
              ? 'bg-white text-black shadow-md'
              : 'bg-black text-zinc-400 hover:text-white border border-zinc-800'
          }`}
        >
          <Star className="w-3.5 h-3.5 fill-current" />
          <span>Average Rating</span>
        </button>
      </div>

      {/* D3.js Chart Canvas Card */}
      <div
        ref={containerRef}
        className="p-3.5 bg-zinc-950 border border-zinc-800 rounded-3xl space-y-2 shadow-2xl relative overflow-hidden"
      >
        {/* Floating Tooltip / Active Point Indicator */}
        <div className="flex items-center justify-between text-[11px] border-b border-zinc-850 pb-2">
          <div className="flex items-center gap-2">
            <span className="font-bold text-white">
              {hoveredData ? hoveredData.fullMonth : selectedMonth.fullMonth}
            </span>
            <span className="text-[10px] text-zinc-400">
              {hoveredData ? '(Önizleme)' : '(Seçili Ay)'}
            </span>
          </div>

          <div className="flex items-center gap-2 font-mono text-[10px]">
            <span className="text-white font-bold">
              {(hoveredData || selectedMonth).totalEarnings.toLocaleString('tr-TR')} ₺
            </span>
            <span className="text-zinc-600">|</span>
            <span className="text-zinc-300 font-bold">
              {(hoveredData || selectedMonth).completedTrips} Sefer
            </span>
            <span className="text-zinc-600">|</span>
            <span className="text-white font-bold">
              ★ {(hoveredData || selectedMonth).averageRating}
            </span>
          </div>
        </div>

        {/* The SVG element rendered by D3 */}
        <div className="w-full relative">
          <svg
            ref={svgRef}
            className="w-full h-56 select-none cursor-pointer"
          />
        </div>

        {/* Legend */}
        <div className="flex items-center justify-between text-[10px] text-zinc-400 pt-1 border-t border-zinc-850">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 text-white font-medium">
              <span className="w-2.5 h-2.5 rounded-full bg-white" />
              <span>Total Earnings (₺)</span>
            </span>
            <span className="flex items-center gap-1.5 text-zinc-300 font-medium">
              <span className="w-2.5 h-2.5 rounded-full bg-zinc-400" />
              <span>Completed Trips</span>
            </span>
            <span className="flex items-center gap-1.5 text-zinc-400 font-medium">
              <span className="w-2.5 h-2.5 rounded-full bg-zinc-600" />
              <span>Average Rating (★)</span>
            </span>
          </div>

          <span className="text-[9px] text-zinc-500 font-mono">
            Aya dokunun
          </span>
        </div>
      </div>

      {/* Selected Month Deep-Dive Breakdown (Replaces static list) */}
      <div className="p-3.5 bg-zinc-950 border border-zinc-800 rounded-3xl space-y-3 shadow-xl">
        <div className="flex items-center justify-between border-b border-zinc-850 pb-2">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-white" />
            <h4 className="font-bold text-white text-xs">
              {selectedMonth.fullMonth} — Hakediş ve Vardiya Dökümü
            </h4>
          </div>
          <span className="text-[10px] font-mono text-zinc-200 font-bold bg-zinc-900 px-2 py-0.5 rounded-lg border border-zinc-700">
            {selectedMonth.monthLabel} Raporu
          </span>
        </div>

        {/* 3 Metric Stream Cards for Selected Month */}
        <div className="grid grid-cols-3 gap-2 text-center">
          {/* Stream 1: Total Earnings */}
          <div className="p-2.5 bg-black rounded-2xl border border-zinc-850 space-y-1">
            <span className="text-[10px] text-zinc-400 block font-semibold">
              Total Earnings
            </span>
            <div className="text-base font-black font-mono text-white">
              {selectedMonth.totalEarnings.toLocaleString('tr-TR')} ₺
            </div>
            <span className="text-[9px] text-zinc-400 font-mono block">
              +{selectedMonth.bonusEarnings} ₺ Prim dâhil
            </span>
          </div>

          {/* Stream 2: Completed Trips */}
          <div className="p-2.5 bg-black rounded-2xl border border-zinc-850 space-y-1">
            <span className="text-[10px] text-zinc-400 block font-semibold">
              Completed Trips
            </span>
            <div className="text-base font-black font-mono text-white">
              {selectedMonth.completedTrips} Sefer
            </div>
            <span className="text-[9px] text-zinc-400 font-mono block">
              {Math.round(selectedMonth.totalEarnings / selectedMonth.completedTrips)} ₺/sefer
            </span>
          </div>

          {/* Stream 3: Average Rating */}
          <div className="p-2.5 bg-black rounded-2xl border border-zinc-850 space-y-1">
            <span className="text-[10px] text-zinc-400 block font-semibold">
              Average Rating
            </span>
            <div className="text-base font-black font-mono text-white">
              {selectedMonth.averageRating} ★
            </div>
            <span className="text-[9px] text-zinc-400 font-mono block">
              %99.6 Memnuniyet
            </span>
          </div>
        </div>

        {/* Shift Details */}
        <div className="p-3 bg-black rounded-2xl border border-zinc-850 flex items-center justify-between text-xs text-zinc-300">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-zinc-400" />
            <span>
              Aktif Vardiya Süresi: <strong className="text-white">{selectedMonth.shiftHours} Saat</strong>
            </span>
          </div>
          <span className="text-zinc-400 font-mono text-[11px]">
            Ort. {Math.round(selectedMonth.totalEarnings / selectedMonth.shiftHours)} ₺ / saat
          </span>
        </div>

        {/* Milestone Recognition */}
        <div className="p-2.5 bg-zinc-900 border border-zinc-750 rounded-2xl flex items-center justify-between text-[11px] text-zinc-200">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-white shrink-0" />
            <span>
              {selectedMonth.monthLabel} ayında <strong>300+ sefer barajı</strong> aşıldı! Hakedişiniz banka hesabına transfer edilmeye hazırdır.
            </span>
          </div>
          <span className="font-mono text-xs font-bold shrink-0 ml-2 text-white">✓ ONAYLI</span>
        </div>
      </div>
    </div>
  );
};
