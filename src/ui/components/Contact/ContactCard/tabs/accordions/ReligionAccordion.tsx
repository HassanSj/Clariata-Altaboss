import React, {ReactElement} from "react";
import CustomAccordion from "~/ui/components/Containers/CustomAcordion";
import {Card, CardContent, CardHeader, Grid} from "@material-ui/core";
import InputField from "~/ui/components/Forms/InputField";
import Input from "~/ui/components/Forms/Input";
import ContactAccordionProps from "~/ui/components/Contact/ContactCard/tabs/accordions/ContactAccordionProps";

const ReligionAccordion = ():ReactElement => {
    return (
        // <CustomAccordion summary="Religious Affiliation" defaultExpanded={defaultExpanded}>
        <Card>
            <CardHeader title="Religious Affiliation"/>
            <CardContent>
                <Grid container spacing={1}>
                    <Grid item xs={4}>
                        <InputField type="text" name="ReligiousAffiliation" component={Input} placeholder="Religious Affiliation" label="Religious Affiliation" />
                    </Grid>
                </Grid>
            </CardContent>
        </Card>
    )
}

export default ReligionAccordion