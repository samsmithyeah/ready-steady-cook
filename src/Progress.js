import { Stepper, Step, StepLabel } from '@material-ui/core';

export default function Progress(props) {

  const { activeStep } = props;

  const steps = ['Primary ingredient', 'Other ingredients', 'Results']

  return (
    <>
      <Stepper activeStep={activeStep} alternativeLabel>
        {steps.map(step => {
          return (
            <Step key={step}>
              <StepLabel>{step}</StepLabel>
            </Step>
          );
        })}
      </Stepper>
    </>
  )
}