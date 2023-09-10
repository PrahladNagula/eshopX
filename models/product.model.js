const mongodb = require('mongodb');

const db = require('../data/database');

class Product {
  constructor(productData) {
    this.title = productData.title;
    this.summary = productData.summary;
    this.price = +productData.price;
    this.description = productData.description;
    this.image = productData.image; // the name of the image file
    this.updateImageData();
    if (productData._id) {
      this.id = productData._id.toString(); //since _id may be undefined
    }
  }

  static async findById(productId) {
    let prodId;
    try {
      prodId = new mongodb.ObjectId(productId);
    } catch (error) {
      error.code = 404;
      throw error;
    }
    const product = await db
      .getDb()
      .collection('products')
      .findOne({ _id: prodId });//Didnt used findOne here and wasted my one hour

    if (!product) {
      const error = new Error('Could not find product with provided id.');
      error.code = 404;
      throw error;
    }

    return new Product(product);//Because we want the product.id field to be used in the update-product.ejs file
    //And we are having a product.id field only if we are passing it to the Product class
  }

  static async findAll() {
    const products = await db.getDb().collection('products').find().toArray();

    return products.map(function (productDocument) {
      return new Product(productDocument); //This is basically transfering back each productDocument or product item
      //back to the Product class , this will directly compute our imagePath and imageUrl fields
      //we are doing this only for that reason
    });
  }

  static async findMultiple(ids) {
    const productIds = ids.map(function(id) {
      return new mongodb.ObjectId(id);
    })
    
    const products = await db
      .getDb()
      .collection('products')
      .find({ _id: { $in: productIds } })
      .toArray();

    return products.map(function (productDocument) {
      return new Product(productDocument);
    });
  }

  updateImageData() {
    //The name of the image file
        //The below bitch wasted my 1 hour, waha pe backticks `` aayenge not '' or "" 
    this.imagePath = `product-data/images/${this.image}`; //the local directory path
    this.imageUrl = `/products/assets/images/${this.image}`; // Note here that we dont have any
    //products/assets type directory, therefore we will handle this path in the app.use() as a predefined path  middleware
    // this will also have an advantage of external attackers not knowing the internal directory structure
  }

  async save() {
    const productData = {
      title: this.title,
      summary: this.summary,
      price: this.price,
      description: this.description,
      image: this.image,
    };

    if (this.id) {
      //there is already a product with id , we are updating it now
      const productId = new mongodb.ObjectId(this.id);

      if (!this.image) {//If the user does not wants to change the image, then he will submit it empty
                //Then we dont want the image:this.image to be updated with null in the process
        delete productData.image;
      }

      await db.getDb().collection('products').updateOne(
        { _id: productId }, 
        {
          $set: productData,//The image stays the same if we havent uploaded a new one , because
          //we are not accessing the $set image property altogether here , it will stay the same
        }
      );
      //But here we are always updating the image to null ,because we are not passing it
            //Therefore we need to handle it
    } else {
      //no id means new product
      await db.getDb().collection('products').insertOne(productData);
    }
  }

  replaceImage(newImage) {
    this.image = newImage;
    this.updateImageData();
  }

  remove() {
    const productId = new mongodb.ObjectId(this.id);
    return db.getDb().collection('products').deleteOne({ _id: productId });
  }
}

module.exports = Product;
