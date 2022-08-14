// we are creating file based routing for the stripe api backend

import Stripe from 'stripe';

const stripe = new Stripe(process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method === 'POST') {

    try {
      const params = {
        // these parameters are for simple payments
        submit_type: 'pay',
        mode: 'payment',
        payment_method_types: ['card'],
        billing_address_collection: 'auto',
        // we create the shipping options in the stripe dashboard website
        shipping_options: [
          { shipping_rate: 'shr_1LWNgEHWv7KKbqqE4VDc4IZs' },
          { shipping_rate: 'shr_1LWNhZHWv7KKbqqEzn724gnB' },
        ],
        // line items is an array with different objects where we can specify the product and the quantity (which params do we need)
        line_items: req.body.map((item) => {
          // we are referencing the image deployed to insanity dashboard
          const img = item.image[0].asset._ref;
          const newImage = img
            .replace(
              'image-',
              'https://cdn.sanity.io/images/ompjjvug/production/'
            )
            .replace('-webp', '.webp');

          return {
            price_data: {
              currency: 'usd',
              product_data: {
                name: item.name,
                images: [newImage],
              },
              // in cents
              unit_amount: item.price * 100,
            },
            adjustable_quantity: {
              enabled: true,
              minimum: 1,
            },
            quantity: item.quantity,
          }
        }),
        success_url: `${req.headers.origin}/success`,
        cancel_url: `${req.headers.origin}/canceled`,
      }
      // Create Checkout Sessions from body params.
      const session = await stripe.checkout.sessions.create(params);
      res.status(200).json(session);
    } catch (err) {
      res.status(err.statusCode || 500).json(err.message);
    }
  } else {
    res.setHeader('Allow', 'POST');
    res.status(405).end('Method Not Allowed');
  }
}
