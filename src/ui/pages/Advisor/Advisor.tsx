import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import useSWR from 'swr';
import api from '~/services/api';
import { getAccessToken } from '~/services/auth';
import { useStoreActions, useStoreState } from '~/store/hooks';
import { ClientEvaluation } from '~/types/api/clientEvaluation';
import { fetcher } from '~/types/api/fetcher';
import { Household } from '~/types/api/household';

import AdvisorDashboard from "~/ui/components/AdvisorDashboard/AdvisorDashboard";
import Button from '~/ui/components/Button';

const Advisor = () => {

    //const {households} = useStoreState((state) => state.household);
    const householdActions = useStoreActions(actions => actions.household);
    const evalActions = useStoreActions(actions => actions.evaluation);
    const personActions = useStoreActions(actions => actions.person);
    const wizardActions = useStoreActions(actions => actions.wizard);
    const objectiveActions = useStoreActions(actions => actions.objective);
    const interviewActions = useStoreActions(actions => actions.interview);
    const destinyActions = useStoreActions(actions => actions.destiny);
    const userActions = useStoreActions(actions => actions.user);
    const layoutActions = useStoreActions(actions => actions.layout);

    const loadData = async () => {
        console.log("Reload Store");
        await userActions.onPopulate({});
        await householdActions.onPopulate({});
        await evalActions.onPopulate({});
        await personActions.onPopulate({});
        await objectiveActions.onPopulate({});
        await interviewActions.onPopulate({});
        await destinyActions.onPopulate({});
        await wizardActions.onPopulate({});
    }

    // useEffect(() => {
    //     console.log("Household Length");
    //     console.log(households.length);
    //     if(households.length < 1)
    //     {
    //         loadData();
    //     }
    // }, [])

    const handleReload = async () => {
        await loadData();
        window.location.reload();
    }


        return (
            <AdvisorDashboard/>
        )
}

export default Advisor;