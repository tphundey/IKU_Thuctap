import React, { useState, useEffect } from 'react';

const PaymentComponent = () => {
  const [amount, setAmount] = useState('');
  const [bankCode, setBankCode] = useState('');
  const [language, setLanguage] = useState('');
  const [redirectUrl, setRedirectUrl] = useState('');
  const [redirectToPayment, setRedirectToPayment] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:3000/create_payment_url', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ amount, bankCode, language }),
      });

      if (response.ok) {
        const responseData = await response.json();
        setRedirectUrl(responseData.redirectUrl);

        // Cập nhật trạng thái để bắt đầu chuyển hướng
        setRedirectToPayment(true);
      } else {
        console.error('Response not okay:', response);
      }
    } catch (error) {
      console.error('Error:', error.message);
    }
  };

  // Redirect when state is updated
  useEffect(() => {
    if (redirectToPayment && redirectUrl) {
      console.log('Redirecting to:', redirectUrl);
      window.location.href = redirectUrl;
    }
  }, [redirectToPayment, redirectUrl]);

  return (
    <div>
      <h3>Title</h3>
      <div className="table-responsive">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Số tiền</label>
            <input
              className="form-control"
              id="amount"
              name="amount"
              placeholder="Số tiền"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>

          {/* Add other form fields as needed */}

          <button className="btn btn-default" type="submit">Thanh toán</button>
        </form>
      </div>
      <p>&nbsp;</p>

      {/* Hiển thị đường link nếu có */}
      {redirectUrl && (
        <p>
          <a href={redirectUrl} target="_blank" rel="noopener noreferrer">
            Chuyển hướng đến trang thanh toán
          </a>
        </p>
      )}
    </div>
  );
};

export default PaymentComponent;
