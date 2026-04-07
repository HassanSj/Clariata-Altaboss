import { Box, Card, CardContent, DialogActions, Grid, Hidden, InputLabel, MenuItem, Select } from "@material-ui/core";
import React, { useEffect } from "react";
import styles from "./Deepen.module.scss";
import { filterBy, Gantt, GanttColumnReorderEvent, GanttColumnResizeEvent, GanttDataStateChangeEvent, GanttDateFilter, GanttDayView, GanttExpandChangeEvent, GanttMonthView, GanttTextFilter, GanttWeekView, GanttYearView, orderBy } from "@progress/kendo-react-gantt";
import { extendDataItem, getter, mapTree } from "@progress/kendo-react-common";
import { exampleTaskData, exampleDependencyData } from "./data";
import { Milestone } from "~/types/api/milestone";
import { Task } from "~/types/api/task";
import { GanttItem } from "~/types/api/ganntItem";
import { getMilestonesByActionItem, getMilestone, deleteMilestone } from '~/services/api/milestone';
import { getGanttItemsByActionItem, getGanttItemsByPriority, getGanttItemsyHousehold } from '~/services/api/ganttitem';
import { getTasksByMilestone, getTask, deleteTask } from '~/services/api/task';
import api from "~/services/api";
import Button from "~/ui/components/Button";
import FormWrapper from "~/ui/components/Forms/FormWrapper";
import InputField from '~/ui/components/Forms/InputField';
import Input from "~/ui/components/Forms/Input";
import Modal from "~/ui/components/Dialogs/Modal";
import { initialValues, initialTaskValues } from "./form/initialvalue";
import { useStoreState } from "~/store/hooks";
import objective from "~/store/objective";
import { ActionItem } from "~/types/api/actionItem";
import classnames from "classnames";
import moment from "moment";
import validateMilestone, { validateTask } from "./form/validate";

const ganttStyle = {
//   height: 500,
  maxWidth: 1800,
};

const taskModelFields = {
  id: "ID",  
  title: "Title",
  assignedTo: "AssignedTo",
  start: "StartDate",
  end: "EndDate",
  children: "GanttItems",
  isExpanded: "IsExpanded"
};


interface actionList {
    id: number,
    name: string,
    sortField: string
}

const dependencyModelFields = {
  id: "id",
  fromId: "fromId",
  toId: "toId",
  type: "type",
};

const getTaskId = getter(taskModelFields.id);

const columns = [
//   { field: taskModelFields.id, title: "ID", width: 70,  },
  {
    field: taskModelFields.title,
    title: "Milestone",
    width: 200,
    expandable: true,
    filter: GanttTextFilter,
  },
  {
    field: taskModelFields.assignedTo,
    title: "Assigned To",
    width: 200,
    filter: GanttTextFilter,
  },
  {
    field: taskModelFields.start,
    title: "Start",
    width: 120,
    format: "{0:MM/dd/yyyy}",
  },
  {
    field: taskModelFields.end,
    title: "End",
    width: 120,
    format: "{0:MM/dd/yyyy}",
  },
];

const Deepen = ({hideHeader = false}) => {

    const [milestoneModalOpen, setMilestoneModalOpen] = React.useState<boolean>(false);
    const [taskModalOpen, setTaskModalOpen] = React.useState<boolean>(false);
    const [priorityID, setPriorityID] = React.useState<number>(0);
    const [actionPlanID, setActionPlanID] = React.useState<number>(0);
    const { selectedHousehold,households } = useStoreState((state) => state.household);
    const { objectives } = useStoreState((state) => state.objective);
    const [selectedPriority, setSelectedPriority] = React.useState<number>(0);
    const [actionItems, setActionItems] = React.useState<actionList[] | undefined>([]);
    const [selectedActionItemID, setSelectedActionItemID] = React.useState<number>(0);
    const [selectedMilestone, setSelectedMilestone] = React.useState<number>(0);
    const [selectedAssigned, setSelectedAssigned] = React.useState<string>("");
    const [milestoneList, setMilestoneList] = React.useState<Milestone[]>([]);
    const [taskList, setTaskList] = React.useState<Task[]>([]);
    const [assignedList, setAssignedList] = React.useState<(string | undefined)[]>([]);
    const [ganttItemData, setGanttItemData] = React.useState<GanttItem[]>([]);
    const [dependencyData] = React.useState(exampleDependencyData);
    const [showGantt, setShowGantt] = React.useState<boolean>(false);
    const [moduleName, setModuleName] = React.useState<String>("");
    const [moduleOverview, setModuleOverview] = React.useState<String>("");
    const [isActive, setIsActive] = React.useState<boolean>(false);
    const [isActiveTrial, setIsActiveTrial] = React.useState<boolean>(false);

    const [expandedState, setExpandedState] = React.useState([7, 11, 12, 13]);
    const [columnsState, setColumnsState] = React.useState<Array<any>>(columns);

    const onColumnResize = React.useCallback(
        (event: GanttColumnResizeEvent) =>
        event.end && setColumnsState(event.columns),
        [setColumnsState]
    );

    const onColumnReorder = React.useCallback(
        (event: GanttColumnReorderEvent) => setColumnsState(event.columns),
        [setColumnsState]
    );

    const [dataState, setDataState] = React.useState<any>({
        sort: [{ field: "orderId", dir: "asc" }],
        filter: [],
      });
    
      const onDataStateChange = React.useCallback(
        (event: GanttDataStateChangeEvent) =>
          setDataState({
            sort: event.dataState.sort,
            filter: event.dataState.filter,
          }),
        [setDataState]
      );

    const onExpandChange = React.useCallback(
    (event: GanttExpandChangeEvent) => {
        const id = getTaskId(event.dataItem);
        const newExpandedState = event.value
        ? expandedState.filter((currentId) => currentId !== id)
        : [...expandedState, id];

        setExpandedState(newExpandedState);
    },
    [expandedState, setExpandedState]
    );

    const processedData = React.useMemo(() => {
    const filteredData = filterBy(
        ganttItemData,
        dataState.filter,
        taskModelFields.children
    );
    const sortedData = orderBy(
        filteredData,
        dataState.sort,
        taskModelFields.children
    );

    return mapTree(sortedData, taskModelFields.children, (task) =>
        extendDataItem(task, taskModelFields.children, {
        [taskModelFields.isExpanded]: expandedState.includes(getTaskId(task)),
        })
    );
    }, [ganttItemData, dataState, expandedState])

    const OpenMilestone = () => {
        setMilestoneModalOpen(true);
    }

    const CreateMilestone = async (milestone: Milestone) => {
        milestone.ActionItemID = selectedActionItemID;
        console.log(milestone);
        const res = await api.milestone.createMilestone(milestone);
        
        const responses = await api.milestone.getMilestonesByActionItem(milestone.ActionItemID);
        const milestones = await responses.data;

        setMilestoneList(milestones);

        GanttItemActionItemData(selectedActionItemID);

        setMilestoneModalOpen(false);
    }  

    const CloseMilestoneModal = () => {
        setMilestoneModalOpen(false);
      }

    const GanttItemPriorityData = async (priorityId: number) => {

        const response = await api.ganttItem.getGanttItemsByPriority(priorityId);
        
        if(response) {

            const ganttItems = await response.data;

            ganttItems.forEach((ganttItem) => {

                ganttItem.StartDate = moment(ganttItem.StartDate).toDate();
                ganttItem.EndDate = moment(ganttItem.EndDate).toDate();
                ganttItem.IsExpanded = true;        
                    
                ganttItem.GanttItems.forEach((task) => {

                    task.StartDate = moment(task.StartDate).toDate();
                    task.EndDate = moment(task.EndDate).toDate();
                    task.IsExpanded = true;
                    task.AssignedTo = task.AssignedTo;
                })
            });

            console.log(ganttItems);
            setGanttItemData(ganttItems);
        }
    }

    const GanttItemActionItemData = async (actionItemId: number) => {

        const response = await api.ganttItem.getGanttItemsByActionItem(actionItemId);

        if(response) {

            const ganttItems = await response.data;

            ganttItems.forEach((ganttItem) => {

                ganttItem.StartDate = moment(ganttItem.StartDate).toDate();
                ganttItem.EndDate = moment(ganttItem.EndDate).toDate();    
                ganttItem.IsExpanded = true;   
                    
                ganttItem.GanttItems.forEach((task) => {

                    task.StartDate = moment(task.StartDate).toDate();
                    task.EndDate = moment(task.EndDate).toDate();
                    task.IsExpanded = true;
                    task.AssignedTo = task.AssignedTo
                })
            });

            console.log(ganttItems);
            setGanttItemData(ganttItems);

            const tasks: Task[] = [];

            // ganttItems.map(milestone => { 
            //     milestone.GanttItems?.map(task => {
            //         tasks.push(task)
            //     })
            // });
            console.log(tasks);
            const uniqueAssigned = Array.from(new Set(tasks.map((item) => item.AssignedTo)));
            console.log(uniqueAssigned);
            //setAssignedList(uniqueAssigned);
        }
    }

    const selectObjective = (objectiveId: number | unknown) => {
        let selected = objectives.find(x => x.ObjectiveID == objectiveId);
        const list : actionList[] = [];
        selected?.ActionItemList?.forEach(x => {
            let actionName: string = "";
            let sortName: string = "";
            if(x.StartDate) {
                actionName = x.Description + " - " + (moment(x.StartDate).format("MM")) + "/" + moment(x.StartDate).format("YYYY");
                sortName = x.Description + " - " + moment(x.StartDate).get('year') + " " + (moment(x.StartDate).format("MM"));
            }
            
            let item: actionList = {
                id: x.ActionItemID as number,
                name: actionName as string,
                sortField: sortName
            }

            list.push(item);
        })

        const sortedList = list.sort((a,b) => {
            if(a.sortField.toLowerCase() < b.sortField.toLowerCase()) return -1;
            if(a.sortField.toLowerCase() > b.sortField.toLowerCase()) return 1;
            return 0;
        });
        setActionItems(sortedList);
        setSelectedPriority(objectiveId as number);
        
        if(selectedPriority != 0) {
            GanttItemPriorityData(objectiveId as number);
        }
        else {
            loadData();
            setSelectedActionItemID(0);
            setSelectedMilestone(0);
            // ganttItemData.map(milestone => { 
            //     milestone.GanttItems?.map(task => {
            //         taskList.push(task)
            //     })
            // });
            const uniqueAssigned = Array.from(new Set(taskList.map((item) => item.AssignedTo)));
            //setAssignedList(uniqueAssigned);
        }
    }

    const selectActionItem = async (actionItemId: number) => {

        setSelectedActionItemID(actionItemId);

        const milestoneResponse = await api.milestone.getMilestonesByActionItem(actionItemId);
        const milestones = await milestoneResponse.data;

        if(actionItemId != 0) {
            GanttItemActionItemData(actionItemId);
        }
        else {
            GanttItemPriorityData(selectedPriority);
            setSelectedPriority(0);
        }

        setMilestoneList(milestones);
    }

    const selectMilestone = async (milestoneID: number) => {

        setSelectedMilestone(milestoneID);

        const taskResponse = await api.task.getTasksByMilestone(selectedMilestone)
        const tasks = await taskResponse.data;


        const taskItems: Task[] = [];

        console.log("Milestones");
        // ganttItemData.map(milestone => { 
        //     milestone.GanttItems?.map(task => {
        //         taskItems.push(task)
        //     })
        // });
        const uniqueAssigned = Array.from(new Set(taskItems.map((item) => item.AssignedTo)));

        //setAssignedList(uniqueAssigned);
        setTaskList(tasks);

    }

    // const selectAssigned = async (assigned: string) => {

    //     setSelectedAssigned(assigned);

    //     const taskResponse = await api.task.getTasksByMilestone(selectedMilestone)
    //     const tasks = await taskResponse.data;


    //     const taskItems: Task[] = [];

    //     console.log("Milestones");
    //     ganttItemData.map(milestone => { 
    //         milestone.GanttItems?.map(task => {
    //             taskItems.push(task)
    //         })
    //     });
    //     const uniqueAssigned = Array.from(new Set(taskItems.map((item) => item.AssignedTo)));

    //     setAssignedList(uniqueAssigned);
    //     setTaskList(tasks);

    // }

    const OpenTask= () => {
        setTaskModalOpen(true);
    }
    
    const CreateTask = async (task: Task) => {
        task.MilestoneID = selectedMilestone;

        task.MilestoneID = selectedMilestone;
        const taskResponse = await api.task.createTask(task);
        
        const responses = await api.task.getTasksByMilestone(selectedMilestone);
        const tasks = await responses.data;
        
        const taskItems: Task[] = [];

        console.log("Tasks");
        // ganttItemData.map(milestone => { 
        //     milestone.GanttItems?.map(task => {
        //         taskItems.push(task)
        //     })
        // });
        const uniqueAssigned = Array.from(new Set(taskItems.map((item) => item.AssignedTo)));

        //setAssignedList(uniqueAssigned);
        setTaskList(tasks);
        GanttItemActionItemData(selectedActionItemID);
        setTaskModalOpen(false);
    }  
    
    const CloseTaskModal = () => {
        setTaskModalOpen(false);
    }

    const loadData = async () => {
        
        const responseModule = await api.clariataModule.get("Deepen");

        if(responseModule) {
            const clariataModule = await responseModule.data;
            
            setModuleOverview(clariataModule.ModuleOverview);
            setModuleName(clariataModule.ModuleName);
            setIsActive(clariataModule.IsActive);
            setIsActiveTrial(clariataModule.IsActive);

            if(clariataModule.IsActive) {

                const response = await api.ganttItem.getGanttItemsyHousehold(selectedHousehold.HouseholdID);

                if(response) {

                    const ganttItems = await response.data;

                    ganttItems.forEach((ganttItem) => {

                        ganttItem.StartDate = moment(ganttItem.StartDate).toDate();
                        ganttItem.EndDate = moment(ganttItem.EndDate).toDate(); 
                        ganttItem.IsExpanded = true;               
                            
                        ganttItem.GanttItems.forEach((task) => {

                            task.StartDate = moment(task.StartDate).toDate();
                            task.EndDate = moment(task.EndDate).toDate();
                            task.IsExpanded = true;
                            task.AssignedTo = task.AssignedTo;
                        });
                    });

                    console.log(ganttItems);
                    setGanttItemData(ganttItems);
                }
            }
        }
    }

    useEffect(() => {

        loadData();

    }, [Card]);

    if (isActive) {
        return (
            <>

            { !hideHeader ?
                <Card>
                    <CardContent>
                    <div className={classnames("card-header-image",styles.header_bg)}></div>
                    <Grid container spacing={2}>
                        <Grid item xs={2}>
                            <InputLabel>Priority:</InputLabel> 
                            <Select style={{width: "200px", marginBottom: "25px", padding: "10px"}} value={selectedPriority} onChange={event => {selectObjective(event.target.value)}} >
                                <MenuItem key={0} value={0}>All Priorities</MenuItem>
                                {objectives.map((objective) => (
                                    <MenuItem
                                        key={objective.ObjectiveID}
                                        value={objective.ObjectiveID}
                                        >{objective.Description}</MenuItem>
                                )
                                )}
                            </Select>
                        </Grid>
                        <Grid item xs={2}>
                            <InputLabel>Action Step:</InputLabel> 
                            <Select style={{width: "200px", marginBottom: "25px", padding: "10px"}} value={selectedActionItemID} onChange={event => {selectActionItem(event.target.value as number)}} >
                            <MenuItem key={0} value={0}>All Action Steps</MenuItem>
                                {actionItems?.map((item) => (
                                    <MenuItem
                                        key={item.id}
                                        value={item.id}
                                        >{item.name}</MenuItem>
                                )
                                )}
                            </Select>
                        </Grid>
                        <Grid item xs={2}>
                            <InputLabel>Milestone:</InputLabel> 
                            <Select style={{width: "200px", marginBottom: "25px", padding: "10px"}} value={selectedMilestone} onChange={event => {selectMilestone(event.target.value as number)}} >
                                <MenuItem key={0} value={0}>All Milestones</MenuItem>
                                {milestoneList.map((milestone) => (
                                    <MenuItem
                                        key={milestone.MilestoneID}
                                        value={milestone.MilestoneID}
                                        >{milestone.MilestoneName}</MenuItem>
                                )
                                )}
                            </Select>
                        </Grid>
                        {/* <Grid item xs={2}>
                            <InputLabel>Assigned To:</InputLabel> 
                            <Select style={{width: "200px", marginBottom: "25px", padding: "10px"}} >
                                <MenuItem key={0} value={0}>All</MenuItem>
                                {assignedList.map((item) => (
                                    <MenuItem
                                        key={item}
                                        value={item}
                                        >{item}</MenuItem>
                                )
                                )}
                            </Select>
                        </Grid> */}
                        <Grid item xs={2} >
                            <div style={{paddingTop: "20px"}}>
                                <Button type="button" text="Add Milestone" size="large" variant="contained" color="primary" onClick={OpenMilestone} disabled={selectedActionItemID == 0 ? true : false}/>
                            </div>
                        </Grid>
                        <Grid item xs={1}>
                            <div style={{paddingTop: "20px"}}>
                                <Button type="button" text="Add Task" size="large" variant="contained" color="primary" onClick={OpenTask} disabled={selectedMilestone == 0 ? true : false}/>
                            </div>
                        </Grid>
                        <Grid xs={12} >
                            <Gantt
                                style={ganttStyle}
                                taskData={processedData}
                                taskModelFields={taskModelFields}
                                dependencyData={[]}
                                dependencyModelFields={dependencyModelFields}
                                columns={columnsState}
                                resizable={true}
                                reorderable={true}
                                sortable={true}
                                sort={dataState.sort}
                                filter={dataState.filter}
                                onColumnResize={onColumnResize}
                                onColumnReorder={onColumnReorder}
                                onExpandChange={onExpandChange}
                                onDataStateChange={onDataStateChange}
                                // onRowClick={onSelect}
                                // onTaskDoubleClick={onEdit}
                                // onRowDoubleClick={onEdit}                                
                                >
                                <GanttWeekView />
                                <GanttMonthView />
                                <GanttYearView />
                            </Gantt>
                        </Grid>
                    </Grid>
                    </CardContent>
                </Card>
                : null }
                <Modal title="Create Milestone" isOpen={milestoneModalOpen} handleClose={CloseMilestoneModal} width="xs" hideFooter={true}>
                    <FormWrapper onSubmit={CreateMilestone} initialValues={initialValues} validationSchema={validateMilestone}>     
                        <div>
                            <InputField type="text"
                                label="Milestone Name"
                                name="MilestoneName"
                                component={Input}
                                required={true}
                                />
                            <InputField type="textarea"
                                label="Description"
                                name="Description"
                                component={Input}
                                required={true}
                                rows={10}
                                />
                            <InputField type="date"
                                label="Start Date"
                                name="StartDate"
                                component={Input}
                                required={true}
                                />
                            <InputField type="date"
                                label="End Date"
                                name="EndDate"
                                component={Input}
                                required={true}
                                />
                        </div>
                        <DialogActions>
                            <Button
                                type="submit"
                                text="Create"
                                variant="contained"
                                size="large"
                                color="primary"
                            />
                            <Button type="button" text="Cancel" size="large" variant="contained" color="secondary" onClick={CloseMilestoneModal} />
                        </DialogActions>   
                    </FormWrapper>             
                </Modal>
                <Modal title="Create Task" isOpen={taskModalOpen} handleClose={CloseTaskModal} width="xs" hideFooter={true}>
                    <FormWrapper onSubmit={CreateTask} initialValues={initialTaskValues} validationSchema={validateTask}>    
                        <div>
                            <InputField type="text"
                                label="Task Name"
                                name="TaskName"
                                component={Input}
                                required={true}
                                />
                            <InputField type="textarea"
                                label="Description"
                                name="Description"
                                component={Input}
                                required={true}
                                rows={10}
                                />
                            <InputField type="date"
                                label="Start Date"
                                name="StartDate"
                                component={Input}
                                required={true}
                                />
                            <InputField type="date"
                                label="End Date"
                                name="EndDate"
                                component={Input}
                                required={true}
                                />
                            <InputField type="text"
                                label="Assigned To"
                                name="AssignedTo"
                                component={Input}
                                required={true}
                                />
                        </div>
                        <DialogActions>
                            <Button
                                type="submit"
                                text="Create"
                                variant="contained"
                                size="large"
                                color="primary"
                            />
                            <Button type="button" text="Cancel" size="large" variant="contained" color="secondary" onClick={CloseTaskModal} />
                        </DialogActions>   
                    </FormWrapper>             
                </Modal>
            </>
        )
    }
    else {
        return (
            <>
                <Card>
                    <CardContent>
                    <div className={classnames("card-header-image",styles.header_bg)}></div>
                    <div>
                      {moduleOverview}
                    </div>
                    
                    </CardContent>
                </Card>
            </>
        )
    }
}

export default Deepen;
