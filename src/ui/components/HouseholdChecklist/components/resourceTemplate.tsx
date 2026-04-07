import DataTableCell from "~/ui/components/Data/DataTableCell";
import React from "react";
import StringValue from "~/ui/components/Data/Formatters/StringValue";
import { Chip, Icon, List, ListItem, ListItemIcon, ListItemText } from "@material-ui/core";
import router from "next/router";
import { ReportDefinition, ReportType, ReportTypes } from "~/ui/constants/reports";
import useReports from "~/ui/hooks/useReports";
import api from "~/services/api";
import AWS from "aws-sdk";

const resourceTemplate = ({props}: any) => {

  const {
    getReportRoutePath
  } = useReports();

  const handleRoute = (reportType: ReportType) => {
    const pathName = getReportRoutePath(reportType);
    router.push(pathName);
  }

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

  return (
    <>
      <DataTableCell>
        <div style={{display: "flex", flexDirection: "column"}}>
        <List>
        {
          props?.checklistItem?.ChecklistItemReport 
          &&
          props?.checklistItem?.ChecklistItemReport?.length > 0
          ?
          props?.checklistItem?.ChecklistItemReport?.split(",").map((reportItem:any, i: number) =>{
            return (
              <>
              <ListItem key={"r"+ i} onClick={() => handleRoute(reportItem)}>
                <ListItemIcon>
                    <Icon>{ReportTypes[reportItem]?.icon}</Icon>
                </ListItemIcon>
                <ListItemText primary={ReportTypes[reportItem]?.name} />                
              </ListItem>
              </>
            )
          })
          :
          null
        }
        {
          props?.checklistItem?.Resources 
          &&
          props?.checklistItem?.Resources?.length > 0
          ?
          props?.checklistItem?.Resources?.map((resource:any, i: number) =>{
            return (
              <>
              <ListItem key={"s"+ i} onClick={() => downloadFile(resource?.ResourceUrl)}>                
                <ListItemText primary={resource?.ResourceTitle} />                
              </ListItem>
              </>
            )
          })
          :
          null
        }
        </List>
        </div>
      </DataTableCell>
    </>
  )
}

export default resourceTemplate;
