import React, { useState, useEffect } from 'react';
import { Camera, Users, Clock, MapPin, Eye, EyeOff } from 'lucide-react';
import { cameraStreamService, CameraStream } from '../services/cameraStreamService';

const LiveCameraFeed: React.FC = () => {
  const [streams, setStreams] = useState<CameraStream[]>([]);
  const [selectedStream, setSelectedStream] = useState<CameraStream | null>(null);
  const [autoRefresh, setAutoRefresh] = useState(true);

  useEffect(() => {
    // Subscribe to stream updates
    const unsubscribe = cameraStreamService.subscribe((updatedStreams) => {
      setStreams(updatedStreams);
    });

    // Load initial streams
    setStreams(cameraStreamService.getStreams());

    return unsubscribe;
  }, []);

  // Auto-refresh images every 2 seconds
  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      // Trigger a re-render to show updated timestamps
      setStreams([...cameraStreamService.getStreams()]);
    }, 2000);

    return () => clearInterval(interval);
  }, [autoRefresh]);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour12: false, 
      hour: '2-digit', 
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const getTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) return `${diffInSeconds}s ago`;
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    return `${Math.floor(diffInSeconds / 3600)}h ago`;
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border-emerald-200">
      <div className="px-6 py-4 border-b border-slate-200">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-slate-800 flex items-center space-x-2">
            <Camera className="h-5 w-5 text-emerald-600" />
            <span>Live Camera Feeds</span>
            {streams.length > 0 && (
              <span className="bg-emerald-500 text-white text-xs px-2 py-1 rounded-full">
                {streams.length} Active
              </span>
            )}
          </h3>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setAutoRefresh(!autoRefresh)}
              className={`flex items-center space-x-1 px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                autoRefresh 
                  ? 'bg-emerald-100 text-emerald-800' 
                  : 'bg-slate-100 text-slate-600'
              }`}
            >
              {autoRefresh ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
              <span>{autoRefresh ? 'Auto' : 'Manual'}</span>
            </button>
          </div>
        </div>
      </div>
      
      <div className="p-6">
        {streams.length === 0 ? (
          <div className="text-center text-slate-500 py-12">
            <Camera className="h-16 w-16 text-slate-300 mx-auto mb-4" />
            <p className="font-medium mb-2">No active camera feeds</p>
            <p className="text-sm">Workers will appear here when they start using the camera</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {streams.map((stream) => (
              <div
                key={stream.streamId}
                className={`border-2 rounded-lg overflow-hidden transition-all duration-200 cursor-pointer ${
                  selectedStream?.streamId === stream.streamId
                    ? 'border-emerald-500 shadow-lg'
                    : 'border-slate-200 hover:border-emerald-300'
                }`}
                onClick={() => setSelectedStream(stream)}
              >
                {/* Camera Feed Image */}
                <div className="relative bg-slate-900 h-48">
                  {stream.imageData ? (
                    <img
                      src={stream.imageData}
                      alt={`Live feed from ${stream.workerId}`}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <div className="text-center text-slate-400">
                        <Camera className="h-12 w-12 mx-auto mb-2" />
                        <p className="text-sm">No image available</p>
                      </div>
                    </div>
                  )}
                  
                  {/* Live indicator */}
                  <div className="absolute top-2 right-2 flex items-center space-x-1 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                    <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                    <span>LIVE</span>
                  </div>
                </div>

                {/* Stream Info */}
                <div className="p-4 bg-white">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-slate-800 flex items-center space-x-1">
                      <Users className="h-4 w-4 text-emerald-600" />
                      <span>{stream.workerId}</span>
                    </h4>
                    <span className="text-xs text-slate-500">
                      {getTimeAgo(stream.timestamp)}
                    </span>
                  </div>
                  
                  <div className="flex items-center space-x-2 text-sm text-slate-600 mb-2">
                    <MapPin className="h-4 w-4" />
                    <span>{stream.entryPoint}</span>
                  </div>
                  
                  <div className="flex items-center space-x-2 text-xs text-slate-500">
                    <Clock className="h-3 w-3" />
                    <span>Last update: {formatTime(stream.timestamp)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Selected Stream Modal */}
        {selectedStream && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-slate-800">
                  Live Feed: {selectedStream.workerId}
                </h3>
                <button
                  onClick={() => setSelectedStream(null)}
                  className="text-slate-400 hover:text-slate-600"
                >
                  ✕
                </button>
              </div>
              
              <div className="p-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Large Image */}
                  <div className="bg-slate-900 rounded-lg overflow-hidden">
                    {selectedStream.imageData ? (
                      <img
                        src={selectedStream.imageData}
                        alt={`Live feed from ${selectedStream.workerId}`}
                        className="w-full h-96 object-cover"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-96">
                        <div className="text-center text-slate-400">
                          <Camera className="h-16 w-16 mx-auto mb-4" />
                          <p>No image available</p>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {/* Stream Details */}
                  <div className="space-y-4">
                    <div className="bg-slate-50 rounded-lg p-4">
                      <h4 className="font-semibold text-slate-800 mb-3">Stream Information</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-slate-600">Worker ID:</span>
                          <span className="font-medium">{selectedStream.workerId}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-600">Entry Point:</span>
                          <span className="font-medium">{selectedStream.entryPoint}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-600">Stream ID:</span>
                          <span className="font-medium text-xs">{selectedStream.streamId}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-600">Started:</span>
                          <span className="font-medium">{selectedStream.timestamp.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-600">Last Update:</span>
                          <span className="font-medium">{formatTime(selectedStream.timestamp)}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-emerald-50 rounded-lg p-4">
                      <h4 className="font-semibold text-emerald-800 mb-2">Status</h4>
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                        <span className="text-sm text-emerald-700">Active - Worker is using camera</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LiveCameraFeed; 