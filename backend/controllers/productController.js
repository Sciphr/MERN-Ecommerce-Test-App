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

//@desc DELETE a product
//@route PUT /api/products/:id
//@access Private/ADMIN
const deleteProduct = async (req, res, next) => {
  const product = await Product.findById(req.params.id);

  if (product) {
    product.isDeleted = true;
    await product.save();
    res.json({ message: 'Product Removed Successfully!' });
  } else {
    res.status(404);
    const error = new Error('Removal failed. Yikes!');
    return next(error);
  }
};

//@desc CREATE a product
//@route POST /api/products
//@access Private/ADMIN
const createProduct = async (req, res, next) => {
  const product = new Product({
    name: 'Sample Name',
    price: '0',
    user: req.user._id,
    image: '/images/sample.jpg',
    brand: 'Sample Brand',
    category: 'Sample Category',
    countInStock: 0,
    numReviews: 0,
    description: 'Sample description',
  });

  const createdProduct = await product.save();
  res.status(201).json(createdProduct);
};

//@desc Update a product
//@route PUT /api/products/:id
//@access Private/ADMIN
const updateProduct = async (req, res, next) => {
  const { name, price, description, image, brand, category, countInStock } =
    req.body;

  const product = await Product.findById(req.params.id);

  if (product) {
    product.name = name ?? product.name;
    product.price = price ?? product.price;
    product.description = description ?? product.description;
    product.image = image ?? product.image;
    product.brand = brand ?? product.brand;
    product.category = category ?? product.category;
    product.countInStock = countInStock ?? product.countInStock;

    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } else {
    res.status(404);
    const error = new Error('Product not found');
    return next(error);
  }
};

export {
  getProducts,
  getProductById,
  deleteProduct,
  updateProduct,
  createProduct,
};
