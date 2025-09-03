Health and Safety AI Detector System
Overview
The Health and Safety AI Detector System is an advanced, AI-powered solution designed to enhance workplace safety in high-risk environments such as mining and construction sites. By leveraging state-of-the-art computer vision and machine learning technologies, the system detects the presence and proper usage of Personal Protective Equipment (PPE), ensuring compliance with safety protocols. The system includes two distinct portals: an Admin Portal for supervisors and safety officers to monitor compliance and a Worker Portal for employees to view their compliance status and receive safety alerts.
This project is hosted on GitHub at: https://github.com/Mmabiaa/Health-and-Saftety-AI-detector.
Features

Real-Time PPE Detection: Utilizes AI-driven computer vision to detect PPE (e.g., helmets, safety vests, gloves, goggles) in real-time using on-site cameras.
Dual Portal System:
Admin Portal: Provides supervisors with dashboards for monitoring compliance, generating reports, and managing alerts for non-compliance.
Worker Portal: Allows workers to view their PPE compliance status, receive real-time safety alerts, and access safety guidelines.


Alert System: Sends immediate notifications to workers and admins when PPE violations are detected.
Scalable Architecture: Designed to handle multiple camera feeds and large teams across multiple sites.
Data Analytics: Generates compliance reports and analytics to identify trends and improve safety protocols.
User-Friendly Interface: Built with intuitive UI/UX for both admin and worker portals, ensuring ease of use.

Technology Stack

Frontend: React.js, Tailwind CSS (for both Admin and Worker Portals)
Backend: Python, FastAPI (for API development and AI model integration)
AI Model: YOLOv8 (for real-time object detection of PPE)
Database: PostgreSQL (for storing user data, compliance records, and analytics)
Deployment: Docker, AWS (for scalable cloud deployment)
Camera Integration: RTSP/ONVIF-compatible cameras for live video feed processing

System Architecture
The system follows a modular architecture:

Camera Module: Captures live video feeds from on-site cameras.
AI Detection Module: Processes video feeds using YOLOv8 to detect PPE usage.
Backend API: Manages data flow between the AI module, database, and portals.
Admin Portal: Displays real-time compliance data, generates reports, and manages alerts.
Worker Portal: Provides individual compliance status and safety notifications.
Database: Stores user profiles, compliance logs, and historical data for analytics.

Installation
Prerequisites

Python 3.8+
Node.js 16+
PostgreSQL 13+
Docker (optional, for containerized deployment)
AWS account (for cloud deployment)
RTSP/ONVIF-compatible cameras

Setup Instructions

Clone the Repository:
git clone https://github.com/Mmabiaa/Health-and-Saftety-AI-detector.git
cd Health-and-Saftety-AI-detector
  

Install Backend Dependencies:
pip install -r requirements.txt


Install Frontend Dependencies:
cd frontend
npm install


Set Up Environment Variables:Create a .env file in the root directory and add the following:
DATABASE_URL=postgresql://user:password@localhost:5432/health_safety_db
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
CAMERA_RTSP_URL=rtsp://your_camera_ip:554/stream


Run the Backend:
uvicorn main:app --host 0.0.0.0 --port 8000


Run the Frontend:
cd frontend
npm start


Database Setup:Initialize the PostgreSQL database:
psql -U your_username -d health_safety_db -f schema.sql


Model Training (Optional):If you wish to retrain the YOLOv8 model, download the pre-trained weights and dataset:
python scripts/train_model.py



Usage

Admin Portal:

Access the admin portal at http://localhost:3000/admin.
Log in with admin credentials.
Monitor real-time PPE compliance, view analytics, and configure alert settings.


Worker Portal:

Access the worker portal at http://localhost:3000/worker.
Log in with worker credentials.
View personal compliance status and safety notifications.


Camera Integration:

Configure RTSP/ONVIF camera feeds in the .env file.
Ensure cameras are positioned to capture workers in high-risk areas.



Contributing
We welcome contributions to improve the Health and Safety AI Detector System! Please refer to the CONTRIBUTING.md file for guidelines on how to contribute.
License
This project is licensed under the MIT License. See the LICENSE file for details.
Contact
For questions or support, please open an issue on the GitHub repository: https://github.com/Mmabiaa/Health-and-Saftety-AI-detector.