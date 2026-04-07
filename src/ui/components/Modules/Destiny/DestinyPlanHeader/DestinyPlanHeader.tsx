import React, { useState } from 'react';
import { Grid, ListItem, ListItemText, MenuItem, OutlinedInput, Select } from '@material-ui/core';
import Button from '~/ui/components/Button';
import { Person } from '~/types/api/person';
import { DevelopmentPlan } from '~/types/api/developmentPlan';
import InputField from '~/ui/components/Forms/InputField';
import Input from '~/ui/components/Forms/Input';
import moment from 'moment';

interface DestinyPanHeaderProps {
    plan?: DevelopmentPlan;
    familyName?: string;
    familyMembers?: (Person | undefined)[];
    selectedFamilyMemberId?: number;
    onChange: any;
}

const DestinyPlanHeader = ( {plan, familyName, familyMembers, selectedFamilyMemberId, onChange} : DestinyPanHeaderProps) => {
    const[familyMember , setFamilyMember] = useState<string[]>([]);
    const changeFamilyMember = () => {
        const familyMembersToNumber = familyMember?.map((fam:string) => {
            return Number(fam);
        })
        onChange(familyMembersToNumber);
    }
    const handleSelectPersonChange = (e: any) => {
        const {
          target: { value },
        } = e;
        setFamilyMember(typeof value === 'string' ? value.split(',') : value);
        console.log("Family Members :", familyMember)
      };
    if(plan && plan?.Year > 0) {
        return (
          <>
            <div style={{marginBottom:"10px"}}>
              <div style={{ marginRight: '25px', fontSize: '20px' }}>
                {familyName} -{' '}
                {plan
                  ? plan.PlanName +
                    ' (' +
                    moment(plan.PlanStartDate).format('MM/DD/YYYY') +
                    ' - ' +
                    moment(plan.PlanEndDate).format('MM/DD/YYYY') +
                    ')'
                  : 'Plan not Selected'}
              </div>
              <div>
                {/* <InputField type="select"
                                        name="FamilyMember"
                                        component={Input}
                                        placeholder="Family Member"
                                        label="Family Member"
                                        items={familyMembers}
                                        labelField="firstName"
                                        valueField="PersonID" /> */}
                <span style={{marginRight:"10px"}}> Family Member </span>
                <Select
                  labelId="demo-mutiple-checkbox-label"
                  id="demo-mutiple-checkbox"
                  multiple
                  fullWidth={false}
                  style={{ height: '60px' }}
                  label="Please select a family member"
                  onChange={handleSelectPersonChange}
                  MenuProps={{
                    anchorOrigin: {
                      vertical: 'bottom',
                      horizontal: 'left',
                    },
                    transformOrigin: {
                      vertical: 'top',
                      horizontal: 'left',
                    },
                    getContentAnchorEl: null,
                  }}
                  value={familyMember}
                  name="ChecklistItemReport"
                  input={<OutlinedInput label="Tag" />}
                  renderValue={(selected: any) => {
                    return `${selected?.length} Member(s) selected`;
                  }}
                >
                  {/* <Select value={selectedFamilyMemberId} onChange={event => {
                            changeFamilyMember(event.target.value)}
                            } style={{ padding: "5px 10px", borderRadius: "2px"}}> */}
                  <MenuItem value="-1">-- Please Select a Family Member -- </MenuItem>
                  <MenuItem value="0">All Family Members</MenuItem>
                  {familyMembers?.map(familyMember => {
                    return (
                      <MenuItem value={familyMember?.PersonID} >
                     
                        {familyMember?.FirstName} {familyMember?.LastName}
                      </MenuItem>
                    );
                  })}
                </Select>
                <span style={{marginLeft: "10px"}}>
                    <Button
                    type="button"
                    text={`Add People`}
                    variant="contained"
                    size="medium"
                    color="primary"
                    onClick={() => {
                        changeFamilyMember()
                    }}
                    />
                </span>
              </div>
            </div>
          </>
        );
    }
    else
    {
        return (
            <></>
        )        
    }
                    
}

export default DestinyPlanHeader;