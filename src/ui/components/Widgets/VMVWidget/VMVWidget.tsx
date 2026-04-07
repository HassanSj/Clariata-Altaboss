import {Button} from "@material-ui/core";
import Icon from "@material-ui/core/Icon";
import React from "react";
import {useRouter} from "next/router";
import {useStoreState, useStoreActions} from "~/store/hooks";
import paths from "~/ui/constants/paths";
import Widget from "~/ui/components/Widgets/Widget";
import styles from "./../Widgets.module.scss";
import classnames from "classnames";
import { WizardDataType } from "~/ui/constants/wizard";
import api from "~/services/api";
import useMountEvents from "~/ui/hooks/useMountEvents";

const { INTERVIEW } = paths;

const VMVWidget = () => {
  const router = useRouter();
  const wizardActions = useStoreActions(actions => actions.wizard);
  const {wizard} = useStoreState(state => state.wizard);
  const {selectedHousehold} = useStoreState(state => state.household)
  const {persons} =useStoreState(state => state.person);

  const {discoverInterviewId, interviews} = useStoreState(state => state.interview);


  const select = async () => {
    await wizardActions.onSelect({
      type: WizardDataType.SUBSTEPINDEX,
      subStepIndex: 13
    })
    router.push(`${INTERVIEW}/${discoverInterviewId}?showGrid=false`);
  }

  const [title,setTitle] = React.useState("");

  const getTitle = async () => {
    const primaryPerson = persons?.find(p => p?.PersonID === selectedHousehold?.PrimaryPerson1ID);
    
    let vision = ''; 
    let res = await api.interviewresponse.list(selectedHousehold?.HouseholdID, discoverInterviewId, 322);
    if(res?.data && res?.data.length > 0) vision += `The ${primaryPerson?.LastName} Family aspires to be `;
    vision += `${res?.data && res?.data?.length > 0 && res?.data[0].ResponseText ? res?.data[0].ResponseText + '. ' : ''}`;
    res = await api.interviewresponse.list(selectedHousehold?.HouseholdID, discoverInterviewId, 323);
    if(res?.data && res?.data.length > 0) vision += 'We intend to leave a legacy of being ';
    vision += `${res?.data && res?.data?.length > 0 && res?.data[0].ResponseText ? res?.data[0].ResponseText + '. ' : ''}`;
    res = await api.interviewresponse.list(selectedHousehold?.HouseholdID, discoverInterviewId, 324);
    if(res?.data && res?.data.length > 0) vision += 'We will strive to be ';
    vision += `${res?.data && res?.data?.length > 0 && res?.data[0].ResponseText ? res?.data[0].ResponseText + '. ' : ''}`;

    return vision;
  }

  useMountEvents({
    onMounted: async () => {
      const t = await getTitle();
      setTitle(t);
    },
    onChange: async () => {
      const t = await getTitle();
      setTitle(t);
    },
    watchItems: [interviews, selectedHousehold]
  });

  return (
    <>
      <Widget title="VMV" big={true}>
        <span className={classnames(styles.cl_dark_blue,  styles.cl_icon, styles.cl_icon_build_vision)}></span>
        <span className={styles.cl_sup_title}>Vision, Mission, Values</span>
        <span className={styles.cl_vmv_title}>{title}</span>
        {/* <div className={styles.cl_bottom}> */}
        <Button onClick={() => select()}
                    color="primary"
                    variant="text"
                    className={styles.cl_update_statement}>
              Update Statement
              <Icon>arrow_forward</Icon>
        </Button>
        {/* </div> */}
        

      </Widget>

    </>
  )
}

export default VMVWidget;
