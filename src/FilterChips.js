import { Chip, Paper } from '@material-ui/core';

export default function FilterChips(props) {
  const { filters, onDelete } = props;
  return (
    <div>
      <Paper elevation={0}>
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
