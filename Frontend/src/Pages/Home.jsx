import React from 'react';
import Hero from '../Components/Hero';
import Menu from '../Components/Menu';
import TopFood from '../Components/TopFood';
import Reviews from '../Components/Reviews';
import Contact from '../Components/Contact';
import SearchResults from '../Components/SearchResults';

const Home = ({ 
  catalogData, 
  searchQuery, 
  searchResults, 
  cartItems, 
  onAddToCart, 
  onRemoveFromCart, 
  onOrderNow, 
  onExploreMenu, 
  onMenuSelect, 
  onOrderItem,
  onSubmitReview,
  userProfile
}) => {
  return (
    <>
      <SearchResults
        query={searchQuery}
        results={searchResults}
        cartItems={cartItems}
        onAddToCart={onAddToCart}
        onRemoveFromCart={onRemoveFromCart}
      />
      <Hero
        onOrderNow={onOrderNow}
        onExploreMenu={onExploreMenu}
        siteSettings={catalogData.settings}
      />
      <Menu 
        categories={catalogData.categories} 
        onMenuSelect={onMenuSelect} 
      />
      <TopFood
        items={catalogData.items}
        cartItems={cartItems}
        onAddToCart={onAddToCart}
        onRemoveFromCart={onRemoveFromCart}
        onOrderItem={onOrderItem}
      />
      <Reviews
        reviews={catalogData.reviews}
      />
      <Contact
        siteSettings={catalogData.settings}
        userProfile={userProfile}
        onSubmitReview={onSubmitReview}
      />
    </>
  );
};

export default Home;
