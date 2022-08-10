import sanityClient from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';

export const client = sanityClient({
    projectId: 'ompjjvug',
    dataset: 'production', // are we in dev or prod?
    apiVersion: '2022-03-10',
    useCdn: true,
    token: process.env.NEXT_PUBLIC_SANITY_TOKEN // set token via `sanity.io/dashboard`
});

const builder = imageUrlBuilder(client); // create an image builder

export const urlFor = (source) => builder.image(source);

