
export type JobStatus = 'pending' | 'active' | 'on-hold' | 'completed';

export interface Material {
  id: string;
  name: string;
  quantity: number;
  unitQuantity?: number;
  unitPrice: number;
  unitCost?: number;
  description?: string;
  barcode?: string;
}

export interface Job {
  id: string;
  clientName: string;
  address: string;
  title: string;
  status: JobStatus;
  scheduledDate: string;
  description: string;
  materials: Material[];
}

export interface TimeEntry {
  jobId: string;
  startTime: Date;
  endTime?: Date;
  totalMinutes: number;
}

export enum MessageRole {
  USER = 'user',
  MODEL = 'model'
}

export interface ChatMessage {
  role: MessageRole;
  text: string;
}

export type ViewType = 'dashboard' | 'jobs' | 'materials' | 'ai-assistant' | 'vision-link' | 'future-tech' | 'settings';
