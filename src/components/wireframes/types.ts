import React from 'react';

export interface TfksMasterSpec {
  purpose: string; // 1. BU BÖLÜMÜN AMACI: Bu bölüm ne işe yarar?
  whatItDoes: string; // 2. NE YAPACAK: Yapay zekâ bu bölümde hangi işi yapacak?
  howItDoes: string[]; // 3. NASIL YAPACAK: Bu işi hangi sırayla, hangi mantıkla, hangi kontrolle yapacak?
  output: string; // 4. ÇIKTI NE OLACAK: Bu bölümün sonunda kullanıcıya ne üretilecek?
  weakVsStrong: {
    weak: string;
    weakReason: string;
    strong: string;
  };
  buttonDirectives: {
    name: string;
    role: string;
    precondition: string;
    action: string;
    validation: string;
    errorMessage: string;
    successResult: string;
    auditLog: string;
  }[];
  dataAndValidation: {
    field: string;
    type: string;
    rule: string;
    riskIfNotValidated: string;
  }[];
  authorityAndBlockage: {
    authorizedRoles: string[];
    secondaryApprovalRequired: boolean;
    blockageTrigger: string;
    blockageResolver: string;
  };
  auditLogContract: {
    loggedEvents: string[];
    fieldsCaptured: string[];
    immutableSeal: boolean;
  };
  testAndAcceptance: {
    testName: string;
    givenCondition: string;
    whenAction: string;
    thenExpected: string;
    acceptanceCriteria: string;
  };
}

export interface WireframeScreen {
  id: string;
  category: 'customer' | 'courier' | 'business' | 'admin';
  categoryLabel: string;
  stepNumber: string;
  title: string;
  subtitle: string;
  userGoal: string;
  triggerAction: string;
  uxHighlights: string[];
  securityRule: string;
  apiEndpoint: string;
  apiPayload: string;
  designTokens: {
    typography: string;
    colors: string[];
    touchTarget: string;
    elevation: string;
  };
  edgeCases: string[];
  screenVisual: React.ReactNode;
  tfksMasterSpec?: TfksMasterSpec;
}

