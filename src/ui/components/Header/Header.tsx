import React, { ReactElement, useEffect } from 'react';

import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Badge from '@material-ui/core/Badge';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import SettingsIcon from '@material-ui/icons/Settings';
import Link from 'next/link';

import classnames from 'classnames';
import { NextRouter, useRouter } from 'next/router';
import styles from './Header.module.scss';
import logo from '../../../../public/images/logo/logo.png';
import { Box, Button, ButtonGroup, Grid, Menu, MenuItem, Paper, Tooltip } from '@material-ui/core';
import Icon from '@material-ui/core/Icon';
import { trimString } from '~/ui/constants/utils';
import EditHousehold from '~/ui/components/Household/EditHousehold';
import EditContact from '~/ui/components/Contact/EditContact';
import { useStoreActions, useStoreState } from '~/store/hooks';
import EditEvaluation from '~/ui/components/Evaluations/EditEvaluation';
import EditSharing from '~/ui/components/Sharing/EditSharing';
import paths from '~/ui/constants/paths';
import EditActionItem from '~/ui/components/ActionItems/EditActionItem';
import EditPriorityForm from '~/ui/components/Priorities/EditPriorityFormModal';
import UnsavedPopup from '../Dialogs/UnsavedPopup';
import { InterviewDataType, InterviewType } from '~/ui/constants/interview';
import select from '~/store/household/actions/select';
import { deleteAccessToken, getAccessToken, isAuthenticated, setAuthenticated } from '~/services/auth';
import { fetcher } from '~/types/api/fetcher';
import useSWR from 'swr';
import { Household } from '~/types/api/household';
import api from '~/services/api';
import { Interview } from '~/types/api/interview';
import selectDiscoverInterview from '~/store/selected/actions/selectDiscoverInterview';
import { ModuleTypes } from '~/ui/constants/modules';
import NoHouseholdSelected from '../Dialogs/NoHouseholdSelected';

const { SETTINGS, HOUSEHOLDS } = paths;

enum HeaderMenuLinks {
  TAB,
  INTERVIEWTAB,
  SETTINGS,
  LOGOUT,
}

function getCurrentPath(router: NextRouter): string {
  return router.asPath.split('?')[0];
}

const Header = (): ReactElement => {
  const router = useRouter();
  const { id } = router.query;
  const {module} = router.query;

  const currentPath = getCurrentPath(router);
  // Navigation and auth actions
  const [quickMenuAnchor, setQuickMenuAnchor] = React.useState<null | HTMLElement>(null);
  const { isSideBarOpen } = useStoreState(state => state.layout);
  const onLogout = useStoreActions(actions => actions.user.onLogout);
  const onCheckAuth = useStoreActions(actions => actions.user.onCheckAuth);
  const onPopulatePermissions = useStoreActions(actions => actions.user.onPopulatePermissions);
  const { isUnsaved } = useStoreState(state => state.interview);
  const { unsaved } = useStoreState(state => state.contact);
  const { onSetIsSaved } = useStoreActions(actions => actions.interview);
  const { onSetSaved } = useStoreActions(actions => actions.contact);
  const { householdId, discoverInterviewId, dreamInterviewId } = useStoreState(state => state.selected);
  const { selectDiscoverInterview, selectDreamInterview} = useStoreActions(actions => actions.selected);

  const [showConfirmUnsaved, setShowConfirmUnsaved] = React.useState<boolean>(false);
  const [contactConfirmSaved, setContactUnsaved] = React.useState<boolean>(false);
  const [lastClickType, setLastClickType] = React.useState<HeaderMenuLinks>();
  const [clickedTab, setClickedTab] = React.useState<string>();
  const [clickedInterview, setClickedInterview] = React.useState<number>();
  const [showNoHouseholdSelected, setShowNoHouseholdSelected] = React.useState<boolean>(false);

  // Auth check
  const checkAuth = async () => {
    const isAuthorized = isAuthenticated();
    if (isAuthorized) {
      startTimer();
    }
    if (!isAuthorized) {
      if(localStorage.getItem("clariata-jwt")){
        sessionStorage.setItem('clariata-jwt',localStorage.getItem("clariata-jwt")!);
        sessionStorage.setItem('SessionGUID',localStorage.getItem("SessionGUID")!);
        sessionStorage.setItem('clariata_authorized',localStorage.getItem('clariata_authorized')!);
        startTimer();
      }
      stopTimer();
    }
  };

  const handleConfirm = () => {
    switch (lastClickType) {
      case HeaderMenuLinks.TAB: {
        if (clickedTab) {
          selectNavItem(clickedTab);
        }
        break;
      }
      case HeaderMenuLinks.INTERVIEWTAB: {
        if (clickedTab && clickedInterview) {
          selectInterview(`${clickedTab}/${encodeURIComponent(clickedInterview)}?showGrid=true`);
        }
        break;
      }
      case HeaderMenuLinks.SETTINGS: {
        settings();
        break;
      }
      case HeaderMenuLinks.LOGOUT: {
        logout();
        break;
      }
      default:
        break;
    }
  };

  // Store interval and delete once session expires
  let timer: any = null;
  const startTimer = () => {
    if (timer) return;
    timer = setInterval(() => {
      checkAuth();
    }, 30000);
  };
  const stopTimer = () => {
    if (!timer) return;
    clearInterval(timer);
    timer = null;
  };

  // Logout
  const logout = async () => {
    deleteAccessToken();
    setAuthenticated(false)
    await onLogout({
      router,
    });
  };

  // Settings
  const settings = async () => {
    router.replace(SETTINGS);
  };

  const SetInterviewIds = async (id: number) => {
    const response = await api.interview.list(id);
    const interviews = response?.data as Interview[]
    
    const discoverInterview = interviews?.filter(interview => interview.InterviewTemplateID == InterviewType.DISCOVER);
    
    if(discoverInterview) {
        selectDiscoverInterview(discoverInterview[0].InterviewID);
    }

    const dreamInterview = interviews?.filter(interview => interview.InterviewTemplateID == InterviewType.DREAM);
    if(dreamInterview){
        selectDreamInterview(dreamInterview[0].InterviewID);        
    }
  }

  // Check auth on initial page load
  useEffect(() => {
    checkAuth();
    onPopulatePermissions(null);
  }, []);

  // Households
  const [showCreateHouseholdDialog, setShowCreateHouseholdDialog] = React.useState(false);
  const [showEditHouseholdDialog, setShowEditHouseholdDialog] = React.useState(false);
  // const { selectedHousehold, households } = useStoreState(state => state.household);
  let selectedHouseholdText;
  const { data: household } = useSWR<Household>([`${process.env.NEXT_PUBLIC_API_URL}/household/${householdId}`, getAccessToken()], fetcher);

  try {

    selectedHouseholdText= 'No household selected';
    if (householdId) {

      selectedHouseholdText = trimString(
        household?.HouseholdName ? household.HouseholdName : 'No household selected',
        35,
      );
    } 

  } catch (e) {
  
  }

  const [showEditContactDialog, setShowEditContactDialog] = React.useState(false);
  const [showEditEvaluationDialog, setShowEditEvaluationDialog] = React.useState(false);
  const [showEditTaskDialog, setShowEditTaskDialog] = React.useState(false);
  const [showEditPermissionDialog, setShowEditPermissionDialog] = React.useState(false);
  const [showEditPriorityDialog, setShowEditPriorityDialog] = React.useState(false);
  // Navigation
  const selectNavItem = async (path: string) => {
    if(householdId != 0)
    {
      await router.push(path);
    }
    else
    {
        if(path == paths.DASHBOARD || path == paths.DIRECTION_PRIORITIES || path == paths.DEEPEN || path == paths.DESTINY)
        {
          setShowNoHouseholdSelected(true);
        }
    }
  };
  const selectInterview = async (path: string) => {
    if(householdId != 0)
    {
      await router.push(path);
    }
    else
    {
      setShowNoHouseholdSelected(true);
    }
  };
  const isAdvisorDashboardSelected = () => {
    return paths.ADVISOR_DASHBOARD === currentPath;
  };
  const isDashboardSelected = () => {
    return (
      paths.DASHBOARD === currentPath ||
      paths.CONTACTS === currentPath ||
      paths.PROFILE === currentPath ||
      paths.REPORTS === currentPath ||
      module === "Contacts" ||
      paths.TIMELINE === currentPath ||
      paths.PROFILE_WORKSHEET === currentPath ||
      paths.CUSTOM_TIMELINE_EVENTS === currentPath
    );
  };
  const isDirectionSelected = () => {
    return (
      paths.DIRECTION_PRIORITIES === currentPath ||
      paths.DIRECTION_CHECKLISTS === currentPath ||
      module === ModuleTypes.DIRECTION
    );
  };
  const isDeepenSelected = () => {
    return paths.DEEPEN === currentPath;
  };
  const isDestinySelected = () => {
    return paths.DESTINY === currentPath;
  };
  const isActiveUsersSelected = () => {
    return paths.ACTIVE_USERS === currentPath;
  };
  const isInterview = () => {
    return currentPath.includes(paths.INTERVIEW);
  };
  const isDreamInterview = () => {
    if(householdId > 0 && dreamInterviewId == 0) {
      SetInterviewIds(householdId);
    };
    return (
      isInterview() && String(id) === String(dreamInterviewId) ||
      paths.DREAM_CHECKLISTS === currentPath ||
      module === ModuleTypes.DREAM
    );
  };
  const isDiscoverInterview = () => {
    if(householdId > 0 && discoverInterviewId == 0) {
      SetInterviewIds(householdId);
    };    
    return (
      
      isInterview() && String(id) === String(discoverInterviewId) ||
      paths.DISCOVER_CHECKLISTS === currentPath ||
      module === ModuleTypes.DISCOVER
    );
  };

  const goToHouseholds = async () => {
    await router.push(HOUSEHOLDS);
  };

  return (
    <>
      <Box>
        <AppBar
          position="absolute"
          className={classnames(
            styles.appBar,
            { [styles.appBarShift]: isSideBarOpen },
            { [styles.appBarMinimized]: !isSideBarOpen },
          )}
        >
          <Toolbar className={classnames(styles.toolbar)}>
            <span className={classnames(styles.title)}>
              <img alt="logo" src={logo} className={classnames(styles.logo)} />
            </span>
            {/* <ButtonGroup
              aria-label="button group"
              className={classnames(styles.horizontalSpaceRight, styles.selectHousehold)}
            >
              <Tooltip title="Change selected household">
                <Button
                  variant="outlined"
                  color="default"
                  onClick={goToHouseholds}
                  startIcon={<Icon>family_restroom</Icon>}
                >
                  <b>Household</b>: {selectedHouseholdText}
                </Button>
              </Tooltip>
              {household ? (
                <Tooltip title={`Edit ${household?.HouseholdName}`}>
                  <Button variant="contained" color="primary" onClick={() => setShowEditHouseholdDialog(true)}>
                    Edit
                  </Button>
                </Tooltip>
              ) : null}
            </ButtonGroup> */}
            <>
              {/*<Tooltip title="Quick add menu">*/}
              {/*  <Button aria-controls="quick-add-menu"*/}
              {/*          aria-haspopup="true"*/}
              {/*          onClick={(event) => setQuickMenuAnchor(event.currentTarget)}*/}
              {/*          variant="contained"*/}
              {/*          color="primary">*/}
              {/*    Quick Add*/}
              {/*  </Button>*/}
              {/*</Tooltip>*/}
              <Menu
                id="quick-add-menu"
                anchorEl={quickMenuAnchor}
                open={Boolean(quickMenuAnchor)}
                onClose={() => setQuickMenuAnchor(null)}
              >
                <MenuItem
                  key="add_household"
                  onClick={() => {
                    setQuickMenuAnchor(null);
                    setShowCreateHouseholdDialog(true);
                  }}
                >
                  Add Household
                </MenuItem>
                <MenuItem
                  key="add_contact"
                  onClick={() => {
                    setQuickMenuAnchor(null);
                    setShowEditContactDialog(true);
                  }}
                >
                  Add Contact
                </MenuItem>
                <MenuItem
                  key="add_priority"
                  onClick={() => {
                    setQuickMenuAnchor(null);
                    setShowEditPriorityDialog(true);
                  }}
                >
                  Add Priority
                </MenuItem>
                <MenuItem
                  key="add_task"
                  onClick={() => {
                    setQuickMenuAnchor(null);
                    setShowEditTaskDialog(true);
                  }}
                >
                  Add Action Step
                </MenuItem>
                <MenuItem
                  key="add_evaluation"
                  onClick={() => {
                    setQuickMenuAnchor(null);
                    setShowEditEvaluationDialog(true);
                  }}
                >
                  Add Client Evaluation
                </MenuItem>
                <MenuItem
                  key="add_permission"
                  onClick={() => {
                    setQuickMenuAnchor(null);
                    setShowEditPermissionDialog(true);
                  }}
                >
                  Add Permission
                </MenuItem>
              </Menu>
            </>
            <div>
            <b>Current Household: {household?.HouseholdName ? household?.HouseholdName : "No Household Selected"} </b>
            </div>
            <Link href="/profile">
              <Tooltip title="Settings">
                <IconButton
                  color="inherit"
                  onClick={() => {
                    if (isUnsaved && (isDreamInterview() || isDiscoverInterview())) {
                      setLastClickType(HeaderMenuLinks.SETTINGS);
                      setShowConfirmUnsaved(isUnsaved);
                    } else {
                      settings();
                    }
                  }}
                >
                  <Badge color="secondary">
                    <SettingsIcon />
                  </Badge>
                </IconButton>
              </Tooltip>
            </Link>
            <Tooltip title="Logout">
              <IconButton
                color="inherit"
                onClick={() => {
                  if (isUnsaved && (isDreamInterview() || isDiscoverInterview())) {
                    setLastClickType(HeaderMenuLinks.LOGOUT);
                    setShowConfirmUnsaved(isUnsaved);
                  } else {
                    logout();
                  }
                }}
              >
                <Badge color="secondary">
                  <ExitToAppIcon />
                </Badge>
              </IconButton>
            </Tooltip>
          </Toolbar>
        </AppBar>
        <Box className={styles.subAppBar_wrapper} p={3}>
          <Paper elevation={1} className={styles.subAppBar}>
            <Grid container spacing={1}>
              <Grid container item xs={12} justifyContent="center">
                <ButtonGroup className={styles.subAppBarNavItems} fullWidth={true} color="primary" size="large">
                  <Button
                    key={paths.ADVISOR_DASHBOARD}
                    className={classnames(styles.nav_item, { [styles.active]: isAdvisorDashboardSelected() })}
                    onClick={() => {
                      if (isUnsaved && (isDreamInterview() || isDiscoverInterview())) {
                        setLastClickType(HeaderMenuLinks.TAB);
                        setClickedTab(paths.ADVISOR_DASHBOARD);
                        setShowConfirmUnsaved(isUnsaved);
                      } 
                      else if(unsaved){
                        setLastClickType(HeaderMenuLinks.TAB);
                        setClickedTab(paths.ADVISOR_DASHBOARD);
                        setContactUnsaved(unsaved);
                      } 
                      else {
                        selectNavItem(paths.ADVISOR_DASHBOARD);
                      }
                    }}
                  >
                    Advisor Dashboard
                  </Button>
                  <Button
                    key={paths.DASHBOARD}
                    className={classnames(styles.nav_item, { [styles.active]: isDashboardSelected() })}
                    onClick={() => {
                      if (isUnsaved && (isDreamInterview() || isDiscoverInterview())) {
                        setLastClickType(HeaderMenuLinks.TAB);
                        setClickedTab(paths.DASHBOARD);
                        setShowConfirmUnsaved(isUnsaved);
                      } 
                      else if(unsaved){
                        setLastClickType(HeaderMenuLinks.TAB);
                        setClickedTab(paths.DASHBOARD);
                        setContactUnsaved(unsaved);
                      } 
                      else {
                        selectNavItem(paths.DASHBOARD);
                      }
                    }}
                  >
                    Client Dashboard
                  </Button>
                  <Button
                    key="interview_discover"
                    className={classnames(styles.nav_item, { [styles.active]: isDiscoverInterview() })}
                    onClick={() => {
                      if (isUnsaved && (isDreamInterview() || isDiscoverInterview())) {
                        setLastClickType(HeaderMenuLinks.INTERVIEWTAB);
                        setClickedTab(paths.INTERVIEW);
                        setClickedInterview(discoverInterviewId);
                        setShowConfirmUnsaved(isUnsaved);
                      }
                      else if(unsaved){
                        setLastClickType(HeaderMenuLinks.INTERVIEWTAB);
                        setClickedTab(paths.INTERVIEW);
                        setClickedInterview(discoverInterviewId);
                        setContactUnsaved(unsaved);
                      } 
                      else {
                        selectInterview(`${paths.INTERVIEW}/${encodeURIComponent(discoverInterviewId)}?showGrid=true`);
                      }
                    }}
                  >
                    Discover
                  </Button>
                  <Button
                    key="interview_dream"
                    className={classnames(styles.nav_item, { [styles.active]: isDreamInterview() })}
                    onClick={() => {
                      if (isUnsaved && (isDreamInterview() || isDiscoverInterview())) {
                        setLastClickType(HeaderMenuLinks.INTERVIEWTAB);
                        setClickedTab(paths.INTERVIEW);
                        setClickedInterview(dreamInterviewId);
                        setShowConfirmUnsaved(isUnsaved);
                      } 
                      else if(unsaved){
                        setLastClickType(HeaderMenuLinks.INTERVIEWTAB);
                        setClickedTab(paths.INTERVIEW);
                        setClickedInterview(dreamInterviewId);
                        setContactUnsaved(unsaved);
                      }
                      else {
                        selectInterview(`${paths.INTERVIEW}/${encodeURIComponent(dreamInterviewId)}?showGrid=true`);
                      }
                    }}
                  >
                    Dream
                  </Button>
                  <Button
                    key={paths.DIRECTION_PRIORITIES}
                    className={classnames(styles.nav_item, { [styles.active]: isDirectionSelected() })}
                    onClick={() => {
                      if (isUnsaved && (isDreamInterview() || isDiscoverInterview())) {
                        setLastClickType(HeaderMenuLinks.TAB);
                        setClickedTab(`${paths.DIRECTION_PRIORITIES}`);
                        setShowConfirmUnsaved(isUnsaved);
                      } 
                      else if(unsaved){
                        setLastClickType(HeaderMenuLinks.TAB);
                        setClickedTab(`${paths.DIRECTION_PRIORITIES}`);
                        setContactUnsaved(unsaved);
                      }
                   
                      else {
                        selectNavItem(`${paths.DIRECTION_PRIORITIES}`);
                      }
                    }}
                  >
                    Direction
                  </Button>
                  <Button
                    key={paths.DEEPEN}
                    className={classnames(styles.nav_item, { [styles.active]: isDeepenSelected() })}
                    onClick={() => {
                      if (isUnsaved && (isDreamInterview() || isDiscoverInterview())) {
                        setLastClickType(HeaderMenuLinks.TAB);
                        setClickedTab(`${paths.DEEPEN}`);
                        setShowConfirmUnsaved(isUnsaved);
                      }    
                      else if(unsaved){
                        setLastClickType(HeaderMenuLinks.TAB);
                        setClickedTab(`${paths.DEEPEN}`);
                        setContactUnsaved(unsaved);
                      }
                      else {
                        selectNavItem(`${paths.DEEPEN}`);
                      }
                    }}
                  >
                    Deepen
                  </Button>
                  <Button
                    key={paths.DESTINY}
                    className={classnames(styles.nav_item, { [styles.active]: isDestinySelected() })}
                    onClick={() => {
                      if (isUnsaved && (isDreamInterview() || isDiscoverInterview())) {
                        setLastClickType(HeaderMenuLinks.TAB);
                        setClickedTab(`${paths.DESTINY}`);
                        setShowConfirmUnsaved(isUnsaved);
                      } 
                      else if(unsaved){
                        setLastClickType(HeaderMenuLinks.TAB);
                        setClickedTab(`${paths.DESTINY}`);
                        setContactUnsaved(unsaved);
                      }
                      else {
                        selectNavItem(`${paths.DESTINY}`);
                      }
                    }}
                  >
                    Destiny
                  </Button>
                  {/* <Button
                    key={paths.ACTIVE_USERS}
                    className={classnames(styles.nav_item, { [styles.active]: isActiveUsersSelected() })}
                    onClick={() => {
                      if (isUnsaved && (isDreamInterview() || isDiscoverInterview())) {
                        setLastClickType(HeaderMenuLinks.TAB);
                        setClickedTab(`${paths.ACTIVE_USERS}`);
                        setShowConfirmUnsaved(isUnsaved);
                      } else {
                        selectNavItem(`${paths.ACTIVE_USERS}`);
                      }
                    }}
                  >
                    Active Users
                  </Button> */}
                </ButtonGroup>
              </Grid>
            </Grid>
          </Paper>
        </Box>
      </Box>
      <EditHousehold
      PermissionEdit={null}
        household={household}
        isOpen={showEditHouseholdDialog}
        onClose={() => setShowEditHouseholdDialog(false)}
      />
      <EditHousehold PermissionEdit={null} isOpen={showCreateHouseholdDialog} onClose={() => setShowCreateHouseholdDialog(false)} />
      <EditContact isOpen={showEditContactDialog} onClose={() => setShowEditContactDialog(false)} markIsDirty={() => console.log("Dirty")} />
      <EditEvaluation isOpen={showEditEvaluationDialog} onClose={() => setShowEditEvaluationDialog(false)} />
      <EditSharing isOpen={showEditPermissionDialog} onClose={() => setShowEditPermissionDialog(false)} />
      <EditActionItem isOpen={showEditTaskDialog} onClose={() => setShowEditTaskDialog(false)} />
      <EditPriorityForm isOpen={showEditPriorityDialog} onClose={() => setShowEditPriorityDialog(false)} />
      <UnsavedPopup
        isOpen={showConfirmUnsaved}
        onCancel={() => setShowConfirmUnsaved(false)}
        onConfirm={async () => {
          setShowConfirmUnsaved(false);
          handleConfirm();
          await onSetIsSaved({
            type: InterviewDataType.FORM,
            saved: false,
          });
        }}
      />
      <UnsavedPopup
        isOpen={contactConfirmSaved}
        onCancel={() => setContactUnsaved(false)}
        onConfirm={async () => {
          setContactUnsaved(false);
          handleConfirm();
          await onSetSaved({
            saved: false,
          });
        }}
      />
      <NoHouseholdSelected open={showNoHouseholdSelected} handleClose={() => setShowNoHouseholdSelected(false)} />
    </>
  );
};

export default Header;
