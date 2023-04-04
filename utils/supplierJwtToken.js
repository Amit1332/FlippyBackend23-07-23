const sendSupplierToken = (supplier,statusCode,res)=>{
    const suppliertoken = supplier.getJWTTOKENSUPPLIER();

    // create options
    const options = {
        expires:new Date(Date.now()+ process.env.COOKIE_EXPIRE_SUPPLIER*24*60*60*1000 ),
        httpOnly:true

    }

    res.status(statusCode).cookie("flippyseven_supplier_token",suppliertoken,options).json({
        success:true,
        supplier,
        suppliertoken
    })
}
module.exports = sendSupplierToken