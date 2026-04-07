import React, {ReactElement} from "react";
import CustomAccordion from "~/ui/components/Containers/CustomAcordion";
import Input from "~/ui/components/Forms/Input";
import {PersonTypes} from "~/ui/constants/person";
import InputField from "~/ui/components/Forms/InputField";
import {PersonType} from "~/ui/constants/api";
import ContactAccordionProps from "~/ui/components/Contact/ContactCard/tabs/accordions/ContactAccordionProps";
import {Card, CardContent, CardHeader, Grid} from "@material-ui/core";


const ContactTypeAccordion = ({person,defaultExpanded}:ContactAccordionProps): ReactElement => {
    // <CustomAccordion summary="Contact Type" defaultExpanded={defaultExpanded}>
    return (
        <Card>
            <CardHeader title="Contact Type"/>
            <CardContent>
                { person.PersonTypeID === PersonType.PRIMARY ?
                    (
                        <InputField type="select"
                                    name="PersonTypeID"
                                    component={Input}
                                    placeholder="Contact Type"
                                    label="Contact Type"
                                    required={true}
                                    disabled={true}
                                    items={PersonTypes.filter(t => t.value === PersonType.PRIMARY)}
                                    labelField="label"
                                    valueField="value" />
                    ) :
                    (
                        <InputField type="select"
                                    name="PersonTypeID"
                                    component={Input}
                                    placeholder="Contact Type"
                                    label="Contact Type"
                                    required={true}
                                    items={PersonTypes.filter(t => t.value !== PersonType.PRIMARY)}
                                    labelField="label"
                                    valueField="value" />
                    )
                }
            </CardContent>
        </Card>
    )
}

export default ContactTypeAccordion