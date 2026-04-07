import React, { useEffect, useState } from 'react';
import { Grid, ListItem, ListItemText, Select } from '@material-ui/core';
import { DestinyGlobalItem } from '~/types/api/destinyGlobalItem';
import Link from 'next/link';
import moment from 'moment';
import PDFReportExport, { IReportOptions } from "../../../Reports/PDFReportExport/PDFReportExport";
import { PDFExportProps } from "@progress/kendo-react-pdf";
import { DestinyChecklistItem } from '~/types/api/destinyChecklistItem';
import api from '~/services/api';
import Assessment from "../../../../../../public/images/destiny/assessment-sm.png"
import Activity from "../../../../../../public/images/destiny/activity-sm.png"
import Book from "../../../../../../public/images/destiny/book-sm.png"
import Checklist from "../../../../../../public/images/destiny/checklist-sm.png"
import ReferenceExt from "../../../../../../public/images/destiny/external-reference-sm.png"
import ReferenceInt from "../../../../../../public/images/destiny/internal-reference-sm.png"
import Podcast from "../../../../../../public/images/destiny/podcast-sm.png"
import Video from "../../../../../../public/images/destiny/video-sm.png"
import CaseStudy from "../../../../../../public/images/destiny/case-study-sm.png"
import Class from "../../../../../../public/images/destiny/class-sm.png"
import styles from "./DestinyPlanItem.module.css"
import classnames from 'classnames';
import Button from '~/ui/components/Button';
import { useStoreState } from 'easy-peasy';
import GenericWrapper from '../GenericWrapper';

interface IDestinyItemProps {
    item?: DestinyGlobalItem
}

const DestinyItem = ({item}:IDestinyItemProps) => {
  const { selectedHousehold } = useStoreState(state => state.household);
    const [checklist, setChecklist] = useState<DestinyChecklistItem[]>();
    console.log("Checklists",checklist);
  
    const loadChecklist = async (planItem: DestinyGlobalItem) => {
      console.log("Plan",planItem);
      
        const checklistResponse = await api.destinyChecklist.getChecklistItem(planItem.ItemId as number);
        console.log("Response",checklistResponse?.data);
        
        const checklistData = await checklistResponse.data;
        setChecklist(checklistData);
    }
    const assessmentReport: IReportOptions = {
      title: 'Assessment',
      storyofus: true,
      familyName: item?.Title,
      familyImage: undefined,
      reportLogo: undefined,
      header: true,
    };
    const assessmentOptions: PDFExportProps = {
      paperSize: 'auto',
      fileName: 'Assessment',
      scale: 1,
      subject: 'Assessment',
      author: 'John',
      keepTogether: '.keep-together',
    };
    const activityReport: IReportOptions = {
      title: 'Activity',
      storyofus: true,
      familyName: item?.Title,
      familyImage: undefined,
      reportLogo: undefined,
      header: true,
    };
    const activityOptions: PDFExportProps = {
      paperSize: 'auto',
      fileName: 'Activity',
      scale: 1,
      subject: 'Activity',
      author: 'John',
      keepTogether: '.keep-together',
    };
    const caseStudyReport: IReportOptions = {
      title: 'CaseStudy',
      storyofus: true,
      familyName: item?.Title,
      familyImage: undefined,
      reportLogo: undefined,
      header: true,
    };
    const caseStudyOptions: PDFExportProps = {
      paperSize: 'auto',
      fileName: 'CaseStudy',
      scale: 1,
      subject: 'CaseStudy',
      author: 'John',
      keepTogether: '.keep-together',
    };
    const bookReport: IReportOptions = {
      title: 'Book',
      storyofus: true,
      familyName: item?.Title,
      familyImage: undefined,
      reportLogo: undefined,
      header: true,
    };
    const bookOptions: PDFExportProps = {
      paperSize: 'auto',
      fileName: 'Book',
      scale: 1,
      subject: 'Book',
      author: 'John',
      keepTogether: '.keep-together',
    };
    const checklistReport: IReportOptions = {
      title: 'Checklist',
      storyofus: true,
      familyName: item?.Title,
      familyImage: undefined,
      reportLogo: undefined,
      header: true,
    };
    const checklistOptions: PDFExportProps = {
      paperSize: 'auto',
      fileName: 'Checklist',
      scale: 1,
      subject: 'Checklist',
      author: 'John',
      keepTogether: '.keep-together',
    };
    const conferenceReport: IReportOptions = {
      title: 'Conference',
      storyofus: true,
      familyName: item?.Title,
      familyImage: undefined,
      reportLogo: undefined,
      header: true,
    };
    const conferenceOptions: PDFExportProps = {
      paperSize: 'auto',
      fileName: 'Conference',
      scale: 1,
      subject: 'Conference',
      author: 'John',
      keepTogether: '.keep-together',
    };
    const referenceExtReport: IReportOptions = {
      title: 'Reference (External)',
      storyofus: true,
      familyName: item?.Title,
      familyImage: undefined,
      reportLogo: undefined,
      header: true,
    };
    const referenceExtOptions: PDFExportProps = {
      paperSize: 'auto',
      fileName: 'Reference (External)',
      scale: 1,
      subject: 'Reference (External)',
      author: 'John',
      keepTogether: '.keep-together',
    };
    const referenceIntReport: IReportOptions = {
      title: 'Reference (Internal)',
      storyofus: true,
      familyName: item?.Title,
      familyImage: undefined,
      reportLogo: undefined,
      header: true,
    };
    const referenceIntOptions: PDFExportProps = {
      paperSize: 'auto',
      fileName: 'Reference (Internal)',
      scale: 1,
      subject: 'Reference (Internal)',
      author: 'John',
      keepTogether: '.keep-together',
    };
    const podcastReport: IReportOptions = {
      title: 'Podcast',
      storyofus: true,
      familyName: item?.Title,
      familyImage: undefined,
      reportLogo: undefined,
      header: true,
    };
    const podcastOptions: PDFExportProps = {
      paperSize: 'auto',
      fileName: 'Podcast',
      scale: 1,
      subject: 'Podcast',
      author: 'John',
      keepTogether: '.keep-together',
    };
    const videoReport: IReportOptions = {
      title: 'Video',
      storyofus: true,
      familyName: item?.Title,
      familyImage: undefined,
      reportLogo: undefined,
      header: true,
    };
    const videoOptions: PDFExportProps = {
      paperSize: 'auto',
      fileName: 'Video',
      scale: 1,
      subject: 'Video',
      author: 'John',
      keepTogether: '.keep-together',
    };
    useEffect(() => {
        if(item?.ItemType.toLowerCase() == "checklist")
        {
            console.log("Is Checklist");
            loadChecklist(item);
        }
    }, []);

    switch(item?.ItemType?.toLowerCase()) 
    {
        case "activity":
            return (
              <PDFReportExport options={activityOptions} reportOptions={activityReport} excludeFooter={true}>
                <GenericWrapper
                  reportTitle={activityOptions.subject}
                  ownerId={Number(selectedHousehold?.CreatedBy)}
                  householdId={Number(selectedHousehold?.HouseholdID)}
                >
               <div className='destiny-item'>                
                  <Grid container spacing={1}>
                    <Grid item xs={12}>
                      <div style={{display: "flex", flexDirection: "row"}}>
                        <div style={{flex: 1}}>
                          <img src={Activity}/>
                        </div>
                        <div style={{flex: 9}}>
                          <div className='destiny-header-itemType'>
                              {"Activity"}
                          </div>
                        </div>
                      </div>
                    <div className='destiny-header'>
                      <div className='destiny-headrer-title'>
                        {item.Category}
                      </div>
                      <div className='destiny-header-subcategory'>
                        {item.Subcategory}
                      </div>
                    </div>
                  </Grid>
                  <Grid item xs={11}>
                  <div>
                        
                           <p className="destiny-label">
                            TITLE: 
                           <span className="destiny-text">
                               {item.Title}
                             </span></p>
                             <p className="destiny-label">
                             DATE ENTERED / UPDATED:
                             
                             <span className="destiny-text">
                             {item.StartDate}
                             </span>
                           </p>
                             <p className="destiny-label">
                             SOURCE:
                             <span className="destiny-text">
                             {item.Author}
                             </span>
                           </p>
                           <p className='destiny-label'>
                            DESCRIPTION:
                            <br/>
                            <span className='destiny-text'>
                               {item.Description}
                             </span>
                            </p>
                            <p className='destiny-label'>
                            CONTENT:
                            <div dangerouslySetInnerHTML={{ __html: `${item.Content}` }} />
                            </p>
                            <p style={{ textTransform: 'uppercase', color: '#72c6d3', fontWeight: 'bold',width: '834px',display: 'block' }}>
                            LENGTH:
                            <br/>
                              <span style={{ textTransform: 'none', color: 'black', fontWeight: 'normal' ,width: '834px',display: 'block'}}>
                               {item.Duration}
                             </span>
                            </p>
                            <p style={{ textTransform: 'uppercase', color: '#72c6d3', fontWeight: 'bold',width: '834px',display: 'block' }}>
                            FILE:
                            <br/>
                           <span style={{ textTransform: 'none', color: 'black', fontWeight: 'normal' ,width: '834px',display: 'block'}}>
                               {item.Url}
                             </span>
                            </p>
                           <p className="destiny-label">
                             TAGS:
                             <span className="destiny-text">
                             </span>
                           </p>
                           
                         </div>
                       </Grid>
                </Grid>
               </div>
              </GenericWrapper>
              </PDFReportExport>
            );
        case "case study":
            return (
              <PDFReportExport options={caseStudyOptions} reportOptions={caseStudyReport} excludeFooter={true}>
                <GenericWrapper
                  reportTitle={caseStudyOptions.subject}
                  ownerId={Number(selectedHousehold?.CreatedBy)}
                  householdId={Number(selectedHousehold?.HouseholdID)}
                >
              <div className='destiny-item'>                
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <div style={{display: "flex", flexDirection: "row"}}>
                        <div style={{flex: 1}}>
                          <img src={CaseStudy}/>
                        </div>
                        <div style={{flex: 9}}>
                          <div className='destiny-header-itemType'>
                              {"Case Study"}
                          </div>
                        </div>
                      </div>
                    <div className='destiny-header'>
                      <div className='destiny-headrer-title'>
                        {item.Category}
                      </div>
                      <div className='destiny-header-subcategory'>
                        {item.Subcategory}
                      </div>
                    </div>
                  </Grid>
                        <Grid item xs={12}>
                           <div>
                           <div className="destiny-title">
                           {item.Title}
                             </div>
                           <p className="destiny-label">
                            SOURCE:
                           <span className="destiny-text">
                           {item.Author}
                             </span></p>
                             <p className="destiny-label">
                            DATE:
                           <span className="destiny-text">
                           {item.StartDate}
                             </span></p>
                             <p className="destiny-label">
                            LENGTH:
                           <span className="destiny-text">
                           {item.Duration}
                             </span></p>
                             <div>
                        <Button type="button" text="Link" size="large" variant="contained" color="primary" onClick={() => window.open(item.Url)}/>
                      </div>
                              <p className="destiny-label">
                            DESCRIPTION:</p>
                           <div className="destiny-text">
                           {item.Description}
                             </div>
                             <p className="destiny-label">
                            CONTENT:</p>
                            <div dangerouslySetInnerHTML={{ __html: `${item.Content}` }} />
                             </div>
                             
                        </Grid>
                        
                    </Grid>
                </div>
                </GenericWrapper>
              </PDFReportExport>
            )
        case "book":
            return (
               <PDFReportExport options={bookOptions} reportOptions={bookReport} excludeFooter={true}>
                <GenericWrapper
                  reportTitle={bookOptions.subject}
                  ownerId={Number(selectedHousehold?.CreatedBy)}
                  householdId={Number(selectedHousehold?.HouseholdID)}
                  isWide={true}
                >
                <div className='destiny-item'>                
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <div style={{display: "flex", flexDirection: "row"}}>
                        <div style={{flex: 1}}>
                          <img src={Book}/>
                        </div>
                        <div style={{flex: 9}}>
                          <div className='destiny-header-itemType'>
                              {"Books"}
                          </div>
                        </div>
                      </div>
                    <div className='destiny-header'>
                      <div className='destiny-headrer-title'>
                        {item.Category}
                      </div>
                      <div className='destiny-header-subcategory'>
                        {item.Subcategory}
                      </div>
                    </div>
                  </Grid>
                  <Grid item xs={3}>
                    {item.ImageUrl ? (
                      item.ImageUrl.startsWith('https://clariata') ? (
                        <img
                          crossOrigin="anonymous"
                          src={item.ImageUrl}
                          
                        />
                      ) : (
                        <img src={item.ImageUrl} className='destiny-image' />
                      )
                    ) : (
                      <div
                        style={{
                          borderColor: '#a7d9dd',
                          borderWidth: '1px',
                          borderStyle: 'solid',
                          backgroundColor: '#F1F0F0',
                          minHeight: '400px',
                          minWidth: '150px',
                          margin: '20px',
                          width:"744"
                        }}
                      ></div>
                    )}
                    <div style={{textAlign: "center"}}>
                        <Button type="button" text="Link" size="large" variant="contained" color="primary" onClick={() => window.open(item.Url)}/>
                      </div>
                  </Grid>
                  <Grid item xs={8}>
                    <div>
                      <div className="destiny-title">
                          {item.Title}
                        </div>
                      <p className="destiny-label">
                        Author
                        <span className="destiny-text">
                          {' '}
                          {item.Author}
                        </span>
                      </p>
                      <p style={{ textTransform: 'uppercase', color: '#72c6d3', fontWeight: 'bold',marginTop: "10px" }}>
                        Date
                        <span className="destiny-text">
                          {' '}
                          {item.StartDate}
                        </span>
                      </p>
                      <p style={{ textTransform: 'uppercase', color: '#72c6d3', fontWeight: 'bold',marginTop: "10px" }}>
                        DESCRIPTION:
                        <br />
                        <span style={{ textTransform: 'lowercase', color: 'black', fontWeight: 'normal',    width: '560px', display:'block' }}>
                        {item.Description}
                        </span>
                      </p>
                      <p style={{ textTransform: 'uppercase', color: '#72c6d3', fontWeight: 'bold' ,marginTop: "10px", display:'block'}}>
                        ADDITIONAL INFORMATION:
                        <span style={{ fontWeight: 'bold', color: 'black', textTransform: 'none' ,width: '553px',display: 'block'}}>
                        <div
                            dangerouslySetInnerHTML={{ __html: `${item.Content}` }}
                          />
                        </span>
                      </p>
                    </div>
                  </Grid>
                </Grid>
              </div>
              </GenericWrapper>
              </PDFReportExport>
            );
        case "checklist":
            return (
              <PDFReportExport options={checklistOptions} reportOptions={checklistReport} excludeFooter={true}>
              <GenericWrapper
                reportTitle={checklistOptions.subject}
                ownerId={Number(selectedHousehold?.CreatedBy)}
                householdId={Number(selectedHousehold?.HouseholdID)}
              >
              <div className='destiny-item'>                
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <div style={{display: "flex", flexDirection: "row"}}>
                        <div style={{flex: 1}}>
                          <img src={Checklist}/>
                        </div>
                        <div style={{flex: 9}}>
                          <div className='destiny-header-itemType'>
                              {"Checklist"}
                          </div>
                        </div>
                      </div>
                    <div className='destiny-header'>
                      <div className='destiny-headrer-title'>
                        {item.Category}
                      </div>
                      <div className='destiny-header-subcategory'>
                        {item.Subcategory}
                      </div>
                    </div>
                  </Grid>
                    <Grid item xs={12}>
                        <div>
                      <div style={{display: "flex", flexDirection: "row"}}>
                      <div className='destiny-label' style={{flex: "1"}}>TITLE:    
                      <span className="destiny-text">
                          {item.Title}
                        </span></div>
                        <div className='destiny-label' style={{flex: "1"}}>SOURCE:    
                      <span className="destiny-text">
                          {item.Author}
                        </span></div>
                        </div>
                        <div style={{display: "flex", flexDirection: "row"}}>
                        <div className='destiny-label' style={{flex: "1"}}>DESCRIPTION:    
                      <span className="destiny-text">
                          {' '}
                          {item.Description}
                        </span></div>
                        <div className='destiny-label' style={{flex: "1"}}>DATE:    
                      <span className="destiny-text">
                          {item.StartDate}
                        </span></div>
                            </div>
                            <div dangerouslySetInnerHTML={{__html: item?.Content ? item?.Content : ""}}></div>
                        </div>
                        </Grid>                         
                        
                        <Grid item xs={12}>
                            <table className={classnames(styles.DestinyTable)}>
                            <tr className={classnames(styles.Row)}>
                                  <th className={classnames(styles.tableHeader)}></th>
                                  <th className={classnames(styles.tableHeader2)}>Sub Heading</th>
                                  <th className={classnames(styles.tableHeader3)}>Reference</th>
                                  </tr>
                                <tbody>
                                    {checklist?.map((checklistItem ,index) => 
                                    {
                                      
                                        return (
                                            <tr key={index + 1} style={{
                                              backgroundColor: index % 2 == 0 ? '#edf7f5' : '#FFFFFF',
                                          }}>
                                                <td className={classnames(styles.tableData)}><input type="checkbox" style={{ height: '23px' , width: '23px', marginLeft: '19px' , marginTop: '7px'}}/></td>
                                                <td className={classnames(styles.tableData)}>{checklistItem.ChecklistItemName}</td>
                                                <td className={classnames(styles.tableData)}>{checklistItem.ReferenceUrl}</td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                            <div style={{marginTop: "20px"}}>
                              <Button type="button" text="Link" size="large" variant="contained" color="primary" onClick={() => window.open(item.Url)}/>
                          </div>                          
                        </Grid>
                    </Grid>
                </div>
                </GenericWrapper>
              </PDFReportExport>
            )
        case "conference":
            return (
              <PDFReportExport options={conferenceOptions} reportOptions={conferenceReport} excludeFooter={true}>
              <GenericWrapper
                reportTitle={conferenceOptions.subject}
                ownerId={Number(selectedHousehold?.CreatedBy)}
                householdId={Number(selectedHousehold?.HouseholdID)}
              >
              <div className='destiny-item'>                
                  <Grid container spacing={1}>
                    <Grid item xs={12}>
                      <div style={{display: "flex", flexDirection: "row"}}>
                        <div style={{flex: 1}}>
                          <img src={Class}/>
                        </div>
                        <div style={{flex: 9}}>
                          <div className='destiny-header-itemType'>
                              {"Class/Conference"}
                          </div>
                        </div>
                      </div>
                    <div className='destiny-header'>
                      <div className='destiny-headrer-title'>
                        {item.Category}
                      </div>
                      <div className='destiny-header-subcategory'>
                        {item.Subcategory}
                      </div>
                    </div>
                  </Grid>
                  <Grid item xs={11}>
                    <div>
                      <p className='destiny-label'>
                        CLASS CONFERENCE TITLE:
                        <span className='destiny-text'>
                          {item.Title}
                        </span>
                      </p>
                      <p className='destiny-label'>
                        ORGANIZER:
                        <span className="destiny-text">
                          {item.Author}
                        </span>
                      </p>
                      <p className='destiny-label'>
                        WHEN:
                        <span className="destiny-text">
                          {item.StartDate}
                        </span>
                      </p>
                      <p className='destiny-label'>
                        LOCATION:
                        <span className="destiny-text">
                          {item.Author}
                        </span>
                      </p>                      
                      <div>
                        <Button type="button" text="Link" size="large" variant="contained" color="primary" onClick={() => window.open(item.Url)}/>
                      </div>
                      <p className='destiny-label'>
                        DESCRIPTION:
                        <br />
                        <span className='destiny-text'>
                          {item.Description}
                        </span>
                      </p>
                      <p className='destiny-labelCl'
                      >
                        ADDITIONAL INFORMATION:
                        <div dangerouslySetInnerHTML={{ __html: `${item.Content}` }} />
                      </p>
                      <p className='destiny-label'>
                        TAGS:
                      </p>
                    </div>
                  </Grid>
                </Grid>
              </div>
              </GenericWrapper>
              </PDFReportExport>
            );
        case "reference (external)":
            return (
              <PDFReportExport options={referenceExtOptions} reportOptions={referenceExtReport} excludeFooter={true}>
              <GenericWrapper
                reportTitle={referenceExtOptions.subject}
                ownerId={Number(selectedHousehold?.CreatedBy)}
                householdId={Number(selectedHousehold?.HouseholdID)}
              >
              <div className='destiny-item'>                
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <div style={{display: "flex", flexDirection: "row"}}>
                        <div style={{flex: 1}}>
                          <img src={ReferenceExt}/>
                        </div>
                        <div style={{flex: 9}}>
                          <div className='destiny-header-itemType'>
                              {"Reference (External)"}
                          </div>
                        </div>
                      </div>
                    <div className='destiny-header'>
                      <div className='destiny-headrer-title'>
                        {item.Category}
                      </div>
                      <div className='destiny-header-subcategory'>
                        {item.Subcategory}
                      </div>
                    </div>
                  </Grid>
                  <Grid item xs={11}>
                  <div>
                        <div className="destiny-title">
                          {item.Title}
                        </div>
                      <p className="destiny-label">
                        SOURCE:
                        <span className="destiny-text">
                          {' '}
                        </span>
                      </p>
                      <p className="destiny-label">
                        DATE:
                        <span className="destiny-text">
                          {item.StartDate}
                        </span>
                      </p>
                      <p className="destiny-label">
                        LENGTH:
                        <span className="destiny-text">
                          {item.Duration}
                        </span>
                      </p>
                      <div style={{marginTop: "20px"}}>
                              <Button type="button" text="Link" size="large" variant="contained" color="primary" onClick={() => window.open(item.Url)}/>
                          </div>
                      <p className="destiny-label">
                        SUMNMARY:
                        <span className="destiny-text">
                          {item.Description}
                        </span>
                      </p>
                      <p className="destiny-label">
                        ADDITIONAL INFORMATION:
                      </p>
                      <div dangerouslySetInnerHTML={{ __html: `${item.Content}` }} />
                      {/* <p className="destiny-label">
                        FILE:
                        <span className="destiny-text">
                          {''}
                        </span>
                      </p> */}
                      <p className="destiny-label">
                        TAGS:
                        <span className="destiny-text">
                          {''}
                        </span>
                      </p>
                    </div>
                  </Grid>
                       
                    </Grid>
                </div>
                </GenericWrapper>
              </PDFReportExport>
            )
        case "reference (internal)":
            return (
              <PDFReportExport options={referenceIntOptions} reportOptions={referenceIntReport} excludeFooter={true}>
              <GenericWrapper
                reportTitle={referenceIntOptions.subject}
                ownerId={Number(selectedHousehold?.CreatedBy)}
                householdId={Number(selectedHousehold?.HouseholdID)}
              >
              <div className='destiny-item'>                
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <div style={{display: "flex", flexDirection: "row"}}>
                        <div style={{flex: 1}}>
                          <img src={ReferenceInt}/>
                        </div>
                        <div style={{flex: 9}}>
                          <div className='destiny-header-itemType'>
                              {"Reference (Internal)"}
                          </div>
                        </div>
                      </div>
                    <div className='destiny-header'>
                      <div className='destiny-headrer-title'>
                        {item.Category}
                      </div>
                      <div className='destiny-header-subcategory'>
                        {item.Subcategory}
                      </div>
                    </div>
                  </Grid>
                  <Grid item xs={11}>
                    <div>
                        <div className="destiny-title">
                          {item.Title}
                        </div>
                      <p className="destiny-label">
                        SOURCE:
                        <span className="destiny-text">
                          {item.Url}
                        </span>
                      </p>

                      <p className="destiny-label">
                        DATE:
                        <span className="destiny-text">

                          {item.StartDate}
                        </span>
                      </p>
                      <p className="destiny-label">
                        LENGTH:
                        <span className="destiny-text">{item.Duration} </span>
                      </p>
                      <p className="destiny-label">
                        SUMMARY:
                        <span className="destiny-text">{item.Description} </span>
                      </p>
                      <div style={{marginTop: "20px"}}>
                              <Button type="button" text="Link" size="large" variant="contained" color="primary" onClick={() => window.open(item.Url)}/>
                          </div>
                      <p className="destiny-label">
                        CONTENT:
                        <div dangerouslySetInnerHTML={{ __html: `${item.Content}` }} />
                      </p>
                      {/* <p
                        style={{ textTransform: 'uppercase', color: '#72c6d3', fontWeight: 'bold', marginTop: '115px' }}
                      >
                        FILE:
                        <span className="destiny-text"> </span>
                      </p> */}
                      <p className="destiny-label">
                        TAGS:
                        <span className="destiny-text"> </span>
                      </p>
                    </div>
                  </Grid>
                </Grid>
              </div>
              </GenericWrapper>
              </PDFReportExport>
            );
        case "video":
            return (
              <PDFReportExport options={videoOptions} reportOptions={videoReport} excludeFooter={true}>
              <GenericWrapper
                reportTitle={videoOptions.subject}
                ownerId={Number(selectedHousehold?.CreatedBy)}
                householdId={Number(selectedHousehold?.HouseholdID)}
              >
              <div className='destiny-item'>                
                  <Grid container spacing={1}>
                    <Grid item xs={12}>
                      <div style={{display: "flex", flexDirection: "row"}}>
                        <div style={{flex: 1}}>
                          <img className='destiny-image' src={Video}/>
                        </div>
                        <div style={{flex: 9}}>
                          <div className='destiny-header-itemType'>
                              {"Video"}
                          </div>
                        </div>
                      </div>
                    <div className='destiny-header'>
                      <div className='destiny-headrer-title'>
                        {item.Category}
                      </div>
                      <div className='destiny-header-subcategory'>
                        {item.Subcategory}
                      </div>
                    </div>
                  </Grid>
                  <Grid item xs={4}>
                    {item.ImageUrl ? (
                      item.ImageUrl.startsWith('https://clariata') ? (
                        <img crossOrigin="anonymous" src={item.ImageUrl} className='destiny-image' />
                      ) : (
                        <img
                          src={item.ImageUrl}
                          className='destiny-image'                        />
                      )
                    ) : (
                      <div
                        style={{
                          borderColor: '#a7d9dd',
                          borderWidth: '1px',
                          borderStyle: 'solid',
                          backgroundColor: '#F1F0F0',
                          minHeight: '400px',
                          minWidth: '150px',
                          margin: '20px',
                        }}
                      ></div>
                    )}
                    <div style={{marginTop: "20px"}}>
                              <Button type="button" text="Link" size="large" variant="contained" color="primary" onClick={() => window.open(item.Url)}/>
                          </div>
                  </Grid>
                  <Grid item xs={7}>
                      
                        <div className="destiny-title">
                          {item.Title}
                        </div>
                        <p className="destiny-label">
                        DATE:
                        <span className="destiny-text">
                          {item.StartDate}
                        </span>
                      </p>
                      <p className="destiny-label">
                        LENGTH:
                        <span className="destiny-text">
                          {item.Duration}
                        </span>
                      </p>
                      <p className="destiny-label">
                        PRODUCER:
                        <span className="destiny-text">
                          {item.Author}
                        </span>
                      </p>
                      
                  </Grid>
                  <Grid item xs={11}>    
                      <p className='destiny-label' >
                        DESCRIPTION:
                        <br />
                        <span className="destiny-text">
                          {item.Description}
                        </span>
                      </p>
                      <p className="destiny-label">
                            ADDITIONAL INFORMATION:</p>
                            <div dangerouslySetInnerHTML={{ __html: `${item.Content}` }} />
                      <p className='destiny-label'>
                        TAGS:
                      </p>
                  </Grid>
                </Grid>
              </div>
              </GenericWrapper>
              </PDFReportExport>
            );
        case "podcast":
            return (
              <PDFReportExport options={podcastOptions} reportOptions={podcastReport
              } excludeFooter={true}>
              <GenericWrapper
                reportTitle={podcastOptions.subject}
                ownerId={Number(selectedHousehold?.CreatedBy)}
                householdId={Number(selectedHousehold?.HouseholdID)}
              >
              <div className='destiny-item'>                
                  <Grid container spacing={1}>
                    <Grid item xs={12}>
                      <div style={{display: "flex", flexDirection: "row"}}>
                        <div style={{flex: 1}}>
                          <img className='destiny-image' src={Podcast}/>
                        </div>
                        <div style={{flex: 9}}>
                          <div className='destiny-header-itemType'>
                              {"PODCAST"}
                          </div>
                        </div>
                      </div>
                    <div className='destiny-header'>
                      <div className='destiny-headrer-title'>
                        {item.Category}
                      </div>
                      <div className='destiny-header-subcategory'>
                        {item.Subcategory}
                      </div>
                    </div>
                  </Grid>
                  <Grid item xs={4}>
                    {item.ImageUrl ? (
                      item.ImageUrl.startsWith('https://clariata') ? (
                        <img crossOrigin="anonymous" src={item.ImageUrl} className='destiny-image' />
                      ) : (
                        <img
                          src={item.ImageUrl}
                          className='destiny-image'                        />
                      )
                    ) : (
                      <div
                        style={{
                          borderColor: '#a7d9dd',
                          borderWidth: '1px',
                          borderStyle: 'solid',
                          backgroundColor: '#F1F0F0',
                          minHeight: '400px',
                          minWidth: '150px',
                          margin: '20px',
                        }}
                      ></div>
                    )}
                    <div style={{marginTop: "20px"}}>
                              <Button type="button" text="Link" size="large" variant="contained" color="primary" onClick={() => window.open(item.Url)}/>
                          </div>
                  </Grid>
                  <Grid item xs={7}>
                      
                        <div className="destiny-title">
                          {item.Title}
                        </div>
                        <p className="destiny-label">
                        DATE:
                        <span className="destiny-text">
                          {item.StartDate}
                        </span>
                      </p>
                      <p className="destiny-label">
                        LENGTH:
                        <span className="destiny-text">
                          {item.Duration}
                        </span>
                      </p>
                      <p className="destiny-label">
                        PRODUCER:
                        <span className="destiny-text">
                          {item.Author}
                        </span>
                      </p>
                      
                  </Grid>
                  <Grid item xs={11}>    
                      <p className='destiny-label' >
                        DESCRIPTION:
                        <br />
                        <span className="destiny-text">
                          {item.Description}
                        </span>
                      </p>
                      <p className="destiny-label">
                            ADDITIONAL INFORMATION:</p>
                            <div dangerouslySetInnerHTML={{ __html: `${item.Content}` }} />
                      <p className='destiny-label'>
                        TAGS:
                      </p>
                  </Grid>
                </Grid>
              </div>
              </GenericWrapper>
              </PDFReportExport>
            )
        case "assessment":
            return (
              <PDFReportExport options={assessmentOptions} reportOptions={assessmentReport} excludeFooter={true}>
                <GenericWrapper
                  reportTitle={assessmentOptions.subject}
                  ownerId={Number(selectedHousehold?.CreatedBy)}
                  householdId={Number(selectedHousehold?.HouseholdID)}
                >
                  <div className="destiny-item">
                    <Grid container spacing={1}>
                      <Grid item xs={12}>
                        <div style={{ display: 'flex', flexDirection: 'row' }}>
                          <div style={{ flex: 1 }}>
                            <img src={Assessment} />
                          </div>
                          <div style={{ flex: 9 }}>
                            <div className="destiny-header-itemType">{'Assessmesnt'}</div>
                          </div>
                        </div>
                        <div className="destiny-header">
                          <div className="destiny-headrer-title">{item.Category}</div>
                          <div className="destiny-header-subcategory">{item.Subcategory}</div>
                        </div>
                      </Grid>
                      <Grid xs={8}>
                        <div>
                          <div className="destiny-title">{item.Title}</div>
                          <p className="destiny-label">
                            SOURCE:
                            <span className="destiny-text">{item.Author}</span>
                          </p>
                          <p className="destiny-label">
                            DATE:
                            <span className="destiny-text">{item.StartDate}</span>
                          </p>
                          <p
                            style={{ textTransform: 'uppercase', color: '#72c6d3', fontWeight: 'bold', width: '695px' }}
                          >
                            LENGTH:
                            <span className="destiny-text">{item.Duration}</span>
                          </p>
                          <div style={{ marginTop: '20px' }}>
                            <Button
                              type="button"
                              text="Link"
                              size="large"
                              variant="contained"
                              color="primary"
                              onClick={() => window.open(item.Url)}
                            />
                          </div>
                          <p
                            style={{
                              textTransform: 'uppercase',
                              color: '#72c6d3',
                              fontWeight: 'bold',
                              width: '834px',
                              display: 'block',
                            }}
                          >
                            DESCRIPTION:
                            <br />
                            <span
                              style={{
                                textTransform: 'lowercase',
                                color: 'black',
                                fontWeight: 'normal',
                                display: 'block',
                                width: '713px',
                              }}
                            >
                              {item.Description}
                            </span>
                          </p>
                          <p
                            style={{
                              textTransform: 'uppercase',
                              color: '#72c6d3',
                              fontWeight: 'bold',
                              width: '834px',
                              display: 'block',
                            }}
                          >
                            ADDITIONAL INFORMATION:
                            <div dangerouslySetInnerHTML={{ __html: `${item.Content}` }} />
                          </p>
                          <p
                            style={{
                              textTransform: 'uppercase',
                              color: '#72c6d3',
                              fontWeight: 'bold',
                              width: '834px',
                              display: 'block',
                            }}
                          >
                            TAGS
                          </p>
                        </div>
                      </Grid>
                    </Grid>
                  </div>
                </GenericWrapper>
              </PDFReportExport>
            );
        default :
            return (
                <div style={{minHeight: "600px"}}>
                    <Grid container spacing={2}>
                        {/* <Grid xs={12}>
                            <img src="~/public/images/destiny/book.png" />
                        </Grid> */}
                        <Grid xs={12}>
                            <div style={{backgroundColor: "#c9e6e9", padding: "15px", marginBottom: "20px", borderColor: "#a7d9dd", borderWidth: "1px", borderStyle: "solid"}}>
                                <div style={{fontSize: "18px", fontWeight: "bold"}}>
                                    {item?.Category} {"haha"}
                                </div>
                                <div style={{fontSize: "14px"}}>
                                    {item?.Subcategory}
                            </div>
                            </div>
                        </Grid>                        
                        <Grid xs={4}>
                            {item?.ImageUrl ? 
                                item.ImageUrl.startsWith("https://clariata") ?
                                <img crossOrigin="anonymous" src={item?.ImageUrl} style={{maxWidth: "300px"}}/>
                                : 
                                <img src={item?.ImageUrl} style={{maxWidth: "300px"}}/>
                            : 
                            <div style={{borderColor: "#a7d9dd", borderWidth: "1px", borderStyle: "solid", backgroundColor: "#F1F0F0", minHeight: "400px", minWidth: "150px", margin: "20px"}}>
                            </div>
                            }
                        </Grid>
                        <Grid xs={8}>
                            <div style={{fontSize: "16px", marginTop: "20px", display: "flex"}}>
                                <div style={{color: "#304256", fontWeight: "bold"}}>{item?.Title}</div>
                                {item?.Subtitle ?
                                    <div style={{display: "flex"}}>: {item?.Subtitle} Subtitle</div>
                                    : null }
                            </div>                            
                            <div>By {item?.Author}</div>
                            <div>{item?.StartDate != "" ? "Date: " + item?.StartDate : "" }</div>
                            <div>Length: {item?.Duration}</div>
                            <div style={{marginTop: "20px",}}>
                                {item?.Description}
                            </div>
                            <div style={{marginTop: "20px",}}>
                                <div dangerouslySetInnerHTML={{__html: item?.Content ? item?.Content : ""}}></div>
                            </div>
                        </Grid>
                    </Grid>
                </div>
            )
    }
}

export default DestinyItem;