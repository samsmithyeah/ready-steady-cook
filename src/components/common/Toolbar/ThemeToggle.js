import { Switch, FormControlLabel } from '@material-ui/core';

export default function ThemeToggle(props) {
  const { handleThemeChange, themeType } = props;

  return (
    <>
      <FormControlLabel
        control={
          <Switch
            checked={themeType === 'dark'}
            onChange={handleThemeChange}
            name="theme"
          />
        }
        label="Dark mode"
      />
    </>
  );
}
