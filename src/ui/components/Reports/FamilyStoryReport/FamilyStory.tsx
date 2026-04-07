import React, {ReactElement, RefObject, useEffect, useLayoutEffect, useRef, useState} from "react";
import {Person} from "~/types/api/person";
import { getFamilyName, getFamilyPicture } from "../StoryOfUsReport/StoryOfUsReport";
import { Household } from "~/types/api/household";
import { isNullOrUndefined } from "util";
import api from "~/services/api";
import { InterviewResponse } from "~/types/api/interviewResponse";
import { FamilyStoryData, FamilyStoryReportProps, ReportSpecificResponses } from "./FamilyStoryReport";
import Header, { HeaderProps } from "~/ui/components/Reports/Header/Header";
import ReactDOM from 'react-dom';

const FamilyStory = ({ data, household, persons, isOpen, onClose, pageNumber }: FamilyStoryReportProps): ReactElement => {

  const headerProps = {
    showHeader: true,
    title: "Family Story",
    subTitle: null,
    storyofus: true,
    familyName: getFamilyName(household, persons),
    image: household ? getFamilyPicture(household) : null,
    headerNoRight: false,
    worksheet: false,
    reportLogo: undefined
  };

  const reference = useRef<HTMLHeadingElement>(null);
  const [width, setWidth] = useState<number>();
  const [height, setHeight] = useState<number>();

  const getSize = () => {

    if (reference.current) {
      const newWidth = reference.current.clientWidth;
      setWidth(newWidth);

      const newHeight = reference?.current.clientHeight;
      setHeight(newHeight);
    }
  };
	
  useEffect(() => {
    getSize(); 

  }, [])

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
          {pageNumber == 1 ?           
          <>
          <FamilyStorySection data={data?.BeliefsAndValues} sectionTitle="Beliefs and Values"  />
          <FamilyStorySection data={data?.OurFamilyToday} sectionTitle="Our Family Today" />
          
          </> :
          <>
            <FamilyStorySection data={data?.GivingThanks} sectionTitle="Giving Thanks" />
            <FamilyStorySection  data={data?.GivingBack} sectionTitle="Giving Back" />
          </>
        }
    </>
  )
}


export default FamilyStory;


interface sectionProps {
  data?: ReportSpecificResponses[];
  sectionTitle: string;
}

const FamilyStorySection = ({data, sectionTitle}: sectionProps): ReactElement => {

  return (
              <>             
                <div className="familystory-table keep-together">
                  <div>
                    <div className="familystory-header">
                        {sectionTitle}
                    </div>
                  </div>
                  <div>
                    <div>
                      <div className="familystory-row keep-together">
                    {data?.map((qd,i) => {
                      if(qd.responses && qd.responses.length > 0) {
                        return (
                            <div key={"response" + i}>
                                <h3 className="familystory-row-h3">
                                  {qd?.title}
                                </h3>
                                <p className="familystory-row-p">
                                {qd.responses.map(r => {
                                    return (
                                      <>
                                        {r.ResponseText + " "} 
                                      </>
                                    )
                                })}
                                </p>
                            </div>
                        )
                      }
                    })}
                  </div>
                  </div>
                  </div>
                </div>
    
    </>
  )

}