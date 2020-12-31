import PlacesAutocomplete from 'react-places-autocomplete'
import { Search } from '@material-ui/icons'
import styles from './locationAutocomplete.module.scss'

export default function LocationAutocomplete({ locationValue, setLocationFunction }) {

  return (
    <PlacesAutocomplete
      value={locationValue}
      onChange={setLocationFunction}
      onSelect={setLocationFunction}
    >
      {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
        <div className={styles.wrapper}>
          <input
            {...getInputProps({
              placeholder: 'Pretraži po mjestu...',
              className: styles.searchInput,
            })}
          />
          <Search className={styles.icon} />
          <div className={styles.autocompleteDropdownContainer}>
            {loading && <div>Loading...</div>}
            {suggestions.map((suggestion, index) => {
              const className = suggestion.active
                ? styles.suggestionActive
                : styles.suggestion;
              return (
                <div
                  key={`filter-suggestion-${index}`}
                  {...getSuggestionItemProps(suggestion, {
                    className
                  })}
                >
                  <span>{suggestion.description}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </PlacesAutocomplete>
  )
}