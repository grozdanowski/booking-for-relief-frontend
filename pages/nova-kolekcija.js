import Head from 'next/head'
import styles from './newEntry.module.scss'
import { useState } from 'react'
import { fetchQuery } from 'utils/potres2020utils'
import MainSiteLayout from 'layouts/mainSiteLayout'
import LayoutWithSideMap from 'layouts/layoutWithSideMap'
import TextField from '@material-ui/core/TextField'
import { useRouter } from 'next/router'
import { Clear } from '@material-ui/icons'

export default function NewEntry() {

  const [taskInputValue, setTaskInputValue] = useState('')
  const [allIds, setAllIds] = useState([])
  const [stateValue, setStateValue] = useState(0);
  const [taskInvalid, setTaskInvalid] = useState(false);

  const router = useRouter();

  const handleGenerateReport = () => {
    let url = '/potres-2020-collection/';
    allIds.forEach((id, index) => {
      url += `${id}&`
    })
    url = url.slice(0, -1);
    router.push(url);
  }

  const addItem = () => {
    const parsed = parseInt(taskInputValue);
    if (isNaN(parsed)) {
      const splitted = taskInputValue.split('/');
      const lastElementParsed = parseInt(splitted[splitted.length - 1])
      if (!isNaN(lastElementParsed)) {
        checkAndPushItem(lastElementParsed);
      }
    } else {
      checkAndPushItem(parsed);
    }
  }

  const setTaskInputValueHandler = (value) => {
    setTaskInputValue(value);
    setTaskInvalid(false);
  }

  const checkAndPushItem = (id) => {
    fetchQuery('posts', `/${id}`)
      .then((res) => {
        const ids = allIds;
        ids.push(id);
        setTaskInputValueHandler('');    
      })
      .catch((err) => {
        setTaskInvalid(true);
      })
  }

  const removeItem = (index) => {
    const ids = allIds;
    ids.splice(index, 1);
    setStateValue(stateValue+1);
  }

  const addedTasks = allIds.map((id, index) => {
    return (
      <div className={styles.addedId}>
        <span>{id}</span>
        <button className={styles.removeButton} onClick={() => removeItem(index)}>
          <Clear />
        </button>
      </div>
    )
  })


  return (
    <div className={styles.container}>
      <Head>
        <title>Pomoć žrtvama potresa | Novi unos</title>
        <link rel="icon" href="/favicon.ico" />
        <script type="text/javascript" src="https://maps.googleapis.com/maps/api/js?key=AIzaSyBza8tAYUna_mtCXdstnhu50rJXJ7bi5yw&libraries=places"></script>
      </Head>
      <MainSiteLayout>
        <LayoutWithSideMap items = {[]} onMarkerClick = {(type, id) => console.log(type, id)}>
          <div className={styles.introSection}>
            <h1>Kreiraj novu kolekciju iz aplikacija Potres2020</h1>
            <p className={styles.noticeText}>Dodaj link na post (npr: 'https://potres2020.openit.hr/posts/448') na Potres2020 ili ID tog posta (npr '448'). Klikni 'Dodaj'. Dodaj sljedeći. Po završetku, klikni na "generiraj pogled". Odvesti će te na posebni URL sa samo tvojim odabranim postovima - taj URL možeš kopirati i shareati, uvijek će prikazivati samo te postove.</p>
          </div>
          <div className={styles.collectionGeneratorInputWrapper}>
            <TextField
              className={styles.inputField}
              label='Post ID ili URL'
              placeholder='458 ili https://potres2020.openit.hr/posts/458'
              helperText='Važno: pazi na format'
              onChange={(event) => setTaskInputValue(event.target.value)}
              value={taskInputValue}
              variant='outlined'
            />
            <button className={styles.addButton} onClick={() => addItem()}>Dodaj</button>
          </div>
          <span className={styles.taskValidation}>
            {taskInvalid && 'Task koji ste unijeli ne postoji u sustavu Potres2020. Molimo probajte drugi.'}
          </span>
          <h4>Dodani:</h4>
          <div className={styles.addedTasks}>
            {addedTasks}
          </div>
          <button className={styles.generateButton} onClick={() => handleGenerateReport()}>Generiraj pogled</button>
        </LayoutWithSideMap>
      </MainSiteLayout>
    </div>
  )
}