import React, {ReactElement} from "react";
import {Person} from "~/types/api/person";
import PDFEmbedded from "~/ui/components/Reports/PDFEmbedded";
import {IPDFReportOptions} from "~/ui/components/Reports/PDFEmbedded/PDFEmbedded";
import {getFamilyName, getFamilyPicture} from "../StoryOfUsReport/StoryOfUsReport";
import {Household} from "~/types/api/household";
import {isNullOrUndefined} from "util";
import api from "~/services/api";
import {Family, FamilyPerson, getHouseholdFamily} from "~/services/reports/persons";
import moment from "moment";
import graduate from "./images/graduate.png";
import baby from "./images/baby.png";
import bag from "./images/bag.png";
import death from "./images/death.png";
import rings from "./images/rings.png";
import ship from "./images/ship.png";
import top_line from "./images/top_line.png"
import {Button, Grid, Icon, IconButton} from "@material-ui/core";
import TimelineDialog from "../../Dialogs/TimelineDialog";
import {TimelineItem} from "~/types/api/timelineItem";
import useNotifications from "~/ui/hooks/useNotifications";
import {useStoreState} from "~/store/hooks";
import { getTimelineData } from "../../Timeline/TimelineReport";
import Header from "../Header/Header";
import { getPhotoUrlOrDefault } from "~/ui/constants/user";

export interface TimelineFilters {
    personType: string;
    includeBirth: boolean,
    includeDeath: boolean,
    includeMarriage: boolean,
    includeWorkHistory: boolean,
    includeEducation: boolean,
}

export interface TimelineData {
  household: Household,
  primaryOne: Person,
  primaryTwo: Person,
  timelineitems: TimeLineItem[],
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
    timelineItems?: TimelineData;
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

/**
 * Fetch report data.
 * @param householdId
 * @param interviewId
 */
export const getTimelineReportData = async (householdId: number,
                                            includePrimary: boolean,
                                            includeGrandparents: boolean,
                                            includeParents: boolean,
                                            includeChildren: boolean,
                                            includeGrandchildren: boolean,
                                            includeBirth: boolean,
                                            includeDeath: boolean,
                                            includeMarriage: boolean,
                                            includeGraduation: boolean,
                                            includeCustom: boolean,
                                            startYear: Date,
                                            endYear: Date,) => {
    // Null check
    if (isNullOrUndefined(householdId)) {
        // TODO - handle no evaluation id
    }
    // Fetch data
    const household = await api.household.get(householdId);
    const persons = await api.person.list(householdId);
    const filters: TimelineFilters[] = [];
    const timelineItem: TimelineData = await getTimelineData(householdId, startYear, endYear, filters);

    return {
        timelineItem,
        household: household?.data,
        persons: persons?.data,
    };
}

export const TimelineLifePrint = ({
    timelineItems,
    household,
    persons,
    isModal,
    isOpen,
    onClose,
    primaryOne,
    primaryTwo,
}: TimelineReportProps): ReactElement => {

const notifications = useNotifications();
const [updatedTimeline, setUpdatedTimeline] = React.useState<TimelineData>();
const primaryOneId = primaryOne?.PersonID;
const primaryTwoId = primaryTwo?.PersonID;
let usedItems : any[] = [];
const reRender = async (item: TimelineItem) => {
notifications.toggleLoading(true);
console.log(timelineItems);
setUpdatedTimeline(timelineItems);
notifications.toggleLoading(false);        
}
const headerProps = {
showHeader: false,
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
<div id="lifeprint-timeline">          
<div className="lifeprint-timeline-header">
<div className="lifeprint-person-one-image">
<img height="75px" width="75px" src={getPhotoUrlOrDefault(persons?.find(p => p.PersonID === primaryOne?.PersonID))}></img>
<div className="lifeprint-header-text" >{primaryOne?.FirstName}</div>
</div>
{/* <div className="lifeprint-family-text">{household?.HouseholdName} Timeline</div> */}
<div className="lifeprint-person-two-image">
<img height="75px" width="75px" src={getPhotoUrlOrDefault(persons?.find(p => p.PersonID === primaryTwo?.PersonID))}></img>
<div className="lifeprint-header-text">{primaryTwo?.FirstName}</div>
</div>
</div>
<div className="demo-card-wrapper demo-card-wrapper-custom">
{timelineItems?.timelineitems?.map((item, i) => {
  if(!usedItems.includes(item.EventDate)) {
    let primaryOneEvents:TimeLineItem[] = [];
    let primaryTwoEvents:TimeLineItem[] = [];

    timelineItems?.timelineitems?.forEach((obj) => {
      if(obj.EventDate === item.EventDate && obj.AssociationId == primaryOneId){
        primaryOneEvents.push(obj)
      }
      if(obj.EventDate === item.EventDate && obj.AssociationId == primaryTwoId){
        primaryTwoEvents.push(obj)
      }
    })
    let date  = primaryOneEvents[0]?.EventDate ?? primaryTwoEvents[0]?.EventDate
    usedItems.push(date);
    return (
    <>
      <div className="lifeprint-My-grid">
        {
          <>
            {/* <div className="primary-one-side display-flex-align">
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
            </div> */}
            
                <div className="lifeprint-primary-one-side display-flex-align">
                  <div
                    className={
                      'lifeprint-primary-one-timeline ' + (primaryOneEvents.length > 1 ? 'lifeprint-primary-one-timeline-before' : '')
                    }
                  >
                    {primaryOneEvents.map(timeLine => {
                      {
                        return (
                          <>
                            {
                              <div className={'lifeprint-head lifeprint-head-custom'}>
                                <div className={'lifeprint-timeline-card'}>
                                  {timeLine?.ImageUrl ? 
                                      <div className="lifeprint-timeline-card-img">
                                        {timeLine?.ImageUrl ? <img src={timeLine?.ImageUrl} /> : null}
                                      </div>
                                  : null }
                                  <div className="lifeprint-timeline-info">
                                    <p className="lifeprint-timeline-date">
                                      <strong>{moment(timeLine?.EventDate).year()}</strong>
                                    </p>
                                    <div className="lifeprint-my-side">
                                    <div className="lifeprint-timeline-event">
                                      <div className="lifeprint-timeline-event-title">
                                          <div className="blue">
                                              <strong>{timeLine?.Description}</strong>
                                          </div>
                                      </div>
                                      <div className="lifeprint-timeline-event-icon">
                                      {timeLine?.icon ? <img src={timeLine?.icon} /> : null}
                                      </div>
                                    </div>
                                    <div className="lifeprint-primary-one-side-middle-line  lifeprint-middle-line"></div>
                                <div className="lifeprint-circle right-circle"></div>
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

                <div className="lifeprint-primary-two-side display-flex-align">
                  <div className="lifeprint-primary-two-timeline">
                    {primaryTwoEvents.map(timeLine => {
                      {
                        return (
                          <>
                            {
                              <div className={'head head-custom'}>
                                <div className="lifeprint-circle left-circle"></div>
                                <div className="lifeprint-primary-two-side-middle-line lifeprint-middle-line"></div>
                                <div className={'lifeprint-timeline-card '}>
                                  {timeLine?.ImageUrl ? 
                                      <div className="lifeprint-timeline-card-img">
                                        {timeLine?.ImageUrl ? <img src={timeLine?.ImageUrl} /> : null}
                                      </div>
                                  : null }
                                  <div className="lifeprint-timeline-info">
                                    <p className="lifeprint-timeline-date">
                                      <strong>{moment(timeLine?.EventDate).year()}</strong>
                                    </p>
                                    <div className="lifeprint-timeline-event">
                                      <div className="lifeprint-timeline-event-title">
                                          <div className="blue">
                                              <strong>{timeLine?.Description}</strong>
                                          </div>
                                      </div>
                                      <div className="lifeprint-timeline-event-icon">
                                      {timeLine?.icon ? <img src={timeLine?.icon} /> : null}
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
  })
}
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
    const options: IPDFReportOptions = {
        title: 'Ancestral Timeline',
        storyofus: true,
        familyName: getFamilyName(household, persons),
        familyImage: household ? getFamilyPicture(household) : undefined,
        isOpen,
        onClose,
        householdId: household?.HouseholdID!,
        household: household,
        primaryOne: primaryOne,
        primaryTwo: primaryTwo
    }

    return (
        <>
            <PDFEmbedded options={options}>
                <TimelineLifePrint timelineItems={timelineItems} household={household} persons={persons} isModal={isModal}
                          isOpen={isOpen} onClose={onClose} primaryOne={primaryOne} primaryTwo={primaryTwo}/>
            </PDFEmbedded>
        </>
    )
}


export default TimelineReport;
