import React, {ReactElement} from "react";
import PDFEmbedded from "~/ui/components/Reports/PDFEmbedded";
import {IPDFReportOptions} from "~/ui/components/Reports/PDFEmbedded/PDFEmbedded";
import finalthoughts from './images/finalthoughts.png';
import executive from './images/executive.png';
import dream from './images/dream.png';
import discover from './images/discover.png';
import direction from './images/direction.png';


export interface ChapterSeparatorProps {
  type?: ChapterType,
  isOpen?: boolean;
  onClose?: () => unknown;
}

export enum ChapterType {
  AT_A_GLANCE = 'AT A GLANCE',
  DISCOVER = 'DISCOVER',
  DREAM = 'DREAM',
  DIRECTION = 'DIRECTION',
  FINAL = 'FINAL THOUGHTS'
}

const ChapterSeparator = ({ type, isOpen, onClose }: ChapterSeparatorProps): ReactElement => {

  const options: IPDFReportOptions = {
    title: 'ChapterSeparator',
    storyofus: true,
    static: true,
    isOpen,
    onClose
  }

  const getLogo = () => {
    switch(type) {
      case ChapterType.AT_A_GLANCE:  return executive;
      case ChapterType.DISCOVER:  return discover;
      case ChapterType.DREAM:  return dream;
      case ChapterType.DIRECTION:  return direction;
      case ChapterType.FINAL:  return finalthoughts;
      default:  return discover;
    }
  }

  const getClass = () => {
    switch(type) {
      case ChapterType.AT_A_GLANCE:  return 'executive';
      case ChapterType.DISCOVER:  return 'discover';
      case ChapterType.DREAM:  return 'dream';
      case ChapterType.DIRECTION:  return 'direction';
      case ChapterType.FINAL:  return 'final';
      default:  return 'discover';
    }
  }

  return (
    <>
    <table className={getClass() + " table-page"}>
      <tr>
        <td align="center" style={{textAlign: "center"}}>
            <div className="chapter-content">
              <div className="logo">
                <img src={getLogo()} width="36px"/>
              </div>
              <p className="chapter-title">{type}</p>
              <p className="chapter-subtitle">{type === ChapterType.DISCOVER ? <>our life journey</> : type === ChapterType.DREAM ? <>our vision for the future</> : type === ChapterType.DIRECTION? <>our plan for success</> : '' }</p>
            </div>
        </td>
      </tr>
    </table>
    </>
  )
}


export default ChapterSeparator;
