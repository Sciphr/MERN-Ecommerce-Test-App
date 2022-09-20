import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Row, Col } from 'react-bootstrap';
import Product from '../Components/Product';
import { listProducts } from '../Actions/productActions';
import Message from '../Components/Message';
import Loader from '../Components/Loader';

const HomeScreen = () => {
  const dispatch = useDispatch();

  const productList = useSelector((state) => state.productList);
  const { loading, error, products } = productList;
  // dispatch({ type: USER_UPDATE_PROFILE_RESET });

  useEffect(() => {
    dispatch(listProducts());
  }, [dispatch]);

  return (
    <React.Fragment>
      <h1>Latest Products</h1>
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <Row>
          {products.map((product) => {
            if (!product.isDeleted) {
              return (
                <Col key={product._id} sm={12} md={6} lg={4} xl={3}>
                  <Product product={product} />
                </Col>
              );
            } else {
              return null;
            }
          })}
        </Row>
      )}
    </React.Fragment>
  );
};

export default HomeScreen;
