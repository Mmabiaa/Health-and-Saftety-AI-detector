import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { Camera, Shield, HardHat, Eye } from 'lucide-react';
import CameraCapture from '@/components/CameraCapture';
import { supabase } from '@/lib/supabase'; // Adjust the path to your supabase.ts file
import bcrypt from 'bcryptjs';

interface Worker {
  id: string;
  secretNumber: string;
  entryPoint: string;
}

interface RoboflowPrediction {
  class: string;
  confidence: number;
  x: number;
  y: number;
  width: number;
  height: number;
  class_id: number;
  detection_id: string;
}

interface RoboflowResponse {
  predictions: RoboflowPrediction[];
  time: number;
  inference_id: string;
  image: {
    width: number;
    height: number;
  };
}

interface CaptureResult {
  success: boolean;
  missingEquipment: string[];
  detectedEquipment: string[];
  timestamp: Date;
  imageData?: string;
  detectionResults?: RoboflowResponse;
}

interface Violation {
  workerId: string;
  entryPoint: string;
  attempts: CaptureResult[];
  totalAttempts: number;
  timestamp: Date;
}

interface SafetyCheckRecord {
  worker_id: string;
  entry_point: string;
  violations: string[] | null;
  timestamp: string;
  status: 'Safe' | 'Not Safe';
}

const entryPoints = [
  'Main entrance-Gate A',
  'North shaft entry',
  'South shaft entry',
  'Equipment Bay-Section B',
  'Processing Plant entry',
  'Administration Building',
  'Emergency Exit-Zone C',
  'Maintenance Workshop'
];

const ROBOFLOW_API_URL = "https://serverless.roboflow.com/safety-pyazl/1";
const ROBOFLOW_API_KEY = "4s8SWfOoHTYag8RSgKuW";

const WorkerInterface = () => {
  const [worker, setWorker] = useState<Worker>({ id: '', secretNumber: '', entryPoint: '' });
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [captureAttempts, setCaptureAttempts] = useState<CaptureResult[]>([]);
  const [isCapturing, setIsCapturing] = useState(false);
  const [cameraNeedsRestart, setCameraNeedsRestart] = useState(false);
  const [sessionStartTime, setSessionStartTime] = useState<Date | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleLogin = async () => {
    if (!worker.id || !worker.secretNumber || !worker.entryPoint) {
      toast({
        title: "Login Failed",
        description: "Please fill in all fields: Worker ID, Secret Number, and Entry Point",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setIsLoggedIn(false);

    let authenticationSuccessful = false;

    try {
      console.log('=== AUTHENTICATION START ===');
      console.log('Attempting to authenticate worker:', worker.id);
      console.log('Entry point:', worker.entryPoint);
      
      const { data, error } = await supabase
        .from('workers')
        .select('worker_id, secret_code')
        .eq('worker_id', worker.id)
        .single();

      console.log('Database query result:');
      console.log('- Data:', data);
      console.log('- Error:', error);
      console.log('- Has data:', !!data);

      if (error) {
        console.error('❌ Database error occurred:', error);
        console.log('Error code:', error.code);
        console.log('Error message:', error.message);
        
        if (error.code === 'PGRST116') {
          console.log('❌ Worker not found (PGRST116)');
          throw new Error('Worker ID not found in system');
        }
        throw new Error(`Database connection failed: ${error.message}`);
      }

      if (!data) {
        console.error('❌ No worker data returned despite no error');
        throw new Error('Worker authentication failed - no data returned');
      }

      console.log('✅ Worker found in database');
      console.log('Worker ID from DB:', data.worker_id);
      console.log('Secret code exists:', !!data.secret_code);
      
      if (!data.secret_code || data.secret_code.trim() === '') {
        console.error('❌ No secret_code in database for worker');
        throw new Error('Worker account not properly configured');
      }

      console.log('✅ Secret code found in database');
      console.log('Hash length:', data.secret_code.length);
      console.log('Hash starts with:', data.secret_code.substring(0, 10));

      console.log('Step 5: Verifying password...');
      console.log('Input password:', worker.secretNumber);
      console.log('Input password length:', worker.secretNumber.length);

      let passwordMatches = false;
      try {
        passwordMatches = await bcrypt.compare(worker.secretNumber, data.secret_code);
        console.log('Bcrypt comparison completed');
        console.log('Password matches:', passwordMatches);
      } catch (bcryptError) {
        console.error('❌ Bcrypt comparison error:', bcryptError);
        throw new Error('Password verification system error');
      }
      
      if (passwordMatches !== true) {
        console.log('❌ Password verification FAILED');
        console.log('Expected: true, Got:', passwordMatches);
        throw new Error('Invalid worker ID or password');
      }

      console.log('✅ ALL AUTHENTICATION CHECKS PASSED');
      authenticationSuccessful = true;

    } catch (error) {
      console.error('=== AUTHENTICATION FAILED ===');
      console.error('Error details:', error);
      
      authenticationSuccessful = false;
      
      let errorMessage = "Authentication failed";
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      
      toast({
        title: "Login Failed",
        description: errorMessage,
        variant: "destructive",
      });
      
      console.log('Authentication result: FAILED');
      
    } finally {
      setIsLoading(false);
      
      if (authenticationSuccessful === true) {
        console.log('=== SETTING LOGIN STATE TO TRUE ===');
        setIsLoggedIn(true);
        setSessionStartTime(new Date());
        
        toast({
          title: "Login Successful",
          description: `Welcome, Worker ${worker.id} at ${worker.entryPoint}`,
        });
      } else {
        console.log('=== KEEPING LOGIN STATE FALSE ===');
        setIsLoggedIn(false);
      }
      
      console.log('Final login state:', authenticationSuccessful);
      console.log('=== AUTHENTICATION END ===');
    }
  };

  const analyzeImageWithRoboflow = async (imageData: string): Promise<RoboflowResponse> => {
    try {
      const base64Data = imageData.replace(/^data:image\/\w+;base64,/, '');
     
      const response = await fetch(`${ROBOFLOW_API_URL}?api_key=${ROBOFLOW_API_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: base64Data,
      });

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }

      const result = await response.json() as RoboflowResponse;
      console.log('Roboflow API Response:', result);
      return result;
    } catch (error) {
      console.error('Error analyzing image with Roboflow:', error);
      throw error;
    }
  };

  const processDetectionResults = (results: RoboflowResponse): CaptureResult => {
    const detectedClasses = results.predictions.map(pred => pred.class.toLowerCase());
    console.log('Detected classes:', detectedClasses);
   
    const equipmentMapping = {
      'safety vest': 'vest',
      'helmet': 'helmet',
      'boots': 'boots'
    };
   
    const requiredEquipment = ['vest', 'helmet', 'boots'];
    const detectedEquipment: string[] = [];
    const missingEquipment: string[] = [];
   
    requiredEquipment.forEach(equipment => {
      let isDetected = false;
     
      switch (equipment) {
        case 'vest':
          isDetected = detectedClasses.includes('vest');
          break;
        case 'helmet':
          isDetected = detectedClasses.includes('helmet');
          break;
        case 'boots':
          isDetected = detectedClasses.includes('boots');
          break;
      }
     
      if (isDetected) {
        detectedEquipment.push(equipment);
      } else {
        missingEquipment.push(equipment);
      }
    });

    return {
      success: missingEquipment.length === 0,
      missingEquipment,
      detectedEquipment,
      timestamp: new Date(),
      detectionResults: results
    };
  };

  const getMissingEquipmentMessage = (missingItems: string[]): string => {
    if (missingItems.length === 0) return '';
   
    const items = missingItems.map(item => {
      switch(item.toLowerCase()) {
        case 'vest': return 'Safety Vest';
        case 'helmet': return 'Helmet';
        case 'boots': return 'Safety Boots';
        default: return item;
      }
    });

    if (items.length === 1) return `${items[0]} not detected`;
    if (items.length === 2) return `${items[0]} and ${items[1]} not detected`;
    return `${items[0]}, ${items[1]}, and ${items[2]} not detected`;
  };

  const getDetectedEquipmentMessage = (detectedItems: string[]): string => {
    if (detectedItems.length === 0) return 'No safety equipment detected';
   
    const items = detectedItems.map(item => {
      switch(item.toLowerCase()) {
        case 'vest': return 'Safety Vest';
        case 'helmet': return 'Helmet';
        case 'boots': return 'Safety Boots';
        default: return item;
      }
    });

    if (items.length === 1) return `${items[0]} detected`;
    if (items.length === 2) return `${items[0]} and ${items[1]} detected`;
    return `${items[0]}, ${items[1]}, and ${items[2]} detected`;
  };

  const saveSafetyCheckToDatabase = async (
    workerId: string,
    entryPoint: string,
    violations: string[] | null,
    status: 'Safe' | 'Not Safe'
  ): Promise<void> => {
    try {
      console.log('=== SAVING SAFETY CHECK TO DATABASE ===');
      console.log('Worker ID:', workerId);
      console.log('Entry Point:', entryPoint);
      console.log('Violations:', violations);
      console.log('Status:', status);

      const safetyCheckRecord = {
        worker_id: workerId,
        entry_point: entryPoint,
        violations: violations,
        timestamp: new Date().toISOString(),
        status: status
      };

      const { data, error } = await supabase
        .from('safety_checks')
        .insert([safetyCheckRecord])
        .select();

      if (error) {
        console.error('❌ Database insertion error:', error);
        throw new Error(`Failed to save safety check: ${error.message}`);
      }

      console.log('✅ Safety check saved successfully:', data);
      
    } catch (error) {
      console.error('Error saving safety check to database:', error);
      throw error;
    }
  };

  const handleCapture = async (imageData: string) => {
    setIsCapturing(true);
   
    try {
      const detectionResults = await analyzeImageWithRoboflow(imageData);
      const result = processDetectionResults(detectionResults);
      result.imageData = imageData;
     
      const newAttempts = [...captureAttempts, result];
      setCaptureAttempts(newAttempts);
     
      if (result.success) {
        const duration = sessionStartTime ? Math.floor((new Date().getTime() - sessionStartTime.getTime()) / 1000) : undefined;
       
        const successRecord = {
          workerId: worker.id,
          entryPoint: worker.entryPoint,
          attempts: newAttempts,
          totalAttempts: newAttempts.length,
          timestamp: new Date(),
          duration,
        };
       
        console.log('Successful record:', successRecord);

        try {
          await saveSafetyCheckToDatabase(
            worker.id,
            worker.entryPoint,
            null,
            'Safe'
          );
          
          toast({
            title: "Access Granted ✅",
            description: `All safety equipment detected: ${getDetectedEquipmentMessage(result.detectedEquipment)}. Safety check recorded.`,
          });
        } catch (dbError) {
          console.error('Failed to save successful safety check:', dbError);
          toast({
            title: "Access Granted ✅",
            description: `All safety equipment detected: ${getDetectedEquipmentMessage(result.detectedEquipment)}. Note: Record saving failed.`,
          });
        }
       
        setCaptureAttempts([]);
        setCameraNeedsRestart(false);
        setSessionStartTime(null);
      } else {
        const attemptNumber = newAttempts.length;
        const remainingAttempts = 3 - attemptNumber;
        
        const violationMessages = result.missingEquipment.map(item => {
          switch(item.toLowerCase()) {
            case 'vest': return 'No Safety Vest';
            case 'helmet': return 'No Helmet';
            case 'boots': return 'No Safety Boots';
            default: return `No ${item}`;
          }
        });
        
        const detectedMessage = getDetectedEquipmentMessage(result.detectedEquipment);
       
        if (attemptNumber >= 3) {
          const violation: Violation = {
            workerId: worker.id,
            entryPoint: worker.entryPoint,
            attempts: newAttempts,
            totalAttempts: 3,
            timestamp: new Date(),
          };
         
          console.log('Violation occurred:', violation);

          try {
            await saveSafetyCheckToDatabase(
              worker.id,
              worker.entryPoint,
              violationMessages,
              'Not Safe'
            );
            
            toast({
              title: "Access Denied - Supervisor Notified",
              description: `Maximum attempts reached. Missing: ${violationMessages.join(', ')}. Contact your supervisor immediately. Violation recorded.`,
              variant: "destructive",
            });
          } catch (dbError) {
            console.error('Failed to save violation safety check:', dbError);
            toast({
              title: "Access Denied - Supervisor Notified",  
              description: `Maximum attempts reached. Missing: ${violationMessages.join(', ')}. Contact your supervisor immediately. Note: Record saving failed.`,
              variant: "destructive",
            });
          }
         
          setCaptureAttempts([]);
          setIsLoggedIn(false);
          setWorker({ id: '', secretNumber: '', entryPoint: '' });
          setCameraNeedsRestart(false);
          setSessionStartTime(null);
        } else {
          toast({
            title: `Safety Check Failed - Attempt ${attemptNumber}/3`,
            description: `Missing: ${violationMessages.join(', ')}. ${detectedMessage}. ${remainingAttempts} attempts remaining.`,
            variant: "destructive",
          });
         
          setCameraNeedsRestart(true);
        }
      }
    } catch (error) {
      console.error('Error processing image capture:', error);
      toast({
        title: "Detection Error",
        description: "Unable to analyze safety equipment. Please check your connection and try again.",
        variant: "destructive",
      });
    } finally {
      setIsCapturing(false);
    }
  };

  const handleLogout = () => {
    console.log('Logging out user...');
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
              disabled={isLoading}
            >
              {isLoading ? "Verifying..." : "Login"}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-emerald-50 p-4">
      <div className="max-w-2xl mx-auto space-y-6">
        <Card className="border-emerald-200">
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="text-xl text-slate-800">Safety Equipment Verification</CardTitle>
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

        <Card className="border-emerald-200">
          <CardHeader>
            <CardTitle className="text-lg text-slate-800 flex items-center gap-2">
              <HardHat className="w-5 h-5 text-emerald-600" />
              Required Safety Equipment
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-3">
              <div className="flex items-center gap-3 p-3 rounded-lg bg-emerald-50 border border-emerald-200">
                <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
                <div>
                  <span className="font-medium text-slate-700">Hardhat (Helmet)</span>
                  <p className="text-xs text-slate-500">Must be clearly visible on head</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-emerald-50 border border-emerald-200">
                <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
                <div>
                  <span className="font-medium text-slate-700">Safety Vest</span>
                  <p className="text-xs text-slate-500">High-visibility vest required</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-emerald-50 border border-emerald-200">
                <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
                <div>
                  <span className="font-medium text-slate-700">Safety Boots</span>
                  <p className="text-xs text-slate-500">Steel-toed boots must be visible</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

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
              <div className="flex justify-between items-center">
                <span>Attempts: {captureAttempts.length}/3</span>
                <span>Remaining: {3 - captureAttempts.length}</span>
              </div>
              {cameraNeedsRestart && (
                <div className="mt-2 p-2 bg-amber-100 rounded border border-amber-300">
                  <span className="text-sm font-medium text-amber-800">
                    ⚠️ Camera restart required before next attempt
                  </span>
                </div>
              )}
              {!cameraNeedsRestart && captureAttempts.length < 3 && (
                <div className="mt-2 p-2 bg-green-100 rounded border border-green-300">
                  <span className="text-sm font-medium text-green-800">
                    ✅ Ready for attempt {captureAttempts.length + 1}
                  </span>
                </div>
              )}
            </AlertDescription>
          </Alert>
        )}

        {captureAttempts.length > 0 && (
          <Card className="border-emerald-200">
            <CardHeader>
              <CardTitle className="text-lg text-slate-800">Detection Results</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {captureAttempts.map((attempt, index) => (
                  <div key={index}>
                    <div
                      className={`p-4 rounded-lg border-2 ${
                        attempt.success
                          ? 'bg-emerald-50 border-emerald-300'
                          : 'bg-red-50 border-red-300'
                      }`}
                    >
                      <div className="flex gap-4">
                        {attempt.imageData && (
                          <div className="flex-shrink-0">
                            <img
                              src={attempt.imageData}
                              alt={`Detection attempt ${index + 1}`}
                              className="w-24 h-24 object-cover rounded-lg border-2 border-slate-300"
                            />
                          </div>
                        )}
                       
                        <div className="flex-1">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <p className={`font-bold text-lg ${
                                attempt.success ? 'text-emerald-800' : 'text-red-800'
                              }`}>
                                Attempt {index + 1}: {attempt.success ? '✅ PASSED' : '❌ FAILED'}
                              </p>
                              <p className="text-xs text-slate-500 mb-2">
                                📸 {attempt.timestamp.toLocaleTimeString()}
                              </p>
                            </div>
                          </div>
                         
                          <div className="space-y-2">
                            {attempt.detectedEquipment.length > 0 && (
                              <div className="p-2 bg-green-100 rounded border border-green-300">
                                <p className="text-sm font-medium text-green-800">
                                  ✅ Detected: {getDetectedEquipmentMessage(attempt.detectedEquipment)}
                                </p>
                              </div>
                            )}
                           
                            {attempt.missingEquipment.length > 0 && (
                              <div className="p-2 bg-red-100 rounded border border-red-300">
                                <p className="text-sm font-medium text-red-800">
                                  ❌ Missing: {getMissingEquipmentMessage(attempt.missingEquipment)}
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                   
                    {!attempt.success && index < captureAttempts.length - 1 && (
                      <div className="flex items-center justify-center py-3">
                        <div className="flex items-center gap-2 px-4 py-2 bg-amber-100 border border-amber-300 rounded-full">
                          <Camera className="w-4 h-4 text-amber-700" />
                          <span className="text-sm text-amber-800 font-medium">
                            Camera restart required
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
               
                {captureAttempts.length < 3 && (
                  <div className="mt-4 p-4 bg-slate-50 rounded-lg border border-slate-200">
                    <h4 className="font-medium text-slate-800 mb-2">Before Next Attempt:</h4>
                    <ul className="text-sm text-slate-600 space-y-1">
                      <li>• Ensure all safety equipment is properly worn and visible</li>
                      <li>• Check that your hardhat is on your head</li>
                      <li>• Verify your safety vest is visible and not covered</li>
                      <li>• Make sure safety boots are in the camera frame</li>
                      <li>• Position yourself facing the camera clearly</li>
                      {cameraNeedsRestart && <li className="text-amber-700 font-medium">• Restart camera before proceeding</li>}
                    </ul>
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