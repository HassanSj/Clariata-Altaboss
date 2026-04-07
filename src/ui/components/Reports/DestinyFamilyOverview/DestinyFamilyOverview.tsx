import { listeners } from "cluster";
import React, { useState } from "react";
import api from "~/services/api";
import { DestinyGlobalItem } from "~/types/api/destinyGlobalItem";
import { Household } from "~/types/api/household";
import { Person } from "~/types/api/person";
import { PlanMemberItem } from "~/types/api/planMemberItem";
import { PlanMemberItemSummary } from "~/types/api/planMemberItemSummary";
import { getPhotoUrlOrDefault } from "~/ui/constants/user";
import Header from "../Header/Header";
import { getPersonName } from "../LegacyOfFiveFamilyProfile/LegacyOfFiveFamily";
import { getFamilyName, getFamilyPicture } from "../StoryOfUsReport/StoryOfUs";
import ReportWrapper from "../ReportWrapper/ReportWrapper";
import classnames from "classnames";
import styles from "~/ui/components/Widgets/Widgets.module.scss";
import familyOverviewLogo from "../../../../../public/images/reports/summary/Destiny.png";
export interface DestingFamilyOverviewProps {
    data?: DestinyOverviewSummaryItem[];
    household: Household;
    persons?: Person[];
    pageCounter: number;
    pagesLength : number;
}

export interface DestinyOverviewSummaryItem {
    personId: number;
    person: Person;
    firstName: string;
    lastName: string;
    preferredName: string
    categoryItems: CategorySummaryItem[]
  }

interface CategorySummaryItem {
    category: string
    subcategoryItems: SubcategorySummaryItem[];
}

interface SubcategorySummaryItem {
    subcategory: string;
    itemCount: number;
}

const getPerson = async (id: number, householdId: number) => {
    const personResponse = await api.person.get(id, householdId);
    const person = await personResponse.data;
    return person;
}

export const getDestinyFamilyData = async (planId: number, householdId: number) => {

    //const [categoryItems, setCategoryItems] = useState<DevelopmentPlanCategoryItem[]>();
    //const [itemTypeItems, setItemTypeItems] = useState<ItemTypeItem[]>([]);

    let planMemberItemSummary: PlanMemberItemSummary[];
    let categoryItems: CategorySummaryItem[];    
    
    const response = await api.planmember.itemsListCountByHouseholdID(householdId, planId);
    planMemberItemSummary = await response.data;

    const uniquePerson: number[] = [];
    
    planMemberItemSummary.map(item => {
        if (uniquePerson.indexOf(item.PersonID) === -1) {
            uniquePerson.push(item.PersonID);
        }
    })

    const Summary : DestinyOverviewSummaryItem[] = [];

    uniquePerson.map(async (p) => {
        categoryItems = []
        let filteredItems = planMemberItemSummary.filter((x) => x.PersonID == p);
        //console.log(filteredItems);
        let uniqueCategories: string[] = [];

        filteredItems.map(item => {
            if (uniqueCategories.indexOf(item.Category) === -1) {
                uniqueCategories.push(item.Category);
            }
        });

        const personResponse = await api.person.get(p, householdId);
        const personObj = await personResponse.data;

        let summaryItem: DestinyOverviewSummaryItem = {
           personId: p,
           person: personObj,
           firstName: filteredItems[0].FirstName,
           lastName: filteredItems[0].LastName,
           preferredName: filteredItems[0].PreferredName,
           categoryItems: []
        }

        uniqueCategories.map(cat => {

            let categorySummaryItem: CategorySummaryItem = {
                category: cat,
                subcategoryItems: []
            }

            let categoryfiltered = filteredItems.filter(x => x.Category = cat);
            let uniqueSubcategories: string[] = [];

            categoryfiltered.map(item => {
                if (uniqueSubcategories.indexOf(item.Subcategory) === -1) {
                    uniqueSubcategories.push(item.Subcategory);
                }
            });

            uniqueSubcategories.map(s => {

                let subcategoryFiltered = categoryfiltered.filter(x => x.Subcategory == s);
                //console.log(subcategoryFiltered);
                let subcategorySummaryItem: SubcategorySummaryItem = {
                    subcategory: s,
                    itemCount: subcategoryFiltered[0].ItemCount
                }

                categorySummaryItem.subcategoryItems.push(subcategorySummaryItem);
            })

            summaryItem.categoryItems.push(categorySummaryItem);
        });   
        
        Summary.push(summaryItem);
    })

    return Summary;
}

const DestingFamilyOverview = ({data, household, persons , pageCounter , pagesLength}: DestingFamilyOverviewProps) => { 
  console.log("Page Counter :", pageCounter, "Pages Length :", pagesLength)
    const headerProps = {
        showHeader: true,
        title: "Destiny Development Report Family Overview",
        subTitle: null,
        storyofus: true,
        familyName: getFamilyName(household, persons),
        image: household ? getFamilyPicture(household) : null,
        headerNoRight: false,
        worksheet: false,
        reportLogo: familyOverviewLogo
      };

    return (
      <>
        <ReportWrapper
          reportTitle={headerProps.title}
          ownerId={Number(household?.CreatedBy)}
          householdId={Number(household?.HouseholdID)}
        >
          <Header
            showHeader={headerProps.showHeader}
            title={headerProps.title}
            subTitle={headerProps.subTitle}
            image={headerProps.image}
            familyName={headerProps.familyName}
            headerNoRight={headerProps.headerNoRight}
            reportLogo={headerProps.reportLogo}
            worksheet={headerProps.worksheet}
            storyofus={headerProps.storyofus}
          />

          <div style={{ marginTop: '20px'}}>
            {data?.map(p => {
              return (
                <div style={{ display: 'flex', marginBottom: '20px' }}>
                  <div style={{ flex: '1', marginRight: '30px' }}>
                    <img crossOrigin="anonymous" src={getPhotoUrlOrDefault(p.person)} width={70} />
                  </div>
                  <div style={{ flex: '5' }}>
                    <div className="familyOverview-person">
                      {p.firstName} {p.lastName}
                    </div>
                    {p.categoryItems.map(c => {
                      return (
                        <div>
                          <div className="familyOverview-category">{c.category}</div>
                          <div className="familyOverview-subcategory">
                            {c.subcategoryItems?.map(sub => {
                              return (
                                <div style={{ display: 'flex' }}>
                                  <div style={{ flex: '1' }}>
                                    {sub.subcategory ? sub.subcategory : 'Unknown'}: {sub.itemCount}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </ReportWrapper>
        {pageCounter + 1 != pagesLength ? <div className="newPage"></div> : null}
      </>
    );

}
export default DestingFamilyOverview;