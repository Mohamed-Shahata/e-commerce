const { Product, ValidationCreateProduct, ValidationUpdateProduct } = require("../Model/Product.js");
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
    res.status(200).json({ products });
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
 * @method      PUT
 * @access      private
 */
const updateProduct = async(req , res) => {
  const { error } = ValidationUpdateProduct(req.body);
  if(error){
    return res.status(400).json({message: error.details[0].message})
  }
  const id = req.params.id;
  const { name , price , category , description } = req.body;
  try {
    const product = await Product.findById(id);
    if(!product){
      return res.status(404).json({message: "Product not found"});
    }
    product.name = name || product.name;
    product.price = price || product.price;
    product.category = category || product.category;
    product.description = description || product.description;
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
}
module.exports = {
  getAllProducts,
  getSingleProducts,
  createProduct,
  updateProduct,
  deleteproduct
};