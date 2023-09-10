const imagePickerElement = document.querySelector('#image-upload-control input');
const imagePreviewElement = document.querySelector('#image-upload-control img');

function updateImagePreview() {
  const files = imagePickerElement.files;

  if (!files || files.length === 0) {
    imagePreviewElement.style.display = 'none';
    return;
  }

  const pickedFile = files[0];

  imagePreviewElement.src = URL.createObjectURL(pickedFile);
   //the createObjectURL is a static class therefore we dont need to instantiate the class before it ,
    // and can directly use the class name URL to access its functionality
  imagePreviewElement.style.display = 'block';
  //Fucking hell , we need to strictly use imagePreviewElement.style.display here and
    // not StyleSheet.display or else it wont work fyuck I hate web dev 
}

imagePickerElement.addEventListener('change', updateImagePreview);