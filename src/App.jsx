import { useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
    const [coupon, setCoupon] = useState(null);

    const claimCoupon = async () => {
        try {
            const response = await axios.post('/api/claim'); // Call Vercel API
            setCoupon(response.data.coupon);
            toast.success(response.data.message);
        } catch (error) {
            toast.error(error.response?.data?.message || "Error claiming coupon");
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
