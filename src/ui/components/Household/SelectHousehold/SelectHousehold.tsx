import React, {ReactElement, useState} from 'react';
import {useStoreState} from "~/store/hooks";
import usePagination from "~/ui/hooks/usePagination";
import DataWrapper from "~/ui/components/Data/DataWrapper";
import SelectHouseholdItem from "~/ui/components/Household/SelectHouseholdItem";
import {IDataItemEventConfig} from "~/types/data";
import EditHousehold from "~/ui/components/Household/EditHousehold";
import styles from './SelectHousehold.module.scss';
import {
    Box,
    Card,
    CardContent,
    FormControl,
    Grid,
    Icon,
    IconButton,
    InputLabel,
    MenuItem,
    Select,
    TextField,
    Tooltip
} from "@material-ui/core";
import Button from "~/ui/components/Button";
import useUserInput from "~/ui/hooks/useUserInput";
import useSearchable from "~/ui/hooks/useSearchable";
import {SortDirection} from "~/ui/constants/data";
import useSortable from "~/ui/hooks/useSortable";
import {Household} from "~/types/api/household";
import {get} from 'lodash';
import useNotifications from "~/ui/hooks/useNotifications";
import {toPercentage} from '~/ui/constants/utils';
import {InterviewFull} from '~/types/api/interviewFull';
import useMountEvents from '~/ui/hooks/useMountEvents';
import api from '~/services/api';
import EvaluationModal from '../../Evaluations/EvaluationModal';

interface IProps {
    isOpen: boolean;
    onClose: () => unknown;
}

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

const SelectHousehold = ({onClose}: IProps): ReactElement => {
    const notifications = useNotifications();

    const {households} = useStoreState((state) => state.household);
    const [showEditHouseholdDialog, setShowEditHouseholdDialog] = React.useState(false);
    const [showEvaluationModal, setShowEvaluationModal] = React.useState(false);

    const [allInterviews, setAllInterviews] = React.useState<InterviewFull[]>();

    // Search
    const searchText = useUserInput("");
    const searchableItems = useSearchable(
        households,
        searchText.value,
        (item: Household | undefined) => [`${item?.HouseholdName}`]
    );

    const [module, setModule] = useState<Module>(0);
    const [moduleState, setModuleState] = useState<ModuleState>(0);

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
        onSelect: async () => {
            if (onClose) {
                await onClose();
                notifications.addSuccessNotification('Household loaded successfully!');
            }
        }
    };

    useMountEvents({
        onMounted: async () => {
            await setCurrentInterviews();
        },
    });

    const setCurrentInterviews = async () => {
        // get all interviews from current households (will need new endpoint later)
        // const filteredInterviews = await api.interview.listFull(Number(household?.HouseholdID));
        const filteredInterviews: InterviewFull[] = [];
        await Promise.all(households.map(async household => {
            const items = await api.interview.listFull(Number(household?.HouseholdID));
            filteredInterviews.push(...items);
        }));
        setAllInterviews(filteredInterviews);
    }

    return (
        <>
            <Card>
                <CardContent>
                    <div className={styles.header}>
                        <Grid container spacing={1}>
                            <Grid item xs={4} className={styles.titleWrapper}>
                                <h1 className={styles.title}>Advisor Dashboard</h1>
                            </Grid>
                            <Grid item container xs={8} justifyContent="flex-end">
                                <Box ml={2}>
                                    <Button
                                        type="button"
                                        text={`Go to Client Evaluation`}
                                        variant="contained"
                                        size="large"
                                        color="info"
                                        onClick={() => setShowEvaluationModal(true)}
                                    />
                                </Box>
                                {/* </Grid>
              <Grid item container xs={2} justifyContent="flex-end"> */}
                                <Box ml={2}>
                                    <Button
                                        type="button"
                                        text={`Create New Household`}
                                        variant="contained"
                                        size="large"
                                        color="info"
                                        onClick={() => setShowEditHouseholdDialog(true)}
                                    />
                                </Box>
                            </Grid>
                        </Grid>
                    </div>
                    <div className="m-t-15 m-b-15">
                        <Grid container spacing={1}>
                            <Grid item xs={3}>
                                <div className={styles.filter}>
                                    <TextField {...searchText}
                                               id="standard-basic"
                                               label="Search"
                                               placeholder="Search"
                                               fullWidth={true}/>
                                </div>
                            </Grid>
                            <Grid item xs={4}/>
                            {/* <Grid container item xs={6} alignItems="center" justifyContent="flex-end"> */}
                            <Grid item xs={2}>
                                <FormControl variant="outlined">
                                    <InputLabel id="filterModule">Filter By Module</InputLabel>
                                    <Select
                                        value={module}
                                        labelId="filterModule"
                                        label="Filter By Module"
                                        onChange={event => {
                                            setModule(event.target.value as Module);
                                        }}
                                        displayEmpty
                                        MenuProps={{
                                            anchorOrigin: {
                                                vertical: "bottom",
                                                horizontal: "left"
                                            },
                                            transformOrigin: {
                                                vertical: "top",
                                                horizontal: "left"
                                            },
                                            getContentAnchorEl: null
                                        }}
                                    >
                                        <MenuItem value={0}>None</MenuItem>
                                        <MenuItem value={1}>Dream</MenuItem>
                                        <MenuItem value={2}>Discover</MenuItem>
                                        <MenuItem value={3}>Direction</MenuItem>
                                    </Select>

                                </FormControl>
                            </Grid>
                            <Grid item xs={2}>

                                <FormControl variant="outlined">
                                    <InputLabel id="filterModuleState">Filter By Module State</InputLabel>
                                    <Select
                                        value={moduleState}
                                        labelId="filterModuleState"
                                        label="Filter By Module State"
                                        onChange={event => {
                                            setModuleState(event.target.value as ModuleState);
                                        }}
                                        displayEmpty
                                        MenuProps={{
                                            anchorOrigin: {
                                                vertical: "bottom",
                                                horizontal: "left"
                                            },
                                            transformOrigin: {
                                                vertical: "top",
                                                horizontal: "left"
                                            },
                                            getContentAnchorEl: null
                                        }}
                                    >
                                        <MenuItem value={0}>Not Started</MenuItem>
                                        <MenuItem value={50}>Started</MenuItem>
                                        <MenuItem value={100}>Completed</MenuItem>
                                    </Select>

                                </FormControl>
                            </Grid>
                            {/* </Grid> */}
                            <Grid container item xs={1} alignItems="center" justifyContent="flex-end">
                                <Tooltip title="Sort Ascending">
                                    <IconButton color={sortDirection === SortDirection.ASC ? 'primary' : 'default'}
                                                onClick={() => setSortDirection(SortDirection.ASC)}>
                                        <Icon>arrow_downward</Icon>
                                    </IconButton>
                                </Tooltip>
                                <Tooltip title="Sort Descending">
                                    <IconButton color={sortDirection === SortDirection.DESC ? 'primary' : 'default'}
                                                onClick={() => setSortDirection(SortDirection.DESC)}>
                                        <Icon>arrow_upward</Icon>
                                    </IconButton>
                                </Tooltip>
                            </Grid>
                        </Grid>
                    </div>
                    <div className="m-b-15"/>
                    <div className={styles.items}>
                        <DataWrapper paginator={paginator}
                                     keyLabel="HouseholdID"
                                     propLabel="household"
                                     component={SelectHouseholdItem}
                                     eventConfig={eventConfig}/>
                    </div>
                </CardContent>
            </Card>
            <EditHousehold PermissionEdit={null} isOpen={showEditHouseholdDialog} onClose={() => setShowEditHouseholdDialog(false)}/>
            <EvaluationModal isOpen={showEvaluationModal} onClose={() => setShowEvaluationModal(false)}/>
        </>
    )
};

export default SelectHousehold;
