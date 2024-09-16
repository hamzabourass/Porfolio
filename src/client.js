// This is the file to use for the Sanity client in React.
import imageUrlBuilder from '@sanity/image-url';
import { createClient } from '@sanity/client';

export const client = createClient({
    projectId: process.env.REACT_APP_SANITY_PROJECT_ID,
    dataset: 'production',
    apiVersion: '2024-09-15',
    useCdn: true, // The cdn means that the images will be fetched from Sanity's CDN
    token: process.env.REACT_APP_SANITY_TOKEN,
    ignoreBrowserTokenWarning: true,
  });

// Helper function to build image url
const builder = imageUrlBuilder(client);

export const urlFor = (source) => builder.image(source)
  

