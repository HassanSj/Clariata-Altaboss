import { Button, Card, CardContent, CardHeader, Grid, Icon, IconButton, ListItem, ListItemText, TextField } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import api from '~/services/api';
import { DestinySubcategory } from '~/types/api/destinySubcategory';
import DataWrapper from '~/ui/components/Data/DataWrapper';
import { SortDirection } from '~/ui/constants/data';
import { AdminNavigationTab } from '~/ui/constants/navigations';
import useDataPagination from '~/ui/hooks/useDataPagination';
import AdminWrapper from '../../AdminWrapper';
import styles from './DestinySubcategoryList.module.css';
import { IDataItemEventConfig } from '~/types/data';
import DestinySubcategoryItem from '../DestinySubcategoryItem/DestinySubcategoryItem';

interface DestinySubcategoryListProps {
    data: DestinySubcategory[],
    showAddForm: any,
    showEditForm: any,
    showDelete: any, 
    closeAddForm: any,
    closeEditForm: any,
    closeDelete: any,
}

const DestinySubcategoryList = ({data, showAddForm, showEditForm, showDelete, closeAddForm, closeEditForm, closeDelete} : DestinySubcategoryListProps) => {


    const { searchText, sortDirection, setSortDirection, paginator } = useDataPagination(data, 8, 'Subcategory');

    const close = async ()=> {
      closeAddForm();
    }

    const showSubcategoryAdd = () => {
        showAddForm();
    }

    const showSubcategoryEdit = (id: number) => {
        console.log(id);
        showEditForm(id);
    }

    const eventConfig: IDataItemEventConfig = {
        onRemove: closeDelete,
        onSelect: showSubcategoryEdit
      }

    return (
        <>
            <AdminWrapper tab={AdminNavigationTab.SUBCATEGORIES}>
                <Card>
                <CardHeader
                    title="Destiny Subcategories"
                    action={
                    <>
                    <div>
                        <Grid container spacing={1}>
                        <Grid item xs={2}>
                        </Grid>
                        <Grid item xs={4}>
                            <TextField id="standard-basic" label="Search" placeholder="Search" fullWidth={true} {...searchText} />
                        </Grid>
                        <Grid item xs={6}>
                            <IconButton
                            color={sortDirection === SortDirection.ASC ? 'primary' : 'default'}
                            onClick={() => setSortDirection(SortDirection.ASC)}
                            >
                            <Icon>arrow_downward</Icon>
                            </IconButton>
                            <IconButton
                            color={sortDirection === SortDirection.DESC ? 'primary' : 'default'}
                            onClick={() => setSortDirection(SortDirection.DESC)}
                            >
                            <Icon>arrow_upward</Icon>
                            </IconButton>
                        </Grid>
                        </Grid>
                    </div>
                    </>
                    }
                />
                <CardContent>
                <div style={{marginBottom: "10px" }}>
                        <Grid container spacing={1}>
                        <Grid item xs={2} style={{textAlign: "left" }}>
                        <Button type="button"
                                    variant="contained"
                                    size="medium"
                                    color="primary" onClick={() => showSubcategoryAdd()}>ADD</Button>
                        </Grid>
                        <Grid item xs={10} style={{textAlign: "right" }}></Grid>                        
                        </Grid>
                    </div>
                        
                    <ListItem className={styles.listHeader}>
                    <ListItemText>
                        <Grid container spacing={1}>
                            <Grid item xs={8} className={styles.listAlignment}>
                                Subcategory
                            </Grid>
                        </Grid>
                    </ListItemText>
                    </ListItem>
                    <DataWrapper
                        isGrouped={false}
                        paginator={paginator}
                        propLabel="item"
                        keyLabel="DestinySubcategoryItem"
                        component={DestinySubcategoryItem}
                        componentProps={{editItem: showSubcategoryEdit}}
                    />                    
                </CardContent>
                </Card>
        </AdminWrapper>
        </>
    )
}

export default DestinySubcategoryList;
