import { User } from "../Model/User.js";

export const addFavorite = async(req ,res) => {
    const { userId , productId } = req.body;

    try {
        const user = await User.findById(userId);
        if(!user) return res.status(404).json({message: "user not found"});
        
        if(!user.favorites.includes(productId)){
            user.favorites.push(productId);
            await user.save();
            return res.status(200).json({message: "the product has been added"})
        }else{
            return res.status(400).json({message: "product already exists"})
        }
    } catch (err) {
        console.log("addFavorite error: " , err)
        res.status(500).json({message: "server error"});
    }
}

export const removerFavorite = async(req ,res) => {
    const { userId , productId } = req.body;

    try {
        const user = await User.findById(userId);
        if(!user) return res.status(404).json({message: "user not found"});
        
        if(user.favorites.includes(productId)){
            user.favorites = user.favorites.filter((favorite) => favorite.toString() !== productId );
            await user.save();
            return res.status(200).json({message: "the product has been removed"})
        }else{
            return res.status(400).json({message: "product not already exists"})
        }
    } catch (err) {
        console.log("removerFavorite error: " , err)
        res.status(500).json({message: "server error"});
    }
}

export const getFavorite = async(req ,res) => {
    const { userId } = req.query;
    try {
        const user = await User.findById(userId).populate("favorites");
        if(!user) return res.status(404).json({message: "user not found"});

        res.status(200).json(user.favorites)
    } catch (err) {
        console.log("getFavorite error: " , err)
        res.status(500).json({message: "server error"});
    }
}