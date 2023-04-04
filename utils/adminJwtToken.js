const sendAdminToken = (admin,statusCode,res)=>{
    const admintoken = admin.getJWTTOKENADMIN();

    // creat options
    const options = {
        expires:new Date(Date.now()+ process.env.COOKIE_EXPIRE_ADMIN*24*60*60*1000 ),
        httpOnly:true

    }

    res.status(statusCode).cookie("flippyseven_admin_token",admintoken,options).json({
        success:true,
        admin,
        admintoken
    })
}
module.exports = sendAdminToken