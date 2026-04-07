import React from 'react';
import {useStoreState} from "~/store/hooks";
import InterviewItem from "~/ui/components/Interviews/InterviewItem";
import {hasItems} from "~/ui/constants/utils";
import EmptyContainer from "~/ui/components/Containers/EmptyContainer";
import {InterviewFull} from "~/types/api/interviewFull";
import {
  Avatar,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemSecondaryAction,
  ListItemText
} from "@material-ui/core";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import styles from "~/ui/components/Interviews/InterviewItem/InterviewItem.module.scss";
import Icon from "@material-ui/core/Icon";
import paths from "~/ui/constants/paths";
import {useRouter} from "next/router";

const { INTERVIEW, CONTACTS, DEEPEN } = paths;

const InterviewsList = () => {
  const router = useRouter();
  const { persons } = useStoreState(state => state.person);
  const { interviews } = useStoreState(state => state.interview);
  const { objectives, actionItems } = useStoreState((state) => state.objective);

  const goToPriorities = () => {
    router.push(`${DEEPEN}`);
  }

  // const goToTasks = () => {
  //   router.push(`${DEEPEN_TASKS}`);
  // }

  const goToContacts = () => {
    router.push(`${CONTACTS}`);
  }

  return (
    <>
      <Grid container spacing={1}>
        {hasItems(interviews) ? interviews?.map((interview: InterviewFull, index: number) => {
          return (
            <Grid item sm={12} lg={4} key={index}>
              <InterviewItem key={index} interview={interview} />
            </Grid>
          )
        }) : <EmptyContainer text="No interviews found." />}
        {hasItems(interviews) ?
          <Grid item sm={12} lg={4}>
            <Card>
              <CardContent className={styles.module_progress_container}>
                <div className={styles.module_icon_container}>
                  <Avatar className={styles.module_icon_blue}>
                    <Icon>insights</Icon>
                  </Avatar>
                </div>
                <div className={styles.module_title_container}>
                  <div className={styles.module_title}>Direction</div>
                </div>
                <div>
                  <List>
                    <ListItem divider>
                      <ListItemAvatar>
                        <Avatar>
                          <Icon>clear_all</Icon>
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText>
                        <div className={styles.module_details_title}>{hasItems(objectives) ? objectives?.length : 0} Priorities</div>
                      </ListItemText>
                      <ListItemSecondaryAction>
                        <IconButton edge="end" aria-label="delete" onClick={() => goToPriorities()}>
                          <Icon>arrow_forward</Icon>
                        </IconButton>
                      </ListItemSecondaryAction>
                    </ListItem>
                    <ListItem divider>
                      <ListItemAvatar>
                        <Avatar>
                          <Icon>check_circle_outline</Icon>
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText>
                        <div className={styles.module_details_title}>{hasItems(actionItems) ? actionItems?.length : 0} Action Steps</div>
                      </ListItemText>
                      {/* <ListItemSecondaryAction>
                        <IconButton edge="end" aria-label="delete" onClick={() => goToTasks()}>
                          <Icon>arrow_forward</Icon>
                        </IconButton>
                      </ListItemSecondaryAction> */}
                    </ListItem>
                  </List>
                </div>
              </CardContent>
            </Card>
          </Grid>
        : null }
      </Grid>

    </>
  );
};

export default InterviewsList;
