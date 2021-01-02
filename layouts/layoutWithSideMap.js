import dynamic from 'next/dynamic'
import styles from './layoutWithSideMap.module.scss'
import Router from 'next/router'

export default function layoutWithSideMap({ items, onMarkerClick = null, children }) {

  const DynamicMap = dynamic(() => import('components/displayMap'))

  const handleMarkerClick = (type, id) => {
    switch (type) {
      case 'accommodation':
        Router.push(`/smjestaj/${id}`)
        break;
      case 'transport':
        Router.push(`/prijevoz/${id}`)
        break
      case 'aidCollection':
        Router.push(`/prikup-donacija/${id}`)
        break
      case 'aidRequest':
        Router.push(`/trazim-pomoc/${id}`)
        break
      default:
        break;
    }
  }

  return (
    <div className={styles.wrapper}>
      <aside className={styles.mapWrapper}>
        {items.length && (
          <DynamicMap items = { items } onMarkerClick = { onMarkerClick ? onMarkerClick : (type, id) => handleMarkerClick(type, id) } />
        )}
      </aside>
      <main className={styles.mainWrapper}>
        <div className={styles.mainInner}>
          {children}
        </div>
      </main>
    </div>
  )
}