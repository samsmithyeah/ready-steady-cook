import { Link, List, ListItem } from '@material-ui/core';

export default function ResultsList(props) {
  const { results } = props;
  return (
    <div>
      <List>
        {results.map(result => {
          return (
            <ListItem key={result.recipe.url}>
              <Link key={result.recipe.url} href={result.recipe.url} target="_blank">{result.recipe.label}</Link>
            </ListItem>
          )
        })}
      </List>
    </div>
  )
}

