import { Button, Typography } from '@material-ui/core';
import ResultsList from './ResultsList.js';
import TypingTitle from '../common/TypingTitle.js';
import AutorenewIcon from '@material-ui/icons/Autorenew';
import { useSelector } from 'react-redux';

export default function Results(props) {
  const { handleRestartClick, classes } = props;

  const { filteredResults } = useSelector((state) => state.results);
  const { filters, searchTerm } = useSelector((state) => state.ingredients);

  function resultsHeading() {
    if (filteredResults.length === 0) {
      return 'No results found 😢';
    }
    if (filters.length === 0) {
      return `With your ${searchTerm.toLowerCase()} you could make...`;
    } else if (filters.length === 1) {
      return `With your ${searchTerm.toLowerCase()} and ${filters} you could make...`;
    } else {
      return `With your ${searchTerm.toLowerCase()}, ${filters
        .slice(0, -1)
        .join(', ')} and ${filters.slice(-1)} you could make...`;
    }
  }

  return (
    <div className={classes.root}>
      <TypingTitle text={resultsHeading()} />
      {filteredResults.length > 0 && (
        <Typography variant="subtitle2" gutterBottom>
          {filteredResults.length} results
        </Typography>
      )}
      <ResultsList classes={classes} results={filteredResults} />
      <Button onClick={handleRestartClick} endIcon={<AutorenewIcon />}>
        Start again
      </Button>
    </div>
  );
}
