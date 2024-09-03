const { Product, ValidationCreateProduct, ValidationUpdateProduct, Clothes, Electronics, Shoes } = require("../Model/Product.js");
const cloudinary = require("cloudinary").v2;

/**
 * @description Get All Products
 * @route       /api/products
 * @method      GET
 * @access      public
 */
const getAllProducts = async(req , res) => {
  const { 
    pageNum = 1, category, size, type, colors, style, minPrice, maxPrice
  } = req.query;
  try {
    const pageProducts = 5;

    let products;
    if(!category){
      products = await Product.find().skip((pageNum - 1) * pageProducts).limit(pageProducts);
      return res.status(200).json({ products });
    }

    //filters 
    let filters = {};
    switch (category) {
      case "Shoes":
      case "Clothes":
      case "Electronics":
        filters.category = category;
        if(minPrice && maxPrice){
          filters.$or = [
            {
              $and:[
                { discount: {$exists: true , $ne: 0}},
                { newPrice: {
                  ...(+minPrice && { $gte: +minPrice}),
                  ...(+maxPrice && { $lte: +maxPrice})
                  }
                }
              ]
            },
            {
              $and:[
                { discount: {$exists: false }},
                { price: {
                  ...(+minPrice && { $gte: +minPrice}),
                  ...(+maxPrice && { $lte: +maxPrice})
                  }
                }
              ]
            }
          ]
        }
        if(size){
          filters.size = size;
        }
        if(type){
          filters.type = type;
        }
        if(colors){
          filters.colors = colors;
        }
        if(style){
          filters.style = style;
        }
        products = await Product.find(filters).skip((pageNum - 1) * pageProducts).limit(pageProducts);
        return res.status(200).json({ products });

        default:
          return res.status(404).json({message: "Category not found"});
    }
    
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
    name , description , price , category , discount , quantity,
  } = req.body;

  const { error } = ValidationCreateProduct({name , description , price , category , discount , quantity});
  if(error){
    return res.status(400).json({message: error.details[0].message})
  }

  let product;
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

    const { 
      size , colors , type , style , brand , subCategory , warranty,
      Skin_type , Activity , material , Capacity , Smells , language,
      author
    } = req.body;
    switch (category) {
      case "Clothes":
        product = new Clothes({
          subCategory,
          quantity,
          name,
          description,
          price,
          newPrice: price * (1 - (discount / 100)) || 0,
          discount,
          category,
          images,
          size,
          style,
          colors,
          type,
          brand
        })
        await product.save();
        break;
      case "Electronics":
        product = new Electronics({
          subCategory,
          quantity,
          name,
          description,
          price,
          newPrice: price * (1 - (discount / 100)) || 0,
          discount,
          category,
          images,
          colors,
          brand,
          warranty
        });
        await product.save();
      case "Shoes":
        product = new Shoes({
          subCategory,
          quantity,
          name,
          description,
          price,
          newPrice: price * (1 - (discount / 100)) || 0,
          discount,
          category,
          images,
          size,
          style,
          colors,
          type,
          brand
        })
        await product.save();
      default:
        // res.status(400).json({message: "Invalid category"});
        break;
    }
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
};


const reviewProduct = async(req ,res) => {
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
  
    if(reviewNum < 1 || reviewNum > 5){
      return res.status(400).json({message: "num from 1 to 5"});
    }

    const vewiewAlreadyExists = product.reviews.find(review => review.user.toString() === userId)
    if(vewiewAlreadyExists){
      return res.status(404).json({message: "The user is already valuable"}) 
    }

    product.reviews.push({user: userId , averageRating: reviewNum});
    await product.save();

    res.status(200).json({product});
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