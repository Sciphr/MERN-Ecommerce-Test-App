import React from 'react';
import { Container } from 'react-bootstrap';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Footer from './Components/Footer';
import Header from './Components/Header';
import HomeScreen from './Screens/HomeScreen';
import ProductScreen from './Screens/ProductScreen';
import CartScreen from './Screens/CartScreen';

const App = () => {
  return (
    <React.Fragment>
      <Router>
        <Header />
        <main className="py-3">
          <Container>
            <Routes>
              <Route path="/" element={<HomeScreen />} />
              <Route path="/product/:id" element={<ProductScreen />} />
              <Route path="/cart">
                <Route path=":id" element={<CartScreen />} />
                <Route path="" element={<CartScreen />} />
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
