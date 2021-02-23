import { Button } from '@material-ui/core';
import ResultsList from './ResultsList.js'

export default function Results(props) {

  const { results, filters, searchTerm, filteredResults, handleRestartClick } = props;

  function resultsHeading() {
    if (results.length === 0 || filteredResults.length === 0 ) {
      return 'No results found 😢'
    }
    if (filters.length === 0) {
      return `With your ${searchTerm} you could make...`
    } else if (filters.length === 1) {
      return `With your ${searchTerm} and ${filters} you could make...`
    } else {
      return `With your ${searchTerm}, ${filters.slice(0, -1).join(", ")} and ${filters.slice(-1)} you could make...`
    }
  }

  return (
    <>
      <h1>{resultsHeading()} </h1>
      {filters.length === 0 ? <ResultsList results={results} /> : <ResultsList results={filteredResults} />}
      <br />
      <Button onClick={handleRestartClick}>Start again</Button>
    </>
  )
}