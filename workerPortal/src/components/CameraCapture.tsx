import React, { useRef, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Camera, Video, VideoOff, RotateCcw, Loader2 } from 'lucide-react';

interface CameraCaptureProps {
  onCapture: (imageData: string) => void;
  isCapturing: boolean;
  disabled?: boolean;
  needsRestart?: boolean;
  onRestart?: () => void;
  workerId?: string;
  entryPoint?: string;
  attemptNumber?: number;
}

const CameraCapture: React.FC<CameraCaptureProps> = ({ 
  onCapture, 
  isCapturing, 
  disabled = false, 
  needsRestart = false,
  onRestart,
  workerId = 'Unknown Worker',
  entryPoint = 'Unknown Location',
  attemptNumber = 1
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('user');
  const [isInitializing, setIsInitializing] = useState(false);
  const [isCountdownActive, setIsCountdownActive] = useState(false);
  const [countdown, setCountdown] = useState(3);

  const startCamera = async () => {
    try {
      setError(null);
      setIsInitializing(true);
      
      // Stop any existing stream
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }

      const constraints = {
        video: {
          facingMode: facingMode,
          width: { ideal: 1280 },
          height: { ideal: 720 }
        },
        audio: false
      };

      const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
      setStream(mediaStream);
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        setIsCameraActive(true);
      }
      
      // Clear restart state when camera starts successfully
      if (onRestart) {
        onRestart();
      }
    } catch (err) {
      console.error('Error accessing camera:', err);
      setError('Unable to access camera. Please check permissions and try again.');
      setIsCameraActive(false);
    } finally {
      setIsInitializing(false);
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
      setIsCameraActive(false);
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  };

  const switchCamera = () => {
    setFacingMode(prev => prev === 'user' ? 'environment' : 'user');
  };

  const captureImage = () => {
    if (!videoRef.current || !canvasRef.current || !isCameraActive) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    if (!context) return;

    // Set canvas dimensions to match video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Draw the current video frame to canvas
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Convert to base64 string
    const imageData = canvas.toDataURL('image/jpeg', 0.8);
    
    // Send image directly to WorkerInterface for Roboflow processing
    onCapture(imageData);
  };

  const startCountdown = () => {
    if (!isCameraActive || isCountdownActive) return;
    
    setIsCountdownActive(true);
    setCountdown(3);
    
    const countdownInterval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(countdownInterval);
          setIsCountdownActive(false);
          captureImage();
          return 3;
        }
        return prev - 1;
      });
    }, 1000);
  };

  useEffect(() => {
    // Start camera when component mounts
    startCamera();

    // Cleanup on unmount
    return () => {
      stopCamera();
    };
  }, [facingMode]);

  return (
    <Card className="border-emerald-200">
      <CardHeader>
        <CardTitle className="text-lg text-slate-800 flex items-center gap-2">
          <Camera className="w-5 h-5 text-emerald-600" />
          Camera Feed - Attempt {attemptNumber}
        </CardTitle>
        <CardDescription>
          Position yourself in front of the camera for safety equipment verification
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <Alert className="border-red-200 bg-red-50">
            <AlertDescription className="text-red-800">
              {error}
            </AlertDescription>
          </Alert>
        )}

        <div className="relative bg-slate-900 rounded-lg overflow-hidden">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-64 object-cover"
          />
          
          {isInitializing && (
            <div className="absolute inset-0 flex items-center justify-center bg-slate-800">
              <div className="text-center text-slate-400">
                <Loader2 className="w-12 h-12 mx-auto mb-2 animate-spin" />
                <p>Initializing camera...</p>
              </div>
            </div>
          )}
          
          {!isCameraActive && !error && !isInitializing && (
            <div className="absolute inset-0 flex items-center justify-center bg-slate-800">
              <div className="text-center text-slate-400">
                <Camera className="w-12 h-12 mx-auto mb-2" />
                <p>Camera not active</p>
              </div>
            </div>
          )}

          {error && (
            <div className="absolute inset-0 flex items-center justify-center bg-slate-800">
              <div className="text-center text-slate-400">
                <VideoOff className="w-12 h-12 mx-auto mb-2" />
                <p>Camera unavailable</p>
              </div>
            </div>
          )}

          {/* Restart required overlay */}
          {needsRestart && !isCameraActive && (
            <div className="absolute inset-0 flex items-center justify-center bg-amber-900/80">
              <div className="text-center text-white p-4">
                <div className="w-16 h-16 bg-amber-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Camera className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold mb-2">Camera Restart Required</h3>
                <p className="text-sm mb-4">
                  Please adjust your safety equipment and restart the camera for your next attempt.
                </p>
                <Button
                  onClick={startCamera}
                  className="bg-amber-600 hover:bg-amber-700 text-white"
                >
                  Restart Camera
                </Button>
              </div>
            </div>
          )}

          {/* Countdown overlay */}
          {isCountdownActive && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/70">
              <div className="text-center text-white">
                {countdown === 3 && (
                  <div className="animate-pulse">
                    <h2 className="text-2xl font-bold mb-4">ARE YOU READY??</h2>
                  </div>
                )}
                <div className="text-6xl font-bold animate-bounce">
                  {countdown}
                </div>
              </div>
            </div>
          )}

          {/* Camera controls overlay */}
          {isCameraActive && !isCountdownActive && (
            <div className="absolute bottom-2 right-2 flex gap-2">
              <Button
                size="sm"
                variant="secondary"
                onClick={switchCamera}
                className="bg-black/50 hover:bg-black/70 text-white border-0"
              >
                <RotateCcw className="w-4 h-4" />
              </Button>
            </div>
          )}

          {/* Live indicator */}
          {isCameraActive && (
            <div className="absolute top-2 left-2 flex items-center space-x-1 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-medium">
              <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
              <span>LIVE</span>
            </div>
          )}
        </div>

        {/* Hidden canvas for capturing */}
        <canvas ref={canvasRef} style={{ display: 'none' }} />

        <div className="flex gap-2">
          <Button
            onClick={startCamera}
            variant="outline"
            className="flex-1 border-slate-300 text-slate-700 hover:bg-slate-50"
            disabled={disabled || isInitializing}
          >
            {isInitializing ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Video className="w-4 h-4 mr-2" />
            )}
            {isInitializing ? 'Starting...' : needsRestart ? 'Restart Camera' : 'Start Camera'}
          </Button>
          
          <Button
            onClick={stopCamera}
            variant="outline"
            className="flex-1 border-slate-300 text-slate-700 hover:bg-slate-50"
            disabled={disabled || !isCameraActive}
          >
            <VideoOff className="w-4 h-4 mr-2" />
            Stop Camera
          </Button>
        </div>

        {/* Manual capture button */}
        <Button
          onClick={startCountdown}
          disabled={!isCameraActive || disabled || isCapturing || isCountdownActive || needsRestart}
          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
        >
          {isCapturing || isCountdownActive ? 'Processing...' : `Start Attempt ${attemptNumber} - Countdown & Capture`}
        </Button>

        <div className="text-xs text-slate-500 text-center">
          {needsRestart ? (
            <span className="text-amber-600 font-medium">
              ⚠️ Camera restart required after failed attempt
            </span>
          ) : isCameraActive ? (
            <span className="text-emerald-600">
              {isCountdownActive 
                ? `Get ready! Photo will be taken in ${countdown} second${countdown !== 1 ? 's' : ''}`
                : `Camera is active and ready for attempt ${attemptNumber}`
              }
            </span>
          ) : (
            <span>Click "Start Camera" to begin</span>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default CameraCapture;