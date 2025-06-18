import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { Camera, Shield, HardHat, Eye } from 'lucide-react';
import CameraCapture from '@/components/CameraCapture';

interface Worker {
  id: string;
  secretNumber: string;
  entryPoint: string;
}

interface CaptureResult {
  success: boolean;
  missingEquipment: string[];
  timestamp: Date;
  imageData?: string;
}

interface Violation {
  workerId: string;
  entryPoint: string;
  attempts: CaptureResult[];
  totalAttempts: number;
  timestamp: Date;
}

const entryPoints = [
  'Main Entrance - Gate A',
  'North Shaft Entry',
  'South Shaft Entry',
  'Equipment Bay - Section B',
  'Processing Plant Entry',
  'Administration Building',
  'Emergency Exit - Zone C',
  'Maintenance Workshop'
];

const WorkerInterface = () => {
  const [worker, setWorker] = useState<Worker>({ id: '', secretNumber: '', entryPoint: '' });
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [captureAttempts, setCaptureAttempts] = useState<CaptureResult[]>([]);
  const [isCapturing, setIsCapturing] = useState(false);
  const [cameraNeedsRestart, setCameraNeedsRestart] = useState(false);
  const [sessionStartTime, setSessionStartTime] = useState<Date | null>(null);
  const { toast } = useToast();

  const handleLogin = () => {
    if (worker.id && worker.secretNumber && worker.entryPoint) {
      setIsLoggedIn(true);
      setSessionStartTime(new Date());
      toast({
        title: "Login Successful",
        description: `Welcome, Worker ${worker.id} at ${worker.entryPoint}`,
      });
    } else {
      toast({
        title: "Login Failed",
        description: "Please fill in all fields: Worker ID, Secret Number, and Entry Point",
        variant: "destructive",
      });
    }
  };

  const simulateCapture = (imageData?: string): CaptureResult => {
    // Simulate random safety equipment detection
    const allEquipment = ['Hard Hat', 'Safety Vest', 'Safety Goggles', 'Gloves'];
    const missingEquipment: string[] = [];
    
    // Randomly determine missing equipment (for simulation)
    allEquipment.forEach(equipment => {
      if (Math.random() > 0.7) { // 30% chance of missing equipment
        missingEquipment.push(equipment);
      }
    });

    return {
      success: missingEquipment.length === 0,
      missingEquipment,
      timestamp: new Date(),
      imageData,
    };
  };

  const handleCapture = async (imageData: string) => {
    setIsCapturing(true);
    
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const result = simulateCapture(imageData);
    const newAttempts = [...captureAttempts, result];
    setCaptureAttempts(newAttempts);
    
    if (result.success) {
      // Calculate session duration
      const duration = sessionStartTime ? Math.floor((new Date().getTime() - sessionStartTime.getTime()) / 1000) : undefined;
      
      // Send successful record to admin portal
      const successRecord = {
        workerId: worker.id,
        entryPoint: worker.entryPoint,
        attempts: newAttempts,
        totalAttempts: newAttempts.length,
        timestamp: new Date(),
        duration,
      };
      
      console.log('Sending successful record to admin portal:', successRecord);
      
      // Send to admin portal via shared service
      if (typeof window !== 'undefined' && (window as any).violationService) {
        (window as any).violationService.addSuccessRecord(successRecord);
      }
      
      toast({
        title: "Capture Successful ✅",
        description: "All safety equipment detected. Access granted!",
      });
      // Reset attempts on success
      setCaptureAttempts([]);
      setCameraNeedsRestart(false);
      setSessionStartTime(null);
    } else {
      const attemptNumber = newAttempts.length;
      const remainingAttempts = 3 - attemptNumber;
      
      if (attemptNumber >= 3) {
        // Calculate session duration
        const duration = sessionStartTime ? Math.floor((new Date().getTime() - sessionStartTime.getTime()) / 1000) : undefined;
        
        // Send to admin dashboard
        const violation: Violation = {
          workerId: worker.id,
          entryPoint: worker.entryPoint,
          attempts: newAttempts,
          totalAttempts: 3,
          timestamp: new Date(),
        };
        
        console.log('Sending violation to admin dashboard:', violation);
        
        // Send violation to admin portal via shared service
        if (typeof window !== 'undefined' && (window as any).violationService) {
          (window as any).violationService.addViolation(violation);
        }
        
        toast({
          title: "Access Denied - Admin Notified",
          description: "Maximum attempts reached. Your supervisor has been notified.",
          variant: "destructive",
        });
        
        // Reset for next worker
        setCaptureAttempts([]);
        setIsLoggedIn(false);
        setWorker({ id: '', secretNumber: '', entryPoint: '' });
        setCameraNeedsRestart(false);
        setSessionStartTime(null);
      } else {
        toast({
          title: `Capture Failed - Attempt ${attemptNumber}/3`,
          description: `Missing: ${result.missingEquipment.join(', ')}. ${remainingAttempts} attempts remaining. Please adjust your equipment and try again.`,
          variant: "destructive",
        });
        
        // Require camera restart for next attempt
        setCameraNeedsRestart(true);
      }
    }
    
    setIsCapturing(false);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setWorker({ id: '', secretNumber: '', entryPoint: '' });
    setCaptureAttempts([]);
    setCameraNeedsRestart(false);
    setSessionStartTime(null);
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-100 to-emerald-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md border-emerald-200">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 w-16 h-16 bg-emerald-600 rounded-full flex items-center justify-center">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-2xl text-slate-800">Mine Worker Login</CardTitle>
            <CardDescription className="text-slate-600">
              Enter your credentials to access the safety verification system
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Worker ID</label>
              <Input
                type="text"
                placeholder="Enter your worker ID"
                value={worker.id}
                onChange={(e) => setWorker({ ...worker, id: e.target.value })}
                className="border-slate-300 focus:border-emerald-500"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Secret Number</label>
              <Input
                type="password"
                placeholder="Enter your secret number"
                value={worker.secretNumber}
                onChange={(e) => setWorker({ ...worker, secretNumber: e.target.value })}
                className="border-slate-300 focus:border-emerald-500"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Entry Point</label>
              <Select value={worker.entryPoint} onValueChange={(value) => setWorker({ ...worker, entryPoint: value })}>
                <SelectTrigger className="border-slate-300 focus:border-emerald-500">
                  <SelectValue placeholder="Select your entry point" />
                </SelectTrigger>
                <SelectContent>
                  {entryPoints.map((point) => (
                    <SelectItem key={point} value={point}>
                      {point}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button 
              onClick={handleLogin} 
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              Login
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-emerald-50 p-4">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <Card className="border-emerald-200">
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="text-xl text-slate-800">Safety Verification</CardTitle>
                <CardDescription className="text-slate-600">
                  Worker ID: {worker.id} | Entry Point: {worker.entryPoint}
                </CardDescription>
              </div>
              <Button 
                onClick={handleLogout} 
                variant="outline"
                className="border-slate-300 text-slate-700 hover:bg-slate-50"
              >
                Logout
              </Button>
            </div>
          </CardHeader>
        </Card>

        {/* Safety Equipment Checklist */}
        <Card className="border-emerald-200">
          <CardHeader>
            <CardTitle className="text-lg text-slate-800 flex items-center gap-2">
              <HardHat className="w-5 h-5 text-emerald-600" />
              Required Safety Equipment
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              {['Hard Hat', 'Safety Vest', 'Safety Goggles', 'Gloves'].map((equipment) => (
                <div key={equipment} className="flex items-center gap-2 p-2 rounded-lg bg-emerald-50">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                  <span className="text-sm text-slate-700">{equipment}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Capture Section */}
        <CameraCapture 
          onCapture={handleCapture}
          isCapturing={isCapturing}
          disabled={isCapturing}
          needsRestart={cameraNeedsRestart}
          onRestart={() => setCameraNeedsRestart(false)}
          workerId={worker.id}
          entryPoint={worker.entryPoint}
          attemptNumber={captureAttempts.length + 1}
        />

        {captureAttempts.length > 0 && (
          <Alert className="border-amber-200 bg-amber-50">
            <Eye className="h-4 w-4 text-amber-600" />
            <AlertDescription className="text-amber-800">
              Attempts: {captureAttempts.length}/3 | 
              Remaining: {3 - captureAttempts.length}
              {cameraNeedsRestart && (
                <span className="block mt-1 text-sm font-medium">
                  ⚠️ Please restart camera before next attempt
                </span>
              )}
              {!cameraNeedsRestart && captureAttempts.length < 3 && (
                <span className="block mt-1 text-sm font-medium">
                  ✅ Ready for attempt {captureAttempts.length + 1} - Click "Start Attempt" when ready
                </span>
              )}
            </AlertDescription>
          </Alert>
        )}

        {/* Recent Attempts */}
        {captureAttempts.length > 0 && (
          <Card className="border-emerald-200">
            <CardHeader>
              <CardTitle className="text-lg text-slate-800">Attempt History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {captureAttempts.map((attempt, index) => (
                  <div key={index}>
                    <div 
                      className={`p-4 rounded-lg ${
                        attempt.success ? 'bg-emerald-50 border border-emerald-200' : 'bg-red-50 border border-red-200'
                      }`}
                    >
                      <div className="flex gap-4">
                        {/* Captured Image */}
                        {attempt.imageData && (
                          <div className="flex-shrink-0">
                            <img 
                              src={attempt.imageData} 
                              alt={`Capture attempt ${index + 1}`}
                              className="w-24 h-24 object-cover rounded-lg border border-slate-300"
                            />
                          </div>
                        )}
                        
                        {/* Attempt Details */}
                        <div className="flex-1">
                          <div className="flex justify-between items-start">
                            <div>
                              <p className={`font-medium ${attempt.success ? 'text-emerald-800' : 'text-red-800'}`}>
                                Attempt {index + 1}: {attempt.success ? 'Success' : 'Failed'}
                              </p>
                              <p className="text-xs text-slate-500 mb-1">
                                📸 Manually captured with countdown timer
                              </p>
                              {!attempt.success && (
                                <p className="text-sm text-red-600">
                                  Missing: {attempt.missingEquipment.join(', ')}
                                </p>
                              )}
                            </div>
                            <span className="text-xs text-slate-500">
                              {attempt.timestamp.toLocaleTimeString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Show restart indicator between failed attempts */}
                    {!attempt.success && index < captureAttempts.length - 1 && (
                      <div className="flex items-center justify-center py-2">
                        <div className="flex items-center gap-2 px-3 py-1 bg-amber-100 border border-amber-200 rounded-full">
                          <Camera className="w-4 h-4 text-amber-600" />
                          <span className="text-xs text-amber-700 font-medium">
                            Camera restart required before next attempt
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
                
                {/* Next attempt instructions */}
                {captureAttempts.length < 3 && (
                  <div className="mt-4 p-4 bg-slate-50 rounded-lg border border-slate-200">
                    <h4 className="font-medium text-slate-800 mb-2">Next Attempt Instructions:</h4>
                    <ol className="text-sm text-slate-600 space-y-1 list-decimal list-inside">
                      <li>Adjust your safety equipment based on the previous attempt results</li>
                      <li>Restart the camera if required</li>
                      <li>Position yourself properly in front of the camera</li>
                      <li>Click "Start Attempt {captureAttempts.length + 1}" when ready</li>
                      <li>Complete the countdown and photo capture</li>
                    </ol>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default WorkerInterface;
