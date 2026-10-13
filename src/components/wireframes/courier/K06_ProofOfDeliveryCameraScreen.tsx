import React from 'react';
import { Camera } from 'lucide-react';
import { WireframeScreen } from '../types';

export const K06_ProofOfDeliveryCameraScreen: WireframeScreen = {
  id: 'K-06',
  category: 'courier',
  categoryLabel: 'Kurye Uygulaması',
  stepNumber: 'EKRAN 06 / 08',
  title: 'Paket Teslim Alma & Teslimat Fotoğrafı (PoD)',
  subtitle: 'Paket tesliminde teslim kodu ve kamera ile fotoğraflı kanıt yükleme',
  userGoal: 'Paketin hasarsız ve alıcısına ulaştığını fotoğrafla kanıtlamak.',
  triggerAction: 'Kamera vizörü açılır ➔ Fotoğraf çekilir ➔ Sunucuya yüklenir.',
  uxHighlights: [
    'Zaman damgalı (Timestamp) ve koordinatlı kamera vizörü',
    'Fotoğraf yüklenmeden teslimat tamamlanamaz zorunluluğu',
    'Müşteri paneline anında teslimat kanıtı iletimi',
  ],
  securityRule: 'EXIF GPS ve saat doğrulaması yapılır, galeriden sahte fotoğraf yüklenemez.',
  apiEndpoint: 'POST /api/v1/delivery/pod-upload',
  apiPayload: JSON.stringify({ order_id: 'BLS-9482', photo_url: 's3://blesyum-pod/pkg_9482.jpg', timestamp: '2026-10-02T19:42:00Z' }, null, 2),
  designTokens: {
    typography: 'Inter 12px SemiBold / SF Pro Display 14px Bold',
    colors: ['#06B6D4', '#0F172A', '#38BDF8'],
    touchTarget: 'Shutter Button 64pt',
    elevation: 'Camera Frame Border',
  },
  edgeCases: ['Karanlık ortamda flaş otomatik açılır.'],
  screenVisual: (
    <div className="w-full h-full bg-black p-4 flex flex-col justify-between text-zinc-100">
      <div className="space-y-3 pt-2">
        <span className="text-xs font-bold text-white uppercase font-mono">TESLİMAT KANITI (PoD)</span>
        <div className="w-full h-48 rounded-3xl border-2 border-dashed border-zinc-700 bg-zinc-950 flex flex-col items-center justify-center p-3 text-center space-y-2 relative">
          <Camera className="w-10 h-10 text-white" />
          <span className="text-xs font-bold text-white">Teslim Anı Fotoğrafı Çek</span>
          <span className="text-[10px] text-zinc-400 font-mono">02.10.2026 · 41.0782°N, 29.0117°E</span>
        </div>
        <div className="p-3 bg-zinc-950 border border-zinc-800 rounded-2xl text-xs flex justify-between">
          <span className="text-zinc-400">Alıcı Adı:</span>
          <span className="font-bold text-white">Av. Kemal Erdem</span>
        </div>
      </div>
      <button className="w-full py-4 bg-white hover:bg-zinc-200 text-black font-bold text-xs rounded-2xl shadow-xl transition-all">
        Fotoğrafı Kaydet ve Teslim Et
      </button>
    </div>
  ),
};
