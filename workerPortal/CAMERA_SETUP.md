# Camera Setup Guide for Worker Portal

## Overview
The Worker Portal now includes real camera access functionality for safety equipment verification. Workers can use their device's camera to capture images for safety compliance checks with a built-in countdown timer for better preparation.

## Features
- **Real-time camera feed** with live preview
- **Countdown timer** with "ARE YOU READY??" warning and 3-2-1 countdown
- **Automatic photo capture** after countdown completion
- **Camera switching** between front and back cameras (mobile devices)
- **Image storage** in capture attempts history
- **Error handling** for permission issues and camera unavailability

## Browser Requirements
- Modern browser with WebRTC support
- HTTPS connection (required for camera access)
- Camera permissions granted

## Supported Browsers
- Chrome 53+
- Firefox 36+
- Safari 11+
- Edge 79+

## Setup Instructions

### 1. Browser Permissions
When you first access the camera feature, your browser will request camera permissions:
- Click "Allow" when prompted
- If you accidentally denied, refresh the page and try again

### 2. Using the Camera
1. **Login** to the worker portal with your credentials
2. **Start Camera** by clicking the "Start Camera" button
3. **Position yourself** in front of the camera
4. **Click "Start Countdown & Capture"** to begin the countdown
5. **Get ready** when you see "ARE YOU READY??"
6. **Stay still** during the 3-2-1 countdown
7. **Photo is automatically taken** after countdown completes
8. **Review results** in the recent attempts section
9. **If failed**: Adjust your safety equipment and **restart camera** for next attempt

### 3. Camera Controls
- **Start Camera**: Activates the camera feed
- **Stop Camera**: Deactivates the camera feed
- **Switch Camera** (mobile): Toggle between front and back cameras
- **Start Countdown & Capture**: Begins the 3-second countdown before photo capture
- **Restart Camera**: Required after each failed attempt to proceed to next attempt

### 4. Countdown Process
1. **"ARE YOU READY??"** appears with pulsing animation
2. **3** - First countdown number appears
3. **2** - Second countdown number appears  
4. **1** - Final countdown number appears
5. **Photo captured** automatically after countdown completes

### 5. Failed Attempt Process
1. **Review missing equipment** from the failed attempt
2. **Adjust your safety equipment** based on the feedback
3. **Restart camera** by clicking the "Restart Camera" button
4. **Wait for camera to initialize** (shows "Initializing camera...")
5. **Proceed with next attempt** using "Start Countdown & Capture"

## Troubleshooting

### Camera Not Working
1. **Check permissions**: Ensure camera access is allowed
2. **Refresh page**: Try refreshing the browser page
3. **Check browser**: Ensure you're using a supported browser
4. **HTTPS required**: Camera access requires a secure connection

### Permission Denied
1. **Browser settings**: Check browser camera permissions
2. **Site settings**: Look for camera permissions in site settings
3. **Clear cache**: Clear browser cache and try again

### No Camera Available
1. **Check device**: Ensure your device has a camera
2. **Other apps**: Close other apps that might be using the camera
3. **Restart browser**: Try restarting your browser

### Countdown Issues
1. **Stay in frame**: Ensure you remain visible during the countdown
2. **Don't move**: Try to stay still during the countdown for best results
3. **Retry**: If countdown fails, click "Start Countdown & Capture" again

### Failed Attempts
1. **Read feedback**: Check what safety equipment is missing
2. **Adjust equipment**: Put on or fix the missing safety items
3. **Restart camera**: Click "Restart Camera" button (required)
4. **Wait for initialization**: Don't try to capture until camera is ready
5. **Try again**: Use "Start Countdown & Capture" for next attempt

## Security Notes
- Camera access is only requested when needed
- Images are stored locally in the browser
- No images are sent to external servers without explicit consent
- Camera stream is automatically stopped when leaving the page
- Countdown ensures workers are prepared for photo capture
- Camera restart requirement prevents rapid-fire attempts and ensures proper equipment adjustment

## Technical Details
- Uses `navigator.mediaDevices.getUserMedia()` API
- Supports both front-facing and back-facing cameras
- Images are captured as base64 data URLs
- Automatic cleanup of camera resources
- 3-second countdown timer with visual feedback
- Automatic photo capture after countdown completion
- Camera restart requirement after failed attempts
- Visual indicators for restart requirements between attempts

## Support
If you continue to experience issues with camera access, please contact your system administrator or IT support team. 