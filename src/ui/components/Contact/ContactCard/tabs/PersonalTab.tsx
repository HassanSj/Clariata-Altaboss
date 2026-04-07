import {TabProps} from "~/ui/components/Contact/ContactCard/TabProps";
import React, {ReactElement} from "react";
import AccordionList, {AccordionListItem} from "~/ui/components/Contact/ContactCard/tabs/helpers/AccordionList";
import SurnameAccordion from "~/ui/components/Contact/ContactCard/tabs/accordions/SurnameAccordion";
import BirthAccordion from "~/ui/components/Contact/ContactCard/tabs/accordions/BirthAccordion";
import DeathAccordion from "~/ui/components/Contact/ContactCard/tabs/accordions/DeathAccordion";
import MaritalStatusAccordion from "~/ui/components/Contact/ContactCard/tabs/accordions/MaritalStatusAccordion";
import ReligionAccordion from "~/ui/components/Contact/ContactCard/tabs/accordions/ReligionAccordion";
import OtherPersonalAccordion from "~/ui/components/Contact/ContactCard/tabs/accordions/OtherPersonalAccordion";
import {onlyNonUndefined} from "../../../../../../utils/filter";

const PersonalTab = ({person, isEdit}:TabProps):ReactElement => {
    const accordions = [
        person.GenderID !== 1 ? {
            key: "surname",
            component: SurnameAccordion,
        }: undefined,
        {
            key: "birth",
            component: BirthAccordion
        },
        {
            key: "death",
            component: DeathAccordion
        },
        {
            key: "marriage",
            component: MaritalStatusAccordion
        },
        {
            key: "religion",
            component: ReligionAccordion
        },
        {
            key: "other",
            component: OtherPersonalAccordion
        }
    ]
    return (
        <AccordionList items={accordions.filter(onlyNonUndefined) as AccordionListItem[]} defaultProps={{person}} defaultExpanded={isEdit}/>
    )
}

export default PersonalTab