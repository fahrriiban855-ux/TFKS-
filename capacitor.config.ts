/**
 * MotoPilot Unified Super-App Capacitor Native Store Configuration
 * Bundles Customer/Passenger, Driver/Courier Cockpit, Business B2B SaaS Portal & Admin Command Center
 * into a single native binary for Apple App Store (iOS) and Google Play Store (Android).
 */
export interface CapacitorNativeConfig {
  appId: string;
  appName: string;
  webDir: string;
  bundledWebRuntime: boolean;
  server: {
    androidScheme: 'https';
    iosScheme: 'capacitor';
  };
  ios: {
    contentInset: 'always';
    allowsLinkPreview: boolean;
    backgroundColor: string;
    infoPlistPermissions: Record<string, string>;
  };
  android: {
    backgroundColor: string;
    allowMixedContent: boolean;
    permissions: string[];
  };
}

export const capacitorConfig: CapacitorNativeConfig = {
  appId: 'com.motopilot.superapp',
  appName: 'MotoPilot',
  webDir: 'dist',
  bundledWebRuntime: false,
  server: {
    androidScheme: 'https',
    iosScheme: 'capacitor',
  },
  ios: {
    contentInset: 'always',
    allowsLinkPreview: false,
    backgroundColor: '#050507',
    infoPlistPermissions: {
      NSLocationWhenInUseUsageDescription:
        'MotoPilot en yakın taksi/kurye eşleştirmesi ve canlı teslimat takibi için konum izni gerektirir.',
      NSLocationAlwaysAndWhenInUseUsageDescription:
        'Sürücü ve kurye vardiyasında kesintisiz rota ve güvenli teslimat takibi için arka plan konum izni kullanılır.',
      NSCameraUsageDescription:
        'Teslimat kanıtı (PoD) fotoğrafı, KYC belge doğrulaması ve vardiya araç kontrolü için kamera izni gerektirir.',
      NSMicrophoneUsageDescription:
        'Kask içi bas-konuş (PTT) telsiz ve sesli komut asistanı için mikrofon izni gerektirir.',
    },
  },
  android: {
    backgroundColor: '#050507',
    allowMixedContent: false,
    permissions: [
      'android.permission.ACCESS_FINE_LOCATION',
      'android.permission.ACCESS_COARSE_LOCATION',
      'android.permission.ACCESS_BACKGROUND_LOCATION',
      'android.permission.CAMERA',
      'android.permission.RECORD_AUDIO',
      'android.permission.POST_NOTIFICATIONS',
      'android.permission.FOREGROUND_SERVICE',
    ],
  },
};

export default capacitorConfig;
