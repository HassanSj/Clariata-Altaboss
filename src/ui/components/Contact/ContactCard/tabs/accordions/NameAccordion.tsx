import React, {ReactElement} from "react";
import CustomAccordion from "~/ui/components/Containers/CustomAcordion";
import {Card, CardContent, CardHeader, Grid} from "@material-ui/core";
import InputField from "~/ui/components/Forms/InputField";
import Input from "~/ui/components/Forms/Input";
import {PersonType} from "~/ui/constants/api";
import {
    FamilyTitle,
    FamilyTitles, Genders,
    OtherTitle,
    OtherTitles,
    ProfessionalTitle,
    ProfessionalTitles
} from "~/ui/constants/person";
import ContactAccordionProps from "~/ui/components/Contact/ContactCard/tabs/accordions/ContactAccordionProps";

const NameAccordion = ({person}:ContactAccordionProps):ReactElement => {
    /**
     * Get person title options for person type
     */
    const getPersonTitles = () => {
        switch (person?.PersonTypeID){
            case PersonType.FAMILY:
                return FamilyTitles.filter(t => t.value !== FamilyTitle.PRIMARY)
            case PersonType.PROFESSIONAL:
                return ProfessionalTitles
            case PersonType.OTHER:
                return OtherTitles
            default:
                return []
        }
    }

    /**
     * Decide if free text input should be shown
     */
    const showFreePersonTitle = () => {
        if(person?.PersonTypeID === PersonType.PRIMARY)
            return false
        return person?.PersonTitleID === OtherTitle.FREE ||
            person?.PersonTitleID === FamilyTitle.FREE ||
            person?.PersonTitleID === ProfessionalTitle.FREE
    }

    return (
        // <CustomAccordion summary="Name" defaultExpanded={defaultExpanded}>
        <Card>
            {/*<CardHeader title="Name"/>*/}
            <CardContent>
                <Grid container>
                    <Grid container spacing={1}>
                        <Grid item xs={4}>
                            <InputField type="text"
                                        name="FirstName"
                                        component={Input}
                                        placeholder="First Name"
                                        label="First Name"
                                        required={true}/>
                        </Grid>
                        <Grid item xs={4}>
                            <InputField type="text"
                                        name="MiddleName"
                                        component={Input}
                                        placeholder="Middle Name"
                                        label="Middle Name" />
                        </Grid>
                        <Grid item xs={4}>
                            <InputField type="text"
                                        name="LastName"
                                        component={Input}
                                        placeholder="Last Name"
                                        label="Last Name"
                                        required={true}/>
                        </Grid>
                    </Grid>
                    <Grid container spacing={1}>
                        <Grid item xs={6}>
                            <InputField type="text"
                                        name="PreferredName"
                                        component={Input}
                                        placeholder="Preferred Name"
                                        label="Preferred Name" />
                        </Grid>
                        <Grid item xs={6}>
                            {
                                (person?.PersonTypeID !== PersonType.FAMILY)? (
                                    <InputField type="select"
                                                name="PersonTitleID"
                                                component={Input}
                                                placeholder="Contact Title"
                                                label="Contact Title"
                                                items={getPersonTitles()}
                                                labelField="label"
                                                valueField="value" />
                                ) : null
                            }
                        </Grid>
                    </Grid>
                    { showFreePersonTitle() ?
                        <Grid container spacing={1}>
                            <InputField type="text"
                                        name="PersonTitleFree"
                                        component={Input}
                                        placeholder="Contact Title Other"
                                        label="Contact Title Other"/>
                        </Grid>
                    : null }
                    <Grid container spacing={1}>
                        <Grid item xs={4}>
                            <InputField type="select"
                                        name="GenderID"
                                        component={Input}
                                        placeholder="Gender"
                                        label="Gender"
                                        items={Genders}
                                        labelField="label"
                                        valueField="value" />
                        </Grid>
                    </Grid>
                </Grid>
            </CardContent>
        </Card>
    )
}

export default NameAccordion