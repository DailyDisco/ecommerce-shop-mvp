import React from 'react'
import Link from 'next/link'
import { AiOutlineShopping } from 'react-icons/ai' // shopping icon

import { Cart } from './'
import { useStateContext } from '../context/StateContext'

const Navbar = () => {
  const { showCart, setShowCart, totalQuantities } = useStateContext()
  return (
    <div className='navbar-container'>
      <p className='logo'>
        <Link href='/'>
          Electronics, Shoes, and more!
        </Link>
      </p>

      <button type='button'
      className='cart-icon' onClick={() => setShowCart(true)}>
        <AiOutlineShopping />
        <span className='cart-item-qty'>{totalQuantities}</span> 
        {/* this will display the quantity in stock */}
      </button>

      {showCart && <Cart />} 
      {/* this will display the cart if the button is clicked */}
      
    </div>
  )
}

export default Navbar