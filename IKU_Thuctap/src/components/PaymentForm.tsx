import React, { useState } from 'react';
import axios from 'axios';

const PaymentForm = () => {
  const [amount, setAmount] = useState(0);

  const handlePayment = async () => {
    try {
      // Gửi yêu cầu thanh toán đến server Node.js
      const response = await axios.post('http://localhost:3000/vnPay/payment', { amount });
  
      // Redirect đến cổng thanh toán của VNPAY
      window.location.href = response.data.vnpayUrl;
    } catch (error) {
      console.error('Error during payment:', error);
    }
  };

  return (
    <div>
      <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} />
      <button onClick={handlePayment}>Thanh toán</button>
    </div>
  );
};

export default PaymentForm;
