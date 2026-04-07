import {IDataTableView} from "~/types/data";
import {Box, Button, ButtonGroup, Grid} from "@material-ui/core";
import React from "react";
import {Alert} from "@material-ui/lab";


interface IProps {
  views: IDataTableView[] | undefined;
  selected: IDataTableView | undefined;
  onSelect: (view: IDataTableView) => any;
}

const DataTableViews = ({views, selected, onSelect}: IProps) => {
  return (
    <>
      <Grid container spacing={1}>
        {(views && views?.length < 4) ? <Grid item xs={1}></Grid> : null}
        <Grid container item xs={(views && views?.length < 4) ? 10 : 12} alignContent="center">
          <ButtonGroup disableElevation color="default" variant="text" fullWidth>
            {views?.map((view: any, index: number) => {
              return (
                <Button key={index}
                        onClick={() => onSelect(view)}
                        color={selected?.id === view?.id ? 'primary' : undefined}
                        variant={selected?.id === view?.id ? 'contained' : 'text'}
                        size="large">
                  {view.name}
                </Button>
              )
            })}
          </ButtonGroup>
        </Grid>
        {(views && views?.length < 4) ? <Grid item xs={1}></Grid> : null}
      </Grid>
      {selected?.description ?
        <Box mt={3} mb={3}>
          <Alert severity="info" >
            <span dangerouslySetInnerHTML={{ __html: selected?.description ?? ""}}/>
          </Alert>
        </Box>
        : null}
    </>
  )
}

export default DataTableViews;