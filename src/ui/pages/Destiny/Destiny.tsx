import React, { useEffect, useState } from 'react';
import { Box, Card, CardContent, Grid, Icon, IconButton, TextField, Tooltip } from '@material-ui/core';
import { Router, useRouter } from 'next/router';
import styles from './Destiny.module.scss';
import DestinyWrapper from '~/ui/components/Modules/Destiny/DestinyWrapper/DestinyWrapper';
import DestinyPlanSide from '~/ui/components/Modules/Destiny/DestinyPlanSide/DestinyPlanSide';
import DestinyPlanHeader from '~/ui/components/Modules/Destiny/DestinyPlanHeader/DestinyPlanHeader';
import { Person } from '~/types/api/person';
import DestinyPlanDetails from '~/ui/components/Modules/Destiny/DestinyPlanDetails/DestinyPlanDetails';
import { getPlanMemberItemsByPerson } from '~/services/api/destiny';
import api from '~/services/api';
import { PlanMemberItem } from '~/types/api/planMemberItem';
import { useStoreState } from '~/store/hooks';
import { DevelopmentPlan } from '~/types/api/developmentPlan';
import { DestinyGlobalItem, PlanMember } from '~/types/api/destinyGlobalItem';
import { IDataItemEventConfig } from '~/types/data';
import { getHouseholdFamily } from '~/services/reports/persons';
import useNotifications from '~/ui/hooks/useNotifications';
import classnames from 'classnames';
import { AxiosResponse } from 'axios';
import { Alert } from '@material-ui/lab';
import Button from '~/ui/components/Button';
import moment from 'moment';
import MultiSelectFilterDestiny from '~/ui/components/Data/MultiSelectFilter/MultiSelectFilterDestiny';
import { Subcategory } from '~/services/api/destinysubcategory';

import { DEFAULT_ALL_FILTER, getAssistanceFilters, getDimensionsOfSuccessFilters, getObjectiveGroupingMap, getObjectiveGroupingOptions, getTimeframeFilters } from '~/ui/constants/tasks';

import { Objective } from '~/types/api/models';

import useDraggables from '~/ui/hooks/useDraggables';
import useDatePeriodFilterable from '~/ui/hooks/useDatePeriodFilterable';
import { Timeframe } from '~/types/api/timeframe';

import {
  Filter,
  Operators,
  TextFilter,
  NumericFilter,
  DateFilter,
  BooleanFilter,
  FilterChangeEvent,
} from "@progress/kendo-react-data-tools";

import {
  filterBy,
  CompositeFilterDescriptor,
} from "@progress/kendo-data-query";
import DestinyFilter from '~/ui/components/Destiny/DestinyFilter/DestinyFilter';
import { computeQuestionResponseCountByAppliesTo } from '~/services/interview';
import { ITEMS_SELECT_ACTION } from '@progress/kendo-react-scheduler';


export interface CategoryItem {
  category: string;
  subcategories: SubcategoryItem[];
}

export interface SubcategoryItem {
  subcategory: string;
  items?: DestinyGlobalItem[];
}

export interface PlanMemberCategoryItem {
  category: string;
  items: PlanMemberItem[];
}

const Destiny = () => {
  const [plans, setPlans] = useState<DevelopmentPlan[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<DevelopmentPlan>();
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [selectedPersonId, setSelectedPersonId] = useState<number>(-1);
  const [selectedPerson, setSelectedPerson] = useState<Person>();
  const [selectedPlanMemberID, setSelectedPlanMemberID] = useState<number>(-1);
  const [familyMember, setFamilyMember] = useState<PlanMember>();
  const [familyMemberPlanItems, setFamilyMemberPlanItems] = useState<PlanMemberCategoryItem[] | undefined>();
  const [familyMembers, setFamilyMembers] = useState<(Person | undefined)[]>();
  const { selectedHousehold, households } = useStoreState(state => state.household);
  const [categoryItems, setCategoryItems] = useState<CategoryItem[]>([]);
  const [allCategoryItems, setAllCategoryItems] = useState<CategoryItem[]>([]);
  const [moduleName, setModuleName] = React.useState<String>('');
  const [moduleOverview, setModuleOverview] = React.useState<String>('');
  const [isActive, setIsActive] = React.useState<boolean>(false);
  const [isActiveTrial, setIsActiveTrial] = React.useState<boolean>(false);
  const [showFilters,setShowFilters] = useState(false);
  const [categories, setCategories] = useState<string[]>([]);
  const [subcategories, setSubcategories] = useState<string[]>([]);
  const [itemTypes, setItemTypes] = useState<string[]>(["Activity", "Assessment", "Book", "Case Study", "Checklist",  "Conference", "Podcast", "Presentation", "Reference (External)", "Reference (Internal)", "Video"]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedSubcategories, setSelectedSubcategories] = useState<string[]>([]);
  const [selectedItemTypes, setSelectedItemTypes] = useState<string[]>([]);
  const [filterVisible, setFilterVisible] = useState<boolean>(false);
  const [personIdList, setPersonIdList] = useState<number[]>([])

  const router = useRouter();
  const notifications = useNotifications();

  const CreatePlan = async (developmentPlan: DevelopmentPlan) => {
    developmentPlan.Year = moment(developmentPlan.PlanStartDate).year();
    developmentPlan.HouseholdID = selectedHousehold.HouseholdID;
    console.log("FORM VALUES :", developmentPlan)
    const res = await api.developmentPlan.createDevelopmentPlan(developmentPlan);
    const plan = await res.data;

    const plansResponse = await api.developmentPlan.getDevelopmentPlans(selectedHousehold.HouseholdID);
    const plans = await plansResponse.data;
    console.log(plans);
    setPlans(plans);

    setSelectedPlan(plan);

    setModalOpen(false);
  };

  const CloseModal = () => {
    setModalOpen(false);
  };

  const OpenModal = () => {
    setModalOpen(true);
  };

  const SelectPlan = async (planId: number) => {
    const res = await api.developmentPlan.getDevelopmentPlan(planId);
    const plan = await res.data;
    setSelectedPlan(plan);

    setSelectedPerson(undefined);
    setFamilyMemberPlanItems([]);
    GetFamilyMembers();

    if (selectedPersonId) {
      const planMemberResponse = await api.planmember.getPlanMember(selectedPersonId, planId);
      const planMember = await planMemberResponse.data;
      GetCategories(planMember.PlanMemberID);
    } else {
      GetCategories();
    }
  };

  const GetPlanMemberItems = async (personId: number) => {
    const planId = selectedPlan ? (selectedPlan.DevelopmentPlanId as number) : 0;

    let res: AxiosResponse<PlanMemberItem[]>;
    if (personId !== 0)
      res = await api.destiny.getPlanMemberItemsByPerson(personId, planId, selectedHousehold.HouseholdID);
    else res = await api.destiny.getPlanMemberItemsAssignedAll(planId, selectedHousehold.HouseholdID);

    if (res) {
      const items = await res.data;
      const uniqueCategories: string[] = [];

      items.map(item => {
        if (uniqueCategories.indexOf(item.Category) === -1) {
          uniqueCategories.push(item.Category);
        }
      });

      const ItemGrouping: PlanMemberCategoryItem[] = [];

      uniqueCategories.map(cat => {
        const item: PlanMemberCategoryItem = {
          category: cat,
          items: items.filter(x => x.Category == cat),
        };
        ItemGrouping.push(item);
      });

      setFamilyMemberPlanItems(ItemGrouping);
    }
  };

  const ChangeFamilyMember = async (personId: number[]) => {
    setPersonIdList(personId)
    // const planId = selectedPlan ? (selectedPlan.DevelopmentPlanId as number) : 0;     
    // setSelectedPersonId(personId);
    // if (personId) {
      // const singlePersonId: number = personId;
    //   if (singlePersonId > 0) {
    //     GetPlanMemberItems(singlePersonId);
    //     const person = await api.person.getFull(singlePersonId, selectedHousehold.HouseholdID);
    //     const planMemberResponse = await api.planmember.getPlanMember(personId, planId);
    //     const planMember = await planMemberResponse.data;
    //     setSelectedPlanMemberID(planMember.PlanMemberID);
    //     GetCategories(planMember.PlanMemberID);
    //     setSelectedPerson(person);
    //   } else {
    //     GetPlanMemberItems(0);
    //     setSelectedPerson(undefined);
    //     setSelectedPersonId(0);
    //     GetCategories();
    //   }
    // } else {
    //   setFamilyMemberPlanItems([]);
    //   setSelectedPerson(undefined);
    //   setSelectedPersonId(0);
    //   GetCategories();
    // }
  };

  const AddItemToFamilyMember = async (ItemId: number, ItemType?: string) => {
    notifications.toggleLoading(true);
    const planId = selectedPlan ? (selectedPlan.DevelopmentPlanId as number) : 0;

    if (personIdList.length > 0) {
      if (personIdList.includes(0)) {
        //Add To All Family Members
        let familyMemberIds: number[] = [0];
        if (familyMembers) {
          familyMembers?.map(familyMember => {
            if (familyMember) familyMemberIds?.push(familyMember?.PersonID);
          });

          const data: any = {
            DestinyItemID: ItemId,
            IsAdvisorItem: 0,
            IsComplete: 0,
            PlanId: planId,
            FamilyMemberIds: familyMemberIds,
            HouseholdId: selectedHousehold.HouseholdID,
            isAllFamily: 1,
          };
          const resItem = await api.planmember.addPlanMemberItemAll(data);
          console.log("All Members :", resItem)
        }
        notifications.addSuccessNotification("Item Added To All Family Members")

        GetPlanMemberItems(0);
        GetCategories();
      } else{
        personIdList.map(async (personId:number) =>{
          const resMember = await api.planmember.getPlanMember(personId, planId);
          let planMember = await resMember.data;
  
          if (planMember.PlanMemberID == 0) {
            const resFamilyMember = await api.planmember.addPlanMember({
              DevelopmentPlanID: planId,
              HouseholdID: selectedHousehold.HouseholdID,
              PersonID: personId,
            });
            planMember = await resFamilyMember.data;
          }
  
          const resItem = await api.planmember.addPlanMemberItem({
            DestinyItemID: ItemId,
            IsAdvisorItem: 0,
            isAllFamily: 0,
            IsComplete: 0,
            PlanMemberID: planMember?.PlanMemberID,
            CompletedDate: '2022-05-16T12:42:33.158Z',
          });
          console.log("Other than All Members :", resItem);
          // GetPlanMemberItems(personId);
          // GetCategories(selectedPlanMemberID);
        })
      }
    }

    notifications.toggleLoading(false);
  };

  const removePlanItems = async (comment: Comment, index: number) => {
    const personId = selectedPerson ? selectedPerson.PersonID : 0;
    const planId = selectedPlan ? (selectedPlan.DevelopmentPlanId as number) : 0;

    GetPlanMemberItems(personId);
    GetCategories(selectedPlanMemberID);
  };

  const eventConfig: IDataItemEventConfig = {
    onRemove: removePlanItems,
  };

  const GetCategories = async (PlanMemberID?: number) => {
    let globalItems: DestinyGlobalItem[];

    if (PlanMemberID) {
      const response = await api.destiny.getGlobalItemsAvailable(PlanMemberID);
      globalItems = await response.data;
    } else {
      const response = await api.destiny.getGlobalItems();
      globalItems = await response.data;
    }

    const uniqueCategories: string[] = [];
    globalItems.map(item => {
      if (uniqueCategories.indexOf(item.Category) === -1) {
        uniqueCategories.push(item.Category);
      }
    });

    setCategories(uniqueCategories);

    const uniqueSub: string[] = [];
    globalItems.map(item => {
      if (uniqueSub.indexOf(item.Subcategory) === -1) {
        uniqueSub.push(item.Subcategory);
      }
    });

    setSubcategories(uniqueSub);

    const ItemGrouping: CategoryItem[] = [];

    uniqueCategories.map(cat => {
      const uniqueSubcategories: string[] = [];

      globalItems
        .filter(x => x.Category == cat)
        .map(subItem => {
          if (uniqueSubcategories.indexOf(subItem.Subcategory) === -1) {
            uniqueSubcategories.push(subItem.Subcategory);
          }
        });

      const subcategoryItems: SubcategoryItem[] = [];

      uniqueSubcategories.map(subcat => {
        const subcategoryItem: SubcategoryItem = {
          subcategory: subcat,
          items: globalItems.filter(x => x.Subcategory == subcat),
        };
        subcategoryItems.push(subcategoryItem);
      });

      const item: CategoryItem = {
        category: cat,
        subcategories: subcategoryItems,
      };

      ItemGrouping.push(item);
    });

    setCategoryItems(ItemGrouping);
    setAllCategoryItems(ItemGrouping);
    
  };

  const GetPlans = async () => {
    const plansResponse = await api.developmentPlan.getDevelopmentPlans(selectedHousehold.HouseholdID);
    const plans = await plansResponse.data;
    setPlans(plans);
  };

  const GetFamilyMembers = async () => {
    const family = await getHouseholdFamily(selectedHousehold.HouseholdID, true);

    const primary1 = family.persons[0];

    let members = [primary1.person];

    const primary2 = family.persons[1];
    members.push(primary2.person);

    primary1?.children?.forEach(child => {
      members.push(child.person);

      child.children?.forEach(grandchild => {
        members.push(grandchild.person);
      });
    });

    setFamilyMembers(members);
  };

  const loadData = async () => {
    const responseModule = await api.clariataModule.get('Destiny');

    const clariataModule = await responseModule.data;

    setModuleOverview(clariataModule.ModuleOverview);
    setModuleName(clariataModule.ModuleName);
    setIsActive(clariataModule.IsActive);
    setIsActiveTrial(clariataModule.IsActive);

    if (clariataModule.IsActive || clariataModule.IsActiveTrial) {
      GetPlans();
      GetFamilyMembers();
      GetCategories();
    }
  };

const selectCategory = async (category: string[]) => {
  console.log(category);
  if(category.length > 0)
  {
    let categoryFilters: string[] = selectedCategories;
    category.map((c) => {
      if(categoryFilters.indexOf(c) === -1)
        categoryFilters.push(c);
    });
    setSelectedCategories(categoryFilters);
  }
  else
  {
    setSelectedCategories([]);
  }
  filterGlobalItems();
}

const selectSubcategory = async (subcategory: string[]) => {

  if(subcategory.length > 0)
  {
    let subcategoryFilters: string[] = selectedSubcategories;
    subcategory.map((sc) => {
      if(subcategoryFilters.indexOf(sc) === -1)
        subcategoryFilters.push(sc);
    });
    setSelectedSubcategories(subcategory)
  }
  else
  {
    setSelectedSubcategories([]);
  }
  
  filterGlobalItems();
}

const selectItemType = (itemType: string[]) => {

  if(itemType.length > 0)
  {
    let itemTypeFilters: string[] = selectedItemTypes;
    itemType.map((it) => {
      if(itemTypeFilters.indexOf(it) === -1)
        itemTypeFilters.push(it);
    });
    setSelectedItemTypes(itemType);
  }
  else
  {
    setSelectedItemTypes([]);
  }
  filterGlobalItems();
}

const filterGlobalItems = async () => {

  let globalItems: DestinyGlobalItem[];

    if (selectedPlanMemberID) {
      const response = await api.destiny.getGlobalItemsAvailable(selectedPlanMemberID);
      globalItems = await response.data;
    } else {
      const response = await api.destiny.getGlobalItems();
      globalItems = await response.data;
    }

    let filteredDestinyItems: DestinyGlobalItem[];

    if(selectedCategories.length > 0)
    {
      let categoryFilteredDestinyItems : DestinyGlobalItem[] = [];
      selectedCategories.forEach((cf: String) => {
        let categoryDestinyItems = globalItems.filter(gi => gi.Category == cf);
        categoryDestinyItems.map(item => {
          categoryFilteredDestinyItems.push(item);
        }
        )
      });
      
      filteredDestinyItems = categoryFilteredDestinyItems;
    }
    else
    {
      filteredDestinyItems = globalItems;
    }

    if(selectedSubcategories.length > 0)
    {
      let subcategoryFilteredDestinyItems : any = [];
      if(filteredDestinyItems.length > 0){
        selectedSubcategories.forEach((sf: String) => {
          let subcategoryDestinyItems = filteredDestinyItems.filter(fi => fi.Subcategory == sf);
          subcategoryDestinyItems.map(item => {
            subcategoryFilteredDestinyItems.push(item);
          })
        })

          filteredDestinyItems = subcategoryFilteredDestinyItems;
        }
    }

    if(selectedItemTypes.length > 0)
    {
      let itemTypeFilteredDestinyItems : any = [];
      if(filteredDestinyItems.length > 0) {
        selectedItemTypes.forEach((itf: String) => {
          let itemTypeDestinyItems = filteredDestinyItems.filter(fi => fi.ItemType == itf);  
          itemTypeDestinyItems.map(item => {
            itemTypeFilteredDestinyItems.push(item);
          })
        })

          filteredDestinyItems = itemTypeFilteredDestinyItems;
      }
    }

    const uniqueCategories: string[] = [];
    filteredDestinyItems.map(item => {
      if (uniqueCategories.indexOf(item.Category) === -1) {
        uniqueCategories.push(item.Category);
      }
    });

    const ItemGrouping: CategoryItem[] = [];

    uniqueCategories.map(cat => {
      const uniqueSubcategories: string[] = [];

      filteredDestinyItems
        .filter(x => x.Category == cat)
        .map(subItem => {
          if (uniqueSubcategories.indexOf(subItem.Subcategory) === -1) {
            uniqueSubcategories.push(subItem.Subcategory);
          }
        });

      const subcategoryItems: SubcategoryItem[] = [];

      uniqueSubcategories.map(subcat => {
        const subcategoryItem: SubcategoryItem = {
          subcategory: subcat,
          items: filteredDestinyItems.filter(x => x.Subcategory == subcat),
        };
        subcategoryItems.push(subcategoryItem);
      });

      const item: CategoryItem = {
        category: cat,
        subcategories: subcategoryItems,
      };

      ItemGrouping.push(item);
    });

    setCategoryItems(ItemGrouping);
  }  

  const toggleFilter = async () => {

    if(filterVisible == true)
    {
      setSelectedCategories([]);
      setSelectedSubcategories([]);
      setSelectedItemTypes([]);
      GetCategories();
      setFilterVisible(false);
    }
    else
    {
      setFilterVisible(true);
    }


  }

  useEffect(() => {
    loadData();
  }, [Card]);

  if (isActive) {
    return (
      <>
        <Card>
          <CardContent>
            <Grid container spacing={1}>
              <Grid item xs={3}>
                <div className={classnames('card-header-image', styles.header_bg)}></div>
              </Grid>
              <Grid item xs={4}>
                {' '}
                <div className={classnames('textMUI', styles.textMUI)}>
                  <p>
                    How to Prepare for the Future? Tools to assist in developing a family legacy. A “how to” guide for
                    implementing the strategy. What does the family need to learn to increase the probability that their
                    family capital will be a resource for generations to come? Destiny provides the family with a set of
                    tools and information to assist in perpetuating their legacy. The Destiny step of the process is the
                    “how-to” guide for families who are thinking multi-generationally about their future.
                  </p>
                </div>
              </Grid>
              <Grid xs={2} />
              
            </Grid>
            <DestinyWrapper>
              <div>
                <DestinyFilter categories={categories} subcategories={subcategories} itemTypes={itemTypes} filterVisible={filterVisible} 
                showFilter={() => { 
                  toggleFilter()

                  setFilterVisible(!filterVisible);
                  
                }
                }
                onCategorySelected={selectCategory} onSubcategorySelected={selectSubcategory} onItemTypeSelected={selectItemType} />
              </div>
              <Grid container spacing={1}>                
                  <Grid item xs={2} lg={4} md={2}>
                  <div style={{ marginLeft: '42px' }}>
                    <DestinyPlanSide
                      CreatePlan={CreatePlan}
                      IsModalOpen={modalOpen}
                      OpenModal={OpenModal}
                      CloseModal={CloseModal}
                      OnChange={SelectPlan}
                      DevelopmentPlans={plans}
                      AddItemToFamilyMember={AddItemToFamilyMember}
                      GlobalItems={categoryItems}
                    />
                    </div>
                  </Grid>
                
                <Grid item xs={6} lg={8} md={8}>
                  {selectedPlan ? (
                    <>
                      <DestinyPlanHeader
                        plan={selectedPlan}
                        familyName={selectedHousehold.HouseholdName}
                        familyMembers={familyMembers}
                        onChange={ChangeFamilyMember}
                        selectedFamilyMemberId={selectedPersonId}
                      />
                      <DestinyPlanDetails
                        planMemberItems={familyMemberPlanItems}
                        familyMember={familyMember}
                        person={selectedPerson}
                        planId={selectedPlan.DevelopmentPlanId}
                        eventConfig={eventConfig}
                      />
                    </>
                  ) : null}
                </Grid>
              </Grid>
            </DestinyWrapper>
          </CardContent>
        </Card>
      </>
    );
  } else {
    return (
      <>
        <Card>
          <CardContent>
            <div className={classnames('card-header-image', styles.header_bg)}></div>
            {/* <div>{moduleOverview}</div> */}
          </CardContent>
        </Card>
      </>
    );
  }
};

export default Destiny;
