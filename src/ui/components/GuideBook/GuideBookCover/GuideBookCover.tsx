import React, {ReactElement} from "react";
import logo from "./images/logo.png";
import coverImage from "./images/GuidebookCover.png";

export interface GuideBookCoverProps {
  familyName?: string,
  ownerName?: string,
  ownerOccupation?: string,
  firmName?: string;
  isOpen?: boolean;
  onClose?: () => unknown;
}

const GuideBookCover = ({ familyName, ownerName, ownerOccupation, firmName, isOpen, onClose }: GuideBookCoverProps): ReactElement => {


  return (
    <>
    <table className="table-page" style={{backgroundImage: "url("  + coverImage + ")"}}>
      <tr>
        <td>
        <div className="upper-content">
          <div className="guidebook-title blue">{familyName}</div>
          <div className="guidebook-lifemap blue">LifeMap Guidebook</div>
        </div>
        <div className="bottom-content">
          <div className="guidebook-provided">
            {ownerName ? `Provided by ${ownerName}, ${firmName}`: null}
          </div>
        </div>
      </td>
      </tr>
    </table>
    </>
  )
}


export default GuideBookCover;
