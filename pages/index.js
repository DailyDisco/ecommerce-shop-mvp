import React from 'react'

import { client } from '../lib/client'
import { Product, FooterBanner, HeroBanner } from '../components'

const Home = ({ products, bannerData }) => (
    <div>
      <HeroBanner heroBanner={bannerData.length && bannerData[0]}/>

      <div className='products-heading'>
        <h2>Best Selling Products</h2>
        <p>Products of all Kind!</p>
      </div>

      <div className='products-container'>
        {products?.map((product) => <Product 
        key={product._id} product={product} /> )}
      </div>

      <FooterBanner FooterBanner={bannerData && bannerData[0]} />
    </div>
  );

export const getServerSideProps = async () => {
  const query = '*[_type == "product"]' // let's grab all the products from sanity dashboard

  const products = await client.fetch(query) // fetch the products from sanity dashboard

  const bannerQuery = '*[_type == "banner"]'
  const bannerData = await client.fetch(bannerQuery)

  return {
    props: { products, bannerData }
  }
}

export default Home