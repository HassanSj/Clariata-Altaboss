import {thunk, Thunk} from 'easy-peasy';
import {AxiosResponse} from 'axios';

import {processServerError} from 'services/api/errors';
import {IConstantTypesStoreModel, IInterviewQuestionGroup} from "~/ui/constants/store";
import {DimensionOfLife} from "~/types/api/dimensionOfLife";
import {MetricOfSuccess} from "~/types/api/metricOfSuccess";
import api from '~/services/api';

const onPopulate: Thunk<IConstantTypesStoreModel, null> = thunk(async ({ populate }, payload) => {
  let dimensionsOfLife: DimensionOfLife[] = [];
  let metricsOfSuccess: MetricOfSuccess[] = [];

  // Fetch and populate all constants
  try {
    const res: AxiosResponse = await api.phonenumbertype.list();
    populate({ name: 'phoneNumberTypes', values: res.data });
  } catch (err) {
    processServerError(err, 'constants.onPopulate');
  }
  try {
    const res: AxiosResponse = await api.maritalstatus.list();
    populate({ name: 'maritalStatuses', values: res.data });
  } catch (err) {
    processServerError(err, 'constants.onPopulate');
  }

  // try{
  //   // const res: AxiosResponse = await api.ac
  // }
  try {
    const res: AxiosResponse = await api.corevalue.list();
    populate({ name: 'coreValues', values: res.data });
  } catch (err) {
    processServerError(err, 'constants.onPopulate');
  }
  try {
    const res: AxiosResponse = await api.dimensionofsuccess.list();
    dimensionsOfLife = res.data;
    populate({ name: 'dimensionsOfLife', values: res.data });
  } catch (err) {
    processServerError(err, 'constants.onPopulate');
  }
  try {
    const res: AxiosResponse = await api.discovercategory.list();
    populate({ name: 'discoverCategories', values: res.data });
  } catch (err) {
    processServerError(err, 'constants.onPopulate');
  }
  try {
    const res: AxiosResponse = await api.metricofsuccess.list();
    metricsOfSuccess = res.data;
    populate({ name: 'metricsOfSuccess', values: res.data });
  } catch (err) {
    processServerError(err, 'constants.onPopulate');
  }
  try {
    const res: AxiosResponse = await api.complexityofneeds.list();
    populate({ name: 'complexityOfNeeds', values: res.data });
  } catch (err) {
    processServerError(err, 'constants.onPopulate');
  }
  try {
    const res: AxiosResponse = await api.legacyinterest.list();
    populate({ name: 'legacyInterest', values: res.data });
  } catch (err) {
    processServerError(err, 'constants.onPopulate');
  }
  try {
    const res: AxiosResponse = await api.personalrelationshiptype.list();
    populate({ name: 'personalRelationshipTypes', values: res.data });
  } catch (err) {
    processServerError(err, 'constants.onPopulate');
  }
  try {
    const res: AxiosResponse = await api.shareditemtype.list();
    populate({ name: 'itemType', values: res.data });
  } catch (err) {
    processServerError(err, 'constants.onPopulate');
  }
  try {
    const res: AxiosResponse = await api.sharetype.list();
    populate({ name: 'shareType', values: res.data });
  } catch (err) {
    processServerError(err, 'constants.onPopulate');
  }
  try {
    const res: AxiosResponse = await api.timeframe.list();
    populate({ name: 'timeframes', values: res.data });
  } catch (err) {
    processServerError(err, 'constants.onPopulate');
  }
  try {
    const res: AxiosResponse = await api.actionitemtype.list();
    populate({ name: 'actionItemTypes', values: res.data });
  } catch (err) {
    processServerError(err, 'constants.onPopulate');
  }
  try {
    const res: AxiosResponse = await api.intervaltype.list();
    populate({ name: 'intervalTypes', values: res.data });
  } catch (err) {
    processServerError(err, 'constants.onPopulate');
  }
  try {
    const res: AxiosResponse = await api.timezone.list();
    populate({ name: 'timezones', values: res.data });
  } catch (err) {
    processServerError(err, 'constants.onPopulate');
  }

  // Build question groups
  if (dimensionsOfLife && metricsOfSuccess) {
    const questionGroups: IInterviewQuestionGroup[] = [];
    metricsOfSuccess.forEach((metricOfSuccess: MetricOfSuccess) => {
      dimensionsOfLife.forEach((dimensionOfLife: DimensionOfLife) => {
        questionGroups.push({
          metricOfSuccess,
          dimensionOfLife
        });
      });
    });
    populate({ name: 'questionGroups', values: questionGroups });
  }

});

export default onPopulate;
