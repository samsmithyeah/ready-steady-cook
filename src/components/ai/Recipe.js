import { Button } from '@material-ui/core';
import AutorenewIcon from '@material-ui/icons/Autorenew';
import { useSelector } from 'react-redux';

export default function Recipe(props) {
  const { handleRestartClick, classes } = props;

  const { recipe } = useSelector((state) => state.recipe);

  return (
    <div className={classes.root}>
      <div align="left" dangerouslySetInnerHTML={{ __html: recipe }} />
      <Button onClick={handleRestartClick} endIcon={<AutorenewIcon />}>
        Start again
      </Button>
    </div>
  );
}
