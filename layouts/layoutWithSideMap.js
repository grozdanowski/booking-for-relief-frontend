import dynamic from 'next/dynamic'
import styles from './layoutWithSideMap.module.scss'

export default function layoutWithSideMap({ items, onMarkerClick = null, children }) {

  const DynamicMap = dynamic(() => import('components/displayMap'))

  return (
    <div className={styles.wrapper}>
      <aside className={styles.mapWrapper}>
        <DynamicMap items = { items } onMarkerClick = { onMarkerClick } />
      </aside>
      <main className={styles.mainWrapper}>
        <div className={styles.mainInner}>
          {children}
        </div>
      </main>
    </div>
  )
}