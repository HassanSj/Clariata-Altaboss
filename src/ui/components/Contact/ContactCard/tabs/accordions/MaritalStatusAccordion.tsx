import React, {ReactElement} from "react";
import {Card, CardContent, CardHeader, Grid} from "@material-ui/core";
import InputField from "~/ui/components/Forms/InputField";
import Input from "~/ui/components/Forms/Input";
import {useStoreState} from "~/store/hooks";
import CustomAccordion from "~/ui/components/Containers/CustomAcordion";
import ContactAccordionProps from "~/ui/components/Contact/ContactCard/tabs/accordions/ContactAccordionProps";
import {MaritalStatus, MaritalStatuses} from "~/ui/constants/person";

const MaritalStatusAccordion = ({person}:ContactAccordionProps):ReactElement => {
    return (
        // <CustomAccordion summary="Marital Status" defaultExpanded={defaultExpanded}>
        <Card>
            <CardHeader title="Marital Status"/>
            <CardContent>
                <Grid container>
                    <Grid container spacing={1}>
                        <Grid item xs={4}>
                            <InputField type="select"
                                        name="MaritalStatusID"
                                        component={Input}
                                        placeholder="Marital Status"
                                        label="Marital Status"
                                        items={MaritalStatuses}
                                        labelField="label"
                                        valueField="value" />
                        </Grid>
                        {person.MaritalStatusID === MaritalStatus.MARRIED ?
                            <Grid item xs={4}>
                                <InputField type="datetext" name="MarriageDate" component={Input}
                                            placeholder="Marriage Date" label="Marriage Date"/>
                            </Grid>
                            : null
                        }
                        {person.MaritalStatusID === MaritalStatus.DIVORCED ?
                            <Grid item xs={4}>
                                <InputField type="datetext" name="DivorcedDate" component={Input}
                                            placeholder="Divorce Date" label="Divorce Date"/>
                            </Grid>
                            : null
                        }
                        {person.MaritalStatusID === MaritalStatus.SEPARATED ?
                            <Grid item xs={4}>
                                <InputField type="datetext" name="SeparatedDate" component={Input}
                                            placeholder="Separated Date" label="Separated Date"/>
                            </Grid>
                            : null
                        }
                        {person.MaritalStatusID === MaritalStatus.WIDOWED ?
                            <Grid item xs={4}>
                                <InputField type="datetext" name="WidowedDate" component={Input}
                                            placeholder="Widowed Date" label="Widowed Date"/>
                            </Grid>
                            : null
                        }
                        <Grid item xs={4}/>
                    </Grid>
                </Grid>
            </CardContent>
        </Card>
    )
}

export default MaritalStatusAccordion