const { json } = require("body-parser");
const catchAsyncError = require("../../middleware/catchAsyncError");
const permanentDeleteSupplier = require("../../models/adminModel/permanentDeleteSupplierSchema");
const { find } = require("../../models/alluser");
const AllUser = require("../../models/alluser");
const Supplier = require("../../models/supplierModel/supplierSchema");
const Staff = require("../../models/adminModel/staffSchema");
const Superadmin = require("../../models/superadmin");
const sendAdminToken = require("../../utils/adminJwtToken");
const ApiFeatures = require("../../utils/apifeatures");
const ErrorHander = require("../../utils/errorhander");
const sendToken = require("../../utils/jwtToken");

// superadminRegistration ---------------------
exports.superadminRegistration = catchAsyncError(async (req, res, next) => {
  const { name, email, phone, password } = req.body;
  const singleSuperAdmin = await AllUser.find({ role: "superadmin" });
  if (singleSuperAdmin.length >= 1) {
    return next(new ErrorHander("superadmin can be only one", 400));
  } else {
    const superadmin = await AllUser.create({
      name,
      email,
      phone,
      password,
      role: "superadmin",
      avatar: {
        public_id: "kakalegayetamatar",
        url: "chachalegayekela",
      },
    });
    await Superadmin.create({ superadmin });

    sendAdminToken(superadmin, 200, res);
  }
});

// Admin Login --------------------------------

exports.adminLogin = catchAsyncError(async (req, res, next) => {
  const { email, phone, password } = req.body;

  if (!password) {
    return next(
      new ErrorHander("please enter email or phone and passwrod", 400)
    );
  } else if (email || phone) {
    const admin = await AllUser.findOne({ $or: [{ email }, { phone }] }).select(
      "+password"
    );
    if (!admin) {
      return next(new ErrorHander("Invalid admin Credential", 401));
    }

    if (
      admin.role === "superadmin" ||
      admin.role === "admin" ||
      admin.role === "customer_support" ||
      admin.role === "procurement" ||
      admin.role === "logistics_1st_mile" ||
      admin.role === "logistics_mid_mile" ||
      admin.role === "logistics_last_mile" ||
      admin.role === "payment_team_supplier" ||
      admin.role === "payment_team_customer" ||
      admin.role === "supplier_support" ||
      admin.role === "catalog_team" ||
      admin.role === "marketing_team" ||
      admin.role === "developer_team"
    ) {
      if (!admin) {
        return next(new ErrorHander("Invalid email or password", 401));
      }

      const isPasswordMatched = await admin.comparePassword(password);

      if (!isPasswordMatched) {
        return next(new ErrorHander("password does not match"));
      }

      sendAdminToken(admin, 201, res); 
    } else {
      return next(new ErrorHander("Admin does not exist"));
    }
  } else {
    return next(new ErrorHander("please enter all field", 401));
  }
});

// logout Admin

exports.adminLogout = catchAsyncError(async (req, res, next) => {
  res.cookie("flippyseven_admin_token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
    message: "logged out succesfully",
  });
});

// Admin profile
exports.adminProfile = catchAsyncError(async (req, res, next) => {
  const admin = await AllUser.findById(req.admin.id);

  res.status(200).json({
    success: true,
    admin,
  });
});

//   Get All User --------------------------------------

exports.getAllUser = catchAsyncError(async (req, res, next) => {
  const resultperPage = 20;
  const totalUser = await AllUser.countDocuments({ role: "user" });
  const apiFeatures = new ApiFeatures(AllUser.find({ role: "user" }), req.query)
    .search()
    .pagination(resultperPage);
  const users = await apiFeatures.query;
  const userCount = users.length;
  if (users.length < 1) {
    return next(new ErrorHander("No users ", 404));
  }
  res.status(200).json({
    success: true,
    users,
    totalUser,
    userCount,
  });
}); 

// get Single user -----------------------------

exports.getSingleUser = catchAsyncError(async (req, res, next) => {
  const user = await AllUser.findById(req.params.id);
  if (!user) {
    return next(
      new ErrorHander(`user does not exist with this ${req.params.id}`, 400)
    );
  }

  // await user.remove()
  res.status(200).json({
    success: true,
    user,
  });
});

// Update Staff Role ------------------------------
exports.updateStaffRole = catchAsyncError(async (req, res, next) => {
  const getStaffDetails = {
    role: req.body.role,
    email: req.body.email,
name: req.body.name,
phone:req.body.phone,
  };
  console.log(req.body.password)
  const newStaff = await AllUser.findByIdAndUpdate(
    req.params.id,
    getStaffDetails,
    { new: true, runValidators: true }
  ).select("+password");
  newStaff.password = req.body.password
await newStaff.save() 

  await Staff.create({ newStaff });

  res.status(200).json({
    success: true,
    newStaff,
  });
});

// Add new Staff

exports.newStaffRegistration = catchAsyncError(async (req, res, next) => {
  const { name, email, phone, password, role } = req.body;

  const newStaff = await AllUser.create({
    name,
    email,
    phone,
    password,
    role,
    avatar: {
      public_id: "kakalegayetamatar",
      url: "chachalegayekela",
    },
  });

  await Staff.create({newStaff});
  res.status(200).json({
    success: true,
    newStaff,
  });
});

//  get all staff
exports.getAllStaffRole = catchAsyncError(async (req, res, next) => {
  const resultperPage = 20;
  const totalStaff = await AllUser.countDocuments({
    $or: [
      { role: "admin" },
      { role: "customer_support" },
      { role: "procurement" },
      { role: "logistic_1st_mile" },
      { role: "logistic_mid_mile" },
      { role: "logistic_last_mile" },
      { role: "payment_team_supplier" },
      { role: "payment_team_customer" },
      { role: "supplier_support" },
      { role: "customer_support" },
      { role: "catalog_team" },
      { role: "category_team" },
      { role: "marketing_team" },
      { role: "developer_team" },
    ],
  });
  const apiFeatures = new ApiFeatures(
    AllUser.find({
      $or: [
        { role: "admin" },
        { role: "customer_support" },
        { role: "procurement" },
        { role: "logistic_1st_mile" },
        { role: "logistic_mid_mile" },
        { role: "logistic_last_mile" },
        { role: "payment_team_supplier" },
        { role: "payment_team_customer" },
        { role: "supplier_support" },
        { role: "customer_support" },
        { role: "catalog_team" },
        { role: "category_team" },
        { role: "marketing_team" },
        { role: "developer_team" },
      ],
    }),
    req.query
  )
    .search()
    .pagination(resultperPage);
  const allstaff = await apiFeatures.query;
  const staffCount = allstaff.length;
  // if (allstaff.length < 1) {
  //   return next(new ErrorHander("No users ", 404));
  // }
  res.status(200).json({
    success: true,
    allstaff,
    staffCount,
    totalStaff,
  });
});

// get Single staff -----------------------------

exports.getSingleStaff = catchAsyncError(async (req, res, next) => {
  const staff = await AllUser.findById(req.params.id);
  
  if (!staff) {
    return next(
      new ErrorHander(`staff does not exist with this ${req.params.id}`, 400)
    );
  }

  if (
    (staff.role === "customer_support" ||
      "procurement" ||
      "logistics_1st_mile || logistics_mid_mile" ||
      "logistics_last_mile" ||
      "payment_team_supplier" ||
      "payment_team_customer" ||
      "supplier_support" ||
      "catalog_team" ||
      "category_team" ||
      "marketing_team",
    "developer_team")
  ) {
    res.status(200).json({
      success: true,
      staff,
    });
  } else {
    return next(
      new ErrorHander(`user does not exist with this ${req.params.id}`, 400)
    );
  }
});

// Delete Staff
exports.getDeleteStaff = catchAsyncError(async (req, res, next) => {
  const staff = await AllUser.findById(req.params.id);
  if (!staff) {
    return next(
      new ErrorHander(`staff does not exist with this ${req.params.id}`, 400)
    );
  }

  if (
    (staff.role === "customer_support" ||
      "procurement" ||
      "logistics_1st_mile || logistics_mid_mile" ||
      "logistics_last_mile" ||
      "payment_team_supplier" ||
      "payment_team_customer" ||
      "supplier_support" ||
      "catalog_team" ||
      "category_team" ||
      "marketing_team",
    "developer_team")
  ) {
    await staff.remove();
    res.status(200).json({
      success: true,
      staff,
      msg: "user deleted successfully",
    });
  } else {
    return next(
      new ErrorHander(`staff does not exist with this ${req.params.id}`, 400)
    );
  }
});

//  update user details --------------------------
exports.updateUserDetails = catchAsyncError(async (req, res, next) => {
  const getUserDetails = {
    name: req.body.name,
    email: req.body.email,
    phone: req.body.phone,
  };

  const user = await AllUser.findByIdAndUpdate(req.params.id, getUserDetails, {
    new: true,
    runValidators: true,
  });
  res.status(200).json({
    success: true,
    user,
  });
});

// delete user ----------------------------
exports.deleteUser = catchAsyncError(async (req, res, next) => {
  const user = await AllUser.findByIdAndDelete(req.params.id);
  if (!user) {
    return next(
      new ErrorHander(`user does not exist with this id: ${req.params.id}`, 400)
    );
  }
  res.status(200).json({
    success: true,
    message: `${user.role} role deleted successfully`,
  });
});

// seller-------/////

//   Get All Seller --------------------------------------

exports.getAllSeller = catchAsyncError(async (req, res, next) => {
  const resultperPage = 20;
  const totalSeller = await AllUser.countDocuments({ role: "seller" });
  const apiFeatures = new ApiFeatures(
    AllUser.find({ role: "seller" }),
    req.query
  )
    .search()
    .pagination(resultperPage);
  const seller = await apiFeatures.query;

  const sellerCount = seller.length;
  // if (seller.length < 1) {
  //   return next(new ErrorHander("No seller ", 404));
  // }
  res.status(200).json({
    success: true,
    seller,
    sellerCount,
    totalSeller,
  });
});

// get Single Seller -----------------------------

exports.getSingleSeller = catchAsyncError(async (req, res, next) => {
  const seller = await AllUser.findById(req.params.id);
  if (!seller) {
    return next(
      new ErrorHander(`user does not exist with this ${req.params.id}`, 400)
    );
  }

  // await user.remove()
  res.status(200).json({
    success: true,
    seller,
  });
});




// get all complete seller details
exports.AlldetailsOfSeller = catchAsyncError(async (req, res, next) => {
  

  const selleralldetails = await Seller.findOne({sellerProfile:req.params.id}).populate("sellerProfile")
 

   
  if(!selleralldetails){
    return next(new ErrorHander("Incomplete details"))
  }
  res.status(200).json({
    success:true, 
    selleralldetails
  }) 
   
  }) ;







// update  seller Profile
exports.updateSellerProfileByAdmin = catchAsyncError(async (req, res, next) => {
  const getSellerDetails = {
    name: req.body.name,
    email: req.body.email,
    phone: req.body.phone,
  };

  const seller = await AllUser.findByIdAndUpdate(
    req.params.id,
    getSellerDetails,
    { new: true, runValidators: true }
  );
  res.status(200).json({
    success: true,
    seller,
  });
});

//  update seller all details
exports.updateSellerAllDetails = catchAsyncError(async (req, res, next) => {
  const getSellerDetails = {
    gst: req.body.gst,
    pickup_address: {
      house_no: req.body.house_no,
      landmark: req.body.landmark,
      postal_code: req.body.postal_code,
      city: req.body.city,
      state: req.body.state,
    },
    bank_details: {
      account_number: req.body.account_number,
      ifsc_code: req.body.ifsc_code,
    },
    supplier_details: {
      store_name: req.body.store_name,
      your_name: req.body.your_name,
    },
  };

  const seller = await Seller.findOneAndUpdate(
    { userProfile: req.params.id },
    getSellerDetails,
    { new: true, runValidators: true }
  );
  res.status(200).json({
    success: true,
    seller,
  });
});

// delete user ----------------------------
exports.permanentDeleteSupplier = catchAsyncError(async (req, res, next) => {
  const activeStatus = {
    activation_status: "permanent_delete",
  };
  const seller = await AllUser.findById(req.params.id);
  const sellerdetails = await Seller.findOneAndUpdate(
    { sellerProfile: req.params.id },
    activeStatus,
    { new: true, runValidators: true }
  );

  if (!seller) {
    return next(
      new ErrorHander(
        `seller does not exist with this id: ${req.params.id}`,
        400
      )
    );
  } else {
    const inPermanentDelete = await permanentDeleteSupplier.create({
      seller,
      sellerdetails,
    });
    await seller.remove();
    if (sellerdetails) {
      await sellerdetails.remove();
      res.status(200).json({
        success: true,
        message: `${seller.role} role deleted successfully`,
      });
    } else {
      return next(
        new ErrorHander(
          "Sellor details does not exist and seller role deleted successfully",
          400
        )
      );
    }
  }
  res.status(200).json({
    success: true,
    message: `${seller.role} role deleted successfully`,
  });
});

// get peramanent delete seller
exports.getDetailsOfPermanentDeleteSeller = catchAsyncError(
  async (req, res, next) => {
    const deletedSupplier = await permanentDeleteSupplier.find();

    if (deletedSupplier) {
      res.status(200).json({
        success: true,
        deletedSupplier,
      });
    } else {
      return next(new ErrorHander("there are no deleted sellers"));
    }
  }
);
