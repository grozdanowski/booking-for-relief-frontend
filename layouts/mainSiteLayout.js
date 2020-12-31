import Header from 'components/header'
import styles from './mainSiteLayout.module.scss'
import RedirectNotificationModal from 'components/redirectNotificationModal'
import { useState } from 'react'


export default function MainSiteLayout({ filterValue, setLocationFilterFunction, children }) {

  const [notificationModalActive, setNotificationModalActive] = useState(true)

  return (
    <div className={styles.appLayout}>
      {notificationModalActive && (
        <RedirectNotificationModal dismissFunction={() => setNotificationModalActive(false)} />
      )}
      <section className={styles.appHeader}>
        <Header filterValue = {filterValue} setLocationFilterFunction = {setLocationFilterFunction} />
      </section>
      {children}
      <footer className={styles.appFooter}>
        Aplilkacija je work in progress i kontinuirano se radi na unaprijeđenju. Za sve probleme i upite slobodno se javite na <a href="mailto:matej@bytepanda.io">matej@bytepanda.io</a>.
      </footer>
    </div>
  )
}