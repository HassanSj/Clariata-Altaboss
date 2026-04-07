import React, {ReactElement} from "react";
import {Card, CardContent, CardHeader, Grid} from "@material-ui/core";
import InputField from "~/ui/components/Forms/InputField";
import Input from "~/ui/components/Forms/Input";
import ContactAccordionProps from "~/ui/components/Contact/ContactCard/tabs/accordions/ContactAccordionProps";
import CustomAccordion from "~/ui/components/Containers/CustomAcordion";
import {objectiveYesNoTypes} from "~/ui/constants/objectives";

const DeathAccordion = ({person}:ContactAccordionProps):ReactElement => {
    return (
        <Card>
            <CardHeader title="Death"/>
            <CardContent>
                <Grid container spacing={1}>
                    <Grid item xs={6}>
                        <InputField type="select"
                                    labelField="label"
                                    valueField="value"
                                    items={objectiveYesNoTypes}
                                    name="Deceased"
                                    component={Input}
                                    label="Deceased?"
                                    placeholder="Deceased"/>
                    </Grid>
                    <Grid item xs={6}>
                        { person.Deceased ?
                            <InputField type="datetext" name="DateOfDeath" component={Input} placeholder="Date Of Death" label="Date Of Death" />
                            : null }
                    </Grid>
                </Grid>
                { person.Deceased ?
                    <Grid container spacing={1}>
                        <Grid item xs={6}>
                            <InputField type="text"
                                        name="DeathLocation"
                                        component={Input}
                                        label="Location"
                                        placeholder="Location"/>
                        </Grid>
                        <Grid item xs={6}>
                            <InputField type="text"
                                        name="DeathCause"
                                        component={Input}
                                        label="Cause"
                                        placeholder="Cause"/>
                        </Grid>
                    </Grid>
                    :null}
            </CardContent>
        </Card>
    )
}

export default DeathAccordion