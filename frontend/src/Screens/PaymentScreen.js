import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Button, Col } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import FormContainer from '../Components/FormContainer';
import CheckoutSteps from '../Components/CheckoutSteps';
import { savePaymentMethod } from '../Actions/cartActions';

const PaymentScreen = () => {
  const cart = useSelector((state) => state.cart);
  const { shippingAddress, paymentMethod } = cart;

  const navigate = useNavigate();

  const { userInfo } = useSelector((state) => state.userLogin);
  useEffect(() => {
    if (!userInfo) {
      navigate('/login');
    } else if (!shippingAddress) {
      navigate('/shipping');
    }
  }, [userInfo, navigate, shippingAddress]);

  const [newPaymentMethod, setNewPaymentMethod] = useState(paymentMethod);

  const dispatch = useDispatch();

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(savePaymentMethod(newPaymentMethod));
    navigate('/placeorder');
  };

  return (
    <FormContainer>
      <CheckoutSteps step1 step2 step3 />
      <h1>Payment Method</h1>
      <Form onSubmit={submitHandler}>
        <Form.Group>
          <Form.Label as="legend">Select Method</Form.Label>
          <Col className="mb-3">
            <Form.Check
              type="radio"
              label="PayPal or Credit Card"
              id="PayPal"
              name="paymentMethod"
              value="PayPal"
              checked={newPaymentMethod === 'PayPal'}
              onChange={(e) => setNewPaymentMethod(e.target.value)}
              className="mb-2"
            ></Form.Check>
            <Form.Check
              type="radio"
              label="Stripe"
              id="Stripe"
              name="paymentMethod"
              value="Stripe"
              checked={newPaymentMethod === 'Stripe'}
              onChange={(e) => setNewPaymentMethod(e.target.value)}
              className="mb-2"
            ></Form.Check>
          </Col>
        </Form.Group>

        <Button type="submit" variant="primary">
          Continue
        </Button>
      </Form>
    </FormContainer>
  );
};

export default PaymentScreen;
