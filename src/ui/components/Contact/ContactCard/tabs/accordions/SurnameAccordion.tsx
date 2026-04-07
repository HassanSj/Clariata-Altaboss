import React, {ReactElement} from "react";
import CustomAccordion from "~/ui/components/Containers/CustomAcordion";
import {Card, CardContent, CardHeader, Grid} from "@material-ui/core";
import InputField from "~/ui/components/Forms/InputField";
import Input from "~/ui/components/Forms/Input";
import ContactAccordionProps from "~/ui/components/Contact/ContactCard/tabs/accordions/ContactAccordionProps";

const SurnameAccordion = ():ReactElement => {
    return (
        <Card>
            <CardHeader title="Original Surname"/>
            <CardContent>
                <Grid container>
                    <Grid container>
                        <Grid item xs={12}>
                            <InputField type="text"
                                        name="OriginalSurname"
                                        component={Input}
                                        placeholder="Original Surname"
                                        label="Original Surname" />
                        </Grid>
                    </Grid>
                </Grid>
            </CardContent>
        </Card>
    )
}

export default SurnameAccordion