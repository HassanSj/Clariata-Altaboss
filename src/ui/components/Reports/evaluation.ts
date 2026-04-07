
import {createGlobalStyle} from 'styled-components';

const EvaluationStyles = createGlobalStyle`
body {
    font-family: Akzidenz-Grotesk
}
@page {
    margin: 0mm 16mm 15mm 16mm;
}
.pdf-page-wrapper {
    width: 890px;
    margin: 0 auto;
}
.pdf-page-wrapper * {
    font-variant-ligatures: none;
    -moz-osx-font-smoothing: grayscale;
}
.pdf-page-wrapper h1, .pdf-page-wrapper h2, .pdf-page-wrapper h3, .pdf-page-wrapper p {
    margin: 0;
    padding: 0;
    color: #404142;
}
.pdf-page-wrapper header {
    padding: 50px 0 0 0;
}
.pdf-page-wrapper footer {
    padding: 50px 0;
}
.pdf-page-wrapper .h-left {
    padding-left: 23px;
    display: inline-block;
}
.pdf-page-wrapper .h-left p {
    vertical-align: middle;
    display: inline-block;
    font-size: 20px;
    font-weight: 600;
    padding: 19px 0 19px 5px;
    color: #1a3f69;
}
.pdf-page-wrapper .h-right {
    float: right;
    display: inline-block;
    width: 570px;
    vertical-align: middle;
    padding-right: 35px;
}
.pdf-page-wrapper .hr-wrapper {
    float: right;
    border: 1px solid #72c6c7;
}
.pdf-page-wrapper .hr-wrapper p {
    display: inline-block; 
    vertical-align: middle;
    font-size: 14px;
    color: #1a3f69;
    font-weight: 600;
    padding: 20px 100px;
}
.pdf-page-wrapper .bc-row {
    page-break-inside: avoid;
}
.pdf-page-wrapper .ppw-top {
    padding: 35px;
}
.pdf-page-wrapper .ppw-bottom {
    padding-bottom: 50px;
}
.pdf-page-wrapper .bcr-top {
    background-color: #173f69;
    padding: 15px 20px;
    margin-top: 30px;
}
.pdf-page-wrapper .bcr-top p {
    color: #fff;
    font-size: 16px;
    line-height: 20px;
    font-weight: 600;
}
.pdf-page-wrapper .bcr-center {
    border-left: 1px solid #73c8c9;
    border-right: 1px solid #73c8c9;
    border-bottom: 1px solid #73c8c9;
    padding: 20px;
    min-height: 117px;
}
.pdf-page-wrapper .bcr-bottom {
    display: table;
    width: calc(100% - 120px);
    margin-left: 120px;
}
.pdf-page-wrapper .bcrb-item {
    display: table-cell;
    vertical-align: middle;
    height: auto;
    text-align: right;
    border: 1px solid #73c8c9;
    border-top: none;
    border-right: none;
}
.pdf-page-wrapper .bcrb-item.active {
    background-color: #f0f9f7;
}
.pdf-page-wrapper .bcrb-item:last-child {
    border-right: 1px solid #73c8c9;
}
.pdf-page-wrapper .bcrb-item p {
    text-align: center;
    padding: 10px;
}
.pdf-page-wrapper .bcrb-item p strong {
    display: block;
    padding-bottom: 3px;
}
.pdf-page-wrapper .bcrb-item p span {
    display: block;
}
.pdf-page-wrapper .ppw-left {
    display: inline-block;
    vertical-align: bottom;
    width: auto;
    padding-right: 20px;
    padding-left: 30px;
}
.pdf-page-wrapper .ppw-left p {
    font-size: 14px;
    line-height: 18px;
}
.pdf-page-wrapper .ppw-right {
    display: inline-block;
    vertical-align: bottom;
    text-align: center;
    padding-left: 51px;
}
.pdf-page-wrapper .ppwr-top {
    background-color: #173f69;
    padding: 15px 20px;
}
.pdf-page-wrapper .ppwr-top p {
    color: #fff;
    font-size: 16px;
    line-height: 20px;
    font-weight: 600;
}
.pdf-page-wrapper .ppwr-bottom {
    border-left: 1px solid #73c8c9;
    border-right: 1px solid #73c8c9;
    border-bottom: 1px solid #73c8c9;
}
.pdf-page-wrapper .ppwr-bottom p {
    font-size: 20px;
    line-height: 24px;
    padding: 15px;
    font-weight: 600;
}

`;

export default EvaluationStyles;