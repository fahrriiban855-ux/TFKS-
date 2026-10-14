import { WireframeScreen } from './types';
export type { WireframeScreen } from './types';

// Customer Screens (C-01 to C-15)
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
import { C15_LoyaltyReferralCampaignWalletScreen } from './customer/C15_LoyaltyReferralCampaignWalletScreen';

// Courier Screens (K-01 to K-15)
import { K01_KycDocumentUploadScreen } from './courier/K01_KycDocumentUploadScreen';
import { K02_OnlineToggleWalletScreen } from './courier/K02_OnlineToggleWalletScreen';
import { K03_IncomingOrderRadarScreen } from './courier/K03_IncomingOrderRadarScreen';
import { K04_TurnByTurnNavigationScreen } from './courier/K04_TurnByTurnNavigationScreen';
import { K05_BoardingPinPadScreen } from './courier/K05_BoardingPinPadScreen';
import { K06_ProofOfDeliveryCameraScreen } from './courier/K06_ProofOfDeliveryCameraScreen';
import { K07_CompleteTripEarningsScreen } from './courier/K07_CompleteTripEarningsScreen';
import { K08_PayoutWalletHistoryScreen } from './courier/K08_PayoutWalletHistoryScreen';
import { K09_HandsfreeVoiceNavChatScreen } from './courier/K09_HandsfreeVoiceNavChatScreen';
import { K10_WeeklyPlatformAccessStatusScreen } from './courier/K10_WeeklyPlatformAccessStatusScreen';
import { K11_InNetworkRoutingCorridorScreen } from './courier/K11_InNetworkRoutingCorridorScreen';
import { K12_M0GrossEqualsNetTallyScreen } from './courier/K12_M0GrossEqualsNetTallyScreen';
import { K13_FieldIncidentAccidentReportScreen } from './courier/K13_FieldIncidentAccidentReportScreen';
import { K14_RegionalDemandHeatmapScreen } from './courier/K14_RegionalDemandHeatmapScreen';
import { K15_CourierEquipmentComplianceScreen } from './courier/K15_CourierEquipmentComplianceScreen';

// Business SaaS Screens (B-01 to B-06)
import { B01_BusinessOnboardingIntroScreen } from './business/B01_BusinessOnboardingIntroScreen';
import { B02_MultiDropRouteBatchingScreen } from './business/B02_MultiDropRouteBatchingScreen';
import { B03_SaaSAutoDispatchKitchenScreen } from './business/B03_SaaSAutoDispatchKitchenScreen';
import { B04_B2BExternalOrderWebhookScreen } from './business/B04_B2BExternalOrderWebhookScreen';
import { B05_SubUserBranchRbacScreen } from './business/B05_SubUserBranchRbacScreen';
import { B06_WirePaymentSubscriptionScreen } from './business/B06_WirePaymentSubscriptionScreen';

// Admin Screens (A-01 to A-06)
import { A01_FleetRadarGeofenceScreen } from './admin/A01_FleetRadarGeofenceScreen';
import { A02_KycApprovalDeskScreen } from './admin/A02_KycApprovalDeskScreen';
import { A03_TariffSurgePricingScreen } from './admin/A03_TariffSurgePricingScreen';
import { A04_FinancialSettlementScreen } from './admin/A04_FinancialSettlementScreen';
import { A05_AuditLogsStreamScreen } from './admin/A05_AuditLogsStreamScreen';
import { A06_ComplaintsRefundDeskScreen } from './admin/A06_ComplaintsRefundDeskScreen';

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
  C15_LoyaltyReferralCampaignWalletScreen,
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
  K10_WeeklyPlatformAccessStatusScreen,
  K11_InNetworkRoutingCorridorScreen,
  K12_M0GrossEqualsNetTallyScreen,
  K13_FieldIncidentAccidentReportScreen,
  K14_RegionalDemandHeatmapScreen,
  K15_CourierEquipmentComplianceScreen,
];

export const BUSINESS_WIREFRAME_SCREENS: WireframeScreen[] = [
  B01_BusinessOnboardingIntroScreen,
  B02_MultiDropRouteBatchingScreen,
  B03_SaaSAutoDispatchKitchenScreen,
  B04_B2BExternalOrderWebhookScreen,
  B05_SubUserBranchRbacScreen,
  B06_WirePaymentSubscriptionScreen,
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
  ...BUSINESS_WIREFRAME_SCREENS,
  ...ADMIN_WIREFRAME_SCREENS,
];

export const customerScreens = CUSTOMER_WIREFRAME_SCREENS;
export const courierScreens = COURIER_WIREFRAME_SCREENS;
export const businessScreens = BUSINESS_WIREFRAME_SCREENS;
export const adminScreens = ADMIN_WIREFRAME_SCREENS;
export const allWireframeScreens = ALL_WIREFRAME_SCREENS;
