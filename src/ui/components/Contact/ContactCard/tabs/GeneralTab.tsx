import React, {ReactElement} from "react";
import { Grid} from "@material-ui/core";
import {TabData, TabProps} from "~/ui/components/Contact/ContactCard/TabProps";
import ContactTypeAccordion from "~/ui/components/Contact/ContactCard/tabs/accordions/ContactTypeAccordion";
import NameAccordion from "~/ui/components/Contact/ContactCard/tabs/accordions/NameAccordion";
import PhotoAccordion from "~/ui/components/Contact/ContactCard/tabs/accordions/PhotoAccordion";
import ContactAccordion from "~/ui/components/Contact/ContactCard/tabs/accordions/ContactAccordion";
import AccordionList from "~/ui/components/Contact/ContactCard/tabs/helpers/AccordionList";
import SocialAccordion from "./accordions/SocialAccordion";


interface IProps extends TabProps{
    hideAvatar?:boolean,
    setShowDeleteConfirmation: (value: boolean) => unknown
}

/**
 * Tab of contact card that shows personal information
 * @constructor
 */
const GeneralTab = ({person,personEntity,toggleEditModal, isEdit}:IProps): ReactElement => {
    const accordions = [
        {
            key: "contact_type",
            component: ContactTypeAccordion
        },
        {
            key: "name",
            component: NameAccordion,
        },
        {
            key: "contact",
            component: ContactAccordion,
            props: {
                showEditModal:toggleEditModal
            }
        },
        {
            key: "social",
            component: SocialAccordion
        },
        // {
        //     key: "photo",
        //     component: PhotoAccordion,
        //     props: {
        //         toggleEditModal
        //     }
        // }
    ]
    return (
        <AccordionList items={accordions} defaultProps={{person,personEntity}} defaultExpanded={isEdit}/>
    )
}

export default GeneralTab