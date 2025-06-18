export interface CameraStream {
  workerId: string;
  entryPoint: string;
  streamId: string;
  timestamp: Date;
  isActive: boolean;
  imageData?: string;
}

class CameraStreamService {
  private streams: Map<string, CameraStream> = new Map();
  private listeners: ((streams: CameraStream[]) => void)[] = [];

  // Add or update a camera stream
  addStream(stream: CameraStream) {
    this.streams.set(stream.streamId, stream);
    this.notifyListeners();
    this.saveToStorage();
  }

  // Remove a camera stream
  removeStream(streamId: string) {
    this.streams.delete(streamId);
    this.notifyListeners();
    this.saveToStorage();
  }

  // Get all active streams
  getStreams(): CameraStream[] {
    return Array.from(this.streams.values()).filter(stream => stream.isActive);
  }

  // Get a specific stream
  getStream(streamId: string): CameraStream | undefined {
    return this.streams.get(streamId);
  }

  // Update stream image data
  updateStreamImage(streamId: string, imageData: string) {
    const stream = this.streams.get(streamId);
    if (stream) {
      stream.imageData = imageData;
      stream.timestamp = new Date();
      this.notifyListeners();
      this.saveToStorage();
    }
  }

  // Mark stream as inactive
  deactivateStream(streamId: string) {
    const stream = this.streams.get(streamId);
    if (stream) {
      stream.isActive = false;
      this.notifyListeners();
      this.saveToStorage();
    }
  }

  // Subscribe to stream updates
  subscribe(listener: (streams: CameraStream[]) => void) {
    this.listeners.push(listener);
    // Return unsubscribe function
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  // Notify all listeners
  private notifyListeners() {
    this.listeners.forEach(listener => listener(this.getStreams()));
  }

  // Save to localStorage
  private saveToStorage() {
    try {
      const streamsArray = Array.from(this.streams.values());
      localStorage.setItem('camera-streams', JSON.stringify(streamsArray));
    } catch (error) {
      console.error('Failed to save camera streams to storage:', error);
    }
  }

  // Load from localStorage
  loadFromStorage() {
    try {
      const stored = localStorage.getItem('camera-streams');
      if (stored) {
        const streamsArray = JSON.parse(stored);
        this.streams.clear();
        streamsArray.forEach((stream: CameraStream) => {
          // Only load active streams
          if (stream.isActive) {
            this.streams.set(stream.streamId, stream);
          }
        });
        this.notifyListeners();
      }
    } catch (error) {
      console.error('Failed to load camera streams from storage:', error);
    }
  }

  // Clear all streams (for testing)
  clearStreams() {
    this.streams.clear();
    this.notifyListeners();
    this.saveToStorage();
  }

  // Generate unique stream ID
  generateStreamId(): string {
    return `stream_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}

// Create singleton instance
export const cameraStreamService = new CameraStreamService();

// Load existing data on service initialization
cameraStreamService.loadFromStorage();

// Expose service to window for worker portal access
if (typeof window !== 'undefined') {
  (window as any).cameraStreamService = cameraStreamService;
} 