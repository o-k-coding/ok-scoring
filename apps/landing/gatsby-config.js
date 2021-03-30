module.exports = {
  siteMetadata: {
    title: `landing`,
    description: `This is a gatsby application created by Nx.`,
  },
  plugins: [
    'gatsby-plugin-sass',

    {
      resolve: 'gatsby-plugin-svgr',
      options: {
        svgo: false,
        ref: true,
      },
    },
    `gatsby-plugin-react-helmet`,
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `images`,
        path: `${__dirname}/src/images`,
      },
    },
    `gatsby-transformer-sharp`,
    {
      resolve: require.resolve(`@nrwl/gatsby/plugins/nx-gatsby-ext-plugin`),
      options: {
        path: __dirname,
      },
    },
    `gatsby-plugin-sharp`,
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `landing`,
        short_name: `starter`,
        start_url: `/`,
        background_color: `#e68e7c`,
        theme_color: `#e68e7c`,
        display: `minimal-ui`,
        icon: `src/images/favicon.ico`,
      },
    },
  ],
};
