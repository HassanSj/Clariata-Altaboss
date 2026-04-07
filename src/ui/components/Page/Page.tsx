import React from 'react';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';

interface IProps {
  configuration: PageConfiguration;
}

export class Page extends React.Component<IProps, {}> {
  props: IProps;

  constructor(props: IProps) {
    super(props);
    this.props = props;
  }

  componentWillMount() {
    // TODO - perform page init
  }

  render() {
    return (
      <>
        <Card>
          <CardContent>
            <Typography color="textSecondary" gutterBottom>
              {this.props.configuration.name}
            </Typography>
          </CardContent>
        </Card>
      </>
    );
  }
}

export default Page;
