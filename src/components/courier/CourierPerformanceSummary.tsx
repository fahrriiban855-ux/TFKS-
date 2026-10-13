import React, { useState, useEffect, useRef } from 'react';
import * as d3 from 'd3';
import {
  TrendingUp,
  Award,
  Wallet,
  Bike,
  Star,
  Calendar,
  Sparkles,
  ChevronRight,
  Info,
  CheckCircle2,
  Handshake,
} from 'lucide-react';

export interface MonthlyPerformanceRecord {
  monthKey: string;
  monthLabel: string;
  fullMonth: string;
  trips: number;
  earnings: number;
  rating: number;
  hoursOnline: number;
  bargainTrips: number;
  avgFarePerTrip: number;
}

const MONTHLY_DATA: MonthlyPerformanceRecord[] = [
  {
    monthKey: '2026-05',
    monthLabel: 'Mayıs',
    fullMonth: 'Mayıs 2026',
    trips: 142,
    earnings: 24650,
    rating: 4.88,
    hoursOnline: 156,
    bargainTrips: 28,
    avgFarePerTrip: 173.5,
  },
  {
    monthKey: '2026-06',
    monthLabel: 'Haz',
    fullMonth: 'Haziran 2026',
    trips: 184,
    earnings: 32180,
    rating: 4.91,
    hoursOnline: 178,
    bargainTrips: 42,
    avgFarePerTrip: 174.8,
  },
  {
    monthKey: '2026-07',
    monthLabel: 'Tem',
    fullMonth: 'Temmuz 2026',
    trips: 226,
    earnings: 39820,
    rating: 4.93,
    hoursOnline: 195,
    bargainTrips: 58,
    avgFarePerTrip: 176.2,
  },
  {
    monthKey: '2026-08',
    monthLabel: 'Ağu',
    fullMonth: 'Ağustos 2026',
    trips: 254,
    earnings: 45600,
    rating: 4.95,
    hoursOnline: 210,
    bargainTrips: 69,
    avgFarePerTrip: 179.5,
  },
  {
    monthKey: '2026-09',
    monthLabel: 'Eyl',
    fullMonth: 'Eylül 2026',
    trips: 278,
    earnings: 51240,
    rating: 4.97,
    hoursOnline: 218,
    bargainTrips: 84,
    avgFarePerTrip: 184.3,
  },
  {
    monthKey: '2026-10',
    monthLabel: 'Eki',
    fullMonth: 'Ekim 2026 (Güncel)',
    trips: 304,
    earnings: 56980,
    rating: 4.98,
    hoursOnline: 226,
    bargainTrips: 98,
    avgFarePerTrip: 187.4,
  },
];

type MetricType = 'all' | 'earnings' | 'trips' | 'rating';

export const CourierPerformanceSummary: React.FC = () => {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const [activeMetric, setActiveMetric] = useState<MetricType>('earnings');
  const [selectedMonth, setSelectedMonth] = useState<MonthlyPerformanceRecord>(
    MONTHLY_DATA[MONTHLY_DATA.length - 1]
  );
  const [hoveredData, setHoveredData] = useState<MonthlyPerformanceRecord | null>(null);
  const [timeRange, setTimeRange] = useState<'6m' | '3m'>('6m');

  const filteredData =
    timeRange === '3m' ? MONTHLY_DATA.slice(-3) : MONTHLY_DATA;

  // D3 Rendering Hook
  useEffect(() => {
    if (!svgRef.current || !containerRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const containerWidth = containerRef.current.clientWidth || 340;
    const width = containerWidth;
    const height = 210;
    const margin = { top: 24, right: 32, bottom: 32, left: 42 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    svg.attr('viewBox', `0 0 ${width} ${height}`);

    const g = svg
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Define Gradients
    const defs = svg.append('defs');

    // Earnings Gradient - Monochrome Pure White Glow
    const earningsGrad = defs
      .append('linearGradient')
      .attr('id', 'd3-earnings-grad')
      .attr('x1', '0%')
      .attr('y1', '0%')
      .attr('x2', '0%')
      .attr('y2', '100%');
    earningsGrad
      .append('stop')
      .attr('offset', '0%')
      .attr('stop-color', '#ffffff')
      .attr('stop-opacity', 0.28);
    earningsGrad
      .append('stop')
      .attr('offset', '100%')
      .attr('stop-color', '#ffffff')
      .attr('stop-opacity', 0.0);

    // Trips Gradient - Subtle Zinc
    const tripsGrad = defs
      .append('linearGradient')
      .attr('id', 'd3-trips-grad')
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

    // X Scale
    const xScale = d3
      .scalePoint<string>()
      .domain(filteredData.map((d) => d.monthLabel))
      .range([0, innerWidth])
      .padding(0.3);

    // Y Scales
    const maxEarnings = d3.max(filteredData, (d) => d.earnings) || 60000;
    const maxTrips = d3.max(filteredData, (d) => d.trips) || 350;

    const yScaleEarnings = d3
      .scaleLinear()
      .domain([0, maxEarnings * 1.15])
      .range([innerHeight, 0]);

    const yScaleTrips = d3
      .scaleLinear()
      .domain([0, maxTrips * 1.2])
      .range([innerHeight, 0]);

    const yScaleRating = d3
      .scaleLinear()
      .domain([4.7, 5.0])
      .range([innerHeight, 0]);

    // Background Grid lines
    const yGridTicks = [0.25, 0.5, 0.75, 1];
    yGridTicks.forEach((ratio) => {
      const yPos = innerHeight * (1 - ratio);
      g.append('line')
        .attr('x1', 0)
        .attr('x2', innerWidth)
        .attr('y1', yPos)
        .attr('y2', yPos)
        .attr('stroke', '#27272a')
        .attr('stroke-width', 1)
        .attr('stroke-dasharray', '3,3');
    });

    // 1. EARNINGS AREA & LINE - Pure White
    if (activeMetric === 'earnings' || activeMetric === 'all') {
      const areaEarnings = d3
        .area<MonthlyPerformanceRecord>()
        .x((d) => xScale(d.monthLabel) || 0)
        .y0(innerHeight)
        .y1((d) => yScaleEarnings(d.earnings))
        .curve(d3.curveMonotoneX);

      const lineEarnings = d3
        .line<MonthlyPerformanceRecord>()
        .x((d) => xScale(d.monthLabel) || 0)
        .y((d) => yScaleEarnings(d.earnings))
        .curve(d3.curveMonotoneX);

      g.append('path')
        .datum(filteredData)
        .attr('fill', 'url(#d3-earnings-grad)')
        .attr('d', areaEarnings);

      g.append('path')
        .datum(filteredData)
        .attr('fill', 'none')
        .attr('stroke', '#ffffff')
        .attr('stroke-width', 2.5)
        .attr('d', lineEarnings);

      // Dots
      filteredData.forEach((d) => {
        const cx = xScale(d.monthLabel) || 0;
        const cy = yScaleEarnings(d.earnings);
        const isSelected = selectedMonth.monthKey === d.monthKey;

        g.append('circle')
          .attr('cx', cx)
          .attr('cy', cy)
          .attr('r', isSelected ? 5.5 : 4)
          .attr('fill', isSelected ? '#ffffff' : '#d4d4d8')
          .attr('stroke', '#000000')
          .attr('stroke-width', 2);
      });
    }

    // 2. TRIPS LINE - Zinc-400
    if (activeMetric === 'trips' || activeMetric === 'all') {
      const lineTrips = d3
        .line<MonthlyPerformanceRecord>()
        .x((d) => xScale(d.monthLabel) || 0)
        .y((d) => yScaleTrips(d.trips))
        .curve(d3.curveMonotoneX);

      if (activeMetric === 'trips') {
        const areaTrips = d3
          .area<MonthlyPerformanceRecord>()
          .x((d) => xScale(d.monthLabel) || 0)
          .y0(innerHeight)
          .y1((d) => yScaleTrips(d.trips))
          .curve(d3.curveMonotoneX);

        g.append('path')
          .datum(filteredData)
          .attr('fill', 'url(#d3-trips-grad)')
          .attr('d', areaTrips);
      }

      g.append('path')
        .datum(filteredData)
        .attr('fill', 'none')
        .attr('stroke', '#a1a1aa')
        .attr('stroke-width', activeMetric === 'trips' ? 2.5 : 2)
        .attr('stroke-dasharray', activeMetric === 'all' ? '4,3' : 'none')
        .attr('d', lineTrips);

      filteredData.forEach((d) => {
        const cx = xScale(d.monthLabel) || 0;
        const cy = yScaleTrips(d.trips);
        const isSelected = selectedMonth.monthKey === d.monthKey;

        g.append('circle')
          .attr('cx', cx)
          .attr('cy', cy)
          .attr('r', isSelected ? 5 : 3.5)
          .attr('fill', '#a1a1aa')
          .attr('stroke', '#18181b')
          .attr('stroke-width', 2);
      });
    }

    // 3. RATING LINE - Zinc-300
    if (activeMetric === 'rating' || activeMetric === 'all') {
      const lineRating = d3
        .line<MonthlyPerformanceRecord>()
        .x((d) => xScale(d.monthLabel) || 0)
        .y((d) => yScaleRating(d.rating))
        .curve(d3.curveMonotoneX);

      g.append('path')
        .datum(filteredData)
        .attr('fill', 'none')
        .attr('stroke', '#71717a')
        .attr('stroke-width', 2)
        .attr('d', lineRating);

      filteredData.forEach((d) => {
        const cx = xScale(d.monthLabel) || 0;
        const cy = yScaleRating(d.rating);
        const isSelected = selectedMonth.monthKey === d.monthKey;

        g.append('circle')
          .attr('cx', cx)
          .attr('cy', cy)
          .attr('r', isSelected ? 5 : 3.5)
          .attr('fill', '#71717a')
          .attr('stroke', '#09090b')
          .attr('stroke-width', 1.5);
      });
    }

    // X Axis Labels
    filteredData.forEach((d) => {
      const cx = xScale(d.monthLabel) || 0;
      const isSelected = selectedMonth.monthKey === d.monthKey;

      g.append('text')
        .attr('x', cx)
        .attr('y', innerHeight + 18)
        .attr('text-anchor', 'middle')
        .attr('fill', isSelected ? '#ffffff' : '#71717a')
        .attr('font-size', '10px')
        .attr('font-family', 'ui-monospace, SFMono-Regular, Menlo, monospace')
        .attr('font-weight', isSelected ? '700' : '500')
        .text(d.monthLabel);
    });

    // Y Axis Left (Earnings or Trips indicator)
    if (activeMetric === 'earnings' || activeMetric === 'all') {
      g.append('text')
        .attr('x', 0)
        .attr('y', -8)
        .attr('fill', '#ffffff')
        .attr('font-size', '9px')
        .attr('font-mono', 'true')
        .attr('font-weight', '700')
        .text('₺ / Ay');
    } else if (activeMetric === 'trips') {
      g.append('text')
        .attr('x', 0)
        .attr('y', -8)
        .attr('fill', '#a1a1aa')
        .attr('font-size', '9px')
        .attr('font-weight', '700')
        .text('Sefer / Ay');
    } else if (activeMetric === 'rating') {
      g.append('text')
        .attr('x', 0)
        .attr('y', -8)
        .attr('fill', '#71717a')
        .attr('font-size', '9px')
        .attr('font-weight', '700')
        .text('Puan (4.7 - 5.0)');
    }

    // Interactive Click Overlay Columns
    filteredData.forEach((d) => {
      const cx = xScale(d.monthLabel) || 0;
      const colWidth = innerWidth / filteredData.length;

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
  }, [activeMetric, selectedMonth, timeRange, filteredData]);

  // Aggregate stats
  const totalEarnings6M = MONTHLY_DATA.reduce((acc, curr) => acc + curr.earnings, 0);
  const totalTrips6M = MONTHLY_DATA.reduce((acc, curr) => acc + curr.trips, 0);
  const totalBargainTrips6M = MONTHLY_DATA.reduce((acc, curr) => acc + curr.bargainTrips, 0);
  const avgRatingCurrent = MONTHLY_DATA[MONTHLY_DATA.length - 1].rating;

  return (
    <div className="space-y-4">
      {/* Header with Title and Mode Badges - Monochrome */}
      <div className="space-y-1">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-mono font-bold text-white uppercase tracking-widest flex items-center gap-1.5">
            <TrendingUp className="w-3.5 h-3.5 text-white" />
            <span>D3.JS PERFORMANS & GELİR RADARI</span>
          </span>
          <span className="text-[9px] font-mono text-zinc-300 bg-zinc-900 px-2 py-0.5 rounded-full border border-zinc-700 font-bold">
            CANLI D3 GRAFİK
          </span>
        </div>
        <h2 className="text-lg font-black font-display text-white">Aylık Trend Özeti</h2>
        <p className="text-zinc-400 text-[11px] leading-relaxed">
          Statik sefer listesi yerine; tamamlanan seferlerinizi, net hakedişinizi, ortalama puanınızı ve pazarlıklı yolculuklarınızı aylık D3.js trend grafiğinde inceleyin.
        </p>
      </div>

      {/* KPI Top Hero Cards - Monochrome */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        <div className="p-2.5 bg-zinc-950 rounded-2xl border border-zinc-800 space-y-1">
          <span className="text-[10px] text-zinc-400 flex items-center gap-1">
            <Wallet className="w-3 h-3 text-zinc-300" />
            <span>Toplam Hakediş</span>
          </span>
          <div className="text-base font-black font-mono text-white">
            {totalEarnings6M.toLocaleString('tr-TR')} ₺
          </div>
          <span className="text-[9px] text-zinc-400 font-mono">Son 6 Ay · +18.4% ↑</span>
        </div>

        <div className="p-2.5 bg-zinc-950 rounded-2xl border border-zinc-800 space-y-1">
          <span className="text-[10px] text-zinc-400 flex items-center gap-1">
            <Bike className="w-3 h-3 text-zinc-300" />
            <span>Tamamlanan Sefer</span>
          </span>
          <div className="text-base font-black font-mono text-white">
            {totalTrips6M} İş
          </div>
          <span className="text-[9px] text-zinc-400 font-mono">Ort. 221 Sefer/Ay</span>
        </div>

        <div className="p-2.5 bg-zinc-950 rounded-2xl border border-zinc-800 space-y-1">
          <span className="text-[10px] text-zinc-400 flex items-center gap-1">
            <Star className="w-3 h-3 text-white fill-white" />
            <span>Ortalama Puan</span>
          </span>
          <div className="text-base font-black font-mono text-white">
            {avgRatingCurrent} ★
          </div>
          <span className="text-[9px] text-zinc-400 font-mono">%99.4 Olumlu Oy</span>
        </div>

        <div className="p-2.5 bg-zinc-950 rounded-2xl border border-zinc-800 space-y-1">
          <span className="text-[10px] text-zinc-400 flex items-center gap-1">
            <Handshake className="w-3 h-3 text-zinc-300" />
            <span>Sünnet Pazarlığı</span>
          </span>
          <div className="text-base font-black font-mono text-white">
            {totalBargainTrips6M} Sefer
          </div>
          <span className="text-[9px] text-zinc-400 font-mono">Gönül Almalı Seferler</span>
        </div>
      </div>

      {/* D3 Interactive Graph Container */}
      <div
        ref={containerRef}
        className="p-3.5 bg-black border border-zinc-800 rounded-3xl space-y-3 shadow-xl relative overflow-hidden"
      >
        {/* Metric Selector Buttons - Monochrome */}
        <div className="flex items-center justify-between gap-1 flex-wrap">
          <div className="flex items-center gap-1 p-1 bg-zinc-950 rounded-xl border border-zinc-850 text-[10px] font-bold">
            <button
              type="button"
              onClick={() => setActiveMetric('earnings')}
              className={`px-2.5 py-1 rounded-lg transition-all ${
                activeMetric === 'earnings'
                  ? 'bg-white text-black font-black shadow-md'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              Net Kazanç (₺)
            </button>
            <button
              type="button"
              onClick={() => setActiveMetric('trips')}
              className={`px-2.5 py-1 rounded-lg transition-all ${
                activeMetric === 'trips'
                  ? 'bg-white text-black font-black shadow-md'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              Sefer Sayısı
            </button>
            <button
              type="button"
              onClick={() => setActiveMetric('rating')}
              className={`px-2.5 py-1 rounded-lg transition-all ${
                activeMetric === 'rating'
                  ? 'bg-white text-black font-black shadow-md'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              Puan ★
            </button>
            <button
              type="button"
              onClick={() => setActiveMetric('all')}
              className={`px-2.5 py-1 rounded-lg transition-all ${
                activeMetric === 'all'
                  ? 'bg-white text-black font-black shadow-md'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              Kombine
            </button>
          </div>

          <div className="flex items-center gap-1 text-[10px] font-mono">
            <button
              type="button"
              onClick={() => setTimeRange('3m')}
              className={`px-2 py-0.5 rounded-lg border ${
                timeRange === '3m'
                  ? 'bg-zinc-800 text-white border-zinc-600 font-bold'
                  : 'text-zinc-500 border-transparent hover:text-zinc-300'
              }`}
            >
              Son 3 Ay
            </button>
            <button
              type="button"
              onClick={() => setTimeRange('6m')}
              className={`px-2 py-0.5 rounded-lg border ${
                timeRange === '6m'
                  ? 'bg-zinc-800 text-white border-zinc-600 font-bold'
                  : 'text-zinc-500 border-transparent hover:text-zinc-300'
              }`}
            >
              6 Ay
            </button>
          </div>
        </div>

        {/* The SVG Canvas for D3 */}
        <div className="relative w-full overflow-hidden">
          <svg
            ref={svgRef}
            className="w-full h-52 select-none pointer-events-auto"
          />

          {/* Hover / Active Indicator Ribbon */}
          {hoveredData && (
            <div className="absolute top-2 right-2 bg-zinc-950/95 border border-zinc-700 rounded-xl px-2.5 py-1 text-[10px] font-mono shadow-2xl pointer-events-none">
              <span className="text-white font-bold">{hoveredData.fullMonth}: </span>
              <span className="text-white font-bold">{hoveredData.earnings.toLocaleString('tr-TR')} ₺</span>
              <span className="text-zinc-400"> · {hoveredData.trips} Sefer · </span>
              <span className="text-zinc-200 font-bold">{hoveredData.rating} ★</span>
            </div>
          )}
        </div>

        {/* Legend - Monochrome */}
        <div className="flex items-center justify-between text-[10px] text-zinc-400 pt-1 border-t border-zinc-850">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 text-white">
              <span className="w-2.5 h-2.5 rounded-full bg-white shadow-sm" />
              <span>Hakediş</span>
            </span>
            <span className="flex items-center gap-1.5 text-zinc-400">
              <span className="w-2.5 h-2.5 rounded-full bg-zinc-400" />
              <span>Sefer Adedi</span>
            </span>
            <span className="flex items-center gap-1.5 text-zinc-500">
              <span className="w-2.5 h-2.5 rounded-full bg-zinc-600" />
              <span>Sürücü Skoru</span>
            </span>
          </div>
          <span className="text-[9px] text-zinc-500 font-mono">
            Aya dokunarak detayları açın
          </span>
        </div>
      </div>

      {/* Selected Month Deep-Dive Breakdown Card - Monochrome */}
      <div className="p-3.5 bg-zinc-950 border border-zinc-800 rounded-3xl space-y-3">
        <div className="flex items-center justify-between border-b border-zinc-850 pb-2">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-white" />
            <h4 className="font-bold text-white text-xs">
              {selectedMonth.fullMonth} Performans Detayı
            </h4>
          </div>
          <span className="px-2 py-0.5 bg-zinc-900 text-white border border-zinc-700 rounded-full font-mono text-[10px] font-bold">
            Seçili Dönem
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
          <div className="p-2.5 bg-black rounded-xl border border-zinc-850 space-y-0.5">
            <span className="text-[10px] text-zinc-400 block">Ay Sonu Net Hakediş</span>
            <div className="font-bold font-mono text-white text-sm">
              {selectedMonth.earnings.toLocaleString('tr-TR')} ₺
            </div>
            <span className="text-[9px] text-zinc-500 block">Banka hesabına aktarıldı</span>
          </div>

          <div className="p-2.5 bg-black rounded-xl border border-zinc-850 space-y-0.5">
            <span className="text-[10px] text-zinc-400 block">Tamamlanan Yolculuk</span>
            <div className="font-bold font-mono text-white text-sm">
              {selectedMonth.trips} Sefer
            </div>
            <span className="text-[9px] text-zinc-500 block">Ort. {selectedMonth.avgFarePerTrip} ₺/sefer</span>
          </div>

          <div className="p-2.5 bg-black rounded-xl border border-zinc-850 space-y-0.5">
            <span className="text-[10px] text-zinc-400 block">Müşteri Memnuniyeti</span>
            <div className="font-bold font-mono text-white text-sm">
              {selectedMonth.rating} ★
            </div>
            <span className="text-[9px] text-zinc-500 block">Kusursuz sürüş puanı</span>
          </div>

          <div className="p-2.5 bg-black rounded-xl border border-zinc-850 space-y-0.5">
            <span className="text-[10px] text-zinc-400 block">Sünnet Pazarlıklı İşler</span>
            <div className="font-bold font-mono text-white text-sm">
              {selectedMonth.bargainTrips} Sefer
            </div>
            <span className="text-[9px] text-zinc-400 font-semibold block">%100 Helalleşme</span>
          </div>
        </div>

        {/* Qualitative Milestone Tag */}
        <div className="p-2.5 bg-black border border-zinc-800 rounded-2xl flex items-center justify-between text-[11px] text-zinc-200">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-white" />
            <span>
              Bu ay hedeflenen 250 sefer barajını aşarak <strong>+2.500 ₺ Süper Sürücü Primi</strong> almaya hak kazandınız!
            </span>
          </div>
          <span className="font-mono text-xs font-black shrink-0 ml-2 text-white">✓ ONAYLANDI</span>
        </div>
      </div>
    </div>
  );
};
