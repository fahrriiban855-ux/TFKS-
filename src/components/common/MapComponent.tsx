import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import { Courier, LocationPoint, RideOrder } from '../../types/platform';

interface MapComponentProps {
  couriers?: Courier[];
  currentRide?: RideOrder | null;
  interactive?: boolean;
  onSelectLocation?: (lat: number, lng: number) => void;
  heightClass?: string;
  showGeofences?: boolean;
  focusedCourierId?: string | null;
  onSelectCourier?: (courierId: string) => void;
  showAllStatuses?: boolean;
  statusFilter?: 'all' | 'available' | 'busy' | 'offline';
}

export const MapComponent: React.FC<MapComponentProps> = ({
  couriers = [],
  currentRide = null,
  interactive = true,
  onSelectLocation,
  heightClass = 'h-[360px] sm:h-[450px]',
  showGeofences = false,
  focusedCourierId = null,
  onSelectCourier,
  showAllStatuses = true,
  statusFilter = 'all',
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const geofenceLayerRef = useRef<L.LayerGroup | null>(null);
  const routeLineRef = useRef<L.Polyline | null>(null);
  const onSelectLocationRef = useRef(onSelectLocation);

  useEffect(() => {
    onSelectLocationRef.current = onSelectLocation;
  }, [onSelectLocation]);

  // Initialize Map with dark tiles
  useEffect(() => {
    if (!mapContainerRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: [41.035, 29.015],
      zoom: 13,
      zoomControl: false, // Custom clean control or none
      dragging: interactive,
      touchZoom: interactive,
      scrollWheelZoom: false,
    });

    // Pristine CartoDB Dark Matter tiles (No CSS invert filters)
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; OpenStreetMap &copy; CARTO',
      maxZoom: 19,
      subdomains: 'abcd',
    }).addTo(map);

    if (interactive) {
      L.control.zoom({ position: 'bottomright' }).addTo(map);
    }

    // Force tile recalculation to eliminate gray edges on tab switch
    setTimeout(() => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.invalidateSize();
      }
    }, 200);

    const handleResize = () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.invalidateSize();
      }
    };
    window.addEventListener('resize', handleResize);

    const geofenceGroup = L.layerGroup().addTo(map);
    const markersGroup = L.layerGroup().addTo(map);

    geofenceLayerRef.current = geofenceGroup;
    markersLayerRef.current = markersGroup;
    mapInstanceRef.current = map;

    map.on('click', (e) => {
      if (interactive && onSelectLocationRef.current) {
        onSelectLocationRef.current(e.latlng.lat, e.latlng.lng);
      }
    });

    return () => {
      window.removeEventListener('resize', handleResize);
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Render Istanbul Geofence Zones (Avrupa Zone 1, Anadolu Zone 2)
  useEffect(() => {
    const layer = geofenceLayerRef.current;
    if (!layer || !showGeofences) return;

    layer.clearLayers();

    // Zone 1: Avrupa Yakası (Beşiktaş, Şişli, Levent, Maslak)
    const avrupaCoords: [number, number][] = [
      [41.030, 28.980],
      [41.050, 28.985],
      [41.115, 29.015],
      [41.120, 29.045],
      [41.075, 29.055],
      [41.040, 29.020],
    ];

    L.polygon(avrupaCoords, {
      color: '#71717a',
      weight: 1.5,
      opacity: 0.7,
      fillColor: '#3f3f46',
      fillOpacity: 0.08,
      dashArray: '4, 6',
    })
      .bindTooltip('Bölge 1: Avrupa Merkez (Beşiktaş - Levent)', {
        permanent: false,
        direction: 'center',
        className: 'geofence-tooltip',
      })
      .addTo(layer);

    // Zone 2: Anadolu Yakası (Kadıköy, Moda, Üsküdar, Ataşehir)
    const anadoluCoords: [number, number][] = [
      [41.035, 29.010],
      [41.035, 29.070],
      [40.970, 29.120],
      [40.970, 29.020],
      [41.010, 29.005],
    ];

    L.polygon(anadoluCoords, {
      color: '#52525b',
      weight: 1.5,
      opacity: 0.7,
      fillColor: '#27272a',
      fillOpacity: 0.08,
      dashArray: '4, 6',
    })
      .bindTooltip('Bölge 2: Anadolu Sahil (Kadıköy - Üsküdar)', {
        permanent: false,
        direction: 'center',
        className: 'geofence-tooltip',
      })
      .addTo(layer);
  }, [showGeofences]);

  // Update Markers, Couriers & Routes
  useEffect(() => {
    const map = mapInstanceRef.current;
    const layer = markersLayerRef.current;
    if (!map || !layer) return;

    layer.clearLayers();
    if (routeLineRef.current) {
      routeLineRef.current.remove();
      routeLineRef.current = null;
    }

    // Render Couriers with distinct status beacons (Boşta 🟢, Seferde 🔵, Molada ⚪)
    couriers.forEach((courier) => {
      const isCurrentRideCourier = currentRide?.courierId === courier.id && currentRide.status !== 'completed' && currentRide.status !== 'cancelled';
      const isBusy = isCurrentRideCourier || courier.status === 'busy';
      const isOnline = courier.isOnline;
      const isFocused = focusedCourierId === courier.id;

      // Status classification: available (boş), busy (seferde), offline (molada)
      const statusCategory: 'available' | 'busy' | 'offline' = !isOnline
        ? 'offline'
        : isBusy
        ? 'busy'
        : 'available';

      // Status filter check
      if (statusFilter !== 'all' && statusCategory !== statusFilter) {
        return;
      }
      if (!showAllStatuses && !isOnline) {
        return;
      }

      const statusColor = statusCategory === 'available'
        ? '#30D158'
        : statusCategory === 'busy'
        ? '#0A84FF'
        : '#8E8E93';

      const statusLabel = statusCategory === 'available'
        ? 'BOŞTA'
        : statusCategory === 'busy'
        ? 'SEFERDE'
        : 'MOLADA';

      const courierIcon = L.divIcon({
        className: 'courier-radar-icon',
        html: `
          <div class="relative flex items-center justify-center cursor-pointer group">
            <!-- Pulsing outer wave for active / focused -->
            ${
              isFocused || isBusy
                ? `<div class="absolute -inset-3 rounded-full animate-ping" style="background-color: ${statusColor}33;"></div>
                   <div class="absolute -inset-2 rounded-full" style="background-color: ${statusColor}22;"></div>`
                : ''
            }
            
            <!-- Vehicle Badge -->
            <div class="w-10 h-10 rounded-2xl flex items-center justify-center p-1.5 transition-all group-hover:scale-110 shadow-xl ${
              isFocused
                ? 'ring-4 ring-white scale-110 shadow-[0_0_25px_rgba(255,255,255,0.7)]'
                : ''
            }" style="background-color: #161618; border: 2px solid ${statusColor};">
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="${statusColor}" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="18.5" cy="17.5" r="3.5" />
                <circle cx="5.5" cy="17.5" r="3.5" />
                <circle cx="15" cy="5" r="1" />
                <path d="M12 17.5V14l-3-3 4-3 2 3h2" />
              </svg>
            </div>

            <!-- Mini Plate & Status Pill -->
            <div class="absolute -bottom-5 px-2 py-0.5 rounded-full text-[9px] font-mono font-bold text-white shadow-xl whitespace-nowrap flex items-center gap-1 border border-white/10" style="background-color: #121214;">
              <span class="w-1.5 h-1.5 rounded-full ${statusCategory === 'available' || statusCategory === 'busy' ? 'animate-pulse' : ''}" style="background-color: ${statusColor};"></span>
              <span style="color: ${statusColor}; font-weight: 800;">${statusLabel}</span>
              <span class="text-zinc-400">·</span>
              <span>${courier.plate}</span>
            </div>
          </div>
        `,
        iconSize: [42, 42],
        iconAnchor: [21, 21],
      });

      const marker = L.marker([courier.currentLocation.lat, courier.currentLocation.lng], {
        icon: courierIcon,
      });

      if (onSelectCourier) {
        marker.on('click', () => {
          onSelectCourier(courier.id);
        });
      }

      marker.bindPopup(`
        <div style="font-family: system-ui, -apple-system, sans-serif; font-size: 12px; color: #f5f5f7; background: #1c1c1e; padding: 10px; border-radius: 14px; min-width: 180px; box-shadow: 0 10px 25px rgba(0,0,0,0.5);">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
            <strong style="font-size: 13px; color: #fff;">${courier.name}</strong>
            <span style="font-size: 10px; font-weight: 800; color: ${statusColor}; background: ${statusColor}22; padding: 2px 7px; border-radius: 8px; border: 1px solid ${statusColor}44;">
              ● ${statusLabel}
            </span>
          </div>
          <div style="color: #8e8e93; font-size: 11px; margin-bottom: 6px;">
            ${courier.motorcycle} · <strong style="font-family: monospace; color: #fff;">${courier.plate}</strong>
          </div>
          <div style="padding-top: 6px; border-top: 1px solid rgba(255,255,255,0.08); display: flex; justify-content: space-between; font-size: 11px;">
            <span style="color: #ff9f0a; font-weight: bold;">★ ${courier.rating}</span>
            <span style="color: #8e8e93;">${courier.totalTrips} Sefer</span>
          </div>
          <div style="margin-top: 6px; font-size: 10px; color: #0a84ff; text-align: center; font-weight: 600;">
            ✓ Tıklayarak Komuta Masasına Seç
          </div>
        </div>
      `);

      marker.addTo(layer);
    });

    // Render Pickup & Dropoff Waypoints (Active ride only)
    if (currentRide && currentRide.status !== 'completed' && currentRide.status !== 'cancelled') {
      const pickup = currentRide.pickup;
      const dropoff = currentRide.dropoff;

      // Pickup Pin (A) - Pure Black with white ring
      const pickupIcon = L.divIcon({
        className: 'pickup-pin-custom',
        html: `
          <div class="relative flex flex-col items-center">
            <div class="w-7 h-7 rounded-full bg-black text-white flex items-center justify-center font-bold text-xs shadow-lg ring-2 ring-white">
              A
            </div>
            <div class="mt-1 px-2 py-0.5 rounded bg-black text-white text-[10px] font-bold border border-zinc-700 shadow whitespace-nowrap">
              Alış: ${pickup.name}
            </div>
          </div>
        `,
        iconSize: [32, 40],
        iconAnchor: [16, 20],
      });
      L.marker([pickup.lat, pickup.lng], { icon: pickupIcon }).addTo(layer);

      // Dropoff Pin (B) - Pure White with black letter
      const dropoffIcon = L.divIcon({
        className: 'dropoff-pin-custom',
        html: `
          <div class="relative flex flex-col items-center">
            <div class="w-7 h-7 rounded-full bg-white text-black flex items-center justify-center font-bold text-xs shadow-lg ring-2 ring-zinc-900">
              B
            </div>
            <div class="mt-1 px-2 py-0.5 rounded bg-white text-black text-[10px] font-bold border border-zinc-400 shadow whitespace-nowrap">
              Varış: ${dropoff.name}
            </div>
          </div>
        `,
        iconSize: [32, 40],
        iconAnchor: [16, 20],
      });
      L.marker([dropoff.lat, dropoff.lng], { icon: dropoffIcon }).addTo(layer);

      // Curved realistic multi-segment path
      const routePoints: [number, number][] = [
        [pickup.lat, pickup.lng],
        [(pickup.lat * 2 + dropoff.lat) / 3 + 0.002, (pickup.lng * 2 + dropoff.lng) / 3 - 0.003],
        [(pickup.lat + dropoff.lat * 2) / 3 - 0.001, (pickup.lng + dropoff.lng * 2) / 3 + 0.002],
        [dropoff.lat, dropoff.lng],
      ];

      // Outer depth line (zinc shadow)
      L.polyline(routePoints, {
        color: '#71717a',
        weight: 7,
        opacity: 0.35,
      }).addTo(layer);

      // Core route line (pure white high-contrast)
      routeLineRef.current = L.polyline(routePoints, {
        color: '#ffffff',
        weight: 3.5,
        opacity: 1,
        dashArray: currentRide.status === 'in_progress' ? undefined : '5, 7',
      }).addTo(map);

      // Auto fit bounds
      const bounds = L.latLngBounds([
        [pickup.lat, pickup.lng],
        [dropoff.lat, dropoff.lng],
      ]);
      map.fitBounds(bounds, { padding: [60, 60], maxZoom: 15 });
    }
  }, [couriers, currentRide, focusedCourierId]);

  return (
    <div className={`w-full ${heightClass} relative rounded-2xl overflow-hidden shadow-2xl border border-zinc-800`}>
      <div ref={mapContainerRef} className="w-full h-full" />
    </div>
  );
};
