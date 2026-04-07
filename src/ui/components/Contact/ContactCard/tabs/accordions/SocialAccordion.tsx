import React, {ReactElement} from "react";
import CustomAccordion from "~/ui/components/Containers/CustomAcordion";
import {Card, CardContent, CardHeader, Grid} from "@material-ui/core";
import InputField from "~/ui/components/Forms/InputField";
import Input from "~/ui/components/Forms/Input";

const SocialAccordion = ():ReactElement => {
    return (
        <Card>
            <CardHeader title="Social"/>
            <CardContent>
                <Grid container>
                    <Grid container spacing={1}>
                        <Grid item xs={6}>
                            <InputField type="text" name="LinkedIn" component={Input} label="LinkedIn" />
                        </Grid>
                        <Grid item xs={6}>
                            <InputField type="text" name="Facebook" component={Input} label="Facebook" />
                        </Grid>
                        <Grid item xs={6}>
                            <InputField type="text" name="Twitter" component={Input} label="Twitter" />
                        </Grid>
                        <Grid item xs={6}>
                            <InputField type="text" name="Instagram" component={Input} label="Instagram" />
                        </Grid>
                    </Grid>
                </Grid>
            </CardContent>
        </Card>
    )
}

export default SocialAccordion;