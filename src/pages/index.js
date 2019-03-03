import React, { useState } from "react";
import StripeCheckout from "react-stripe-checkout";
import Confetti from "react-confetti";

const IndexPage = () => {
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const handleToken = charge => {
    const url =
      process.env.NODE_ENV === "production"
        ? `/.netlify/functions/stripe`
        : "http://localhost:9000/stripe";
    setLoading(true);
    fetch(url, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      mode: "cors",
      body: JSON.stringify({
        stripeToken: charge.id,
        stripeEmail: charge.email,
        amount: Math.round(500),
      }),
    })
      .catch(err => {
        console.error(err);
        setLoading(false);
        alert(
          "Sorry, There was an error processing your payment. Please try again."
        );
      })
      .then(() => {
        setLoading(false);
        setDone(true);
      });
  };
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <h1>🤑 Donate to Alex's Tesla Fund 🤑</h1>
      {(() => {
        if (loading) return <h2>Loading...</h2>;
        if (done) return <Confetti />;
        return (
          <StripeCheckout
            token={handleToken}
            name="Donation to Alex"
            description="Let's pay for Alex's Tesla!"
            panelLabel={`Donate`}
            currency="USD"
            amount={500}
            stripeKey="pk_test_B6gW7X23pm6rPD0VS8qUQwlT"
          />
        );
      })()}
    </div>
  );
};

export default IndexPage;
