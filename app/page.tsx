"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Minus, Plus, ShoppingCart, X, Shirt, Crown, Scissors, ShirtIcon as Casual, Sparkles } from "lucide-react";
import Link from 'next/link';
import Image from 'next/image';


// Color System - Change these to update the entire theme
const colors = {
  primary: {
    background: "bg-gray-50",
    foreground: "text-gray-900",
    card: "bg-white",
    cardForeground: "text-white",
    button: "bg-blue-600 hover:bg-blue-700",
    buttonForeground: "text-white",
  },
  secondary: {
    background: "bg-red-100",
    foreground: "text-gray-700",
    muted: "text-gray-500",
    border: "border-gray-200",
  },
  accent: {
    destructive: "bg-red-500",
    destructiveForeground: "text-white",
  },
  ui: {
    shadow: "shadow-sm",
    hover: "hover:shadow-lg",
  }
};

// Types
type Product = {
  id: number;
  name: string;
  description: string;
  price: number;
  image?: string;
  category: string;
};

type CartItem = {
  product: Product;
  quantity: number;
};

const categories = [
  { id: 'all', name: 'All Products' },
  { id: 'designer', name: 'Designer' },
  { id: 'ethnic', name: 'Ethnic' },
  { id: 'casual', name: 'Casual' },
  { id: 'accessories', name: 'Accessories' },
];

export default function EcommerceSkeleton() {
  // State management
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<Product | null>(null);
  const [isNavVisible, setIsNavVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [activeCategory, setActiveCategory] = useState('all');
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const [currentInfoSlide, setCurrentInfoSlide] = useState(0);

  // Load products from JSON file
  useEffect(() => {
    const loadProducts = async () => {
      try {
        const response = await fetch('/data/products.json');
        const data = await response.json();
        setProducts(data.products);
      } catch (error) {
        console.error('Error loading products:', error);
        // Fallback to empty array if JSON fails
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  //make nav bar hide on scroll
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Only hide the navigation bar (not the logo header)
      if (currentScrollY < lastScrollY) {
        setIsNavVisible(true); // Scrolling UP - show nav
      } else if (currentScrollY > lastScrollY && currentScrollY > 50) {
        setIsNavVisible(false); // Scrolling DOWN past 50px - hide nav
      }
      
      // Always show nav at the very top
      if (currentScrollY < 10) {
        setIsNavVisible(true);
      }
      
      setLastScrollY(currentScrollY);
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  // Announcement slides
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % 3); // 3 slides total
    }, 5000); // Change slide every 5 seconds
  
    return () => clearInterval(interval);
  }, []);

  // Auto-advance info carousel effect
useEffect(() => {
  const interval = setInterval(() => {
    setCurrentInfoSlide((prev) => (prev + 1) % 4); // 4 slides total
  }, 6000); // Change slide every 6 seconds
  
  return () => clearInterval(interval);
}, []);

  // Touch swipe handlers for carousel
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (touchStart - touchEnd > 50) {
      // Swipe left - next slide
      setCurrentSlide((prev) => (prev + 1) % 3);
    }
    
    if (touchStart - touchEnd < -50) {
      // Swipe right - previous slide
      setCurrentSlide((prev) => (prev - 1 + 3) % 3);
    }
  };

  // Filter products based on active category
  const filteredProducts = activeCategory === 'all' 
  ? products 
  : products.filter(product => product.category.toLowerCase() === activeCategory);

  // Cart functions
  const addToCart = (product: Product) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.product.id === product.id);
      
      if (existingItem) {
        return prevCart.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        return [...prevCart, { product, quantity: 1 }];
      }
    });
  };

  const removeFromCart = (productId: number) => {
    setCart((prevCart) => prevCart.filter((item) => item.product.id !== productId));
  };

  const updateQuantity = (productId: number, quantity: number) => {
    if (quantity < 1) return;
    
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const handleBuyNow = (product: Product) => {
    setCurrentProduct(product);
    setPaymentModalOpen(true);
  };

  const processPayment = () => {
    // For now, its just show an alert
    // Later we can integrate with Razorpay, Stripe, etc.
    alert(`Payment of ₹${currentProduct?.price.toFixed(2)} for ${currentProduct?.name} processed successfully!`);
    setPaymentModalOpen(false);
    // Optionally add to cart after purchase
    if (currentProduct) {
      addToCart(currentProduct);
    }
  };

  const cartTotal = cart.reduce(
    (total, item) => total + item.product.price * item.quantity,
    0
  );

  const cartItemCount = cart.reduce((count, item) => count + item.quantity, 0);

  return (
  <div className="min-h-screen">
    {/* Fixed Logo Header */}
    <header className={`fixed top-0 left-0 right-0 z-50 ${colors.primary.card} ${colors.ui.shadow} transition-all duration-300`}>
      <div className="container mx-auto px-4 flex items-center justify-center h-16">
        <Link href="/" className="flex items-center h-full py-2">
          <Image 
            src="/images/lucenuova_logo.png"
            alt="Luce Nuova"
            width={170}
            height={55}
            className="h-auto w-auto object-contain justify-start"
            priority={true}
          />
        </Link>
      </div>
    </header>
    
    <nav 
      className={`sticky top-16 z-40 ${colors.primary.card} ${colors.ui.shadow} border-t transition-transform duration-300 ${
        isNavVisible ? 'translate-y-0' : '-translate-y-full'
      }`}
      style={{
        paddingTop: 'env(safe-area-inset-top, 0px)',
        marginTop: 'calc(env(safe-area-inset-top, 0px) * -1)'
      }}
    >
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Left side - Navigation Links */}
          <div className="flex items-center space-x-6">
            <Link href="/" className="text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white font-medium">
              Products
            </Link>
            <Link href="/about" className="text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white font-medium">
              About Us
            </Link>
          </div>
          
          {/* Right side - Cart & Theme Toggle */}
          <div className="flex items-center space-x-4">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => setIsCartOpen(true)}
              className="relative"
            >
              <ShoppingCart className="h-6 w-6" />
              {cartItemCount > 0 && (
                <span className={`absolute -top-2 -right-2 ${colors.accent.destructive} ${colors.accent.destructiveForeground} text-xs rounded-full h-5 w-5 flex items-center justify-center`}>
                  {cartItemCount}
                </span>
              )}
            </Button>
          </div>
        </div>
      </div>
    </nav>

      <main className="container mx-auto px-4 py-8 mt-28">
        {selectedProduct ? (
          // Product Detail View
          <div className="max-w-4xl mx-auto">
            <Button 
              variant="outline" 
              onClick={() => setSelectedProduct(null)}
              className="mb-6"
            >
              ← Back to Products
            </Button>
            
            <Card className="overflow-hidden">
              <div className="md:flex">
                <div className={`md:w-1/2 p-6 flex items-center justify-center ${colors.secondary.background}`}>
                  <div className={`${colors.secondary.background} border-2 border-dashed rounded-xl w-full h-80 flex items-center justify-center`}>
                    {selectedProduct.image ? (
                      <img src={selectedProduct.image} alt={selectedProduct.name} className="w-full h-full object-cover rounded-xl" />
                    ) : (
                      <span className={colors.secondary.muted}>Product Image</span>
                    )}
                  </div>
                </div>
                
                <div className="md:w-1/2 p-6">
                  <div className="mb-4">
                    <span className={`text-sm ${colors.secondary.muted}`}>{selectedProduct.category}</span>
                    <h2 className={`text-3xl font-bold ${colors.primary.foreground} mt-1`}>{selectedProduct.name}</h2>
                    <p className={`text-2xl font-semibold ${colors.primary.foreground} mt-4`}>₹{selectedProduct.price.toFixed(2)}</p>
                  </div>
                  
                  <p className={`${colors.secondary.foreground} mb-6`}>{selectedProduct.description}</p>
                  
                  <div className="flex flex-wrap gap-4">
                    <Button 
                      onClick={() => addToCart(selectedProduct)}
                      className="flex-1"
                    >
                      Add to Cart
                    </Button>
                    <Button 
                      onClick={() => handleBuyNow(selectedProduct)}
                      className="flex-1 bg-green-600 hover:bg-green-700"
                    >
                      Buy Now
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        ) : (
          // Product Listing View with loading state
          <>
            {/* Hero Carousel Section */}
            <div className="mb-12">
              <div 
                className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-100 to-blue-50"
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
              >
                
                {/* Slides Container */}
                <div className={`relative h-[400px] md:h-[500px] flex slide-${currentSlide}`}>
                  {/* Slide 1 */}
                  <div 
                    className="absolute inset-0 w-full flex-shrink-0 flex flex-col md:flex-row items-center justify-center p-8 md:p-12 transition-transform duration-500 ease-in-out"
                    style={{ transform: `translateX(${currentSlide === 0 ? 0 : currentSlide === 1 ? -100 : -200}%)` }}
                  >
                    <div className="md:w-1/2 text-center md:text-left mb-8 md:mb-0">
                      <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">New Collection</h2>
                      <p className="text-lg text-gray-600 mb-6">Discover our latest designer pieces, crafted for the modern wardrobe.</p>
                      <Button className="bg-blue-600 hover:bg-blue-700">
                        Shop Now
                      </Button>
                    </div>
                    <div className="md:w-1/2 flex justify-center">
                      <div className="w-64 h-64 md:w-80 md:h-80 rounded-full bg-gradient-to-r from-blue-200 to-purple-200 flex items-center justify-center">
                        {/* Placeholder for slide image */}
                        <span className="text-gray-500">Slide Image 1</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Slide 2 */}
                  <div 
                    className="absolute inset-0 w-full flex-shrink-0 flex flex-col md:flex-row items-center justify-center p-8 md:p-12 transition-transform duration-500 ease-in-out"
                    style={{ transform: `translateX(${currentSlide === 0 ? 100 : currentSlide === 1 ? 0 : -100}%)` }}
                  >
                    <div className="md:w-1/2 text-center md:text-left mb-8 md:mb-0">
                      <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">Ethnic Elegance</h2>
                      <p className="text-lg text-gray-600 mb-6">Traditional craftsmanship meets contemporary design.</p>
                      <Button className="bg-amber-600 hover:bg-amber-700">
                        Explore
                      </Button>
                    </div>
                    <div className="md:w-1/2 flex justify-center">
                      <div className="w-64 h-64 md:w-80 md:h-80 rounded-full bg-gradient-to-r from-amber-200 to-red-200 flex items-center justify-center">
                        <span className="text-gray-500">Slide Image 2</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Slide 3 */}
                  <div 
                    className="absolute inset-0 w-full flex-shrink-0 flex flex-col md:flex-row items-center justify-center p-8 md:p-12 transition-transform duration-500 ease-in-out"
                    style={{ transform: `translateX(${currentSlide === 0 ? 200 : currentSlide === 1 ? 100 : 0}%)` }}
                  >
                    <div className="md:w-1/2 text-center md:text-left mb-8 md:mb-0">
                      <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">Casual Comfort</h2>
                      <p className="text-lg text-gray-600 mb-6">Everyday essentials that don't compromise on style.</p>
                      <Button className="bg-green-600 hover:bg-green-700">
                        Browse
                      </Button>
                    </div>
                    <div className="md:w-1/2 flex justify-center">
                      <div className="w-64 h-64 md:w-80 md:h-80 rounded-full bg-gradient-to-r from-green-200 to-teal-200 flex items-center justify-center">
                        <span className="text-gray-500">Slide Image 3</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Navigation Bullets (Dots) */}
                <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-3 z-10">
                  {[0, 1, 2].map((index) => (
                    <button
                      key={index}
                      className={`w-3 h-3 rounded-full transition-all ${currentSlide === index ? 'bg-blue-600 w-8' : 'bg-gray-300 hover:bg-gray-400'}`}
                      onClick={() => setCurrentSlide(index)}
                      aria-label={`Go to slide ${index + 1}`}
                    />
                  ))}
                </div>
                
                {/* Navigation Arrows */}
                <button
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg z-10"
                  onClick={() => setCurrentSlide((prev) => (prev - 1 + 3) % 3)}
                >
                  ←
                </button>
                <button
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg z-10"
                  onClick={() => setCurrentSlide((prev) => (prev + 1) % 3)}
                >
                  →
                </button>
              </div>
            </div>

            {/* Category Filter Section */}
            <div className="mb-12">
              <h3 className={`text-center text-xl font-semibold ${colors.primary.foreground} mb-6`}>Browse by Category</h3>
              
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4 max-w-4xl mx-auto">
                {/* All Products */}
                <button
                  onClick={() => setActiveCategory('all')}
                  className={`flex flex-col items-center justify-center p-6 rounded-2xl transition-all duration-300 border-2 ${
                    activeCategory === 'all' 
                      ? 'bg-blue-50 border-blue-400 shadow-lg scale-105' 
                      : 'bg-white border-gray-200 hover:border-blue-300 hover:shadow-md'
                  }`}
                >
                  <div className={`w-14 h-14 rounded-full flex items-center justify-center mb-3 ${
                    activeCategory === 'all' ? 'bg-blue-100' : 'bg-gray-100'
                  }`}>
                    <Shirt className={`w-7 h-7 ${activeCategory === 'all' ? 'text-blue-600' : 'text-gray-500'}`} />
                  </div>
                  <span className={`font-medium ${activeCategory === 'all' ? 'text-blue-700' : 'text-gray-700'}`}>
                    All Products
                  </span>
                </button>
                
                {/* Designer */}
                <button
                  onClick={() => setActiveCategory('designer')}
                  className={`flex flex-col items-center justify-center p-6 rounded-2xl transition-all duration-300 border-2 ${
                    activeCategory === 'designer' 
                      ? 'bg-purple-50 border-purple-400 shadow-lg scale-105' 
                      : 'bg-white border-gray-200 hover:border-purple-300 hover:shadow-md'
                  }`}
                >
                  <div className={`w-14 h-14 rounded-full flex items-center justify-center mb-3 ${
                    activeCategory === 'designer' ? 'bg-purple-100' : 'bg-gray-100'
                  }`}>
                    <Scissors className={`w-7 h-7 ${activeCategory === 'designer' ? 'text-purple-600' : 'text-gray-500'}`} />
                  </div>
                  <span className={`font-medium ${activeCategory === 'designer' ? 'text-purple-700' : 'text-gray-700'}`}>
                    Designer
                  </span>
                </button>
                
                {/* Ethnic */}
                <button
                  onClick={() => setActiveCategory('ethnic')}
                  className={`flex flex-col items-center justify-center p-6 rounded-2xl transition-all duration-300 border-2 ${
                    activeCategory === 'ethnic' 
                      ? 'bg-amber-50 border-amber-400 shadow-lg scale-105' 
                      : 'bg-white border-gray-200 hover:border-amber-300 hover:shadow-md'
                  }`}
                >
                  <div className={`w-14 h-14 rounded-full flex items-center justify-center mb-3 ${
                    activeCategory === 'ethnic' ? 'bg-amber-100' : 'bg-gray-100'
                  }`}>
                    <Crown className={`w-7 h-7 ${activeCategory === 'ethnic' ? 'text-amber-600' : 'text-gray-500'}`} />
                  </div>
                  <span className={`font-medium ${activeCategory === 'ethnic' ? 'text-amber-700' : 'text-gray-700'}`}>
                    Ethnic
                  </span>
                </button>
                
                {/* Casual */}
                <button
                  onClick={() => setActiveCategory('casual')}
                  className={`flex flex-col items-center justify-center p-6 rounded-2xl transition-all duration-300 border-2 ${
                    activeCategory === 'casual' 
                      ? 'bg-green-50 border-green-400 shadow-lg scale-105' 
                      : 'bg-white border-gray-200 hover:border-green-300 hover:shadow-md'
                  }`}
                >
                  <div className={`w-14 h-14 rounded-full flex items-center justify-center mb-3 ${
                    activeCategory === 'casual' ? 'bg-green-100' : 'bg-gray-100'
                  }`}>
                    <Casual className={`w-7 h-7 ${activeCategory === 'casual' ? 'text-green-600' : 'text-gray-500'}`} />
                  </div>
                  <span className={`font-medium ${activeCategory === 'casual' ? 'text-green-700' : 'text-gray-700'}`}>
                    Casual
                  </span>
                </button>
                
                {/* Accessories */}
                <button
                  onClick={() => setActiveCategory('accessories')}
                  className={`flex flex-col items-center justify-center p-6 rounded-2xl transition-all duration-300 border-2 ${
                    activeCategory === 'accessories' 
                      ? 'bg-pink-50 border-pink-400 shadow-lg scale-105' 
                      : 'bg-white border-gray-200 hover:border-pink-300 hover:shadow-md'
                  }`}
                >
                  <div className={`w-14 h-14 rounded-full flex items-center justify-center mb-3 ${
                    activeCategory === 'accessories' ? 'bg-pink-100' : 'bg-gray-100'
                  }`}>
                    <Sparkles className={`w-7 h-7 ${activeCategory === 'accessories' ? 'text-pink-600' : 'text-gray-500'}`} />
                  </div>
                  <span className={`font-medium ${activeCategory === 'accessories' ? 'text-pink-700' : 'text-gray-700'}`}>
                    Accessories
                  </span>
                </button>
              </div>
            </div>

            <div className="mb-8 text-center">
              <h2 className={`text-3xl font-bold ${colors.primary.foreground} mb-2`}>Our Products</h2>
              <p className={colors.secondary.foreground}>Discover our collection of quality products</p>
            </div>
            
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <p className={colors.secondary.foreground}>Loading products...</p>
              </div>
            ) : products.length === 0 ? (
              <div className="flex justify-center items-center h-64">
                <p className={colors.secondary.foreground}>No products available</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                  <Card 
                    key={product.id} 
                    className={`flex flex-col ${colors.ui.hover} transition-shadow cursor-pointer group`}
                    onClick={() => setSelectedProduct(product)}
                  >
                    
                    {/*container for larger screens*/}
                    <div className={`relative pt-[100%] ${colors.secondary.background} md:pt-0 md:h-64`}>
                      <div className="absolute inset-0 flex items-center justify-center p-4 md:p-0">
                        <div className={`${colors.secondary.background} border-2 border-dashed rounded-xl w-full h-full flex items-center justify-center overflow-hidden`}>
                          {product.image ? (
                            <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                          ) : (
                            <span className={colors.secondary.muted}>Image</span>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-col flex-1 p-4">
                      <CardHeader className="p-0 pb-2">
                        <h3 className={`text-lg font-semibold ${colors.primary.foreground} line-clamp-1`}>{product.name}</h3>
                        <p className={`text-xs ${colors.secondary.muted}`}>{product.category}</p>
                      </CardHeader>
                      
                      <CardContent className="p-0 pb-4 flex-grow">
                        <p className={`${colors.secondary.foreground} text-sm line-clamp-2`}>{product.description}</p>
                      </CardContent>
                      
                      <CardFooter className="p-0 flex items-center justify-between">
                        <span className={`text-lg font-bold ${colors.primary.foreground}`}>₹{product.price.toFixed(2)}</span>
                        <div className="flex gap-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              addToCart(product);
                            }}
                          >
                            Add
                          </Button>
                          <Button 
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleBuyNow(product);
                            }}
                          >
                            Buy Now
                          </Button>
                        </div>
                      </CardFooter>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </>
        )}
        {/* Info Carousel Section */}
        <div className="mt-16 mb-8">
          <h3 className={`text-center text-2xl font-bold ${colors.primary.foreground} mb-10`}>Why Choose Luce Nuova</h3>
          
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-50 to-gray-100 border">
            {/* Slides Container */}
            <div className="relative h-[300px] md:h-[350px] flex overflow-hidden">
              {/* Slide 1: Delivery */}
              <div 
                className="absolute inset-0 w-full flex-shrink-0 flex flex-col md:flex-row items-center justify-center p-8 transition-transform duration-500 ease-in-out"
                style={{ transform: `translateX(${currentInfoSlide === 0 ? 0 : currentInfoSlide === 1 ? -100 : currentInfoSlide === 2 ? -200 : -300}%)` }}
              >
                <div className="md:w-1/3 flex justify-center mb-6 md:mb-0">
                  <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-gradient-to-r from-blue-100 to-cyan-100 flex items-center justify-center">
                    {/* Package icon - replace with actual image if desired */}
                    <span className="text-4xl">📦</span>
                  </div>
                </div>
                <div className="md:w-2/3 text-center md:text-left md:pl-12">
                  <h4 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">Delivery All Around India</h4>
                  <p className="text-lg text-gray-600">Fast, reliable shipping to every corner of the country. Free delivery on orders over ₹2000.</p>
                  <div className="mt-4 flex flex-wrap gap-2 justify-center md:justify-start">
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">Metro Cities: 2-3 Days</span>
                    <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">Tier 2/3: 4-5 Days</span>
                    <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">Remote Areas: 5-7 Days</span>
                  </div>
                </div>
              </div>
              
              {/* Slide 2: Authenticity */}
              <div 
                className="absolute inset-0 w-full flex-shrink-0 flex flex-col md:flex-row items-center justify-center p-8 transition-transform duration-500 ease-in-out"
                style={{ transform: `translateX(${currentInfoSlide === 0 ? 100 : currentInfoSlide === 1 ? 0 : currentInfoSlide === 2 ? -100 : -200}%)` }}
              >
                <div className="md:w-1/3 flex justify-center mb-6 md:mb-0">
                  <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-gradient-to-r from-amber-100 to-orange-100 flex items-center justify-center">
                    {/* Authenticity icon */}
                    <span className="text-4xl">🏷️</span>
                  </div>
                </div>
                <div className="md:w-2/3 text-center md:text-left md:pl-12">
                  <h4 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">Authentic & Made in India</h4>
                  <p className="text-lg text-gray-600">Proudly supporting local artisans and manufacturers. Every piece is 100% authentic with certified origins.</p>
                  <div className="mt-4">
                    <div className="inline-flex items-center space-x-2 px-4 py-2 bg-amber-50 rounded-lg">
                      <span className="text-xl">🇮🇳</span>
                      <span className="font-medium">Supporting Local Artisans</span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Slide 3: Customer Satisfaction */}
              <div 
                className="absolute inset-0 w-full flex-shrink-0 flex flex-col md:flex-row items-center justify-center p-8 transition-transform duration-500 ease-in-out"
                style={{ transform: `translateX(${currentInfoSlide === 0 ? 200 : currentInfoSlide === 1 ? 100 : currentInfoSlide === 2 ? 0 : -100}%)` }}
              >
                <div className="md:w-1/3 flex justify-center mb-6 md:mb-0">
                  <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-gradient-to-r from-green-100 to-emerald-100 flex items-center justify-center">
                    {/* Satisfaction icon */}
                    <span className="text-4xl">⭐</span>
                  </div>
                </div>
                <div className="md:w-2/3 text-center md:text-left md:pl-12">
                  <h4 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">Thousands of Satisfied Customers</h4>
                  <p className="text-lg text-gray-600">Join our community of happy shoppers with 4.8/5 average rating from 10,000+ reviews.</p>
                  <div className="mt-4 flex items-center justify-center md:justify-start space-x-4">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-gray-900">10K+</div>
                      <div className="text-gray-600">Happy Customers</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-gray-900">4.8</div>
                      <div className="text-gray-600">Avg. Rating</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-gray-900">98%</div>
                      <div className="text-gray-600">Recommend Us</div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Slide 4: Payment Methods */}
              <div 
                className="absolute inset-0 w-full flex-shrink-0 flex flex-col md:flex-row items-center justify-center p-8 transition-transform duration-500 ease-in-out"
                style={{ transform: `translateX(${currentInfoSlide === 0 ? 300 : currentInfoSlide === 1 ? 200 : currentInfoSlide === 2 ? 100 : 0}%)` }}
              >
                <div className="md:w-1/3 flex justify-center mb-6 md:mb-0">
                  <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-gradient-to-r from-indigo-100 to-violet-100 flex items-center justify-center">
                    {/* Payment icon */}
                    <span className="text-4xl">💳</span>
                  </div>
                </div>
                <div className="md:w-2/3 text-center md:text-left md:pl-12">
                  <h4 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">Secure & Flexible Payments</h4>
                  <p className="text-lg text-gray-600">Multiple payment options for your convenience, all secured with bank-level encryption.</p>
                  <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="flex flex-col items-center p-3 bg-white rounded-lg shadow-sm">
                      <div className="text-2xl mb-2">💳</div>
                      <div className="font-medium">Credit Cards</div>
                    </div>
                    <div className="flex flex-col items-center p-3 bg-white rounded-lg shadow-sm">
                      <div className="text-2xl mb-2">🏦</div>
                      <div className="font-medium">Debit Cards</div>
                    </div>
                    <div className="flex flex-col items-center p-3 bg-white rounded-lg shadow-sm">
                      <div className="text-2xl mb-2">📱</div>
                      <div className="font-medium">UPI</div>
                    </div>
                    <div className="flex flex-col items-center p-3 bg-white rounded-lg shadow-sm">
                      <div className="text-2xl mb-2">🌐</div>
                      <div className="font-medium">Net Banking</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Navigation Bullets */}
            <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-3 z-10">
              {[0, 1, 2, 3].map((index) => (
                <button
                  key={index}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${currentInfoSlide === index ? 'bg-blue-600 w-8' : 'bg-gray-300 hover:bg-gray-400'}`}
                  onClick={() => setCurrentInfoSlide(index)}
                  aria-label={`Go to info slide ${index + 1}`}
                />
              ))}
            </div>
            
            {/* Navigation Arrows */}
            <button
              className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg z-10"
              onClick={() => setCurrentInfoSlide((prev) => (prev - 1 + 4) % 4)}
            >
              ←
            </button>
            <button
              className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg z-10"
              onClick={() => setCurrentInfoSlide((prev) => (prev + 1) % 4)}
            >
              →
            </button>
          </div>
        </div>
      </main>

      {/* Shopping Cart Sidebar */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div 
            className="absolute inset-0 bg-black bg-opacity-50 transition-opacity"
            onClick={() => setIsCartOpen(false)}
          />
          
          <div className="absolute inset-y-0 right-0 max-w-full flex">
            <div className="relative w-screen max-w-md">
              <div className={`h-full flex flex-col ${colors.primary.card} ${colors.ui.shadow}-xl`}>
                <div className="flex-1 overflow-y-auto py-6 px-4 sm:px-6">
                  <div className="flex items-start justify-between">
                    <h2 className={`text-lg font-medium ${colors.primary.foreground}`}>Shopping Cart</h2>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => setIsCartOpen(false)}
                    >
                      <X className="h-6 w-6" />
                    </Button>
                  </div>
                  
                  <div className="mt-8">
                    {cart.length === 0 ? (
                      <div className="text-center py-12">
                        <ShoppingCart className={`mx-auto h-12 w-12 ${colors.secondary.muted}`} />
                        <h3 className={`mt-2 text-sm font-medium ${colors.primary.foreground}`}>Your cart is empty</h3>
                        <p className={`mt-1 text-sm ${colors.secondary.muted}`}>Add some items to your cart</p>
                      </div>
                    ) : (
                      <div className="flow-root">
                        <ul className={`-my-6 divide-y ${colors.secondary.border}`}>
                          {cart.map((item) => (
                            <li key={item.product.id} className="py-6 flex">
                              <div className={`h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border ${colors.secondary.border} ${colors.secondary.background} flex items-center justify-center`}>
                                <div className={`${colors.secondary.background} border-2 border-dashed rounded-xl w-16 h-16`} />
                              </div>
                              
                              <div className="ml-4 flex-1 flex flex-col">
                                <div>
                                  <div className="flex justify-between text-base font-medium text-gray-900">
                                    <h3 className="line-clamp-1">{item.product.name}</h3>
                                    <p className="ml-4">₹{(item.product.price * item.quantity).toFixed(2)}</p>
                                  </div>
                                  <p className={`mt-1 text-sm ${colors.secondary.muted}`}>{item.product.category}</p>
                                </div>
                                
                                <div className="flex-1 flex items-end justify-between text-sm">
                                  <div className={`flex items-center border rounded-md ${colors.secondary.border}`}>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                                      disabled={item.quantity <= 1}
                                      className="h-8 w-8"
                                    >
                                      <Minus className="h-4 w-4" />
                                    </Button>
                                    <span className="px-2">{item.quantity}</span>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                                      className="h-8 w-8"
                                    >
                                      <Plus className="h-4 w-4" />
                                    </Button>
                                  </div>
                                  
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => removeFromCart(item.product.id)}
                                    className={`font-medium text-red-600 hover:text-red-500`}
                                  >
                                    Remove
                                  </Button>
                                </div>
                              </div>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
                
                {cart.length > 0 && (
                  <div className={`border-t ${colors.secondary.border} py-6 px-4 sm:px-6`}>
                    <div className={`flex justify-between text-base font-medium ${colors.primary.foreground}`}>
                      <p>Subtotal</p>
                      <p>₹{cartTotal.toFixed(2)}</p>
                    </div>
                    <p className={`mt-0.5 text-sm ${colors.secondary.muted}`}>Shipping and taxes calculated at checkout.</p>
                    <div className="mt-6">
                      <Button 
                        className="w-full bg-green-600 hover:bg-green-700"
                        onClick={() => {
                          if (cart.length > 0) {
                            setPaymentModalOpen(true);
                            // For cart checkout, we don't set a current product since it's multiple items
                            setCurrentProduct(null);
                          }
                        }}
                      >
                        Checkout
                      </Button>
                    </div>
                    <div className="mt-4 flex justify-center text-sm text-gray-500">
                      <p>
                        or{' '}
                        <button
                          type="button"
                          className="font-medium text-primary hover:text-primary/80"
                          onClick={() => setIsCartOpen(false)}
                        >
                          Continue Shopping
                          <span aria-hidden="true"> &rarr;</span>
                        </button>
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Payment Modal */}
      {paymentModalOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div 
            className="absolute inset-0 bg-black bg-opacity-50 transition-opacity"
            onClick={() => setPaymentModalOpen(false)}
          />
          
          <div className="absolute inset-0 flex items-center justify-center p-4">
            <div className={`relative w-full max-w-md ${colors.primary.card} rounded-lg ${colors.ui.shadow}-xl p-6`}>
              <div className="flex items-center justify-between mb-4">
                <h2 className={`text-xl font-bold ${colors.primary.foreground}`}>Complete Your Purchase</h2>
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => setPaymentModalOpen(false)}
                >
                  <X className="h-6 w-6" />
                </Button>
              </div>
              
              {currentProduct ? (
                // Single product purchase
                <div className="mb-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className={`h-16 w-16 flex-shrink-0 overflow-hidden rounded-md border ${colors.secondary.border} ${colors.secondary.background} flex items-center justify-center`}>
                      {currentProduct.image ? (
                        <img src={currentProduct.image} alt={currentProduct.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className={`${colors.secondary.background} border-2 border-dashed rounded-xl w-12 h-12`} />
                      )}
                    </div>
                    <div>
                      <h3 className={`font-semibold ${colors.primary.foreground}`}>{currentProduct.name}</h3>
                      <p className={colors.secondary.muted}>{currentProduct.category}</p>
                      <p className={`text-lg font-bold ${colors.primary.foreground}`}>₹{currentProduct.price.toFixed(2)}</p>
                    </div>
                  </div>
                  
                  <div className={`p-4 rounded-md ${colors.secondary.background} mb-4`}>
                    <h4 className={`font-medium ${colors.primary.foreground} mb-2`}>Payment Methods</h4>
                    <div className="space-y-2">
                      <label className="flex items-center gap-2">
                        <input type="radio" name="payment" defaultChecked />
                        <span>Credit/Debit Card</span>
                      </label>
                      <label className="flex items-center gap-2">
                        <input type="radio" name="payment" />
                        <span>UPI</span>
                      </label>
                      <label className="flex items-center gap-2">
                        <input type="radio" name="payment" />
                        <span>Net Banking</span>
                      </label>
                    </div>
                  </div>
                </div>
              ) : (
                // Cart checkout
                <div className="mb-6">
                  <h3 className={`font-semibold ${colors.primary.foreground} mb-4`}>Order Summary</h3>
                  <div className="space-y-2 mb-4">
                    {cart.map((item) => (
                      <div key={item.product.id} className="flex justify-between">
                        <span className={colors.secondary.foreground}>
                          {item.product.name} x {item.quantity}
                        </span>
                        <span className={colors.primary.foreground}>
                          ₹{(item.product.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>
                  <div className={`flex justify-between font-bold ${colors.primary.foreground} border-t pt-2`}>
                    <span>Total:</span>
                    <span>₹{cartTotal.toFixed(2)}</span>
                  </div>
                  
                  <div className={`p-4 rounded-md ${colors.secondary.background} mt-4`}>
                    <h4 className={`font-medium ${colors.primary.foreground} mb-2`}>Payment Methods</h4>
                    <div className="space-y-2">
                      <label className="flex items-center gap-2">
                        <input type="radio" name="payment" defaultChecked />
                        <span>Credit/Debit Card</span>
                      </label>
                      <label className="flex items-center gap-2">
                        <input type="radio" name="payment" />
                        <span>UPI</span>
                      </label>
                      <label className="flex items-center gap-2">
                        <input type="radio" name="payment" />
                        <span>Net Banking</span>
                      </label>
                    </div>
                  </div>
                </div>
              )}
              
              <div className="flex gap-3">
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => setPaymentModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button 
                  className="flex-1 bg-green-600 hover:bg-green-700"
                  onClick={() => {
                    if (currentProduct) {
                      processPayment();
                    } else {
                      // Process cart payment
                      alert(`Payment of ₹${cartTotal.toFixed(2)} for ${cart.length} items processed successfully!`);
                      setPaymentModalOpen(false);
                      setCart([]); // Clear cart after successful payment
                      setIsCartOpen(false);
                    }
                  }}
                >
                  Pay {currentProduct ? `₹${currentProduct.price.toFixed(2)}` : `₹${cartTotal.toFixed(2)}`}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      <footer className={`mt-20 ${colors.primary.card} border-t ${colors.secondary.border}`}>
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Brand Column */}
            <div className="space-y-4">
              <div className="flex items-center">
                <Image 
                  src="/images/lucenuova_logo.png"
                  alt="Luce Nuova"
                  width={140}
                  height={45}
                  className="h-auto w-auto"
                />
              </div>
              <p className={`${colors.secondary.foreground} text-sm max-w-xs`}>
                Bringing authentic Indian craftsmanship to your wardrobe. Quality, tradition, and style in every stitch.
              </p>
            </div>
            
            {/* Links Column 1 */}
            <div>
              <h4 className={`font-bold ${colors.primary.foreground} mb-4 text-lg`}>Information</h4>
              <ul className="space-y-3">
                <li>
                  <Link href="/about" className={`${colors.secondary.foreground} hover:${colors.primary.foreground} transition-colors`}>
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className={`${colors.secondary.foreground} hover:${colors.primary.foreground} transition-colors`}>
                    Terms and Conditions
                  </Link>
                </li>
                <li>
                  <Link href="/shipping" className={`${colors.secondary.foreground} hover:${colors.primary.foreground} transition-colors`}>
                    Shipping Policy
                  </Link>
                </li>
                <li>
                  <Link href="/privacy" className={`${colors.secondary.foreground} hover:${colors.primary.foreground} transition-colors`}>
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/returns" className={`${colors.secondary.foreground} hover:${colors.primary.foreground} transition-colors`}>
                    Return & Exchange
                  </Link>
                </li>
              </ul>
            </div>
            
            {/* Links Column 2 */}
            <div>
              <h4 className={`font-bold ${colors.primary.foreground} mb-4 text-lg`}>Support</h4>
              <ul className="space-y-3">
                <li>
                  <Link href="/contact" className={`${colors.secondary.foreground} hover:${colors.primary.foreground} transition-colors`}>
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link href="/faq" className={`${colors.secondary.foreground} hover:${colors.primary.foreground} transition-colors`}>
                    FAQ
                  </Link>
                </li>
                <li>
                  <Link href="/track" className={`${colors.secondary.foreground} hover:${colors.primary.foreground} transition-colors`}>
                    Track Your Order
                  </Link>
                </li>
                <li>
                  <Link href="/authenticity" className={`${colors.secondary.foreground} hover:${colors.primary.foreground} transition-colors`}>
                    Authenticity
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          
          {/* Bottom Bar */}
          <div className={`mt-12 pt-8 border-t ${colors.secondary.border}`}>
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className={`${colors.secondary.muted} text-sm`}>
                © {new Date().getFullYear()} Luce Nuova. All rights reserved.
              </p>
              <div className="flex space-x-6 mt-4 md:mt-0">
                {/* Social Media Icons (Placeholder) */}
                <a href="#" className={`${colors.secondary.muted} hover:${colors.primary.foreground} transition-colors`}>
                  <span className="text-lg">📱</span>
                </a>
                <a href="#" className={`${colors.secondary.muted} hover:${colors.primary.foreground} transition-colors`}>
                  <span className="text-lg">📧</span>
                </a>
                <a href="#" className={`${colors.secondary.muted} hover:${colors.primary.foreground} transition-colors`}>
                  <span className="text-lg">📘</span>
                </a>
                <a href="#" className={`${colors.secondary.muted} hover:${colors.primary.foreground} transition-colors`}>
                  <span className="text-lg">📷</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}


/*tweaked code for adding images instead of icons in the information carousel
<Image 
  src="/images/delivery-partner.png" 
  alt="Delivery Partner" 
  width={48} 
  height={48}
  className="w-12 h-12"
/>
*/