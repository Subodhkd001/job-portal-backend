import userModel from "../models/userModel.js";

export const updateUserController = async (req,res,next) => {
    try {
        const {name, email, lastName, location} = req.body
        if(!name || !email || !lastName || !password){
            next('Please provide all fields');
        }
        const user = await userModel.findOne({_id: req.body.userId});
        user.name = name;
        user.lastName = lastName;
        user.email = email;
        user.location = location;

        await user.save();
        const token = user.createJWT();
        res.status(200).send({
            success: true,
            message: 'User updated successfully',
            user: {
                name: user.name,
                lastName: user.lastName,
                email: user.email,
                location: user.location,
                id: user._id
            },
            token
        })
    } catch (error) {
        
    }
}

