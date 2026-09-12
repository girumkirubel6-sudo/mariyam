export type UserRole = 'ADMIN' | 'REGIONAL_ADMIN' | 'ZONE_ADMIN' | 'RESEARCHER' | 'PUBLIC';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  regionId?: string;
  zoneId?: string;
  createdAt?: string;
}

export interface AuthResponse {
  token: string;
  user: User;
  message?: string;
}

export type HeritageType = 'LITERATURE' | 'ARCHIVE' | 'MANUSCRIPT';

export type SubmissionStatus = 
  | 'SUBMITTED' 
  | 'UNDER_REVIEW' 
  | 'APPROVED' 
  | 'REJECTED' 
  | 'COLLECTED' 
  | 'ARCHIVED';

export type WorkflowStatus = SubmissionStatus;

export type AssessmentDecision = 'APPROVED' | 'REJECTED' | 'NEEDS_REVISION';

export interface Region {
  id: string;
  name: string;
  amharicName?: string;
  code: string;
  capital: string;
  description: string;
  historicalSignificance?: string;
  zonesCount?: number;
  recordsCount?: number;
  zones?: Zone[];
}

export interface Zone {
  id: string;
  name: string;
  amharicName?: string;
  code?: string;
  capital?: string;
  regionId: string;
  regionName?: string;
  description?: string;
  recordsCount?: number;
}

export interface LiteratureItem {
  id: string;
  title: string;
  author: string;
  language: string;
  publicationYear: number | string;
  category: string;
  description: string;
  location: string;
  regionId: string;
  zoneId: string;
  regionName?: string;
  zoneName?: string;
  status: SubmissionStatus;
  coverImage?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ArchiveItem {
  id: string;
  title: string;
  archiveType: string;
  description: string;
  date: string;
  language: string;
  location: string;
  regionId: string;
  zoneId: string;
  regionName?: string;
  zoneName?: string;
  status: SubmissionStatus;
  documentNumber?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ManuscriptItem {
  id: string;
  title: string;
  author?: string;
  estimatedDate: string;
  language: string;
  script: string;
  description: string;
  historicalSignificance: string;
  physicalCondition: 'Pristine' | 'Good' | 'Fragile' | 'Damaged' | 'Critical';
  currentLocation: string;
  regionId: string;
  zoneId: string;
  regionName?: string;
  zoneName?: string;
  status: SubmissionStatus;
  digitalFiles?: string[];
  fileUrl?: string;
  fileName?: string;
  fileSize?: string;
  foliopages?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface Submission {
  id: string;
  title: string;
  itemTitle?: string;
  itemType: HeritageType | string;
  itemId?: string;
  submitterId?: string;
  submitterName: string;
  submitterEmail?: string;
  status: SubmissionStatus;
  submittedAt: string;
  notes?: string;
  regionId?: string;
  zoneId?: string;
  regionName?: string;
  zoneName?: string;
  itemData?: LiteratureItem | ArchiveItem | ManuscriptItem;
}

export type SubmissionItem = Submission;

export interface Assessment {
  id: string;
  submissionId: string;
  submissionTitle?: string;
  reviewerId?: string;
  reviewerName?: string;
  assessorName?: string;
  decision?: AssessmentDecision;
  score: number; // 0-100
  condition?: string;
  historicalValue?: string;
  comments: string;
  createdAt?: string;
  assessedAt?: string;
}

export type AssessmentItem = Assessment;

export interface CollectionRecord {
  id: string;
  submissionId: string;
  submissionTitle?: string;
  itemType?: HeritageType;
  collectorId?: string;
  collectorName?: string;
  collectionDate?: string;
  collectedAt?: string;
  collectionLocation?: string;
  vaultLocation?: string;
  collectionMethod?: string;
  curatorNotes?: string;
  notes?: string;
  status?: 'APPROVED' | 'COLLECTED' | 'ARCHIVED';
  createdAt?: string;
}

export type CollectionItem = CollectionRecord;

export interface DashboardStats {
  totalUsers: number;
  totalRegions: number;
  totalZones: number;
  totalLiterature: number;
  totalArchives: number;
  totalManuscripts: number;
  totalSubmissions: number;
  pendingSubmissions: number;
  underReviewSubmissions?: number;
  approvedSubmissions: number;
  collectedSubmissions: number;
  archivedSubmissions?: number;
  recentActivity?: Array<{
    id: string;
    action: string;
    itemTitle: string;
    user: string;
    timestamp: string;
    status: SubmissionStatus;
  }>;
}

export interface SearchFilters {
  keyword?: string;
  type?: string;
  regionId?: string;
  zoneId?: string;
  language?: string;
  status?: string;
  date?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  suggestedAction?: {
    label: string;
    link: string;
  };
}
