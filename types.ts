export enum TradeType {
  PLOMERIA = 'Plomería',
  GASISTA = 'Gasista',
  ELECTRICISTA = 'Electricista',
  TECHISTA = 'Techista',
  CARPINTERO = 'Carpintero',
  PINTOR = 'Pintor',
  JARDINERO = 'Jardinero',
  PILETERO = 'Piletero',
  ARQUITECTO = 'Arquitecto',
  VARIOS = 'Mantenimiento General'
}

export interface Review {
  author: string;
  rating: number;
  comment: string;
}

export interface PortfolioItem {
  id: string;
  title: string;
  imageUrl: string;
  description: string;
}

export interface Professional {
  id: string;
  name: string;
  trade: TradeType;
  rating: number;
  reviewCount: number;
  verified: boolean;
  location: string; // Neighborhood or Zone
  hourlyRateArg?: number; // Estimated
  imageUrl: string;
  description: string;
  reviews: Review[];
  portfolio: PortfolioItem[];
  phone: string; // Hidden until payment
  email: string; // Hidden until payment
}

export interface UserRequest {
  name: string;
  phone: string;
  email: string;
  location: string;
  problemDescription: string;
}

export interface AIAnalysisResult {
  trade: TradeType;
  reasoning: string;
  urgency: 'Alta' | 'Media' | 'Baja';
}

export interface MarketingStrategy {
  targetAudience: string;
  platform: string;
  adCopy: string;
  callToAction: string;
  imageDescription: string;
  hashtags: string[];
}

// --- NEW CORPORATE TYPES ---

export interface CompanyStats {
  activeUsers: number;
  activePros: number;
  monthlyRevenueUSD: number;
  marketSentiment: number; // 0 to 100
}

export type AgentRole = 'RECRUITER_BOT' | 'MARKETING_BOT' | 'FINANCE_BOT' | 'STRATEGY_BOT';

export interface CorporateAction {
  role: AgentRole;
  action: string; // "Scraping LinkedIn...", "Launching Ads..."
  outcome: string; // "+5 Pros added", "+12 Users added"
  requiresApproval: boolean;
  approvalMessage?: string;
  deltaUsers: number;
  deltaPros: number;
  deltaRevenue: number;
}