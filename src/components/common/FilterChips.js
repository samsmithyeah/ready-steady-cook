import { Chip, Paper } from '@material-ui/core';

export default function FilterChips(props) {
  const { onDelete, ingredients } = props;

  return (
    <div>
      <Paper id="filter-chips" elevation={0}>
        {ingredients.map((filter) => {
          return (
            <Chip
              key={filter}
              label={filter}
              onDelete={() => onDelete(filter)}
            />
          );
        })}
      </Paper>
    </div>
  );
}
