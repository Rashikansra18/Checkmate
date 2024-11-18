import React, { useState, useEffect } from 'react';
import './styles/PlagiarismChecker.css'; // Import the CSS file
import { loadStripe } from '@stripe/stripe-js';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import Login from "./Login";
// import PlagiarismChecker from "./PlagiarismChecker"; // Import your component


// Replace with your Stripe public key
const stripePromise = loadStripe('pk_test_51QM8QZFQvzRctG1l2GzzyVa660Hgphiw3Aq6K8Edjp8Kdm1lumDmC60NBOysjGwjh6TM8nKeIdcKzZkJ1mst5enh00ciI4BADN');

const PlagiarismChecker = () => {
    const [text, setText] = useState('');
    const [wordCount, setWordCount] = useState(0); // State for word count
    const [reportUrl, setReportUrl] = useState('');
    const [isChecked, setIsChecked] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [loading, setLoading] = useState(false); // Loading state
    const [isModalOpen, setIsModalOpen] = useState(false); // Modal visibility state
    const [paymentIntentClientSecret, setPaymentIntentClientSecret] = useState(null);

    // Handle text change and calculate word count
    const handleTextChange = (e) => {
        const newText = e.target.value;
        setText(newText);

        // Calculate word count
        const count = newText.split(/\s+/).filter((word) => word.length > 0).length;
        setWordCount(count);

        // Set alert message if word count exceeds the limit
        if (count > 150) {
            setAlertMessage('Word limit exceeded! Please proceed to payment.');
        } else {
            setAlertMessage(''); // Clear alert message if within limit
        }
    };

    // Handle payment modal visibility
    const handlePayment = async () => {
        setIsModalOpen(true); // Open the modal

        // Create payment intent on the backend
        try {
            const response = await fetch('http://localhost:3000//create-payment-intent', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ amount: 50000 }), // Amount in paise (500 INR in this example)
            });

            const data = await response.json();
            setPaymentIntentClientSecret(data.clientSecret);
        } catch (error) {
            console.error('Error creating payment intent:', error);
        }
    };

    // Close the modal
    const closeModal = () => {
        setIsModalOpen(false); // Close the modal
    };

    // Handle the payment confirmation
    const handleStripePayment = async () => {
        try {
            const stripe = await stripePromise; // Load Stripe
            if (!stripe || !paymentIntentClientSecret) {
                throw new Error('Stripe or Payment Intent Client Secret is not available');
            }
    
            // Confirm the payment using the client secret
            const result = await stripe.confirmPayment({
                clientSecret: paymentIntentClientSecret,
                payment_method: {
                    type: 'upi', // Specify UPI as the type
                    upi: {
                        vpa: 'mansiluthra217@okicici', // Replace with valid UPI ID
                    },
                },
            });
    
            if (result.error) {
                console.error('Payment failed:', result.error.message);
                setAlertMessage('Payment failed. Please try again.');
            } else if (result.paymentIntent && result.paymentIntent.status === 'succeeded') {
                alert('Payment successful!');
                closeModal();
            }
        } catch (error) {
            console.error('Error confirming payment:', error.message);
            setAlertMessage('An error occurred. Please try again.');
        }
    };
    
    // Simulate plagiarism check
    const simulatedResult = async () => {
        setLoading(true); // Set loading to true
        setAlertMessage(''); // Clear previous alert messages

        try {
            const response = await fetch('http://127.0.0.1:5000/api/detect-plagiarism', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ text }),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const blob = await response.blob(); // Get the PDF as a Blob
            const url = window.URL.createObjectURL(blob); // Create a URL for the Blob
            setReportUrl(url); // Set the URL for downloading

            setIsChecked(true); // Enable the report download button
        } catch (error) {
            console.error('Error checking plagiarism:', error);
            setAlertMessage('An error occurred while checking plagiarism.');
        } finally {
            setLoading(false); // Set loading to false when done
        }
    };

    return (
        <div style={{ cursor: loading ? 'wait' : 'default' }}>
            <textarea
                value={text}
                onChange={handleTextChange}
                placeholder="Enter text to check for plagiarism"
                disabled={loading}
            />
            <div>
                Word Count: {wordCount} / 150
            </div>
            {alertMessage && (
                <div style={{ color: wordCount > 150 ? 'orange' : 'red', marginTop: '10px' }}>
                    {alertMessage}
                </div>
            )}
            {wordCount > 150 && (
                <button
                    onClick={handlePayment}
                    style={{
                        backgroundColor: '#ff5722',
                        color: 'white',
                        border: 'none',
                        padding: '10px 20px',
                        marginTop: '10px',
                        cursor: 'pointer',
                        borderRadius: '5px',
                    }}
                >
                    Proceed to Pay
                </button>
            )}
            <button
                onClick={simulatedResult}
                disabled={!text || isChecked || loading || wordCount > 150} // Disable if word count exceeds 150
            >
                {loading ? 'Checking...' : 'Check Plagiarism'}
            </button>
            {isChecked && (
                <div>
                    <button>
                        <a href={reportUrl} download="plagiarism_report.pdf">
                            Download Report
                        </a>
                    </button>
                </div>
            )}

            {/* Modal for Payment */}
            {isModalOpen && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <button
                            onClick={closeModal}
                            style={{
                                backgroundColor: 'red',
                                color: 'white',
                                border: 'none',
                                padding: '5px 10px',
                                position: 'absolute',
                                top: '10px',
                                right: '10px',
                                cursor: 'pointer',
                            }}
                        >
                            Close
                        </button>

                        {paymentIntentClientSecret ? (
                            <div>
                                <button onClick={handleStripePayment}>Confirm Payment</button>
                            </div>
                        ) : (
                            <p>Loading payment gateway...</p>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default PlagiarismChecker;
