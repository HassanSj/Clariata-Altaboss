import { useEffect, useState } from "react";
import api from "~/services/api";
import { User } from "~/types/api/user";
import { logoBase64WithouText } from "../PDFReportExport/images";

export interface IReportWrapper {
    children: any; 
    reportTitle?: string;
    ownerId: string | number;
    householdId: number;
    includePageBreak?: boolean
    isWide?: boolean   
    isLandscape?: boolean     
}

const ReportWrapper = ({ children, reportTitle, ownerId, householdId, includePageBreak, isWide, isLandscape } : IReportWrapper) => {

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
        <div className={isLandscape ? "table-page-landscape" : "table-page"}>
            
                <div>
                    <div style={{verticalAlign: "top"}}>
                        <div className={isWide ? "report-page-wide" : "report-page"}>
                            {children}
                        </div>
                    <div>
                </div>
                <div>
                    <div style={{alignItems: "baseline"}}>
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
                    </div>
                </div>
            </div>
        </div>
        </div>
        { includePageBreak ?         
            <div className="newPage"></div> 
            : null 
        }
        </>
    )

}

export default ReportWrapper;