import { Chip, Paper } from '@material-ui/core';
import { useSelector } from 'react-redux';

export default function FilterChips(props) {
  const { onDelete } = props;
  const filters = useSelector((state) => state.ingredients.filters);

  return (
    <div>
      <Paper id="filter-chips" elevation={0}>
        {filters.map((filter) => {
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
