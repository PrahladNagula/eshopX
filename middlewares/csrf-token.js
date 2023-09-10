function addCsrfToken(req, res, next) {
  res.locals.csrfToken = req.csrfToken(); //This function is due to the app.use(csrf()) middleware we added
  next();
}

module.exports = addCsrfToken;