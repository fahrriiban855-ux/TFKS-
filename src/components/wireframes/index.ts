import { WireframeScreen } from './types';
import { C01_OtpVerificationScreen } from './customer/C01_OtpVerificationScreen';
import { C02_HomeMapServiceSelectScreen } from './customer/C02_HomeMapServiceSelectScreen';
import { C03_RouteFareEstimateScreen } from './customer/C03_RouteFareEstimateScreen';
import { C04_Card3DSecureScreen } from './customer/C04_Card3DSecureScreen';
import { C05_CourierMatchingRadarScreen } from './customer/C05_CourierMatchingRadarScreen';
import { C06_LiveTrackingBoardingCodeScreen } from './customer/C06_LiveTrackingBoardingCodeScreen';
import { C07_EmergencySosShareScreen } from './customer/C07_EmergencySosShareScreen';
import { C08_TripCompletedRatingReceiptScreen } from './customer/C08_TripCompletedRatingReceiptScreen';
import { C09_InAppVoipChatScreen } from './customer/C09_InAppVoipChatScreen';
import { C10_FavoriteDriversDirectBookingScreen } from './customer/C10_FavoriteDriversDirectBookingScreen';
import { C11_BargainOfferModalScreen } from './customer/C11_BargainOfferModalScreen';
import { C12_PackageParcelDispatchScreen } from './customer/C12_PackageParcelDispatchScreen';
import { C13_CancellationFeeReasonScreen } from './customer/C13_CancellationFeeReasonScreen';
import { C14_CorporateInvoiceReceiptScreen } from './customer/C14_CorporateInvoiceReceiptScreen';

import { K01_KycDocumentUploadScreen } from './courier/K01_KycDocumentUploadScreen';
import { K02_OnlineToggleWalletScreen } from './courier/K02_OnlineToggleWalletScreen';
import { K03_IncomingOrderRadarScreen } from './courier/K03_IncomingOrderRadarScreen';
import { K04_TurnByTurnNavigationScreen } from './courier/K04_TurnByTurnNavigationScreen';
import { K05_BoardingPinPadScreen } from './courier/K05_BoardingPinPadScreen';
import { K06_ProofOfDeliveryCameraScreen } from './courier/K06_ProofOfDeliveryCameraScreen';
import { K07_CompleteTripEarningsScreen } from './courier/K07_CompleteTripEarningsScreen';
import { K08_PayoutWalletHistoryScreen } from './courier/K08_PayoutWalletHistoryScreen';
import { K09_HandsfreeVoiceNavChatScreen } from './courier/K09_HandsfreeVoiceNavChatScreen';

import { A01_FleetRadarGeofenceScreen } from './admin/A01_FleetRadarGeofenceScreen';
import { A02_KycApprovalDeskScreen } from './admin/A02_KycApprovalDeskScreen';
import { A03_TariffSurgePricingScreen } from './admin/A03_TariffSurgePricingScreen';
import { A04_FinancialSettlementScreen } from './admin/A04_FinancialSettlementScreen';
import { A05_AuditLogsStreamScreen } from './admin/A05_AuditLogsStreamScreen';
import { A06_ComplaintsRefundDeskScreen } from './admin/A06_ComplaintsRefundDeskScreen';

export * from './types';

export const CUSTOMER_WIREFRAME_SCREENS: WireframeScreen[] = [
  C01_OtpVerificationScreen,
  C02_HomeMapServiceSelectScreen,
  C03_RouteFareEstimateScreen,
  C04_Card3DSecureScreen,
  C05_CourierMatchingRadarScreen,
  C06_LiveTrackingBoardingCodeScreen,
  C07_EmergencySosShareScreen,
  C08_TripCompletedRatingReceiptScreen,
  C09_InAppVoipChatScreen,
  C10_FavoriteDriversDirectBookingScreen,
  C11_BargainOfferModalScreen,
  C12_PackageParcelDispatchScreen,
  C13_CancellationFeeReasonScreen,
  C14_CorporateInvoiceReceiptScreen,
];

export const COURIER_WIREFRAME_SCREENS: WireframeScreen[] = [
  K01_KycDocumentUploadScreen,
  K02_OnlineToggleWalletScreen,
  K03_IncomingOrderRadarScreen,
  K04_TurnByTurnNavigationScreen,
  K05_BoardingPinPadScreen,
  K06_ProofOfDeliveryCameraScreen,
  K07_CompleteTripEarningsScreen,
  K08_PayoutWalletHistoryScreen,
  K09_HandsfreeVoiceNavChatScreen,
];

export const ADMIN_WIREFRAME_SCREENS: WireframeScreen[] = [
  A01_FleetRadarGeofenceScreen,
  A02_KycApprovalDeskScreen,
  A03_TariffSurgePricingScreen,
  A04_FinancialSettlementScreen,
  A05_AuditLogsStreamScreen,
  A06_ComplaintsRefundDeskScreen,
];

export const ALL_WIREFRAME_SCREENS: WireframeScreen[] = [
  ...CUSTOMER_WIREFRAME_SCREENS,
  ...COURIER_WIREFRAME_SCREENS,
  ...ADMIN_WIREFRAME_SCREENS,
];
