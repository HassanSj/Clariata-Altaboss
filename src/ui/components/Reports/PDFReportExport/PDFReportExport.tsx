import * as React from "react";
import * as ReactDOM from "react-dom";
import { PDFExport, savePDF, PDFExportProps, PageTemplateProps } from "@progress/kendo-react-pdf";
import {Button, Grid} from "@material-ui/core";
import { logoBase64, logoBase64WithouText, printBase64 } from './images';
import { componentsToColor, PageSizes } from "pdf-lib";
import { PageMargin } from "@progress/kendo-drawing/pdf";
import api from "~/services/api";
import { User } from '~/types/api/user';
import useNotifications from "~/ui/hooks/useNotifications";

export interface IReportOptions {
    title?: string;
    isOpen?: boolean | undefined;
    evaluation?: boolean | undefined;
    storyofus?: boolean | undefined;
    familyName?: string | undefined;
    familyImage?: string;
    onClose?: () => unknown | undefined;
    children?: any;
    worksheet?: boolean;
    headerFooter?: boolean;
    guidebook?: boolean;
    static?: boolean;
    reportLogo?: string;
    customHeader?: boolean;
    headerNoRight?: boolean;
    wide?: boolean;
    subTitle?: string;
    header?: boolean;
  }

interface IPDFReportExport {
    children: any;
    options: PDFExportProps;
    reportOptions: IReportOptions;
    excludeFooter?: boolean;
    margins?: PageMargin
}


const PDFReportExport = ({children, options, reportOptions, excludeFooter, margins} : IPDFReportExport) => {
    const notifications = useNotifications();
    const [owner, setOwner] = React.useState("")
    const pdfExportComponent = React.useRef<PDFExport>(null); 

    const exportPDFWithComponent = () => {
        if (pdfExportComponent.current) {
            console.log("Export");
            notifications.toggleLoading(true);
            pdfExportComponent.current.save();
            notifications.toggleLoading(false);
        }
      };

      
     const defaultMargins : PageMargin = {
        left: "30pt",
        right: "30pt",
        top: "0pt",
        bottom: "30pt",
    }

    if(options.author){
        api.user.getUser(options.author).then(res => res?.data).then(data => {
            let user = data as User;
            let owner = user?.FirstName + " " + user?.LastName;
            setOwner(owner);
        });       
    }
    
    const PageTemplate = (props: PageTemplateProps) => {
        return (
            <div className="pdf-footer">
                <table className="pdf-footer-table">
                    <tr>
                        <td className="pdf-footer-table-td" rowSpan={2}>
                            <img src={logoBase64WithouText} className="pdf-footer-logo"/>
                        </td>
                        <td className="pdf-footer-table-td">
                            <div className="pdf-footer-createdby">
                                {options.subject} | Prepared By 
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
        );
    }

    return (
        <div>
            <div>
                <Button
                    color="primary"
                    variant="outlined"
                    onClick={exportPDFWithComponent}
                >Export Report</Button>
            </div>
        <PDFExport ref={pdfExportComponent}
            paperSize={options.paperSize} creator="Clariata LLC" margin={margins ? margins : defaultMargins} fileName={options.fileName} scale={options.scale} keepTogether={options.keepTogether}
            forcePageBreak=".newPage" pageTemplate={excludeFooter? null : PageTemplate} landscape={options.landscape}>
            <>
                {children}
            </>
        </PDFExport>
        </div>
    );
} 

export default PDFReportExport;