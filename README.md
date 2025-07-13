# 🩺 Vescueye – Vein Health Monitoring with Raspberry Pi & Cloud

**Vescueye** is a real-time vein monitoring system designed to assist surgeons in tracking facial artery conditions using near-infrared imaging and temperature sensors. It integrates a Raspberry Pi-based embedded system, AWS cloud services, and cross-platform applications for data visualization and management.

---

## 🔧 Features

- **Real-time Monitoring**: Continuous vein imaging and temperature capture via Raspberry Pi
- **Cloud Integration**: AWS IoT Core for secure device-cloud communication
- **Data Storage**: Image and data storage in AWS S3 and MongoDB
- **Admin Dashboard**: Web-based interface for device and patient management
- **Mobile Interface**: Dedicated app for doctors to view patient flap conditions
- **Vein Analysis**: Automated vein continuity scoring using computer vision (OpenCV)

---

## 🖼️ High-Level Architecture

![High Level Architecture](./docs/images/HLA.png)

---

## 🧠 Technologies Used

| Layer                | Technology                                  |
| -------------------- | ------------------------------------------- |
| **Hardware**         | Raspberry Pi 3B, MLX90614, VL53L0X, Pi NoIR |
| **Backend Server**   | Node.js, Express                            |
| **Database**         | MongoDB (Atlas)                             |
| **Cloud Platform**   | AWS S3, AWS IoT Core                        |
| **Web Frontend**     | React (Admin Dashboard)                     |
| **Mobile App**       | React Native (Doctor Interface)             |
| **Image Processing** | Python (OpenCV, NumPy)                      |

---

## 🧪 System Testing

### ✅ Software Testing

- **Unit Testing**: Comprehensive testing using the **Jest** framework for backend logic and validation functions
- **API Testing**: Thorough endpoint testing with **Postman** to verify functionality, authentication, and data flow

<p align="center">
  <img src="./docs/images/jtest.png" width="320"/>
  <img src="./docs/images/postman.png" width="320"/>
</p>

### ✅ Hardware Testing

#### MLX90614 Temperature Sensor

- Tested with human hand and hot mug scenarios
- Real-time sensor values logged via Python
- Accuracy verified against digital thermometer (±0.5°C)

#### VL53L0X Distance Sensor

- Tested at 10cm and 20cm object distances
- Readings verified under multiple lighting conditions
- Consistent performance across various environments

### ✅ Vein Continuity Score Testing

- **Human Hand Test**: Achieved scores **above 8.5**, demonstrating clear and connected vein patterns
- **Low-Vein Object Test**: Skin areas like back of arm or wrist yielded scores **below 3**, confirming system sensitivity

---

## 📸 Vein Continuity Detection Method

![Vein Continuity Process](./docs/images/vein-contnuity.png)

### Detection Process:

1. **Pink Region Detection** – Color filtering to isolate skin region
2. **Vein Pattern Detection** – Adaptive thresholding for dark vein visibility
3. **Mask Generation** – Morphological operations to connect broken lines

> **Continuity Score Formula**: Number of vein lines + their connectedness  
> (Fewer broken segments → higher score)

---

## 🚀 Getting Started

### Prerequisites

- Raspberry Pi 3B or higher
- Node.js (v14 or higher)
- Python 3.7+
- AWS Account with IoT Core setup
- MongoDB Atlas account

### Raspberry Pi Setup

```bash
# Clone the repository on Raspberry Pi
git clone https://github.com/cepdnaclk/e20-3yp-Vescueye.git
cd vescueye/pi

# Install Python dependencies
pip install -r requirements.txt

# Configure AWS IoT certificates
# Place your certificates in the certs/ directory

# Run the main script
python3 main.py
```

### Node.js Server Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Configure environment variables
cp .env.example .env
# Edit .env with your AWS and MongoDB credentials

# Start development server
npm run dev
```

### React Admin Panel Setup

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start the development server
npm start
```

### React Native Mobile App Setup

```bash
# Navigate to mobile directory
cd mobile

# Install dependencies
npm install

# Start Expo development server
npx expo start
```

---

## 📂 Project Structure

```
code/
├── backend/        # Node.js server code
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   └── test/
├── web-frontend/       # React admin dashboard
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   └── services/
│   ├── public/
│   ├── assets/
│   ├── context/
│   └── styles/
├── mobile/         # Doctor mobile app
│   ├── src/
│   │   ├── screens/
│   │   ├── components/
│   │   └── navigation/
│   └── assets/
├── firmware/             # Raspberry Pi code
│   ├── test/
│   └── scripts/
├── images/         # Architecture diagrams, testing screenshots
└── README.md
```

---

## 🔐 Security Measures

- **AWS IoT Core**: Secure device communication using X.509 certificates
- **Data Encryption**: Data encrypted at rest on S3 and MongoDB
- **Authentication**: JWT-based authentication for web and mobile access
- **HTTPS**: All API communications secured with SSL/TLS

---

## 📊 API Documentation

### Authentication Endpoints

- `POST /api/auth/login` - User login
- `POST /api/auth/forgot-password` - Password Reset
- `POST /api/auth//signup` - User Signup

### Patient Data

- `GET /api/users/patients` - List patients
- `POST /api/users/patient/register` - Add new patient
- `GET /api/users/patient/:id` - Get patient by id
- `GET /api/users/flap/search/:id` - Get Flap data

### Doctor Data

- `GET /api/users/doctors` - List patients
- `POST /api/users/doctor/register` - Add new patient
- `POST /api/users/assign-patient` - Assign new patient
- `POST /api/users/doctors/patients` - Get Assigned patients

---

## 🧩 Hardware Components

| Component       | Purpose                         | Interface    |
| --------------- | ------------------------------- | ------------ |
| MLX90614        | Non-contact temperature sensing | I2C          |
| VL53L0X         | Distance measurement            | I2C          |
| Pi NoIR Camera  | Near-infrared imaging           | CSI          |
| Raspberry Pi 3B | Main processing unit            | GPIO/I2C/CSI |

---

## 🔧 Configuration

### Environment Variables

```env
# Backend Configuration
PORT=3000
NODE_ENV=development
JWT_SECRET=your_jwt_secret

# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/vescueye

# AWS Configuration
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
AWS_IOT_ENDPOINT=your_iot_endpoint

# S3 Configuration
S3_BUCKET_NAME=vescueye-images
```

---

## 🐛 Troubleshooting

### Common Issues

1. **Camera not detected**: Ensure Pi NoIR camera is properly connected to CSI port
2. **Sensor reading errors**: Check I2C connections and addresses
3. **AWS IoT connection failed**: Verify certificates and endpoint configuration
4. **Database connection issues**: Check MongoDB Atlas whitelist and credentials

### Debug Commands

```bash
# Check I2C devices
i2cdetect -y 3

# Test camera
raspistill -o test.jpg

# Check IoT connectivity
python3 /test/<test_module>.py
```

---

## 📈 Performance Metrics

- **Image Processing Speed**: ~1-2 seconds per frame
- **Temperature Reading Frequency**: 0.2Hz
- **Distance Sensor Accuracy**: ±3mm
- **Vein Detection Accuracy**: (Not Done Properly Yet)

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/new-feature`)
3. Commit your changes (`git commit -m 'Add new feature'`)
4. Push to the branch (`git push origin feature/new-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👥 Team

- **Tharindu** — e20248@eng.pdn.ac.lk
- **Tharushika** — e20300@eng.pdn.ac.lk
- **Chamuditha** — e20158@eng.pdn.ac.lk
- **Janith** — e20453@eng.pdn.ac.lk

---

## 📞 Support

For support and questions:

- Create an issue on GitHub
- Contact the development team

---

_© 2025 Vescueye Team. All rights reserved._
