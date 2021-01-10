import Document, { Html, Head, Main, NextScript } from 'next/document'

import getConfig from 'next/config'
const { publicRuntimeConfig } = getConfig()

class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const initialProps = await Document.getInitialProps(ctx)
    return { ...initialProps }
  }

  render() {
    return (
      <Html>
        <Head>
        <script type="text/javascript" src={`https://maps.googleapis.com/maps/api/js?key=${publicRuntimeConfig.googleMapsApiKey}&libraries=places`}></script>
          <script async src="https://www.googletagmanager.com/gtag/js?id=G-GXNLJB75CK" />
          <script
            dangerouslySetInnerHTML={{
              __html: `
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
              
                gtag('config', 'G-GXNLJB75CK');
                `,
            }}
          />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

export default MyDocument