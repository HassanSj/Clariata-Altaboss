import React, {ReactElement} from "react";
import {Family} from "~/services/reports/persons";
import {Person} from "~/types/api/person";
import PDFEmbedded from "~/ui/components/Reports/PDFEmbedded";
import {IPDFReportOptions} from "~/ui/components/Reports/PDFEmbedded/PDFEmbedded";
import { getFamilyName, getFamilyPicture } from "../StoryOfUsReport/StoryOfUsReport";
import { Household } from "~/types/api/household";
import moment from "moment";

export interface FamilyProfileWorksheetProps {
  household?: Household;
  person?: Person;
  isOpen?: boolean;
  onClose?: () => unknown;
}

const reportLogo = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACIAAAAdCAYAAADPa766AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAKcSURBVFhH7ZbPbxJREMe//CpQoPwqtDVYabCpaXqpqYkxMSY9ePbiwWNvXrwb/wBj4tGLtx69ai+e9GATE2MMNSGNWis2VsC2LFCg8qvVN8sjwO57Cxwaa8In2TAzOzv7Zd+b2TX9YeAMYOa//5yhEC1DIVp6ds1WqYiPhRyKjTrm3GO4FgzxM2LeZveRPCrDajLhsi+AWbeHnzHGUEimWsHDTwnuNVm5EMOiz8+9buL5HFZ3trnX5MGlBUzaHdyTY7g0z35851YbulGp0eBeG4ppRRCiGiIMhSTLJW51k6785lYbUYyQ1dDyf3TNjMvNrW6mHE5utRHFCFkNLYZC7pyPcqsNbVa31YoUW4rHXzbVg2yK0TktohoierYvrf0Ga1+n2YKww4F5j1eN30/EcXR8rNqjFgseLSyq9oe8gj3WbX7bCCLOUfXoB6kQasV4QcEG+50f8yI4YmcxBdfHw7jo8uDJ9mee2eRebA5fy0W8OdhTxTrMZnZ9DlG2NFd8QWnLtxAuTWsekAhi87CAdXYDalGlVkNYMBcoVqrXUWY573NZrLPBRvmJQl6tRTWN0AlRalW8SO9yT8875QBemw1L/gCPQLUpRk9ABtWk2jJ0S/M8tYvX+xnu6bkaGMftyDR+VSqon5zAzEa5hR30RF6x615mUjxTz3JoErfORbjXjU7I0+SWuhQibk5MYYm9P1Z3vukGGLXvSjSm7iOZGNprd2dmudeNbmnoX4qgl9hyaAJr6Z/SybrGHv8NtpkpV4SsNmE4RzqhN2+FtWviMM8jemhjUg7lDkrfQqZdLmRZx/SCcih3UHR7hNosUxW/wETzQ0trnoiYtDul86TnZO2EPpL6EdLvx1AnAwk5TfreI6fNUIiWMyIE+Au9fCiAp3aqtAAAAABJRU5ErkJggg==";

const FamilyProfileWorksheet = ({ household, person, isOpen, onClose }: FamilyProfileWorksheetProps): ReactElement => {

  const options: IPDFReportOptions = {
    title: 'Client Profile Report',
    storyofus: true,
    worksheet: true,
    reportLogo: reportLogo,
    isOpen,
    onClose
  }

  return (
    <>
      <PDFEmbedded options={options}>
        <>
         <div className="ppw-top">
            <div className="body-copy">
            <table className="wsh-tbl">
                  <thead>
                     <tr>
                        <th colSpan={8} className="wsh-tbl-headline">Key Facts</th>
                     </tr>
                  </thead>
                  <tbody>
                     <tr>
                        <td colSpan={8} className="wsh-tbl-child wsh-tbl-lpad">
                           <table className="wsh-tbl-child">
                              <tr>
                                 <td className="wsh-tbl-half">
                                    <table className="wsh-tbl-child">
                                       <tr>
                                          <td style={{"width":"15%"}} className="wsh-tbl-label">Last Name</td>
                                          <td style={{"width":"75%"}} className="wsh-tbl-value tbl-line-long">John</td>
                                       </tr>
                                    </table>
                                 </td>
                                 <td className="wsh-tbl-half">
                                    <table className="wsh-tbl-child">
                                       <tr>
                                          <td style={{"width":"19%"}} className="wsh-tbl-label wsh-tbl-lpad">First Name</td>
                                          <td style={{"width":"71%"}} className="wsh-tbl-value tbl-line-long">Doe</td>
                                       </tr>
                                    </table>
                                 </td>

                                 
                                 
                              </tr>
                           </table>
                        </td>
                     </tr>

                     <tr>
                        <td colSpan={8} className="wsh-tbl-child wsh-tbl-lpad">
                           <table className="wsh-tbl-child">
                              <tr>
                                 <td className="wsh-tbl-half">
                                    <table className="wsh-tbl-child">
                                       <tr>
                                          <td style={{"width":"34%"}} className="wsh-tbl-label">Preffered First Name</td>
                                          <td style={{"width":"66%"}} className="wsh-tbl-value tbl-line-long">John</td>
                                       </tr>
                                    </table>
                                 </td>
                                 <td className="wsh-tbl-half">
                                    <table className="wsh-tbl-child">
                                       <tr>
                                          <td style={{"width":"32%"}} className="wsh-tbl-label wsh-tbl-lpad">Original Surname</td>
                                          <td style={{"width":"68%"}} className="wsh-tbl-value tbl-line-long">Doe</td>
                                       </tr>
                                    </table>
                                 </td>

                                 
                                 
                              </tr>
                           </table>
                        </td>
                     </tr>

                     <tr>
                        <td colSpan={8} className="wsh-tbl-child wsh-tbl-lpad">
                           
                           <table className="wsh-tbl-child">
                              <tr>
                                 <td className="wsh-tbl-third">
                                    <table className="wsh-tbl-child">
                                       <tr>
                                          <td style={{"width":"24%"}} className="wsh-tbl-label">Birth Date</td>
                                          <td style={{"width":"76%"}} className="wsh-tbl-value tbl-line-long">20.10.2020</td>
                                       </tr>
                                    </table>
                                 </td>
                                 <td className="wsh-tbl-third">
                                    <table className="wsh-tbl-child">
                                       <tr>
                                          <td style={{"width":"15%"}} className="wsh-tbl-label wsh-tbl-lpad">Age</td>
                                          <td style={{"width":"85%"}} className="wsh-tbl-value tbl-line-long">20</td>
                                       </tr>
                                    </table>
                                 </td>
                                 <td className="wsh-tbl-third">
                                    <table className="wsh-tbl-child">
                                       <tr>
                                          <td style={{"width":"33%"}} className="wsh-tbl-label wsh-tbl-lpad">Birth Place</td>
                                          <td style={{"width":"67%"}} className="wsh-tbl-value tbl-line-long">Florida</td>
                                       </tr>
                                    </table>
                                 </td>
                                 
                                 
                              </tr>
                           </table>
                        </td>
                     </tr>

                     <tr>
                        <td colSpan={8} className="wsh-tbl-child wsh-tbl-lpad">
                           
                           <table className="wsh-tbl-child">
                              <tr>
                                 <td className="wsh-tbl-third">
                                    <table className="wsh-tbl-child">
                                       <tr>
                                          <td style={{"width":"32%"}} className="wsh-tbl-label">Deceased:</td>
                                          <td style={{"width":"76%"}} className="wsh-tbl-child">
                                             <table className="wsh-tbl-child not-100-percent">
                                                <tr>
                                                   <td className="wsh-tbl-label">Yes</td>
                                                   <td className="wsh-tbl-value">X</td>
                                                   <td className="wsh-tbl-label wsh-tbl-lpad">No</td>
                                                   <td className="wsh-tbl-value">-</td>
                                                </tr>
                                             </table>
                                          </td>
                                       </tr>
                                    </table>
                                 </td>
                                 <td className="wsh-tbl-third">
                                    <table className="wsh-tbl-child">
                                       <tr>
                                          <td style={{"width":"35%"}} className="wsh-tbl-label wsh-tbl-lpad">Age at Death</td>
                                          <td style={{"width":"65%"}} className="wsh-tbl-value tbl-line-long">200</td>
                                       </tr>
                                    </table>
                                 </td>
                                 <td className="wsh-tbl-third">
                                    <table className="wsh-tbl-child">
                                       <tr>
                                          <td style={{"width":"41%"}} className="wsh-tbl-label wsh-tbl-lpad">Cause of death</td>
                                          <td style={{"width":"59%"}} className="wsh-tbl-value tbl-line-long">None</td>
                                       </tr>
                                    </table>
                                 </td>
                                 
                                 
                              </tr>
                           </table>
                        </td>
                     </tr>
                     
                     <tr>
                        <td colSpan={8} className="wsh-tbl-child wsh-tbl-lpad">
                              <table className="wsh-tbl-child">
                                 <tr>
                                    <td style={{"width":"25%"}} className="wsh-tbl-label">Marital Status:</td>
                                    <td style={{"width":"75%"}} className="wsh-tbl-child">
                                       <table className="wsh-tbl-child">
                                             <tr>
                                                <td style={{"width":"11%"}} className="wsh-tbl-label">Married:</td>
                                                <td style={{"width":"20%"}} className="wsh-tbl-value">No</td>
                                                <td style={{"width":"6%"}} className="wsh-tbl-label wsh-tbl-lpad">Date</td>
                                                <td style={{"width":"15%"}} className="wsh-tbl-value">10.10.1000</td>
                                                <td style={{"width":"12%"}} className="wsh-tbl-label wsh-tbl-lpad"># Of Years</td>
                                                <td style={{"width":"16%"}} className="wsh-tbl-value">10.10.1000</td>
                                             </tr>
                                             <tr>
                                                <td style={{"width":"11%"}} className="wsh-tbl-label">Divorced:</td>
                                                <td style={{"width":"20%"}} className="wsh-tbl-value">No</td>
                                                <td style={{"width":"6%"}} className="wsh-tbl-label wsh-tbl-lpad">Date</td>
                                                <td style={{"width":"15%"}} className="wsh-tbl-value">10.10.1000</td>
                                                <td style={{"width":"12%"}} className="wsh-tbl-label wsh-tbl-lpad"># Of Years</td>
                                                <td style={{"width":"16%"}} className="wsh-tbl-value">10.10.1000</td>
                                             </tr>
                                             <tr>
                                                <td style={{"width":"11%"}} className="wsh-tbl-label">Separated:</td>
                                                <td style={{"width":"20%"}} className="wsh-tbl-value">No</td>
                                                <td style={{"width":"6%"}} className="wsh-tbl-label wsh-tbl-lpad">Date</td>
                                                <td style={{"width":"15%"}} className="wsh-tbl-value">10.10.1000</td>
                                                <td style={{"width":"12%"}} className="wsh-tbl-label wsh-tbl-lpad"># Of Years</td>
                                                <td style={{"width":"16%"}} className="wsh-tbl-value">10.10.1000</td>
                                             </tr>
                                             <tr>
                                                <td style={{"width":"11%"}} className="wsh-tbl-label">Widowed:</td>
                                                <td style={{"width":"20%"}} className="wsh-tbl-value">No</td>
                                                <td style={{"width":"6%"}} className="wsh-tbl-label wsh-tbl-lpad">Date</td>
                                                <td style={{"width":"15%"}} className="wsh-tbl-value">10.10.1000</td>
                                                <td style={{"width":"12%"}} className="wsh-tbl-label wsh-tbl-lpad"># Of Years</td>
                                                <td style={{"width":"16%"}} className="wsh-tbl-value">10.10.1000</td>
                                             </tr>
                                       </table>
                                    </td>
                                 </tr>
                              </table>
                        </td>
                     </tr>

                     

                     <tr>
                        <td colSpan={8}>
                              <table className="wsh-tbl-child">
                                 <tr>
                                    <td style={{"width":"15%"}} className="wsh-tbl-label wsh-tbl-lpad">Activites & Hobbies</td>
                                    <td style={{"width":"75%"}} className="wsh-tbl-value tbl-line-long">Soccer, Baseball</td>
                                 </tr>
                              </table>
                        </td>
                     </tr>

                     <tr>
                        <td colSpan={8}>
                              <table className="wsh-tbl-child">
                                 <tr>
                                    <td style={{"width":"16%"}} className="wsh-tbl-label wsh-tbl-lpad">Religious Affiliation</td>
                                    <td style={{"width":"74%"}} className="wsh-tbl-value tbl-line-long">Orthodox</td>
                                 </tr>
                              </table>
                        </td>
                     </tr>

                     <tr>
                        <td colSpan={8}>
                              <table className="wsh-tbl-child">
                                 <tr>
                                    <td style={{"width":"100%"}} className="wsh-tbl-label wsh-tbl-lpad">Family Legacy Notes <span className="light">(CIRCLE ALL THAT APPLY):</span></td>
                                 </tr>
                              </table>
                        </td>
                     </tr>

                     

                     <tr>
                        <td colSpan={8} className="wsh-tbl-child">
                           <table className="wsh-tbl-child">
                              <tr>
                                 <td className="wsh-tbl-label to-circle light-blue-cell one-third-cell wsh-tbl-lpad"><span>Executor</span></td>
                                 <td className="wsh-tbl-label to-circle one-third-cell"><span>Power of Attorney</span></td>
                                 <td className="wsh-tbl-label no-circle light-blue-cell one-third-cell"><span>Guardian of Pets</span></td>
                              </tr>
                              <tr>
                                 <td className="wsh-tbl-label to-circle one-third-cell wsh-tbl-lpad"><span>Successor Executor</span></td>
                                 <td className="wsh-tbl-label to-circle light-blue-cell one-third-cell"><span>Successor POA</span></td>
                                 <td className="wsh-tbl-label no-circle one-third-cell"><span>Trustee</span></td>
                              </tr>
                              <tr>
                                 <td className="wsh-tbl-label to-circle light-blue-cell one-third-cell wsh-tbl-lpad"><span>Durable Health Care POA</span></td>
                                 <td className="wsh-tbl-label no-circle one-third-cell"><span>Successor Trustee</span></td>
                                 <td className="wsh-tbl-label no-circle light-blue-cell one-third-cell"><span>Successor Health Care Poa</span></td>
                              </tr>
                           </table>
                        </td>
                     </tr>

                     <tr>
                        <td colSpan={8}>
                              <table className="wsh-tbl-child">
                                 <tr>
                                    <td style={{"width":"16%"}} className="wsh-tbl-label wsh-tbl-lpad">Guardian Of</td>
                                    <td style={{"width":"74%"}} className="wsh-tbl-value tbl-line-long">Child Name</td>
                                 </tr>
                              </table>
                        </td>
                     </tr>

                     <tr>
                        <td colSpan={8}>
                              <table className="wsh-tbl-child">
                                 <tr>
                                    <td style={{"width":"16%"}} className="wsh-tbl-label wsh-tbl-lpad">Aware of Role</td>
                                    <td style={{"width":"74%"}} className="wsh-tbl-value tbl-line-long">Yes</td>
                                 </tr>
                              </table>
                        </td>
                     </tr>

                  </tbody>
               </table>
               

               <table className="wsh-tbl">
                  <thead>
                     <tr>
                        <th colSpan={8} className="wsh-tbl-headline">Education</th>
                     </tr>
                  </thead>
                  <tbody>
                     <tr>
                        <td colSpan={8}>
                              <table className="wsh-tbl-child">
                                 <tr>
                                    <td style={{"width":"10%"}} className="wsh-tbl-label wsh-tbl-lpad">Institution</td>
                                    <td style={{"width":"90%"}} className="wsh-tbl-value tbl-line-long">Some College</td>
                                 </tr>
                              </table>
                        </td>
                     </tr>
                     
                     <tr>
                        <td colSpan={8} className="wsh-tbl-child wsh-tbl-lpad">
                           <table className="wsh-tbl-child">
                              <tr>
                                 <td className="wsh-tbl-half">
                                    <table className="wsh-tbl-child">
                                       <tr>
                                          <td style={{"width":"13%"}} className="wsh-tbl-label">Degree</td>
                                          <td style={{"width":"87%"}} className="wsh-tbl-value tbl-line-long">John</td>
                                       </tr>
                                    </table>
                                 </td>
                                 <td className="wsh-tbl-half">
                                    <table className="wsh-tbl-child">
                                       <tr>
                                          <td style={{"width":"30%"}} className="wsh-tbl-label wsh-tbl-lpad">Graduation Date</td>
                                          <td style={{"width":"70%"}} className="wsh-tbl-value tbl-line-long">10.20.2021</td>
                                       </tr>
                                    </table>
                                 </td>                                          
                              </tr>
                           </table>
                        </td>
                     </tr>


                     <tr>
                        <td colSpan={8} className="wsh-tbl-sep-top"></td>
                     </tr>
                     <tr>
                        <td colSpan={8} className="wsh-tbl-sep"></td>
                     </tr>
                     <tr>
                        <td colSpan={8} className="wsh-tbl-sep-top"></td>
                     </tr>

                     <tr>
                        <td colSpan={8}>
                              <table className="wsh-tbl-child">
                                 <tr>
                                    <td style={{"width":"10%"}} className="wsh-tbl-label wsh-tbl-lpad">Institution</td>
                                    <td style={{"width":"90%"}} className="wsh-tbl-value tbl-line-long">Some College</td>
                                 </tr>
                              </table>
                        </td>
                     </tr>
                     
                     <tr>
                        <td colSpan={8} className="wsh-tbl-child wsh-tbl-lpad">
                           <table className="wsh-tbl-child">
                              <tr>
                                 <td className="wsh-tbl-half">
                                    <table className="wsh-tbl-child">
                                       <tr>
                                          <td style={{"width":"13%"}} className="wsh-tbl-label">Degree</td>
                                          <td style={{"width":"87%"}} className="wsh-tbl-value tbl-line-long">John</td>
                                       </tr>
                                    </table>
                                 </td>
                                 <td className="wsh-tbl-half">
                                    <table className="wsh-tbl-child">
                                       <tr>
                                          <td style={{"width":"30%"}} className="wsh-tbl-label wsh-tbl-lpad">Graduation Date</td>
                                          <td style={{"width":"70%"}} className="wsh-tbl-value tbl-line-long">10.20.2021</td>
                                       </tr>
                                    </table>
                                 </td>                                          
                              </tr>
                           </table>
                        </td>
                     </tr>

                  </tbody>
               </table>

               

               <table className="wsh-tbl">
                  <thead>
                     <tr>
                        <th colSpan={8} className="wsh-tbl-headline">Occupation</th>
                     </tr>
                  </thead>
                  <tbody>

                     <tr>
                        <td colSpan={8} className="wsh-tbl-child wsh-tbl-lpad">
                           <table className="wsh-tbl-child">
                              <tr>
                                 <td className="wsh-tbl-half">
                                    <table className="wsh-tbl-child">
                                       <tr>
                                          <td style={{"width":"14%"}} className="wsh-tbl-label">Company</td>
                                          <td style={{"width":"86%"}} className="wsh-tbl-value tbl-line-long">Lamark</td>
                                       </tr>
                                    </table>
                                 </td>
                                 <td className="wsh-tbl-half">
                                    <table className="wsh-tbl-child">
                                       <tr>
                                          <td style={{"width":"18%"}} className="wsh-tbl-label wsh-tbl-lpad">Position</td>
                                          <td style={{"width":"82%"}} className="wsh-tbl-value tbl-line-long">coder</td>
                                       </tr>
                                    </table>
                                 </td>

                                 
                                 
                              </tr>
                           </table>
                        </td>
                     </tr>

                     <tr>
                        <td colSpan={8} className="wsh-tbl-child wsh-tbl-lpad">
                           <table className="wsh-tbl-child">
                              <tr>
                                 <td className="wsh-tbl-half">
                                    <table className="wsh-tbl-child">
                                       <tr>
                                          <td style={{"width":"17%"}} className="wsh-tbl-label">Start Date</td>
                                          <td style={{"width":"83%"}} className="wsh-tbl-value tbl-line-long">10.21.2103</td>
                                       </tr>
                                    </table>
                                 </td>
                                 <td className="wsh-tbl-half">
                                    <table className="wsh-tbl-child">
                                       <tr>
                                          <td style={{"width":"30%"}} className="wsh-tbl-label wsh-tbl-lpad">Retirement Date</td>
                                          <td style={{"width":"70%"}} className="wsh-tbl-value tbl-line-long">10.10.2012</td>
                                       </tr>
                                    </table>
                                 </td>

                                 
                                 
                              </tr>
                           </table>
                        </td>
                     </tr>

                     <tr>
                        <td colSpan={8}>
                              <table className="wsh-tbl-child">
                                 <tr>
                                    <td style={{"width":"12%"}} className="wsh-tbl-label wsh-tbl-lpad">Work History</td>
                                    <td style={{"width":"88%"}} className="wsh-tbl-value tbl-line-long">lorem ipsum dolor imet</td>
                                 </tr>
                              </table>
                        </td>
                     </tr>

                     <tr>
                        <td colSpan={8} className="wsh-tbl-child wsh-tbl-lpad">
                           <table className="wsh-tbl-child">
                              <tr>
                                 <td className="wsh-tbl-half">
                                    <table className="wsh-tbl-child">
                                       <tr>
                                          <td style={{"width":"40%"}} className="wsh-tbl-label">Privately Owned Company</td>
                                          <td style={{"width":"60%"}} className="wsh-tbl-value tbl-line-long">No</td>
                                       </tr>
                                    </table>
                                 </td>
                                 <td className="wsh-tbl-half">
                                    <table className="wsh-tbl-child">
                                       <tr>
                                          <td style={{"width":"25%"}} className="wsh-tbl-label wsh-tbl-lpad">% Ownership</td>
                                          <td style={{"width":"75%"}} className="wsh-tbl-value tbl-line-long">10%</td>
                                       </tr>
                                    </table>
                                 </td> 
                              </tr>
                           </table>
                        </td>
                     </tr>
                     
                     <tr>
                        <td colSpan={8} className="wsh-tbl-child wsh-tbl-lpad">
                           
                           <table className="wsh-tbl-child">
                              <tr>
                                 <td className="wsh-tbl-third">
                                    <table className="wsh-tbl-child">
                                       <tr>
                                          <td style={{"width":"34%"}} className="wsh-tbl-label">Founded Date</td>
                                          <td style={{"width":"66%"}} className="wsh-tbl-value tbl-line-long">20.10.2020</td>
                                       </tr>
                                    </table>
                                 </td>
                                 <td className="wsh-tbl-third">
                                    <table className="wsh-tbl-child">
                                       <tr>
                                          <td style={{"width":"44%"}} className="wsh-tbl-label wsh-tbl-lpad">Acquisition Date</td>
                                          <td style={{"width":"56%"}} className="wsh-tbl-value tbl-line-long">20.10.2020</td>
                                       </tr>
                                    </table>
                                 </td>
                                 <td className="wsh-tbl-third">
                                    <table className="wsh-tbl-child">
                                       <tr>
                                          <td style={{"width":"29%"}} className="wsh-tbl-label wsh-tbl-lpad">Sold Date</td>
                                          <td style={{"width":"71%"}} className="wsh-tbl-value tbl-line-long">20.10.2020</td>
                                       </tr>
                                    </table>
                                 </td>
                                 
                                 
                              </tr>
                           </table>
                        </td>
                     </tr>
                     
                     <tr>
                        <td colSpan={8} className="wsh-tbl-child wsh-tbl-lpad">
                           <table className="wsh-tbl-child">
                              <tr>
                                 <td className="wsh-tbl-half">
                                    <table className="wsh-tbl-child">
                                       <tr>
                                          <td style={{"width":"25%"}} className="wsh-tbl-label"># Of Employees</td>
                                          <td style={{"width":"75%"}} className="wsh-tbl-value tbl-line-long">100</td>
                                       </tr>
                                    </table>
                                 </td>
                                 <td className="wsh-tbl-half">
                                    <table className="wsh-tbl-child">
                                       <tr>
                                          <td style={{"width":"29%"}} className="wsh-tbl-label wsh-tbl-lpad">Annual Revenue</td>
                                          <td style={{"width":"71%"}} className="wsh-tbl-value tbl-line-long">10mil</td>
                                       </tr>
                                    </table>
                                 </td> 
                              </tr>
                           </table>
                        </td>
                     </tr>
                     
                     <tr>
                        <td colSpan={8} className="wsh-tbl-child wsh-tbl-lpad">
                           <table className="wsh-tbl-child">
                              <tr>
                                 <td className="wsh-tbl-half">
                                    <table className="wsh-tbl-child">
                                       <tr>
                                          <td style={{"width":"25%"}} className="wsh-tbl-label">Company Phone</td>
                                          <td style={{"width":"75%"}} className="wsh-tbl-value tbl-line-long">000.0000.0000</td>
                                       </tr>
                                    </table>
                                 </td>
                                 <td className="wsh-tbl-half">
                                    <table className="wsh-tbl-child">
                                       <tr>
                                          <td style={{"width":"31%"}} className="wsh-tbl-label wsh-tbl-lpad">Company Website</td>
                                          <td style={{"width":"69%"}} className="wsh-tbl-value tbl-line-long">www.www.com</td>
                                       </tr>
                                    </table>
                                 </td> 
                              </tr>
                           </table>
                        </td>
                     </tr>

                     <tr>
                        <td colSpan={8}>
                              <table className="wsh-tbl-child">
                                 <tr>
                                    <td style={{"width":"14%"}} className="wsh-tbl-label wsh-tbl-lpad">Company Address</td>
                                    <td style={{"width":"76%"}} className="wsh-tbl-value tbl-line-long">1 South Limestone, suite b, Springfield, Ohio, 45502</td>
                                 </tr>
                              </table>
                        </td>
                     </tr>

                     <tr>
                        <td colSpan={8} className="wsh-tbl-child wsh-tbl-lpad">
                           
                           <table className="wsh-tbl-child">
                              <tr>
                                 <td className="wsh-tbl-third">
                                    <table className="wsh-tbl-child">
                                       <tr>
                                          <td style={{"width":"10%"}} className="wsh-tbl-label">City</td>
                                          <td style={{"width":"90%"}} className="wsh-tbl-value tbl-line-long">Miami</td>
                                       </tr>
                                    </table>
                                 </td>
                                 <td className="wsh-tbl-third">
                                    <table className="wsh-tbl-child">
                                       <tr>
                                          <td style={{"width":"19%"}} className="wsh-tbl-label wsh-tbl-lpad">State</td>
                                          <td style={{"width":"81%"}} className="wsh-tbl-value tbl-line-long">Florida</td>
                                       </tr>
                                    </table>
                                 </td>
                                 <td className="wsh-tbl-third">
                                    <table className="wsh-tbl-child">
                                       <tr>
                                          <td style={{"width":"12%"}} className="wsh-tbl-label wsh-tbl-lpad">Zip</td>
                                          <td style={{"width":"88%"}} className="wsh-tbl-value tbl-line-long">45502</td>
                                       </tr>
                                    </table>
                                 </td>
                                                                           
                              </tr>
                           </table>
                        </td>
                     </tr>

                     <tr>
                        <td colSpan={8} className="wsh-tbl-child wsh-tbl-lpad">
                              <table className="wsh-tbl-child">
                                 <tr>
                                    <td style={{"width":"40%"}} className="wsh-tbl-label">Involvement With Enterprise:</td>
                                    <td style={{"width":"60%"}} className="wsh-tbl-child">
                                       <table className="wsh-tbl-child">
                                             <tr>
                                                <td style={{"width":"30%"}} className="wsh-tbl-label">Employee Of Company</td>
                                                <td style={{"width":"10%"}} className="wsh-tbl-value">No</td>
                                                <td style={{"width":"10%"}} className="wsh-tbl-label wsh-tbl-lpad">Dates</td>
                                                <td style={{"width":"24%"}} className="wsh-tbl-value">10.10.1000</td>
                                             </tr>
                                             <tr>
                                                <td style={{"width":"30%"}} className="wsh-tbl-label">Board of Directors/Advisors</td>
                                                <td style={{"width":"10%"}} className="wsh-tbl-value">No</td>
                                                <td style={{"width":"10%"}} className="wsh-tbl-label wsh-tbl-lpad">Dates</td>
                                                <td style={{"width":"24%"}} className="wsh-tbl-value">10.10.1000</td>
                                             </tr>
                                             <tr>
                                                <td style={{"width":"30%"}} className="wsh-tbl-label">Family Council Position</td>
                                                <td style={{"width":"10%"}} className="wsh-tbl-value">No</td>
                                                <td style={{"width":"10%"}} className="wsh-tbl-label wsh-tbl-lpad">Dates</td>
                                                <td style={{"width":"24%"}} className="wsh-tbl-value">10.10.1000</td>
                                             </tr>
                                             <tr>
                                                <td style={{"width":"30%"}} className="wsh-tbl-label">Family Committee Member</td>
                                                <td style={{"width":"10%"}} className="wsh-tbl-value">No</td>
                                                <td style={{"width":"10%"}} className="wsh-tbl-label wsh-tbl-lpad">Dates</td>
                                                <td style={{"width":"24%"}} className="wsh-tbl-value">10.10.1000</td>
                                             </tr>
                                             <tr>
                                                <td style={{"width":"30%"}} className="wsh-tbl-label">Other</td>
                                                <td style={{"width":"10%"}} className="wsh-tbl-value">No</td>
                                                <td style={{"width":"10%"}} className="wsh-tbl-label wsh-tbl-lpad">Dates</td>
                                                <td style={{"width":"24%"}} className="wsh-tbl-value">10.10.1000</td>
                                             </tr>
                                       </table>
                                    </td>
                                 </tr>
                              </table>
                        </td>
                     </tr>
                     
                                                   
                  </tbody>
               </table>

               

               <table className="wsh-tbl">
                  <thead>
                     <tr>
                        <th colSpan={10} className="wsh-tbl-headline">Contact Information</th>
                     </tr>
                  </thead>
                  <tbody>

                     <tr>
                        <td colSpan={8}>
                              <table className="wsh-tbl-child">
                                 <tr>
                                    <td style={{"width":"6%"}} className="wsh-tbl-label wsh-tbl-lpad">Email</td>
                                    <td style={{"width":"94%"}} className="wsh-tbl-value tbl-line-long">ddinescu@goupward.com</td>
                                 </tr>
                              </table>
                        </td>
                     </tr>

                     <tr>
                        <td colSpan={8}>
                              <table className="wsh-tbl-child">
                                 <tr>
                                    <td style={{"width":"8%"}} colSpan={2} className="wsh-tbl-label wsh-tbl-lpad">Phone</td>
                                    <td style={{"width":"40%"}} className="wsh-tbl-value tbl-line-long">111.1111.1111</td>
                                    <td style={{"width":"20%"}} colSpan={1} className="wsh-tbl-instruction wsh-tbl-lpad wsh-tbl-right">(circle one)</td>
                                    <td style={{"width":"4%"}} colSpan={1} className="wsh-tbl-label to-circle one-third-cell light-blue-cell small-font-wsh"><span>Cell</span></td>
                                    <td style={{"width":"4%"}} colSpan={1} className="wsh-tbl-label no-circle one-third-cell small-font-wsh"><span>Home</span></td>
                                    <td style={{"width":"4%"}} colSpan={1} className="wsh-tbl-label to-circle one-third-cell light-blue-cell small-font-wsh"><span>Work</span></td>
                                    <td style={{"width":"3%"}} colSpan={1} className="wsh-tbl-label no-circle one-third-cell small-font-wsh"><span>Fax</span></td>
                                    <td style={{"width":"4%"}} colSpan={1} className="wsh-tbl-label to-circle one-third-cell light-blue-cell small-font-wsh"><span>Other</span></td>
                                 </tr>
                              </table>
                        </td>
                     </tr>

                     <tr>
                        <td colSpan={8}>
                              <table className="wsh-tbl-child">
                                 <tr>
                                    <td style={{"width":"8%"}} colSpan={2} className="wsh-tbl-label wsh-tbl-lpad">Phone</td>
                                    <td style={{"width":"40%"}} className="wsh-tbl-value tbl-line-long">111.1111.1111</td>
                                    <td style={{"width":"20%"}} colSpan={1} className="wsh-tbl-instruction wsh-tbl-lpad wsh-tbl-right">(circle one)</td>
                                    <td style={{"width":"4%"}} colSpan={1} className="wsh-tbl-label to-circle one-third-cell light-blue-cell small-font-wsh"><span>Cell</span></td>
                                    <td style={{"width":"4%"}} colSpan={1} className="wsh-tbl-label no-circle one-third-cell small-font-wsh"><span>Home</span></td>
                                    <td style={{"width":"4%"}} colSpan={1} className="wsh-tbl-label to-circle one-third-cell light-blue-cell small-font-wsh"><span>Work</span></td>
                                    <td style={{"width":"3%"}} colSpan={1} className="wsh-tbl-label no-circle one-third-cell small-font-wsh"><span>Fax</span></td>
                                    <td style={{"width":"4%"}} colSpan={1} className="wsh-tbl-label to-circle one-third-cell light-blue-cell small-font-wsh"><span>Other</span></td>
                                 </tr>
                              </table>
                        </td>
                     </tr>

                     <tr>
                        <td colSpan={8}>
                              <table className="wsh-tbl-child">
                                 <tr>
                                    <td style={{"width":"8%"}} colSpan={2} className="wsh-tbl-label wsh-tbl-lpad">Phone</td>
                                    <td style={{"width":"40%"}} className="wsh-tbl-value tbl-line-long">111.1111.1111</td>
                                    <td style={{"width":"20%"}} colSpan={1} className="wsh-tbl-instruction wsh-tbl-lpad wsh-tbl-right">(circle one)</td>
                                    <td style={{"width":"4%"}} colSpan={1} className="wsh-tbl-label to-circle one-third-cell light-blue-cell small-font-wsh"><span>Cell</span></td>
                                    <td style={{"width":"4%"}} colSpan={1} className="wsh-tbl-label no-circle one-third-cell small-font-wsh"><span>Home</span></td>
                                    <td style={{"width":"4%"}} colSpan={1} className="wsh-tbl-label to-circle one-third-cell light-blue-cell small-font-wsh"><span>Work</span></td>
                                    <td style={{"width":"3%"}} colSpan={1} className="wsh-tbl-label no-circle one-third-cell small-font-wsh"><span>Fax</span></td>
                                    <td style={{"width":"4%"}} colSpan={1} className="wsh-tbl-label to-circle one-third-cell light-blue-cell small-font-wsh"><span>Other</span></td>
                                 </tr>
                              </table>
                        </td>
                     </tr>

                     <tr>
                        <td colSpan={8} className="wsh-tbl-child wsh-tbl-lpad">
                           <table className="wsh-tbl-child">
                              <tr>
                                 <td className="wsh-tbl-half">
                                    <table className="wsh-tbl-child">
                                       <tr>
                                          <td style={{"width":"14%"}} className="wsh-tbl-label">Address</td>
                                          <td style={{"width":"76%"}} className="wsh-tbl-value tbl-line-long">1 south limestone</td>
                                       </tr>
                                    </table>
                                 </td>
                                 <td className="wsh-tbl-half">
                                    <table className="wsh-tbl-child">
                                       <tr>
                                          <td style={{"width":"11%"}} className="wsh-tbl-label wsh-tbl-lpad">City</td>
                                          <td style={{"width":"89%"}} className="wsh-tbl-value tbl-line-long">Springfield</td>
                                       </tr>
                                    </table>
                                 </td>
                              </tr>
                           </table>
                        </td>
                     </tr>
                     
                     <tr>
                        <td colSpan={8}>
                              <table className="wsh-tbl-child">
                                 <tr>
                                    <td style={{"width":"5%"}} colSpan={2} className="wsh-tbl-label wsh-tbl-lpad">State</td>
                                    <td style={{"width":"20%"}} className="wsh-tbl-value tbl-line-long">Ohio</td>
                                    <td style={{"width":"4%"}} colSpan={2} className="wsh-tbl-label wsh-tbl-lpad">Zip</td>
                                    <td style={{"width":"20%"}} className="wsh-tbl-value tbl-line-long">45502</td>
                                    <td style={{"width":"8%"}} colSpan={1} className="wsh-tbl-instruction wsh-tbl-lpad wsh-tbl-right">(circle one)</td>
                                    <td style={{"width":"4%"}} colSpan={1} className="wsh-tbl-label to-circle one-third-cell light-blue-cell small-font-wsh"><span>Home</span></td>
                                    <td style={{"width":"4%"}} colSpan={1} className="wsh-tbl-label no-circle one-third-cell small-font-wsh"><span>Work</span></td>
                                    <td style={{"width":"4%"}} colSpan={1} className="wsh-tbl-label no-circle one-third-cell light-blue-cell small-font-wsh"><span>Vacation</span></td>
                                    <td style={{"width":"4%"}} colSpan={1} className="wsh-tbl-label no-circle one-third-cell light-blue-cell small-font-wsh"><span>Other</span></td>
                                 </tr>
                              </table>
                        </td>
                     </tr>

                     <tr>
                        <td colSpan={8} className="wsh-tbl-sep-top"></td>
                     </tr>
                     <tr>
                        <td colSpan={8} className="wsh-tbl-sep"></td>
                     </tr>
                     <tr>
                        <td colSpan={8} className="wsh-tbl-sep-top"></td>
                     </tr>
                     
                     <tr>
                        <td colSpan={8} className="wsh-tbl-child wsh-tbl-lpad">
                           <table className="wsh-tbl-child">
                              <tr>
                                 <td className="wsh-tbl-half">
                                    <table className="wsh-tbl-child">
                                       <tr>
                                          <td style={{"width":"14%"}} className="wsh-tbl-label">Address</td>
                                          <td style={{"width":"76%"}} className="wsh-tbl-value tbl-line-long">1 south limestone</td>
                                       </tr>
                                    </table>
                                 </td>
                                 <td className="wsh-tbl-half">
                                    <table className="wsh-tbl-child">
                                       <tr>
                                          <td style={{"width":"11%"}} className="wsh-tbl-label wsh-tbl-lpad">City</td>
                                          <td style={{"width":"89%"}} className="wsh-tbl-value tbl-line-long">Springfield</td>
                                       </tr>
                                    </table>
                                 </td>
                              </tr>
                           </table>
                        </td>
                     </tr>
                     
                     <tr>
                        <td colSpan={8}>
                              <table className="wsh-tbl-child">
                                 <tr>
                                    <td style={{"width":"5%"}} colSpan={2} className="wsh-tbl-label wsh-tbl-lpad">State</td>
                                    <td style={{"width":"20%"}} className="wsh-tbl-value tbl-line-long">Ohio</td>
                                    <td style={{"width":"4%"}} colSpan={2} className="wsh-tbl-label wsh-tbl-lpad">Zip</td>
                                    <td style={{"width":"20%"}} className="wsh-tbl-value tbl-line-long">45502</td>
                                    <td style={{"width":"8%"}} colSpan={1} className="wsh-tbl-instruction wsh-tbl-lpad wsh-tbl-right">(circle one)</td>
                                    <td style={{"width":"4%"}} colSpan={1} className="wsh-tbl-label to-circle one-third-cell light-blue-cell small-font-wsh"><span>Home</span></td>
                                    <td style={{"width":"4%"}} colSpan={1} className="wsh-tbl-label no-circle one-third-cell small-font-wsh"><span>Work</span></td>
                                    <td style={{"width":"4%"}} colSpan={1} className="wsh-tbl-label no-circle one-third-cell light-blue-cell small-font-wsh"><span>Vacation</span></td>
                                    <td style={{"width":"4%"}} colSpan={1} className="wsh-tbl-label no-circle one-third-cell light-blue-cell small-font-wsh"><span>Other</span></td>
                                 </tr>
                              </table>
                        </td>
                     </tr>

                     <tr>
                        <td colSpan={8} className="wsh-tbl-sep-top"></td>
                     </tr>

                  </tbody>
               </table>

            </div>
         </div>
        </>
      </PDFEmbedded>
    </>
  )
}


export default FamilyProfileWorksheet;
