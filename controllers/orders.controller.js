const Order = require('../models/order.model');
const User = require('../models/user.model');
const stripe = require('stripe')('sk_test_51NHcfkSGgq8bsiKZSZ7zsJDbBOia8u9gM4gHibZZ3JaPSbYKklQK44r7y22wpaLtAsB7vlyO30sKRSZrOsVUwcN400CZuBqDID');
async function getOrders(req, res) {
  try {
    const orders = await Order.findAllForUser(res.locals.uid);
    res.render('customer/orders/all-orders', {
      orders: orders
    });
  } catch (error) {
    next(error);
  }
}

async function addOrder(req, res, next) {
  const cart = res.locals.cart;

  let userDocument;
  try {
    userDocument = await User.findById(res.locals.uid);
  } catch (error) {
    return next(error);
  }

  const order = new Order(cart, userDocument);

  try {
    await order.save();
  } catch (error) {
    next(error);
    return;
  }

  req.session.cart = null;
  //to clear the session cart
//THis session has nothing to do with our sessions, this is a general session term a session created for the stripe servers
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: cart.items.map(function (item){
        return {
          // Provide the exact Price ID (for example, pr_1234) of the product you want to sell
          // price: '{{PRICE_ID}}', this is the defauklt option this is for the product which is stored in the
          //stripe servers since we can do that
          price_data: {
            currency: 'usd',
            product_data: {
              name:item.product.title
            },
            unit_amount: +item.product.price.toFixed(2) * 100
          },
          quantity: item.quantity,
        }
    }) ,
    mode: 'payment',
    success_url: `http://localhost:3000/orders/success`,//after the payment this is the url stripe will redirect to
    cancel_url: `http://localhost:3000/orders/failure`,
  });
  
  res.redirect(303,session.url);
}
function getSuccess(req,res) {
  res.render('customer/orders/success');
}
function getFailure(req,res) {
  res.render('customer/orders/failure');
}

module.exports = {
  addOrder: addOrder,
  getOrders: getOrders,
  getSuccess: getSuccess,
  getFailure:getFailure,
};
