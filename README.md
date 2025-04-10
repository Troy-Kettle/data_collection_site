# Vital Signs Survey

A web application for collecting data from healthcare professionals about their clinical judgment when interpreting vital signs. This data will be used to develop AI-based risk prediction and decision support tools for detecting deteriorating hospital patients.

## Project Overview

This survey collects data in three parts:
1. **Vital Signs Concern Level Boundaries** - Healthcare professionals define boundary values for different concern levels
2. **Combinations of Vital Signs** - Assessment of various combinations of vital signs
3. **Further Interpretation of Vital Signs** - Evaluation of vital sign trends over time

## Setup Instructions

### Prerequisites
- Web server (local or hosted)
- Firebase account for data storage

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/data_collection_site.git
cd data_collection_site
```

2. Create a `config.js` file in the root directory with your Firebase configuration:
```javascript
// Firebase configuration
const firebaseConfigData = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_AUTH_DOMAIN",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_STORAGE_BUCKET",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID",
    measurementId: "YOUR_MEASUREMENT_ID"
};

// Export the configuration
window.getFirebaseConfig = function() {
    return firebaseConfigData;
};
```

3. Set up your Firebase Firestore database
   - Create a new collection called `vital_signs_survey` to store survey responses

4. Deploy or serve the files
   - For local development, you can use VS Code's Live Server extension
   - For production, deploy to your preferred web hosting service

## Project Structure

```
data_collection_site/
│
├── index.html              # Entry point, consent form and basic information
├── part1.html              # Part 1: Vital Signs Concern Level Boundaries
├── part2.html              # Part 2: Combinations of Vital Signs
├── part3.html              # Part 3: Further Interpretation of Vital Signs
│
├── styles.css              # Main stylesheet
├── part3.css               # Additional styles for part 3
│
├── script1.js              # JavaScript for part 1
├── script2.js              # JavaScript for part 2
├── script3.js              # JavaScript for part 3
│
├── dataStore.js            # Utility functions for data handling
├── config.js               # Firebase configuration (not in version control)
│
├── Notts.png               # University logo
│
├── .gitignore              # Git ignore file
└── README.md               # Project documentation
```

## Security

- Firebase API keys are stored in `config.js` which is listed in `.gitignore`
- The application uses client-side data validation
- Survey responses are anonymized with no personally identifiable information collected

## Data Flow

1. **Consent & Basic Information** - Collected on index.html
   - Eligibility screening
   - Consent confirmation
   - Basic professional information (role, specialty)

2. **Survey Parts** - Completed sequentially
   - Data is stored temporarily in `sessionStorage`
   - Users must complete each part before proceeding to the next

3. **Submission** - At the end of part 3
   - All survey responses are combined and submitted to Firebase Firestore
   - Session data is cleared after successful submission

## Development Notes

- The application uses vanilla JavaScript with no frameworks
- Firebase Firestore is used for data storage
- The UI is designed to be responsive and works on desktop and mobile devices
- Session validation ensures users complete the survey in order

## Browser Compatibility

- Chrome (Recommended)
- Firefox
- Safari
- Edge

## Future Improvements

- Add data download functionality for researchers
- Implement server-side validation
- Add support for resuming incomplete surveys
- Create a researcher dashboard for data analysis

## Contributors

- Mr. Troy Kettle - Developer
- Dr. Sherif Gonem - Chief Investigator

## License

This project is proprietary and is intended for use by the University of Nottingham.

## Contact

For more information, contact:

For the research:

Dr. Sherif Gonem  
Consultant Respiratory Physician and Honorary Associate Professor  
Nottingham University Hospitals NHS Trust and University of Nottingham  
sherif.gonem@nottingham.ac.uk

For the development:
Troy Kettle
PhD candidate
University of Nottingham
Troy.kettle@nottingham.ac.uk
