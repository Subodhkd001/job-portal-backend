import jwt from 'jsonwebtoken'

const userAuth = async(req,res,next) => {
    const authHeader = req.headers.authorization;
    if(!authHeader || !authHeader.startsWith('Bearer')) {
        next("Auth failed");
    }
    // split(' ')[1] becoz one space after bearer there is token 
    const token = authHeader.split(' ')[1];
    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        req.user = {userId: payload.userId};
        next();
    } catch (error) {
        next('Auth failed')
    }
}

export default userAuth;

// error that i came across 
// I forgot to write next() in the userAuth function and it had problem with login
