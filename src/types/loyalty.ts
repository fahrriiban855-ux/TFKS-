import { ServiceType, PaymentMethod, UserProfileMode } from './platform';

export type LoyaltyTier = 'bronze' | 'silver' | 'gold';

export interface LoyaltyTierConfig {
  tier: LoyaltyTier;
  name: string;
  minPoints: number;
  minTrips: number;
  pointMultiplier: number;
  discountPercent: number;
  freeWaitMinutes: number;
  priorityDispatch: boolean;
  benefits: string[];
}

export interface LoyaltyAccount {
  userId: string;
  userType: 'customer' | 'driver' | 'merchant';
  userName: string;
  currentTier: LoyaltyTier;
  availablePoints: number;
  pendingPoints: number;
  lifetimeEarnedPoints: number;
  lifetimeSpentPoints: number;
  pointsExpiringSoon: number;
  expirationDate: string;
}

export interface LoyaltyTransaction {
  id: string;
  userId: string;
  userType: 'customer' | 'driver' | 'merchant';
  type: 'earn' | 'spend' | 'expire' | 'refund_revoke' | 'bonus' | 'tier_bonus';
  points: number;
  equivalentLira: number;
  rideId?: string;
  description: string;
  timestamp: string;
  balanceAfter: number;
  idempotencyKey?: string;
}

export interface LoyaltySettings {
  earnRatePerLira: number; // e.g. 0.1 = 1 point per 10 TL
  pointRedeemRateLira: number; // e.g. 0.25 TL per point (100 points = 25 TL)
  minRedeemPoints: number; // Minimum 50 points to spend
  maxRedeemPercentPerRide: number; // Max 50% of ride total
  pointValidityDays: number; // 180 days
  bronzeMultiplier: number; // 1.0x
  silverMultiplier: number; // 1.25x
  goldMultiplier: number; // 1.5x
  silverThresholdPoints: number; // 500 points
  goldThresholdPoints: number; // 1500 points
  isProgramActive: boolean;
}

export type ReferralProgramType = 'customer_to_customer' | 'driver_to_driver' | 'merchant_to_merchant';

export interface ReferralCode {
  id: string;
  code: string;
  ownerId: string;
  ownerType: 'customer' | 'driver' | 'merchant';
  ownerName: string;
  programType: ReferralProgramType;
  createdAt: string;
  totalReferrals: number;
  successfulReferrals: number;
  totalRewardEarnedLira: number;
}

export type ReferralStatus =
  | 'pending' // Davet edildi, henüz kayıt veya ilk işlem yok
  | 'verified' // Telefon/profil doğrulandı
  | 'qualifying_action_completed' // İlk uygun yolculuk veya teslimat tamamlandı
  | 'rewarded' // Ödül kesinleştirildi ve yüklendi
  | 'cancelled' // İptal edildi
  | 'under_review'; // Suistimal şüphesiyle incelemede

export interface ReferralRecord {
  id: string;
  programType: ReferralProgramType;
  referrerId: string;
  referrerName: string;
  referredId: string;
  referredName: string;
  referredContact: string;
  codeUsed: string;
  status: ReferralStatus;
  rewardAmountReferrer: number;
  rewardAmountReferred: number;
  rewardType: 'wallet_credit' | 'points' | 'discount_percent';
  qualifyingActionDescription: string;
  createdAt: string;
  qualifiedAt?: string;
  rewardedAt?: string;
  reviewReason?: string;
  isFlaggedSuspicious: boolean;
  fraudFlags?: {
    sameDeviceDetected?: boolean;
    selfReferralAttempt?: boolean;
    suspiciousVelocity?: boolean;
    disposableContact?: boolean;
  };
}

export interface ReferralProgramConfig {
  id: string;
  programType: ReferralProgramType;
  title: string;
  description: string;
  isActive: boolean;
  referrerRewardAmount: number;
  referrerRewardType: 'wallet_credit' | 'points';
  referredRewardAmount: number;
  referredRewardType: 'wallet_credit' | 'discount_percent';
  minQualifyingTrips: number;
  minTripFare: number;
  budgetLimitLira: number;
  currentSpentLira: number;
  maxReferralsPerUser: number;
}

export type CampaignDiscountType = 'percentage' | 'fixed_amount' | 'bonus_points' | 'free_service_fee';
export type CampaignTargetAudience = 'all' | 'new_users' | 'win_back' | 'vip_gold' | 'merchants' | 'drivers';
export type CampaignStatus = 'draft' | 'active' | 'paused' | 'completed' | 'cancelled';

export interface Campaign {
  id: string;
  code: string;
  title: string;
  description: string;
  targetAudience: CampaignTargetAudience;
  discountType: CampaignDiscountType;
  discountValue: number; // e.g. 20 for 20% or 50 for 50 TL
  minOrderAmount: number; // e.g. 100 TL
  maxDiscountAmount: number; // e.g. 60 TL for percentage discounts
  startDate: string;
  endDate: string;
  totalBudgetLira: number;
  usedBudgetLira: number;
  totalUsageLimit: number;
  currentUsageCount: number;
  perUserLimit: number;
  applicableServices: ServiceType[];
  applicablePaymentMethods: PaymentMethod[];
  fundedBy: 'platform' | 'sponsor_merchant';
  sponsorMerchantName?: string;
  status: CampaignStatus;
  canCombineWithLoyalty: boolean;
  createdBy: string;
  createdAt: string;
}

export interface CouponRedemptionRecord {
  id: string;
  campaignId: string;
  campaignCode: string;
  userId: string;
  userType: 'customer' | 'driver' | 'merchant';
  userName: string;
  rideId: string;
  orderTotalFare: number;
  discountAmount: number;
  finalFareAfterDiscount: number;
  timestamp: string;
  idempotencyKey: string;
}

export type QuestTimeWindow = 'daily' | 'weekend' | 'weekly' | 'rush_hour';

export interface DriverQuest {
  id: string;
  title: string;
  description: string;
  targetTrips: number;
  bonusAmountLira: number;
  timeWindow: QuestTimeWindow;
  startDate: string;
  endDate: string;
  applicableRegions: string[];
  isActive: boolean;
  currentCompletedTrips?: number;
  isClaimed?: boolean;
}

export interface DriverQuestProgress {
  id: string;
  questId: string;
  driverId: string;
  currentTrips: number;
  isCompleted: boolean;
  isClaimed: boolean;
  claimedAt?: string;
  expiresAt: string;
}

export type MerchantTier = 'standard' | 'growth' | 'enterprise';

export interface MerchantLoyaltyProfile {
  merchantId: string;
  merchantName: string;
  monthlyOrdersCount: number;
  currentTier: MerchantTier;
  commissionDiscountPercent: number; // e.g. 15% discount on commission
  priorityDispatch: boolean;
  dedicatedCourierAssigned: boolean;
  totalReferralCreditsLira: number;
  activeDeliveryPackagesCount: number;
}

export interface WinBackOffer {
  id: string;
  userId: string;
  userName: string;
  daysInactive: number;
  offerDescription: string;
  couponCode: string;
  discountAmountLira: number;
  expiresAt: string;
  isRedeemed: boolean;
}

export interface GiftCredit {
  id: string;
  senderId: string;
  senderName: string;
  recipientContact: string;
  recipientName: string;
  amountLira: number;
  message: string;
  redemptionCode: string;
  status: 'sent' | 'redeemed' | 'cancelled';
  createdAt: string;
  redeemedAt?: string;
  redeemedByUserId?: string;
}

export interface FraudAuditRecord {
  id: string;
  timestamp: string;
  actorId: string;
  actorName: string;
  actionType:
    | 'SUSPICIOUS_REFERRAL'
    | 'SELF_REFERRAL_BLOCKED'
    | 'DUPLICATE_COUPON_BLOCKED'
    | 'SUSPICIOUS_VELOCITY'
    | 'UNUSUAL_POINTS_SPIKE';
  details: string;
  severity: 'low' | 'medium' | 'high';
  resolved: boolean;
  resolutionNote?: string;
  resolvedBy?: string;
  resolvedAt?: string;
}

export interface LoyaltyCampaignMetrics {
  totalPointsIssued: number;
  totalPointsRedeemed: number;
  totalPointsLiabilityLira: number;
  totalReferralsGenerated: number;
  totalReferralsQualified: number;
  referralConversionRatePercent: number;
  totalReferralRewardsPaidLira: number;
  costPerAcquiredUserLira: number;
  totalCampaignDiscountsGivenLira: number;
  totalDriverQuestBonusesPaidLira: number;
  totalMerchantCreditsGivenLira: number;
  totalProgramCostLira: number;
}
