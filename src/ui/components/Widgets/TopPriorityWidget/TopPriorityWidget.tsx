import {
  IconButton,
} from "@material-ui/core";
import Icon from "@material-ui/core/Icon";
import React from "react";
import {useRouter} from "next/router";
import {useStoreState} from "~/store/hooks";
import paths from "~/ui/constants/paths";
import Widget from "~/ui/components/Widgets/Widget";
import styles from "./../Widgets.module.scss";
import no_image from "../icons/noImage.svg"
import useMountEvents from "~/ui/hooks/useMountEvents";
import api from "~/services/api";
import { getAccessToken } from "~/services/auth";
import { fetcher } from "~/types/api/fetcher";
import { Objective } from "~/types/api/models";
import useSWR from "swr";

const { DIRECTION_PRIORITIES} = paths;

const TopPriorityWidget = () => {

  const router = useRouter();
  //const {objectives} = useStoreState(state => state.objective);
  const { householdId, contactId, dreamInterviewId, discoverInterviewId} = useStoreState((state) => state.selected);
  //const { dreamInterviewId } = useStoreState((state) => state.interview);
  const urlObjectives = `${process.env.NEXT_PUBLIC_API_URL}/household/${householdId}/interview/${dreamInterviewId}/objective/list`;
  const {data: objectives} = useSWR<Objective[]>([urlObjectives, getAccessToken()], fetcher);

  const [topPriority,setTopPriority] = React.useState(objectives ? objectives[0]: null);


  const goToPriority = async () => {
    await router.push(`${DIRECTION_PRIORITIES}?view=timing`);
    window.scrollTo(0, 0);
  }

  const refreshData = async () => {
    setTopPriority(objectives ? objectives[0]: null);
  }

  useMountEvents({
    onMounted: async () => {
      await refreshData();
    },
    onChange: async () => {
      await refreshData();
    },
    watchItems: [objectives]
  });


  return (
    <>
      <Widget title="Top Priority" //image={topPriority?.SuccessImageURL} 
      >

        <span className={styles.cl_image_title}>
          <span className={styles.cl_image_profile}>Vision Board</span>
          {/* <span className={styles.cl_image_name}>{topPriority?.Description}</span> */}
          <span className={styles.cl_image_profile}>Coming Soon</span>
          <IconButton
              //</span>onClick={async () => await goToPriority()}
          >
            <Icon style={{color: "white"}}>arrow_forward</Icon>
          </IconButton>
        </span>
        

      </Widget>

    </>
  )
}

export default TopPriorityWidget;
