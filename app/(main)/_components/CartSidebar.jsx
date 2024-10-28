'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { BsBagCheck, BsBagDash, BsFillCartXFill } from 'react-icons/bs';
import { IoCloseSharp } from 'react-icons/io5';
import { TbCurrencyTaka } from 'react-icons/tb';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { useCart } from '@/app/context/CartContext';
import Image from 'next/image';
import { useStock } from '@/app/context/StockContext';

const CartSidebar = ({ isOpen, onClose }) => {
  const { cart, setCart } = useCart();
  const [cartItems, setCartItems] = useState([]);
  const router = useRouter();
  const [cartSubtotal, setCartSubtotal] = useState(0);
  const { stock, updateStock } = useStock(); // Get the stock context

// console.log(stock);

  useEffect(() => {
    
    setCartItems(cart.cartItems);
  }, [cart.cartItems]);

  useEffect(() => {
    const loadCartItems = async () => {
      let items = [];
      const storedCart = localStorage.getItem("cart");
      items = storedCart ? JSON.parse(storedCart)?.cartItems || [] : [];

      setCartItems(items);
    };

    loadCartItems();
  }, [setCart]);
  // console.log("cart in viewcart", cart);

  useEffect(() => {
    if (Array.isArray(cartItems)) {
      let subtotal = 0;
      cartItems.forEach((item) => {
        subtotal += item.quantity * (item.discountPrice || item.price);
      });
      setCartSubtotal(subtotal);
    } else {
      console.warn("cartItems is not an array:", cartItems);
    }
  }, [cartItems]);



  const handleRemoveItem = async (id) => {
    try {
      // Find the item to be removed from the cart
      const removedItem = cartItems.find(item => item.productId === id);
  
      if (removedItem) {
        // Use updateStock to add the removed item's quantity back to stock
        updateStock(removedItem.productId, removedItem.quantity);
      }
  
      // Filter out the removed item from the cart
      const updatedCartItems = cartItems.filter(item => item.productId !== id);
      console.log(updatedCartItems);
  
      // Log the updated cart items for debugging
      console.log("Updated cart items:", updatedCartItems);
      
      // Update the cart state and save to localStorage
      setCart({ cartItems: updatedCartItems });
      localStorage.setItem("cart", JSON.stringify({ cartItems: updatedCartItems }));
  
      // Show success message
      toast.success("Item removed from cart");
    } catch (error) {
      console.error("Error removing item:", error);
      toast.error("Failed to remove item from cart");
    }
  };
  
  
  


  const handleNavigation = (href) => {
    router.push(href);

    onClose();
  };

  return (
    <>
      <div
        className={`fixed top-0 right-0 w-[300px] sm:w-1/2 lg:w-2/5 xl:w-[26%] h-full bg-white shadow-lg transform z-50 ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        } transition-transform duration-300 ease-in-out`}
      >
        <div className='flex items-center justify-between border-b-2 border-gray-500 py-5'>
          <h2 className='text-gray-800 font-semibold px-4'>SHOPPING CART</h2>
          <button className='text-gray-700 hover:text-gray-900 p-1 border-2 mr-2 border-[#fcb74f] hover:bg-[#fcb74f]' onClick={onClose}>
            <IoCloseSharp className='text-2xl' />
          </button>
        </div>

        <div className='h-full flex flex-col justify-between'>
          {cartItems.length > 0 ? (
            <div className='flex-grow overflow-y-auto'>
              {cartItems.map((item) => (
                <div
                  key={item.productId}
                  className='flex items-start justify-start sm:gap-4 gap-2 hover:bg-gray-200 sm:p-4 p-2'
                >
                  <Image
                    src={item.productImage}
                    alt={item.productName}
                    width={40}
                    height={40}
                    className='sm:w-16 sm:h-16 w-10 h-10 object-cover'
                  />
                  <div className='flex flex-col items-start justify-center text-xs sm:gap-2 sm:text-sm'>
                    <div className='flex items-center justify-between gap-1'>
                      <h4 className='font-semibold'>{item.productName}</h4>
                      {item.productLocalName && (<h4 className='font-semibold'>{item.productLocalName}</h4>)}
                      <p className='text-xs md:text-sm font-semibold text-gray-600'> - {item.productSizes}</p>
                    </div>
                    <p className='text-sm font-semibold flex items-center text-gray-500'>
                      {item.quantity} <IoCloseSharp className='text-red-500 ml-2' />{' '}
                      {item.discountPrice ? (
                        <span className='flex items-center justify-center text-[#7d9626]'>
                          <TbCurrencyTaka className='xl:text-xl lg:text-lg' />
                          {item.discountPrice.toLocaleString()}
                        </span>
                      ) : (
                        <span className='flex items-center justify-center text-[#7d9626]'>
                          <TbCurrencyTaka className='xl:text-xl lg:text-lg' />
                          {item.price.toLocaleString()}
                        </span>
                      )}
                    </p>
                  </div>
                  <IoCloseSharp
                    className='sm:text-2xl text-lg text-gray-800 hover:bg-[#fcb74f] hover:rounded-full p-1 hover:scale-105 cursor-pointer'
                    onClick={() => handleRemoveItem(item.productId)}
                  />
                </div>
              ))}

              <div className='flex flex-col items-start'>
                <div className='flex items-center justify-between w-full border-t-2 border-gray-500 sm:px-4 sm:py-2 px-3'>
                  <h2 className='text-gray-800 font-semibold text-sm sm:text-lg'>SUBTOTAL</h2>
                  <span className='flex items-center justify-center text-[#7d9626] font-semibold text-xl'>
                    <TbCurrencyTaka className='text-2xl' />
                    {cartSubtotal.toLocaleString()}
                  </span>
                </div>
                <div className='flex items-center justify-between gap-2 w-full px-4 py-2'>
                  <button
                    onClick={() => handleNavigation('/cart')}
                    className='sm:text-base text-xs flex items-center font-medium border-[#7d9626] border-2 bg-white text-black hover:bg-[#7d9626] hover:text-white sm:px-8 sm:py-2 p-2'
                  >
                    <BsBagDash className='mr-2 text-lg md::text-xl'/> View Cart
                  </button>
                  <button
                    onClick={() => handleNavigation('/checkout')}
                    className='sm:text-base flex items-center text-xs font-medium text-white hover:text-gray-900 border-[#7d9626] border-2 bg-[#7d9626] hover:bg-white  sm:px-8 sm:py-2 p-2'
                  >
                    <BsBagCheck className='mr-2 text-lg md:text-xl'/>Checkout
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className='flex flex-col items-center justify-center gap-3 py-4'>
              <BsFillCartXFill className='text-red-300 text-9xl opacity-50' />
              <p className='text-base text-gray-900 font-semibold'>No Products In The Cart</p>
              <Link href='/shop'>
                <button
                  className='text-sm font-medium text-white bg-[#fcb74f] hover:border-[#fcb74f] hover:border-2 hover:text-black hover:bg-white px-4 py-2'
                  onClick={onClose}
                >
                  Return To Shop
                </button>
              </Link>
            </div>
          )}
        </div>
      </div>
      {isOpen && <div className='fixed inset-0 bg-black opacity-50 z-40' onClick={onClose}></div>}
      {/* onClick={onClose} */}
    </>
  );
};

export default CartSidebar;
