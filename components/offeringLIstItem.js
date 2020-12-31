import styles from './offeringListItem.module.scss'

export default function OfferingListItem({ children }) {

  return (
    <article className={styles.wrapper}>
      {children}
    </article>
  )
}