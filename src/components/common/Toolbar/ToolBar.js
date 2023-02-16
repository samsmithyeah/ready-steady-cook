import { Grid } from '@material-ui/core';
import ThemeToggle from './ThemeToggle';
import ModeToggle from './ModeToggle';

export default function ToolBar(props) {
  const { handleModeChange, mode, handleThemeChange, themeType } = props;

  return (
    <>
      <Grid justifyContent="space-between" container>
        <ModeToggle handleModeChange={handleModeChange} mode={mode} />
        <ThemeToggle
          handleThemeChange={handleThemeChange}
          themeType={themeType}
        />
      </Grid>
    </>
  );
}
