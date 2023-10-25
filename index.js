const express = require('express');
const app = express();
const cors = require('cors'); // Import the cors package

const port = 3000;

app.use(express.json());

app.use(cors({
  origin: '*', // Replace with your frontend URL
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
}));

app.post('/paymenturl', (req, res) => {
  const {accessToken , shop} = req.body
   async function  makeShopifyRequest   () {
        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("X-Shopify-Access-Token", accessToken);
        let  data
        const requestBody = {
          query: "mutation AppSubscriptionCreate($name: String!, $lineItems: [AppSubscriptionLineItemInput!]!, $returnUrl: URL!) { appSubscriptionCreate(name: $name, returnUrl: $returnUrl, lineItems: $lineItems) { userErrors { field message } appSubscription { id } confirmationUrl } }",
          variables: {
            name: "Super Duper Recurring Plan",
            returnUrl: `https://${shop}`,
            lineItems: [
              {
                plan: {
                  appRecurringPricingDetails: {
                    price: {
                      amount: 10,
                      currencyCode: "USD"
                    },
                    interval: "EVERY_30_DAYS"
                  }
                }
              }
            ]
          }
        };
      
        const requestOptions = {
          method: 'POST',
          headers: myHeaders,
          body: JSON.stringify(requestBody),
        };
      
        try {
          const response = await fetch(`https://${shop}/admin/api/2023-10/graphql.json`, requestOptions);
          const  data = await response.json();
          res.json({ data })
        } catch (error) {
          console.log('error', error);
          res.json({ error })

        } finally {

        }
      };

     const data =   makeShopifyRequest()

});



app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
