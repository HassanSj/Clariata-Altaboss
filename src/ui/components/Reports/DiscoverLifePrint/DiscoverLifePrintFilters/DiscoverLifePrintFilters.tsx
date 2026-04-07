import { Button, Checkbox, Divider, FormControlLabel, Grid } from "@material-ui/core"
import moment from "moment";
import React from "react";
import { useStoreState } from "~/store/hooks";

import SelectDate from "~/ui/components/Forms/SelectDate"
import { TimelineFilters } from "../../TimelineReport/TimelineReport";

import DiscoverLifePrint, { getDiscoverLifePrintData } from "~/ui/components/Reports/DiscoverLifePrint/DiscoverLifePrint";
import { CustomFilter } from "~/ui/components/Timeline/TimelineReport";

interface IProps {
    processDiscoverReport: any
}

const DiscoverLifePrintFilters = ({processDiscoverReport} : IProps) => {

    const [includePrimary, setIncludePrimary] = React.useState<boolean>(true);
    const [includePrimaryBirth, setIncludePrimaryBirth] = React.useState<boolean>(true);
    const [includePrimaryDeath, setIncludePrimaryDeath] = React.useState<boolean>(true);
    const [includePrimaryMarriage, setIncludePrimaryMarriage] = React.useState<boolean>(true);
    const [includePrimaryEducation, setIncludePrimaryEducation] = React.useState<boolean>(true);
    const [includePrimaryWork, setIncludePrimaryWork] = React.useState<boolean>(true);
    const [includeParents, setIncludeParents] = React.useState<boolean>(true);
    const [includeParentsBirth, setIncludeParentsBirth] = React.useState<boolean>(true);
    const [includeParentsDeath, setIncludeParentsDeath] = React.useState<boolean>(true);
    const [includeParentsMarriage, setIncludeParentsMarriage] = React.useState<boolean>(true);
    const [includeParentsEducation, setIncludeParentsEducation] = React.useState<boolean>(true);
    const [includeParentsWork, setIncludeParentsWork] = React.useState<boolean>(true);
    const [includeGrandparents, setIncludeGrandparents] = React.useState<boolean>(true);
    const [includeGrandparentsBirth, setIncludeGrandparentsBirth] = React.useState<boolean>(true);
    const [includeGrandparentsDeath, setIncludeGrandparentsDeath] = React.useState<boolean>(true);
    const [includeGrandparentsMarriage, setIncludeGrandparentsMarriage] = React.useState<boolean>(true);
    const [includeGrandparentsEducation, setIncludeGrandparentsEducation] = React.useState<boolean>(true);
    const [includeGrandparentsWork, setIncludeGrandparentsWork] = React.useState<boolean>(true);
    const [includeChildren, setIncludeChildren] = React.useState<boolean>(true);
    const [includeChildrenBirth, setIncludeChildrenBirth] = React.useState<boolean>(true);
    const [includeChildrenDeath, setIncludeChildrenDeath] = React.useState<boolean>(true);
    const [includeChildrenMarriage, setIncludeChildrenMarriage] = React.useState<boolean>(true);
    const [includeChildrenEducation, setIncludeChildrenEducation] = React.useState<boolean>(true);
    const [includeChildrenWork, setIncludeChildrenWork] = React.useState<boolean>(true);
    const [includeGrandchildren, setIncludeGrandchildren] = React.useState<boolean>(true);
    const [includeGrandchildrenBirth, setIncludeGrandchildrenBirth] = React.useState<boolean>(true);
    const [includeGrandchildrenDeath, setIncludeGrandchildrenDeath] = React.useState<boolean>(true);
    const [includeGrandchildrenMarriage, setIncludeGrandchildrenMarriage] = React.useState<boolean>(true);
    const [includeGrandchildrenEducation, setIncludeGrandchildrenEducation] = React.useState<boolean>(true);
    const [includeGrandchildrenWork, setIncludeGrandchildrenWork] = React.useState<boolean>(true);
    const [includeCustom, setIncludeCustom] = React.useState<boolean>(true);

    const timelineFilter: TimelineFilters = {
        personType: "",
        includeBirth: true,
        includeDeath: true,
        includeMarriage: true,
        includeEducation: true,
        includeWorkHistory: true,
    }

    const [primaryFilter, setPrimaryFilter] = React.useState<TimelineFilters>(timelineFilter);
    const [grandParentFilter, setGrandParentFilter] = React.useState<TimelineFilters>(timelineFilter);
    const [parentFilter, setParentFilter] = React.useState<TimelineFilters>(timelineFilter);
    const [childrenFilter, setChildrenFilter] = React.useState<TimelineFilters>(timelineFilter);
    const [grandchildrenFilter, setGrandchildrenFilter] = React.useState<TimelineFilters>(timelineFilter);

    const [includeEmigration, setIncludeEmigration] = React.useState(true);
    const [includeHouse, setIncludeHouse] = React.useState(true);
    const [includeVacation, setIncludeVacation] = React.useState(true);
    const [includeHoliday, setIncludeHoliday] = React.useState(true);
    const [includePhilanthropy, setIncludePhilanthropy] = React.useState(true);
    const [includeAward, setIncludeAward] = React.useState(true);
    const [includeMilitary, setIncludeMilitary] = React.useState(true);
    const [includeBlackSwan, setIncludeBlackSwan] = React.useState(true);
    const [includeOther, setIncludeOther] = React.useState(true);


    const { householdId } = useStoreState(state => state.selected);

    const customFilter: CustomFilter = {
        includeEmigration: true,
        includeHouse: true,
        includeVacation: true,
        includeHoliday: true,
        includePhilanthropy: true,
        includeAward: true,
        includeMilitary: true,
        includeBlackSwan: true,
        includeOther: true
    };

    let newDate = new Date();
    let beginDate = moment(newDate).subtract(100, 'year').toDate();
    let begin = beginDate.toLocaleString();
    let end = newDate;

    const [startYear, setStartYear] = React.useState<Date>(beginDate);
    const [endYear, setEndYear] = React.useState<Date>(end);

    const changeYear = (target: Date) => {
        setStartYear(target)
    }

  const selectPrimary = (primaryStatus: Boolean) => {
    const status = primaryStatus ? false : true;
    setIncludePrimary(status);
    setIncludePrimaryBirth(status);
    setIncludePrimaryDeath(status);
    setIncludePrimaryMarriage(status);
    setIncludePrimaryEducation(status);
    setIncludePrimaryWork(status);
  };

  const selectChildren = (childrenStatus: Boolean) => {
    const status = childrenStatus ? false : true;
    setIncludeChildren(status);
    setIncludeChildrenBirth(status);
    setIncludeChildrenDeath(status);
    setIncludeChildrenMarriage(status);
    setIncludeChildrenEducation(status);
    setIncludeChildrenWork(status);
  };

  const selectParents = (parentStatus: Boolean) => {
    const status = parentStatus ? false : true;
    setIncludeParents(status);
    setIncludeParentsBirth(status);
    setIncludeParentsDeath(status);
    setIncludeParentsMarriage(status);
    setIncludeParentsEducation(status);
    setIncludeParentsWork(status);
  };

  const selectGrandparents = (grandparentStatus: Boolean) => {
    const status = grandparentStatus ? false : true;
    setIncludeGrandparents(status);
    setIncludeGrandparentsBirth(status);
    setIncludeGrandparentsDeath(status);
    setIncludeGrandparentsMarriage(status);
    setIncludeGrandparentsEducation(status);
    setIncludeGrandparentsWork(status);
  };

  const selectGrandchilren = (grandchilrenStatus: Boolean) => {
    const status = grandchilrenStatus ? false : true;
    setIncludeGrandchildren(status);
    setIncludeGrandchildrenBirth(status);
    setIncludeGrandchildrenDeath(status);
    setIncludeGrandchildrenMarriage(status);
    setIncludeGrandchildrenEducation(status);
    setIncludeGrandchildrenWork(status);
  };

  const selectCustom = (customStatus: Boolean) => {
    const status = customStatus ? false : true;
    setIncludeCustom(status);
    setIncludeEmigration(status);
    setIncludeHouse(status);
    setIncludeVacation(status);
    setIncludeHoliday(status);
    setIncludePhilanthropy(status);
    setIncludeAward(status);
    setIncludeMilitary(status);
    setIncludeBlackSwan(status);
    setIncludeOther(status);
  };

  const handleClose = () => {
    setIncludePrimary(false);
    setIncludePrimaryBirth(false);
    setIncludePrimaryDeath(false);
    setIncludePrimaryMarriage(false);
    setIncludePrimaryEducation(false);
    setIncludePrimaryWork(false);

    setIncludeParents(false);
    setIncludeParentsBirth(false);
    setIncludeParentsDeath(false);
    setIncludeParentsMarriage(false);
    setIncludeParentsEducation(false);
    setIncludeParentsWork(false);

    setIncludeGrandparents(false);
    setIncludeGrandparentsBirth(false);
    setIncludeGrandparentsDeath(false);
    setIncludeGrandparentsMarriage(false);
    setIncludeGrandparentsEducation(false);
    setIncludeGrandparentsWork(false);

    setIncludeChildren(false);
    setIncludeChildrenBirth(false);
    setIncludeChildrenDeath(false);
    setIncludeChildrenMarriage(false);
    setIncludeChildrenEducation(false);
    setIncludeChildrenWork(false);

    setIncludeGrandchildren(false);
    setIncludeGrandchildrenBirth(false);
    setIncludeGrandchildrenDeath(false);
    setIncludeGrandchildrenMarriage(false);
    setIncludeGrandchildrenEducation(false);
    setIncludeGrandchildrenWork(false);

    setIncludeEmigration(false);
    setIncludeHouse(false);
    setIncludeVacation(false);
    setIncludeHoliday(false);
    setIncludePhilanthropy(false);
    setIncludeAward(false);
    setIncludeMilitary(false);
    setIncludeBlackSwan(false);
    setIncludeOther(false);
    // onClose();
  };

const displayDiscoverLifePrint = async () => {

    const filters: TimelineFilters[] = [];

    if (includePrimary) {
      const primaryFilter: TimelineFilters = {
        personType: 'Primary',
        includeBirth: includePrimaryBirth,
        includeDeath: includePrimaryDeath,
        includeMarriage: includePrimaryMarriage,
        includeEducation: includePrimaryEducation,
        includeWorkHistory: includePrimaryWork,
      };
      filters.push(primaryFilter);
    }

    if (includeParents) {
      const parentFilter: TimelineFilters = {
        personType: 'Parents',
        includeBirth: includeParentsBirth,
        includeDeath: includeParentsDeath,
        includeMarriage: includeParentsMarriage,
        includeEducation: includeParentsEducation,
        includeWorkHistory: includeParentsWork,
      };
      filters.push(parentFilter);
    }

    if (includeChildren) {
      const childrenFilter: TimelineFilters = {
        personType: 'Children',
        includeBirth: includeChildrenBirth,
        includeDeath: includeChildrenDeath,
        includeMarriage: includeChildrenMarriage,
        includeEducation: includeChildrenEducation,
        includeWorkHistory: includeChildrenWork,
      };
      filters.push(childrenFilter);
    }

    if (includeGrandchildren) {
      const grandchildrenFilter: TimelineFilters = {
        personType: 'Grandchildren',
        includeBirth: includeGrandchildrenBirth,
        includeDeath: includeGrandchildrenDeath,
        includeMarriage: includeGrandchildrenMarriage,
        includeEducation: includeGrandchildrenEducation,
        includeWorkHistory: includeGrandchildrenWork,
      };
      filters.push(grandchildrenFilter);
    }

    if (includeGrandparents) {
      const grandparentFilter: TimelineFilters = {
        personType: 'Grandparents',
        includeBirth: includeGrandparentsBirth,
        includeDeath: includeGrandparentsDeath,
        includeMarriage: includeGrandparentsMarriage,
        includeEducation: includeGrandparentsEducation,
        includeWorkHistory: includeGrandparentsWork,
      };
      filters.push(grandparentFilter);
    }

    customFilter.includeEmigration = includeEmigration;
    customFilter.includeHouse = includeHouse;
    customFilter.includeVacation = includeVacation;
    customFilter.includeHoliday = includeHoliday;
    customFilter.includeMilitary = includeMilitary;
    customFilter.includeAward = includeAward;
    customFilter.includePhilanthropy = includePhilanthropy;
    customFilter.includeBlackSwan = includeBlackSwan;
    customFilter.includeOther = includeOther;

    //discoverInterviewId: number, discoverStartDate: Date, discoverEndDate: Date, includeCustom: boolean, filters: TimelineFilters[]
    processDiscoverReport(startYear, endYear, filters, customFilter);
}

    return (
        <>
        <div>
          <Grid container spacing={1} style={{ borderRadius: '17px', justifyContent: 'center' }}>
            <Grid item container spacing={1}>
              <Grid item xs={12}>
                <div style={{ textAlign: 'center' }}>
                  <h3>Please select the data that will be included on the timeline:</h3>
                </div>
              </Grid>
            </Grid>
            <Grid>
              <Grid container item spacing={1}>
                <Grid item xs={1}>
                </Grid>
                <Grid item xs={2}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={includePrimary}
                        onChange={() => {
                          selectPrimary(includePrimary);
                        }}
                      />
                    }
                    label="Include Primary"
                  />
                  {includePrimary ? (
                    <div>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={includePrimaryBirth}
                            onChange={() => {
                              setIncludePrimaryBirth(!includePrimaryBirth);
                            }}
                          />
                        }
                        label="Include Birth"
                      />
                      <br />
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={includePrimaryDeath}
                            onChange={() => {
                              setIncludePrimaryDeath(!includePrimaryDeath);
                            }}
                          />
                        }
                        label="Include Death"
                      />
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={includePrimaryMarriage}
                            onChange={() => {
                              setIncludePrimaryMarriage(!includePrimaryMarriage);
                            }}
                          />
                        }
                        label="Include Marriage"
                      />
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={includePrimaryEducation}
                            onChange={() => {
                              setIncludePrimaryEducation(!includePrimaryEducation);
                            }}
                          />
                        }
                        label="Include Education"
                      />
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={includePrimaryWork}
                            onChange={() => {
                              setIncludePrimaryWork(!includePrimaryWork);
                            }}
                          />
                        }
                        label="Include Work History"
                      />
                    </div>
                  ) : null}
                </Grid>
                <Grid item xs={2}>
                  <FormControlLabel
                    control={<Checkbox checked={includeChildren} onChange={() => selectChildren(includeChildren)} />}
                    label="Include Children"
                  />
                  {includeChildren ? (
                    <div>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={includeChildrenBirth}
                            onChange={() => {
                              setIncludeChildrenBirth(!includeChildrenBirth);
                            }}
                          />
                        }
                        label="Include Birth"
                      />
                      <br />
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={includeChildrenDeath}
                            onChange={() => {
                              setIncludeChildrenDeath(!includeChildrenDeath);
                            }}
                          />
                        }
                        label="Include Death"
                      />
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={includeChildrenMarriage}
                            onChange={() => {
                              setIncludeChildrenMarriage(!includeChildrenMarriage);
                            }}
                          />
                        }
                        label="Include Marriage"
                      />
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={includeChildrenEducation}
                            onChange={() => {
                              setIncludeChildrenEducation(!includeChildrenEducation);
                            }}
                          />
                        }
                        label="Include Education"
                      />
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={includeChildrenWork}
                            onChange={() => {
                              setIncludeChildrenWork(!includeChildrenWork);
                            }}
                          />
                        }
                        label="Include Work History"
                      />
                    </div>
                  ) : null}
                </Grid>
                <Grid item xs={2}>
                  <FormControlLabel
                    control={<Checkbox checked={includeParents} onChange={() => selectParents(includeParents)} />}
                    label="Include Parents"
                  />
                  {includeParents ? (
                    <div>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={includeParentsBirth}
                            onChange={() => {
                              setIncludeParentsBirth(!includeParentsBirth);
                            }}
                          />
                        }
                        label="Include Birth"
                      />
                      <br />
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={includeParentsDeath}
                            onChange={() => {
                              setIncludeParentsDeath(!includeParentsDeath);
                            }}
                          />
                        }
                        label="Include Death"
                      />
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={includeParentsMarriage}
                            onChange={() => {
                              setIncludeParentsMarriage(!includeParentsMarriage);
                            }}
                          />
                        }
                        label="Include Marriage"
                      />
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={includeParentsEducation}
                            onChange={() => {
                              setIncludeParentsEducation(!includeParentsEducation);
                            }}
                          />
                        }
                        label="Include Education"
                      />
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={includeParentsWork}
                            onChange={() => {
                              setIncludeParentsWork(!includeParentsWork);
                            }}
                          />
                        }
                        label="Include Work History"
                      />
                    </div>
                  ) : null}
                </Grid>
                <Grid item xs={2}>
                    <SelectDate
                      type="year"
                      label="Year From"
                      field={{ value: startYear }}
                      onChange={(e: { target: { value: any } }) => {
                        setStartYear(e.target.value);
                      }}
                    />
                    <SelectDate
                      type="year"
                      label="Year To"
                      field={{ value: endYear }}
                      onChange={(e: { target: { value: any } }) => {
                        setEndYear(e.target.value);
                      }}
                    />
                </Grid>
              </Grid>
              <Divider light style={{marginTop:"35px"}}/>
              <Grid container item spacing={1}>
                <Grid item xs={1}>
                </Grid>
                <Grid item xs={2}>
                  <FormControlLabel
                    control={
                      <Checkbox checked={includeGrandparents} onChange={() => selectGrandparents(includeGrandparents)} />
                    }
                    label="Include Grandparents"
                  />
                  {includeGrandparents ? (
                    <div>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={includeGrandparentsBirth}
                            onChange={() => {
                              setIncludeGrandparentsBirth(!includeGrandparentsBirth);
                            }}
                          />
                        }
                        label="Include Birth"
                      />
                      <br />
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={includeGrandparentsDeath}
                            onChange={() => {
                              setIncludeGrandparentsDeath(!includeGrandparentsDeath);
                            }}
                          />
                        }
                        label="Include Death"
                      />
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={includeGrandparentsMarriage}
                            onChange={() => {
                              setIncludeGrandparentsMarriage(!includeGrandparentsMarriage);
                            }}
                          />
                        }
                        label="Include Marriage"
                      />
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={includeGrandparentsEducation}
                            onChange={() => {
                              setIncludeGrandparentsEducation(!includeGrandparentsEducation);
                            }}
                          />
                        }
                        label="Include Education"
                      />
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={includeGrandparentsWork}
                            onChange={() => {
                              setIncludeGrandparentsWork(!includeGrandparentsWork);
                            }}
                          />
                        }
                        label="Include Work History"
                      />
                    </div>
                  ) : null}
                </Grid>
                <Grid item xs={2}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={includeGrandchildren}
                        onChange={() => selectGrandchilren(includeGrandchildren)}
                      />
                    }
                    label="Include Grandchildren"
                  />
                  {includeGrandchildren ? (
                    <div>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={includeGrandchildrenBirth}
                            onChange={() => {
                              setIncludeGrandchildrenBirth(!includeGrandchildrenBirth);
                            }}
                          />
                        }
                        label="Include Birth"
                      />
                      <br />
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={includeGrandchildrenDeath}
                            onChange={() => {
                              setIncludeGrandchildrenDeath(!includeGrandchildrenDeath);
                            }}
                          />
                        }
                        label="Include Death"
                      />
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={includeGrandchildrenMarriage}
                            onChange={() => {
                              setIncludeGrandchildrenMarriage(!includeGrandchildrenMarriage);
                            }}
                          />
                        }
                        label="Include Marriage"
                      />
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={includeGrandchildrenEducation}
                            onChange={() => {
                              setIncludeGrandchildrenEducation(!includeGrandchildrenEducation);
                            }}
                          />
                        }
                        label="Include Education"
                      />
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={includeGrandchildrenWork}
                            onChange={() => {
                              setIncludeGrandchildrenWork(!includeGrandchildrenWork);
                            }}
                          />
                        }
                        label="Include Work History"
                      />
                    </div>
                  ) : null}
                </Grid>
                <Grid xs={2}>
                  <FormControlLabel control={ <Checkbox checked={includeCustom} onChange={() => { selectCustom(includeCustom); }} /> } label="Include Custom" />
                  {includeCustom ? (
                    <div>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={includeEmigration}
                            onChange={() => {
                              setIncludeEmigration(!includeEmigration);
                            }}
                          />
                        }
                        label="Include Emigration"
                      />
                      <br />
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={includeHouse}
                            onChange={() => {
                              setIncludeHouse(!includeHouse);
                            }}
                          />
                        }
                        label="Include House"
                      />
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={includeVacation}
                            onChange={() => {
                              setIncludeVacation(!includeVacation);
                            }}
                          />
                        }
                        label="Include Vacation"
                      />
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={includeHoliday}
                            onChange={() => {
                              setIncludeHoliday(!includeHoliday);
                            }}
                          />
                        }
                        label="Include Holiday"
                      />
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={includePhilanthropy}
                            onChange={() => {
                              setIncludePhilanthropy(!includePhilanthropy);
                            }}
                          />
                        }
                        label="Include Philanthropy"
                      />
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={includeAward}
                            onChange={() => {
                              setIncludeAward(!includeAward);
                            }}
                          />
                        }
                        label="Include Award"
                      />
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={includeMilitary}
                            onChange={() => {
                              setIncludeMilitary(!includeMilitary);
                            }}
                          />
                        }
                        label="Include Military"
                      />
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={includeBlackSwan}
                            onChange={() => {
                              setIncludeBlackSwan(!includeBlackSwan);
                            }}
                          />
                        }
                        label="Include Black Swan"
                      />
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={includeOther}
                            onChange={() => {
                              setIncludeOther(!includeOther);
                            }}
                          />
                        }
                        label="Include Other"
                      />
                    </div>
                  ) : null}
                </Grid>
                <Grid item xs={2}>
                  <div style={{ paddingTop: '25px' }}>
                    <Button size="large" variant="contained" color="primary" onClick={() => displayDiscoverLifePrint()}>Run Report</Button>
                  </div>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </div>
        </>
    )
}

export default DiscoverLifePrintFilters;