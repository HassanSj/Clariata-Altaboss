import React, {ReactElement, useEffect, useLayoutEffect} from "react";
import {Person} from "~/types/api/person";
import PDFEmbedded from "~/ui/components/Reports/PDFEmbedded";
import {IPDFReportOptions} from "~/ui/components/Reports/PDFEmbedded/PDFEmbedded";
import {getCouplePicture, getFamilyName, getFamilyPicture} from "../Reports/StoryOfUsReport/StoryOfUsReport";
import {Household} from "~/types/api/household";
import {isNullOrUndefined} from "util";
import api from "~/services/api";
import {Family, FamilyPerson, getHouseholdFamily} from "~/services/reports/persons";
import moment from "moment";
import graduate from "../Reports/TimelineReport/images/graduate.png";
import baby from "../Reports/TimelineReport/images/baby.png";
import bag from "../Reports/TimelineReport/images/bag.png";
import death from "../Reports/TimelineReport/images/death.png";
import rings from "../Reports/TimelineReport/images/rings.png";
import ship from "../Reports/TimelineReport/images/ship.png";
import top_line from "../Reports/TimelineReport/images/top_line.png";
import customIcon from "../Reports/TimelineReport/images/EventIcon.png";
import {Button, Grid, Icon, IconButton} from "@material-ui/core";
import TimelineDialog from "../Dialogs/TimelineDialog";
import {TimelineItem} from "~/types/api/timelineItem";
import useNotifications from "~/ui/hooks/useNotifications";
import Header, { HeaderProps } from "~/ui/components/Reports/Header/Header";
import {useStoreState} from "~/store/hooks";
import {
    convertStringToDate,
    convertStringToDateText,
    getDateType,
    isCustomDateValid,
    StringKeyedObject
} from "~/ui/constants/utils";
import { computeStepResponseCountByAppliesTo } from "~/services/interview";
import EventTypes from "../Dialogs/TimelineDialog/shared/EventTypes";
import ReportWrapper from "../Reports/ReportWrapper/ReportWrapper";
import PDFReportExport, { IReportOptions } from "../Reports/PDFReportExport/PDFReportExport";
import { PDFExportProps } from "@progress/kendo-react-pdf";
import { getPhotoUrlOrDefault } from "~/ui/constants/user";

export interface TimelineFilters {
    personType: string;
    includeBirth: boolean,
    includeDeath: boolean,
    includeMarriage: boolean,
    includeWorkHistory: boolean,
    includeEducation: boolean,
}

export interface CustomFilter {
    includeEmigration: boolean,
    includeHouse: boolean,
    includeVacation: boolean,
    includeHoliday: boolean,
    includePhilanthropy: boolean,
    includeAward: boolean,
    includeMilitary: boolean,
    includeBlackSwan: boolean,
    includeOther: boolean
}

interface TimeLineItem {
    Description?: string,
    ImageUrl?: string,
    EventDate?: string,
    EventType?: string,
    PersonType?: string,
    AssociationId?: number,
    icon?: string,
    picture?: string,
    edit?: boolean
}

export interface TimelineReportProps {
    timelineItems?: TimeLineItem[];
    household?: Household;
    persons?: Person[];
    isModal?: boolean;
    isOpen?: boolean;
    onClose?: () => unknown;
    primaryOne?: Person;
    primaryTwo?: Person;
}

export enum TimelineItemType {
    BIRTH = 'BIRTH',
    DEATH = 'DEATH',
    MARRIAGE = 'MARRIAGE',
    GRADUATION = 'GRADUATION',
    OTHER = 'OTHER'
}

const getRandomItem = (set: number[]) => [...set][Math.floor(Math.random() * set.length)];

const getFamily = async (householdID: number) => {
    const family = await getHouseholdFamily(householdID, true);
    return Promise.resolve(family)
}

export const getMarriageText = (person1: Person, person2: Person) => {
    return `${person1?.FirstName} and ${person2?.FirstName} married`;
}

export const getChildBirthDescription = (person: Person, isGrandKid?: boolean) => {
    return `${person?.FirstName}, ${isGrandKid ? 'Grand' : ''}${(person?.GenderID === 1) ? 'son' : person?.GenderID === 2 ? 'daughter' : 'child'}`;
}

export const getParentBirthDescription = (person: Person, relativeName: string | undefined, isGrandParent?: boolean) => {
    return `${person?.FirstName}, ${relativeName ? relativeName + "'s" : ''} ${isGrandParent ? 'grand' : ''}${person?.GenderID === 1 ? 'father' : person?.GenderID === 2 ? 'mother' : 'parent'}`;
}

const reportLogo = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB8AAAAcCAYAAACZOmSXAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAKhSURBVEhL7ZbJa1NRFMa/TE3TNEmbplNa65A6D+DOAQRBhC5ERO3ehUvxD3Aj/gNuFHQniLhwKVjBCRQVZ0UlYOhgpUPSjDVJM+s5N/eRR5Kmec9CNv4gvHvuS/K9c893TmL4Q6BFGOW1JfwXbwn/JP4hFsXraFhG2tEtnioU8DA4j4nFOQSzGbmrDd3ij0ILQjSez+MBPYAedIn7fy/j6VJQRsCneAzPwyEZNY9m8RLNpMeU9dZOh9yBWH9JxDCfWZE7zdFwwhXpFtc2XSqKq8/eKe8AE6Le82LN4hd828WaieRyyBSLsJvN9DLBYqifY4343V8zmEmnkMjnkKYvYNxtVlzeuVesFRqJM7d+TuIjlYOxGo1wmC1wWdpwcbTyvppHGh/eiAU6PkWY8dps+L6ckNHa8PG3m8wyArKlEsK5LI71DcidMjXiJoMBZ4ZGZFTmWyKOm9MB3JublTur8y4WwdWAH68iS3KnDJ/ObqdLRmXqFuOIpw+D7TYZVXhBjr7i/yqjWq5N/sDt2WmRqQIfN3O6KiFmVcN9Jve+pwl20O0RPT2VSso7QJfFgks79uA6ibHQuU0+3JgKIEpHq2CnYz8xOIRQNos8GfYslbOahm5nwS3k8AIJ3KdB8kzV2/u7unFycBg5+viT0CLeqMYsd8X5zaPooAdYkd6xmUziqkbTnwm1w5mxAS/c5OA71CEKR3v7ccq7QUaNqVvz1Rjr9wpBhQNUkpeRSsb7XN1NCzOaxJnDPb2iX9m9U8kkzYSKF45XtdJaaBZ3knsP9XiEEd9SWynscrgw0mGXUXNoFmc4+20OJ/3AVAYPG1ArusQ5+zC1kBoflUErusSZiKqnPVYrPDT/taKp1dRw26nhTtCKbvH1QPexrwctFAf+AiWWDMZtSxjWAAAAAElFTkSuQmCC";

export const getTimelineData = async (householdId: number,
                                      startYear: Date,
                                      endYear: Date,
                                      timelineFilters?: TimelineFilters[],
                                      customFilter?: CustomFilter) => {

    const month = moment(startYear).month() + 1;
    const day = moment(startYear).date();
    const start = moment(startYear).subtract(month, 'month').subtract(day, 'day').toDate();
    const end = endYear;
    const timelineItems: TimeLineItem[] = [];
    const res = await api.timeline.list(householdId);
    const newTimelineItems = res?.data?.TimelineItems;
    const primaryOne = res?.data?.Primary1;
    const primaryTwo = res?.data?.Primary2;
    const household = await api.household.getFull(householdId);
    
    timelineFilters?.forEach(timelineFilter => {
        switch (timelineFilter.personType) {
            case "Primary":
                const primaryEvents = newTimelineItems?.filter((item) => item.PersonType === "Primary");
                if (timelineFilter.includeEducation) {
                    primaryEvents?.filter(event => event.EventType == "Education").forEach(item => {
                        if (item?.EventDate && moment(item?.EventDate).toDate() >= start && moment(item?.EventDate).toDate() <= end) {
                            item["icon"] = graduate;
                            timelineItems?.push(item);
                        }
                    })
                }

                if (timelineFilter.includeBirth) {
                    primaryEvents?.filter(event => event.EventType == "Birth").forEach(item => {
                        if (item?.EventDate && moment(item?.EventDate).toDate() >= start && moment(item?.EventDate).toDate() <= end) {
                            item["icon"] = baby;
                            timelineItems?.push(item);
                        }
                    })

                }

                if (timelineFilter.includeDeath) {
                    primaryEvents?.filter(event => event.EventType == "Death").forEach(item => {
                        if (item?.EventDate && moment(item?.EventDate).toDate() >= start && moment(item?.EventDate).toDate() <= end) {
                            item["icon"] = death;
                            timelineItems?.push(item);
                        }
                    })
                }

                if (timelineFilter.includeMarriage) {
                        primaryEvents?.filter(event => event.EventType == "Marriage").forEach(item => {
                            if (item?.EventDate && moment(item?.EventDate).toDate() >= start && moment(item?.EventDate).toDate() <= end) {
                                item["icon"] = rings;
                                timelineItems?.push(item);
                            }
                        })
                }

                if (timelineFilter.includeWorkHistory) {
                        primaryEvents?.filter(event => event.EventType == "Work").forEach(item => {
                            if (item?.EventDate && moment(item?.EventDate).toDate() >= start && moment(item?.EventDate).toDate() <= end) {
                                item["icon"] = bag;
                                timelineItems?.push(item);
                            }
                        })
                }
                break;

            case "Parents":
                const parentEvents = newTimelineItems?.filter((item) => item.PersonType === "Parent");
                if (timelineFilter.includeEducation) {
                    parentEvents?.filter(event => event.EventType == "Education").forEach(item => {
                        if (item?.EventDate && moment(item?.EventDate).toDate() >= start && moment(item?.EventDate).toDate() <= end) {
                            item["icon"] = graduate;
                            timelineItems?.push(item);
                        }
                    })
                }

                if (timelineFilter.includeBirth) {
                    parentEvents?.filter(event => event.EventType == "Birth").forEach(item => {
                        if (item?.EventDate && moment(item?.EventDate).toDate() >= start && moment(item?.EventDate).toDate() <= end) {
                            item["icon"] = baby;
                            timelineItems?.push(item);
                        }
                    })

                }

                if (timelineFilter.includeDeath) {
                    parentEvents?.filter(event => event.EventType == "Death").forEach(item => {
                        if (item?.EventDate && moment(item?.EventDate).toDate() >= start && moment(item?.EventDate).toDate() <= end) {
                            item["icon"] = death;
                            timelineItems?.push(item);
                        }
                    })
                }

                if (timelineFilter.includeMarriage) {
                        parentEvents?.filter(event => event.EventType == "Marriage").forEach(item => {
                            if (item?.EventDate && moment(item?.EventDate).toDate() >= start && moment(item?.EventDate).toDate() <= end) {
                                item["icon"] = rings;
                                timelineItems?.push(item);
                            }
                        })
                }

                if (timelineFilter.includeWorkHistory) {
                    if (timelineFilter.includeDeath) {
                        parentEvents?.filter(event => event.EventType == "Work").forEach(item => {
                            if (item?.EventDate && moment(item?.EventDate).toDate() >= start && moment(item?.EventDate).toDate() <= end) {
                                item["icon"] = bag;
                                timelineItems?.push(item);
                            }
                        })
                    }
                }
                break;

            case "Children":
                const childrenEvents = newTimelineItems?.filter((item) => item.PersonType === "Child");
                if (timelineFilter.includeEducation) {
                    childrenEvents?.filter(event => event.EventType == "Education").forEach(item => {
                        if (item?.EventDate && moment(item?.EventDate).toDate() >= start && moment(item?.EventDate).toDate() <= end) {
                            item["icon"] = graduate;
                            timelineItems?.push(item);
                        }
                    })
                }

                if (timelineFilter.includeBirth) {
                    childrenEvents?.filter(event => event.EventType == "Birth").forEach(item => {
                        if (item?.EventDate && moment(item?.EventDate).toDate() >= start && moment(item?.EventDate).toDate() <= end) {
                            item["icon"] = baby;
                            timelineItems?.push(item);
                        }
                    })

                }

                if (timelineFilter.includeDeath) {
                    childrenEvents?.filter(event => event.EventType == "Death").forEach(item => {
                        if (item?.EventDate && moment(item?.EventDate).toDate() >= start && moment(item?.EventDate).toDate() <= end) {
                            item["icon"] = death;
                            timelineItems?.push(item);
                        }
                    })
                }

                if (timelineFilter.includeMarriage) {
                        childrenEvents?.filter(event => event.EventType == "Marriage").forEach(item => {
                            if (item?.EventDate && moment(item?.EventDate).toDate() >= start && moment(item?.EventDate).toDate() <= end) {
                                item["icon"] = rings;
                                timelineItems?.push(item);
                            }
                        })
                }

                if (timelineFilter.includeWorkHistory) {
                        childrenEvents?.filter(event => event.EventType == "Work").forEach(item => {
                            if (item?.EventDate && moment(item?.EventDate).toDate() >= start && moment(item?.EventDate).toDate() <= end) {
                                item["icon"] = bag;
                                timelineItems?.push(item);
                            }
                        })
                }
                break;

            case "Grandchildren":
                const grandchildrenEvents = newTimelineItems?.filter((item) => item.PersonType === "GrandChild");
                if (timelineFilter.includeEducation) {
                    grandchildrenEvents?.filter(event => event.EventType == "Education").forEach(item => {
                        if (item?.EventDate && moment(item?.EventDate).toDate() >= start && moment(item?.EventDate).toDate() <= end) {
                            item["icon"] = graduate;
                            timelineItems?.push(item);
                        }
                    })
                }

                if (timelineFilter.includeBirth) {
                    grandchildrenEvents?.filter(event => event.EventType == "Birth").forEach(item => {
                        if (item?.EventDate && moment(item?.EventDate).toDate() >= start && moment(item?.EventDate).toDate() <= end) {
                            item["icon"] = baby;
                            timelineItems?.push(item);
                        }
                    })

                }

                if (timelineFilter.includeDeath) {
                    grandchildrenEvents?.filter(event => event.EventType == "Death").forEach(item => {
                        if (item?.EventDate && moment(item?.EventDate).toDate() >= start && moment(item?.EventDate).toDate() <= end) {
                            item["icon"] = death;
                            timelineItems?.push(item);
                        }
                    })
                }

                if (timelineFilter.includeMarriage) {
                        grandchildrenEvents?.filter(event => event.EventType == "Marriage").forEach(item => {
                            if (item?.EventDate && moment(item?.EventDate).toDate() >= start && moment(item?.EventDate).toDate() <= end) {
                                item["icon"] = rings;
                                timelineItems?.push(item);
                            }
                        })
                }

                if (timelineFilter.includeWorkHistory) {
                        grandchildrenEvents?.filter(event => event.EventType == "Work").forEach(item => {
                            if (item?.EventDate && moment(item?.EventDate).toDate() >= start && moment(item?.EventDate).toDate() <= end) {
                                item["icon"] = bag;
                                timelineItems?.push(item);
                            }
                        })
                }
                break;

            case "Grandparents":
                const grandparentsEvents = newTimelineItems?.filter((item) => item.PersonType === "GrandParent");
                if (timelineFilter.includeEducation) {
                    grandparentsEvents?.filter(event => event.EventType == "Education").forEach(item => {
                        if (item?.EventDate && moment(item?.EventDate).toDate() >= start && moment(item?.EventDate).toDate() <= end) {
                            item["icon"] = graduate;
                            timelineItems?.push(item);
                        }
                    })
                }

                if (timelineFilter.includeBirth) {
                    grandparentsEvents?.filter(event => event.EventType == "Birth").forEach(item => {
                        if (item?.EventDate && moment(item?.EventDate).toDate() >= start && moment(item?.EventDate).toDate() <= end) {
                            item["icon"] = baby;
                            timelineItems?.push(item);
                        }
                    })

                }

                if (timelineFilter.includeDeath) {
                    grandparentsEvents?.filter(event => event.EventType == "Death").forEach(item => {
                        if (item?.EventDate && moment(item?.EventDate).toDate() >= start && moment(item?.EventDate).toDate() <= end) {
                            item["icon"] = death;
                            timelineItems?.push(item);
                        }
                    })
                }

                if (timelineFilter.includeMarriage) {
                        grandparentsEvents?.filter(event => event.EventType == "Marriage").forEach(item => {
                            if (item?.EventDate && moment(item?.EventDate).toDate() >= start && moment(item?.EventDate).toDate() <= end) {
                                item["icon"] = rings;
                                timelineItems?.push(item);
                            }
                        })
                }

                if (timelineFilter.includeWorkHistory) {
                        grandparentsEvents?.filter(event => event.EventType == "Work").forEach(item => {
                            if (item?.EventDate && moment(item?.EventDate).toDate() >= start && moment(item?.EventDate).toDate() <= end) {
                                item["icon"] = bag;
                                timelineItems?.push(item);
                            }
                        })
                }
                break;

            default:
                break;

        }

    })
    console.log("customFilter");
    console.log(customFilter);
    if (customFilter) {
        const customItems = await api.timelineItem.list(householdId, -1);

        if(customFilter.includeEmigration)
        {
            customItems.data.filter(x => x.EventTypeId == 1).forEach((c,i) => {
                if (moment(c.EventDate).toDate() >= start && moment(c.EventDate).toDate() <= end) {
                    timelineItems.push(
                        {
                            EventDate: moment(c?.EventDate).format(),
                            Description: c?.EventName,
                            icon: customIcon, picture: c?.Image, //Update Icon
                            edit: true,
                            AssociationId: Number(c?.PersonId) !== 0 ? Number(c.PersonId) : getRandomItem([primaryOne?.PersonID, primaryTwo?.PersonID])
                        });
                }
            });
        }

        if(customFilter.includeHouse)
        {
            customItems.data.filter(x => x.EventTypeId == 2).forEach((c,i) => {
                if (moment(c.EventDate).toDate() >= start && moment(c.EventDate).toDate() <= end) {
                    timelineItems.push(
                        {
                            EventDate: moment(c?.EventDate).format(),
                            Description: c?.EventName,
                            icon: customIcon, picture: c?.Image, //Update Icon
                            edit: true,
                            AssociationId: Number(c?.PersonId) !== 0 ? Number(c.PersonId) : getRandomItem([primaryOne?.PersonID, primaryTwo?.PersonID])
                        });
                }
            });
        }

        if(customFilter.includeVacation)
        {
            customItems.data.filter(x => x.EventTypeId == 3).forEach((c,i) => {
                if (moment(c.EventDate).toDate() >= start && moment(c.EventDate).toDate() <= end) {
                    timelineItems.push(
                        {
                            EventDate: moment(c?.EventDate).format(),
                            Description: c?.EventName,
                            icon: customIcon, picture: c?.Image, //Update Icon
                            edit: true,
                            AssociationId: Number(c?.PersonId) !== 0 ? Number(c.PersonId) : getRandomItem([primaryOne?.PersonID, primaryTwo?.PersonID])
                        });
                }
            });
        }

        if(customFilter.includeHoliday)
        {
            customItems.data.filter(x => x.EventTypeId == 4).forEach((c,i) => {
                if (moment(c.EventDate).toDate() >= start && moment(c.EventDate).toDate() <= end) {
                    timelineItems.push(
                        {
                            EventDate: moment(c?.EventDate).format(),
                            Description: c?.EventName,
                            icon: customIcon, picture: c?.Image, //Update Icon
                            edit: true,
                            AssociationId: Number(c?.PersonId) !== 0 ? Number(c.PersonId) : getRandomItem([primaryOne?.PersonID, primaryTwo?.PersonID])
                        });
                }
            });
        }

        if(customFilter.includePhilanthropy)
        {
            customItems.data.filter(x => x.EventTypeId == 5).forEach((c,i) => {
                if (moment(c.EventDate).toDate() >= start && moment(c.EventDate).toDate() <= end) {
                    timelineItems.push(
                        {
                            EventDate: moment(c?.EventDate).format(),
                            Description: c?.EventName,
                            icon: customIcon, picture: c?.Image, //Update Icon
                            edit: true,
                            AssociationId: Number(c?.PersonId) !== 0 ? Number(c.PersonId) : getRandomItem([primaryOne?.PersonID, primaryTwo?.PersonID])
                        });
                }
            });
        }

        if(customFilter.includeAward)
        {
            customItems.data.filter(x => x.EventTypeId == 6).forEach((c,i) => {
                if (moment(c.EventDate).toDate() >= start && moment(c.EventDate).toDate() <= end) {
                    timelineItems.push(
                        {
                            EventDate: moment(c?.EventDate).format(),
                            Description: c?.EventName,
                            icon: customIcon, picture: c?.Image, //Update Icon
                            edit: true,
                            AssociationId: Number(c?.PersonId) !== 0 ? Number(c.PersonId) : getRandomItem([primaryOne?.PersonID, primaryTwo?.PersonID])
                        });
                }
            });
        }

        if(customFilter.includeMilitary)
        {
            customItems.data.filter(x => x.EventTypeId == 7).forEach((c,i) => {
                if (moment(c.EventDate).toDate() >= start && moment(c.EventDate).toDate() <= end) {
                    timelineItems.push(
                        {
                            EventDate: moment(c?.EventDate).format(),
                            Description: c?.EventName,
                            icon: customIcon, picture: c?.Image, //Update Icon
                            edit: true,
                            AssociationId: Number(c?.PersonId) !== 0 ? Number(c.PersonId) : getRandomItem([primaryOne?.PersonID, primaryTwo?.PersonID])
                        });
                }
            });
        }

        if(customFilter.includeBlackSwan)
        {
            customItems.data.filter(x => x.EventTypeId == 8).forEach((c,i) => {
                if (moment(c.EventDate).toDate() >= start && moment(c.EventDate).toDate() <= end) {
                    timelineItems.push(
                        {
                            EventDate: moment(c?.EventDate).format(),
                            Description: c?.EventName,
                            icon: customIcon, picture: c?.Image, //Update Icon
                            edit: true,
                            AssociationId: Number(c?.PersonId) !== 0 ? Number(c.PersonId) : getRandomItem([primaryOne?.PersonID, primaryTwo?.PersonID])
                        });
                }
            });
        }

        if(customFilter.includeOther)
        {
            customItems.data.filter(x => x.EventTypeId == 9).forEach((c,i) => {
                if (moment(c.EventDate).toDate() >= start && moment(c.EventDate).toDate() <= end) {
                    timelineItems.push(
                        {
                            EventDate: moment(c?.EventDate).format(),
                            Description: c?.EventName,
                            icon: customIcon, picture: c?.Image,
                            edit: true,
                            AssociationId: Number(c?.PersonId) !== 0 ? Number(c.PersonId) : getRandomItem([primaryOne?.PersonID, primaryTwo?.PersonID])
                        });
                }
            });
        }

        // customItems?.data?.forEach((c,i) => {
        //     if (moment(c.EventDate).toDate() >= start && moment(c.EventDate).toDate() <= end) {
        //         timelineItems.push(
        //             {
        //                 EventDate: moment(c?.EventDate).format(),
        //                 Description: c?.Description,
        //                 icon: bag, picture: c?.Image,
        //                 edit: true,
        //                 AssociationId: Number(c.PersonId)
        //             });
        //     }
        // });
    }
    // Sort by date for timeline
    timelineItems?.sort((a, b) => {
        return +new Date(a?.EventDate!) - +new Date(b?.EventDate!);
    })

    return {
        timelineitems : timelineItems,
        primaryOne: primaryOne,
        primaryTwo: primaryTwo,
        household: household
    }
}

export const Timeline = ({
                             timelineItems,
                             household,
                             persons,
                             isModal,
                             isOpen,
                             onClose,
                             primaryOne,
                             primaryTwo,
                         }: TimelineReportProps): ReactElement => {

    const [showAddItem, setShowAddItem] = React.useState<boolean>(false);
    const [selectedItem, setSelectedItem] = React.useState<TimelineItem>();
    const notifications = useNotifications();
    const [updatedTimeline, setUpdatedTimeline] = React.useState(timelineItems);
    const primaryOneId = primaryOne?.PersonID;
    const primaryTwoId = primaryTwo?.PersonID;
    let usedItems : any[] = [];
    const reRender = async (item: TimelineItem) => {
        notifications.toggleLoading(true);
        let t = updatedTimeline;
        let newItem = true;

        setUpdatedTimeline(t);
        notifications.toggleLoading(false);        
    }
    const headerProps = {
        showHeader: true,
        title: "Ancestral Timeline Report",
        subTitle: null,
        storyofus: true,
        familyName: getFamilyName(household, persons),
        image: household ? getFamilyPicture(household) : null,
        headerNoRight: false,
        worksheet: false,
        reportLogo: undefined
      };

    return (
        <>
        <Header showHeader={headerProps.showHeader}
              title={headerProps.title} 
              subTitle={headerProps.subTitle}
              image={headerProps.image} 
              familyName={headerProps.familyName} 
              headerNoRight={headerProps.headerNoRight} 
              reportLogo={headerProps.reportLogo}
              worksheet={headerProps.worksheet}
              storyofus={headerProps.storyofus}/>
        <div id="timeline">
            {isModal ?
                <>
                    <Grid container spacing={1}>
                        <Grid item xs={9}/>
                        <Grid item xs={3}>
                            <Button onClick={() => setShowAddItem(true)}
                                    size="large"
                                    variant="contained"
                                    color="primary">
                                Add timeline item
                            </Button>
                        </Grid>
                    </Grid>
                    <TimelineDialog isOpen={showAddItem} onClose={() => {
                        setShowAddItem(false);
                        setSelectedItem(undefined);
                    }} item={selectedItem} onSave={reRender}/>
                </> : null}            
            <div className="timeline-header">
              <div className="person-one-image">
                <img height="40px" width="40px" src={getPhotoUrlOrDefault(persons?.find(p => p.PersonID === primaryOne?.PersonID))}></img>
                <div className="header-text" >{primaryOne?.FirstName}</div>
              </div>
              <div className="family-text">{household?.HouseholdName} Timeline</div>
              <div className="person-two-image">
                <img height="40px" width="40px" src={getPhotoUrlOrDefault(persons?.find(p => p.PersonID === primaryTwo?.PersonID))}></img>
                <div className="header-text">{primaryTwo?.FirstName}</div>
              </div>
            </div>
            <div className="demo-card-wrapper demo-card-wrapper-custom">
                {updatedTimeline?.map((item, i) => {
                    if(!usedItems.includes(item.EventDate)) {
                        let primaryOneEvents:TimeLineItem[] = [];
                        let primaryTwoEvents:TimeLineItem[] = [];
                         updatedTimeline.forEach((obj) => {
                           if(obj.EventDate === item.EventDate && obj.AssociationId == primaryOneId){
                            primaryOneEvents.push(obj)
                           }
                           if(obj.EventDate === item.EventDate && obj.AssociationId == primaryTwoId){
                            primaryTwoEvents.push(obj)
                           }
                        })
                        let date  = primaryOneEvents[0]?.EventDate ?? primaryTwoEvents[0]?.EventDate
                        usedItems.push(date)
                       return (
                         <>
                           <div className="My-grid">
                             {
                               <>
                                 <div className="primary-one-side display-flex-align">
                                   <div
                                     className={
                                       'primary-one-timeline ' + (primaryOneEvents.length > 1 ? 'primary-one-timeline-before' : '')
                                     }
                                   >
                                     {primaryOneEvents.map(timeLine => {
                                       {
                                         return (
                                           <>
                                             {
                                               <div className={'head head-custom'}>
                                                 <div className={'timeline-card'}>
                                                    {timeLine?.ImageUrl ? 
                                                        <div className="timeline-card-img">
                                                         {timeLine?.ImageUrl ? <img src={timeLine?.ImageUrl} /> : null}
                                                        </div>
                                                   : null }
                                                   <div className="timeline-info">
                                                     <p className="timeline-date">
                                                       <strong>{moment(timeLine?.EventDate).year()}</strong>
                                                     </p>
                                                     <div className="my-side">
                                                     <div className="timeline-event">
                                                        <div className="timeline-event-title">
                                                            <div className="blue">
                                                                <strong>{timeLine?.Description}</strong>
                                                            </div>
                                                       </div>
                                                       <div className="timeline-event-icon">
                                                       {timeLine?.icon ? <img src={timeLine?.icon} /> : null}
                                                       {isModal && timeLine?.edit ? (
                                                         <IconButton
                                                           aria-label="more"
                                                           aria-controls="long-menu"
                                                           aria-haspopup="true"
                                                           onClick={() => {
                                                             const timeline: TimelineItem = {
                                                               TimelineItemID: 10000, // fix this and below lines as well
                                                               EventDate: moment.unix(Number(timeLine?.EventDate)).toDate(),
                                                               Description: timeLine?.Description!,
                                                               Image: timeLine?.picture,
                                                             };
                                                             setSelectedItem(timeline);
                                                             setShowAddItem(true);
                                                           }}
                                                         >
                                                           <Icon>edit</Icon>
                                                         </IconButton>
                                                       ) : null}
                                                       </div>
                                                     </div>
                                                     <div className="primary-one-side-middle-line  middle-line"></div>
                                                 <div className="circle right-circle"></div>
                                                     </div>
                                                   </div>
                                                 </div>
                                               </div>
                                             }
                                           </>
                                         );
                                       }
                                     })}
                                   </div>
                                 </div>

                                 <div className="primary-two-side display-flex-align">
                                   <div className="primary-two-timeline">
                                     {primaryTwoEvents.map(timeLine => {
                                       {
                                         return (
                                           <>
                                             {
                                               <div className={'head head-custom'}>
                                                 <div className="circle left-circle"></div>
                                                 <div className="primary-two-side-middle-line middle-line"></div>
                                                 <div className={'timeline-card '}>
                                                    {timeLine?.ImageUrl ? 
                                                        <div className="timeline-card-img">
                                                         {timeLine?.ImageUrl ? <img src={timeLine?.ImageUrl} /> : null}
                                                        </div>
                                                   : null }
                                                   <div className="timeline-info">
                                                     <p className="timeline-date">
                                                       <strong>{moment(timeLine?.EventDate).year()}</strong>
                                                     </p>
                                                     <div className="timeline-event">
                                                        <div className="timeline-event-title">
                                                            <div className="blue">
                                                                <strong>{timeLine?.Description}</strong>
                                                            </div>
                                                        </div>
                                                        <div className="timeline-event-icon">
                                                       {timeLine?.icon ? <img src={timeLine?.icon} /> : null}
                                                       {isModal && timeLine?.edit ? (
                                                         <IconButton
                                                           aria-label="more"
                                                           aria-controls="long-menu"
                                                           aria-haspopup="true"
                                                           onClick={() => {
                                                             const timeline: TimelineItem = {
                                                               TimelineItemID: 100000, // Fix this and below lines as well
                                                               EventDate: moment.unix(Number(timeLine?.EventDate)).toDate(),
                                                               Description: timeLine?.Description!,
                                                               Image: timeLine?.picture,
                                                             };
                                                             setSelectedItem(timeline);
                                                             setShowAddItem(true);
                                                           }}
                                                         >
                                                           <Icon>edit</Icon>
                                                         </IconButton>
                                                       ) : null}
                                                       </div>
                                                     </div>
                                                   </div>
                                                 </div>
                                               </div>
                                             }
                                           </>
                                         );
                                       }
                                     })}
                                   </div>
                                 </div>
                               </>
                             }
                           </div>
                         </>
                       );
                    } 
                })}
                <span className="afterOuter"/>
            </div>
            {/* </div> */}
        </div>
        </>
    )
}

const TimelineReport = ({
                            timelineItems,
                            household,
                            persons,
                            isModal,
                            isOpen,
                            onClose,
                            primaryOne,
                            primaryTwo
                        }: TimelineReportProps): ReactElement => {
    // const options: IPDFReportOptions = {
    //     title: 'Ancestral Timeline',
    //     storyofus: true,
    //     familyName: getFamilyName(household, persons),
    //     familyImage: household ? getFamilyPicture(household) : undefined,
    //     isOpen,
    //     onClose,
    //     householdId: household?.HouseholdID!,
    //     household: household,
    //     primaryOne: primaryOne,
    //     primaryTwo: primaryTwo
    // }

    const reportOptions: IReportOptions = {
        title: 'Ancestral Timeline',
        storyofus: true,
        familyName: getFamilyName(household, persons),
        familyImage: household ? getCouplePicture(household) : undefined,
        reportLogo: reportLogo,
        isOpen,
        onClose,
        header: true,
    }

    const options: PDFExportProps = {
        paperSize: "auto",
        fileName: "Ancestral-Timeline-Report",
        scale: 1,
        subject: "Discover: Ancestral Timeline",
        author: household?.CreatedBy,
        keepTogether: ".keep-together",
        landscape: false,
      }
    
    // console.log("family photo :", getFamilyPicture(household!));
    // console.log("Options :", options)
    console.log(primaryTwo);
    return (
        <>
        <div key={JSON.stringify(timelineItems)}>
            <PDFReportExport options={options} reportOptions={reportOptions} excludeFooter={true}>
                <ReportWrapper reportTitle={options.subject} ownerId={Number(household?.CreatedBy)} householdId={Number(household?.HouseholdID)} >
                    <Timeline timelineItems={timelineItems} household={household} persons={persons} isModal={isModal}
                            isOpen={isOpen} onClose={onClose} primaryOne={primaryOne} primaryTwo={primaryTwo}/>
                </ReportWrapper>
            </PDFReportExport>
        </div>
        </>
    )
}


export default TimelineReport;
