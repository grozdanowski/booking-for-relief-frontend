import Head from 'next/head'
import { fetchQuery } from 'utils/utils'
import styles from './index.module.scss'
import MainSiteLayout from 'layouts/mainSiteLayout'
import LayoutWithSideMap from 'layouts/layoutWithSideMap'
import ReactMarkdown from 'react-markdown'

export default function Info({ pageData, itemTags }) {
  
  return (
    <div>
      <Head>
        <title>Pomoć žrtvama potresa | {pageData.page_title}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <MainSiteLayout itemTags = {itemTags}>
        <LayoutWithSideMap items = {[]}>
          <div className={styles.introSection}>
            <h1>{pageData.page_title}</h1>
          </div>

          <ReactMarkdown source={pageData.page_content} escapeHtml={false} />

        </LayoutWithSideMap>
      </MainSiteLayout>
    </div>
  )
}

export async function getServerSideProps() {
  const pageData = await fetchQuery('additional-information');
  const itemTags = await fetchQuery('item-tags', `?_sort=tag&_limit=-1`);
  return {
    props: {
      pageData,
      itemTags,
    }
  }
}