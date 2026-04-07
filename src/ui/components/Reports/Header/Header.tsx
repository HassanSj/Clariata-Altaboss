import React, {ReactElement} from "react";
import { Household } from "~/types/api/household";
import { Person } from "~/types/api/person";
import { logoBase64, logoBase64WithouText, printBase64 } from '~/ui/components/Reports/PDFReportExport/images';

export interface HeaderProps {
    showHeader: boolean;
    household?: Household;
    persons?: Person[];
    title: string;
    subTitle: string | null;
    headerNoRight: boolean | undefined;
    storyofus: boolean;
    reportLogo: string | undefined;
    familyName: string | undefined;
    image: string | null;
    worksheet: boolean | undefined;
  }


const Header = (headerProps : HeaderProps): ReactElement => {
console.log(headerProps?.image)
return (
<>
    {headerProps.showHeader?
        <header className="pdf-header-as-table">
          <div className="h-left">
            {headerProps?.storyofus && <img src={headerProps.reportLogo ? headerProps.reportLogo : printBase64}></img>}
            <p>{headerProps.title}</p>
            {headerProps?.subTitle && headerProps?.subTitle != "" ? <><br/><p className="subTitle">{headerProps?.subTitle}</p></> : null }
          </div>
          {headerProps?.headerNoRight ? null :
          <div className="h-right">
              {headerProps?.image ? 
              <div className={headerProps?.worksheet ? "hr-wrapper worksheet" : "hr-wrapper"}>
                {headerProps?.worksheet ? 
                <>
                  NAME: <span> &nbsp; &nbsp; &nbsp; &nbsp; {headerProps?.familyName} &nbsp; &nbsp; &nbsp; &nbsp; </span>
                </> :
                <>
                  <p>{headerProps.familyName}</p>
                  { headerProps?.storyofus && headerProps?.image.startsWith("https") ? <img crossOrigin="anonymous" src={headerProps?.image} /> : <img src={headerProps?.image} /> }
                </>
                }
              </div>
              : null}
          </div> }
        </header>
    : null }      
    </>  
)
}

export default Header;