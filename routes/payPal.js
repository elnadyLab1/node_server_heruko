const express = require("express");
const router = express.Router();
var paypal = require("paypal-rest-sdk");

const payPalStart = "/payPalStart";
const payPalSuccess = "/payPalSuccess";
const payPalCancel = "/payPalCancel";

const clientID = process.env.CLIENT_ID || "AXag0VUBb-hqrjkkrBOIdrlOJvDooXUlHOwGM6_-hLVrWtDp2zkOFTa36KP_rVPJX6n6O2cAC2RTsRta";
const clientSecret = process.env.CLIENT_SECRET || "EEvMqPLG5fOU8hxO_wgYiKUAcNKCANTCLI3GET4_RehPSaoNg45JcRr1N3z7bIbS4EWpVigBeK-PNRaK";

const host = process.env.HOST || "127.0.0.1";
const port = process.env.PORT || 5000;

paypal.configure({
  mode: "sandbox", //sandbox or live
  client_id: clientID,
  client_secret: clientSecret,
});

//PayPal Sart
router.get(payPalStart, (req, res) => {
  var create_payment_json = {
    intent: "sale",
    payer: {
      payment_method: "paypal",
    },
    redirect_urls: {
      return_url: `http://${host}:${port}${payPalSuccess}`,
      cancel_url: `http://${host}:${port}${payPalCancel}`,
    },
    transactions: [
      {
        item_list: {
          items: [
            {
              name: "item",
              sku: "item",
              price: "100",
              currency: "USD",
              quantity: 1,
            },
          ],
        },
        amount: {
          currency: "USD",
          total: "100",
        },
        description: "This is the payment description.",
      },
    ],
  };

  paypal.payment.create(create_payment_json, (error, payment) => {
    if (error) {
      throw error;
    } else {
      for (var index = 0; index < payment.links.length; index++) {
        //Redirect user to this endpoint for redirect url
        if (payment.links[index].rel === "approval_url") {
          res.redirect(payment.links[index].href);
        }
      }
      console.log("Create Payment Response");
      console.log(payment);
    }
  });
});

// PayPal Success To Exccute
router.get(payPalSuccess, (req, res) => {
  var execute_payment_json = {
    payer_id: req.query.PayerID,
    transactions: [
      {
        amount: {
          currency: "USD",
          total: "100",
        },
      },
    ],
  };

  var paymentId = req.query.PaymentID;

  paypal.payment.execute(
    paymentId,
    execute_payment_json,
    function (error, payment) {
      if (error) {
        console.log(error.response);
        throw error;
      } else {
        console.log("Get Payment Response : ", JSON.stringify(payment));
      }
    }
  );
});

// PayPal Cancel
router.get(payPalCancel, (req, res) => {
  res.send("PayPal Cancel Operation");
});

module.exports = router;