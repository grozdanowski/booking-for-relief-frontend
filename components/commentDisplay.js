import Moment from 'react-moment'
import styles from './commentDisplay.module.scss'

export default function CommentDisplay({data}) {

  return (
    <div className={styles.comment}>
      <div className={styles.header}>
        <span className={styles.author}>{data.author}</span>
        <span className={styles.timestamp}><Moment date={data.created_at} format='DD.MM.YYYY, H:mm' /></span>
      </div>
      <div className={styles.content}>
        {data.content}
      </div>
    </div>
  )
}