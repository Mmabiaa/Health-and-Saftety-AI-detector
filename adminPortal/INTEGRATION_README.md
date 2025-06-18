# Worker Portal - Admin Portal Integration

## Overview
The worker portal and admin portal are now linked through shared data services that allow real-time violation data and live camera feeds to flow from the worker portal to the admin portal.

## Features

### Data Flow
- **Real-time violations**: When a worker fails all 3 safety verification attempts, the violation is automatically sent to the admin portal
- **Image capture**: Captured images from the worker portal are stored and displayed in the admin portal
- **Status management**: Admins can update violation status (pending → investigating → resolved)
- **Persistent storage**: Violations are stored in localStorage for persistence across sessions

### Live Camera Feeds
- **Real-time monitoring**: Admins can see live camera feeds from workers using the safety verification system
- **Auto-refresh**: Camera images update every 5 seconds when workers are actively using the camera
- **Multiple streams**: Support for multiple concurrent worker camera streams
- **Stream management**: Automatic stream activation/deactivation based on worker camera usage
- **Live indicators**: Visual indicators show which streams are currently active

### Color Scheme Integration
- **Unified design**: Admin portal now uses the same emerald/slate color scheme as the worker portal
- **Consistent branding**: Both portals share the same visual identity
- **Professional appearance**: Modern, cohesive design across both interfaces

## Technical Implementation

### Shared Services
```typescript
// Violation Service (violationService.ts)
- addViolation(violation: Violation) // Add new violation from worker portal
- getViolations(): Violation[] // Get all violations
- updateViolationStatus(id: string, status: string) // Update violation status
- subscribe(listener: Function) // Subscribe to real-time updates

// Camera Stream Service (cameraStreamService.ts)
- addStream(stream: CameraStream) // Add new camera stream
- updateStreamImage(streamId: string, imageData: string) // Update stream image
- deactivateStream(streamId: string) // Deactivate stream when worker stops
- subscribe(listener: Function) // Subscribe to stream updates
```

### Data Structures
```typescript
interface Violation {
  workerId: string;
  entryPoint: string;
  attempts: CaptureResult[];
  totalAttempts: number;
  timestamp: Date;
  id?: string;
  status?: 'pending' | 'investigating' | 'resolved';
  severity?: 'high' | 'medium' | 'low';
}

interface CameraStream {
  workerId: string;
  entryPoint: string;
  streamId: string;
  timestamp: Date;
  isActive: boolean;
  imageData?: string;
}
```

### Communication Method
- **localStorage**: Data is shared through browser localStorage
- **Window object**: Services are exposed globally for cross-portal access
- **Real-time updates**: Subscribers are notified when data changes
- **Image streaming**: Base64 encoded images shared between portals

## Usage Instructions

### For Workers (Worker Portal)
1. **Login** with worker credentials
2. **Start camera** and position for safety verification
3. **Live feed begins** - Admin can see camera feed in real-time
4. **Complete countdown** and photo capture
5. **If failed**: Adjust equipment and restart camera for next attempt
6. **After 3 failures**: Violation automatically sent to admin portal

### For Admins (Admin Portal)
1. **Monitor live feeds** on the Dashboard - see workers using cameras in real-time
2. **Monitor violations** in real-time on the Dashboard
3. **Review details** in the Violations tab
4. **View captured images** from worker attempts
5. **Update status** using action buttons (Investigate → Resolved)
6. **Search and filter** violations by severity, worker, or entry point

### Live Camera Feed Features
- **Grid view**: See all active camera streams in a grid layout
- **Click to expand**: Click any stream to view in full-screen modal
- **Auto-refresh**: Images update automatically every 2 seconds
- **Manual refresh**: Toggle auto-refresh on/off
- **Stream info**: View worker ID, entry point, and timestamp
- **Live indicators**: Red "LIVE" badges on active streams

### Testing
1. **Use Test tab** in admin portal to create sample violations and camera streams
2. **Simulate worker failures** without needing actual camera access
3. **Test live camera feeds** with sample image data
4. **Test data flow** between portals
5. **Clear test data** when finished

## Color Scheme

### Primary Colors
- **Emerald**: `emerald-600` (Primary actions, success states)
- **Slate**: `slate-800` (Text, borders)
- **Amber**: `amber-600` (Warnings, medium severity)
- **Red**: `red-600` (Errors, high severity, live indicators)

### Background Gradients
- **Main background**: `from-slate-100 to-emerald-50`
- **Cards**: `bg-white` with `border-emerald-200`

## File Structure

```
adminPortal/
├── src/
│   ├── services/
│   │   ├── violationService.ts    # Violation data service
│   │   └── cameraStreamService.ts # Camera stream service
│   ├── components/
│   │   ├── ViolationsLog.tsx      # Updated with worker portal data
│   │   ├── LiveCameraFeed.tsx     # New live camera feed component
│   │   ├── Header.tsx             # Updated color scheme
│   │   ├── Dashboard.tsx          # Updated with live feeds
│   │   ├── TestViolation.tsx      # Testing component
│   │   └── dashboard/
│   │       ├── StatsCards.tsx     # Updated color scheme
│   │       └── RealTimeAlerts.tsx # Updated color scheme
│   └── App.tsx                    # Updated background
```

## Browser Compatibility
- **localStorage**: Supported in all modern browsers
- **Camera API**: Requires HTTPS for production use
- **Real-time updates**: Uses browser's event system
- **Image streaming**: Base64 encoding supported in all browsers

## Security Considerations
- **Data persistence**: Violations and streams stored locally in browser
- **No external servers**: All data stays within the browser
- **Permission-based**: Camera access requires user consent
- **Image storage**: Base64 encoded images stored locally
- **Stream privacy**: Only active streams are shared, automatically deactivated when stopped

## Performance Considerations
- **Image quality**: Live feed uses lower quality (0.6) for performance
- **Update frequency**: Images update every 5 seconds to balance performance and real-time feel
- **Memory management**: Streams are automatically cleaned up when deactivated
- **Storage limits**: localStorage has size limits, old data may be cleared

## Future Enhancements
- **Database integration**: Move from localStorage to proper database
- **Real-time notifications**: Push notifications for new violations and streams
- **Analytics dashboard**: Detailed safety metrics and trends
- **Mobile optimization**: Responsive design for mobile devices
- **API endpoints**: RESTful API for external integrations
- **Video streaming**: Real-time video streams instead of image snapshots
- **Recording**: Save video recordings of safety verification sessions

## Troubleshooting

### Common Issues
1. **Data not appearing**: Check browser console for errors
2. **Camera not working**: Ensure HTTPS and camera permissions
3. **Color scheme mismatch**: Clear browser cache and reload
4. **Test data not clearing**: Use "Clear All" buttons
5. **Live feeds not updating**: Check auto-refresh setting and network connectivity

### Debug Mode
- Open browser console to see service logs
- Check localStorage for stored data
- Monitor network requests for any API calls
- Verify camera permissions in browser settings

## Support
For technical support or questions about the integration, please refer to the development team or check the console logs for error messages. 