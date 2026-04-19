import React, { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Home2 from './pages/Home2';
import Shop2 from './pages/Shop2';
import Shop3 from './pages/Shop3';
import Login from './pages/Login';
import Register from './pages/Register';
import Contact from './pages/Contact';
import Support from './pages/Support';
import PaymentError from './pages/PaymentError';
import ProductDetail from './pages/ProductDetail';
import Consult from './pages/Consult';
import RitualBuilder from './pages/RitualBuilder';
import OrderConfirmed from './pages/OrderConfirmed';
import TrackOrder from './pages/TrackOrder';
import Checkout from './pages/Checkout';
import Profile from './pages/Profile';
import SearchResults from './pages/SearchResults';
import Cart from './pages/Cart';
import Category from './pages/Category';
import AdminLayout from './components/AdminLayout';
import AdminDashboard from './pages/admin/Dashboard';
import AdminProducts from './pages/admin/Products';
import AdminBrands from './pages/admin/Brands';
import AdminCategories from './pages/admin/Categories';
import AdminOrders from './pages/admin/Orders';
import AdminAnalytics from './pages/admin/Analytics';
import AdminFulfillment from './pages/admin/Fulfillment';
import InvoicePrint from './pages/admin/InvoicePrint';
import StickerPrint from './pages/admin/StickerPrint';
import AdminUsers from './pages/admin/Users';
import AdminSettings from './pages/admin/Settings';

export default function App() {
  useEffect(() => {
    const isDark = localStorage.getItem('darkMode') === 'true' ||
      (!('darkMode' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches);
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  return (
    <Routes>
      <Route path="/" element={<Shop3 />} />
      <Route path="/home2" element={<Home2 />} />
      <Route path="/shop2" element={<Shop2 />} />
      <Route path="/shop3" element={<Shop3 />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/support" element={<Support />} />
      <Route path="/payment-error" element={<PaymentError />} />
      <Route path="/product" element={<ProductDetail />} />
      <Route path="/consult" element={<Consult />} />
      <Route path="/ritual-builder" element={<RitualBuilder />} />
      <Route path="/ritual-builder/:category" element={<RitualBuilder />} />
      <Route path="/order-confirmed" element={<OrderConfirmed />} />
      <Route path="/track-order" element={<TrackOrder />} />
      <Route path="/checkout" element={<Checkout />} />
      <Route path="/cart" element={<Cart />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/search" element={<SearchResults />} />
      <Route path="/category/:slug" element={<Category />} />
      <Route path="/admin/print/invoice/:id" element={<InvoicePrint />} />
      <Route path="/admin/print/sticker/:id" element={<StickerPrint />} />
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<AdminDashboard />} />
        <Route path="products" element={<AdminProducts />} />
        <Route path="brands" element={<AdminBrands />} />
        <Route path="categories" element={<AdminCategories />} />
        <Route path="fulfillment" element={<AdminFulfillment />} />
        <Route path="analytics" element={<AdminAnalytics />} />
        <Route path="orders" element={<AdminOrders />} />
        <Route path="users" element={<AdminUsers />} />
        <Route path="settings" element={<AdminSettings />} />
      </Route>
    </Routes>
  );
}
