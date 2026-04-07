import {withStyles} from "@material-ui/core/styles";
import StepConnector from "@material-ui/core/StepConnector";

const StepIconConnectorVertical = withStyles({
  vertical: {
    marginLeft: 3,
  },
  alternativeLabel: {
    top: 10,
    left: 'calc(-50% + 16px)',
    right: 'calc(50% + 16px)',
    marginLeft: 0
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
    borderLeftWidth: 3,
    borderRadius: 1,
  },
  lineVertical: {
    minHeight: 10
  }
})(StepConnector);

export default StepIconConnectorVertical;
