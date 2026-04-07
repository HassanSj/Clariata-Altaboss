import * as React from "react";
import { TileLayout, TileLayoutRepositionEvent, } from "@progress/kendo-react-layout";
import Button from "~/ui/components/Button";
import ModuleBadge from "../ModuleBadge";
import DataWrapper from "../Data/DataWrapper";
import usePagination from "~/ui/hooks/usePagination";
import { useState } from "react";
import SelectHouseholdItem from "../Household/SelectHouseholdItem";
import useUserInput from "~/ui/hooks/useUserInput";
import useNotifications from "~/ui/hooks/useNotifications";
import { useStoreActions, useStoreState } from "~/store/hooks";
import useSearchable from "~/ui/hooks/useSearchable";
import { Household } from "~/types/api/household";
import { IDataItemEventConfig } from "~/types/data";
import { SortDirection } from "~/ui/constants/data";
import useSortable from "~/ui/hooks/useSortable";
import {get} from 'lodash';
import { toPercentage } from "~/ui/constants/utils";
import { InterviewFull } from "~/types/api/interviewFull";
import { Box, Grid, Icon, IconButton, TextField } from "@material-ui/core";
import EditHousehold from "~/ui/components/Household/EditHousehold";
import api from "~/services/api";
import { Task } from "~/types/api/task";
import moment from "moment";
import EvaluationFormModal from "../Evaluations/EvaluationFormModal";
import { ClientEvaluation } from "~/types/api/clientEvaluation";
import useSWR, { mutate } from 'swr';
import { getAccessToken } from "~/services/auth";
import { fetcher } from "~/types/api/fetcher";
import router from "next/router";
import onSelectHousehold from "~/store/selected/thunks/onSelectHousehold";
import household from "~/store/household";
import { Interview } from "~/types/api/interview";
import { InterviewType } from "~/ui/constants/interview";
import useHouseholds from "~/ui/hooks/useHouseholds";
import useEvaluations from "~/ui/hooks/useEvaluations";
import useHousehold from "~/ui/hooks/useHousehold";
import EvaluationItem from "../Evaluations/EvaluationItem";
import EvaluationsList from "../Evaluations/EvaluationsList";
import Modal from "../../../ui/components/Dialogs/Modal/Modal";
import useMountEvents from "~/ui/hooks/useMountEvents";


enum ModuleStateValues {
    NotStarted = 0,
    Started = 50,
    Completed = 100
}

enum ModuleValues {
    Dream = 1,
    Discover = 2,
    Direction = 3
}

type SelectedModule = ModuleValues.Dream | ModuleValues.Discover | ModuleValues.Direction
type Module = 0 | SelectedModule
type ModuleState = ModuleStateValues.NotStarted | ModuleStateValues.Started | ModuleStateValues.Completed

function getFilteredByModule(sortableItems: Household[], allInterviews: InterviewFull[] | undefined, module: Module, moduleState: ModuleState) {
    const notStarted    = moduleState === ModuleStateValues.NotStarted
    const started       = moduleState === ModuleStateValues.Started

    return sortableItems.filter((i: Household) => {
        if(module === ModuleValues.Direction){
            const checkedCount = i.DirectionProgress?.reduce((prev, current) => prev + (current.Completed ? 1 : 0), 0) ?? 0
            const tasksCount = (i.DirectionProgress?.length ?? 0)

            if(notStarted){
                return checkedCount === 0
            }else if(started){
                return checkedCount > 0 && checkedCount < tasksCount
            }else{
                return checkedCount === tasksCount
            }
        }else {
            if (notStarted) {
                const index = allInterviews!.findIndex(interview =>
                    interview.Interview.HouseholdID === i.HouseholdID &&
                    interview.Interview.InterviewTemplateID === module &&
                    interview.Progress?.TotalInterviewQuestionsAnswered === 0
                )
                return index !== -1
            } else {
                return allInterviews?.some(interview =>
                    interview.Interview.HouseholdID === i.HouseholdID &&
                    interview.Interview.InterviewTemplateID === module &&
                    (
                        moduleState === ModuleStateValues.Started ?
                            toPercentage(interview?.Progress?.TotalInterviewQuestionsAnswered, interview?.Progress?.TotalInterviewQuestionCount) >= 1 &&
                            toPercentage(interview?.Progress?.TotalInterviewQuestionsAnswered, interview?.Progress?.TotalInterviewQuestionCount) < 100
                            :
                            toPercentage(interview?.Progress?.TotalInterviewQuestionsAnswered, interview?.Progress?.TotalInterviewQuestionCount) === 100
                    )
                )
            }
        }
    });
}

//const fetcher = (url: string) => privateAxios(url).then(res => res.data);

const AdvisorDashboard = () => {
    
    const notifications = useNotifications();
    const {householdId} = useStoreState((state) => state.selected);
    const { UserTypeID, user } = useStoreState((state) => state.user);
    const { onSelectHousehold , onSelectDiscoverInterview, onSelectDreamInterview} = useStoreActions((actions) => actions.selected);
    const { data: household } = useSWR<Household>([`${process.env.NEXT_PUBLIC_API_URL}/household/${householdId}`, getAccessToken()], fetcher);
    const [open , setOpen] = React.useState<boolean>(false)
    const { households } = useHouseholds();
    const { evaluations } = useEvaluations();    
    
    const [showEditHouseholdDialog, setShowEditHouseholdDialog] = React.useState(false);
    const [showEvaluationModal, setShowEvaluationModal] = React.useState(false);

    const [allInterviews, setAllInterviews] = React.useState<InterviewFull[]>();
    
    const [module, setModule] = useState<Module>(0); 
    const [moduleState, setModuleState] = useState<ModuleState>(0);
    const [myTasks, setMyTasks] = useState<Task[]>([]);
    const [pastDueTasks, setPastDueTasks] = useState<Task[]>([]);
    const [upcomingTasks, setUpcomingTasks] = useState<Task[]>([]);

    const [evaluationToEdit, setEvaluationToEdit] = useState<ClientEvaluation | undefined>();
    const [createEvaluation, setCreateEvaluation] = useState<boolean>(false);
    const [evaluationToDelete, setEvaluationToDelete] = useState<ClientEvaluation | undefined>();

    const GetMyTasks = async () => {

        const response = await api.task.getTasksByUser(Number(user.UserID));
        if(response) {
            const data  = await response.data;
            setMyTasks(data);
        }
    }

    const GetPastDueTasks = async () => {

        const response = await api.task.getPastDueTasks();
        if(response) {
            const data: Task[] = await response.data;
            setPastDueTasks(data);
        }
    }

    const GetUpcomingTasks = async () => {

        const response = await api.task.getUpcomingTasks();
        if(response) {
            const data  = await response.data;
            setUpcomingTasks(data);
        }
    }

    React.useEffect(() => {
        GetMyTasks();
        GetPastDueTasks();
        GetUpcomingTasks();

    }, []);

    // Search
    const searchText = useUserInput("");
    const searchableItems = useSearchable(
        households,
        searchText.value,
        (item: Household | undefined) => [`${item?.HouseholdName}`]
    );
    
    // Sort by
    const sortByValue = "HouseholdName";

    // Sorting
    const [sortDirection, setSortDirection] = useState(SortDirection.ASC);
    const sortableItems = useSortable(
        searchableItems,
        sortDirection,
        (item: Household | undefined) => [`${get(item, sortByValue)}`],
    );
    
    const filterableByModuleItems = (module === 0) ? sortableItems : getFilteredByModule(sortableItems, allInterviews, Number(module), Number(moduleState))

    // Pagination
    const paginator = usePagination(filterableByModuleItems, 5);
    
    // Data event config
    const eventConfig: IDataItemEventConfig = {
        onSelect: async (householdId: number) => {
            // if (onClose) {
            //     await onClose();
            //     notifications.addSuccessNotification('Household loaded successfully!');
            // }
            //await getInterviews(householdId);
            await onSelectHousehold(householdId);
            //const {household: selectedHousehold } = useHousehold();                    
            router.push
        }
    };

    const clientPaginator = usePagination(evaluations, 5);
    const clientEventConfig: IDataItemEventConfig = {
        onSelect: async (clientEvaluation: ClientEvaluation) => {
            setShowEvaluationModal(true);
            setEvaluationToEdit(clientEvaluation);
        }
    };

    const getInterviews = async (householdId: number) => {

        //Call API to get interviews for household
        console.log("HouseholdID:" + householdId);
        const response = await api.interview.list(householdId);
        const interviews = response?.data as Interview[]
        console.log(interviews);
        const discoverInterview = interviews?.filter(interview => interview.InterviewTemplateID == InterviewType.DISCOVER);
        console.log(discoverInterview);
        if(discoverInterview?.length > 0) {
            onSelectDiscoverInterview(discoverInterview[0].InterviewID);
        }

        const dreamInterview = interviews?.filter(interview => interview.InterviewTemplateID == InterviewType.DREAM);
        if(dreamInterview?.length > 0){
            onSelectDreamInterview(dreamInterview[0].InterviewID);        
        }
    }


    // const setCurrentInterviews = async () => {
    //     //get all interviews from current households (will need new endpoint later)
    //     //const filteredInterviews = await api.interview.listFull(Number(household?.HouseholdID));
    //     const filteredInterviews: InterviewFull[] = [];
    //     await Promise.all(households.map(async household => {
    //         const items = await api.interview.listFull(Number(household?.HouseholdID));
    //         filteredInterviews.push(...items);
    //     }));
    //     setAllInterviews(filteredInterviews);
    // }

    const [layoutData, setLayoutData] = React.useState<Array<any>>([
        { col: 1, colSpan: 3, rowSpan: 3 },
        { col: 4, colSpan: 1, rowSpan: 2 },
        { col: 4, colSpan: 1, rowSpan: 1 },
        { col: 4, colSpan: 1, rowSpan: 1 },
        { col: 4, colSpan: 1, rowSpan: 1 },
      ]);

      const tiles = [
        {
            header: "HOUSEHOLDS",
            body: <div>
                    { UserTypeID == 5 || UserTypeID == 6 ? null : 
                        <div style={{marginBottom: "20px"}}>
                            <Grid container item spacing={1}>
                                <Grid item xs={3}>
                                    <Button
                                        type="button"
                                        text={`Create New Household`}
                                        variant="contained"
                                        size="large"
                                        color="primary"
                                        onClick={() => setShowEditHouseholdDialog(true)}
                                    />
                                </Grid>
                                <Grid item xs={6}></Grid>
                                <Grid item xs={2}>
                                    <TextField id="standard-basic" placeholder="Search by Household Name" fullWidth={true} {...searchText} />
                                </Grid>
                                <Grid item xs={1}>
                                    <IconButton
                                    color={sortDirection === SortDirection.ASC ? 'primary' : 'default'}
                                    onClick={() => {
                                        setSortDirection(SortDirection.ASC)
                                    }}
                                    >
                                        <Icon>arrow_downward</Icon>
                                    </IconButton>
                                    <IconButton
                                    color={sortDirection === SortDirection.DESC ? 'primary' : 'default'}
                                    onClick={() => {
                                        setSortDirection(SortDirection.DESC)
                                    }}
                                    >
                                        <Icon>arrow_upward</Icon>
                                    </IconButton>
                                </Grid>
                            </Grid>
                        </div>
                    }
                    <div style={{height:"550px", overflow : "auto"}}>
                        <DataWrapper data={filterableByModuleItems}
                                     keyLabel="HouseholdID"
                                     propLabel="household"
                                     component={SelectHouseholdItem}
                                     eventConfig={eventConfig}
                                     />
                    </div>
            </div>
        },
        {
            header: "Client Evaluations",
            body: <div>
                <div style={{marginBottom: "20px"}}>
                    <Button
                        type="button"
                        text={`Add Evaluation`}
                        variant="contained"
                        size="small"
                        color="primary"
                        onClick={() => setShowEvaluationModal(true)}
                    />
                </div>
                {/* <DataWrapper paginator={clientPaginator}
                                     keyLabel="ClientEvaluations"
                                     propLabel="Evaluations"
                                     component={}
                                     eventConfig={clientEventConfig}
                                     /> */}
                                    
                <DataWrapper isGrouped={false}
                       paginator={clientPaginator}
                       propLabel="evaluation"
                       keyLabel="ClientEvaluationID"
                       component={EvaluationItem}
                       eventConfig={clientEventConfig} />
            </div>,
        },
        {
            header: "Tasks Assigned to Me",
            body: <div>
                { myTasks.length > 0 ?
                <table style={{border: "thin solid #fff"}}>
                    <tr>
                        <th style={{textAlign: "left"}}>Task</th>
                        <th style={{textAlign: "left"}}>Due Date</th>
                    </tr>
                {
                    myTasks.map((task) => {
                        return (
                            <tr>
                                <td width="40%">{task.TaskName}</td>
                                <td width="30%">{moment(task.EndDate).format("MM/DD/YYYY")}</td>
                            </tr>
                        )
                    })
                }
                </table>
                : <div>None</div> }
            </div>,
        },
        {
            header: "Tasks Due in the Next 7 Days",
            body: <div>
                { upcomingTasks?.length > 0 ?
                <table style={{border: "thin solid #fff"}}>
                    <tr>
                        <th style={{textAlign: "left"}}>Task</th>
                        <th style={{textAlign: "left"}}>Due Date</th>
                        <th style={{textAlign: "left"}}>Assigned To</th>
                    </tr>
                {
                    upcomingTasks.map((task) => {
                        return (
                            <tr>
                                <td width="40%">{task.TaskName}</td>
                                <td width="30%">{moment(task.EndDate).format("MM/DD/YYYY")}</td>
                                <td width="30%">{task.AssignedTo}</td>
                            </tr>
                        )
                    })
                }
                </table>
                : <div>None</div> }
            </div>,
        },
        {
            header: "Past Due Tasks",
            body: <div>
                { pastDueTasks.length > 0 ?
                <table style={{border: "thin solid #fff"}}>
                    <tr>
                        <th style={{textAlign: "left"}}>Task</th>
                        <th style={{textAlign: "left"}}>Due Date</th>
                        <th style={{textAlign: "left"}}>Assigned To</th>
                    </tr>
                {
                    pastDueTasks.map((task) => {
                        return (
                            <tr>
                                <td width="40%">{task.TaskName}</td>
                                <td width="30%">{moment(task.EndDate).format("MM/DD/YYYY")}</td>
                                <td width="30%">{task.AssignedTo}</td>
                            </tr>
                        )
                    })
                }
                </table>
                : <div>None</div> }
            </div>,
        },
        ];
    
      const handleReposition = (e: TileLayoutRepositionEvent) => {
        setLayoutData(e.value);
        console.log(e.value);
      };
      const householdModal = () =>{
        {!householdId ?
        setOpen(true) : ('')}
      }
      const handleClose = () =>{
        setOpen(false)
    }
    useMountEvents({
        onMounted: async () => {
            householdModal();
        },
      });
    return (
      <>
        <div style={{ marginBottom: '20px' }}>
          <TileLayout
            columns={4}
            rowHeight={255}
            positions={layoutData}
            gap={{ rows: 10, columns: 10 }}
            items={tiles}
            onReposition={handleReposition}
          />
          <EditHousehold
            PermissionEdit={null}
            isOpen={showEditHouseholdDialog}
            onClose={() => {
              setShowEditHouseholdDialog(false);
              mutate(`${process.env.NEXT_PUBLIC_API_URL}/household/list`);
            }}
          />
          <EvaluationFormModal
            key={evaluationToEdit ? evaluationToEdit!.ClientEvaluationID : 'new-ev'}
            isOpen={showEvaluationModal}
            evaluation={evaluationToEdit}
            onClose={() => {
              setEvaluationToEdit(undefined);
              setShowEvaluationModal(false);
            }}
            onSave={ev => {
              setEvaluationToEdit(ev);
              mutate(`${process.env.NEXT_PUBLIC_API_URL}/clientevaluation/list`);
            }}
          />
          <Button
            text="datasss"
            variant="outlined"
            color="primary"
            onClick={() => {
              setOpen(true);
            }}
          />
        </div>
      </>
    );
}

export default AdvisorDashboard;
