import React, {ReactElement} from "react";
import CustomAccordion from "~/ui/components/Containers/CustomAcordion";
import {Card, CardContent, CardHeader, Grid} from "@material-ui/core";
import InputField from "~/ui/components/Forms/InputField";
import Input from "~/ui/components/Forms/Input";
import ContactAccordionProps from "~/ui/components/Contact/ContactCard/tabs/accordions/ContactAccordionProps";

const BirthAccordion = ():ReactElement => {
    return (
        <Card>
            <CardHeader title="Birth"/>
            <CardContent>
                <Grid container>
                    <Grid container spacing={1}>
                        <Grid item xs={6}>
                            <InputField type="datetext" name="DateOfBirth" component={Input} placeholder="Date Of Birth" label="Date Of Birth" />
                        </Grid>
                        <Grid item xs={6}>
                            <InputField type="text" name="Birthplace" component={Input} placeholder="Birthplace" label="Birthplace" />
                        </Grid>
                    </Grid>
                </Grid>
            </CardContent>
        </Card>
    )
}

export default BirthAccordion