import { useEffect, useState } from "react";
import api from "~/services/api";
import { User } from "~/types/api/user";
import { logoBase64WithouText } from "../../../Reports/PDFReportExport/images"
import styles from "./GenericWrapper.module.scss"
import classnames from "classnames";
export interface IReportWrapper {
    children: any; 
    reportTitle?: string;
    ownerId: string | number;
    householdId: number;
    includePageBreak?: boolean
    isWide?: boolean   
    isLandscape?: boolean     
}

const DestinyItemWrapper = ({ children, reportTitle, ownerId, householdId, includePageBreak, isWide, isLandscape } : IReportWrapper) => {

    const [owner, setOwner] = useState<User>();

    const getOwnerInfo = async (ownerId: string | number, householdId: number) => {

        let user = (await api.user.getHouseholdUser(ownerId, householdId))?.data as User;
    
        setOwner(user); 
    }

    useEffect(() => {

        getOwnerInfo(ownerId, householdId);

    }, [])

    return (
        <>
        <table className={isLandscape ? styles.tablePageLandscape: styles.tablePages}>
            <tbody>
                <tr>
                    <td style={{verticalAlign: "top"}}>
                        <div className={isWide ? styles.reportPagesWide: styles.reportPages}>
                            {children}
                        </div>
                    </td>
                </tr>
                {/* <tr>
                    <td valign="bottom">
                        <div style={{marginLeft: "54px", marginBottom: "20px"}}>
                            <table className="pdf-footer-table">
                                <tr>
                                    <td className="pdf-footer-table-td" rowSpan={2}><img src={logoBase64WithouText} className="pdf-footer-logo" /></td>
                                    <td className="pdf-footer-table-td">
                                        <div className="pdf-footer-createdby">
                                            {reportTitle} | Prepared By {owner?.FirstName} {owner?.LastName}
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <td className="pdf-footer-copyright">
                                        &copy; 2022 Clariata, LLC. All Rights Reserved.
                                    </td>
                                </tr>
                            </table>
                        </div>
                    </td>
                </tr> */}
            </tbody>
        </table>
        { includePageBreak ?         
            <div className="newPage"></div> 
            : null 
        }
        </>
    )

}

export default DestinyItemWrapper;