import Order from '../models/orderModel.js';

//@desc Create new order
//@route POST /api/orders
//@access Private
const addOrderItems = async (req, res, next) => {
  const {
    orderItems,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
  } = req.body;

  if (orderItems && orderItems.length === 0) {
    res.status(400);
    const error = new Error('No order items!');
    return next(error);
  } else {
    const order = new Order({
      orderItems,
      user: req.user._id,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
    });

    const createdOrder = await order.save();

    res.status(201).json(createdOrder);
  }
};

//@desc GET order by ID
//@route GET /api/orders/:id
//@access Private
const getOrderById = async (req, res, next) => {
  const order = await Order.findById(req.params.id).populate(
    'user',
    'name email'
  );

  if (order) {
    res.json(order);
  } else {
    res.status(404);
    const error = new Error('Order not found');
    return next(error);
  }
};

//@desc UPDATE order to paid
//@route PUT /api/orders/:id/pay
//@access Private
const updateOrderToPaid = async (req, res, next) => {
  const order = await Order.findById(req.params.id);

  if (order) {
    order.isPaid = true;
    order.paidAt = Date.now();
    order.paymentResult = {
      id: req.body.id,
      status: req.body.status,
      update_time: req.body.update_time,
      email_address: req.body.payer.email_address,
    };

    const updatedOrder = await order.save();

    res.json(updatedOrder);
  } else {
    res.status(404);
    const error = new Error('Order payment failed');
    return next(error);
  }
};

//@desc UPDATE order to delivered
//@route PUT /api/orders/:id/delivered
//@access Private/Admin
const updateOrderToDelivered = async (req, res, next) => {
  const order = await Order.findById(req.params.id);

  if (order) {
    order.isDelivered = true;
    order.deliveredAt = Date.now();

    const updatedOrder = await order.save();

    res.json(updatedOrder);
  } else {
    res.status(404);
    const error = new Error('Order delivery failed');
    return next(error);
  }
};

//@desc GET logged in user orders
//@route GET /api/orders/myorders
//@access Private
const getMyOrders = async (req, res, next) => {
  const orders = await Order.find({ user: req.user._id });

  res.json(orders);
};

//@desc GET all orders
//@route GET /api/orders
//@access Private/Admin
const getOrders = async (req, res, next) => {
  const orders = await Order.find({}).populate('user', 'id name');

  res.json(orders);
};

export {
  addOrderItems,
  getOrderById,
  updateOrderToPaid,
  getMyOrders,
  getOrders,
  updateOrderToDelivered,
};
