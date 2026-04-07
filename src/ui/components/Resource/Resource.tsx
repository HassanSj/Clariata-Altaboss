import React from 'react';
import { ResourcesList } from "./ResourcesList";

export const ContactResource = () => {
    return (
        <div>
                <ul>
                    <li>
                        Toolset
                    </li>
                    <ul>
                        <li>
                            Video
                        </li>
                        <li>
                            Introduction
                        </li>
                        <ul>         
                            <li>
                                Advisor
                            </li>
                            <li>
                                Client
                            </li>
                        </ul>
                        <li>
                            Checklist
                        </li>
                        <li>
                            Checklist Details
                        </li>
                    </ul>            
                    <li>
                        Worksheets
                    </li>
                    <ul>
                        <li>
                            Pre-Interview Worksheet
                        </li>
                        <li>
                            Personal Profile Worksheet
                        </li>
                        <li>
                            Professional/Other Network Worksheet
                        </li>
                    </ul>           
                    <li>
                        Reports
                    </li>
                    <ul>
                        <li>
                            Client Profile
                        </li>
                        <li>
                            Legacy of Five Profile
                        </li>
                    </ul>
                </ul>
            </div> 
    )
}

const Resource: any = (props : {module: string}) => {
    const modules = ["Discover", "Dream", "Direction", "Destiny", "Deepen"]
    console.log(props.module);
    return (
        <div>
            {/* {(() => {
                switch (props.module) {
                    case 'Contacts':
                        return <ContactResource/>
                    case 'Discover':
                        return <ResourcesList module={props?.module}/>
                    case 'Dream':
                        return <ResourcesList module={props?.module}/>
                    case 'Direction':
                        return <ResourcesList module={props?.module}/>
                    default:
                        return null
                }
            })()} */}
        </div>
    )
}

export default Resource