import { useRouter } from 'next/router'
import { ArrowBack } from '@material-ui/icons'
import styles from './navigateBack.module.scss'

export default function NavigateBack() {
  const router = useRouter()

  return (
    <button className={styles.navigateBack} onClick={() => router.back()}>
      <ArrowBack className={styles.icon} />
      <span className={styles.label}>Natrag</span>
    </button>
  )
}