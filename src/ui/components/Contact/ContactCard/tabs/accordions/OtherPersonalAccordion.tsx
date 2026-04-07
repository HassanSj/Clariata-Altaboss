import React, {ReactElement} from "react";
import {Card, CardContent, Grid} from "@material-ui/core";
import InputField from "~/ui/components/Forms/InputField";
import Input from "~/ui/components/Forms/Input";

const OtherPersonalAccordion = ():ReactElement => {
    return (
        <Card>
            <CardContent>
                <Grid container spacing={1}>
                    <Grid item xs={12}>
                        <InputField
                            type="textarea"
                            name="Hobbies"
                            component={Input}
                            placeholder="Current Activities and Hobbies"
                            label="Current Activities and Hobbies" />
                    </Grid>
                </Grid>
            </CardContent>
        </Card>
    )
}

export default OtherPersonalAccordion