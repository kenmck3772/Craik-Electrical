
import { 
  LayoutDashboard, 
  Briefcase, 
  Box, 
  Bot, 
  Settings, 
  Zap,
  Eye,
  Rocket
} from 'lucide-react';
import { Job, ViewType } from './types';

export const COMPANY_NAME = "CRAIK ELECTRICAL";
export const APP_VERSION = "v1.1.0-VISION";

export const NAV_ITEMS = [
  { id: 'dashboard' as ViewType, label: 'DASHBOARD', icon: LayoutDashboard },
  { id: 'jobs' as ViewType, label: 'JOBS', icon: Briefcase },
  { id: 'materials' as ViewType, label: 'MATERIALS', icon: Box },
  { id: 'vision-link' as ViewType, label: 'VISION LINK', icon: Eye },
  { id: 'future-tech' as ViewType, label: 'FUTURE TECH', icon: Rocket },
  { id: 'ai-assistant' as ViewType, label: 'AI HELP', icon: Bot },
  { id: 'settings' as ViewType, label: 'SETTINGS', icon: Settings },
];

export const MOCK_JOBS: Job[] = [
  {
    id: 'J-1024',
    clientName: 'Sarah Lawson',
    address: '12 Ferry Rd, Montrose',
    title: 'Consumer Unit Upgrade',
    status: 'active',
    scheduledDate: '2025-05-24',
    description: 'Replace old fuse board with dual RCD 10-way board.',
    materials: [
      { id: 'M1', name: 'Dual RCD Board', quantity: 1, unitPrice: 120 }
    ]
  },
  {
    id: 'J-1025',
    clientName: 'James Miller',
    address: 'Industrial Estate Unit 4',
    title: '3-Phase Inspection',
    status: 'pending',
    scheduledDate: '2025-05-24',
    description: 'Periodic EICR for industrial machinery units.',
    materials: []
  },
  {
    id: 'J-1026',
    clientName: 'Hotel Central',
    address: 'High St, Montrose',
    title: 'Emergency Lighting',
    status: 'on-hold',
    scheduledDate: '2025-05-25',
    description: 'Test and replace battery packs in corridor units.',
    materials: []
  }
];
