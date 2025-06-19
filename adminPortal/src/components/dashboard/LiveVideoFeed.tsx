import React, { useState } from 'react';
import { Play, Pause, Maximize, Volume2, Settings } from 'lucide-react';

interface LiveVideoFeedProps {
  selectedCamera: string;
}

const LiveVideoFeed: React.FC<LiveVideoFeedProps> = ({ selectedCamera }) => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [showOverlay, setShowOverlay] = useState(true);

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="bg-gray-900 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
          <h3 className="text-white font-semibold">Live Feed - {selectedCamera.replace('-', ' ').toUpperCase()}</h3>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowOverlay(!showOverlay)}
            className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
              showOverlay ? 'bg-yellow-500 text-black' : 'bg-gray-700 text-white'
            }`}
          >
            Detection {showOverlay ? 'ON' : 'OFF'}
          </button>
        </div>
      </div>
      
      <div className="relative bg-gray-800 aspect-video">
        {/* Simulated video feed */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center">
          <div className="text-center text-white">
            <div className="w-16 h-16 bg-yellow-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Play className="h-8 w-8 text-black" />
            </div>
            <p className="text-lg font-semibold mb-2">Live Construction Site Feed</p>
            <p className="text-sm opacity-75">Zone Alpha - Building Construction Area</p>
          </div>
        </div>

        {/* Detection overlay */}
        {showOverlay && (
          <>
            {/* Worker detection boxes */}
            <div className="absolute top-20 left-12 w-24 h-32 border-2 border-green-400 rounded">
              <div className="bg-green-400 text-black text-xs px-2 py-1 rounded-b">
                Worker #1 ✓
              </div>
            </div>
            
            <div className="absolute top-16 right-20 w-20 h-28 border-2 border-red-400 rounded">
              <div className="bg-red-400 text-white text-xs px-2 py-1 rounded-b">
                No Helmet!
              </div>
            </div>
            
            <div className="absolute bottom-20 left-1/3 w-22 h-30 border-2 border-green-400 rounded">
              <div className="bg-green-400 text-black text-xs px-2 py-1 rounded-b">
                Worker #2 ✓
              </div>
            </div>

            {/* Restricted zone */}
            <div className="absolute bottom-0 right-0 w-32 h-24 border-2 border-yellow-400 border-dashed bg-yellow-400 bg-opacity-20">
              <div className="bg-yellow-400 text-black text-xs px-2 py-1">
                Restricted Zone
              </div>
            </div>
          </>
        )}

        {/* Video controls */}
        <div className="absolute bottom-4 left-4 flex items-center space-x-2">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition-colors"
          >
            {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          </button>
          <button className="bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition-colors">
            <Volume2 className="h-4 w-4" />
          </button>
          <button className="bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition-colors">
            <Settings className="h-4 w-4" />
          </button>
        </div>

        <button className="absolute bottom-4 right-4 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition-colors">
          <Maximize className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

export default LiveVideoFeed;