import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Collapse, Grid, ListItem, ListItemText, Select, Tooltip } from '@material-ui/core';
import Button from "~/ui/components/Button";
import { DestinyGlobalItem } from '~/types/api/destinyGlobalItem';
import { itemsList } from '~/services/api/planMember';
import moment from 'moment';
import api from '~/services/api';
import { DestinyChecklistItem } from '~/types/api/destinyChecklistItem';
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
interface DestinyPlanItemProps {
    destinyPlanItem?: DestinyGlobalItem ;
}

const DestinyPlanMemberItem = ( {destinyPlanItem} : DestinyPlanItemProps) => {

    const [checklist, setChecklist] = useState<DestinyChecklistItem[]>();
    console.log("Checklists",checklist);
  
    const loadChecklist = async (planItem: DestinyGlobalItem) => {
      console.log("Plan",planItem);
      
        const checklistResponse = await api.destinyChecklist.getChecklistItem(planItem.ItemId);
        console.log("Response",checklistResponse?.data);
        
        const checklistData = await checklistResponse.data;
        setChecklist(checklistData);
    }

    useEffect(() => {
        if(destinyPlanItem?.ItemType.toLowerCase() == "checklist")
        {
            console.log("Is Checklist");
            loadChecklist(destinyPlanItem);
        }
    }, []);

    switch(destinyPlanItem?.ItemType?.toLowerCase()) 
    {
        case "activity":
            return (
              <>
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
                        {destinyPlanItem.Category}
                      </div>
                      <div className='destiny-header-subcategory'>
                        {destinyPlanItem.Subcategory}
                      </div>
                    </div>
                  </Grid>
                  <Grid item xs={11}>
                  <div>
                        
                           <p className="destiny-label">
                            TITLE: 
                           <span className="destiny-text">
                               {destinyPlanItem.Title}
                             </span></p>
                             <p className="destiny-label">
                             DATE ENTERED / UPDATED:
                             
                             <span className="destiny-text">
                             {destinyPlanItem.StartDate}
                             </span>
                           </p>
                             <p className="destiny-label">
                             SOURCE:
                             <span className="destiny-text">
                             {destinyPlanItem.Author}
                             </span>
                           </p>
                           <p className='destiny-label'>
                            DESCRIPTION:
                            <br/>
                            <span className='destiny-text'>
                               {destinyPlanItem.Description}
                             </span>
                            </p>
                            <p className='destiny-label'>
                            CONTENT:
                            <div dangerouslySetInnerHTML={{ __html: `${destinyPlanItem.Content}` }} />
                            </p>
                            <p style={{ textTransform: 'uppercase', color: '#72c6d3', fontWeight: 'bold',width: '834px',display: 'block' }}>
                            LENGTH:
                            <br/>
                              <span style={{ textTransform: 'none', color: 'black', fontWeight: 'normal' ,width: '834px',display: 'block'}}>
                               {destinyPlanItem.Duration}
                             </span>
                            </p>
                            <p style={{ textTransform: 'uppercase', color: '#72c6d3', fontWeight: 'bold',width: '834px',display: 'block' }}>
                            FILE:
                            <br/>
                           <span style={{ textTransform: 'none', color: 'black', fontWeight: 'normal' ,width: '834px',display: 'block'}}>
                               {destinyPlanItem.Url}
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
              </>
            );
        case "case study":
            return (
              <>
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
                        {destinyPlanItem.Category}
                      </div>
                      <div className='destiny-header-subcategory'>
                        {destinyPlanItem.Subcategory}
                      </div>
                    </div>
                  </Grid>
                        <Grid item xs={12}>
                           <div>
                           <div className="destiny-title">
                           {destinyPlanItem.Title}
                             </div>
                           <p className="destiny-label">
                            SOURCE:
                           <span className="destiny-text">
                           {destinyPlanItem.Author}
                             </span></p>
                             <p className="destiny-label">
                            DATE:
                           <span className="destiny-text">
                           {destinyPlanItem.StartDate}
                             </span></p>
                             <p className="destiny-label">
                            LENGTH:
                           <span className="destiny-text">
                           {destinyPlanItem.Duration}
                             </span></p>
                             <div>
                        <Button type="button" text="Link" size="large" variant="contained" color="primary" onClick={() => window.open(destinyPlanItem.Url)}/>
                      </div>
                              <p className="destiny-label">
                            DESCRIPTION:</p>
                           <div className="destiny-text">
                           {destinyPlanItem.Description}
                             </div>
                             <p className="destiny-label">
                            CONTENT:</p>
                            <div dangerouslySetInnerHTML={{ __html: `${destinyPlanItem.Content}` }} />
                             </div>
                             
                        </Grid>
                        
                    </Grid>
                </div>
              </>
            )
        case "book":
            return (
              <>
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
                        {destinyPlanItem.Category}
                      </div>
                      <div className='destiny-header-subcategory'>
                        {destinyPlanItem.Subcategory}
                      </div>
                    </div>
                  </Grid>
                  <Grid item xs={3}>
                    {destinyPlanItem.ImageUrl ? (
                      destinyPlanItem.ImageUrl.startsWith('https://clariata') ? (
                        <img
                          crossOrigin="anonymous"
                          src={destinyPlanItem.ImageUrl}
                          
                        />
                      ) : (
                        <img src={destinyPlanItem.ImageUrl} className='destiny-image' />
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
                        <Button type="button" text="Link" size="large" variant="contained" color="primary" onClick={() => window.open(destinyPlanItem.Url)}/>
                      </div>
                  </Grid>
                  <Grid item xs={8}>
                    <div>
                      <div className="destiny-title">
                          {destinyPlanItem.Title}
                        </div>
                      <p className="destiny-label">
                        Author
                        <span className="destiny-text">
                          {' '}
                          {destinyPlanItem.Author}
                        </span>
                      </p>
                      <p style={{ textTransform: 'uppercase', color: '#72c6d3', fontWeight: 'bold',marginTop: "10px" }}>
                        Date
                        <span className="destiny-text">
                          {' '}
                          {destinyPlanItem.StartDate}
                        </span>
                      </p>
                      <p style={{ textTransform: 'uppercase', color: '#72c6d3', fontWeight: 'bold',marginTop: "10px" }}>
                        DESCRIPTION:
                        <br />
                        <span style={{ textTransform: 'lowercase', color: 'black', fontWeight: 'normal',    width: '560px', display:'block' }}>
                        {destinyPlanItem.Description}
                        </span>
                      </p>
                      <p style={{ textTransform: 'uppercase', color: '#72c6d3', fontWeight: 'bold' ,marginTop: "10px", display:'block'}}>
                        ADDITIONAL INFORMATION:
                        <span style={{ fontWeight: 'bold', color: 'black', textTransform: 'none' ,width: '553px',display: 'block'}}>
                        <div
                            dangerouslySetInnerHTML={{ __html: `${destinyPlanItem.Content}` }}
                          />
                        </span>
                      </p>
                    </div>
                  </Grid>
                </Grid>
              </div>
              </>
            );
        case "checklist":
            return (
              <>
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
                        {destinyPlanItem.Category}
                      </div>
                      <div className='destiny-header-subcategory'>
                        {destinyPlanItem.Subcategory}
                      </div>
                    </div>
                  </Grid>
                    <Grid item xs={12}>
                        <div>
                      <div style={{display: "flex", flexDirection: "row"}}>
                      <div className='destiny-label' style={{flex: "1"}}>TITLE:    
                      <span className="destiny-text">
                          {destinyPlanItem.Title}
                        </span></div>
                        <div className='destiny-label' style={{flex: "1"}}>SOURCE:    
                      <span className="destiny-text">
                          {destinyPlanItem.Author}
                        </span></div>
                        </div>
                        <div style={{display: "flex", flexDirection: "row"}}>
                        <div className='destiny-label' style={{flex: "1"}}>DESCRIPTION:    
                      <span className="destiny-text">
                          {' '}
                          {destinyPlanItem.Description}
                        </span></div>
                        <div className='destiny-label' style={{flex: "1"}}>DATE:    
                      <span className="destiny-text">
                          {destinyPlanItem.StartDate}
                        </span></div>
                            </div>
                            <div dangerouslySetInnerHTML={{__html: destinyPlanItem?.Content ? destinyPlanItem?.Content : ""}}></div>
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
                              <Button type="button" text="Link" size="large" variant="contained" color="primary" onClick={() => window.open(destinyPlanItem.Url)}/>
                          </div>                          
                        </Grid>
                    </Grid>
                </div>
                </>
            )
        case "conference":
            return (
              <>
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
                        {destinyPlanItem.Category}
                      </div>
                      <div className='destiny-header-subcategory'>
                        {destinyPlanItem.Subcategory}
                      </div>
                    </div>
                  </Grid>
                  <Grid item xs={11}>
                    <div>
                      <p className='destiny-label'>
                        CLASS CONFERENCE TITLE:
                        <span className='destiny-text'>
                          {destinyPlanItem.Title}
                        </span>
                      </p>
                      <p className='destiny-label'>
                        ORGANIZER:
                        <span className="destiny-text">
                          {destinyPlanItem.Author}
                        </span>
                      </p>
                      <p className='destiny-label'>
                        WHEN:
                        <span className="destiny-text">
                          {destinyPlanItem.StartDate}
                        </span>
                      </p>
                      <p className='destiny-label'>
                        LOCATION:
                        <span className="destiny-text">
                          {destinyPlanItem.Author}
                        </span>
                      </p>                      
                      <div>
                        <Button type="button" text="Link" size="large" variant="contained" color="primary" onClick={() => window.open(destinyPlanItem.Url)}/>
                      </div>
                      <p className='destiny-label'>
                        DESCRIPTION:
                        <br />
                        <span className='destiny-text'>
                          {destinyPlanItem.Description}
                        </span>
                      </p>
                      <p className='destiny-labelCl'
                      >
                        ADDITIONAL INFORMATION:
                        <div dangerouslySetInnerHTML={{ __html: `${destinyPlanItem.Content}` }} />
                      </p>
                      <p className='destiny-label'>
                        TAGS:
                      </p>
                    </div>
                  </Grid>
                </Grid>
              </div>
              </>
            );
        case "reference (external)":
            return (
              <>
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
                        {destinyPlanItem.Category}
                      </div>
                      <div className='destiny-header-subcategory'>
                        {destinyPlanItem.Subcategory}
                      </div>
                    </div>
                  </Grid>
                  <Grid item xs={11}>
                  <div>
                        <div className="destiny-title">
                          {destinyPlanItem.Title}
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
                          {destinyPlanItem.StartDate}
                        </span>
                      </p>
                      <p className="destiny-label">
                        LENGTH:
                        <span className="destiny-text">
                          {destinyPlanItem.Duration}
                        </span>
                      </p>
                      <div style={{marginTop: "20px"}}>
                              <Button type="button" text="Link" size="large" variant="contained" color="primary" onClick={() => window.open(destinyPlanItem.Url)}/>
                          </div>
                      <p className="destiny-label">
                        SUMNMARY:
                        <span className="destiny-text">
                          {destinyPlanItem.Description}
                        </span>
                      </p>
                      <p className="destiny-label">
                        ADDITIONAL INFORMATION:
                      </p>
                      <div dangerouslySetInnerHTML={{ __html: `${destinyPlanItem.Content}` }} />
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
                </>
            )
        case "reference (internal)":
            return (
              <>
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
                        {destinyPlanItem.Category}
                      </div>
                      <div className='destiny-header-subcategory'>
                        {destinyPlanItem.Subcategory}
                      </div>
                    </div>
                  </Grid>
                  <Grid item xs={11}>
                    <div>
                        <div className="destiny-title">
                          {destinyPlanItem.Title}
                        </div>
                      <p className="destiny-label">
                        SOURCE:
                        <span className="destiny-text">
                          {destinyPlanItem.Url}
                        </span>
                      </p>

                      <p className="destiny-label">
                        DATE:
                        <span className="destiny-text">

                          {destinyPlanItem.StartDate}
                        </span>
                      </p>
                      <p className="destiny-label">
                        LENGTH:
                        <span className="destiny-text">{destinyPlanItem.Duration} </span>
                      </p>
                      <p className="destiny-label">
                        SUMMARY:
                        <span className="destiny-text">{destinyPlanItem.Description} </span>
                      </p>
                      <div style={{marginTop: "20px"}}>
                              <Button type="button" text="Link" size="large" variant="contained" color="primary" onClick={() => window.open(destinyPlanItem.Url)}/>
                          </div>
                      <p className="destiny-label">
                        CONTENT:
                        <div dangerouslySetInnerHTML={{ __html: `${destinyPlanItem.Content}` }} />
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
              </>
            );
        case "video":
            return (
                <>
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
                        {destinyPlanItem.Category}
                      </div>
                      <div className='destiny-header-subcategory'>
                        {destinyPlanItem.Subcategory}
                      </div>
                    </div>
                  </Grid>
                  <Grid item xs={4}>
                    {destinyPlanItem.ImageUrl ? (
                      destinyPlanItem.ImageUrl.startsWith('https://clariata') ? (
                        <img crossOrigin="anonymous" src={destinyPlanItem.ImageUrl} className='destiny-image' />
                      ) : (
                        <img
                          src={destinyPlanItem.ImageUrl}
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
                              <Button type="button" text="Link" size="large" variant="contained" color="primary" onClick={() => window.open(destinyPlanItem.Url)}/>
                          </div>
                  </Grid>
                  <Grid item xs={7}>
                      
                        <div className="destiny-title">
                          {destinyPlanItem.Title}
                        </div>
                        <p className="destiny-label">
                        DATE:
                        <span className="destiny-text">
                          {destinyPlanItem.StartDate}
                        </span>
                      </p>
                      <p className="destiny-label">
                        LENGTH:
                        <span className="destiny-text">
                          {destinyPlanItem.Duration}
                        </span>
                      </p>
                      <p className="destiny-label">
                        PRODUCER:
                        <span className="destiny-text">
                          {destinyPlanItem.Author}
                        </span>
                      </p>
                      
                  </Grid>
                  <Grid item xs={11}>    
                      <p className='destiny-label' >
                        DESCRIPTION:
                        <br />
                        <span className="destiny-text">
                          {destinyPlanItem.Description}
                        </span>
                      </p>
                      <p className="destiny-label">
                            ADDITIONAL INFORMATION:</p>
                            <div dangerouslySetInnerHTML={{ __html: `${destinyPlanItem.Content}` }} />
                      <p className='destiny-label'>
                        TAGS:
                      </p>
                  </Grid>
                </Grid>
              </div>
              </>
            );
        case "podcast":
            return (
              <>
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
                        {destinyPlanItem.Category}
                      </div>
                      <div className='destiny-header-subcategory'>
                        {destinyPlanItem.Subcategory}
                      </div>
                    </div>
                  </Grid>
                  <Grid item xs={4}>
                    {destinyPlanItem.ImageUrl ? (
                      destinyPlanItem.ImageUrl.startsWith('https://clariata') ? (
                        <img crossOrigin="anonymous" src={destinyPlanItem.ImageUrl} className='destiny-image' />
                      ) : (
                        <img
                          src={destinyPlanItem.ImageUrl}
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
                              <Button type="button" text="Link" size="large" variant="contained" color="primary" onClick={() => window.open(destinyPlanItem.Url)}/>
                          </div>
                  </Grid>
                  <Grid item xs={7}>
                      
                        <div className="destiny-title">
                          {destinyPlanItem.Title}
                        </div>
                        <p className="destiny-label">
                        DATE:
                        <span className="destiny-text">
                          {destinyPlanItem.StartDate}
                        </span>
                      </p>
                      <p className="destiny-label">
                        LENGTH:
                        <span className="destiny-text">
                          {destinyPlanItem.Duration}
                        </span>
                      </p>
                      <p className="destiny-label">
                        PRODUCER:
                        <span className="destiny-text">
                          {destinyPlanItem.Author}
                        </span>
                      </p>
                      
                  </Grid>
                  <Grid item xs={11}>    
                      <p className='destiny-label' >
                        DESCRIPTION:
                        <br />
                        <span className="destiny-text">
                          {destinyPlanItem.Description}
                        </span>
                      </p>
                      <p className="destiny-label">
                            ADDITIONAL INFORMATION:</p>
                            <div dangerouslySetInnerHTML={{ __html: `${destinyPlanItem.Content}` }} />
                      <p className='destiny-label'>
                        TAGS:
                      </p>
                  </Grid>
                </Grid>
              </div>
                </>
            )
        case "assessment":
            return (
               
                <>   
                <div className='destiny-item'>                
                  <Grid container spacing={1}>
                    <Grid item xs={12}>
                      <div style={{display: "flex", flexDirection: "row"}}>
                        <div style={{flex: 1}}>
                          <img src={Assessment}/>
                        </div>
                        <div style={{flex: 9}}>
                          <div className='destiny-header-itemType'>
                              {"Assessment"}
                          </div>
                        </div>
                      </div>
                    <div className='destiny-header'>
                      <div className='destiny-headrer-title'>
                        {destinyPlanItem.Category}
                      </div>
                      <div className='destiny-header-subcategory'>
                        {destinyPlanItem.Subcategory}
                      </div>
                    </div>
                  </Grid>
                    <Grid xs={8}>
                      <div>
                      <div className="destiny-title">
                            {destinyPlanItem.Title}
                          </div>
                          <p className="destiny-label">
                         SOURCE:
                        <span className="destiny-text">
                            {destinyPlanItem.Author}
                          </span></p>
                          <p className="destiny-label">
                         DATE:
                        <span className="destiny-text">
                            {destinyPlanItem.StartDate}
                          </span></p>
                          <p style={{ textTransform: 'uppercase', color: '#72c6d3', fontWeight: 'bold',width: '695px' }}>
                         LENGTH:
                        <span className="destiny-text">
                            {destinyPlanItem.Duration}
                          </span></p>
                          <div style={{marginTop: "20px"}}>
                              <Button type="button" text="Link" size="large" variant="contained" color="primary" onClick={() => window.open(destinyPlanItem.Url)}/>
                          </div>
                          <p style={{ textTransform: 'uppercase', color: '#72c6d3', fontWeight: 'bold',width: '834px',display: 'block' }}>
                         DESCRIPTION:
                         <br/>
                         <span style={{ textTransform: 'lowercase', color: 'black', fontWeight: 'normal' ,display: 'block',width: '713px'}}>
                            {destinyPlanItem.Description}
                          </span>
                         </p>
                         <p style={{ textTransform: 'uppercase', color: '#72c6d3', fontWeight: 'bold',width: '834px',display: 'block' }}>
                         ADDITIONAL INFORMATION:
                         <div dangerouslySetInnerHTML={{ __html: `${destinyPlanItem.Content}` }} />
                         </p>
                         <p style={{ textTransform: 'uppercase', color: '#72c6d3', fontWeight: 'bold',width: '834px',display: 'block' }}>
                         TAGS
                         </p>
                      </div>
                    </Grid>
                  </Grid>
                </div>
                </>
               
            );
        default :
            if(destinyPlanItem)
            return (
                <div style={{minHeight: "600px"}}>
                    <Grid container spacing={2}>
                        {/* <Grid xs={12}>
                            <img src="~/public/images/destiny/book.png" />
                        </Grid> */}
                        <Grid xs={12}>
                            <div style={{backgroundColor: "#c9e6e9", padding: "15px", marginBottom: "20px", borderColor: "#a7d9dd", borderWidth: "1px", borderStyle: "solid"}}>
                                <div style={{fontSize: "18px", fontWeight: "bold"}}>
                                    {destinyPlanItem.Category} {"haha"}
                                </div>
                                <div style={{fontSize: "14px"}}>
                                    {destinyPlanItem.Subcategory}
                            </div>
                            </div>
                        </Grid>                        
                        <Grid xs={4}>
                            {destinyPlanItem.ImageUrl ? 
                                destinyPlanItem.ImageUrl.startsWith("https://clariata") ?
                                <img crossOrigin="anonymous" src={destinyPlanItem.ImageUrl} style={{maxWidth: "300px"}}/>
                                : 
                                <img src={destinyPlanItem.ImageUrl} style={{maxWidth: "300px"}}/>
                            : 
                            <div style={{borderColor: "#a7d9dd", borderWidth: "1px", borderStyle: "solid", backgroundColor: "#F1F0F0", minHeight: "400px", minWidth: "150px", margin: "20px"}}>
                            </div>
                            }
                        </Grid>
                        <Grid xs={8}>
                            <div style={{fontSize: "16px", marginTop: "20px", display: "flex"}}>
                                <div style={{color: "#304256", fontWeight: "bold"}}>{destinyPlanItem.Title}</div>
                                {destinyPlanItem.Subtitle ?
                                    <div style={{display: "flex"}}>: {destinyPlanItem.Subtitle} Subtitle</div>
                                    : null }
                            </div>                            
                            <div>By {destinyPlanItem.Author}</div>
                            <div>{destinyPlanItem.StartDate != "" ? "Date: " + destinyPlanItem.StartDate : "" }</div>
                            <div>Length: {destinyPlanItem.Duration}</div>
                            <div style={{marginTop: "20px",}}>
                                {destinyPlanItem.Description}
                            </div>
                            <div style={{marginTop: "20px",}}>
                                <div dangerouslySetInnerHTML={{__html: destinyPlanItem?.Content ? destinyPlanItem?.Content : ""}}></div>
                            </div>
                        </Grid>
                    </Grid>
                </div>
            )
    }
}

export default DestinyPlanMemberItem;