const stripe = require("stripe")(process.env.STRIPE_KEY);

exports.handler = async function(event) {
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers":
      "Origin, X-Requested-With, Content-Type, Accept",
    "Content-Type": "application/json",
    "Access-Control-Allow-Methods": "*",
    "Access-Control-Max-Age": "2592000",
    "Access-Control-Allow-Credentials": "true",
  };
  if (event.httpMethod !== "POST" || !event.body) {
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ info: "Hello" }),
    };
  }
  const { amount, stripeEmail, stripeToken } = JSON.parse(body);
  try {
    const customer = await stripe.customers.create({
      email: stripeEmail,
      source: stripeToken,
    });
    await stripe.charges.create({
      amount,
      description: "Donation",
      currency: "usd",
      customer: customer.id,
    });

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ info: "Success" }),
    };
  } catch (err) {
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({ error: err.message }),
    };
  }
};
