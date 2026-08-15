
# Secure Notes

A comprehensive mobile application built with React Native and Expo for securely storing passwords, sensitive notes, personal information, and other confidential data. All data is protected with military-grade AES-256-GCM encryption and requires authentication for access.

## Overview

Secure Notes is designed with privacy and security as the primary concerns. The application employs multiple layers of protection including biometric authentication, session-based access control, encrypted storage, and optional brute-force protection. With zero database connectivity, all your sensitive information remains completely offline and under your control.

![Project Info](/home/rajuy/Pictures/Project_Notes.png "Project")

## Project Details

### Complexity Level
**Easy-Medium**

### Timeline
**Start Date:** March 21, 2026  
**Expected Completion:** April 21, 2026 (One Month)  
**Current Status:** Active Development (As of August 15, 2026)

### Team Members
1. [Raju Yadav](https://github.com/raju-07 "Visit Github Profile")
2. [Prachi Jaswal](https://github.com/prachi-jaswal "Visit Github Profile")
3. [Raja Singh Rajpoot](https://github.com/rajasinghrajpoot "Visit Github Profile")

## Key Features

### 🔐 Multi-Layer Security Architecture

The application implements a comprehensive security strategy with multiple protective layers:

#### Layer 1: Application Lock
The application uses `expo-local-authentication` to secure access with biometric and credential-based authentication:

**Authentication Methods:**
- 🔓 Fingerprint/Biometric ID
- 🔢 PIN Code
- 🖍️ Pattern Lock
- 🔐 Password Protection
- 👤 Face Recognition (supported on compatible devices)

**Auto-Lock Timeout Options:**
- Instantly (locks on app close)
- 15 Seconds
- 1 Minute
- 5 Minutes

#### Layer 2: Session-Based Access Control
An intelligent session management system ensures data security even during extended usage periods.

**Purpose:**
- Automatically locks the app after a specified inactive usage period
- Prevents unauthorized access if the app is left unattended
- Maintains security without requiring manual app closure

**Auto-Lock Session Durations:**
- 30 Minutes
- 1 Hour
- 2 Hours
- 4 Hours

#### Layer 3: Military-Grade Encryption
All data is protected with **AES-256-GCM** encryption - the same standard used by financial institutions worldwide.

**Technical Specifications:**
- **Algorithm:** Advanced Encryption Standard (AES)
- **Key Size:** 256-bit
- **Mode:** Galois/Counter Mode (GCM) - provides both confidentiality and authenticity
- **Security Level:** Bank-grade encryption
- **Storage Limit:** 2040 KB (via `expo-secure-store`)
- **Offline Storage:** No cloud or database connectivity - all data remains locally encrypted

**Encryption Management:**
- Real-time storage limit tracking in Settings > Encryption
- Visual progress indicator for storage usage
- Secure data handling without external dependencies

#### Layer 4: Brute Force Protection (Optional)
An additional security measure to protect against unauthorized access attempts.

**Brute Force Feature:**
- Monitors authentication failures
- Automatically erases all stored data after 5 failed authentication attempts
- Must be explicitly activated in Settings
- ⚠️ **Warning:** Enable only if you understand the implications

---

### 📝 Data Management

The application supports secure storage and management of various data types:

**Supported Data Categories:**
- **Notes:** Personal memos and text content
- **Passwords:** Account credentials and sensitive passwords
- **Events:** Important dates and calendar entries
- **Pass Keys:** Authentication tokens and access keys
- **Reminders:** Time-based notifications and alerts

All data is automatically encrypted before storage and decrypted only upon authenticated access.

### 🎨 Customization

**Theme Support:**
- Dark Mode / Light Mode
- Customizable color schemes
- User preference persistence

### 🔄 Cross-Platform

Built with React Native and Expo, providing:
- **iOS Support** (iPhone, iPad)
- **Android Support** (phones and tablets)
- **Web Support** (via Expo Web)
- Consistent experience across all platforms

### 📱 User Interface Features

- Intuitive navigation with bottom-tab navigation
- Smooth animations and transitions
- Haptic feedback for enhanced user experience
- Responsive design for various screen sizes
- Accessibility-focused design

---

## Technology Stack

### Frontend & Framework
- **React:** 19.1.0
- **React Native:** 0.81.5
- **Expo:** 54.0.33
- **TypeScript:** 5.9.2

### Navigation & UI
- **React Navigation:** 7.x
- **React Native Safe Area Context:** 5.6.0
- **React Native Screens:** 4.16.0
- **Expo Vector Icons:** 15.0.3
- **Expo Blur:** 15.0.8

### Security & Storage
- **Expo Local Authentication:** 17.0.8 (Biometric & device auth)
- **Expo Secure Store:** 15.0.8 (Encrypted storage with AES-256-GCM)
- **React Native Async Storage:** 2.2.0 (Secure data persistence)

### Additional Libraries
- **Date Picker:** react-native-date-picker 5.0.13
- **QR Code Generator:** react-native-qrcode-svg 6.3.21
- **Haptics:** expo-haptics 15.0.8
- **Email:** expo-mail-composer 15.0.8
- **Date Time Picker:** react-native-community/datetimepicker 8.4.4
- **Font Management:** expo-font 14.0.11
- **SVG Support:** react-native-svg 15.12.1

---

## Project Structure

```
secure-notes/
├── App/
│   └── App.js                 # Main application component
├── screens/
│   ├── HomeScreen.js          # Main dashboard
│   ├── ScreenLock.js          # Authentication screen
│   ├── SettingScreen.js       # Settings navigation
│   └── settings/
│       ├── Lock.js            # App lock configuration
│       ├── Session.js         # Session timeout settings
│       ├── Encryption.js      # Encryption & storage management
│       ├── Theme.js           # Theme & appearance settings
│       ├── AboutScreen.js     # About & version information
│       ├── Feedback.js        # User feedback & support
│       └── ShareApp.js        # App sharing options
├── context/
│   ├── AuthContext.js         # Authentication state management
│   └── ThemeContext.js        # Theme & UI state management
├── services/
│   └── SecureStorage.js       # Encrypted storage service
├── assets/                    # Images & static resources
├── index.js                   # Entry point
├── app.json                   # Expo configuration
├── package.json               # Dependencies & scripts
└── README.md                  # This file
```

---

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn package manager
- Expo CLI (`npm install -g expo-cli`)
- iOS Simulator or Android Emulator (or a physical device)

### Installation

1. **Clone the Repository**
   ```bash
   git clone <repository-url>
   cd secure-notes
   ```

2. **Install Dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Start the Application**
   ```bash
   npm start
   # or
   yarn start
   ```

4. **Run on Your Platform**
   ```bash
   # For iOS
   npm run ios
   
   # For Android
   npm run android
   
   # For Web
   npm run web
   ```

---

## Usage

### First Launch
1. Launch the app and set up your authentication method (biometric, PIN, password, or pattern)
2. Create a master password for encryption (if using password-based auth)
3. Configure your preferred security settings in Settings

### Adding Data
1. Navigate to the Home screen
2. Select the data category (Notes, Passwords, Events, etc.)
3. Add new entries with secure encryption
4. Data is automatically encrypted and stored locally

### Managing Settings
Access the Settings screen to configure:
- **Lock Settings:** Choose authentication method and timeout
- **Session Settings:** Set auto-lock duration
- **Encryption:** View storage usage and enable brute-force protection
- **Theme:** Switch between dark and light modes
- **About:** View version and app information
- **Feedback:** Send feedback or report issues

---

## Security Considerations

### What We Protect
✅ All data is encrypted with AES-256-GCM  
✅ No data is sent to external servers  
✅ Biometric authentication keeps credentials local  
✅ Session-based access control prevents unauthorized usage  
✅ Optional brute-force protection against repeated login attempts  

### Best Practices
- Choose a strong authentication method (avoid simple PIN codes if possible)
- Regularly set a session timeout appropriate for your usage pattern
- Enable brute-force protection only if you understand the consequences
- Keep your device OS updated for security patches
- Backup your data regularly (export or note important information)

### Known Limitations
- Storage limit of 2040 KB (sufficient for text, challenging for high-definition images)
- Requires device-level encryption for maximum security
- Data recovery is not possible if authentication is lost

---

## Future Enhancements

Potential features under consideration:
- Cloud backup with end-to-end encryption
- Import/Export functionality
- Multi-device synchronization
- Advanced search and categorization
- Custom encryption algorithms
- Two-factor authentication (2FA)
- Secure file attachment support

---

## Contributing

We welcome contributions from the community! Please feel free to:
1. Report bugs and security issues
2. Suggest new features
3. Submit pull requests for improvements
4. Improve documentation

---

## License

This project is licensed under the License included in the LICENSE file.

---

## Support & Feedback

Have questions, suggestions, or found a bug? We'd love to hear from you!

**Contact & Feedback:**
- Use the in-app Feedback feature in Settings
- Open an issue on the project repository
- Contact the development team through their GitHub profiles

---

## Acknowledgments

Built with security and privacy as core principles.  
Powered by React Native, Expo, and community-driven open-source libraries.

---

**Last Updated:** August 15, 2026
