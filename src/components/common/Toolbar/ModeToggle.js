import { Switch, FormControlLabel } from '@material-ui/core';

export default function ModeToggle(props) {
  const { handleModeChange, mode } = props;

  return (
    <>
      <FormControlLabel
        control={
          <Switch
            checked={mode === 'ai'}
            onChange={handleModeChange}
            name="mode"
          />
        }
        label="AI mode"
      />
    </>
  );
}
