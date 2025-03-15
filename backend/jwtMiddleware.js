import jwt from "jsonwebtoken"
import dotenv from "dotenv"
dotenv.config()

const generateToken = (user) => {
    
    console.log(user)
    return jwt.sign(
        {
            _id: user._id.toString(),
            ...user._doc
        }
        , process.env.SECRET_JWT, {expiresIn: "5h"}); // Token expires in 5 hour
};

const generateAuthToken = (user) => {
    
    console.log(user)
    return jwt.sign(
        {
            _id: user._id.toString(),
            ...user._doc
        }
        , process.env.SECRET_JWT, {expiresIn: "10m"}); // Token expires in 10 min
};


const verifyToken = (req, res, next) => {

    // req.user = {}
    // req.user._id = "65d5428edf2c053b57e72ef2"
    // return next()
    const token = req.cookies?.token;
    // console.log(token)
    if (!token) {
        console.log("Middleware do you work!")
        return res.status(401).json({ url: '/login' });
        // return res.redirect(`${process.env.CLIENT_DOMAIN}/login`)
    
    }

    try {
        const decoded = jwt.verify(token, process.env.SECRET_JWT);
        console.log(decoded)
        req.user = decoded;
        // console.log(req.user)
        next();
    } catch (err) {
        console.log(err)
        // res.status(401).json({ message: 'Token is not valid' });
        return res.status(403).json({url:`/login`});
        return
    }
};

const verifyResetToken = (req , res , next) => {

    // req.user = {}
    // req.user._id = "65d5428edf2c053b57e72ef2"
    // return next()
    const token = req.body?.token;
    // console.log(token)
    if (!token) {
        // console.log("Middleware do you work!")
        return res.status(401).json({ message: 'No reset token found' });
        // return res.redirect(`${process.env.CLIENT_DOMAIN}/login`)
    
    }

    try {
        const decoded = jwt.verify(token, process.env.SECRET_JWT);
        req.user = decoded;
        // console.log(req.user)
        next();
    } catch (err) {
        console.log(err)
        res.status(401).json({ message: 'Token has expired' });
        // return res.status(403).json({url:`/login`});
        
    }

}

export {generateToken, verifyToken, generateAuthToken, verifyResetToken}