import React, { ReactElement } from "react";
import { FamDiagram } from 'basicprimitivesreact';
import { Enabled, GroupByType, NavigationMode, PageFitMode } from 'basicprimitives';
import { useStoreActions, useStoreState } from "~/store/hooks";
import useNotifications from "~/ui/hooks/useNotifications";
import { Person } from "~/types/api/person";
import { Household } from "~/types/api/household";
import api from "~/services/api";
import router from "next/router";
import paths from "~/ui/constants/paths";
import { isNullOrUndefined } from "util";
import { getDefaultPhotoSrc } from "~/ui/constants/user";
import Header, { HeaderProps } from "~/ui/components/Reports/Header/Header";
import { getFamilyName, getCouplePicture } from "../StoryOfUsReport/StoryOfUsReport";
import { logoBase64WithouText } from "../PDFReportExport/images";
import { getFamilyPicture } from "../StoryOfUsReport/StoryOfUs";

const reportLogo = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB8AAAAcCAYAAACZOmSXAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAKhSURBVEhL7ZbJa1NRFMa/TE3TNEmbplNa65A6D+DOAQRBhC5ERO3ehUvxD3Aj/gNuFHQniLhwKVjBCRQVZ0UlYOhgpUPSjDVJM+s5N/eRR5Kmec9CNv4gvHvuS/K9c893TmL4Q6BFGOW1JfwXbwn/JP4hFsXraFhG2tEtnioU8DA4j4nFOQSzGbmrDd3ij0ILQjSez+MBPYAedIn7fy/j6VJQRsCneAzPwyEZNY9m8RLNpMeU9dZOh9yBWH9JxDCfWZE7zdFwwhXpFtc2XSqKq8/eKe8AE6Le82LN4hd828WaieRyyBSLsJvN9DLBYqifY4343V8zmEmnkMjnkKYvYNxtVlzeuVesFRqJM7d+TuIjlYOxGo1wmC1wWdpwcbTyvppHGh/eiAU6PkWY8dps+L6ckNHa8PG3m8wyArKlEsK5LI71DcidMjXiJoMBZ4ZGZFTmWyKOm9MB3JublTur8y4WwdWAH68iS3KnDJ/ObqdLRmXqFuOIpw+D7TYZVXhBjr7i/yqjWq5N/sDt2WmRqQIfN3O6KiFmVcN9Jve+pwl20O0RPT2VSso7QJfFgks79uA6ibHQuU0+3JgKIEpHq2CnYz8xOIRQNos8GfYslbOahm5nwS3k8AIJ3KdB8kzV2/u7unFycBg5+viT0CLeqMYsd8X5zaPooAdYkd6xmUziqkbTnwm1w5mxAS/c5OA71CEKR3v7ccq7QUaNqVvz1Rjr9wpBhQNUkpeRSsb7XN1NCzOaxJnDPb2iX9m9U8kkzYSKF45XtdJaaBZ3knsP9XiEEd9SWynscrgw0mGXUXNoFmc4+20OJ/3AVAYPG1ArusQ5+zC1kBoflUErusSZiKqnPVYrPDT/taKp1dRw26nhTtCKbvH1QPexrwctFAf+AiWWDMZtSxjWAAAAAElFTkSuQmCC";

export interface FamilyTreeProps {
    treeData?: any;
    household: Household | undefined;
    persons?: Person[];
  }

export const replaceWhiteSpaceWithEnter = (text: String) => {
    return text.replace(/\s\s+/g, ' ').split(" ").join("\n");
}

export const getFamilyTreeReportData = async (householdId: number) => {
    // Null check
    if (isNullOrUndefined(householdId)) {
      // TODO - handle no evaluation id
    }  
  
    // Fetch data
    const household = await api.household.get(householdId);
    const persons = await api.person.list(householdId);
    const tree = await api.familytree.get(householdId, true);
  
    return {
      household: household?.data,
      persons: persons?.data,
      treeData: tree?.data,
    };
  }

const FamilyTree = ({ treeData, household, persons }: FamilyTreeProps): ReactElement => {

    const { onSelect } = useStoreActions(actions => actions.person);
    const [head, setHead] = React.useState<Person | undefined>();
    const notifications = useNotifications();

    const findPersonById = (id: number) => {
        console.log('id', id)
        return persons?.find(p => String(p.PersonID) === String(id));
      }
    
      const moveToContacts = async (event: any, data: any) => {
        const person = findPersonById(data?.id);
        if (!person?.PersonID) return;
        setHead(person)
        // await router.push(paths.CONTACT + "/" + person?.PersonID);
        await onSelect({ head, person });
        await router.push(paths.CONTACTS)
      }

    const config = {
        pageFitMode: PageFitMode.AutoSize,
        autoSizeMaximum: { width: 550, height: 728 },
        autoSizeMinimum: { width: 480, height: 600},
        cursorItem: 2,
        linesWidth: 1.5,
        linesColor: '#183f69',
        normalLevelShift: 20,
        dotLevelShift: 20,
        lineLevelShift: 20,
        normalItemsInterval: 10,
        dotItemsInterval: 10,
        lineItemsInterval: 10,
        arrowsDirection: GroupByType.None,
        connectorType: GroupByType.None,
        elbowType: GroupByType.None,
        showExtraArrows: false,
        hasSelectorCheckbox: Enabled.False,
        hasButtons: Enabled.False,
        buttonsPanelSize: 40,
        navigationMode: NavigationMode.Inactive,
        // @ts-ignore
        defaultTemplateName: "contactTemplate",
        showFrame: Enabled.False,
        templates: [{
          name: "contactTemplate",
          itemSize: { width: 48, height: 90 },
          minimizedItemSize: { width: 3, height: 3 },
          highlightPadding: { left: 2, top: 2, right: 2, bottom: 2 },
          // @ts-ignore
          onItemRender: ({ context: itemConfig }) => {
            return (
              <div style={{ cursor: 'pointer' }}>
                <div className="person_card" onClick={(e) => moveToContacts(e, itemConfig)}>
                  {/* <img src={itemConfig.image ? itemConfig.image : getDefaultPhotoSrc()} title={itemConfig.title} style={{
                              width: '79px',
                              height: '79px'
                            }} /> */}
                  <img crossOrigin="anonymous" src={itemConfig.image ? itemConfig.image : getDefaultPhotoSrc()} title={itemConfig.title} style={{ width: '48px', height: '44px' }} />
                  <p className="person_name">
                    {replaceWhiteSpaceWithEnter(itemConfig.title)}
                  </p>
                  <p className="person_age">
                    {itemConfig?.description}
                  </p>
                </div>
              </div>
            )
          },
          // @ts-ignore
          cursorPadding: { left: 3, top: 3, right: 3, bottom: 3 },
          cursorBorderWidth: 2,
        }],
        items: treeData,
      };

    const headerProps = {
      showHeader: true,
      title: 'Legacy Of Five Family Tree Report',
      subTitle: null,
      storyofus: true,
      familyName: getFamilyName(household, persons),
      image: household ? getFamilyPicture(household) : null,
      headerNoRight: false,
      worksheet: false,
      reportLogo: reportLogo
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
        <div className="report_wrapper">
          <div className="center-tree">
              <FamDiagram centerOnCursor={true}
              config={config} />
          </div>
        </div>
        </>
    )
}

export default FamilyTree;