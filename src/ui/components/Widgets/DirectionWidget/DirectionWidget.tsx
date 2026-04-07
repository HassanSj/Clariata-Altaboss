import {Button, Icon, List, ListItem, ListItemText} from "@material-ui/core";
import Widget from "~/ui/components/Widgets/Widget";
import React, { useState } from "react";
import {useStoreState} from "~/store/hooks";
import {useRouter} from "next/router";
import paths from "~/ui/constants/paths";
import styles from "./../Widgets.module.scss";
import classnames from "classnames";
import { getAccessToken } from "~/services/auth";
import useSWR from "swr";
import { fetcher } from "~/types/api/fetcher";
import { Objective } from "~/types/api/objective";
import Modal from "../../Dialogs/Modal";
import useMountEvents from "~/ui/hooks/useMountEvents";
import api from "~/services/api";
import EmptyContainer from "../../Containers/EmptyContainer";

const { INTERVIEW, CONTACTS, DEEPEN } = paths;

const DirectionWidget = () => {
  const router = useRouter();
  const { householdId, contactId, dreamInterviewId, discoverInterviewId} = useStoreState((state) => state.selected);
  //const { dreamInterviewId, discoverInterviewId } = useStoreState((state) => state.interview);
  const urlObjectives = `${process.env.NEXT_PUBLIC_API_URL}/household/${householdId}/interview/${dreamInterviewId}/objective/list`;
  const {data: objectives} = useSWR<Objective[]>([urlObjectives, getAccessToken()], fetcher);
  const {actionItems} = useStoreState(state => state.objective);
  const [showPriorities,setShowPriorities] = useState<boolean>(false);
  const [sortedPriorities, setSortedPriorities] = useState<Objective[]>([]);
  const getCompletedObjectivesCount = () => {
    const completed = objectives?.filter(o => o.PercentComplete && o.PercentComplete >= 100);
    return completed?.length as number;
  }

  const getCompletedActionItemsCount = () => {
    console.log(actionItems);
    const completed = actionItems?.filter(o => o.PercentComplete && o.PercentComplete >= 100);
    return completed?.length;
  }

  const select = async (view: string) => {
    await router.push(`${paths.DIRECTION_PRIORITIES}?view=${view}`);
  }

  const sortAndFilterObjectives = async () => {
    const res = await api.objective.getSelectedListFull(householdId);
    const sorted = res?.data?.sort((a:Objective,b:Objective) => Number(a?.Rank) - Number(b?.Rank));
    if(sorted){
      setSortedPriorities(sorted);
    }
  }

  const handleRoute = (item:Objective) => {
    router.push(paths.DIRECTION_PRIORITIES)
  }

  return (
    <>
      <Widget title="Direction" interviewTemplateID={3}>
        <span className={classnames(styles.cl_red, styles.cl_icon, styles.cl_icon_discover)} />
        <span className={styles.cl_box_title}>Direction</span>
        <span className={styles.cl_box_txt}>
          What are the most important measures of success for you right now and what of your resources will you need to
          achieve them?
        </span>
        <div className={styles.cl_bottom}>
          <span className={styles.cl_box_tools}>
            <Button
              fullWidth={true}
              onClick={() => select('timing')}
              color="primary"
              variant="text"
              className={styles.cl_box_button}
            >
              Planning
              <Icon className={styles.cl_box_icon}>arrow_forward</Icon>
            </Button>
            <Button
              fullWidth={true}
              onClick={() => {
                sortAndFilterObjectives();
                setShowPriorities(true);
              }}
              color="primary"
              variant="text"
              className={styles.cl_box_button}
            >
              Selected Priorities
              <Icon className={styles.cl_box_icon}>arrow_forward</Icon>
            </Button>
          </span>
        </div>
      </Widget>
      <Modal title={'Selected Priorities'} isOpen={showPriorities} handleClose={() => setShowPriorities(false)} width="sm">
        <div style={{ alignItems: 'center' }}>
          <table style={{ border: 'thin solid #000000', borderCollapse: 'collapse', width: '100%', padding: '10rem' }}>
            <tbody>
              {sortedPriorities?.length > 0 ? (
                <tr style={{ backgroundColor: '#f0f9f7' }}>
                  <th
                    style={{
                      borderTop: 'thin solid #73c8c9',
                      borderBottom: 'thin solid #73c8c9',
                      borderLeft: 'thin solid #73c8c9',
                      padding: '10px',
                      width: '15%',
                    }}
                  >
                    Rank
                  </th>
                  <th
                    style={{
                      borderTop: 'thin solid #73c8c9',
                      borderBottom: 'thin solid #73c8c9',
                      borderLeft: 'thin solid #73c8c9',
                      borderRight: 'thin solid #73c8c9',
                      padding: '10px',
                      width: '85%',
                    }}
                  >
                    Priority
                  </th>
                </tr>
              ) : <EmptyContainer text="No Priorities to Display"></EmptyContainer>}
              {sortedPriorities?.length > 0 &&
                sortedPriorities?.map((item, i) => {
                  return (
                    <>
                      <tr style={{ backgroundColor: 'white' }}>
                        <td
                          style={{
                            borderTop: 'thin solid #73c8c9',
                            borderBottom: 'thin solid #73c8c9',
                            borderLeft: 'thin solid #73c8c9',
                            padding: '3px',
                            textAlign: 'center',
                          }}
                          key={i}
                        >
                          {item?.Rank}
                        </td>
                        <td
                          style={{
                            borderTop: 'thin solid #73c8c9',
                            borderBottom: 'thin solid #73c8c9',
                            borderLeft: 'thin solid #73c8c9',
                            borderRight: 'thin solid #73c8c9',
                            padding: '3px',
                            textAlign: 'left',
                          }}
                          key={i}
                          onClick={() => {
                            handleRoute(item)
                          }}
                        >
                          {item?.Description}
                        </td>
                      </tr>
                    </>
                  );
                })}
            </tbody>
          </table>
        </div>
      </Modal>
    </>
  );
}

export default DirectionWidget;
