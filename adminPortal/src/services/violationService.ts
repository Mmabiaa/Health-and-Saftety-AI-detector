export interface CaptureResult {
  success: boolean;
  missingEquipment: string[];
  timestamp: Date;
  imageData?: string;
}

export interface Violation {
  workerId: string;
  entryPoint: string;
  attempts: CaptureResult[];
  totalAttempts: number;
  timestamp: Date;
  id?: string;
  status?: 'pending' | 'investigating' | 'resolved' | 'success';
  severity?: 'high' | 'medium' | 'low';
  finalResult?: 'success' | 'failed';
}

export interface SafetyRecord {
  workerId: string;
  entryPoint: string;
  attempts: CaptureResult[];
  totalAttempts: number;
  timestamp: Date;
  id: string;
  status: 'success' | 'failed';
  finalResult: 'success' | 'failed';
  duration?: number; // Time taken for all attempts in seconds
}

class ViolationService {
  private violations: Violation[] = [];
  private allRecords: SafetyRecord[] = [];
  private listeners: ((violations: Violation[]) => void)[] = [];
  private recordListeners: ((records: SafetyRecord[]) => void)[] = [];

  // Add a new violation from worker portal (failed attempts)
  addViolation(violation: Violation) {
    const newViolation: Violation = {
      ...violation,
      id: Date.now().toString(),
      status: 'pending',
      severity: this.calculateSeverity(violation),
      finalResult: 'failed',
    };
    
    this.violations.unshift(newViolation);
    
    // Also add to all records
    const record: SafetyRecord = {
      ...newViolation,
      id: newViolation.id!, // We know id is set above
      status: 'failed',
      finalResult: 'failed',
    };
    this.allRecords.unshift(record);
    
    this.notifyListeners();
    this.notifyRecordListeners();
    this.saveToStorage();
  }

  // Add a successful attempt record
  addSuccessRecord(record: Omit<SafetyRecord, 'id' | 'status' | 'finalResult'>) {
    const newRecord: SafetyRecord = {
      ...record,
      id: Date.now().toString(),
      status: 'success',
      finalResult: 'success',
    };
    
    this.allRecords.unshift(newRecord);
    this.notifyRecordListeners();
    this.saveToStorage();
  }

  // Get all violations (failed attempts only)
  getViolations(): Violation[] {
    return this.violations;
  }

  // Get all safety records (both successful and failed)
  getAllRecords(): SafetyRecord[] {
    return this.allRecords;
  }

  // Get successful records only
  getSuccessRecords(): SafetyRecord[] {
    return this.allRecords.filter(record => record.status === 'success');
  }

  // Get failed records only
  getFailedRecords(): SafetyRecord[] {
    return this.allRecords.filter(record => record.status === 'failed');
  }

  // Update violation status
  updateViolationStatus(violationId: string, status: 'pending' | 'investigating' | 'resolved') {
    const violation = this.violations.find(v => v.id === violationId);
    if (violation) {
      violation.status = status;
      this.notifyListeners();
      this.saveToStorage();
    }
  }

  // Calculate severity based on missing equipment
  private calculateSeverity(violation: Violation): 'high' | 'medium' | 'low' {
    const allAttempts = violation.attempts.flatMap(attempt => attempt.missingEquipment);
    const uniqueMissing = [...new Set(allAttempts)];
    
    // High severity for critical safety equipment
    const criticalEquipment = ['Hard Hat', 'Safety Vest'];
    const hasCriticalMissing = uniqueMissing.some(equipment => criticalEquipment.includes(equipment));
    
    if (hasCriticalMissing) return 'high';
    if (uniqueMissing.length >= 2) return 'medium';
    return 'low';
  }

  // Subscribe to violation updates
  subscribe(listener: (violations: Violation[]) => void) {
    this.listeners.push(listener);
    // Return unsubscribe function
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  // Subscribe to all record updates
  subscribeToRecords(listener: (records: SafetyRecord[]) => void) {
    this.recordListeners.push(listener);
    // Return unsubscribe function
    return () => {
      this.recordListeners = this.recordListeners.filter(l => l !== listener);
    };
  }

  // Notify all listeners
  private notifyListeners() {
    this.listeners.forEach(listener => listener([...this.violations]));
  }

  // Notify all record listeners
  private notifyRecordListeners() {
    this.recordListeners.forEach(listener => listener([...this.allRecords]));
  }

  // Export records to CSV
  exportToCSV(records: SafetyRecord[] = this.allRecords): string {
    const headers = [
      'ID',
      'Worker ID',
      'Entry Point',
      'Status',
      'Total Attempts',
      'Timestamp',
      'Duration (seconds)',
      'Missing Equipment (All Attempts)',
      'Final Result'
    ];

    const csvData = records.map(record => [
      record.id,
      record.workerId,
      record.entryPoint,
      record.status,
      record.totalAttempts,
      record.timestamp.toLocaleString(),
      record.duration || 'N/A',
      record.attempts.flatMap(attempt => attempt.missingEquipment).join('; '),
      record.finalResult
    ]);

    const csvContent = [headers, ...csvData]
      .map(row => row.map(cell => `"${cell}"`).join(','))
      .join('\n');

    return csvContent;
  }

  // Export records to JSON
  exportToJSON(records: SafetyRecord[] = this.allRecords): string {
    return JSON.stringify(records, null, 2);
  }

  // Download records as file
  downloadRecords(format: 'csv' | 'json', records?: SafetyRecord[]) {
    const data = format === 'csv' ? this.exportToCSV(records) : this.exportToJSON(records);
    const blob = new Blob([data], { 
      type: format === 'csv' ? 'text/csv' : 'application/json' 
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `safety-records-${new Date().toISOString().split('T')[0]}.${format}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  // Save to localStorage
  private saveToStorage() {
    try {
      localStorage.setItem('safety-violations', JSON.stringify(this.violations));
      localStorage.setItem('safety-records', JSON.stringify(this.allRecords));
    } catch (error) {
      console.error('Failed to save data to storage:', error);
    }
  }

  // Load from localStorage
  loadFromStorage() {
    try {
      const storedViolations = localStorage.getItem('safety-violations');
      const storedRecords = localStorage.getItem('safety-records');
      
      if (storedViolations) {
        this.violations = JSON.parse(storedViolations);
      }
      
      if (storedRecords) {
        this.allRecords = JSON.parse(storedRecords);
      }
      
      this.notifyListeners();
      this.notifyRecordListeners();
    } catch (error) {
      console.error('Failed to load data from storage:', error);
    }
  }

  // Clear all data (for testing)
  clearAllData() {
    this.violations = [];
    this.allRecords = [];
    this.notifyListeners();
    this.notifyRecordListeners();
    this.saveToStorage();
  }

  // Get statistics
  getStatistics() {
    const totalRecords = this.allRecords.length;
    const successRecords = this.getSuccessRecords().length;
    const failedRecords = this.getFailedRecords().length;
    const successRate = totalRecords > 0 ? (successRecords / totalRecords * 100).toFixed(1) : '0';
    
    return {
      totalRecords,
      successRecords,
      failedRecords,
      successRate: `${successRate}%`
    };
  }
}

// Create singleton instance
export const violationService = new ViolationService();

// Load existing data on service initialization
violationService.loadFromStorage();

// Expose service to window for worker portal access
if (typeof window !== 'undefined') {
  (window as any).violationService = violationService;
} 