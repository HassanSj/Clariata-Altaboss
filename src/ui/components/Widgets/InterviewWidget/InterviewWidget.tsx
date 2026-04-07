import {Button, Grid} from "@material-ui/core";
import Icon from "@material-ui/core/Icon";
import React, { useState } from "react";
import {InterviewType} from "~/ui/constants/interview";
import useMountEvents from "~/ui/hooks/useMountEvents";
import {InterviewFull} from "~/types/api/interviewFull";
import {useStoreState} from "~/store/hooks";
import paths from "~/ui/constants/paths";
import {useRouter} from "next/router";
import Widget from "~/ui/components/Widgets/Widget";
import {isNullOrUndefined, toPercentage} from "~/ui/constants/utils";
import styles from "./../Widgets.module.scss";
import BarProgressIndicator from "../../Indicators/BarProgressIndicator";
import classnames from "classnames";
import { computeInterviewProgress } from "~/services/interview";
import { InterviewProgress } from "~/types/api/interviewProgress";
import ReportsList from "../../Reports/ReportsList";
import Modal from "~/ui/components/Dialogs/Modal";
import { InterviewCategoryProgress } from "~/types/api/interviewCategoryProgress";
import { Person } from "~/types/api/person";
import { complete } from "~/services/api/objective";
import { getAccessToken } from "~/services/auth";
import useSWR from "swr";
import { Household } from "~/types/api/household";
import { fetcher } from "~/types/api/fetcher";
import { Interview } from "~/types/api/interview";
import api from "~/services/api";
import useHousehold from "~/ui/hooks/useHousehold";
import usePersons from "~/ui/hooks/usePersons";
import PriorityGridReportModal from "./PriorityGridReportModal/PriorityGridReportModal";
import useReports from "~/ui/hooks/useReports";
import { ReportType } from "~/ui/constants/reports";


const { INTERVIEW, REPORTS} = paths;

interface IProps {
  interviewType: InterviewType;
  id: number;
}

const InterviewWidget = ({ interviewType, id }: IProps) => {  
  const router = useRouter();
  //const { interviews, selectedInterview } = useStoreState(state => state.interview);

  //const {households, selectedHousehold } = useStoreState(state => state.household);
  const { householdId, dreamInterviewId, discoverInterviewId } = useStoreState((state) => state.selected);

  //const token = getAccessToken()
  //const urlHousehold = `${process.env.NEXT_PUBLIC_API_URL}/household/${householdId}`;  
  //const { data: selectedHousehold} = useSWR<Household>([urlHousehold, token], fetcher);
  const { household: selectedHousehold} = useHousehold();

  // const urlPersons = `${process.env.NEXT_PUBLIC_API_URL}/household/${householdId}/person/list`;  
  // const { data: persons} = useSWR<Person[]>([urlPersons, token], fetcher);

  const {persons} = usePersons();

  const [interview, setInterview] = React.useState<InterviewFull | undefined>();
  const [spouse1, setSpouse1] = React.useState<Person>();
  const [spouse2, setSpouse2] = React.useState<Person>();
  const [isOpen, setIsOpen] = React.useState(false);

  const [totalReportsCount,setTotalReportsCount] = React.useState(0);
  const [completedReportsCount,setCompletedReportsCount] = React.useState(0);

  const [loading, setLoading] = useState<boolean>(false);
  const [data, setData] = useState<any>();
  const { getReportProps } = useReports();

  const select = () => {
    if(interviewType == InterviewType.DREAM) {
      router.push(`${INTERVIEW}/${dreamInterviewId}?showGrid=true`);
    }
    if(interviewType == InterviewType.DISCOVER) {
      router.push(`${INTERVIEW}/${discoverInterviewId}?showGrid=true`);
    }
  }

  const handleReports = () => {
    router.push(REPORTS)
  }

  const getQuestionsProgress = () => {
    return `${interview?.Progress?.TotalInterviewQuestionsAnswered} 
    of ${interview?.Progress?.TotalInterviewQuestionCount} Questions`;
  }

  const computeProgress = () => {
    return toPercentage(interview?.Progress?.TotalInterviewQuestionsAnswered, interview?.Progress?.TotalInterviewQuestionCount);
  }

  const isDreamInterview = () => {
    return interviewType === InterviewType.DREAM;
  }

  const getQuestionsProgressWithParams = (total: Number, answered: Number) => {
    return `${answered} 
    of ${total} questions`;
  }

  const updateReportProgress = () => {
    let total = 0;
    let completed = 0;
    interview?.AdditionalCategoryProgressList?.forEach((categoryProgress : InterviewCategoryProgress) => {
      if(categoryProgress.Category1Name === 'Personal Story' && !isNullOrUndefined(spouse2) && !isNullOrUndefined(spouse1)) {
        total = total + 2;
        if(categoryProgress.Spouse1QuestionsAnswered == categoryProgress.TotalQuestionCount) completed = completed + 1;
        if(categoryProgress.Spouse2QuestionsAnswered == categoryProgress.TotalQuestionCount) completed = completed + 1;

      } else {
        total = total + 1;
        if(categoryProgress.QuestionsAnswered == categoryProgress.TotalQuestionCount) completed = completed + 1;
      }
    });

    interview?.Progress?.CategoryProgressList?.filter((progress: InterviewCategoryProgress ) => progress.Category1ID == 15 || progress.Category1ID == 8).forEach((categoryProgress : InterviewCategoryProgress) => {
      total = total + 1;
      if(categoryProgress.QuestionsAnswered == categoryProgress.TotalQuestionCount) completed = completed + 1;
    });


    setTotalReportsCount(total);
    setCompletedReportsCount(completed);
  }

  const setup = async () => {
    // Set interview
    let filteredInterview: InterviewFull;
    
    filteredInterview = await api.interview.getFull(householdId, id);
    setInterview(filteredInterview);

    //set spouses
    setSpouse1(undefined);
    setSpouse2(undefined);
    persons?.map((person: Person) => {
      if(person.PersonID == selectedHousehold?.PrimaryPerson1ID) setSpouse1(person);
      if(person.PersonID == selectedHousehold?.PrimaryPerson2ID) setSpouse2(person);
    })

    updateReportProgress();
  }
  const fetchData = async () => {
    setLoading(true);
    const priorityProps = await getReportProps(ReportType.PRIORITY_GRID);
    Promise.resolve(priorityProps);
    setData(priorityProps);
    setLoading(false);
  };

  useMountEvents({
    onMounted: async () => {
      setup();
      fetchData();
    },
    onChange: async () => {
      setup();
    },
    watchItems: [selectedHousehold]
  });
  
  const getInterviewInComplete = () => {
    if(interview && interview?.Progress && interview?.Progress?.TotalInterviewQuestionsAnswered && interview?.Progress?.TotalInterviewQuestionCount)
      return interview?.Progress?.TotalInterviewQuestionCount - interview?.Progress?.TotalInterviewQuestionsAnswered;
    return 0;
  }

  return (
    <Widget
      title={isDreamInterview() ? 'Dream' : 'Discover'}
      icon={isDreamInterview() ? 'accessibility' : 'history_edu'}
      computedProgress={computeProgress()}
      interviewTemplateID={interview?.InterviewTemplate?.InterviewTemplateID}
    >
      <span
        className={classnames(
          { [styles.cl_light_blue]: isDreamInterview(), [styles.cl_dark_blue]: !isDreamInterview() },
          styles.cl_icon,
          styles.cl_icon_discover,
        )}
      ></span>
      <span className={styles.cl_box_title}>{isDreamInterview() ? 'Dream' : 'Discover'}</span>
      <span className={styles.cl_box_txt}>
        {isDreamInterview()
          ? `What does a journey, filled with successes mean to you, and what does a well-lived life look like for you and your family?`
          : `What do you know about your family? What is your story? Why is this important?`}
      </span>
      <div className={styles.cl_bottom}>
        {!isDreamInterview() && interview ? (
          <span className={styles.cl_box_tools}>
            <Button
              fullWidth={true}
              onClick={() => select()}
              color="primary"
              variant="text"
              className={styles.cl_box_button}
            >
              Go to Interview
              <Icon className={styles.cl_box_icon}>arrow_forward</Icon>
            </Button>
            <Button
              fullWidth={true}
              onClick={() => setIsOpen(true)}
              color="primary"
              variant="text"
              className={styles.cl_box_button}
            >
              Story Reports Status
              {/* <span className={styles.cl_completed}>
                <span className={styles.cl_completed_left}>{completedReportsCount ?? 0} Completed</span>
                <span className={styles.cl_completed_right}>{totalReportsCount - completedReportsCount} Incomplete</span>
              </span> */}
              <Icon className={styles.cl_box_icon}>arrow_forward</Icon>
            </Button>
            {!isDreamInterview() ? (
              <Modal
                title={`Discover Report Progress`}
                isOpen={isOpen}
                handleClose={() => setIsOpen(false)}
                width="sm"
                hideFooter={true}
              >
                {interview?.AdditionalCategoryProgressList?.map((categoryProgress: InterviewCategoryProgress) => {
                  return categoryProgress.Category1Name === 'Personal Story' &&
                    !isNullOrUndefined(spouse2) &&
                    !isNullOrUndefined(spouse1) ? (
                    <>
                      <Grid container>
                        <Grid item xs={6} className={styles.progresstitle}>
                          {spouse1?.FirstName}'s {categoryProgress.Category1Name}
                        </Grid>
                        <Grid item xs={6}>
                          {' '}
                        </Grid>
                      </Grid>
                      <BarProgressIndicator
                        className={styles.module_progress_indicator}
                        variant="determinate"
                        value={toPercentage(
                          categoryProgress.Spouse1QuestionsAnswered,
                          categoryProgress.TotalQuestionCount,
                        )}
                      />
                      <Grid className={styles.module_progress_footer} container>
                        <Grid item xs={6} className={styles.left}>
                          {getQuestionsProgressWithParams(
                            Number(categoryProgress.TotalQuestionCount),
                            Number(categoryProgress.Spouse1QuestionsAnswered),
                          )}
                        </Grid>
                        <Grid item xs={6} className={styles.right}>
                          {toPercentage(
                            categoryProgress.Spouse1QuestionsAnswered,
                            categoryProgress.TotalQuestionCount,
                          )?.toFixed(0)}
                          %
                        </Grid>
                      </Grid>

                      <Grid container>
                        <Grid item xs={6} className={styles.progresstitle}>
                          {spouse2?.FirstName}'s {categoryProgress.Category1Name}
                        </Grid>
                        <Grid item xs={6}>
                          {' '}
                        </Grid>
                      </Grid>
                      <BarProgressIndicator
                        className={styles.module_progress_indicator}
                        variant="determinate"
                        value={toPercentage(
                          categoryProgress.Spouse2QuestionsAnswered,
                          categoryProgress.TotalQuestionCount,
                        )}
                      />
                      <Grid className={styles.module_progress_footer} container>
                        <Grid item xs={6} className={styles.left}>
                          {getQuestionsProgressWithParams(
                            Number(categoryProgress.TotalQuestionCount),
                            Number(categoryProgress.Spouse2QuestionsAnswered),
                          )}
                        </Grid>
                        <Grid item xs={6} className={styles.right}>
                          {toPercentage(
                            categoryProgress.Spouse2QuestionsAnswered,
                            categoryProgress.TotalQuestionCount,
                          )?.toFixed(0)}
                          %
                        </Grid>
                      </Grid>
                    </>
                  ) : (
                    <>
                      <Grid container>
                        <Grid item xs={6} className={styles.progresstitle}>
                          {categoryProgress.Category1Name}
                        </Grid>
                        <Grid item xs={6}>
                          {' '}
                        </Grid>
                      </Grid>
                      <BarProgressIndicator
                        className={styles.module_progress_indicator}
                        variant="determinate"
                        value={toPercentage(categoryProgress.QuestionsAnswered, categoryProgress.TotalQuestionCount)}
                      />
                      <Grid className={styles.module_progress_footer} container>
                        <Grid item xs={6} className={styles.left}>
                          {getQuestionsProgressWithParams(
                            Number(categoryProgress.TotalQuestionCount),
                            Number(categoryProgress.QuestionsAnswered),
                          )}
                        </Grid>
                        <Grid item xs={6} className={styles.right}>
                          {toPercentage(
                            categoryProgress.QuestionsAnswered,
                            categoryProgress.TotalQuestionCount,
                          )?.toFixed(0)}
                          %
                        </Grid>
                      </Grid>
                    </>
                  );
                })}
                {!isDreamInterview()
                  ? interview?.Progress?.CategoryProgressList?.filter(
                      (progress: InterviewCategoryProgress) => progress.Category1ID == 15 || progress.Category1ID == 8,
                    ).map((categoryProgress: InterviewCategoryProgress) => {
                      return (
                        <>
                          <Grid container>
                            <Grid item xs={6} className={styles.progresstitle}>
                              {categoryProgress.Category1Name}
                            </Grid>
                            <Grid item xs={6}>
                              {' '}
                            </Grid>
                          </Grid>
                          <BarProgressIndicator
                            className={styles.module_progress_indicator}
                            variant="determinate"
                            value={toPercentage(
                              categoryProgress.QuestionsAnswered,
                              categoryProgress.TotalQuestionCount,
                            )}
                          />
                          <Grid className={styles.module_progress_footer} container>
                            <Grid item xs={6} className={styles.left}>
                              {getQuestionsProgressWithParams(
                                Number(categoryProgress.TotalQuestionCount),
                                Number(categoryProgress.QuestionsAnswered),
                              )}
                            </Grid>
                            <Grid item xs={6} className={styles.right}>
                              {toPercentage(
                                categoryProgress.QuestionsAnswered,
                                categoryProgress.TotalQuestionCount,
                              )?.toFixed(0)}
                              %
                            </Grid>
                          </Grid>
                        </>
                      );
                    })
                  : null}
              </Modal>
            ) : null}
          </span>
        ) : null}
        {isDreamInterview() ? (
          <span className={styles.cl_box_tools}>
            {/* <Grid className={styles.module_progress_footer} container> */}
              <Button
                fullWidth={true}
                onClick={() => select()}
                color="primary"
                variant="text"
                className={styles.cl_box_button}
              >
                Go to Interview
                <Icon className={styles.cl_box_icon}>arrow_forward</Icon>
              </Button>
            {/* </Grid> */}

            {/* <div className={styles.footer_actions}> */}
              <Button
                fullWidth={true}
                onClick={() => setIsOpen(true)}
                color="primary"
                variant="outlined"
                size="large"
                className={styles.cl_box_button}
              >
                Priority Grid
                <Icon className={styles.cl_box_icon}>arrow_forward</Icon>
              </Button>
              {isDreamInterview() ? (
                <PriorityGridReportModal
                  isModalOpen={isOpen}
                  setIsOpen={setIsOpen}
                  household={data?.household}
                  persons={data?.persons}
                  objectives={data?.objectives}
                />
              ) : null}
            {/* </div> */}
          </span>
        ) : null}
      </div>
    </Widget>
  );
}

export default InterviewWidget;

