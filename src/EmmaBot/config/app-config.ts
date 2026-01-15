export interface AppConfig {
  pageTitle: string;
  pageDescription: string;
  companyName: string;

  supportsChatInput: boolean;
  supportsVideoInput: boolean;
  supportsScreenShare: boolean;
  isPreConnectBufferEnabled: boolean;

  logo: string;
  startButtonText: string;
  accent?: string;
  logoDark?: string;
  accentDark?: string;

  // for LiveKit Cloud Sandbox (optional)
  sandboxId?: string;
  agentName?: string;
}

export const APP_CONFIG_DEFAULTS: AppConfig = {
  companyName: 'Emma-Khan-Client-Side',
  pageTitle: 'Emma Khan - Drive Thru Assistant',
  pageDescription: 'Your premium AI drive-thru assistant',

  supportsChatInput: true,
  supportsVideoInput: true,
  supportsScreenShare: false,
  isPreConnectBufferEnabled: true,

  logo: '/images/brand-logo.png',
  accent: '#76b900',
  logoDark: '/images/brand-logo.png',
  accentDark: '#76b900',
  startButtonText: 'Start Order',

  // for LiveKit Cloud Sandbox (optional)
  sandboxId: undefined,
  agentName: 'drive-thru',
};
