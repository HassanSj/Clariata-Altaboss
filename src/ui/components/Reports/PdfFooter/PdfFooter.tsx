import React, {ReactElement} from "react";

export interface PdfFooterProps {
  title?: string;
  ownerName?: string
}

const logoBase64 = `data:image/png;base64,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`;

const PdfFooter = ({ title, ownerName }: PdfFooterProps): ReactElement => {

  return (
    <>
        <style>
            
        </style>
        <div className="footer">
            <div className="footer-content">
            <div className="footer-left"><span className="logo" style={{content: 'url("'+logoBase64+'")', }}></span></div>
            <div className="footer-center">{title} | Prepared by {ownerName}</div>
            <div className="footer-right"><span className="pageNumber"></span></div>
            </div>
        </div>
    </>
  )
}


export default PdfFooter;
