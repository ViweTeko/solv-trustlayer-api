import React from 'react';
import ReactDOM from 'react-dom/client'; // Use modern concurrent rendering API
import App from './App';

// Find the root element where the app will be rendered
const rootElement = document.getElementById('root');

if (rootElement) {
    // Create a root instance and render the App component
    const root = ReactDOM.createRoot(rootElement);
    root.render(
        <React.StrictMode>
            <App />
        </React.StrictMode>
    );
} else {
    // Log an error if the mount point is missing
    console.error("Failed to find the root element to mount the React application. Ensure your index.html contains <div id='root'></div>.");
}