import React, {ReactElement} from "react";
import {Person} from "~/types/api/person";
import { getFamilyName, getFamilyPicture } from "../StoryOfUsReport/StoryOfUsReport";
import { Household } from "~/types/api/household";
import { isNullOrUndefined } from "util";
import api from "~/services/api";
import PDFReportExport, { IReportOptions } from "~/ui/components/Reports/PDFReportExport/PDFReportExport";
import { PDFExportProps } from "@progress/kendo-react-pdf";
import { PlanMemberItem } from "~/types/api/planMemberItem";
import DestinyComponent from "./DestinyComponent";

interface CategoryItem {
    category: string;
    items: PlanMemberItem[]
}

export interface DestinyReportProps {
  data?: CategoryItem[];
  itemType: string;
  household?: Household;
  persons?: Person[];
}


export const getDestinyReportData = async (householdId: number, planId: number, itemType: string) => {
   
    let planMemberItems: PlanMemberItem[]; 
    const response = await api.planmember.itemsListByHouseholdID(householdId, planId);
    planMemberItems = await response.data;

    const items = planMemberItems.filter(x => x.ItemType == itemType);   

    const uniqueCategories: string[] = [];
    
    items.map(item => {
        if (uniqueCategories.indexOf(item.Category) === -1) {
            uniqueCategories.push(item.Category);
        }
    })
    
    const CategoryGrouping : CategoryItem[] = [];

    uniqueCategories.map(cat => {

        let filteredItems = items.filter((x) => x.Category == cat);
        
        let uniqueItemTypes: string[] = [];

        filteredItems.map(item => {
            if (uniqueItemTypes.indexOf(item.ItemType) === -1) {
                uniqueItemTypes.push(item.ItemType);
            }
        });

        const item: CategoryItem = {
            category: cat,
            items: filteredItems
        }

        CategoryGrouping.push(item);                
    })

    console.log(CategoryGrouping);
    return CategoryGrouping;
}

const DestinyReport = ({ data, itemType, household, persons }: DestinyReportProps): ReactElement => {

  const reportOptions: IReportOptions = {
    title: 'Destiny',
    storyofus: true,
    familyName: getFamilyName(household, persons),
    familyImage: household ? getFamilyPicture(household) : undefined,
    header: true,
  }

  const options: PDFExportProps = {
    paperSize: "auto",
    fileName: "Destiny-Report",
    scale: 1,
    subject: "Destiny: " + {itemType},
    author: household?.CreatedBy,
    keepTogether: ".keep-together"
  }  

  return (
    <>
      <PDFReportExport options={options} reportOptions={reportOptions}>
        <DestinyComponent data={data} itemType={itemType} household={household} persons={persons} />
      </PDFReportExport>
    </>
  )
}


export default DestinyReport;
