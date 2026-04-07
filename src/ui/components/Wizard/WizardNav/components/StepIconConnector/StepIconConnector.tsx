import {withStyles} from "@material-ui/core/styles";
import StepConnector from "@material-ui/core/StepConnector";

const StepIconConnector = withStyles({
  alternativeLabel: {
    top: 10,
    left: 'calc(-50% + 16px)',
    right: 'calc(50% + 16px)',
  },
  active: {
    '& $line': {
      borderColor: '#78c1c7',
    },
  },
  completed: {
    '& $line': {
      borderColor: '#78c1c7',
    },
  },
  line: {
    borderColor: '#eaeaf0',
    borderTopWidth: 0,
    borderRadius: 1,
  },
})(StepConnector);

export default StepIconConnector;
