# Task Manager Application

This is a React-based Task Manager application that allows users to manage their tasks efficiently. Users can add, update, delete, and mark tasks as completed. The tasks are stored in Firebase, ensuring that they are available across sessions.

## Table of Contents
- [Live Website Link](#live-link)
- [Features](#features)
- [Setup Instructions](#setup-instructions)
- [Assumptions & Limitations](#assumptions--limitations)
- [Technologies Used](#technologies-used)
- [Contributing](#contributing)

## Live Website Link
(https://task-manager-ce02f.web.app)

## Features

- **Add Tasks:** Users can add new tasks with a due date.
- **Edit Tasks:** Existing tasks can be updated.
- **Delete Tasks:** Users can remove tasks.
- **Mark Tasks as Completed:** Users can check/uncheck tasks to mark them as completed or pending.
- **Responsive Design:** The application is fully responsive and works on different screen sizes.
- **Real-Time Updates:** Tasks are saved in Firebase, allowing real-time updates across multiple sessions and devices.
- **Date-Based Task Highlighting:** Overdue tasks are highlighted in red for better visibility.

## Setup Instructions

### Prerequisites

Ensure you have the following installed on your machine:

- **Node.js**: Download and install Node.js from [here](https://nodejs.org/).
- **npm**: npm is included with Node.js. Verify it by running `npm -v` in your terminal.
- **Firebase Account**: Set up a Firebase project and obtain your configuration keys.

### Step-by-Step Guide

1. **Clone the repository:**

   ```bash
   git clone https://github.com/AbhikSalian/Hack-to-Hire.git
   cd task-manager
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Firebase Configuration:**

   - Create a new Firebase project at [Firebase Console](https://console.firebase.google.com/).
   - Enable Firestore Database in the Firebase Console.
   - Obtain your Firebase configuration keys (API Key, Auth Domain, etc.) from the Firebase Console.
   - Create a `firebase.js` file in the `src/firebase` directory:

     ```javascript
     import { initializeApp } from "firebase/app";
     import { getFirestore } from "firebase/firestore";

     const firebaseConfig = {
       apiKey: "YOUR_API_KEY",
       authDomain: "YOUR_AUTH_DOMAIN",
       projectId: "YOUR_PROJECT_ID",
       storageBucket: "YOUR_STORAGE_BUCKET",
       messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
       appId: "YOUR_APP_ID",
     };

     const app = initializeApp(firebaseConfig);
     export const db = getFirestore(app);
     ```

4. **Run the application:**

   ```bash
   npm start
   ```

   The application should now be running on `http://localhost:3000/`.

## Assumptions & Limitations

### Assumptions

- Users are authenticated in the application using Firebase Authentication (you might need to implement this if not already done).
- The due date for tasks is entered manually by the user in the form of `YYYY-MM-DD`.

### Limitations

- **Firebase Free Plan Quota**: The application uses the Firebase Spark (free) plan, which has limited read and write operations. If the usage exceeds the limit, errors might occur.
- **Offline Functionality**: The application currently does not support offline functionality. Tasks can only be managed when the user is connected to the internet.
- **Scalability**: As the application is built using Firebase's Firestore, it may face limitations when scaling to a very large number of tasks or users.
- **Cross-Browser Compatibility**: While the app is designed to work across major browsers, there might be minor issues in less popular or older browser versions.

## Technologies Used

- **React**: Frontend library for building user interfaces.
- **Firebase Firestore**: Real-time database to store tasks.
- **Bootstrap 5**: For responsive and modern UI design.
- **JavaScript (ES6+)**: For logic and functionality.

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the project.
2. Create a new branch (`git checkout -b main`).
3. Make your changes.
4. Commit your changes (`git commit -m 'Add some feature'`).
5. Push to the branch (`git push origin main`).
6. Open a pull request.

Please ensure that your code follows the project's style guidelines and that you've tested your changes.

