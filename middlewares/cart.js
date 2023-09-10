const Cart = require('../models/cart.model');

function initializeCart(req, res, next) {
  let cart;

  if (!req.session.cart) {
    cart = new Cart();
  } else {
    const sessionCart = req.session.cart;
    cart = new Cart(
      sessionCart.items,
      sessionCart.totalQuantity,
      sessionCart.totalPrice
    );
  }

  res.locals.cart = cart;
  // THis middleware is just for this to initialize the cart in res.locals.cart from the req.session.cart
//IF its empty then new cart , but if it already had some content then you pass 
//the totalQuantity and totalPrice along with it
  next();
}

module.exports = initializeCart;
