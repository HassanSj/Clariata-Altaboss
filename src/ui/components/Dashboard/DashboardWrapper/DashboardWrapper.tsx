import React from 'react';
import classnames from "classnames";
import styles from "./DashboardWrapper.module.scss";
import paths from "~/ui/constants/paths";
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import {Tab, Tabs} from '@material-ui/core';
import EditHousehold from "~/ui/components/Household/EditHousehold";
import PhotoForm from "~/ui/components/Contact/PhotoForm";
import {OwnerType} from "~/ui/constants/api";
import {isNullOrUndefined} from "~/ui/constants/utils";
import {NavigationTab, NavigationTabs} from "~/ui/constants/navigations";
import {useRouter} from "next/router";
import {useStoreActions, useStoreState} from "~/store/hooks";
import EmptyContainer from "~/ui/components/Containers/EmptyContainer";
import { getAccessToken } from '~/services/auth';
import { Household } from '~/types/api/household';
import { fetcher } from '~/types/api/fetcher';
import useSWR from 'swr';
import UnsavedPopup from '../../Dialogs/UnsavedPopup';

interface IProps {
  tab: NavigationTab,
  children: any;
}

const DashboardWrapper = ({ children }: IProps) => {
  const router = useRouter();
  const { householdId } = useStoreState((state) => state.selected);

  const urlHousehold = `${process.env.NEXT_PUBLIC_API_URL}/household/${householdId}`;
  const token = getAccessToken()
  const { data: selectedHousehold} = useSWR<Household>([urlHousehold, token], fetcher);

  // Households
  const [showEditHouseholdDialog, setShowEditHouseholdDialog] = React.useState(false);
  //const { selectedHousehold,households } = useStoreState((state) => state.household);
  let hasSelectedHousehold ; 

  // Household
  const handleHideEditHouseholdDialog = () => {
    setShowEditHouseholdDialog(false);
  }
  const [lastClickType, setLastClickType] = React.useState<NavigationTab>();
  const [contactConfirmSaved, setContactUnsaved] = React.useState<boolean>(false);
  const { onSetSaved } = useStoreActions(actions => actions.contact);
  const { unsaved } = useStoreState(state => state.contact);
  // Tabs
  const selectedTab = () => {
    let result: number = -1;
    for (const [key, value] of Object.entries(NavigationTabs)) {
      if (value.route.includes(router.pathname)) {
        result = value.tab;
        break;
      }
    }
    return result;
  }
  const selectTab = (nav: NavigationTab) => {
    return router.push(NavigationTabs[nav].route);
  }

  // Photo form
  const [showPhotoDialog, setShowPhotoDialog] = React.useState(false);
  const handleHidePhotoDialog = () => {
    setShowPhotoDialog(false);
  }

  return (
    <>
        <div>
          <h1 className={styles.family_header}>
            {selectedHousehold?.HouseholdName}
          </h1>
          <Card>
            <CardContent>
              <div className={styles.footer}>
                <Tabs
                  className={classnames(styles.tabs)}
                  indicatorColor="secondary"
                  textColor="secondary"
                  aria-label="disabled tabs example"
                  value={selectedTab()}
                  centered={true}
                >
                  <Tab id="nav-tab-0"
                       label="Home"
                       key={NavigationTabs[NavigationTab.HOME].tab}
                       value={NavigationTabs[NavigationTab.HOME].tab}
                       onClick={() =>{
                        if(unsaved){
                          setLastClickType(NavigationTab.HOME);
                          setContactUnsaved(true)
                        }
                        else{
                          selectTab(NavigationTab.HOME)
                        }
                      }}
                       selected={paths.DASHBOARD === router.asPath}/>
                  <Tab id="nav-tab-4"
                       label="Family Details"
                       key={NavigationTabs[NavigationTab.PROFILE].tab}
                       value={NavigationTabs[NavigationTab.PROFILE].tab}
                       onClick={() =>{
                        if(unsaved){
                          setLastClickType(NavigationTab.PROFILE);
                          setContactUnsaved(true)
                        }
                        else {
                          selectTab(NavigationTab.PROFILE)
                        }
                      }}
                       selected={paths.PROFILE === router.asPath} />
                  <Tab id="nav-tab-3"
                       label="Contacts"
                       key={NavigationTabs[NavigationTab.CONTACTS].tab}
                       value={NavigationTabs[NavigationTab.CONTACTS].tab}
                       onClick={() => {
                        if(unsaved){
                          setLastClickType(NavigationTab.CONTACTS);
                          setContactUnsaved(true)
                        }
                        else {
                          selectTab(NavigationTab.CONTACTS)
                        }
                      }}
                       selected={paths.CONTACTS === router.asPath} />
                  <Tab id="nav-tab-5"
                       label="Report Manager"
                       key={NavigationTabs[NavigationTab.REPORTS].tab}
                       value={NavigationTabs[NavigationTab.REPORTS].tab}
                       onClick={() =>{
                        if(unsaved){
                          setLastClickType(NavigationTab.REPORTS);
                          setContactUnsaved(true)
                        }
                        else {
                          selectTab(NavigationTab.REPORTS)
                        }
                      }}
                       selected={router.asPath.toLowerCase().startsWith("/reports")} />
                </Tabs>
              </div>
            </CardContent>
          </Card>
          <br />
          {children}
        </div>
      <EditHousehold PermissionEdit={null} household={selectedHousehold}
                     isOpen={showEditHouseholdDialog}
                     onClose={handleHideEditHouseholdDialog}></EditHousehold>
      <PhotoForm item={selectedHousehold?.Photo}
                 isOpen={showPhotoDialog}
                 onClose={handleHidePhotoDialog}
                 ownerType={OwnerType.HOUSEHOLD}></PhotoForm>
      <UnsavedPopup
        isOpen={contactConfirmSaved}
        onCancel={() => setContactUnsaved(false)}
        onConfirm={async () => {
          setContactUnsaved(false);
          if(lastClickType){
            await selectTab(lastClickType);
          }
          await onSetSaved({
            saved: false,
          });
        }}
      />
    </>
  );
};

export default DashboardWrapper;
