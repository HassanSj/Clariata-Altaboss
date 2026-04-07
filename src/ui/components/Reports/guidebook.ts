import {createGlobalStyle} from 'styled-components';
import guidebookBackground from './images/guidebook-background.png'

const GuideBookStyles = createGlobalStyle`
.pdf-page-wrapper .first-page, .pdf-page-wrapper .executive, .pdf-page-wrapper .discover, .pdf-page-wrapper .dream, .pdf-page-wrapper .direction, .pdf-page-wrapper .final {
    height: 100%;
    width: 100%;
    position: relative;
    margin-bottom: 2px;
}
.pdf-page-wrapper .executive {
    background-color: #f15929;
}
.pdf-page-wrapper .discover {
    background-color: #173d68;
}
.pdf-page-wrapper .dream {
    background-color: #34699d;
}
.pdf-page-wrapper .direction {
    background-color: #4e8ab7;
}
.pdf-page-wrapper .final {
    background-color: #71c7c7;
}
.pdf-page-wrapper .first-page {
    background-image: url(${guidebookBackground});
    background-repeat: no-repeat;
    background-size: 100% auto;
    padding-top: 200px !important;
}
.pdf-page-wrapper .upper-content {
    position: absolute;
    top: 550px;
    left: calc(50% - 181px);
    text-align: center;
    max-width: 362px;
}
.pdf-page-wrapper .upper-content p.guidebook-title {
    font-size: 44px;
    font-weight: 600;
    letter-spacing: 2px;
}
.pdf-page-wrapper .upper-content p.guidebook-lifemap {
    font-size: 28px;
    letter-spacing: 2.5px;
}
.pdf-page-wrapper .bottom-content {
    position: absolute;
    top: 880px;
    left: calc(50% - 185px);
    text-align: center;
    max-width: 370px;
}
.pdf-page-wrapper .bottom-content p.guidebook-provided {
    padding-bottom: 34px;
    font-size: 15px;
    letter-spacing: 0.2px;
}
.pdf-page-wrapper .bottom-content .logo, .pdf-page-wrapper .bottom-content .logo-text {
    display: block;
    margin: 0 auto;
}
.pdf-page-wrapper .bottom-content .logo {
    padding-bottom: 6px;
}
.pdf-page-wrapper .bottom-content p.logo-text {
    font-size: 13px;
}
.pdf-page-wrapper .center-text {
    position: absolute;
    top: calc(50% - 84px);
    left: calc(50% - 135px);
    text-align: center;
    max-width: 270px;
}
.pdf-page-wrapper .center-text p {
    padding-top: 4px;
    color: #fff;
    font-size: 26px;
    font-weight: 500;
}
.pdf-page-wrapper .center-text .upper {
    text-transform: uppercase;
    font-size: 44px;
    letter-spacing: 4px;
    font-weight: 600;
}
.pdf-page-wrapper .center-text img {
    width: 50px;
    height: auto;
}
// .pdf-page-wrapper .page_divider {
//     border-top: 3px solid #bbb;
// }
.pdf-page-wrapper .page_break {
    page-break-after: always;
}
.pdf-page-wrapper .flex-row.contents {
    max-width: 700px;
    margin: 165px auto;
}
.pdf-page-wrapper .flex-27 {
    flex: 27%;
}
.pdf-page-wrapper .flex-46 {
    flex: 46%;
    margin-top: 8px;
}
.pdf-page-wrapper .contents-headline {
    // font-size: 25px;
    font-size: 30px;
}
.pdf-page-wrapper .contents-item {
    padding-bottom: 22px;
}
.pdf-page-wrapper .contents-item span {
    padding-right: 7px;
}
.pdf-page-wrapper .contents-item .contents-title {
    // font-size: 15px;
    // font-size: 25px;
    font-weight: 500;
    letter-spacing: 0px;
    padding-bottom: 7px;
}
.pdf-page-wrapper .contents-item .contents-section {
    // font-size: 12px;
    // font-size: 15px;
    margin-left: 20px;
    padding-bottom: 6px;
}
.pdf-page-wrapper .introduction {
    padding-right: 125px;
    padding-top: 200px;
    max-width: 700px;
    margin: 0 auto;
}
.pdf-page-wrapper .introduction-headline {
    padding-bottom: 16px;
    font-size: 25px;
}
.pdf-page-wrapper .headline-right {
    margin-left: 44px;
}
.pdf-page-wrapper .implementation-subtitle {
    padding-bottom: 10px;
}
.pdf-page-wrapper .introduction-logo {
    padding-bottom: 14px;
}
.pdf-page-wrapper .introduction-logo .logo-text {
    padding-left: 0px;
}
.pdf-page-wrapper .introduction-logo .logo-text p {
    font-size: 20px;
}
.pdf-page-wrapper .introduction-content {
    margin-left: 44px;
}
.pdf-page-wrapper .introduction-content .introduction-content-title p {
    font-size: 14px;
    line-height: 14px;
    letter-spacing: -0.35px;
}
.pdf-page-wrapper .introduction-content .padding-b-35 {
    padding-bottom: 34px;
}
.pdf-page-wrapper .introduction-content .padding-b-15 {
    padding-bottom: 15px;
}
.pdf-page-wrapper .introduction-content .padding-b-5 {
    padding-bottom: 5px;
}
.pdf-page-wrapper .introduction-content p {
    font-size: 11px;
    line-height: 18px;
    letter-spacing: -0.3px;
}
.pdf-page-wrapper .introduction-content .flex-row {
    padding-top: 15px;
}
.pdf-page-wrapper .introduction-content .flex-2-col {
    width: 50%;
    margin-right: 26px;
}
.pdf-page-wrapper .introduction-content .flex-2-col.padding-left {
    padding-left: 28px;
}
.pdf-page-wrapper .introduction-content .flex-2-col .first-col-headline p {
    font-size: 15px;
}
.pdf-page-wrapper .introduction-content .arrow-title, .pdf-page-wrapper .introduction-content .arrow {
    display: flex;
    align-items: flex-start;
}
.pdf-page-wrapper .introduction-content .arrow {
    padding-right: 8px;
}
.pdf-page-wrapper .introduction-content .arrow-text p.second-col-headline {
    text-transform: uppercase;
    font-size: 17px;
    padding-bottom: 2px;
}
.pdf-page-wrapper .introduction-content .arrow-text p.second-col-p {
    font-size: 13px;
    letter-spacing: 0px;
}
.pdf-page-wrapper .introduction-content .arrow-list-items {
    position: relative;
    margin-bottom: 44px;
}
.pdf-page-wrapper .introduction-content .arrow-list-items .arrow-text {
    padding-bottom: 7px;
}
.pdf-page-wrapper .introduction-content .arrow-list-items .arrow-text p.second-col-p {
    padding-bottom: 0px;
    letter-spacing: 0.2px;
}
.pdf-page-wrapper .introduction-content .arrow-list-items .pc-img {
    position: absolute;
    top: -8px;
    left: 160px;
    z-index: -1;
}
.pdf-page-wrapper .introduction-content .turquoise-divider {
    padding-bottom: 70px;
    border-bottom: 3px solid #72c6c7;
}
.pdf-page-wrapper .introduction-content .margin-l-neg {
    margin-left: -20px;
}
.pdf-page-wrapper .introduction-content .introduction-last-p p {
    font-size: 14px;
    letter-spacing: -0.45px;
    padding-bottom: 70px;
    margin-bottom: 300px;
    border-bottom: 3px solid #72c6c7;
}
.pdf-page-wrapper .introduction-content .introduction-how-headline p {
    padding-top: 200px;
    font-size: 18px;
    padding-top: 20px;
}
.pdf-page-wrapper .introduction-content .flex-bottom-align {
    display: flex;
    align-items: flex-end;
}
.pdf-page-wrapper .introduction-content .flex-bottom-align .dash-list {
    padding-left: 10px;
}
.pdf-page-wrapper .introduction-content .border-img img {
    max-width: 128px;
    border: 1px solid #72c6c7;
}
.pdf-page-wrapper .introduction-content .border-img.max-width img {
    max-width: 100%;
}
.pdf-page-wrapper .introduction-content .border-img-text p {
    max-width: 300px;
    font-size: 13px;
    padding-left: 15px;
    padding-bottom: 0px;
    letter-spacing: 0.1px;
}
.pdf-page-wrapper .introduction-content .dash-list {
    position: relative;
}
.pdf-page-wrapper .introduction-content .guidebook-stars {
    position: absolute;
    bottom: 0;
    right: 0;
}
.pdf-page-wrapper .introduction-content .dash-list-title p {
    font-size: 12px;
}

`;
export default GuideBookStyles;
