import React from 'react';
import { Container } from 'react-bootstrap';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Footer from './Components/Footer';
import Header from './Components/Header';
import HomeScreen from './Screens/HomeScreen';
import ProductScreen from './Screens/ProductScreen';
import CartScreen from './Screens/CartScreen';
import LoginScreen from './Screens/LoginScreen';
import RegisterScreen from './Screens/RegisterScreen';
import ProfileScreen from './Screens/ProfileScreen';
import ShippingScreen from './Screens/ShippingScreen';
import PaymentScreen from './Screens/PaymentScreen';
import PlaceOrderScreen from './Screens/PlaceOrderScreen';
import OrderScreen from './Screens/OrderScreen';
import UserListScreen from './Screens/UserListScreen';
import UserEditScreen from './Screens/UserEditScreen';
import ProductListScreen from './Screens/ProductListScreen';
import ProductEditScreen from './Screens/ProductEditScreen';
import OrderListScreen from './Screens/OrderListScreen';

const App = () => {
  return (
    <React.Fragment>
      <Router>
        <Header />
        <main className="py-3">
          <Container>
            <Routes>
              <Route path="/" element={<HomeScreen />} />
              <Route path="/search">
                <Route path=":keyword" element={<HomeScreen />} />
                <Route
                  path=":keyword/page/:pageNumber"
                  element={<HomeScreen />}
                />
              </Route>
              <Route path="/page">
                <Route path=":pageNumber" element={<HomeScreen />} />
              </Route>
              <Route path="/product/:id" element={<ProductScreen />} />
              <Route path="/cart">
                <Route path=":id" element={<CartScreen />} />
                <Route path="" element={<CartScreen />} />
              </Route>
              <Route path="/login" element={<LoginScreen />} />
              <Route path="/register" element={<RegisterScreen />} />
              <Route path="/profile" onLeave element={<ProfileScreen />} />
              <Route path="/shipping" element={<ShippingScreen />} />
              <Route path="/payment" element={<PaymentScreen />} />
              <Route path="/placeorder" element={<PlaceOrderScreen />} />
              <Route path="/orders">
                <Route path=":id" element={<OrderScreen />} />
              </Route>
              <Route path="/admin/userlist" element={<UserListScreen />} />
              <Route path="/admin/orderlist" element={<OrderListScreen />} />
              <Route path="/admin/user/">
                <Route path=":id/edit" element={<UserEditScreen />} />
              </Route>
              <Route path="/admin/productlist/" element={<ProductListScreen />}>
                <Route path=":pageNumber" element={<ProductListScreen />} />
                <Route path="" element={<ProductListScreen />} />
              </Route>

              <Route path="/admin/product/">
                <Route path=":id/edit" element={<ProductEditScreen />} />
              </Route>
            </Routes>
          </Container>
        </main>
        <Footer />
      </Router>
    </React.Fragment>
  );
};

export default App;
