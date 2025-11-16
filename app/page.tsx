"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Minus, Plus, ShoppingCart, X } from "lucide-react";
import Link from 'next/link';

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

export default function EcommerceSkeleton() {
  // State management
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<Product | null>(null);

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
    // For now, we'll just show an alert
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
    <div className={`min-h-screen ${colors.primary.background}`}>
      {/* Header */}
      <header className={`sticky top-0 z-10 ${colors.primary.card} ${colors.ui.shadow}`}>
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className={`text-2xl font-bold ${colors.primary.foreground}`}>Luce Nuova</h1>
          
          <nav className="flex items-center space-x-6">
            <Link href="/" className="text-gray-700 hover:text-gray-900">Products
            </Link>
            <Link href="/about" className="text-gray-700 hover:text-gray-900">About Us
            </Link>
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
          </nav>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
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
                    {/* Square image container for larger screens */}
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
    </div>
  );
}