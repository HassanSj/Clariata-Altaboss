import React, {ReactElement} from 'react';
import {Grid, TextField} from "@material-ui/core";
import useDataPagination from "~/ui/hooks/useDataPagination";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import IconButton from "@material-ui/core/IconButton";
import {SortDirection} from "~/ui/constants/data";
import Icon from "@material-ui/core/Icon";
import CardContent from "@material-ui/core/CardContent";
import DataWrapper from "~/ui/components/Data/DataWrapper";
import useMountEvents from "~/ui/hooks/useMountEvents";
import api from "~/services/api";
import {processServerError} from "~/services/api/errors";
import OrganizationMemberListItem from "~/ui/components/Organization/OrganizationMemberListItem";

interface IProps {
    organizationId: number;
}

const OrganizationMemberList = ({ organizationId }: IProps): ReactElement => {
    const [data, setData] = React.useState<any>();

    const {
        searchText,
        sortDirection,
        setSortDirection,
        paginator
    } = useDataPagination(data, 8, 'Username');

    const loadData = async () => {
        try {
            const res = await api.organizationmember.list(organizationId);
            setData(res?.data);
        } catch (err) {
            processServerError(err, 'OrganizationMemberList.loadData');
        }
    }

    useMountEvents({
        onMounted: async () => {
            loadData();
        }
    });

    return (
        <>
            <Card>
                <CardHeader title="Organization Members"
                            action={
                                <>
                                    <Grid container spacing={1}>
                                        <Grid item xs={6}>
                                            <TextField id="standard-basic"
                                                       label="Search"
                                                       placeholder="Search"
                                                       fullWidth={true}
                                                       {...searchText} />
                                        </Grid>
                                        <Grid item xs={6}>
                                            <IconButton color={ sortDirection === SortDirection.ASC ? 'primary' : 'default'}
                                                        onClick={() => setSortDirection(SortDirection.ASC)}>
                                                <Icon>arrow_downward</Icon>
                                            </IconButton>
                                            <IconButton color={ sortDirection === SortDirection.DESC ? 'primary' : 'default'}
                                                        onClick={() => setSortDirection(SortDirection.DESC)}>
                                                <Icon>arrow_upward</Icon>
                                            </IconButton>
                                        </Grid>
                                    </Grid>
                                </>
                            } />
                <CardContent>
                    <DataWrapper isGrouped={false}
                                 paginator={paginator}
                                 propLabel="item"
                                 keyLabel="OrganizationMemberID"
                                 component={OrganizationMemberListItem} />
                </CardContent>
            </Card>
        </>
    )
}

export default OrganizationMemberList;
