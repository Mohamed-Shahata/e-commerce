const Category = require("../Model/Category.js");
const {
  Product,
  ValidationCreateProduct,
  ValidationUpdateProduct,
} = require("../Model/Product.js");
const {handleObject} = require("../utils/handelObjectWithProduct.js");
const cloudinary = require("cloudinary").v2;

/**
 * @description Get All Products
 * @route       /api/products?
 * @method      GET
 * @access      public
 */
const getAllProducts = async(req , res) => {
  const category = req.params.category;
  try {
    const pageProducts = 5;




    const products = await Product.find({
      category,
    })
    // .skip((pageNum - 1) * pageProducts).limit(pageProducts);
    return res.status(200).json({ products });

  } catch (err) {
    console.log("Error from getAllProducts: ", err);
    res.status(500).json({error: "Server error"});
  }
};

/**
 * @description Get Single Product
 * @route       /api/products
 * @method      GET
 * @access      public
 */
const getSingleProducts = async(req , res) => {
  const id = req.params.id;
  try {
    const product = await Product.findById(id);
    if(!product){
      return res.status(404).json({message: "Product not found"});
    };
    res.status(200).json({ product });
  } catch (err) {
    console.log("Error from getSingleProducts: ", err);
    res.status(500).json({error: "Server error"});
  }
};

/**
 * @description Create Product
 * @route       /api/products
 * @method      POST
 * @access      private
 */
const createProduct = async(req , res) => {
  const { 
    name , description , price , category , discount = 0 , quantity,
    offer, size , colors , type , style , brand , subCategory , 
    warranty,Skin_type , Activity , material , Capacity , Smells ,
    language, authors
  } = req.body;

  const { error } = ValidationCreateProduct({
    name, description, price, category, discount, quantity, offer
  }
  );
  if(error){
    return res.status(400).json({message: error.details[0].message})
  }

  let images = [];
  try {
    if(req.files && req.files.length > 0){
      images = req.files.map(file => ({
        url: file.path,
        publicId: file.filename
      }));
    }else{
      return res.status(400).json({ message: "image is required"});
    }

    const obj = handleObject({ 
      size, colors, type, style, brand,
      subCategory, warranty, Skin_type, Activity, material,
      Capacity, Smells, language,authors
    });

    let discountPercentage = price - ( price * (discount / 100))
    const product = new Product({
      name,
      description,
      price,
      discount,
      category,
      quantity,
      offer,
      attributes: obj,
      images,
      newPrice: discount ? discountPercentage : price
    })

    await product.save();
    

    res.status(200).json({ message: "Created product successfully", product });
  } catch (err) {
    console.log("Error from createProduct: ", err);
    res.status(500).json({error: "Server error"});
  }
}

/**
 * @description Update Product
 * @route       /api/products
 * @method      PUT
 * @access      private
 */
const updateProduct = async(req , res) => {
  const { 
    name, price, category, description,quantity,offer,discount,
    size , colors , type , style , brand , subCategory , warranty,
    Skin_type , Activity , material , Capacity , Smells , language,
    authors
  } = req.body;
  const { error } = ValidationUpdateProduct({
    name, price, category, description,quantity,discount
  });
  if(error){
    return res.status(400).json({message: error.details[0].message})
  }
  const id = req.params.id;

  try {
    const product = await Product.findByIdAndUpdate(id,
      req.body 
    );
    if(!product){
      return res.status(404).json({message: "Product not found"});
    }


    let images = [];
    if(req.files.length !== 0){
      for(let i = 0 ; i < product.images.length; i++){
        await cloudinary.uploader.destroy(product.images[i].publicId);
      }
      
      if(req.files.length > 0){
        images = req.files.map(file => ({
          url: file.path,
          publicId: file.filename
        }));
      }
    }
    product.images = (images.length === 0) ? product.images : images;
    await product.save();
    res.status(200).json({message: "Updated product successfully" , product})
  } catch (err) {
    console.log("Error from updateProduct: ", err);
    res.status(500).json({error: "Server error"});
  }
};

/**
 * @description Delete A Product
 * @route       /api/products
 * @method      DELETE
 * @access      private
 */
const deleteproduct = async(req , res) => {
  const id = req.params.id;
  try {
    const product = await Product.findByIdAndDelete(id);
    if(!product){
      return res.status(404).json({message: "Product not found"});
    }
    for(let i = 0; i < product.images.length; i++){
      await cloudinary.uploader.destroy(product.images[i].publicId)
    };
    res.status(200).json({message: "Deleted product successfully"});
  } catch (err) {
    console.log("Error from deleteproduct: ", err);
    res.status(500).json({error: "Server error"});
  }
};


const reviewProduct = async(req ,res) => {
  const { reviewNum , userId , text } = req.body
  const id = req.params.id;
  try {

    if(!userId){
      return res.status(404).json({message: "User not found"})
    }

    const product = await Product.findById(id);
    if(!product){
      return res.status(404).json({message: "Product not found"})
    }
  
    if(reviewNum < 1 || reviewNum > 5){
      return res.status(400).json({message: "num from 1 to 5"});
    }

    const vewiewAlreadyExists = product.reviews.find(review => review.user.toString() === userId)
    if(vewiewAlreadyExists){
      return res.status(404).json({message: "The user is already valuable"}) 
    }

    product.reviews.push({
      user: userId ,
      averageRating: reviewNum,
      text
    });
    await product.save();

    res.status(200).json({ product });
  } catch (err) {
    console.log("Error from createReviewProduct: ", err);
    res.status(500).json({error: "Server error"});
  }
}

const updateReviewProduct = async(req ,res) => {
  const { reviewNum , userId } = req.body
  const id = req.params.id;
  try {

    if(!userId){
      return res.status(404).json({message: "User not found"})
    }

    const product = await Product.findById(id);
    if(!product){
      return res.status(404).json({message: "Product not found"})
    }

    const reviewProduct = product.reviews.find(review => review.user.toString() === userId)
    if(!reviewProduct){
      return res.status(404).json({message: "reviewProduct not found"})
    }

    if(reviewNum < 1 || reviewNum > 5){
      return res.status(400).json({message: "num from 1 to 5"});
    }
    
    reviewProduct.user = userId || reviewProduct.user;
    reviewProduct.averageRating = reviewNum || reviewProduct.averageRating
    await product.save();
    res.status(200).json({product});
  } catch (err) {
    console.log("Error from createReviewProduct: ", err);
    res.status(500).json({error: "Server error"});
  }
}

const deleteReviewProduct = async(req ,res) => {
  const { userId } = req.body
  const id = req.params.id;
  try {

    if(!userId){
      return res.status(404).json({message: "User not found"})
    }

    let product = await Product.findById(id);
    if(!product){
      return res.status(404).json({message: "Product not found"})
    }

    const review = product.reviews.find(review => review.user.toString() === userId)
    if(!review){
      return res.status(404).json({message: "reviewProduct not found"})
    }

    product = await Product.findByIdAndUpdate(product._id , {
      $pull:{
        reviews: {
          _id : review._id
        }
      }
    }, {new: true});
    await product.save();
    res.status(200).json({product});
  } catch (err) {
    console.log("Error from createReviewProduct: ", err);
    res.status(500).json({error: "Server error"});
  }
}



module.exports = {
  getAllProducts,
  getSingleProducts,
  createProduct,
  updateProduct,
  deleteproduct,
  reviewProduct,
  updateReviewProduct,
  deleteReviewProduct
};