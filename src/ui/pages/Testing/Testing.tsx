import React from 'react';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import {Grid, List, ListItem, ListItemText} from '@material-ui/core';
import {AxiosResponse} from "axios";
import api from "~/services/api";
import {logSimple} from "~/ui/constants/utils";
import JSONPretty from 'react-json-pretty';
import InputField from "~/ui/components/Forms/InputField";
import FormWrapper from "~/ui/components/Forms/FormWrapper";
import {EducationItem} from "~/types/api/educationItem";
import {IFormActionProps} from "~/types/forms";
import {object} from "yup";
import {required} from "~/ui/configs/formik/validators";
import SelectDate from "~/ui/components/Forms/SelectDate";
import { getSessionGUID } from '~/services/auth';

type IProps = {
  response: any;
}

interface IInitialValues {
  Date: string;
  DateTime: string;
  Time: string;
  Month: string;
  Year: string;
  MonthYear: string;
}

const initialValues: IInitialValues = {
  Date: '',
  DateTime: '',
  Time: '',
  Month: '',
  Year: '',
  MonthYear: ''
};

const validate = object().shape({
  Date: required
});

export class Testing extends React.Component<{}, IProps> {

  processResponse(type: string, res: AxiosResponse){
    logSimple(type, res);
    if (!res.data){
      this.resetState();
      return;
    }
    const result: [] = [];
    // @ts-ignore
    result.push(res.data);
    this.setState({
      response: result
    });
  }
  resetState(){
    this.setState({
      response: null
    });
  }
  async getSession(){
    const sessionGUID = getSessionGUID()
    const res: AxiosResponse = await api.session.get(sessionGUID);
    this.processResponse('getSession', res);
  };
  async getUser(){
    const res: AxiosResponse = await api.user.get();
    this.processResponse('getUser', res);
  };
  async getUserSettings(){
    const res: AxiosResponse = await api.user.listSettings();
    this.processResponse('getUserSettings', res);
  };
  async getHouseholds(){
    const res: AxiosResponse = await api.household.list();
    this.processResponse('getHouseholds', res);
  };
  async getEvaluations(){
    const res: AxiosResponse = await api.evaluation.list();
    this.processResponse('getEvaluations', res);
  };

  async createOrUpdate (values: EducationItem, { setErrors }: IFormActionProps) {

  }

  render() {
    return (
      <>

        <Card>
          <CardContent>
            <FormWrapper initialValues={initialValues}
                         validationSchema={validate}
                         onSubmit={this.createOrUpdate}>
            <Grid container spacing={1}>
              <Grid item xs={6}>
                <InputField type="date"
                            placeholder="date"
                            label="date"
                            name="Date"
                            component={SelectDate}
                            required={true} />
              </Grid>
              <Grid item xs={6}>
                <InputField type="datetime"
                            placeholder="datetime"
                            label="datetime"
                            name="DateTime"
                            component={SelectDate}
                            required={true} />
              </Grid>
            </Grid>
              <Grid container spacing={1}>
                <Grid item xs={6}>
                  <InputField type="month"
                              placeholder="month"
                              label="month"
                              name="Month"
                              component={SelectDate}
                              required={true}/>
                </Grid>
                <Grid item xs={6}>
                  <InputField type="year"
                              placeholder="year"
                              label="year"
                              name="Year"
                              component={SelectDate}
                              required={true}/>
                </Grid>
              </Grid>
              <Grid container spacing={1}>
                <Grid item xs={6}>
                  <InputField type="time"
                              placeholder="time"
                              label="time"
                              name="Time"
                              component={SelectDate}
                              required={true}/>
                </Grid>
                <Grid item xs={6}>
                  <InputField type="month_year"
                              placeholder="month_year"
                              label="month_year"
                              name="MonthYear"
                              component={SelectDate}
                              required={true}/>
                </Grid>
              </Grid>
            </FormWrapper>
          </CardContent>
        </Card>
        <br /><br />
        <Card>
          <CardContent>
            <Grid container spacing={1}>
              <Grid item xs={6}>
                <Typography variant="h6" gutterBottom>
                  List Endpoints
                </Typography>
                <List component="nav" aria-label="main mailbox folders">
                  <ListItem button onClick={() => this.getUser()}>
                    <ListItemText primary="Get user" />
                  </ListItem>
                  <ListItem button onClick={() => this.getUserSettings()}>
                    <ListItemText primary="Get user settings" />
                  </ListItem>
                  <ListItem button onClick={() => this.getSession()}>
                    <ListItemText primary="Get session" />
                  </ListItem>
                  <ListItem button onClick={() => this.getHouseholds()}>
                    <ListItemText primary="Get households" />
                  </ListItem>
                  <ListItem button onClick={() => this.getEvaluations()}>
                    <ListItemText primary="Get evaluations" />
                  </ListItem>

                </List>
              </Grid>
            </Grid>

          </CardContent>
        </Card>
        <br /><br />
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Response
            </Typography>
            <code>
              <JSONPretty id="json-pretty" data={this.state?.response}></JSONPretty>
            </code>

          </CardContent>
        </Card>
      </>
    );
  }
};

export default Testing;
