import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { WireframeScreen } from '../types';

export const C07_EmergencySosShareScreen: WireframeScreen = {
  id: 'C-07',
  category: 'customer',
  categoryLabel: 'Müşteri Uygulaması',
  stepNumber: 'EKRAN 07 / 08',
  title: 'Yolculuk Paylaşımı & Acil Durum (112 SOS)',
  subtitle: 'Tek dokunuşla canlı konum paylaşımı ve 112 Acil Yardım Masası',
  userGoal: 'Yolculuk esnasında yakınlarını bilgilendirmek ve acil bir durumda anında yardım çağırmak.',
  triggerAction: 'Kullanıcı SOS butonuna dokunur ➔ Konum ve araç plakası anında yetkililere aktarılır.',
  uxHighlights: [
    'Tek tıkla 112 acil arama ve Blesyum Güvenlik Masası uyarısı',
    'WhatsApp veya SMS ile şifreli canlı takip linki paylaşımı',
    'Gece yolculuklarında aktif güvenlik kalkanı modu',
  ],
  securityRule: 'Olay kaydı anında sunucu denetim kütüğüne (Audit Trail) yazılır ve panelde kırmızı bayrakla işaretlenir.',
  apiEndpoint: 'POST /api/v1/safety/emergency-alert',
  apiPayload: JSON.stringify(
    {
      ride_id: 'BLS-9481',
      alert_type: 'sos_trigger',
      current_coords: { lat: 41.0425, lng: 29.0065 },
      plate: '34 BLY 717',
    },
    null,
    2
  ),
  designTokens: {
    typography: 'Inter 14px Bold / SF Pro Display 18px Black',
    colors: ['#E11D48', '#0F172A', '#F43F5E'],
    touchTarget: '56pt Emergency SOS Button',
    elevation: 'Crimson Emergency Alert Halo',
  },
  edgeCases: [
    'Yanlışlıkla basıldıysa: 5 saniyelik iptal geri sayımı sunulur.',
  ],
  screenVisual: (
    <div className="w-full h-full bg-black p-4 flex flex-col justify-between text-zinc-100">
      <div className="space-y-4 pt-3">
        <div className="w-14 h-14 rounded-2xl bg-zinc-900 border border-zinc-700 text-white flex items-center justify-center mx-auto ring-4 ring-zinc-800">
          <AlertTriangle className="w-7 h-7" />
        </div>
        <div className="text-center space-y-1">
          <h3 className="text-lg font-bold text-white">Yolculuk Güvenlik Kalkanı</h3>
          <p className="text-xs text-zinc-400">Canlı konumunuz ve araç plakası emniyet birimleriyle paylaşılabilir.</p>
        </div>
        <div className="p-3.5 bg-zinc-950 rounded-2xl border border-zinc-800 text-xs space-y-2 font-mono">
          <div className="flex justify-between text-zinc-300">
            <span>Araç Plakası:</span>
            <span className="font-bold text-white">34 BLY 717</span>
          </div>
          <div className="flex justify-between text-zinc-300">
            <span>Sürücü:</span>
            <span className="font-bold text-white">Mert Aksoy</span>
          </div>
          <div className="flex justify-between text-zinc-300">
            <span>Canlı Koordinat:</span>
            <span className="text-white font-bold">41.0425° N, 29.0065° E</span>
          </div>
        </div>
      </div>
      <div className="space-y-2">
        <button className="w-full py-4 bg-white hover:bg-zinc-200 text-black font-bold text-xs rounded-2xl shadow-xl transition-all">
          112 Acil Yardım Çağrısı Başlat
        </button>
        <button className="w-full py-3 bg-zinc-900 border border-zinc-700 text-zinc-300 text-xs font-semibold rounded-2xl hover:bg-zinc-800 transition-colors">
          Canlı Takip Linkini Yakınımla Paylaş
        </button>
      </div>
    </div>
  ),
};
