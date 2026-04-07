import {isExcelReport, isPdfReport, ReportDefinition} from "~/ui/constants/reports";
import Modal from "~/ui/components/Dialogs/Modal";
import React, {useState} from "react";
import {Button, Checkbox, FormControlLabel, Grid} from "@material-ui/core";
import { PDFExport, savePDF, PDFExportProps } from "@progress/kendo-react-pdf";

export interface IReportViewProps {
  definition: ReportDefinition;
  props?: any;
  isOpen: boolean;
  onClose: () => unknown;
  onDownload: (saveToAWS: boolean) => unknown;
}

const ReportViewer = ({definition, props, isOpen, onClose, onDownload}: IReportViewProps) => {
  const [saveToAWS, setSaveToAWS] = useState<boolean>(false)

  const pdfExportComponent = React.useRef<PDFExport>(null); 

    const exportPDFWithComponent = () => {
        if (pdfExportComponent.current) {
          pdfExportComponent.current.save();
        }
      };

  return (
    <>
      {(definition && props) ?
        <Grid>
          {React.createElement(
            definition.component,
            {...props, isModal: true}
          )}
          <br/><br/>
        </Grid>
        : null}
    </>
  )
}

export default ReportViewer;
