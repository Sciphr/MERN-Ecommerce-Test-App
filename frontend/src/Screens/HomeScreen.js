import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Row, Col } from 'react-bootstrap';
import { useParams, Link } from 'react-router-dom';
import Product from '../Components/Product';
import { listProducts } from '../Actions/productActions';
import Message from '../Components/Message';
import Loader from '../Components/Loader';
import Paginate from '../Components/Paginate';
import ProductCarousel from '../Components/ProductCarousel';
import Meta from '../Components/Meta';

const HomeScreen = () => {
  const dispatch = useDispatch();

  const params = useParams();

  const pageNumber = params.pageNumber || 1;

  const productList = useSelector((state) => state.productList);
  const { loading, error, products, page, pages } = productList;
  // dispatch({ type: USER_UPDATE_PROFILE_RESET });

  useEffect(() => {
    dispatch(listProducts(params.keyword, pageNumber));
  }, [dispatch, params, pageNumber]);

  return (
    <React.Fragment>
      <Meta />
      {!params.keyword ? (
        <ProductCarousel />
      ) : (
        <Link to="/" className="btn btn-light">
          Go Back
        </Link>
      )}
      <h1>Latest Products</h1>
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <React.Fragment>
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
          <Paginate
            pages={pages}
            page={page}
            keyword={params.keyword ? params.keyword : ''}
          />
        </React.Fragment>
      )}
    </React.Fragment>
  );
};

export default HomeScreen;
