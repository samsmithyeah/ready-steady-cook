import { Button, Typography } from '@material-ui/core';
import ResultsList from './ResultsList.js'

export default function Results(props) {

  const { filters, searchTerm, filteredResults, handleRestartClick, classes } = props;

  function resultsHeading() {
    if (filteredResults.length === 0) {
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
    <div className={classes.root}>
      <Typography variant="h4" gutterBottom>{resultsHeading()} </Typography>
      {filteredResults.length > 0 && <Typography variant="subtitle2" gutterBottom>{filteredResults.length} results</Typography>}
      <ResultsList classes={classes} results={filteredResults} />
      <Button onClick={handleRestartClick}>Start again</Button>
    </div>
  )
}