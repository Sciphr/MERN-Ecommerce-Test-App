import Product from '../models/productModel.js';
import express from 'express';

//@desc Fetch All Products
//@route GET /api/products
//@access Public
const getProducts = async (req, res, next) => {
  const products = await Product.find({});

  res.json(products);
};

//@desc Fetch single products
//@route GET /api/products/:id
//@access Public
const getProductById = async (req, res, next) => {
  let product;

  try {
    product = await Product.findById(req.params.id);
  } catch (err) {
    next();
  }

  if (!product) {
    next();
  } else {
    res.json(product);
  }
};

export { getProducts, getProductById };
