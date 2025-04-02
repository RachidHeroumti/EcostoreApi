import jwt from 'jsonwebtoken'

const generateToken = (id, expireTime='30')=>{
    return jwt.sign({id},process.env.TOKEN_SCRT,{
        expiresIn:`${expireTime}d`
      }) ;

}



  export default generateToken ;

