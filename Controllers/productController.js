import { ValidationCreateProduct , ValidationUpdateProduct , Product } from "../Model/Product.js";
import { handleObject } from "../utils/handelObjectWithProduct.js";
import { v2 as cloudinary } from "cloudinary";



/**
 * @description Get All Products
 * @route       /api/products
 * @method      GET
 * @access      public
 */
const getAllProducts = async(req , res) => {
  const { 
    pageNum= 1, category, size, type, colors, style, minPrice, maxPrice,
    brand, subCategory, warranty, Skin_type, Activity,
    material, Capacity, Smells, language, authors
  } = req.query;
  try {
    const pageProducts = 9;

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
      case "Accessories":
      case "Furniture":
      case "Sports":
      case "Perfumes":
      case "Books":
      case "Mackup":
      case "Bags":
        filters.category = category;
        if (minPrice || maxPrice) {
          filters.$or = [
            {
              $and: [
                { discount: { $exists: true, $ne: 0 } },
                {
                  newPrice: {
                    ...(minPrice && { $gte: +minPrice }),
                    ...(maxPrice && { $lte: +maxPrice })
                  }
                }
              ]
            },
            {
              $and: [
                { discount: { $lte: 0 } },
                {
                  price: {
                    ...(minPrice && { $gte: +minPrice }),
                    ...(maxPrice && { $lte: +maxPrice })
                  }
                }
              ]
            }
          ];
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
        if(brand){
          filters.brand = brand;
        }
        if(subCategory){
          filters.subCategory = subCategory;
        }
        if(warranty){
          filters.warranty = warranty;
        }
        if(Skin_type){
          filters.Skin_type = Skin_type;
        }
        if(Activity){
          filters.Activity = Activity;
        }
        if(material){
          filters.material = material;
        }
        if(Capacity){
          filters.Capacity = Capacity;
        }
        if(Smells){
          filters.Smells = Smells;
        }
        if(language){
          filters.language = language;
        }
        if(authors){
          filters.authors = authors;
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
      req.body , { new: true}
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



export {
  getAllProducts,
  getSingleProducts,
  createProduct,
  updateProduct,
  deleteproduct,
  reviewProduct,
  updateReviewProduct,
  deleteReviewProduct
};

