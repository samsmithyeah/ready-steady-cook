import { Stepper, Step, StepLabel } from '@material-ui/core';

export default function Progress(props) {
  const { activeStep, steps } = props;

  return (
    <>
      <Stepper activeStep={activeStep} alternativeLabel>
        {steps.map((step) => {
          return (
            <Step key={step}>
              <StepLabel>{step}</StepLabel>
            </Step>
          );
        })}
      </Stepper>
    </>
  );
}
