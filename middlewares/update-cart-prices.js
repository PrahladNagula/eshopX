//This is the middleware which checks for any updates in the cart such as the admin deleting the product
async function updateCartPrices(req, res, next) {
  const cart = res.locals.cart;

  await cart.updatePrices();

  // req.session.cart = cart;
  next();
}

module.exports = updateCartPrices;