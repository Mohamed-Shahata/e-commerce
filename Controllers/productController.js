const { url } = require("../config/cloudinary.js");
const { Product, ValidationCreateProduct } = require("../Model/Product.js");
const cloudinary = require("cloudinary").v2;

/**
 * @description Get All Products
 * @route       /api/products
 * @method      GET
 * @access      public
 */
const getAllProducts = async(req , res) => {
  try {
    const products = await Product.find();
    res.status(200).json({ product });
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

  const { error } = ValidationCreateProduct(req.body);
  if(error){
    return res.status(400).json({message: error.details[0].message})
  }

  const { name , description , price , category } = req.body;
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

    const product = new Product({
      name,
      description,
      price,
      category,
      images
    });
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
 * @method      PATCH
 * @access      private
 */
const updateProduct = async(req , res) => {
  const id = req.params.id;
  const { name , description , price , category } = req.body;
  try {
    const product = await Product.findByIdAndUpdate(id , {
      $set:{
        name,
        description,
        price,
        category
      }
    } , { new: true });
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

    res.status(200).json({message: "Deleted product successfully"});
  } catch (err) {
    console.log("Error from deleteproduct: ", err);
    res.status(500).json({error: "Server error"});
  }
}
module.exports = {
  getAllProducts,
  getSingleProducts,
  createProduct,
  deleteproduct
}