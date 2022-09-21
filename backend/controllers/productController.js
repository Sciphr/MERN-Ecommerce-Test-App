import Product from '../models/productModel.js';
import express from 'express';

//@desc Fetch All Products
//@route GET /api/products
//@access Public
const getProducts = async (req, res, next) => {
  const pageSize = 10;
  const page = Number(req.query.pageNumber) || 1;
  //'query' is how to get info from the URL after a question mark
  const keyword = req.query.keyword
    ? {
        name: {
          $regex: req.query.keyword,
          $options: 'i',
        },
      }
    : {};

  const count = await Product.countDocuments({ ...keyword, isDeleted: false });
  // const deleted = await Product.countDocuments({ isDeleted: true });
  // const finalCount = count - deleted;

  const products = await Product.find({ ...keyword })
    .limit(pageSize)
    .skip(pageSize * (page - 1));

  res.json({ products, page, pages: Math.ceil(count / pageSize) });
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

//@desc Create new review
//@route POST /api/products/:id/reviews
//@access Private
const createProductReview = async (req, res, next) => {
  const { rating, comment } = req.body;

  const product = await Product.findById(req.params.id);

  if (product) {
    const alreadyReviewed = product.reviews.find(
      (r) => r.user.toString() === req.user._id.toString()
    );

    if (alreadyReviewed) {
      res.status(400);
      const error = new Error('You already reviewed this!');
      return next(error);
    }

    const review = {
      name: req.user.name,
      rating: Number(rating),
      comment,
      user: req.user._id,
    };

    product.reviews.push(review);

    product.numReviews = product.reviews.length;
    product.rating =
      product.reviews.reduce((acc, item) => item.rating + acc, 0) /
      product.reviews.length;

    await product.save();
    res.status(201).json({ message: 'Review added!' });
  } else {
    res.status(404);
    const error = new Error('You need to be logged in silly!');
    return next(error);
  }
};

//@desc GET top rated products
//@route GET /api/products/top
//@access Public
const getTopProducts = async (req, res, next) => {
  console.log('test');
  const products = await Product.find({}).sort({ rating: -1 }).limit(3);

  res.json(products);
};

export {
  getProducts,
  getProductById,
  deleteProduct,
  updateProduct,
  createProduct,
  createProductReview,
  getTopProducts,
};
