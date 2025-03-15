import { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
    const [coupon, setCoupon] = useState(null);

    const claimCoupon = async () => {
        try {
            const response = await fetch('/api/claim', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' }
            });

            // First, check if the response is successful
            if (!response.ok) {
                const errorText = await response.text(); // Read error response as text
                throw new Error(errorText || "Server error");
            }

            const data = await response.json(); // Parse JSON only after checking `response.ok`

            if (!data.coupon) {
                throw new Error("No coupon available. Please try again later.");
            }

            setCoupon(data.coupon);
            toast.success(data.message);
        } catch (error) {
            console.error("API Error:", error.message);
            toast.error(error.message || "Error claiming coupon");
        }
    };

    return (
        <div style={{ textAlign: "center", marginTop: "50px" }}>
            <h1>Claim Your Coupon</h1>
            <button onClick={claimCoupon} style={{ padding: "10px 20px", fontSize: "18px" }}>
                Get Coupon
            </button>
            {coupon && <p style={{ fontSize: "20px", marginTop: "20px" }}>
                Your Coupon Code: <b>{coupon}</b>
            </p>}
            <ToastContainer />
        </div>
    );
}

export default App;
