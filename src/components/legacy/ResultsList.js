import {
  Container,
  Link,
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
  },
}));

export default function ResultsList(props) {
  const classes = useStyles();
  const { results } = props;
  return (
    <Container className={classes.root}>
      <List>
        {results.map((result) => {
          return (
            <Link
              href={result.recipe.url}
              key={result.recipe.url}
              target="_blank"
              rel="noreferrer"
            >
              <ListItem>
                <ListItemAvatar>
                  <Avatar
                    alt={result.recipe.label}
                    src={result.recipe.image}
                    className={classes.large}
                  />
                </ListItemAvatar>
                <ListItemText
                  primary={result.recipe.label}
                  secondary={result.recipe.source}
                />
              </ListItem>
            </Link>
          );
        })}
      </List>
    </Container>
  );
}
