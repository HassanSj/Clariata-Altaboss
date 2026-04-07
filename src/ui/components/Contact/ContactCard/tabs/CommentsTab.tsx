import React, {ReactElement} from "react";
import CardHeader from "@material-ui/core/CardHeader";
import CardContent from "@material-ui/core/CardContent";
import CommentList from "~/ui/components/Contact/CommentList";
import Card from "@material-ui/core/Card";
import {useStoreState} from "~/store/hooks";
import {OwnerType} from "~/ui/constants/api";

interface IProp{
    ownerType: OwnerType
}
/**
 * Tab presenting comments
 * @constructor
 */
const CommentsTab = ({ownerType}:IProp): ReactElement => {
    //const { selectedPerson } = useStoreState(state => state.person);
    const { contactId } = useStoreState(state => state.selected)

    return (
        <Card>
            <CardHeader title="Comments"
                        titleTypographyProps={{'variant': 'h6'}} />
            <CardContent>
                <CommentList ownerType={ownerType} ownerId={contactId} />
            </CardContent>
        </Card>
    )
}

export default CommentsTab