export interface DriverApplication {
  id: string;
  fullName: string;
  phone: string;
  email: string;
  city: string;
  district: string;
  vehicleType: 'scooter_125' | 'motorcycle_250_plus' | 'electric_bike';
  vehiclePlate: string;
  vehicleModelYear: number;
  drivingLicenseClass: 'A' | 'A2' | 'A1';
  experienceYears: number;
  hasSecondHelmet: boolean;
  hasDeliveryBox: boolean;
  servicePreference: 'passenger_and_courier' | 'courier_only';
  status: 'pending' | 'reviewing' | 'interview_scheduled' | 'approved' | 'rejected';
  submittedAt: string;
  notes?: string;
}

export interface MerchantLead {
  id: string;
  businessName: string;
  contactPerson: string;
  phone: string;
  email: string;
  district: string;
  businessType: 'restaurant' | 'ecommerce' | 'retail_store' | 'pharmacy_cosmetics' | 'other';
  dailyEstimatedDeliveries: number;
  requestedService: 'express_courier' | 'scheduled_batch' | 'dedicated_fleet';
  notes?: string;
  status: 'new' | 'contacted' | 'proposal_sent' | 'contracted' | 'closed';
  submittedAt: string;
}

export interface FareCalculationResult {
  pickup: string;
  dropoff: string;
  distanceKm: number;
  estimatedMinutes: number;
  motoFare: number;
  carTaxiFare: number;
  savingsTimeMinutes: number;
  savingsMoneyLira: number;
}

export interface FAQItem {
  question: string;
  answer: string;
  category: 'passenger' | 'courier' | 'merchant' | 'legal';
}

export interface GuideArticle {
  id: string;
  title: string;
  summary: string;
  readingTimeMinutes: number;
  publishDate: string;
  category: 'safety' | 'driver_tips' | 'urban_mobility' | 'regulations';
  contentMarkdown: string;
}
