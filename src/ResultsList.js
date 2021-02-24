import { Container, Link, List, ListItem, ListItemAvatar, Avatar, ListItemText } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';


const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    maxWidth: 360
  },
}));

export default function ResultsList(props) {
  const classes = useStyles();
  const { results } = props;
  return (
    <Container className={classes.root}>
      <List className={classes.root}>
        {results.map(result => {
          return (
            <ListItem key={result.recipe.url}>
                <ListItemAvatar>
                  <Avatar alt={result.recipe.label} src={result.recipe.image} className={classes.large}/>
              </ListItemAvatar>
              <Link href={result.recipe.url} target="_blank" rel="noreferrer">
                <ListItemText primary={result.recipe.label} secondary={result.recipe.source} />
              </Link>
            </ListItem>
          )
        })}
        </List>
      </Container>
  )
}

