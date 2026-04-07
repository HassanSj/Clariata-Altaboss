import React, { useState } from "react";
import api from "~/services/api";
import { DestinyGlobalItem } from "~/types/api/destinyGlobalItem";
import { Person } from "~/types/api/person";
import { PlanMemberItem } from "~/types/api/planMemberItem";
import { getPhotoUrlOrDefault } from "~/ui/constants/user";
import Header from "../Header/Header";
import { getPersonName } from "../LegacyOfFiveFamilyProfile/LegacyOfFiveFamily";
import { Household } from "~/types/api/household";
import ReportWrapper from "../ReportWrapper/ReportWrapper";

export interface DevelopmentPlanProps 
{
    data?: DevelopmentPlanCategoryItem[];
    person?: Person;
    household: Household;
    pageCounter: number;
    pagesLength : number;
}

export interface DevelopmentPlanCategoryItem {
    category: string;
    items: ItemTypeItem[]
  }

interface ItemTypeItem {
    itemType: string;
    items: PlanMemberItem[]
}

export const getDevelopmentPlanData = async (personId: number, planId: number, householdId: number) => {

    //const [categoryItems, setCategoryItems] = useState<DevelopmentPlanCategoryItem[]>();
    //const [itemTypeItems, setItemTypeItems] = useState<ItemTypeItem[]>([]);

    let planMemberItems: PlanMemberItem[];    
    
    const response = await api.destiny.getPlanMemberItemsByPerson(personId, planId, householdId);
    planMemberItems = await response.data;

    const uniqueCategories: string[] = [];
    
    planMemberItems.map(item => {
        if (uniqueCategories.indexOf(item.Category) === -1) {
            uniqueCategories.push(item.Category);
        }
    })

    console.log(uniqueCategories);
    
    const CategoryGrouping : DevelopmentPlanCategoryItem[] = [];

    uniqueCategories.map(cat => {

        const ItemGrouping : ItemTypeItem[] = [];
        let itemTypeItems: ItemTypeItem[];
        let filteredItems = planMemberItems.filter((x) => x.Category == cat);
        console.log(filteredItems);
        let uniqueItemTypes: string[] = [];

        filteredItems.map(item => {
            if (uniqueItemTypes.indexOf(item.ItemType) === -1) {
                uniqueItemTypes.push(item.ItemType);
            }
        });

        uniqueItemTypes.map(item => {
            let typeItem: ItemTypeItem = {
                itemType: item,
                items: filteredItems.filter(x => x.ItemType == item)
            }
            
            ItemGrouping.push(typeItem);
        });

        console.log(ItemGrouping);

        const item: DevelopmentPlanCategoryItem = {
            category: cat,
            items: ItemGrouping
        }
        CategoryGrouping.push(item);                
    })

    console.log(CategoryGrouping);
    return CategoryGrouping;
}

    const DevelopmentPlan = ({ data, household, person, pageCounter, pagesLength }: DevelopmentPlanProps) => {
      const headerProps = {
        showHeader: true,
        title: 'Development Plan',
        subTitle: null,
        storyofus: true,
        familyName: person ? getPersonName(person) : '',
        image: getPhotoUrlOrDefault(person),
        headerNoRight: false,
        worksheet: false,
        reportLogo: undefined,
      };

      console.log(data);

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
            {data?.map(category => {
              return (
                <div>
                  <div className="developmentplan-header">{category.category}</div>
                  <div className="developmentplan-row">
                    {category.items.map(itemType => {
                      return (
                        <div>
                          <div className="developmentplan-row-h3">{itemType.itemType}</div>
                          {itemType.items.map(item => {
                            return (
                              <>
                                <div style={{ marginBottom: '20px' }}>
                                  <div style={{ display: 'flex' }}>
                                    <div style={{ flex: '1' }}>{item.Subcategory}</div>
                                    <div style={{ flex: '2' }}>{item.Title}</div>
                                  </div>
                                  <div style={{ display: 'flex' }}>
                                    <div style={{ flex: '1' }}>{item.StartDate}</div>
                                    <div style={{ flex: '2' }}>{item.Author}</div>
                                  </div>
                                </div>
                              </>
                            );
                          })}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </ReportWrapper>
          {pageCounter + 1 != pagesLength ? <div className="newPage"></div> : null}
        </>
      );
    };

export default DevelopmentPlan;