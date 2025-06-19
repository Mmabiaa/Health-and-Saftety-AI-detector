export interface Worker {
    id: string;
    worker_id: string;
    name: string;
    email: string;
    department: string;
    title: string;
    profile_picture_url?: string;
    created_at: string;
    updated_at: string;
}

export interface SafetyCheck {
    id: string;
    worker_id: string;
    entry_point: string;
    violations: string[] | null;
    timestamp: string;
    status: 'Safe' | 'Not Safe';
    created_at: string;
}
