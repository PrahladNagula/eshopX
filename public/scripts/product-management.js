//To delete the product from dom using ajax , so that we dont have to reload the page
const deleteProductButtonElements = document.querySelectorAll('.product-item button');

async function deleteProduct(event) {
  const buttonElement = event.target;
  const productId = buttonElement.dataset.productid;
  const csrfToken = buttonElement.dataset.csrf;

  const response = await fetch('/admin/products/' + productId + '?_csrf=' + csrfToken, {
    method: 'DELETE'
  });

  if (!response.ok) {
    alert('Something went wrong!');
    return;
  }
  //the remove() is a builtin dom function which removes the element from the DOM
  buttonElement.parentElement.parentElement.parentElement.parentElement.remove();
  //starting from the button we are moving up to reach to the main main parent of the product
    //here in this case it will be the li element 
}

for (const deleteProductButtonElement of deleteProductButtonElements) {
  deleteProductButtonElement.addEventListener('click', deleteProduct);
}