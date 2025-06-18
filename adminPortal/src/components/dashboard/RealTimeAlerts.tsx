import React from 'react';
import { AlertTriangle, Clock, Camera, X } from 'lucide-react';

interface Alert {
  id: number;
  type: string;
  camera: string;
  timestamp: Date;
  severity: 'high' | 'medium' | 'low';
}

interface RealTimeAlertsProps {
  alerts: Alert[];
}

const RealTimeAlerts: React.FC<RealTimeAlertsProps> = ({ alerts }) => {
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high':
        return 'border-red-400 bg-red-50 text-red-800';
      case 'medium':
        return 'border-amber-400 bg-amber-50 text-amber-800';
      case 'low':
        return 'border-emerald-400 bg-emerald-50 text-emerald-800';
      default:
        return 'border-slate-400 bg-slate-50 text-slate-800';
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour12: false, 
      hour: '2-digit', 
      minute: '2-digit',
      second: '2-digit'
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border-emerald-200">
      <div className="px-6 py-4 border-b border-slate-200">
        <h3 className="text-lg font-semibold text-slate-800 flex items-center space-x-2">
          <AlertTriangle className="h-5 w-5 text-emerald-600" />
          <span>Real-Time Alerts</span>
          {alerts.length > 0 && (
            <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
              {alerts.length}
            </span>
          )}
        </h3>
      </div>
      
      <div className="max-h-96 overflow-y-auto">
        {alerts.length === 0 ? (
          <div className="p-6 text-center text-slate-500">
            <AlertTriangle className="h-12 w-12 text-slate-300 mx-auto mb-3" />
            <p className="font-medium">No active alerts</p>
            <p className="text-sm">All safety protocols are being followed</p>
          </div>
        ) : (
          <div className="space-y-3 p-4">
            {alerts.map((alert) => (
              <div
                key={alert.id}
                className={`border-l-4 rounded-lg p-4 ${getSeverityColor(alert.severity)} animate-fadeIn`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <AlertTriangle className="h-4 w-4" />
                      <span className="font-semibold text-sm">{alert.type}</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        alert.severity === 'high' ? 'bg-red-200 text-red-800' :
                        alert.severity === 'medium' ? 'bg-amber-200 text-amber-800' :
                        'bg-emerald-200 text-emerald-800'
                      }`}>
                        {alert.severity.toUpperCase()}
                      </span>
                    </div>
                    <div className="flex items-center space-x-4 text-xs opacity-75">
                      <div className="flex items-center space-x-1">
                        <Camera className="h-3 w-3" />
                        <span>{alert.camera}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="h-3 w-3" />
                        <span>{formatTime(alert.timestamp)}</span>
                      </div>
                    </div>
                  </div>
                  <button className="text-slate-400 hover:text-slate-600 ml-2">
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default RealTimeAlerts;