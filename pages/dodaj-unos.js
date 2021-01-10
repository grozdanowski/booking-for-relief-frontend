import Head from 'next/head'
import styles from './newEntry.module.scss'
import { useState } from 'react'
import { addEntry, fetchQuery } from 'utils/utils'
import MainSiteLayout from 'layouts/mainSiteLayout'
import LayoutWithSideMap from 'layouts/layoutWithSideMap'
import LocationAutocompleteNewEntry from 'components/locationAutocompleteNewEntry'
import TextField from '@material-ui/core/TextField'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Checkbox from '@material-ui/core/Checkbox'
import FormControl from '@material-ui/core/FormControl'
import Select from '@material-ui/core/Select'
import InputLabel from '@material-ui/core/InputLabel'
import { geocodeByAddress, getLatLng } from 'react-places-autocomplete';
import { useRouter } from 'next/router'
import Autocomplete from '@material-ui/lab/Autocomplete'
import Chip from '@material-ui/core/Chip';

export default function NewEntry({ itemTags }) {

  const [type, setType] = useState(null);
  const [locationInputValue, setLocationInputValue] = useState('')
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [contactName, setContactName] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [submitterEmail, setSubmitterEmail] = useState('');
  const [availableOnWhatsapp, setAvailableOnWhatsapp] = useState(false);
  const [locationLat, setLocationLat] = useState(null);
  const [locationLon, setLocationLon] = useState(null);
  const [aidDestination, setAidDestinatoin] = useState(null);
  const [startdate, setStartdate] = useState();
  const [enddate, setEnddate] = useState();
  const [vehicleType, setVehicleType] = useState(null);
  const [vehicleModel, setVehicleModel] = useState(null);
  const [numberOfChildren, setNumberOfChildren] = useState(null);
  const [numberOfAdults, setNumberOfAdults] = useState(null);
  const [petsAllowed, setPetsAllowed] = useState(null);
  const [newItemTags, setNewItemTags] = useState([]);
  const [mapItems, setMapItems] = useState([]);
  const [submittingMessage, setSubmittingMessage] = useState('');
  const [validationError, setValidationError] = useState(null);

  const tagChoices = itemTags.map((tag) => {return tag.tag});

  const router = useRouter();

  const handleSetLocation = (location) => {
    setLocationInputValue(location);
    setLocation(location);
    geocodeByAddress(location)
      .then(results => getLatLng(results[0]))
      .then(latLng => {
        setLocationLat(latLng.lat);
        setLocationLon(latLng.lng);
        setMapItems([{
          locationLat: latLng.lat,
          locationLon: latLng.lng,
          id: 0,
          type: type,
        }])
      })
      .catch(error => console.error('Error during geolocation :(', error));
  }

  const renderForm = () => {
    switch (type) {
      case 'aidRequest':
        return aidRequestContent;
      case 'aidCollection':
        return aidCollectionContent;
      case 'transport':
        return transportContent;
      case 'accommodation':
        return accommodationContent;
      case 'submitting':
        return submittingContent;
      default:
        break;
    }
  }

  const handleSubmit = () => {
    const requiredFieldsFilled = location && description && contactName && contactPhone && newItemTags.length;

    if (requiredFieldsFilled) {
      setValidationError(null);
      let endpoint;
      let data;
      switch (type) {
        case 'accommodation':
          endpoint = 'accommodations';
          data = {
            'startdate': new Date(startdate).toISOString(),
            'enddate': new Date(enddate).toISOString(),
            'location': location,
            'description': description,
            'contact_name': contactName,
            'contact_phone': contactPhone,
            'submitter_email': submitterEmail,
            'available_on_whatsapp': availableOnWhatsapp,
            'locationLat': locationLat,
            'locationLon': locationLon,
            'number_of_adults': numberOfAdults,
            'number_of_children': numberOfChildren,
            'pets_allowed': petsAllowed,
            'tags': newItemTags.join(', '),
          }
          break;
        case 'transport':
          endpoint = 'transports';
          data = {
            'startdate': new Date(startdate).toISOString(),
            'enddate': new Date(enddate).toISOString(),
            'location': location,
            'description': description,
            'contact_name': contactName,
            'contact_phone': contactPhone,
            'submitter_email': submitterEmail,
            'available_on_whatsapp': availableOnWhatsapp,
            'locationLat': locationLat,
            'locationLon': locationLon,
            'vehicle_type': vehicleType,
            'vehicle_model': vehicleModel,
            'tags': newItemTags.join(', '),
          }
          break;
        case 'aidCollection':
          endpoint = 'aid-collections';
          data = {
            'startdate': new Date(startdate).toISOString(),
            'enddate': new Date(enddate).toISOString(),
            'location': location,
            'description': description,
            'contact_name': contactName,
            'contact_phone': contactPhone,
            'submitter_email': submitterEmail,
            'available_on_whatsapp': availableOnWhatsapp,
            'locationLat': locationLat,
            'locationLon': locationLon,
            'aid_destination': aidDestination,
            'tags': newItemTags.join(', '),
          }
          break;
        case 'aidRequest':
          endpoint = 'aid-requests';
          data = {
            'location': location,
            'description': description,
            'contact_name': contactName,
            'contact_phone': contactPhone,
            'submitter_email': submitterEmail,
            'available_on_whatsapp': availableOnWhatsapp,
            'locationLat': locationLat,
            'locationLon': locationLon,
            'tags': newItemTags.join(', '),
          }
          break;
        default:
          break;
      }
      setType('submitting');
      setSubmittingMessage('Dodajemo tvoj unos...');
      addEntry(endpoint, data)
        .then(() => {
          router.push('/')
        })
        .catch((error) => {
          console.error('Error publishing an entry :(', error)
          setSubmittingMessage('Problem pri dodavanju tvoj unosa. Molimo te da se obratiš administratorima.');
        });           
    } else {
      setValidationError('Molimo unesite sva obavezna polja (označena zvjezdicom *).')
    }
  }

  const submittingContent = (
    <div className={styles.submittingMessage}>
      {submittingMessage}
    </div>
  )

  const aidRequestContent = (
    <div className={styles.newEntryForm}>
      <div className={styles.inputWrapperLocation}>
        <div className={styles.locationLabelWrapper}>
          <label className={styles.locationLabel}>Lokacija<span className={styles.requiredMarker}>*</span></label>
          <span className={styles.locationInstructions}>OBAVEZNO: Pretražite lokacije i odaberite željenu.</span>
        </div>
        <LocationAutocompleteNewEntry value={locationInputValue} setValue={setLocationInputValue} setLocationFunction={handleSetLocation} />
      </div>
      <div className={styles.inputWrapperHalf}>
        <TextField
          className={styles.inputField}
          label='Ime kontakt osobe'
          placeholder='Ime osobe'
          helperText='OBAVEZNO: ime kontakt osobe'
          onChange={(event) => setContactName(event.target.value)}
          value={contactName}
          variant='outlined'
          required
        />
      </div>
      <div className={styles.inputWrapperHalf}>
        <TextField
          className={styles.inputField}
          label='Kontakt mail adresa'
          placeholder='moj@email.hr'
          helperText='Vaša mail adresa.'
          onChange={(event) => setSubmitterEmail(event.target.value)}
          value={submitterEmail}
          variant='outlined'
          type='email'
        />
      </div>
      <div className={styles.inputWrapperHalf}>
        <TextField
          className={styles.inputField}
          label='Broj telefona kontakt osobe'
          placeholder='Broj telefona'
          helperText='OBAVEZNO: broj telefona kontakt osobe u formatu +385000...'
          onChange={(event) => setContactPhone(event.target.value)}
          value={contactPhone}
          variant='outlined'
          type='tel'
          required
        />
      </div>
      <div className={styles.inputWrapperHalf}>
      <FormControlLabel
        control={<Checkbox checked={availableOnWhatsapp} onChange={(event) => setAvailableOnWhatsapp(event.target.checked)} name="checkedG" />}
        label="Dostupan/na sam na WhatsApp"
      />
      </div>
      <div className={styles.inputWrapperFull}>
        <TextField
          className={styles.inputField}
          label='Opis Vaše potrebe'
          placeholder='Opis...'
          helperText='OBAVEZNO: Opišite što Vam je potrebno (radna snaga, materijali, hrana, ...)'
          onChange={(event) => setDescription(event.target.value)}
          value={description}
          variant='outlined'
          multiline
          rows={7}
          required
        />
      </div>
      <div className={styles.inputWrapperFull}>
        <Autocomplete
          className={styles.inputField}
          variant='outlined'
          multiple
          options={tagChoices}
          getOptionLabel={(tag) => tag}
          style={{ width: '100%' }}
          renderInput={(params) => <TextField {...params} helperText='MOLIMO: unesite bar jednu oznaku (tag) kako bi nam pomogli klasificirati vaš unos.' label="Dodaj oznake (tagove)" variant="outlined" />}
          onChange={(event, newValue) => {
            setNewItemTags(newValue);
          }}
          freeSolo={true}
          required
        />
      </div>
      <div className={styles.inputWrapperFull}>
        <button className={styles.submitButton} onClick={() => handleSubmit()}>Dodaj</button>
      </div>
    </div>
  )

  const aidCollectionContent = (
    <div className={styles.newEntryForm}>
      <div className={styles.inputWrapperLocation}>
        <div className={styles.locationLabelWrapper}>
          <label className={styles.locationLabel}>Lokacija<span className={styles.requiredMarker}>*</span></label>
          <span className={styles.locationInstructions}>OBAVEZNO: Pretražite lokacije i odaberite željenu.</span>
        </div>
        <LocationAutocompleteNewEntry value={locationInputValue} setValue={setLocationInputValue} setLocationFunction={handleSetLocation} />
      </div>
      <div className={styles.inputWrapperHalf}>
        <TextField
          className={styles.inputField}
          label='Ime kontakt osobe / udruge'
          placeholder='Ime osobe / udruge'
          helperText='OBAVEZNO: ime kontakt osobe/udruge'
          onChange={(event) => setContactName(event.target.value)}
          value={contactName}
          variant='outlined'
          required
        />
      </div>
      <div className={styles.inputWrapperHalf}>
        <TextField
          className={styles.inputField}
          label='Kontakt mail adresa'
          placeholder='moj@email.hr'
          helperText='Vaša mail adresa.'
          onChange={(event) => setSubmitterEmail(event.target.value)}
          value={submitterEmail}
          variant='outlined'
          type='email'
        />
      </div>
      <div className={styles.inputWrapperHalf}>
        <TextField
          className={styles.inputField}
          label='Broj telefona kontakt osobe'
          placeholder='Broj telefona'
          helperText='OBAVEZNO: broj telefona kontakt osobe u formatu +385000...'
          onChange={(event) => setContactPhone(event.target.value)}
          value={contactPhone}
          variant='outlined'
          type='tel'
          required
        />
      </div>
      <div className={styles.inputWrapperHalf}>
      <FormControlLabel
        control={<Checkbox checked={availableOnWhatsapp} onChange={(event) => setAvailableOnWhatsapp(event.target.checked)} name="checkedG" />}
        label="Dostupan/na sam na WhatsApp"
      />
      </div>
      <div className={styles.inputWrapperHalf}>
        <TextField
          className={styles.inputField}
          label='Odredište donacija'
          placeholder='Petrinja'
          helperText='Odredište donacija'
          onChange={(event) => setAidDestinatoin(event.target.value)}
          value={aidDestination}
          variant='outlined'
          required
        />
      </div>
      <div className={styles.inputWrapperFull}>
        <TextField
          className={styles.inputField}
          label='Opis prikupa'
          placeholder='Opis...'
          helperText='OBAVEZNO: Opišite što se skuplja, koje su namirnice najbitnije, kratke upute za pakiranje...'
          onChange={(event) => setDescription(event.target.value)}
          value={description}
          variant='outlined'
          multiline
          rows={7}
          required
        />
      </div>
      <div className={styles.inputWrapperFull}>
        <Autocomplete
          className={styles.inputField}
          variant='outlined'
          multiple
          options={tagChoices}
          getOptionLabel={(tag) => tag}
          style={{ width: '100%' }}
          renderInput={(params) => <TextField {...params} helperText='MOLIMO: unesite bar jednu oznaku (tag) kako bi nam pomogli klasificirati vaš unos.' label="Dodaj oznake (tagove)" variant="outlined" />}
          onChange={(event, newValue) => {
            setNewItemTags(newValue);
          }}
          freeSolo={true}
          required
        />
      </div>
      <div className={styles.inputWrapperHalf}>
        <TextField
          className={styles.inputField}
          label='Prikup od:'
          placeholder=''
          helperText='Od kad se donacije skupljaju'
          onChange={(event) => setStartdate(event.target.value)}
          value={startdate}
          variant='outlined'
          type='datetime-local'
          required
        />
      </div>
      <div className={styles.inputWrapperHalf}>
        <TextField
          className={styles.inputField}
          label='Prikup do:'
          placeholder=''
          helperText='Krajnji rok do kad se donacije skupljaju'
          onChange={(event) => setEnddate(event.target.value)}
          value={enddate}
          variant='outlined'
          type='datetime-local'
          required
        />
      </div>
      <div className={styles.inputWrapperFull}>
        <button className={styles.submitButton} onClick={() => handleSubmit()}>Dodaj</button>
      </div>
    </div>
  )

  const accommodationContent = (
    <div className={styles.newEntryForm}>
      <div className={styles.inputWrapperLocation}>
        <div className={styles.locationLabelWrapper}>
          <label className={styles.locationLabel}>Lokacija<span className={styles.requiredMarker}>*</span></label>
          <span className={styles.locationInstructions}>OBAVEZNO: Pretražite lokacije i odaberite željenu.</span>
        </div>
        <LocationAutocompleteNewEntry value={locationInputValue} setValue={setLocationInputValue} setLocationFunction={handleSetLocation} />
      </div>
      <div className={styles.inputWrapperHalf}>
        <TextField
          className={styles.inputField}
          label='Ime kontakt osobe / udruge'
          placeholder='Ime osobe / udruge'
          helperText='OBAVEZNO: ime kontakt osobe/udruge'
          onChange={(event) => setContactName(event.target.value)}
          value={contactName}
          variant='outlined'
          required
        />
      </div>
      <div className={styles.inputWrapperHalf}>
        <TextField
          className={styles.inputField}
          label='Kontakt mail adresa'
          placeholder='moj@email.hr'
          helperText='Vaša mail adresa'
          onChange={(event) => setSubmitterEmail(event.target.value)}
          value={submitterEmail}
          variant='outlined'
          type='email'
        />
      </div>
      <div className={styles.inputWrapperHalf}>
        <TextField
          className={styles.inputField}
          label='Broj telefona kontakt osobe'
          placeholder='Broj telefona'
          helperText='OBAVEZNO: broj telefona kontakt osobe u formatu +385000...'
          onChange={(event) => setContactPhone(event.target.value)}
          value={contactPhone}
          variant='outlined'
          type='tel'
          required
        />
      </div>
      <div className={styles.inputWrapperHalf}>
        <FormControlLabel
          control={<Checkbox checked={availableOnWhatsapp} onChange={(event) => setAvailableOnWhatsapp(event.target.checked)} name="checkedG" />}
          label="Dostupan/na sam na WhatsApp"
        />
      </div>
      <div className={styles.inputWrapperHalf}>
        <TextField
          className={styles.inputField}
          label='Broj odraslih osoba'
          placeholder=''
          helperText='Broj odraslih osoba koje možete smjestiti'
          onChange={(event) => setNumberOfAdults(event.target.value)}
          value={numberOfAdults}
          variant='outlined'
          type='number'
        />
      </div>
      <div className={styles.inputWrapperHalf}>
        <TextField
          className={styles.inputField}
          label='Broj djece'
          placeholder=''
          helperText='Broj djece koje možete smjestiti'
          onChange={(event) => setNumberOfChildren(event.target.value)}
          value={numberOfChildren}
          variant='outlined'
          type='number'
        />
      </div>
      <div className={styles.inputWrapperHalf}>
        <FormControlLabel
          control={<Checkbox checked={petsAllowed} onChange={(event) => setPetsAllowed(event.target.checked)} name="checkedG" />}
          label="Dozvoljeni kućni ljubimci"
        />
      </div>
      <div className={styles.inputWrapperFull}>
        <TextField
          className={styles.inputField}
          label='Opis Vaše ponude'
          placeholder='Opis...'
          helperText='OBAVEZNO: Opišite što nudite'
          onChange={(event) => setDescription(event.target.value)}
          value={description}
          variant='outlined'
          multiline
          rows={7}
          required
        />
      </div>
      <div className={styles.inputWrapperFull}>
        <Autocomplete
          className={styles.inputField}
          variant='outlined'
          multiple
          options={tagChoices}
          getOptionLabel={(tag) => tag}
          style={{ width: '100%' }}
          renderInput={(params) => <TextField {...params} helperText='MOLIMO: unesite bar jednu oznaku (tag) kako bi nam pomogli klasificirati vaš unos.' label="Dodaj oznake (tagove)" variant="outlined" />}
          onChange={(event, newValue) => {
            setNewItemTags(newValue);
          }}
          freeSolo={true}
          required
        />
      </div>
      <div className={styles.inputWrapperHalf}>
        <TextField
          className={styles.inputField}
          helperText='Od kad je smještaj dostupan'
          onChange={(event) => setStartdate(event.target.value)}
          value={startdate}
          variant='outlined'
          type='datetime-local'
        />
      </div>
      <div className={styles.inputWrapperHalf}>
        <TextField
          className={styles.inputField}
          helperText='Do kad je smještaj dostupan'
          onChange={(event) => setEnddate(event.target.value)}
          value={enddate}
          variant='outlined'
          type='datetime-local'
        />
      </div>
      <div className={styles.inputWrapperFull}>
        <button className={styles.submitButton} onClick={() => handleSubmit()}>Dodaj</button>
      </div>
    </div>
  )

  const transportContent = (
    <div className={styles.newEntryForm}>
      <div className={styles.inputWrapperLocation}>
        <div className={styles.locationLabelWrapper}>
          <label className={styles.locationLabel}>Lokacija<span className={styles.requiredMarker}>*</span></label>
          <span className={styles.locationInstructions}>OBAVEZNO: Pretražite lokacije i odaberite željenu.</span>
        </div>
        <LocationAutocompleteNewEntry value={locationInputValue} setValue={setLocationInputValue} setLocationFunction={handleSetLocation} />
      </div>
      <div className={styles.inputWrapperHalf}>
        <TextField
          className={styles.inputField}
          label='Ime kontakt osobe / udruge / tvrtke'
          placeholder='Ime osobe / udruge / tvrtke'
          helperText='OBAVEZNO: ime kontakt osobe/udruge/tvrtke'
          onChange={(event) => setContactName(event.target.value)}
          value={contactName}
          variant='outlined'
          required
        />
      </div>
      <div className={styles.inputWrapperHalf}>
        <TextField
          className={styles.inputField}
          label='Kontakt mail adresa'
          placeholder='moj@email.hr'
          helperText='Vaša mail adresa'
          onChange={(event) => setSubmitterEmail(event.target.value)}
          value={submitterEmail}
          variant='outlined'
          type='email'
        />
      </div>
      <div className={styles.inputWrapperHalf}>
        <TextField
          className={styles.inputField}
          label='Broj telefona kontakt osobe'
          placeholder='Broj telefona'
          helperText='OBAVEZNO: broj telefona kontakt osobe u formatu +385000...'
          onChange={(event) => setContactPhone(event.target.value)}
          value={contactPhone}
          variant='outlined'
          type='tel'
          required
        />
      </div>
      <div className={styles.inputWrapperHalf}>
        <FormControlLabel
          control={<Checkbox checked={availableOnWhatsapp} onChange={(event) => setAvailableOnWhatsapp(event.target.checked)} name="checkedG" />}
          label="Dostupan/na sam na WhatsApp"
        />
      </div>
      <div className={styles.inputWrapperHalf}>
        <FormControl className={styles.inputField} variant="outlined">
          <InputLabel htmlFor='select-vehicle-type'>Tip vozila</InputLabel>
          <Select
            native
            className={styles.inputField}
            value={vehicleType}
            onChange={(event) => setVehicleType(event.target.value)}
            label='Tip vozila'
            inputProps={{
              name: 'vehicle-type',
              id: 'select-vehicle-type'
            }}
          >
            <option aria-label="None" value="" />
            <option value={'car'}>Automobil</option>
            <option value={'van'}>Kombi</option>
            <option value={'truck'}>Kamion</option>
          </Select>
        </FormControl>
      </div>
      <div className={styles.inputWrapperHalf}>
        <TextField
          className={styles.inputField}
          label='Model vozila'
          placeholder='Model vozila'
          helperText='Opcionalno'
          onChange={(event) => setVehicleModel(event.target.value)}
          value={vehicleModel}
          variant='outlined'
        />
      </div>
      <div className={styles.inputWrapperFull}>
        <TextField
          className={styles.inputField}
          label='Opis Vaše ponude'
          placeholder='Opis...'
          helperText='OBAVEZNO: Opišite što nudite'
          onChange={(event) => setDescription(event.target.value)}
          value={description}
          variant='outlined'
          multiline
          rows={7}
          required
        />
      </div>
      <div className={styles.inputWrapperFull}>
        <Autocomplete
          className={styles.inputField}
          variant='outlined'
          multiple
          options={tagChoices}
          getOptionLabel={(tag) => tag}
          style={{ width: '100%' }}
          renderInput={(params) => <TextField {...params} helperText='MOLIMO: unesite bar jednu oznaku (tag) kako bi nam pomogli klasificirati vaš unos.' label="Dodaj oznake (tagove)" variant="outlined" />}
          onChange={(event, newValue) => {
            setNewItemTags(newValue);
          }}
          freeSolo={true}
          required
        />
      </div>
      <div className={styles.inputWrapperHalf}>
        <TextField
          className={styles.inputField}
          helperText='Od kad je prijevoz dostupan'
          onChange={(event) => setStartdate(event.target.value)}
          value={startdate}
          variant='outlined'
          type='datetime-local'
        />
      </div>
      <div className={styles.inputWrapperHalf}>
        <TextField
          className={styles.inputField}
          helperText='Do kad je prijevoz dostupan'
          onChange={(event) => setEnddate(event.target.value)}
          value={enddate}
          variant='outlined'
          type='datetime-local'
        />
      </div>
      <div className={styles.inputWrapperFull}>
        <button className={styles.submitButton} onClick={() => handleSubmit()}>Dodaj</button>
      </div>
    </div>
  )

  return (
    <div className={styles.container}>
      <Head>
        <title>Pomoć žrtvama potresa | Novi unos</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <MainSiteLayout itemTags = {itemTags}>
        <LayoutWithSideMap items = {[]} onMarkerClick = {(type, id) => console.log(type, id)}>
          <div className={styles.introSection}>
            <h1>Dodaj novi unos</h1>
            <p className={styles.noticeText}>Napomena: Molimo da unose koje ste kreirali, a u međuvremenu su ispunjeni, označite kao "<strong>Ispunjeno</strong>" kako bi zadržali preglednost sustava. Hvala.</p>
          </div>
          {type ? (
            <div>
              {validationError ? (
                <div className={styles.validationErrorMessage}>
                  {validationError}
                </div>
              ) : ''}
              {renderForm()}
              {validationError ? (
                <div className={styles.validationErrorMessage}>
                  {validationError}
                </div>
              ) : ''}
            </div>
          ) : (
            <div className={styles.typeChoiceWrapper}>
              <h2>Odaberi tip unosa:</h2>
              <div className={styles.typeChoiceButtonsWrapper}>
                <button
                  className={styles.typeChoiceButton}
                  onClick={() => setType('aidRequest')}
                >
                  <img src='icons/comment-alt-exclamation.svg' alt='Tražim pomoć!' />
                  <span className={styles.buttonLabel}>
                    Tražim pomoć!
                  </span>
                </button>
                <button
                  className={styles.typeChoiceButton}
                  onClick={() => setType('aidCollection')}
                >
                  <img src='icons/shopping-bag.svg' alt='Lokacija za prikupljanje pomoći' />
                  <span className={styles.buttonLabel}>
                    Lokacija za prikupljanje pomoći
                  </span>
                </button>
                <button
                  className={styles.typeChoiceButton}
                  onClick={() => setType('accommodation')}
                >
                  <img src='icons/home-heart.svg' alt='Nudim smještaj' />
                  <span className={styles.buttonLabel}>
                    Nudim smještaj
                  </span>
                </button>
                <button
                  className={styles.typeChoiceButton}
                  onClick={() => setType('transport')}
                >
                  <img src='icons/car-side.svg' alt='Nudim prijevoz' />
                  <span className={styles.buttonLabel}>
                    Nudim prijevoz
                  </span>
                </button>
              </div>
            </div>
          )}
        </LayoutWithSideMap>
      </MainSiteLayout>
    </div>
  )
}

export async function getServerSideProps() {
  const itemTags = await fetchQuery('item-tags', `?_sort=tag&_limit=-1`);
  return {
    props: {
      itemTags,
    }
  }
}