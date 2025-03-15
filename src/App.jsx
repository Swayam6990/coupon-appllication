import { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
    const [coupon, setCoupon] = useState(null);

    const claimCoupon = async () => {
        try {
            const response = await fetch('/api/claim', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Error claiming coupon");
            }

            setCoupon(data.coupon);
            toast.success(data.message);
        } catch (error) {
            toast.error(error.message);
        }
    };

    return (
        <div style={{ textAlign: "center", marginTop: "50px" }}>
            <h1>Claim Your Coupon</h1>
            <button onClick={claimCoupon} style={{ padding: "10px 20px", fontSize: "18px" }}>
                Get Coupon
            </button>
            {coupon && <p style={{ fontSize: "20px", marginTop: "20px" }}>Your Coupon Code: <b>{coupon}</b></p>}
            <ToastContainer />
        </div>
    );
}

export default App;
