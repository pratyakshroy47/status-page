export type ServiceStatus = 'operational' | 'degraded' | 'partial_outage' | 'major_outage';

export interface Service {
  id: string;
  name: string;
  description: string;
  status: ServiceStatus;
  organization_id: string;
  created_at: string;
  updated_at: string;
}

export interface Organization {
  id: string;
  name: string;
  subdomain: string;
  description: string;
  created_at: string;
  updated_at: string;
} 