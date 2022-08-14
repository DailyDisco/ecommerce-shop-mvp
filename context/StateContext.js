import React, { createContext, useContext, useState, useEffect } from 'react'

import { toast } from 'react-hot-toast' // this is the pop up notification library for when you add to cart or complete purchase etc..

const Context = createContext();

export const StateContext = ({ children }) => {
    const [showCart, setShowCart] = useState(false); // this is the cart toggle state that will show the cart when clicked
    const [cartItems, setCartItems] = useState([]); // this is the cart items array; we always need to know what is in the cart
    const [totalPrice, setTotalPrice] = useState(0); // this is the total price of the cart
    const [totalQuantities, setTotalQuantities] = useState(0); // this is the total quantity of the cart
    const [qty, setQty] = useState(1); // this is the quantity of the product that is added to the cart

    let foundProduct;
    let index;

    const onAdd = (product, quantity) => {
        const checkProductInCart = cartItems.find((item) => item._id === product._id); // this is the find method that will check if the product is already in the cart

        setTotalPrice((prevTotalPrice) => prevTotalPrice + product.price * quantity); // this is the total price of the cart
        setTotalQuantities((prevTotalQuantities) => prevTotalQuantities + quantity); // this is the total quantity of the cart

        if(checkProductInCart) {

            const updatedCartItems = cartItems.map((cartProduct) => {
                // if the cart product id is the same as the product id that is added to the cart return the cart product with the quantity added to the cart
                if(cartProduct._id === product._id) {
                    return { ...cartProduct, quantity: cartProduct.quantity + quantity };
                }
            });
            setCartItems(updatedCartItems); // this is the cart items array with the new quantity added to the cart
        } else {
            product.quantity = quantity; // this is the quantity of the product that is added to the cart
            
            setCartItems([...cartItems, { ...product }]); // this is the cart items array with the new product added to the cart
        }
        toast.success(`${qty} ${product.name} added to the cart.`); // this is the toast notification that will show when you add to cart
    }

    const onRemove = (product) => {
        foundProduct = cartItems.find((item) => item._id === product._id);
        const newCartItems = cartItems.filter((item) => item._id !== product._id); // this is the cart items array with the product removed from the cart

        setTotalPrice((prevTotalPrice) => prevTotalPrice - foundProduct.price * foundProduct.quantity) // this is the total price of the cart

        setTotalQuantities(prevTotalQuantities => prevTotalQuantities - foundProduct.quantity) // this is the total quantity of the cart

        setCartItems(newCartItems); // this is the cart items array with the product removed from the cart
    }

    const toggleCartItemQuantity = (id, value) => {
        foundProduct = cartItems.find((item) => item._id === id);
        index = cartItems.findIndex((product) => product._id === id);
        const newCartItems = cartItems.filter((item) => item._id !== id); // this is the cart items array with the product removed from the cart
        // we use .filter vs .splice because we can't mutate states directly

        if(value === 'inc') {
            // here we are setting that setCartItems useState to the cartItems array with the updated quantity of the product
            setCartItems([...newCartItems, { ...foundProduct, quantity: foundProduct.quantity + 1 }]);
            setTotalPrice((prevTotalPrice) => prevTotalPrice + foundProduct.price);
            setTotalQuantities(prevTotalQuantities => prevTotalQuantities + 1);
        } else if(value === 'dec') {

            // we can only update if there is a quantity of 1 or more
            if(foundProduct.quantity > 1) {
            setCartItems([...newCartItems, { ...foundProduct, quantity: foundProduct.quantity - 1 }]);
            setTotalPrice((prevTotalPrice) => prevTotalPrice - foundProduct.price);
            setTotalQuantities(prevTotalQuantities => prevTotalQuantities - 1);
            }
        }
    }

    // this next function is what happens when you click + on the product page
    const incQty = () => {
        setQty((prevQty) => prevQty + 1);
    }

    // this next function is what happens when you click - on the product page
    const decQty = () => {
        setQty((prevQty) => {
            if(prevQty - 1 < 1) return 1;
            return prevQty - 1
        });
    }       

    return (
        <Context.Provider
            value={{
                showCart,
                setShowCart,
                cartItems, 
                totalPrice, 
                totalQuantities,
                qty,
                incQty,
                decQty,
                onAdd,
                toggleCartItemQuantity,
                onRemove,
                setCartItems,
                setTotalPrice,
                setTotalQuantities
            }}
        >
            {children}
        </Context.Provider>
    )
}

export const useStateContext = () => useContext(Context); // this is the hook that we use to access the state context more easily in other pages