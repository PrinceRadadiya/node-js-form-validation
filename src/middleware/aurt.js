const jwt = require("jsonwebtoken")
const housedata = require("../module/manukaka")

const aurt = async(req,res,next) =>{
    try {
       
        const token = req.cookies.jwt_token;
        console.log(token,"......................")
        const verify = jwt.verify(token,process.env.prince);
        const user = await housedata.findOne({_id:verify._id})
        // console.log(user);
        req.token = token;
        req.user = user;
        next();
        // console.log(verify)
    } catch (error) {
        res.status(401).send(error)
    } 
}
module.exports = aurt;