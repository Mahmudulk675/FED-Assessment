const Products = {
  /**
   * Takes a JSON representation of the products and renders cards to the DOM
   * @param {Object} productsJson
   */
  displayProducts: (productsJson) => {
    // Render the products here
    const container = document.querySelector(".container");
    let products = productsJson.data.products.edges;

    // loop
    for (const product of products) {
      // destructure
      const { node } = product;
      const { tags, images, priceRange, title } = node;

      // html start
      const productHtml = ` <div class="card" style="">
      <img src="${
        images?.edges[0]?.node?.originalSrc
      }" class="card-img-top " width="100%" alt="${node.title}" />
      <div class="card-body">
        <h1 class="card-title">${title}</h1>
        <h5 class="card-price">
        $${priceRange?.minVariantPrice?.amount} ${
        priceRange?.minVariantPrice?.currencyCode
      }</h5>
       <div class="card-bottom">
       <div class="tags">
       ${tags.map((tag) => `<span class="badge bg-primary">${tag}</span>`)}
       </div>
       <div class="btn-container">
       <button class="btn buy-btn">Buy</button>
       <button class="btn cart-btn">Add to cart</button>
       </div>
     </div>
       </div>
    </div>`;
      container.insertAdjacentHTML("afterbegin", productHtml);

      // html ends
    }
    console.log(products);
  },

  state: {
    storeUrl: "https://api-demo-store.myshopify.com/api/2020-07/graphql",
    contentType: "application/json",
    accept: "application/json",
    accessToken: "b8385e410d5a37c05eead6c96e30ccb8",
  },

  /**
   * Sets up the query string for the GraphQL request
   * @returns {String} A GraphQL query string
   */
  query: () => `
    {
      products(first:3) {
        edges {
          node {
            id
            handle
            title
            tags
            images(first:1) {
              edges {
                node {
                  originalSrc
                }
              }
            }
            priceRange {
              minVariantPrice {
                amount
                currencyCode
              }
            }
          }
        }
      }
    }
  `,

  /**
   * Fetches the products via GraphQL then runs the display function
   */
  handleFetch: async () => {
    const productsResponse = await fetch(Products.state.storeUrl, {
      method: "POST",
      headers: {
        "Content-Type": Products.state.contentType,
        Accept: Products.state.accept,
        "X-Shopify-Storefront-Access-Token": Products.state.accessToken,
      },
      body: JSON.stringify({
        query: Products.query(),
      }),
    });
    const productsResponseJson = await productsResponse.json();
    Products.displayProducts(productsResponseJson);
  },

  /**
   * Sets up the click handler for the fetch button
   */
  initialize: () => {
    // Add click handler to fetch button
    const fetchButton = document.querySelector(".fetchButton");
    if (fetchButton) {
      fetchButton.addEventListener("click", Products.handleFetch);
    }
  },
};

document.addEventListener("DOMContentLoaded", () => {
  Products.initialize();
});
