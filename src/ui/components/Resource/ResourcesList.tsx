import {
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Button,
  Grid,
  Typography,
  Icon,
  ListItemSecondaryAction,
  Tooltip,
  IconButton,
  Link,
} from '@material-ui/core';
import DocumentIcon from '@material-ui/icons/FileCopy';
import React, { useEffect, useState } from 'react';
import api from '~/services/api';
import { useRouter } from 'next/router';
import { ResourceTypes } from '~/ui/constants/resourceTypes';
import { processServerError } from '~/services/api/errors';
import { Resource } from '~/types/api/resource';
import { Checklist } from '~/types/api/checklist';
import EmptyContainer from '../Containers/EmptyContainer';
import Loader from '../Loader';
import HouseholdChecklistTable from '../HouseholdChecklist';
import { ReportDefinition, ReportType, ReportTypes } from '~/ui/constants/reports';
import { useStoreState } from 'easy-peasy';
import paths from '~/ui/constants/paths';
import { Person } from '~/types/api/person';
import useReports from '~/ui/hooks/useReports';
import AWS from 'aws-sdk';
import axios from 'axios';
import { convertStringArrayToNumberArray } from '~/ui/constants/utils';


export const ResourcesList = () => {
  const { getReportRoutePath } = useReports();
  const [checklists, setChecklists] = useState<any[]>([]);
  const [apiChecklists, setApiChecklists] = useState<Checklist[]>([]);
  const [resourcesByCategory, setResourcesByCategory] = useState<any>();
  const { selectedHousehold } = useStoreState(state => state.household);
  const { persons } = useStoreState(state => state.person);
  const person1 = persons.find((p: Person) => p?.PersonID === selectedHousehold?.PrimaryPerson1ID);
  const person2 = persons.find((p: Person) => p?.PersonID === selectedHousehold?.PrimaryPerson2ID);
  const [isLoading, setLoading] = useState<Boolean>(true);
  const [toggle, setToggle] = useState<boolean>(false);
  const checklistEmptyMessage = 'No Checklists found';
  const resourcesEmptyMessage = 'No Resources found';

  const router = useRouter();
  const { query } = router;
  const { module } = query;
  const moduleNameLowerCase = String(module)?.toLowerCase();

  const handleRoute = (reportType: ReportType) => {
    const pathName = getReportRoutePath(reportType);
    return pathName;
  };

  const getChecklistNames = async (list: Array<Resource>) => {
    const checklists = list.map(async item => {
      const id = item?.ResourceUrl.substring(item.ResourceUrl.indexOf('=') + 1);
      return api.checklists.getOneChecklists(Number(id)).then(res => {
        return res?.data;
      });
    });
    return Promise.all(checklists);
  };

  const getSubcategoryItems = (resources: any[]) => {
    const subcategories = resources.reduce(function (r, a) {
      r[a.ResourceCategory] = r[a.ResourceCategory] || [];
      r[a.ResourceCategory].push(a);
      return r;
    }, Object.create(null));
    const orderedItems = Object.keys(subcategories)
      .sort()
      .reduce((obj: any, key: any) => {
        obj[key] = subcategories[key];
        return obj;
      }, {});
    return orderedItems;
  };

  const loadData = async () => {
    try {
      const res = await api.resource.getAllResources();
      const resources = res?.data.filter(item => {
        return item.ResourceModule === module;
      });

      const resChecklists = await api.checklists.getAllChecklists();

      const moduleChecklist = resChecklists.data.filter(x => x.ChecklistType == module);

      resources.forEach((resource, i) => {
        if (resource?.ResourceType === ResourceTypes.CHECKLIST) {
          resources.splice(i, 1);
        }
      });
      const resourcesBySubCategory: any = getSubcategoryItems(resources);

      console.log('Resourcess :', resourcesBySubCategory);

      setResourcesByCategory(resourcesBySubCategory);
      setChecklists(moduleChecklist);
      console.log(checklists);
      setApiChecklists(moduleChecklist);
      setLoading(false);
    } catch (err) {
      processServerError(err, 'ResourcesList.loadData');
    }
  };

  useEffect(() => {
    if (module === undefined) {
      return;
    }
    loadData();
  }, [module]); 

  const downloadFile = async (fileName: string) => {
    
    //const res = await api.document.getResourceFile(fileName);

    const s3bucket = new AWS.S3({
      accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY,
      secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_KEY,
      signatureVersion: 'v4',
      region: process.env.NEXT_PUBLIC_AWS_REGION,
    });
  
    const params = {
      Bucket: process.env.NEXT_PUBLIC_AWS_BUCKET_NAME,
      Expires: 3000,
      Key: `documents/${fileName}`,
    };
  
    const url = await s3bucket
      .getSignedUrlPromise('getObject', params)
      .catch((err) => {
        console.log(err);
      });    
    
    // please note that the responseType is stream
    // const s3response = await axios.get(url as string, {
    //   responseType: 'stream',
    // });

    // receive the data as a read stream
    // const istream = s3response.data;

    // // create a write stream with the path including file name and its extension that you want to store the file in your directory.
    // const ostream = fs.createWriteStream(fullPath);

    // // using node.js pipe method to pipe the writestream
    // istream.pipe(ostream);    

    fetch(url as string).then(response =>
      response.blob().then(blob => {
        let url = window.URL.createObjectURL(blob);
        const w = window.open(url, '_blank');
        w && w.focus()
        // let a = document.createElement('a');
        // a.href = url;
        // a.download = fileName;
        // a.click();
      }),
    );
  };

  if (isLoading) {
    return <Loader />;
  }
  return (
    <div>
      <Grid container spacing={1}>
        <Grid item xs={2}>
          <Button
            style={{ marginBottom: '20px' }}
            title="Resources"
            color="primary"
            size="medium"
            variant="contained"
            onClick={() => setToggle(!toggle)}
          >
            {toggle ? 'Show Checklist' : 'Show Resources'}
          </Button>
        </Grid>
        <Grid item xs={3}></Grid>
        <Grid item xs={4}>
          <Typography variant="h4" gutterBottom>
            {module} {toggle ? 'Resources' : 'Checklist'}
          </Typography>
        </Grid>
        <Grid item xs={4}></Grid>
      </Grid>
      {toggle && Object.keys(resourcesByCategory).length > 0
        ? Object.keys(resourcesByCategory).map((keyName, i) => {
            return (
              <List
                style={{
                  listStyleType: 'disc',
                }}
              >
                <ListItem>
                  <ListItemIcon>
                    <DocumentIcon />
                  </ListItemIcon>
                  <ListItemText style={{ marginLeft: '-27px' }} primary={keyName} />
                </ListItem>
                {resourcesByCategory[keyName]?.map((item: Resource) => {
                  return item?.ResourceType === ResourceTypes.DOCUMENT ? (
                    <ListItem
                      style={{ paddingLeft: '60px', paddingTop: 'unset', paddingBottom: 'unset' }}
                      component="span"
                      key={i}
                      onClick={() => downloadFile(item?.ResourceUrl)}
                    >
                      <ListItemText
                        style={{
                          color: 'blue',
                          display: 'list-item',
                          paddingLeft: '0px',
                          paddingTop: 'unset',
                          paddingBottom: 'unset',
                        }}
                        primary={item?.ResourceTitle}
                      />
                    </ListItem>
                  ) : (
                    <ListItem
                      style={{ paddingLeft: '60px', paddingTop: 'unset', paddingBottom: 'unset' }}
                      component="a"
                      href={`${item?.ResourceUrl}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      key={i}
                    >
                      <ListItemText
                        style={{
                          display: 'list-item',
                          paddingLeft: '0px',
                          paddingTop: 'unset',
                          paddingBottom: 'unset',
                        }}
                        primary={item?.ResourceTitle}
                      />
                    </ListItem>
                  );
                })}
              </List>
            );
          })
        : null}
      {toggle ? (
        <>
          {Object.keys(ReportTypes)?.filter(reportKey => moduleNameLowerCase in ReportTypes[reportKey]).length > 0 ? (
            <List>
              <ListItem>
                <ListItemIcon>
                  <DocumentIcon />
                </ListItemIcon>
                <ListItemText style={{ marginLeft: '-27px' }} primary={'Reports'} />
              </ListItem>
            </List>
          ) : null}
          {Object.keys(ReportTypes)
            ?.filter(reportKey => moduleNameLowerCase in ReportTypes[reportKey] && !ReportTypes[reportKey]?.editable)
            ?.map((reportKey: any, index: number) => {
              const report: ReportDefinition = ReportTypes[reportKey];
              if (
                (report.type === ReportType.PERSONAL_STORY && !selectedHousehold.PrimaryPerson1ID) ||
                (report.type === ReportType.PERSONAL_STORY_2 && !selectedHousehold.PrimaryPerson2ID)
              ) {
              } else {
                return (
                  <ListItem style={{ display: 'list-item', marginLeft: '32px', width: '375px', padding: 'unset' }}>
                    <a
                      rel="noopener noreferrer"
                      href={handleRoute(report?.type)}
                      style={{ textDecoration: 'none' }}
                    >
                      <Button style={{ color: '#0000fe' }}>
                        {(report.type === ReportType.LIFE_GRAPH
                          ? 'Dimensions of LIfe '
                          : ReportType.LIFE_GRAPH_METRIC === report.type
                          ? 'Metrics of Success '
                          : '') +
                          report.name +
                          ' ' +
                          (report.type === ReportType.PERSONAL_STORY
                            ? person1?.FirstName
                            : ReportType.PERSONAL_STORY_2 === report.type
                            ? person2?.FirstName
                            : '')}
                      </Button>
                    </a>
                  </ListItem>
                );
              }
            })}
        </>
      ) : null}

      {toggle &&
      Object.keys(resourcesByCategory).length < 1 &&
      Object.keys(ReportTypes)?.filter(reportKey => moduleNameLowerCase in ReportTypes[reportKey]).length < 1 ? (
        <EmptyContainer text={resourcesEmptyMessage}></EmptyContainer>
      ) : null}

      {!toggle && apiChecklists.length > 0 ? (
        <HouseholdChecklistTable module={module} checklistData={apiChecklists[0]} />
      ) : !toggle ? (
        <EmptyContainer text={checklistEmptyMessage}></EmptyContainer>
      ) : null}
    </div>
  );
};
