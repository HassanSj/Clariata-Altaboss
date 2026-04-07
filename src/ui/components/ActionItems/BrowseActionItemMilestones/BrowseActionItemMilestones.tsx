import React, {useState} from 'react';
import {Grid, TextField} from "@material-ui/core";
import Card from "@material-ui/core/Card";
import classnames from "classnames";
import styles from "./BrowseActionItemMilestones.module.scss";
import CardHeader from "@material-ui/core/CardHeader";
import IconButton from "@material-ui/core/IconButton";
import Icon from "@material-ui/core/Icon";
import CardContent from "@material-ui/core/CardContent";
import {useStoreState} from "~/store/hooks";
import useUserInput from "~/ui/hooks/useUserInput";
import useSearchable from "~/ui/hooks/useSearchable";
import {SortDirection} from "~/ui/constants/data";
import useSortable from "~/ui/hooks/useSortable";
import usePagination from "~/ui/hooks/usePagination";
import DataWrapper from "~/ui/components/Data/DataWrapper";
import ActionItemMilestoneItem from "~/ui/components/ActionItems/ActionItemMilestoneItem";
import {ActionItemMilestone} from "~/types/api/actionItemMilestone";

const BrowseActionItemMilestones = () => {
  const { selectedActionItem } = useStoreState((state) => state.objective);
  let milestones = selectedActionItem.Milestones;
  if (!milestones) milestones = [];

  // Search and filters.
  const searchText = useUserInput("");
  const searchableItems = useSearchable(
    milestones,
    searchText.value,
    (item: ActionItemMilestone | undefined) => [`${item?.Description}`]
  );

  // Sorting
  const [sortDirection, setSortDirection] = useState(SortDirection.ASC);
  const sortableItems = useSortable(
    searchableItems,
    sortDirection,
    (item: ActionItemMilestone | undefined) => [`${item?.Description}`],
  );

  // Pagination
  const [page, setPage] = useState(1);
  const paginator = usePagination(sortableItems, 8);
  const handleChange = (e: any, p: number) => {
    paginator.jump(p);
  };

  // Drag and drop
  const reorder = (list: any, startIndex: any, endIndex: any) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    return result;
  };

  const onDragEnd = (result: any) => {
    // dropped outside the list
    if (!result.destination) {
      return;
    }

    const items = reorder(
      paginator.currentData(),
      result.source.index,
      result.destination.index
    );

    // TODO - update state
  }


  return (
    <>
      <Grid container spacing={1}>
        <Grid item xs={12}>
          <Card className={classnames(styles.root)}>
            <CardHeader title={
              <>
                <TextField id="standard-basic"
                           label="Search"
                           placeholder="Search"
                           fullWidth={true}
                           {...searchText} />
              </>
            }
                        action={
                          <>
                            <IconButton color={ sortDirection === SortDirection.ASC ? 'primary' : 'default'}
                                        onClick={() => setSortDirection(SortDirection.ASC)}>
                              <Icon>arrow_downward</Icon>
                            </IconButton>
                            <IconButton color={ sortDirection === SortDirection.DESC ? 'primary' : 'default'}
                                        onClick={() => setSortDirection(SortDirection.DESC)}>
                              <Icon>arrow_upward</Icon>
                            </IconButton>
                          </>
                        } />
            <CardContent>
              <div>
                <Grid container spacing={1}>
                  <Grid item xs={6}>

                  </Grid>
                </Grid>
              </div>
            </CardContent>
          </Card>
          <DataWrapper isGrouped={false}
                       paginator={paginator}
                       propLabel="item"
                       keyLabel="ActionItemMilestoneID"
                       component={ActionItemMilestoneItem} />
        </Grid>
      </Grid>
    </>
  );
};

export default BrowseActionItemMilestones;
