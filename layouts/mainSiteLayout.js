import Header from 'components/header'
import styles from './mainSiteLayout.module.scss'
import { Add } from '@material-ui/icons'
import Link from 'next/link'

export default function MainSiteLayout({ itemTags = [], children, availableEntryCategories = [], siteSettings = [] }) {

  const footerMenuItemsRender = siteSettings.footer_menu_items ? siteSettings.footer_menu_items.map((item) => {
    return (
      <Link href={item.item_url}>
        <a className={styles.footerMenuItem}>
          {item.item_title}
        </a>
      </Link>
    )
  }) : []

  return (
    <div className={styles.appLayout}>
      <section className={styles.appHeader}>
        <Header itemTags = {itemTags} availableEntryCategories = {availableEntryCategories} siteSettings = {siteSettings} />
      </section>
      {children}
      <Link href='/dodaj-unos'>
        <a className={styles['floating-action-button']}>
          <Add />
        </a>
      </Link>
      <footer className={styles.appFooter}>
        <div className={styles.footerMenu}>
          {footerMenuItemsRender}
        </div>
        <div className={styles.footerNotice} dangerouslySetInnerHTML={{ __html: siteSettings.footer_notice_text }}>
          
        </div>
      </footer>
    </div>
  )
}