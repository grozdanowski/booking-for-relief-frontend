import Head from 'next/head'
import styles from './newEntry.module.scss'
import { useState } from 'react'
import { addEntry } from 'utils/utils'
import MainSiteLayout from 'layouts/mainSiteLayout'
import LayoutWithSideMap from 'layouts/layoutWithSideMap'
import LocationAutocompleteNewEntry from 'components/locationAutocompleteNewEntry'
import TextField from '@material-ui/core/TextField'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Checkbox from '@material-ui/core/Checkbox'
import FormControl from '@material-ui/core/FormControl'
import Select from '@material-ui/core/Select'
import InputLabel from '@material-ui/core/InputLabel'
import { useRouter } from 'next/router'
import { Clear } from '@material-ui/icons'

export default function NewEntry() {

  const [taskInputValue, setTaskInputValue] = useState('')
  const [allIds, setAllIds] = useState([])
  const [stateValue, setStateValue] = useState(0);

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
    const ids = allIds;
    const parsed = parseInt(taskInputValue);
    if (isNaN(parsed)) {
      const splitted = taskInputValue.split('/');
      const lastElementParsed = parseInt(splitted[splitted.length - 1])
      if (!isNaN(lastElementParsed)) {
        ids.push(lastElementParsed);
        setAllIds(ids);
        setTaskInputValue('');
      }
    } else {
      ids.push(parsed);
      setAllIds(ids);
      setTaskInputValue('');
    }
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