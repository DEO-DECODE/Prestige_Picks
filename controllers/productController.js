import productModel from "../models/productModel.js";
import categoryModel from "../models/categoryModel.js";
import orderModel from "../models/orderModel.js";

import fs from "fs";
import slugify from "slugify";
import dotenv from "dotenv";
import { v2 as cloudinary } from "cloudinary";
/*
The v2 module provides the main functionality for interacting with the Cloudinary service.
*/
//configure env
dotenv.config({ path: "config.env" });
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_cloud_name,
  api_key: process.env.CLOUDINARY_api_key,
  api_secret: process.env.CLOUDINARY_api_secret,
});

//payment gateway
// var gateway = new braintree.BraintreeGateway({
//   environment: braintree.Environment.Sandbox,
//   merchantId: process.env.BRAINTREE_MERCHANT_ID,
//   publicKey: process.env.BRAINTREE_PUBLIC_KEY,
//   privateKey: process.env.BRAINTREE_PRIVATE_KEY,
// });

export const createProductController = async (req, res) => {
  try {
    // console.log(req.body);
    console.log(req.files);
    const file = req.files.photo;
    /*
     it retrieves the uploaded file from the req.files object. The photo property corresponds to the field name used in the HTML form for the file upload.
     */
    const result = await cloudinary.uploader.upload(file.tempFilePath);
    /*
    file.tempFilePath is the path to the temporary file on the server's filesystem. The express-fileupload middleware, with useTempFiles: true, saves the uploaded file as a temporary file.
    */
    // console.log(result);
    const { name, description, price, category, quantity, shipping } = req.body; //

    // Validations
    if (!name || !description || !price || !category || !quantity) {
      return res.status(400).send({ error: "All fields are required" });
    }

    const slug = slugify(name);

    const products = new productModel({
      name,
      description,
      price,
      category,
      quantity,
      shipping,
      slug,
      photo: result.url,
    });
    console.log(products);
    await products.save();

    res.status(201).send({
      success: true,
      message: "Product Created Successfully",
      products,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      success: false,
      error: error.message || "Error in creating product",
      message: "Error in creating product",
    });
  }
};

//get all products
export const getProductController = async (req, res) => {
  try {
    const products = await productModel
      .find({})
      .populate("category")
      .sort({ createdAt: -1 });
      /*
       used to sort the retrieved documents based on the createdAt field in descending order
      */
    res.status(200).send({
      success: true,
      counTotal: products.length,
      message: "ALlProducts ",
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Erorr in getting products",
      error: error.message,
    });
  }
};
// get single product
export const getSingleProductController = async (req, res) => {
  try {
    const product = await productModel
      .findOne({ slug: req.params.slug })
      .populate("category");
    console.log(product);
    res.status(200).send({
      success: true,
      message: "Single Product Fetched",
      product,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Eror while getitng single product",
      error,
    });
  }
};


//delete controller
export const deleteProductController = async (req, res) => {
  try {
    await productModel.findByIdAndDelete(req.params.pid);
    res.status(200).send({
      success: true,
      message: "Product Deleted successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error while deleting product",
      error,
    });
  }
};

export const updateProductController = async (req, res) => {
  try {
    // console.log(req.body);

    if (req.files && req.files.photo) {
      const file = req.files.photo;
      // console.log(req.files);

      // Retrieve the uploaded file from the req.files object
      const result = await cloudinary.uploader.upload(file.tempFilePath);

      // Validations
      const { name, description, price, category, quantity, shipping } = req.body;
      if (!name || !description || !price || !category || !quantity) {
        return res.status(400).send({ error: "All fields are required" });
      }

      const products = await productModel.findByIdAndUpdate(
        req.params.pid,
        { ...req.body, slug: slugify(name), photo: result.url },
        { new: true }
      );

      console.log(products);
      await products.save();

      res.status(201).send({
        success: true,
        message: "Product Updated Successfully",
        products,
      });
    } else {
      // If req.files or req.files.photo is null, proceed without uploading a new photo
      const { name, description, price, category, quantity, shipping } = req.body;

      // Validations
      if (!name || !description || !price || !category || !quantity) {
        return res.status(400).send({ error: "All fields are required" });
      }

      const products = await productModel.findByIdAndUpdate(
        req.params.pid,
        { ...req.body, slug: slugify(name) },
        { new: true }
      );

      console.log(products);
      await products.save();

      res.status(201).send({
        success: true,
        message: "Product Updated Successfully",
        products,
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send({
      success: false,
      error: error.message || "Error in Updating product",
      message: "Error in updating product",
    });
  }
};

// filters
export const productFiltersController = async (req, res) => {
  try {
    const { checked, radio } = req.body;
    let args = {};
    if (checked.length > 0) args.category = checked;
    if (radio.length) args.price = { $gte: radio[0], $lte: radio[1] };
    console.log(args);
    const products = await productModel.find(args);
    res.status(200).send({
      success: true,
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: "Error WHile Filtering Products",
      error,
    });
  }
};

// product count
export const productCountController = async (req, res) => {
  try {
    const total = await productModel.find({}).estimatedDocumentCount();
    /*
    estimatedDocumentCount(); to get the estimated count of documents in the collection represented by the productModel
    */
    res.status(200).send({
      success: true,
      total,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      message: "Error in product count",
      error,
      success: false,
    });
  }
};

// product list base on page
export const productListController = async (req, res) => {
  try {
    const perPage = 6;
    const page = req.params.page ? req.params.page : 1;
    const products = await productModel
      .find({})
      .skip((page - 1) * perPage)
      .limit(perPage)
      .sort({ createdAt: -1 });
    res.status(200).send({
      success: true,
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: "error in per page ctrl",
      error,
    });
  }
};

// search product
export const searchProductController = async (req, res) => {
  try {
    const { keyword } = req.params;
    const resutls = await productModel.find({
      $or: [
        { name: { $regex: keyword, $options: "i" } },
        { description: { $regex: keyword, $options: "i" } },
      ],
    });
    // .select("-photo");
    res.json(resutls);
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: "Error In Search Product API",
      error,
    });
  }
};

// similar products
export const realtedProductController = async (req, res) => {
  try {
    const { pid, cid } = req.params;
    const products = await productModel
      .find({
        category: cid,
        _id: { $ne: pid },
      })
      // .select("-photo")
      .limit(3)
      .populate("category");
    res.status(200).send({
      success: true,
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: "error while geting related product",
      error,
    });
  }
};

// get prdocyst by catgory
export const productCategoryController = async (req, res) => {
  try {
    const category = await categoryModel.findOne({ slug: req.params.slug });
    const products = await productModel.find({ category }).populate("category");
    res.status(200).send({
      success: true,
      category,
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      error,
      message: "Error While Getting products",
    });
  }
};

//payment gateway api
//token
// export const braintreeTokenController = async (req, res) => {
//   try {
//     gateway.clientToken.generate({}, function (err, response) {
//       if (err) {
//         res.status(500).send(err);
//       } else {
//         res.send(response);
//       }
//     });
//   } catch (error) {
//     console.log(error);
//   }
// };

//payment
// export const brainTreePaymentController = async (req, res) => {
//   try {
//     const { nonce, cart } = req.body;
//     let total = 0;
//     cart.map((i) => {
//       total += i.price;
//     });
//     let newTransaction = gateway.transaction.sale(
//       {
//         amount: total,
//         paymentMethodNonce: nonce,
//         options: {
//           submitForSettlement: true,
//         },
//       },
//       function (error, result) {
//         if (result) {
//           const order = new orderModel({
//             products: cart,
//             payment: result,
//             buyer: req.user._id,
//           }).save();
//           res.json({ ok: true });
//         } else {
//           res.status(500).send(error);
//         }
//       }
//     );
//   } catch (error) {
//     console.log(error);
//   }
// };
