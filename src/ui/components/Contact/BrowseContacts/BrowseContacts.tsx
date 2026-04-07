import React, {ReactElement, useEffect, useState} from 'react';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import styles from './BrowseContacts.module.scss';
import classnames from 'classnames';
import {Button, FormControl, Grid, InputLabel, MenuItem, Select, TextField, Tooltip} from "@material-ui/core";
import ContactCard from "~/ui/components/Contact/ContactCard";
import CardHeader from "@material-ui/core/CardHeader";
import IconButton from "@material-ui/core/IconButton";
import Icon from "@material-ui/core/Icon";
import BrowseContactsItem from "~/ui/components/Contact/BrowseContactsItem";
import {Person} from "~/types/api/person";
import {Alert} from "@material-ui/lab";
import {PersonTypeFilters, PersonTypesLabels} from "~/ui/constants/person";

import usePagination from "~/ui/hooks/usePagination";
import useUserInput from "~/ui/hooks/useUserInput";
import useSearchable from "~/ui/hooks/useSearchable";
import {OwnerType, PersonType} from "~/ui/constants/api";
import useGroupable from "~/ui/hooks/useGroupable";
import DataWrapper from "~/ui/components/Data/DataWrapper";
import useSortable from "~/ui/hooks/useSortable";
import {SortDirection} from "~/ui/constants/data";
import EditContact from "~/ui/components/Contact/EditContact";
import useNotifications from '~/ui/hooks/useNotifications';
import initialValues from "~/ui/components/Contact/EditContact/form/initialValues";
import Modal from "~/ui/components/Dialogs/Modal";
import Resource from '../../Resource';
import { fetcher } from '~/types/api/fetcher';
import useSWR, { mutate } from 'swr';
import { getAccessToken } from '~/services/auth';
import { useStoreActions, useStoreState } from "~/store/hooks";
import Link from 'next/dist/client/link';
import paths from '~/ui/constants/paths';
import UnsavedPopup from '../../Dialogs/UnsavedPopup';
import { MultiSelectTreePropsContext } from '@progress/kendo-react-dropdowns';

interface IProps {
  selectedHouseholdId: number
}

const BrowseContacts = ({selectedHouseholdId}: IProps ): ReactElement => {

  const {contactId} = useStoreState((state) => state.selected);
  const { onSelectContact } = useStoreActions(actions => actions.selected);
  const {onSelect} = useStoreActions(actions => actions.person);
  const url =  `${process.env.NEXT_PUBLIC_API_URL}/household/${selectedHouseholdId}/person/list`;
  const { data: persons, mutate} = useSWR<Person[]>([url, getAccessToken()], fetcher, {refreshInterval: 200});
  const [isNewPerson, setIsNewPerson] = useState<boolean>(false); 

  const notifications = useNotifications();

  const [newPerson, setNewPerson ] = React.useState<any|undefined>(undefined)
  const [selectedPerson, setSelectedPerson] = React.useState<Person | undefined>();
  const [head, setHead ] = React.useState<Person | undefined>();
  const [showEditDialog, setShowEditDialog] = React.useState(false);
  const [needsEdit, setNeedsEdit] = useState<boolean>(false)
  const [hideDead, setHideDead] = useState<boolean>(false)
  const [filters,setfilters]=useState<any|undefined|null>(PersonType.ALL);
  const [showResourceModal, setShowResourceModal] = React.useState<boolean>(false);
  const [isDirty, setIsDirty] = useState(false);
  const [popup ,setPopup] = useState<boolean>(false);
  const { unsaved } = useStoreState(state => state.contact);
  const { onSetSaved } = useStoreActions(actions => actions.contact);

  const notDeadPeople = persons?.filter(p => !p.Deceased) ?? []

  const closeEdit = () => {
    mutate(); 
    setNeedsEdit(false);
    setShowEditDialog(false);
    setNewPerson(undefined);
  }

  const showEdit = () => {
    setNeedsEdit(true);
  }

  // Search and filters.
  const searchText = useUserInput("");
  const searchableItems = useSearchable(
    hideDead ? notDeadPeople : persons,
    searchText.value,
    (item: Person | undefined) => [`${item?.FirstName} ${item?.PreferredName} ${item?.LastName}`]
  );

  //filters
  const filterValue = useUserInput(PersonType.ALL);
  const filterableItems = useSearchable(
    searchableItems,
    filterValue.value,
    (item: Person | undefined) => [String(item?.PersonTypeID)]
  );
  const handleChange=(e: any)=>{
    // setfilters(e.target.value)
    filterValue.setValue(e.target.value);
  }

  // Sorting
  const [sortDirection, setSortDirection] = useState(SortDirection.ASC);
  const sortableItems = useSortable(
    filterableItems,
    sortDirection,
    (item: Person | undefined) => [`${item?.PreferredName && item?.PreferredName !== '' ? item?.PreferredName : item?.FirstName}`],
  );

  // Grouping
  const [isGrouped, setIsGrouped] = useState(false);
  const groupableItems = useGroupable(
    sortableItems,
    isGrouped,
    'PersonTypeID',
    PersonTypesLabels
  );

  // Pagination
  const paginator = usePagination(groupableItems, 8);

  if(needsEdit)
    window.onbeforeunload = () => "The contact has unsaved data"
  else
    window.onbeforeunload = null

  useEffect(() => {
    if(contactId != 0)
    {
      const person = persons?.find((p : Person) => p.PersonID === contactId)
      setSelectedPerson(person);
      setHead(person);
      const select = async () => {
        notifications.toggleLoading(true);
        // await onSelect({
        //   head,
        //   person
        // });
        notifications.toggleLoading(false);
      }

      select().then();
    }
  }, [persons]);

  const selectContact = async (id: number) => {
    onSelectContact(id);
    const person = persons?.find((p : Person) => p.PersonID === id);
    onSelect({person: person});
    setSelectedPerson(person);
    
  }

  const closeContact = async () => {
    mutate();
    setShowEditDialog(false);
  }

  return (
    <>
      <div style={{textAlign: "right", marginLeft: "20px", marginBottom: "20px"}}>
        <Link href={{
          pathname: paths.MODULE_RESOURCES,
          query: { module : "Contacts" },
          }}
          passHref
        >
          <a rel="noopener noreferrer" target="_blank">
            <Button title="Resources" color="primary" size="large" variant="contained">Checklist/Resources</Button>
          </a>
        </Link>
      </div>      
      <Grid container spacing={1}>
        <Grid item xs={3}>
          <Card className={classnames(styles.root)}>
            <CardHeader title="Browse Contacts"
                        action={
                          <>
                            <Tooltip title="Sort Ascending">
                              <IconButton color={ sortDirection === SortDirection.ASC ? 'primary' : 'default'}
                                          onClick={() => setSortDirection(SortDirection.ASC)}>
                                <Icon>arrow_downward</Icon>
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Sort Descending">
                              <IconButton color={ sortDirection === SortDirection.DESC ? 'primary' : 'default'}
                                          onClick={() => setSortDirection(SortDirection.DESC)}>
                                <Icon>arrow_upward</Icon>
                              </IconButton>
                            </Tooltip>
                          </>
                        } />
            <CardContent>
              <Grid container className="m-b-10">
                <Grid item xs={6}/>
                <Grid item xs={6} className="text-right">
                  {newPerson ? (
                      <Button onClick={() => { 
                          setNewPerson(undefined);
                          closeEdit();
                      }}
                              variant="contained"
                              color='default'>
                        Cancel
                      </Button>
                  ) : (
                      <Button onClick={() => {
                        setNewPerson(initialValues)
                        onSelectContact(undefined);
                        setIsNewPerson(true);
                        //onSelect({})
                      }}
                              variant="contained"
                              color='primary'>
                        Add Contact
                      </Button>
                  )}
                </Grid>
              </Grid>
              <Grid container className="m-b-10">
                <Grid item xs={12} className="text-right">
                  <Button onClick={() => {
                    setHideDead(!hideDead)
                    paginator.jump(0)
                  }}
                          variant="contained"
                          color={hideDead ? "primary" : "default"}>
                    {hideDead ? "Show Deceased" : "Hide Deceased"}
                  </Button>
                </Grid>
              </Grid>
              <div className="m-b-5">
                <Grid container spacing={1}>
                  <Grid item xs={6}>
                    <TextField id="standard-basic"
                               label="Search"
                               placeholder="Search"
                               fullWidth={true}
                               {...searchText} />
                  </Grid>
                  <Grid item xs={4}>
                    <FormControl fullWidth={true}>
                      <InputLabel id="demo-simple-select-label">Type</InputLabel>
                      <Select labelId="demo-simple-select-label"
                              fullWidth={true}
                              value={filterValue.value}
                              defaultValue={filterValue.value}
                              onChange={handleChange}
                              // {...filterValue}
                              MenuProps={{
                                anchorOrigin: {
                                  vertical: "bottom",
                                  horizontal: "left"
                                },
                                transformOrigin: {
                                  vertical: "top",
                                  horizontal: "left"
                                },
                                getContentAnchorEl: null
                              }}>
                        {PersonTypeFilters.map((item: any, index: number) => {
                          return (
                              <MenuItem key={index} value={item.value}>{item.label}</MenuItem>
                          )
                        })}
                      </Select>
                    </FormControl>
                  </Grid>
                  {/* <Grid item xs={2}>
                    <Tooltip title="Group by type">
                      <IconButton onClick={() => setIsGrouped(!isGrouped)}
                                  color={isGrouped ? 'primary' : 'default'}>
                        <Icon>view_list</Icon>
                      </IconButton>
                    </Tooltip>
                  </Grid> */}
                </Grid>
              </div>
              <DataWrapper isGrouped={isGrouped}
                           paginator={paginator}
                           componentProps={{
                             personTypeID:filters,
                             noSelection: newPerson,
                             onSelectPerson: (id: number) => {
                              if(isDirty)
                              {
                                console.log("Dirty");
                                setPopup(true);
                              }
                              else
                              {
                                console.log("Not Dirty")
                                setNewPerson(undefined);
                                onSelectContact(id);
                                selectContact(id);
                                closeEdit();
                              }
                             }
                           }}
                           keyLabel="PersonID"
                           propLabel="person"
                           component={BrowseContactsItem} />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={9}>
          { selectedPerson || newPerson ?
              <ContactCard
                  isEditing={needsEdit || newPerson} 
                  closeEdit={closeEdit}
                  showEdit={showEdit}
                  afterSave={() => closeEdit()}
                  person={newPerson ? newPerson : selectedPerson}
                  ownerType={OwnerType.PERSON}
                  household={contactId}
                  key={newPerson ? 'new' : `${selectedPerson?.PersonID}-${selectedPerson?.LastModifiedDate}`}
                  newPerson={newPerson != undefined ? true : false}
                  isNewPerson={isNewPerson}
                  setIsNewPerson={setIsNewPerson}
                  markIsDirty={(value: boolean) => 
                    {
                      console.log("Dirty Flag", value);
                      onSetSaved(value);
                      setIsDirty(value)}
                    }
                  exit={() => { 
                    if(isDirty)
                      setPopup(true);
                    else
                      closeEdit();
                  }}
                  />
              : head ?
                  <ContactCard person={head} household={contactId} ownerType={OwnerType.PERSON} isEditing={needsEdit} closeEdit={closeEdit} showEdit={showEdit} markIsDirty={(value: boolean) => 
                    {
                      console.log("Dirty Flag", value);
                      onSetSaved(value);
                      setIsDirty(value)}
                    }
                    exit={() => { 
                      if(isDirty)
                        setPopup(true);
                      else
                        closeEdit();
                    }}
                    />
                  :
                  <Alert severity="info">Please select a contact to view.</Alert>
          }
        </Grid>
      </Grid>
      {/* <EditContact isOpen={showEditDialog} onClose={() => closeContact()}/> */}
      <UnsavedPopup
                            isOpen={popup}
                            onCancel={() => { 
                                setPopup(false);
                            }
                            }
                            onConfirm={() =>{
                                closeEdit();
                                setPopup(false);                               
                            }}
                        />
    </>
  );
};

export default BrowseContacts;
