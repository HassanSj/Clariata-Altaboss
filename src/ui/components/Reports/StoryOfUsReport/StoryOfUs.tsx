import React, { ReactElement } from "react";
import { useStoreActions, useStoreState } from "~/store/hooks";
import useNotifications from "~/ui/hooks/useNotifications";
import { Person } from "~/types/api/person";
import { Household } from "~/types/api/household";
import api from "~/services/api";
import router from "next/router";
import paths from "~/ui/constants/paths";
import { isNullOrUndefined } from "util";
import { getBothPhotoSrc, getDefaultPhotoSrc } from "~/ui/constants/user";
import Header, { HeaderProps } from "~/ui/components/Reports/Header/Header";
import { logoBase64WithouText } from "../PDFReportExport/images";
import { WizardState } from "~/types/wizard/wizard";
import { getInterviewWizardFull } from "~/services/interview";
import { InterviewResponse } from "~/types/api/interviewResponse";
import { QuestionAndResponse } from "~/types/api/questionAndResponse";
import { getDefaultFamilyPhotoSrc } from "~/ui/constants/user";
import moment from 'moment'; 
import { getStoryOfUsData, StoryOfUsData } from "./StoryOfUsReport";
import { ReportSpecificResponses } from "../FamilyStoryReport/FamilyStoryReport";

export interface StoryOfUsProps {
    storyOfUsData?: StoryOfUsData;
    household?: Household;
    persons?: Person[];
  }

//story of us question id-s/alternative titles and their corresponding sections on the report
export const StoryOfUsQuestionAlternativeTitles: {id: number, title: string, section: number, questionOrder: number, questionResponse: QuestionAndResponse[]}[] = [
    { "id": 435, "title": "HOW WE MET", "section": 1, questionOrder: 1, questionResponse: []},
    { "id": 342, "title": "OUR WEDDING", "section": 1, questionOrder: 2, questionResponse: [] },
    { "id": 221, "title": "OUR FONDEST MEMORY", "section": 1, questionOrder: 3, questionResponse: [] },
    { "id": 215, "title": "OUR JOURNEY", "section": 2, questionOrder: 1, questionResponse: [] },
    { "id": 427, "title": "OUR ADVICE", "section": 2, questionOrder: 2, questionResponse: [] },
    { "id": 206, "title": "FAVORITE FAMILY HOLIDAYS", "section": 3, questionOrder: 1, questionResponse: [] },
    { "id": 285, "title": "NEW FAMILY HOLIDAYS", "section": 3, questionOrder: 2, questionResponse: [] },
    { "id": 397, "title": "FAVORITE TRADITIONS", "section": 3, questionOrder: 3, questionResponse: [] },
    { "id": 400, "title": "NEW TRADITIONS", "section": 3, questionOrder: 4, questionResponse: [] },
    { "id": 205, "title": "RELIGION", "section": 3, questionOrder: 5, questionResponse: [] },
    { "id": 385, "title": "", "section": 3, questionOrder: 5, questionResponse: [] }
  ];
  
  // report section ids and their alternative titles
  export const StoryOfUsSectionTitles: {id: number, title: string}[] = [
    { "id": 1, "title": "Our Story" },
    { "id": 2, "title": "Our Legacy and Our Advice" },
    { "id": 3, "title": "Rituals and Traditions" }
  ];
  
  //dimensionoflifeIds that are used
  export const StoryOfUsDimensionIds = [6,11,16];
  
  export const getStoryOfUsQuestionsAndResponsesArray = (wizard : WizardState | undefined) => {
    if(wizard) {
      const filtered = wizard?.steps[0]?.steps?.filter(wizardstep => StoryOfUsDimensionIds.indexOf(wizardstep?.discoveryCategory?.DimensionOfLifeID as number) > -1);
  
      StoryOfUsQuestionAlternativeTitles.forEach((question) => {  
        question.questionResponse = [];  
        filtered?.map(r => {
            let qr = r.questions?.find(q => q.Question.QuestionID == question.id);
            console.log(qr);
            if(qr) {
              question.questionResponse?.push(qr);
              console.log(qr.Question.DimensionOfLifeID);
              console.log(qr.SubQuestions);
              qr?.SubQuestions?.map(sq => {
                question.questionResponse.push(sq)
              })
            }
          }
        )
      });
  
      return StoryOfUsQuestionAlternativeTitles;
    }
  }
  
  export const generateResponseSummaryFromResponsesArray = (responses:InterviewResponse[]) => {
    let response: string = "";
    responses.forEach(r => {
      if(r.ResponseText?.match(/\s\s+/g))
        response = response + r?.ResponseText + " ";
      else
        response = response + r?.ResponseText + " ";
      
    });
    // = response.replace(/\s\s+/g, '').replace(/^\s+/g, '') +  " ";
    return response;
  }
  
  /**
   * Fetch report data.
   * @param householdId
   * @param interviewId
   */
  export const getStoryOfUsReportData = async (householdId: number, interviewId: number) => {
    // Null check
    if (isNullOrUndefined(householdId)) {
    // TODO - handle no evaluation id
    }
  
    
    // Fetch data
    const household = await api.household.get(householdId);
    const persons = await api.person.list(householdId);
    // const wizard = await getInterviewWizardFull(Number(householdId), Number(interviewId));
    // const responses = getStoryOfUsQuestionsAndResponsesArray(wizard);
    const storyOfData = await getStoryOfUsData(householdId, interviewId);

    return {
      household: household?.data,
      persons: persons?.data,
      storyOfUsData: storyOfData
    };
  }

  export const getFamilyName = (household: Household | undefined, persons: Person[] | undefined) => {
    const spouse1 = persons?.find((person:Person) => person.PersonID == household?.PrimaryPerson1ID);
    const spouse2 = persons?.find((person:Person) => person.PersonID == household?.PrimaryPerson2ID);
  
    if(spouse2)
    {
      return spouse2.LastName == spouse1?.LastName ? `${spouse1?.FirstName} & ${spouse2.FullName}` :  `${spouse1?.FullName} & ${spouse2.FullName}`;
    }
  
    return `${spouse1?.FullName}`;
  
  
  }
  
  export const getFamilyPicture = (household: Household) => {
    return household?.PhotoURL ? household?.PhotoURL : getDefaultFamilyPhotoSrc();
  }
  
  export const getCouplePicture = (household: Household) => {
    return household?.CouplePhotoURL ? household?.CouplePhotoURL : getBothPhotoSrc();
  }

  const StoryOfUs = ({ household, persons, storyOfUsData }: StoryOfUsProps): ReactElement => {

    const headerProps = {
        showHeader: true,
        title: "The Story Of Us",
        subTitle: null,
        storyofus: true,
        familyName: getFamilyName(household, persons),
        image: household ? getCouplePicture(household) : null,
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
          <StoryOfUsSection title="Our Story" responses={storyOfUsData?.OurStory} household={household} />
          <StoryOfUsSection title="Our Legacy and Our Advice" responses={storyOfUsData?.OurLegacyAndOurAdvice} />
          <StoryOfUsSection title="Rituals and Traditions" responses={storyOfUsData?.RulesAndTraditions} />
          
        </>
    )        
  }
   
  
  interface StoryOfUsSectionProps {
    title: string;
    responses?: ReportSpecificResponses[],
    household? : Household
  }

  export default StoryOfUs;


  const StoryOfUsSection = ({title, responses, household}: StoryOfUsSectionProps) => {

    return (
      <>
        <div className="storyofus-table">
                    <div>
                      <div className="storyofus-header">
                          {title}
                      </div>
                    </div>
                    <div>
                      <div>
                        <div className="storyofus-row">
                          <div className="storyofus-bcr-content">
                            {title == "Our Story" ? 
                              <>                                            
                                <h3 className="storyofus-row-h3">MARRIAGE Date</h3>
                                <p className="storyofus-row-p">{moment(household?.MarriageDate) > moment("0001-01-01") ? moment(household?.MarriageDate).format('MMMM D, YYYY'): null}</p>
                              </> : null
                            }

                            {responses?.map(response => {
                              return (
                                  <div className="storyofus-bcr-content">
                                  <h3 className="storyofus-row-h3">{response.title}</h3>
                                  <p className="storyofus-row-p">
                                    { generateResponseSummaryFromResponsesArray(response.responses) }
                                  </p>
                                </div> 
                              )
                            })
                          }
                          </div> 
                      </div>
                    </div>
                  </div>
                </div>
      </>


    )

  }