
import {createGlobalStyle} from 'styled-components';

const StoryOfUsStyles = createGlobalStyle`
.pdf-page-wrapper {
  font-family: 'Akzidenz Grotesk BE', sans-serif !important;
  -webkit-print-color-adjust: exact !important;
  // margin: 0 !important;
}
html {
  //margin: 0 !important;
  padding: 0;
}
@page {
  margin: 0mm 0mm 15mm 0mm;
  // margin: 0px !important;
}
.pdf-page-wrapper {
  width: 100%;
  margin: 0 auto;
  white-space: pre-wrap;
  margin-bottom: 20px;
}

.pdf-page-wrapper.wider-layout .dynamic {
  max-width: 100% !important;
}

.pdf-page-wrapper .dynamic {
  // width: 828px !important;
  max-width: 90% !important;
  margin: 0 auto !important;
  white-space: pre-wrap !important;
}
.pdf-page-wrapper .dynamic > div {
  align-items: center;
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
.pdf-page-wrapper h1 {
  font-weight: 500;
  padding: 0 0 20px;
  color: #1a3f69;
}
.pdf-page-wrapper .bc-row {
  page-break-inside: avoid;
  display: table;
  width: 100%;
  table-layout: fixed;
  border-spacing: 5px;
  border-collapse: separate;
}
.pdf-page-wrapper .bc-row:nth-child(odd) .bc-col{
  background-color: #eef8f7;
}
.pdf-page-wrapper .bc-col {
  display: table-cell;
  border: 1px solid #eef8f7;
  text-align: center;
  padding: 9px;
  width: 114px;
  vertical-align: middle;
}
.pdf-page-wrapper .bc-col p {
  font-size: 11px;
  line-height: 12px;
  color: #173d68;
}
.pdf-page-wrapper .bcc-images img {
  display: inline-block;
  vertical-align: middle;
  margin: 10px 2px 5px;
  height: 16px;
  width: auto;
}
.pdf-page-wrapper .details-table {
  display: table;
  width: calc(100% - 6px);
  table-layout: fixed;
  border: 1px solid #72c6c7;
  border-spacing: 5px;
  border-collapse: collapse;
  margin-left: 5px;
  margin-top: 30px;
}
.pdf-page-wrapper .f-row p {
  padding: 0 5px;
}
.pdf-page-wrapper .short-details-table {
  display: table;
  width: auto;
  table-layout: fixed;
  border: 1px solid #72c6c7;
  border-spacing: 5px;
  border-collapse: collapse;
  margin-left: 364px;
  margin-top: 30px;
}
.pdf-page-wrapper .short-details-table .f-col:nth-child(1) {
  width: 230px;
}
.pdf-page-wrapper .short-details-table .f-col:nth-child(2) {
  width: 130px;
  border: none;
}
.pdf-page-wrapper .short-details-table .f-row p {
  padding: 0 5px;
}
.pdf-page-wrapper .short-details-table .f-row p:last-child {
  padding: 0 3px;
}
.pdf-page-wrapper .f-col {
  display: table-cell;
  vertical-align: middle;
  border-right: 1px solid #72c6c7;
  padding: 0 10px;
}
.pdf-page-wrapper .f-col > p {
  font-size: 10px;
  line-height: 16px;
  font-weight: 600;
}
.pdf-page-wrapper .f-row img {
  float: left;
  width: auto;
  height: 12px;
}
.pdf-page-wrapper .f-row p {
  float: left;
  font-size: 8px;

  line-height: 12px;
}
.pdf-page-wrapper header {
  padding: 0 0 0 0;
}
.pdf-page-wrapper footer {
  padding: 50px 0;
}
.pdf-page-wrapper .h-left {
  display: inline-block;
  min-width: 60%;
  vertical-align: middle;
}
.pdf-page-wrapper .h-left .subTitle {
  font-size: 12px;
  color: black;
  font-weight: 400;
  margin-left: 23px;
}
.pdf-page-wrapper .h-left img {
  width: 26px;
  display: inline-block;
  vertical-align: middle;
  height: auto;
}
.pdf-page-wrapper .h-left p {
  vertical-align: middle;
  display: inline-block;
  font-size: 20px;
  font-weight: 600;
  padding: 0 0 0 5px;
  color: #1a3f69;
}
.pdf-page-wrapper .h-right {
  display: flex;
  // width: 290px;
  min-width: 40%;
  vertical-align: middle;
}
.pdf-page-wrapper .hr-wrapper {
  float: right;
  border: 1px solid #72c6c7;
  text-align: centre;
  margin-right: 130px;
  width: auto;
}

.hr-wrapper .clearfix{
  width: auto;
}

.pdf-page-wrapper .hr-wrapper img {
  width: 62px;
  display: inline-block;
  // vertical-align: middle;
  height: auto;
  border: 1px solid #7acaca;
}
.pdf-page-wrapper .hr-wrapper p {
  width: auto;
  display: inline-block;
  vertical-align: middle;
  font-size: 14px;
  text-align: center;
  padding: 0 20px;
  color: #1a3f69;
  font-weight: 600;
  line-height:62px;
}
.pdf-page-wrapper .hr-wrapper.worksheet {
  border: none;
  color: #71c7c7;
  font-size: 15px;
}
.pdf-page-wrapper .hr-wrapper.worksheet > span {
  font-weight: 400;
  color: #000000 !important;
  border-bottom: 2px solid #71c7c7;
  padding-left: 5px;
}
.pdf-page-wrapper .hr-wrapper.worksheet p.turquoise {
  color: #7acaca;
}

.pdf-page-wrapper .ppw-bottom {
  margin-top: 30px;
}
.pdf-page-wrapper .body-copy {
  margin: 20px 0 10px;
}
.pdf-page-wrapper .bc-heading {
  display: table;
  width: 100%;
  table-layout: fixed;
  border-spacing: 5px;
  border-collapse: separate;
}
.pdf-page-wrapper .bc-heading p {
  color: #fff;
  text-transform: uppercase;
  font-weight: 600;
  background-color: #72c8c9;
  display: table-cell;
  vertical-align: middle;
  text-align: center;
  font-size: 12px;
  line-height: 16px;
  padding: 5px;
  width: 114px;
}
.pdf-page-wrapper .flex-row {
  display: flex;
  align-items: flex-start;
  align-content: stretch;
  flex-direction: row;
  padding-bottom: 40px;
}

.pdf-page-wrapper .direction-top .flex-row {
  height:55px;
}

.pdf-page-wrapper .direction-top .flex-row .flex-row-has-text {
  width:100%;
}

.pdf-page-wrapper .direction-top .flex-row .flex-row-has-image {
  width:auto;
}

.pdf-page-wrapper .direction-top .flex-row .flex-row-has-text + .flex-row-has-image {
  width:auto;
}

.pdf-page-wrapper .flex-row p.section {
  display: flex;
  align-items: baseline;
  margin-bottom: 10px;
}
.pdf-page-wrapper .flex-row p.section > * {
  padding: 0;
  margin: 0;
}
.pdf-page-wrapper .flex-row span.underline {
  flex: 1;
  overflow: hidden;
}
.pdf-page-wrapper .no-page-break {
  page-break-inside: avoid;
}
.pdf-page-wrapper .flex-column {
  flex: 50%;
  width: calc(50% - 35px);
  background: #ffffff !important;
}
.pdf-page-wrapper .flex-column:first-child {
  margin-right: 70px;
}
.pdf-page-wrapper .legacy-mar-t {
  margin-top: 42px;
}
.pdf-page-wrapper .legacy-mar-b {
  margin-bottom: 30px;
}
.pdf-page-wrapper .legacy-pad {
  padding-bottom: 20px;
}
.pdf-page-wrapper .client-pad {
  padding-bottom: 40px;
}
.pdf-page-wrapper .bcr-top {
  padding: 10px 20px;
}
.pdf-page-wrapper .bcr-top.storyofus {
  background-color: #f0f9f7;
  padding: 15px 20px;
  margin-top: 30px;
  border: 1px solid #72c6c7 !important;
  font-size: 16px !important;
  text-align: left !important;
  font-weight: bold !important;
}
.pdf-page-wrapper .bcr-top p {
  text-align: center;
  font-size: 16px;
  line-height: 20px;
  font-weight: 600;
  background-color: transparent;
}
.pdf-page-wrapper .bcr-top.storyofus p {
  color: #404147;
  font-size: 16px;
  line-height: 20px;
  font-weight: 600;
  text-align: left;
}
.pdf-page-wrapper .bcr-top p.left {
  text-align: left;
}
.pdf-page-wrapper .bcr-top.turquoise {
  // margin-top: 0px;
  border: 1px solid #72c6c7;
  background-color: #eff8f7;
}
// .pdf-page-wrapper .bcr-top.turquoise p{
//   color: #32979d;
// }
.pdf-page-wrapper .bcr-top.blue {
  // margin-top: 0px;
  border: 1px solid #446286;
  background-color: #dee0e7;
}
.pdf-page-wrapper .bcr-top.orange {
  // margin-top: 0px;
  border: 1px solid #f3784f;
  background-color: #fee2d2;
}
.pdf-page-wrapper .bcr-rows {
  background-color: #fff;
  padding: 10px 20px;
  border: 1px solid #72c6c7;
  margin-top: -1px;
}
.pdf-page-wrapper .bcr-rows .bcr-col{
  display: table-cell;
}
.pdf-page-wrapper .bcr-rows .bcr-col-p{
  display: table;
  width: 100%;
}
.pdf-page-wrapper .bcr-rows .bcr-col-p p{
  display: table-cell;
}
.pdf-page-wrapper .bcr-rows .bcr-col-p p:nth-child(2){
  text-align: right;
}
.pdf-page-wrapper .bcr-rows p{
  font-size: 14px;
  line-height: 20px;
  font-weight: 400;
  background-color: transparent;
}
.pdf-page-wrapper .bcr-rows p a{
  text-decoration: none;
  color: #404147;
}
.pdf-page-wrapper p {
  color: #404147;
}
// .pdf-page-wrapper .bcr-top p.turquoise {
//   color: #7acaca;
// }
// .pdf-page-wrapper .bcr-top p.dark-turquoise {
//   color: #32979d;
// }
// .pdf-page-wrapper .bcr-top p.blue {
//   color: #21466e;
// }
// .pdf-page-wrapper .bcr-top p.orange {
//   color: #d64f23;
// }
// .pdf-page-wrapper .bcr-top p.purple {
//   color: #9b4779;
// }
.pdf-page-wrapper .divider {
  width: 100%;
  border-bottom: 3px solid #e4e4e5;
  margin-bottom: 40px;
}
.pdf-page-wrapper .turquoise {
  color: #7acaca;
}
.pdf-page-wrapper .dark-turquoise {
  color: #32979d;
  font-weight: normal;
}
.pdf-page-wrapper .blue {
  color: #21466e;
  font-weight: normal;
}
.pdf-page-wrapper .orange {
  color: #d64f23;
  font-weight: normal;
}
.pdf-page-wrapper .purple {
  color: #9b4779;
}
.pdf-page-wrapper .worksheet-table {
  border-collapse: collapse;
  width: 100%;
  margin-bottom: 40px;
}
.pdf-page-wrapper .worksheet-table td {
  border: 1px solid #72c6c7;
  width: 17%;
  height: 60px;
  text-align: center;
  color: #173d68;
  font-size: 10px;
  padding: 10px 15px;
}
.pdf-page-wrapper .worksheet-table td:first-child {
  width: 14%;
  background-color: #f9fcfc;
  text-transform: uppercase;
  font-weight: 600;
}
.pdf-page-wrapper .worksheet-table th {
  color: #71c7c7;
  font-size: 20px;
  padding: 10px;
  text-align: center;
}
.pdf-page-wrapper .priority-table {
  width: 100%;
  margin-bottom: 40px;
  border-collapse: collapse;
}
.pdf-page-wrapper .priority-table th {
  font-size: 13px;
  padding: 10px;
  background-color: #173d68;
  color: #fff;
  border-right: 1px solid #ffffff;
}
.pdf-page-wrapper .priority-table th:nth-child(1) {
  background-color: #fff;
  border-right: none;
}
.pdf-page-wrapper .priority-table th:nth-child(7) {
  border-right: 1px solid transparent;
}
.pdf-page-wrapper .priority-table tbody tr:first-child td {
  border-top: 1px solid transparent;
}
.pdf-page-wrapper .priority-table tbody tr:first-child td:nth-child(1) {
  border-top: 1px solid #72c6c7;
}
.pdf-page-wrapper .priority-table td {
  background-color: #eef8f7;
  border: 1px solid #72c6c7;
  width: auto;
  color: #173d68;
  font-size: 13px;
  padding: 5px 15px;
}
.pdf-page-wrapper .priority-table td:nth-child(1) {
  background-color: #fff;
  font-weight: 600;
  padding: 10px;
  text-align: center;
}
.pdf-page-wrapper .priority-table td:nth-child(2) {
  width: 30%;
  font-weight: 600;
}
.pdf-page-wrapper .priority-table td:nth-child(6), .pdf-page-wrapper .priority-table td:nth-child(7) {
  font-size: 30px;
  text-align: center;
}
.pdf-page-wrapper .priority-worksheet {
  width: 100%;
  margin-bottom: 40px;
  border-collapse: collapse;
}
.pdf-page-wrapper .priority-worksheet th {
  color: #173d68;
  font-size: 12px;
  font-weight: 600;
  border: 1px solid #173d68;
  padding: 5px;
}
.pdf-page-wrapper .priority-worksheet th:nth-child(1), .pdf-page-wrapper .priority-worksheet th:nth-child(2) {
  border: none;
}
.pdf-page-wrapper .priority-worksheet tr:first-child td {
  border-top: 1px solid transparent;
  background-color: #173d68;
  color: #fff;
  border-right: 1px solid #fff;
  font-weight: 600;
  font-size: 12px;
  text-align: center;
  padding: 5px;
  border-bottom: 1px solid #173d68;
  border-left: 1px solid #173d68;
  border-top: 1px solid #173d68;
}
.pdf-page-wrapper .priority-worksheet tr:first-child td:nth-child(2) {
  text-align: left;
}
.pdf-page-wrapper .priority-worksheet tr:first-child td:nth-child(3) {
  width: 10%;
}
.pdf-page-wrapper .priority-worksheet tr:first-child td:nth-child(5) {
  width: auto;
  text-align: left;
  border-bottom: 1px solid #173d68;
}
.pdf-page-wrapper .priority-worksheet tr:first-child td:last-child {
  border-right: 1px solid #173d68;
}
.pdf-page-wrapper .priority-worksheet td {
  background-color: #fff;
  border: 1px solid #72c6c7;
  padding: 10px 0px;
  text-align: center;
}
.pdf-page-wrapper .priority-worksheet td:nth-child(1), .pdf-page-wrapper .priority-worksheet td:nth-child(2) {
  font-size: 11px;
  width: 20px;
}
.pdf-page-wrapper .priority-worksheet td:nth-child(3) {
  width: 40%;
}
.pdf-page-wrapper .priority-worksheet td:nth-child(4), .pdf-page-wrapper .priority-worksheet td:nth-child(5) {
  width: 10%;
}
.pdf-page-wrapper .priority-worksheet td:nth-child(5) {
  border-right: 1px solid #173d68;
}
.pdf-page-wrapper .priority-worksheet td:nth-child(n + 6) {
  width: 30px;
  border: 1px solid #173d68;
}
.pdf-page-wrapper .priority-table {
  width: 100%;
  margin-bottom: 40px;
}
.pdf-page-wrapper .priority-table th {
  font-size: 13px;
  padding: 10px;
  background-color: #173d68;
  color: #fff;
  border-right: 2px solid #fff;
}
.pdf-page-wrapper .priority-table th:nth-child(1) {
  background-color: #fff;
  border-right: none;
}
.pdf-page-wrapper .priority-table th:nth-child(7) {
  border-right: 2px solid transparent;
}
.pdf-page-wrapper .priority-table tbody tr:first-child td {
  border-top: 2px solid transparent;
}
.pdf-page-wrapper .priority-table tbody tr:first-child td:nth-child(1) {
  border-top: 2px solid #72c6c7;
}
.pdf-page-wrapper .priority-table td {
  background-color: #eef8f7;
  border: 2px solid #72c6c7;
  width: auto;
  color: #173d68;
  font-size: 13px;
  padding: 5px 15px;
}
.pdf-page-wrapper .priority-table td:nth-child(1) {
  background-color: #fff;
  font-weight: 600;
  padding: 10px;
  text-align: center;
}
.pdf-page-wrapper .priority-table td:nth-child(2) {
  width: 30%;
  font-weight: 600;
}
.pdf-page-wrapper .priority-table td:nth-child(6), .pdf-page-wrapper .priority-table td:nth-child(7) {
  font-size: 30px;
  text-align: center;
}
.pdf-page-wrapper .action-plan-table {
  width: 100%;
  margin-bottom: 40px;
  border-collapse: collapse;
}
.pdf-page-wrapper .action-plan-table tr:first-child th {
  font-size: 13px;
  color: #fff;
  background-color: #183e69;
  border-right: 1px solid #fff;
  text-align: left;
  padding: 5px 10px;
}
.pdf-page-wrapper .action-plan-table tr:first-child th:first-child {
  background-color: #fff;
  border: none;
}
.pdf-page-wrapper .action-plan-table tr:first-child th:nth-child(5) {
  border-right: 1px solid #72c6c7;
}
.pdf-page-wrapper .action-plan-table tr:first-child th:nth-child(n + 6) {
  color: #183e69;
  background-color: #fff;
  border: 1px solid #72c6c7;
  text-align: center;
  width: 130px;
}
.pdf-page-wrapper .action-plan-table tr:nth-child(2) th {
  font-size: 13px;
  color: #fff;
  background-color: #183e69;
  border-right: 1px solid #fff;
  border-top: 1px solid #fff;
  padding: 5px 10px;
}
.pdf-page-wrapper .action-plan-table tr:nth-child(4n + 1), .pdf-page-wrapper .action-plan-table tr:nth-child(4n + 2) {
  background-color: #fff;
}
.pdf-page-wrapper .action-plan-table tr:nth-child(4n), .pdf-page-wrapper .action-plan-table tr:nth-child(4n + 3) {
  background-color: #eff8f7;
}
.pdf-page-wrapper .action-plan-table tr td {
  border: 1px solid #72c6c7;
  padding: 5px 10px;
  font-size: 13px;
}
.pdf-page-wrapper .action-plan-table tr td:nth-child(3), .pdf-page-wrapper .action-plan-table tr td:nth-child(5) {
  text-align: center;
}
.pdf-page-wrapper .interview-table {
  border-collapse: collapse;
}
.pdf-page-wrapper .interview-table .int-table-header {
  background-color: #173f69;
  margin-top: 30px;
  page-break-inside:avoid;
  page-break-after:avoid;
}
.pdf-page-wrapper .interview-table .int-table-header p {
  color: #fff;
  font-weight: 600;
  font-size: 15px;
  padding: 5px 30px;
}

.table-questions-wrap {
  border-collapse: collapse;
  width:100%;
  border: 1px solid #73c8c9;
}

.table-questions-wrap th, .table-questions-wrap td {
  border: 1px solid #73c8c9;
}

.table-questions-wrap td {
  font-weight: 600;
  font-size: 13px;
  color: #173f69;
  padding: 5px 20px;  
}

.table-questions-wrap td.clarifying {
  font-size: 12px;
  padding-left: 50px;
}

.table-questions-wrap td.response {  
  color: #000000;
  line-height: 22px;
}

.table-questions-wrap .int-table-header th {
  color: #fff;
  font-weight: 600;
  font-size: 15px;
  padding: 5px 20px;
}

.table-questions-wrap {
    margin-top:30px;
}

.pdf-header-as-table {
  display:table;
  width:100%;
}

.pdf-page-wrapper .pdf-header-as-table .h-left {
  display:table-cell;
  vertical-align:middle;
  min-width: 10px;
  margin-bottom:40px;
}

.pdf-page-wrapper .pdf-header-as-table .h-right {
  display:table-cell;
  vertical-align:middle;
  min-width: 10px;
  margin-bottom:40px;
}


.interview-table .table-questions-wrap:first-child {
  margin-top:0px;
}

.pdf-page-wrapper .int-table-questions p.response img {
  max-width: 6px;
  margin-bottom: 5px;
}


.table-questions-wrap td.response span.pdf-star svg {
  width:16px;
  height:16px;
  vertical-align: top;
}


.pdf-page-wrapper .bcr-bottom {
  border-left: 1px solid #72c6c7;
  border-right: 1px solid #72c6c7;
  border-bottom: 1px solid #72c6c7;
  padding: 30px;
  column-count: 2;
  column-gap: 30px;
}

.pdf-page-wrapper .bcr-no-bottom {
  border-left: 1px solid #72c6c7;
  border-right: 1px solid #72c6c7;
  padding-top: 30px;
  padding-bottom: 10px;
  padding-left: 30px;
  padding-right: 30px;
  column-count: 2;
  column-width: 280px;
  /* column-gap: 10px; */
}

.pdf-page-wrapper .bcr-bottom-alt {
  border-left: 1px solid #72c6c7;
  border-right: 1px solid #72c6c7;
  border-bottom: 1px solid #72c6c7;
  padding-top: 30px;
  padding-bottom: 30px;
  padding-left: 30px;
  padding-right: 30px;
  /* column-gap: 10px; */
}

.pdf-page-wrapper .bcr-bottom-alt p {
  font-size: 16px;
  line-height: 22px;
  padding-bottom: 15px;
  padding-top: 2px;
}

.pdf-page-wrapper .bcr-no-bottom p {
  font-size: 16px;
  line-height: 22px;
  padding-top: 2px;
}

.pdf-page-wrapper .bcr-bottom.no_table {
  column-count: 1;
}
.pdf-page-wrapper .bcr-bottom.no_table.no_bottom {
  border-bottom: none;
}
.pdf-page-wrapper .bcr-bottom h3 {
  color: #85cbcc;
  text-transform: uppercase;
  font-size: 16px;
  line-height: 20px;
  font-weight: 600;
}
.pdf-page-wrapper .bcr-bottom p {
  font-size: 16px;
  line-height: 22px;
  padding-bottom: 15px;
  padding-top: 2px;
}
.pdf-page-wrapper .bcr-content {
  break-inside: avoid-column;
}
.pdf-page-wrapper .bcr-rows.dots p {
  display: flex;                     /* 1 */
  align-items: baseline;             /* 2 */
  margin-bottom: 10px;
}
.pdf-page-wrapper .bcr-rows.dots p > * {
  padding: 0;
  margin: 0;
}
.pdf-page-wrapper span.turquoise{
  flex: 1;
  overflow: hidden;
}
.pdf-page-wrapper .person_card {
  max-width: 100px;
}
.pdf-page-wrapper .person_card img {
  width: 79px;
  height: 79px;
  object-fit: cover;
  border: 1px solid #72c6c7;
}
.pdf-page-wrapper .person_card p {
  text-align: center;
  // padding: 10px;
  font-size: 14px;
}
.pdf-page-wrapper .person_name {
  background-color: #eff8f7;
  margin-top: -4px;
  color: #21466e;
}
.pdf-page-wrapper .person_age {
  color: #fff;
  background-color: #7acaca;
  text-transform: uppercase;
}
.pdf-page-wrapper .client-profile-top {
  padding: 0px 0px 50px 35px;
}
.pdf-page-wrapper .client-profile-top, .pdf-page-wrapper .legacy-profile-top {
  text-align: center;
}
.pdf-page-wrapper .client-profile-top p, .pdf-page-wrapper .legacy-profile-top p {
  font-size: 12px;
}
.pdf-page-wrapper .client-profile-top img, .pdf-page-wrapper .legacy-profile-top img {
  width: 85px;
}
.pdf-page-wrapper .legacy-profile-top {
  max-width: 362px;
  margin: 0 auto;
  padding-left: 35px;
}
.pdf-page-wrapper .legacy-profile-top .bcr-top {
  margin-bottom: 10px;
}
.pdf-page-wrapper .legacy-profile-top .bcr-top p {
  font-size: 16px;
}
.pdf-page-wrapper .half-width {
  width: 150px;
}
.pdf-page-wrapper .report-intro {
  padding-bottom: 10px;
  font-size: 12px;
  line-height: 22px;
}
.pdf-page-wrapper .priority-grid {
  width: 100%;
  margin-bottom: 40px;
  border-spacing: 0px;
}
.pdf-page-wrapper .priority-grid th, .pdf-page-wrapper .priority-grid td:first-child {
  font-size: 14px;
  padding: 10px;
  color: #3e3e3f;
  text-transform: uppercase;
  text-align: center;
  border: 1px solid #72c6c7;
  background-color: #eff8f7;
  font-weight: 600;
  width: 142px;
}
.pdf-page-wrapper .priority-grid th:nth-child(7), .pdf-page-wrapper .priority-grid td:first-child:nth-child(7) {
  border-right: 1px solid transparent;
}
.pdf-page-wrapper .priority-grid th {
  padding: 50px 10px;
}
.pdf-page-wrapper .priority-grid th:first-child {
  background-color: transparent;
  border: none;
}
.pdf-page-wrapper .priority-grid td {
  text-align: center;
  font-weight: 600;
  font-size: 12px;
  border: 1px solid #72c6c7;
  padding: 10px 22px;
}
.pdf-page-wrapper .priority-grid td:first-child {
  height: 140px;
}
.pdf-page-wrapper .priority-grid tr {
  page-break-inside: avoid;
}
.pdf-page-wrapper .short-details {
  display: table;
  width: auto;
  table-layout: fixed;
  margin-left: 290px;
  margin-top: 15px;
}
.pdf-page-wrapper .short-details .f-col {
  border: none;
}
.pdf-page-wrapper .short-details .f-row p {
  padding: 0 60px 0 10px;
  font-size: 12px;
}
.pdf-page-wrapper .short-details .f-row p:last-child {
  padding: 0 0 0 10px;
}
.pdf-page-wrapper .person-card {
  max-width: 120px;
}
.pdf-page-wrapper .person-card img {
  width: 120px;
  height: 120px;
  object-fit: cover;
  border: 1px solid #72c6c7;
}
.pdf-page-wrapper .person-card p {
  text-align: center;
  padding: 10px;
  font-size: 14px;
}
.pdf-page-wrapper .person-card p.person-name {
  background-color: #eff8f7;
  margin-top: -4px;
}
.pdf-page-wrapper .person-card p.person-age {
  color: #fff;
  background-color: #7acaca;
  text-transform: uppercase;
}
.pdf-page-wrapper .timeline-card {
  display: flex;
}
.pdf-page-wrapper .timeline-card .timeline-card-img img {
  width: 100px;
  height: 85px;
  object-fit: cover;
  border: 1px solid #72c6c7;
}
.pdf-page-wrapper .timeline-card .timeline-date {
  color: #fff;
  background-color: #7acaca;
  text-align: center;
  font-size: 13px;
  padding: 10px 20px;
  max-width: 75px;
}
.pdf-page-wrapper .timeline-card .timeline-event {
  background-color: #eff8f7;
  display: flex;
  align-items: center;
}
.pdf-page-wrapper .timeline-card .timeline-event p {
  font-size: 13px;
  padding: 10px;
}
.pdf-page-wrapper .timeline-card .timeline-event img {
  width: 40px;
  height: 30px;
  padding-right: 10px;
}
.pdf-page-wrapper .why-table {
  width: 100%;
  margin-bottom: 20px;
  border-collapse: collapse;
}
.pdf-page-wrapper .why-table td {
  border: 1px solid #72c6c7;
  padding: 15px;
}
.pdf-page-wrapper .why-table td:first-child {
  width: 10%;
  background-color: #eff8f7;
  color: #32979d;
  text-transform: uppercase;
  font-weight: 600;
  font-size: 25px;
  padding: 25px 30px;
  text-align: center;
}
.pdf-page-wrapper .why-table td:nth-child(2) {
  width: 90%;
  padding: 15px 65px 15px 15px;
}
.pdf-page-wrapper .priority-container {
  display: flex;
  align-items: center;
}
.pdf-page-wrapper .priority-img {
  flex-basis: 5%;
  padding: 6px 10px 0px 0px;
}
.pdf-page-wrapper .priority-img img {
  max-width: 30px;
}
.pdf-page-wrapper .priority-text .goal {
  font-size: 14px;
  line-height: 24px;
}
.pdf-page-wrapper .priority-text .goal-desc {
  font-size: 12px;
}
.pdf-page-wrapper .big-black {
  font-size: 15px;
}
.pdf-page-wrapper .worksheet-headline {
  border-top: 1px solid #72c6c7;
  border-bottom: 1px solid #72c6c7;
  background-color: #eff8f7;
  margin: 30px 0px;
}
.pdf-page-wrapper .worksheet-headline p {
  padding: 18px;
}
.pdf-page-wrapper .profile-worksheet {
  padding-left: 18px;
}
.pdf-page-wrapper .profile-worksheet p {
  text-transform: uppercase;
  font-weight: 600;
  color: #21466e;
  padding: 10px 0px;
}
.pdf-page-wrapper .profile-worksheet p.dark-turquoise {
  color: #32979d;
}
.pdf-page-wrapper .profile-worksheet p span.dark-turquoise {
  color: #32979d;
}
// .pdf-page-wrapper .flex-2-row, .pdf-page-wrapper .flex-3-row, .pdf-page-wrapper .flex-4-row {
//   display: flex;
// }
.pdf-page-wrapper .flex-2-col {
  flex: 50%;
}
.pdf-page-wrapper .flex-2-col p.section {
  max-width: 387px;
}
.pdf-page-wrapper .flex-3-col {
  flex: 33%;
}
.pdf-page-wrapper .flex-3-col p.section {
  max-width: 258px;
}
.pdf-page-wrapper .flex-4-col {
  flex: 25%;
}
.pdf-page-wrapper .flex-4-col p.section {
  max-width: 193px;
}
.pdf-page-wrapper .light {
  font-weight: 400;
}
span.logo { 
  height: 20px; 
}
div.footer { 
  display: block; 
  width: 100%; 
  padding-left: 40px; 
  padding-right: 40px; 
  font-size: 8px; 
  color: #183f69; 
}
div.footer-content { 
  display:flex; 
  justify-content: space-between; 
  width: 100%; 
  padding-top: 15px; 
}
div.footer-left { 
  width: 5%; 
  padding: 0; 
  text-align: left; 
  line-height: 20px; 
}
div.footer-right { 
  width: 30%; 
  padding: 0; 
  text-align: right; 
  line-height: 20px; 
}
div.footer-center { 
  width: 65%; 
  padding: 0; 
  text-align: left; 
  line-height: 20px; 
  vertical-align: middle; 
}
.pdf-page-wrapper .circled {
  position: relative;
}
.pdf-page-wrapper .circled:after {
  position: absolute;
  content: "";
  border: 3px solid #000;
  width: 100%;
  height: 100%;
  border-radius: 20px;
  top: -3px;
  left: -3px;
}
.pdf-page-wrapper .gantt-chart-table {
  border-collapse: collapse;
  margin: 190px 0px 40px 40px;
  table-layout: fixed;
  width: 860px;
}
.full-width .pdf-page-wrapper .gantt-chart-table {
  margin-top:0px;
  margin-left:0px;
  width:100%;
}
.pdf-page-wrapper .gantt-chart-table tr:first-child th {
  font-size: 11px;
  color: #fff;
  background-color: #183e69;
  border-right: 1px solid #fff;
  text-align: left;
  padding: 5px 8px;
}
.pdf-page-wrapper .gantt-chart-table tr:first-child th:first-child {
  width: 16px;
  text-align: center;
  background-color: #fff;
  border: none;
}
.pdf-page-wrapper .gantt-chart-table tr:first-child th:nth-child(2) {
  width: 65px;
}
.pdf-page-wrapper .gantt-chart-table tr:first-child th:nth-child(3) {
  width: 45px;
}
.pdf-page-wrapper .gantt-chart-table tr:first-child th:nth-child(4) {
  width: 35px;
}
.pdf-page-wrapper .gantt-chart-table tr:first-child th:nth-child(5) {
  border-right: 1px solid #72c6c7;
}
.pdf-page-wrapper .gantt-chart-table tr:first-child th:nth-child(n + 5) {
  width: 22px;
  color: #183e69;
  background-color: #fff;
  border: 1px solid #72c6c7;
}
.pdf-page-wrapper .gantt-chart-table tr:nth-child(2) th {
  font-size: 11px;
  color: #fff;
  background-color: #183e69;
  border-right: 1px solid #fff;
  border-top: 1px solid #fff;
  padding: 5px 10px;
  text-align: left;
}
// .pdf-page-wrapper .gantt-chart-table tr:nth-child(3) td:nth-child(n + 8):nth-child(-n + 11), .pdf-page-wrapper .gantt-chart-table tr:nth-child(9) td:nth-child(n + 6):nth-child(-n + 11), .pdf-page-wrapper .gantt-chart-table tr:nth-child(11) td:nth-child(n + 5):nth-child(-n + 7), .pdf-page-wrapper .gantt-chart-table tr:nth-child(13) td:nth-child(n + 5):nth-child(-n + 9) {
//   background-color: #aec4d7;
// }
// .pdf-page-wrapper .gantt-chart-table tr:nth-child(17) td:nth-child(n + 6):nth-child(-n + 7) {
//   background-color: #f9bcaa;
// }
// .pdf-page-wrapper .gantt-chart-table tr:nth-child(5) td:nth-child(n + 5), .pdf-page-wrapper .gantt-chart-table tr:nth-child(7) td:nth-child(n + 6):nth-child(-n + 10), .pdf-page-wrapper .gantt-chart-table tr:nth-child(15) td:nth-child(n + 5):nth-child(-n + 15), .pdf-page-wrapper .gantt-chart-table tr:nth-child(19) td:nth-child(n + 7):nth-child(-n + 12), .pdf-page-wrapper .gantt-chart-table tr:nth-child(21) td:nth-child(n + 5) {
//   background-color: #bde4e3;
// }
// .pdf-page-wrapper .gantt-chart-table tr:nth-child(4n + 1), .pdf-page-wrapper .gantt-chart-table tr:nth-child(4n + 2) {
//   background-color: #fff;
// }
// .pdf-page-wrapper .gantt-chart-table tr:nth-child(4n), .pdf-page-wrapper .gantt-chart-table tr:nth-child(4n + 3) {
//   background-color: #eff8f7;
// }
.pdf-page-wrapper .gantt-chart-table td.dark-turquoise.background {
  background-color: #bde4e3;
}
.pdf-page-wrapper .gantt-chart-table td.blue.background {
  background-color: #aec4d7;
}
.pdf-page-wrapper .gantt-chart-table td.orange.background {
  background-color: #f9bcaa;
}
.pdf-page-wrapper .gantt-chart-table tr td {
  border: 1px solid #72c6c7;
  padding: 5px 8px;
  font-size: 11px;
}
.pdf-page-wrapper .two-tables {
  display: flex;
  margin-top: 0px;
}



.pdf-page-wrapper .two-tables.direction-top  {
  display:table;
  width:100%;
  margin:0;
}


.pdf-page-wrapper .two-tables.direction-top .direction-top-left {
  display:table-cell;
  width:50%;
  margin:0;
  vertical-align:top;
}

.pdf-page-wrapper .two-tables.direction-top .direction-top-right {
  display:table-cell;
  width:50%;
  margin:0;
  vertical-align:top;
}

.tr-hidden {
  display:none;
}

.pdf-page-wrapper .quarters-table {
  border-collapse: separate;
  width: 358px;
  table-layout: fixed;

  border-spacing: 4px;
}
.pdf-page-wrapper .quarters-table td {
  padding: 5px 0px;
  border-right: 1px solid #fff;
}
.pdf-page-wrapper .quarters-table td p {
  color: #fff;
  font-weight: 600;
  text-align: right;
  font-size: 11px;
  padding: 13px 5px;
}
.pdf-page-wrapper .quarters-table th {
  border: none;
  padding-top: 4px;
}
.pdf-page-wrapper .quarters-table tr:first-child th {
  border: 1px solid #364a65;
  padding: 0px;
  height: 26px;
}
.pdf-page-wrapper .quarters-table tr:first-child th p {
  color: #364a65;
  text-align: center;
  font-size: 8px;
  font-weight: 600;
  padding: 6px;
}
.pdf-page-wrapper .quarters-table tr:nth-child(2n + 3) {
  height: 57px;
}


.pdf-page-wrapper .quarters-table tr:nth-child(3) td {
  background-color: #d4dde4;
}
.pdf-page-wrapper .quarters-table tr:nth-child(5) td {
  background-color: #ccd0da;
}
.pdf-page-wrapper .quarters-table tr:nth-child(7) td {
  background-color: #f9d7bf;
}
.pdf-page-wrapper .quarters-table tr:nth-child(9) td {
  background-color: #dee9c6;
}
.pdf-page-wrapper .quarters-table tr:nth-child(11) td {
  background-color: #e8d7dc;
}
.pdf-page-wrapper .quarters-table .blue-bg {
  background-color: #4f81a4;
  height: 42px;
  width: 100%;
}
.pdf-page-wrapper .quarters-table .dark-blue-bg {
  background-color: #3d5f8a;
  height: 42px;
}
.pdf-page-wrapper .quarters-table .orange-bg {
  background-color: #df5430;
  height: 42px;
}
.pdf-page-wrapper .quarters-table .green-bg {
  background-color: #609241;
  height: 42px;
}
.pdf-page-wrapper .quarters-table .purple-bg {
  background-color: #8c436a;
  height: 42px;
}
.pdf-page-wrapper .quarters-table .right-short-bg {
  width: 25px;
  margin-left: 46px;
}
.pdf-page-wrapper .quarters-table .right-long-bg {
  width: 50px;
  margin-left: 20px;
}
.pdf-page-wrapper .quarters-table .left-long-bg {
  width: 50px;
  margin-right: 20px;
}
.pdf-page-wrapper .quarters-table .left-short-bg {
  width: 25px;
  margin-right: 46px;
}
.pdf-page-wrapper .img-quarters-table {
  border-collapse: separate;
  width: 200px;
  table-layout: fixed;
  border-spacing: 4px;
  margin-top: 0px;
}

.pdf-page-wrapper .img-quarters-table td {
  vertical-align:top;
}

.pdf-page-wrapper .img-quarters-table th {
  border: 1px solid #364a65;
  color: #364a65;
  text-align: center;
  font-size: 7px;
  font-weight: 600;
  padding: 8px 5px;
  height: 26px;
}
.pdf-page-wrapper .img-quarters-table p {
  font-size: 8px;
  padding: 4px;
  font-weight: 600;
}
.pdf-page-wrapper .img-quarters-table p.priority {
  text-transform: uppercase;
  color: #fff;
  padding: 4px;

}
.pdf-page-wrapper .img-quarters-table tr:nth-child(2) td {
  background-color: #d4dde4;
}
.pdf-page-wrapper .img-quarters-table tr:nth-child(2) p.priority {
  background-color: #4f81a4;
}
.pdf-page-wrapper .img-quarters-table tr:nth-child(3) td {
  background-color: #ccd0da;
}
.pdf-page-wrapper .img-quarters-table tr:nth-child(3) p.priority {
  background-color: #3d5f8a;
}
.pdf-page-wrapper .img-quarters-table tr:nth-child(4) td {
  background-color: #f9d7bf;
}
.pdf-page-wrapper .img-quarters-table tr:nth-child(4) p.priority {
  background-color: #df5430;
}
.pdf-page-wrapper .img-quarters-table tr:nth-child(5) td {
  background-color: #dee9c6;
}
.pdf-page-wrapper .img-quarters-table tr:nth-child(5) p.priority {
  background-color: #609241;
}
.pdf-page-wrapper .img-quarters-table tr:nth-child(6) td {
  background-color: #e8d7dc;
}
.pdf-page-wrapper .img-quarters-table tr:nth-child(6) p.priority {
  background-color: #8c436a;
}
.pdf-page-wrapper .img-quarters-table img {
  width: 75px;
  height: 50px;
  object-fit: cover;
}
.pdf-page-wrapper .report-table-small {
  border-collapse: collapse;
  width: 100%;
  table-layout: fixed;

}
.pdf-page-wrapper .report-table-small .bc-heading {
  border-spacing: 3px;
  margin-top: 0px;
}
.pdf-page-wrapper .report-table-small .bc-heading p {
  font-size: 8px;
  line-height: 8px;
  width: 80px;
}
.pdf-page-wrapper .report-table-small .bc-row {
  border-spacing: 2px;
}
.pdf-page-wrapper .report-table-small .bc-col {
  width: 80px;
  padding: 5px;
}
.pdf-page-wrapper .report-table-small .bc-col p {
  font-size: 7px;
  line-height: 7px;
}
.pdf-page-wrapper .report-table-small .bcc-images img {
  height: 10px;
}
.pdf-page-wrapper .second-table .details-table {
  margin: 10px 0px 10px 3px;
  border-spacing: 1px;
}
.pdf-page-wrapper .second-table .details-table .f-col:nth-child(1) {
  width: 50px;
}
.pdf-page-wrapper .second-table .details-table .f-col:nth-child(2) {
  width: 110px;
}
.pdf-page-wrapper .second-table .details-table .f-col:nth-child(3) {
  width: 56px;
  border-right: none;
}
.pdf-page-wrapper .priority-small-text {
  display: block;
  text-overflow: ellipsis;
  word-wrap: break-word;
  overflow: hidden;
  max-height: 3.6em;
  line-height: 1.8em;
}
.pdf-page-wrapper .second-table .details-table .f-col {
  padding: 0px 3px;
}
.pdf-page-wrapper .second-table .details-table .f-col > p {
  font-size: 8px;
}
.pdf-page-wrapper .second-table .details-table .f-row p {
  font-size: 6px;
}
.pdf-page-wrapper .action-steps {
  background-color: #c1ceda;
  padding-left:42px;
  position: relative;

}
.pdf-page-wrapper .action-steps-main {
  padding: 8px 20px 0px 20px;
}
.pdf-page-wrapper .action-steps-headline {
  text-transform: uppercase;
  font-weight: 600;
  color: #203756;
  font-size: 16px;
  text-align: center;
}
.pdf-page-wrapper .action-steps-side {
  position: absolute;
  
  height:100%;
  bottom: 0px;
  width: 400px;
  transform: rotate(-90deg);
  left:0px;

}

.MuiDialogContent-root .pdf-page-wrapper .action-steps-side {
  bottom:0px;
  width: 420px;
  left:0px;
  height:100%;
}


.pdf-page-wrapper .action-steps-side p {
  color: #fff;
  font-size: 16px;
  text-align: center;
  text-transform: uppercase;
  font-weight: 600;
  background-color: #3d5f8a;

  padding: 10px;
}
.pdf-page-wrapper .action-steps-table {
  background-color: #c1ceda;
  border-collapse: collapse;
  border-spacing: 10px;
  table-layout: fixed;
  width:100%;
}
.pdf-page-wrapper .action-steps-table tr th {
  border: none;
  padding-top: 10px;
}
.pdf-page-wrapper .action-steps-table tr td {
  border: 1px solid #405865;
  color: #455771;
  padding: 8px;
  font-size: 7px;
  width: 70px;
  height: 58px;
}
.pdf-page-wrapper .action-steps-table tr td:first-child {
  color: #fff;
  font-weight: 600;
  padding: 8px;
  width: 62px;
}
.pdf-page-wrapper .action-steps-table tr:nth-child(4n + 1) {
  background-color: #e9eef0;
}
.pdf-page-wrapper .action-steps-table tr:nth-child(4n-1) {
  background-color: #fffffe;
}
.pdf-page-wrapper .action-steps-table tr:first-child td:first-child {
  background-color: #4f81a4;
}
.pdf-page-wrapper .action-steps-table tr:nth-child(3) td:first-child {
  background-color: #3d5f8a;
}
.pdf-page-wrapper .action-steps-table tr:nth-child(5) td:first-child {
  background-color: #df5430;
}
.pdf-page-wrapper .action-steps-table tr:nth-child(7) td:first-child {
  background-color: #609241;
}
.pdf-page-wrapper .action-steps-table tr:nth-child(9) td:first-child {
  background-color: #8c436a;
}
.pdf-page-wrapper .action-steps-table tr:last-child td {
  border: none;
  text-transform: uppercase;
  text-align: center;
  font-weight: 600;
  font-size: 11px;
  height: 30px;
}
.pdf-page-wrapper .bottom-table {
  display: table;
  width: 100%;
  table-layout: fixed;
  border: 1px solid #72c6c7;
  margin-top: 5px;
  margin-bottom: 5px;

  padding: 2px 10px 0px;
}
.pdf-page-wrapper .bottom-table .f-col:nth-child(1) {
  width: 100px;
  text-align: center;
}
.pdf-page-wrapper .bottom-table .f-col:nth-child(1) p {
  font-weight: 600;
  font-size: 24px;
}
.pdf-page-wrapper .bottom-table .f-col:nth-child(2) {
  width: 255px;
  text-align: center;
}
.pdf-page-wrapper .bottom-table .f-col:nth-child(2) p.title {
  text-transform: uppercase;
  font-size: 8px;
}
.pdf-page-wrapper .bottom-table .f-col:nth-child(2) p.question {
  font-size: 12px;
  font-weight: 400;
}
.pdf-page-wrapper .bottom-table .f-col:nth-child(3) {
  width: 160px;
  padding: 0;
}
.pdf-page-wrapper .bottom-table .f-col:nth-child(3) .f-col-top {
  display: flex;
  border-bottom: 1px solid #72c6c7;
  background-color: #eff7f3;
}
.pdf-page-wrapper .bottom-table .f-col:nth-child(3) .f-col-top .f-col-left {
  flex: 80%;
}
.pdf-page-wrapper .bottom-table .f-col:nth-child(3) .f-col-top .f-col-left p {
  font-weight: 600;
  font-size: 10px;
}
.pdf-page-wrapper .bottom-table .f-col:nth-child(3) .f-col-top .f-col-right {
  flex: 20%;
}
.pdf-page-wrapper .bottom-table .f-col:nth-child(3) .f-col-top .f-col-right p {
  font-weight: 400;
  font-size: 8px;
  text-align: right;
  padding: 10px 5px;
}
.pdf-page-wrapper .bottom-table .f-col:nth-child(3) .f-col-top img {
  width: 45px;
}
.pdf-page-wrapper .bottom-table .f-col:nth-child(3) .f-col-bottom {
  padding: 3px;
  display: flex;
}
.pdf-page-wrapper .bottom-table .f-col:nth-child(3) .f-col-bottom p {
  font-size: 6px;
}
.pdf-page-wrapper .bottom-table .f-col:nth-child(3) .f-col-bottom img {
  width: 30px;
}
.pdf-page-wrapper .bottom-table .f-col:nth-child(3) .f-col-bottom .f-col-left {
  flex: 70%;
}
.pdf-page-wrapper .bottom-table .f-col:nth-child(3) .f-col-bottom .f-col-right {
  flex: 30%;
}
.pdf-page-wrapper .bottom-table .f-col:nth-child(3) .f-col-bottom .f-col-right p {
  text-transform: uppercase;
  color: #000;
}
.pdf-page-wrapper .bottom-table .f-col:nth-child(4) {
  width: 46px;
  border: none;
  text-align: center;
}
.pdf-page-wrapper .bottom-table .f-col:nth-child(4) .logo img {
  width: 28px;
}
.pdf-page-wrapper .bottom-table .f-col:nth-child(4) p {
  font-weight: 500;
}
.pdf-page-wrapper .bottom-table .f-col-inline {
  display: inline-flex;
  vertical-align: middle;
}
.pdf-page-wrapper .rotate-270 {
  transform: rotate(270deg);

}

.pdf-page-wrapper .dream-life-print.bottom-table {
  margin-left: 0px;
  width: 100%;
}
.pdf-page-wrapper .blue-bg-color {
  background-color: #72c8c9;
  padding: 5px;
}
.pdf-page-wrapper .blue-bg-color .bc-heading p {
  border: 1px solid white;
  width: 25%;
  text-transform: none;
  font-size: 14px;
  padding-top: 5px;
  padding-bottom: 5px;
}
.pdf-page-wrapper .blue-4-cols {
  display: table;
  width: 100%;
  background-color: #dbede9;
  vertical-align: top;
  margin: 15px 0 15px 0;
}

.k-chart-surface {
  canvas {
    position:abslute;
  }
}

.pdf-page-wrapper .blue-4-cols-sm {
  display: table-cell;
  width: 22%;
  border-right: 1px solid #9ad0cb;
  vertical-align: top;
  padding: 20px 10px;
}
.pdf-page-wrapper .blue-4-cols-sm h3 {
  color: #fff;
  font-size: 12px;
  font-weight: 600;
  margin-left: -10px;
  padding: 5px 15px;
  text-transform: uppercase;
  margin-bottom: 15px;
  display: inline-block;
}
.pdf-page-wrapper .blue-4-cols-sm h3.blue-heading {
  background-color: #173d68;
}
.pdf-page-wrapper .blue-4-cols-sm h3.blue2-heading {
  background-color: #4f81a4;
}
.pdf-page-wrapper .blue-4-cols-sm h3.orange-heading {
  background-color: #df5430;
}
.pdf-page-wrapper .blue-4-cols-lg {
  display: table-cell;
  width: 35%;
  vertical-align: top;
  padding: 20px 20px 5px;
}
.pdf-page-wrapper .blue-4-cols-lg h4 {
  margin: 0px 0px 15px;
  color: #404142;
  font-size: 12px;
  font-weight: 600;
}
.pdf-page-wrapper .priority-table.no-numbers {
  margin-bottom: 15px;
}
.pdf-page-wrapper .priority-table.no-numbers th:nth-child(1) {
  display: none;
}
.pdf-page-wrapper .priority-table.no-numbers td {
  font-size: 7px;
  line-height: 7px;
  padding: 5px 5px;
}
.pdf-page-wrapper .priority-table.no-numbers th {
  font-size: 7px;
  line-height: 7px;
  padding: 5px 5px;
}
.pdf-page-wrapper .priority-table.no-numbers td:nth-child(1) {
  display: none;
}
.pdf-page-wrapper .blue-card {
  margin-bottom: 10px;
  display: flex;

}

.timeline-chart {
  canvas {
    max-width:100%;
  }
}

.pdf-page-wrapper .blue-card img {
  display: block;
  object-fit: cover;
  height: 100%;
  width: 100%;
  position:absolute;
}
.pdf-page-wrapper .blue-card .card-img {
  width: 32%;
}
.pdf-page-wrapper .blue-card p {
  font-size: 7px;
  line-height: 7px;
  color: #173d68;
}
.pdf-page-wrapper .blue-card p strong {
  color: #173d68;
}
.pdf-page-wrapper .blue-card h4 {
  font-size: 7px;
  line-height: 7px;
  font-weight: 700;
  color: #72c8c9;
  margin-top: 0px;
}
.pdf-page-wrapper .blue-card h4 strong {
  font-weight: 700;
  color: #173d68;
}
.pdf-page-wrapper .blue-card-img {
  min-width: 85px;
  max-width: 100px;
  overflow: hidden;
  position: relative;
}


.pdf-page-wrapper .top-blue-card .blue-card-img {
  min-width: 60px;
  max-width: 100px;
}
.pdf-page-wrapper .blue-card-body {
  background-color: #f0f7f3;
}
.pdf-page-wrapper .blue-card-text {
  padding: 10px;
}
.pdf-page-wrapper .blue-card-title {
  background-color: #75bfba;
  padding: 5px 10px;
  display: flex;
}
.pdf-page-wrapper .blue-card-title p {
  font-size: 7px;
  line-height: 7px;
  color: #fff;
  text-transform: uppercase;
}
.pdf-page-wrapper .blue-card-title p strong {
  color: #223854;
}
.pdf-page-wrapper .blue-card-right {
  text-align: right;
  margin-left: auto;
}
.pdf-page-wrapper .eqWrap {
  display: table;
  width:100%;
}
.pdf-page-wrapper .equal-half-wrap {
  display: table;
  width: 100%;
}
.pdf-page-wrapper .equalHMV {
  width: 49%;
}
.pdf-page-wrapper .equalHMVWrap {
  // flex-wrap: wrap;
  margin-top: 20px;
}
.pdf-page-wrapper .equalHMVWrap .equalHMV {
  padding: 15px;
  display:table-cell;

}



.pdf-page-wrapper .equalHMVWrap .equalHMV:first-child {
  margin-right: 2%;
}
.pdf-page-wrapper .cl-border {
  border: 1px solid #e8eeec;
}
.pdf-page-wrapper .equal-half-left {
  width: 40%;
  padding-right: 20px;
  margin-right: 2%;
  display: table-cell;
  vertical-align: top;
}
.pdf-page-wrapper .equal-half-right {
  width: 58%;
  display: table-cell;
  vertical-align: top;
}
.pdf-page-wrapper .timeline-chart img {
  max-width: 100%;
}
.pdf-page-wrapper .equalHMV .timeline-card {
  margin-bottom: 15px;
}
.pdf-page-wrapper .equalHMV .timeline-card .timeline-card-img img {
  width: 60px;
  height: 60px;
  border: 0px;
}
.pdf-page-wrapper .equalHMV .timeline-card .timeline-date {
  padding: 5px 35px;
  font-size: 12px;
  max-width: 100%;
}
.pdf-page-wrapper .cl-right-side .timeline-card .timeline-date {
  background-color: #5182a2;
}
.pdf-page-wrapper .cl-right-side .blue-card-title {
  background-color: #5182a2;
}
.pdf-page-wrapper.wider-layout {

  transform: rotate(270deg);
  transform-origin: 52% 64%;
  margin-left: 0;
  display: block;

  width:1150px;
}

.pdf-page-wrapper.wider-layout header {
  display:none!important;
}

.pdf-page-wrapper.wider-layout .body-copy {
  margin: 0px;
  border-bottom:10px solid white;
  border-right:20px solid white;
}

// .pdf-page-wrapper.wider-layout .body-copy.rotate-270 {
//   margin-top: 220px;
// }
.pdf-page-wrapper {
  // border: 1px solid green !important;
}
.pdf-page-wrapper .module-logo {
  max-width: 45px;
}

//TIMELINE
.pdf-page-wrapper {
  // font-family: "Roboto", sans-serif;
}
  #timeline .demo-card:nth-child(odd) .head .after, #timeline .demo-card:nth-child(even) .head .after {
    position: absolute;
    content: "";
    width: 51px;
    height: 2px;
    border-color: #7acaca;
    margin-top: 5px;
  }

  #timeline .demo-card:nth-child(odd) .head .before, #timeline .demo-card:nth-child(even) .head .before {
    position: absolute;
    content: "";
    width: 12px;
    height: 12px;
    background-color: #7acaca;
    border-radius: 9px;
  }

* {
  box-sizing: border-box;
}


.pdf-page-wrapper {
  // font-family: Roboto;
}

#timeline .demo-card-wrapper {
  position: relative;
  margin: auto;
}
  #timeline .demo-card-wrapper {
    display: flex;
    // flex-flow: column wrap;
    flex-wrap: wrap;
    width: 828px;
    // height: 1650px;
    margin: 0 auto;
  }

#timeline .demo-card-wrapper .afterOuter {
  z-index: 1;
  content: "";
  position: absolute;
  top: 0;
  bottom: 0;
  left: 50%;
  border-left: 1px solid rgba(191, 191, 191, 0.4);
}
  #timeline .demo-card-wrapper .afterOuter {
    border-left:3px dotted #7acaca;
  }
#timeline .demo-card {
  position: relative;
  display: block;
  margin: 10px auto 80px;
  max-width: 94%;
  z-index: 2;
  page-break-inside: avoid;
}
#timeline .demo-card .before {
  margin-top: 5px;
}
// @media (min-width: 480px) {
//   #timeline .demo-card {
//     max-width: 60%;
//   }
// }
// @media (min-width: 720px) {
//   #timeline .demo-card {
//     max-width: 80%;
//   }
// }

  #timeline .demo-card {
    max-width: 250px;
    // height: 275px;
    // margin: 90px;
    margin-top: 20px !important;
    padding-right: 50px;
    // margin-bottom: 60px;
    margin: 0;
  }
  // #timeline .demo-card:nth-child(odd) {
  //   margin-right: 45px;
  // }
  #timeline * {
     -moz-box-sizing: border-box; 
     -webkit-box-sizing: border-box; 
     box-sizing: border-box;  
  } 
  #timeline .demo-card:nth-child(odd) .head .after {
    border-left-style: solid;
    left: 50%;
  }
  #timeline .demo-card:nth-child(even) .head .after {
    border-right-style: solid;
    right: 100%;
  }
  #timeline .demo-card:nth-child(4n-3) .head .after {
    border-left-width: 160px;
  }
  #timeline .demo-card:nth-child(4n-1) .head .after {
    border-left-width: 320px;
  }
  #timeline .demo-card:nth-child(4n-2) .head .after {
    border-right-width: 80px;
  }
  #timeline .demo-card:nth-child(4n) .head .after {
    border-right-width: 160px;
  }
  #timeline .demo-card:nth-child(4n-3) .head .before {
    left: 250px;
  }
  #timeline .demo-card:nth-child(4n-1) .head .before {
    left: 410px;
  }
  #timeline .demo-card:nth-child(4n-2) .head .before {
    right: 268px;
  }
  #timeline .demo-card:nth-child(4n) .head .before {
    right: 348px;
  }
  #timeline .demo-card:nth-child(4n-3) {
    margin-left: 160px;
  }
  #timeline .demo-card:nth-child(4n-2) {
    margin-left: 80px;
  }
  #timeline .demo-card:nth-child(4n) {
    margin-left: 320px;
  }
  // #timeline .demo-card:nth-child(even) {
  //   margin-left: 140px;
  // }
  // #timeline .demo-card:nth-child(even) .head::after {
  //   border-right-width: 89px;
  //   border-right-style: solid;
  //   right: 100%;
  // }
  // #timeline .demo-card:nth-child(even) .head::before {
  //   right: 386.5px;
  // }
  // #timeline .demo-card:nth-child(2) {
  //   margin-top: 180px;
  // }
#timeline .demo-card .head {
  position: relative;
  display: flex;
  align-items: center;
  color: #fff;
  font-weight: 400;
}
#timeline .demo-card .number-box {
  display: inline;
  float: left;
  margin: 15px;
  padding: 10px;
  font-size: 35px;
  line-height: 35px;
  font-weight: 600;
  background: rgba(0, 0, 0, 0.17);
}
#timeline .demo-card .head h2 {
  text-transform: uppercase;
  font-size: 1.3rem;
  font-weight: inherit;
  letter-spacing: 2px;
  margin: 0;
  padding-bottom: 6px;
  line-height: 1rem;
}
@media (min-width: 480px) {
  #timeline .demo-card .head h2 {
    font-size: 165%;
    line-height: 1.2rem;
  }
}
#timeline .demo-card .head h2 span {
  display: block;
  font-size: 0.6rem;
  margin: 0;
}
@media (min-width: 480px) {
  #timeline .demo-card .head h2 span {
    font-size: 0.8rem;
  }
}
#timeline .demo-card .body {
  background: #fff;
  border: 1px solid rgba(191, 191, 191, 0.4);
  border-top: 0;
  padding: 15px;
}

  #timeline .demo-card .body {
    height: 275px;
  }
#timeline .demo-card .body p {
  font-size: 14px;
  line-height: 18px;
  margin-bottom: 15px;
}
#timeline .demo-card .body img {
  display: inline;
  width: 100%;
  max-width:100px;
}


.timeline-card {
  width : 100% !important;
}

.timeline-card-img img {
    width: 130px;
    height: 112px;
    object-fit: cover;
    border: 1px solid #72c6c7;
}

.timeline-date {
  color: #ffffff;
  background-color: #7acaca;
  text-align: center;
 font-size: 13px;
 padding: 10px 20px;
 max-width: 75px;
 margin:0px;
}

.timeline-event {
  background-color: #eff8f7;
display: flex;
align-items: center;
}
.timeline-event p {
  font-size: 13px;
    padding: 10px;
}

.blue {
  color: #21466e;
}
.timeline-event img {
   width: 40px;
    height: 30px;
    padding-right: 10px;
}

.pdf-page-wrapper .worksheet-headline { margin-top:0px; }

.profile-worksheet > .flex-row { padding-bottom:0px; }

.wsh-tbl { width:100%; margin-top:30px; }
.body-copy .wsh-tbl:first-child { margin-top:0px; }
.wsh-tbl table { width:100%; table-layout: fixed; }
.wsh-tbl table.not-100-percent { width:auto; }

.wsh-tbl thead th { border-top: 1px solid #72c6c7; border-bottom: 1px solid #72c6c7; background-color: #eff8f7; color: #21466e; padding: 18px; }
.wsh-tbl td { padding:2px 0px; vertical-align:top;   }



.wsh-tbl td.wsh-tbl-label { text-transform: uppercase; font-weight: 600; color: #21466e; padding: 2px 4px 2px 0px; white-space: nowrap; }
.wsh-tbl td.wsh-tbl-label.light-blue-cell { color:#32979d; }
.wsh-tbl td.wsh-tbl-value { font-weight: 400; color: #000000; border-bottom:1px solid #21466e; padding-left:5px; }
.wsh-tbl td.wsh-tbl-lpad { padding-left:18px; }
.wsh-tbl td.tbl-line-long { width:50%; }
.wsh-tbl .wsh-tbl-half { width:50%; padding:0; }
.wsh-tbl .wsh-tbl-third { width:33.33%; padding:0; }
.wsh-tbl .wsh-tbl-fourth { width:25%; padding:0; }
.wsh-tbl .wsh-tbl-sep { border-bottom: 1px solid #72c6c7; }
.wsh-tbl .wsh-tbl-sep-top { padding-top:5px; }
.to-circle span { display:inline-block; border:2px solid black; border-radius:15px; padding:5px 10px; }
.no-circle span { display:inline-block; border:2px solid white; border-radius:15px; padding:5px 10px; }
.wsh-tbl td.small-font-wsh { font-size:9px; }
.wsh-tbl td.small-font-wsh.to-circle span { border:1px solid black; border-radius:15px; padding:3px 10px; display:inline-block; }
.wsh-tbl td.small-font-wsh.no-circle span { border:1px solid white; border-radius:15px; padding:3px 10px; display:inline-block; }
.wsh-tbl td.wsh-tbl-right { text-align:right; padding-right:5px;  }


.three-charts-legend {
  text-align:center;
  padding:30px 0px;
}

.three-chart-item {
    text-transform:uppercase;
    font-weight:bold;
    display:inline-block;
    text-align:left;
    margin:0px 20px;
    font-smooth: always;
}

.three-chart-item span {
    display:inline-block;
    width:22px;
    height:22px;
    vertical-align:middle;
    margin-right:4px;
}

.three-charts {
  text-align:center;
}

.three-charts img {
  max-width:100%;
  height:auto!important;
}


.three-chart-0 {
  max-width:50%;
  margin:0px auto;
}

.three-chart-1 , .three-chart-2 {
  width:50%;
  float:left;
  padding:30px 50px;
}



.dlpr-border {
  border:1px solid rgb(233, 233, 233);
}

.dlpr-wrap { width:100%; }
.dlpr-col-50 { width:50%; vertical-align:top; }
.dlpr-timeline #timeline { padding:20px; }

.dlpr-content { padding:15px 30px; }
.dlpr-content h4 { color: #85cbcc; text-transform: uppercase; font-size: 16px; line-height: 20px; font-weight: 600; margin:0; }
.dlpr-content p { font-size: 16px; line-height: 22px; padding-bottom: 15px; padding-top: 2px;}
.dlpr-content ul  { padding-left:0px;   }
.dlpr-content .dlpr-two-cols-ul ul { column-count: 2; column-gap: 20px;  }
.dlpr-content ul li { color: #85cbcc; padding-bottom:20px; font-size: 16px; line-height: 20px; }
.dlpr-content ul li span { color: rgba(0, 0, 0, 0.87); }

.dlpr-text h3 { background-color:#eff8f7; padding:15px 30px; text-transform: uppercase; font-size: 24px; line-height:24px; font-weight:600; color:#1a3f69; border-bottom:2px solid #d64f23; }
.dlpr-text { border:30px solid #7acaca; border-collapse:collapse; }
.dlpr-text tr { vertical-align: top; }
.dlpr-text td { border:20px solid #7acaca; }
.dlpr-right-side { padding-left:30px; }
.dlpr-lifeprint-family-tree { background-color:#eff8f7; border-bottom:20px solid white; }
.dlpr-footer { padding-top: 20px; }

.lifeprint-heading { display:inline-block; margin:20px 0px 20px -1px; padding:15px 30px 15px 30px; font-weight:600; color:#ffffff; background-color:#7acaca; text-transform:uppercase; font-size:22px; line-height:22px; }
.dlpr-lifeprint-family-tree .lifeprint-heading { background-color:#1a3f69; }
#timeline-custom{
  display: flex !important;
  margin-top: 30px !important;
  justify-content: space-evenly !important;
}
#timeline .demo-card-my-man .head {
  position: relative;
  display: flex;
  align-items: center;
  color: #fff;
  font-weight: 400;
}
#timeline .demo-card-my-man .number-box {
  display: inline;
  float: left;
  margin: 15px;
  padding: 10px;
  font-size: 35px;
  line-height: 35px;
  font-weight: 600;
  background: rgba(0, 0, 0, 0.17);
}
#timeline .demo-card-my-man .head h2 {
  text-transform: uppercase;
  font-size: 1.3rem;
  font-weight: inherit;
  letter-spacing: 2px;
  margin: 0;
  padding-bottom: 6px;
  line-height: 1rem;
}
@media (min-width: 480px) {
  #timeline .demo-card-my-man .head h2 {
    font-size: 165%;
    line-height: 1.2rem;
  }
}
#timeline .demo-card-my-man .head h2 span {
  display: block;
  font-size: 0.6rem;
  margin: 0;
}
@media (min-width: 480px) {
  #timeline .demo-card-my-man .head h2 span {
    font-size: 0.8rem;
  }
}
#timeline .demo-card-my-man .body {
  background: #fff;
  border: 1px solid rgba(191, 191, 191, 0.4);
  border-top: 0;
  padding: 15px;
}

  #timeline .demo-card-my-man .body {
    height: 275px;
  }
#timeline .demo-card-my-man .body p {
  font-size: 14px;
  line-height: 18px;
  margin-bottom: 15px;
}
#timeline .demo-card-my-man .body img {
  display: inline;
  width: 100%;
  max-width:100px;
}
.demo-card-my-man{
  float:left !important;
}
.demo-card-my-woman{
  float:right !important;
}
.demo-card-wrapper-custom{
  display: flex !important;
    flex-direction: column !important;
}
.head-custom{
  margin-top: 20px;
  display: flex;
  align-items: center;
  width:100%;
}

.primary-one-side{
  width: 50% !important;
  float : left !important;
}
.primary-two-side{
  width: 50% !important;
  float : right !important;
}

.middle-line{
  padding:0 10px; 
  border-top: 1px solid #7acaca; 
  height: 1px;
  margin-top: 3px;
  line-height: 0.1em;
}
.primary-two-side-middle-line{
  margin: -3px;
  float : left !important;
  width : 40% !important;
}
.primary-one-side-middle-line{
  float : right !important;
  position: relative;
  margin-right: -7px !important;
  width : 40% !important;
}
.primary-one-timeline{
  float : left !important;
  width : 100% !important;
}
.primary-two-timeline{
  float : right !important;
  width : 100% !important;
  display: flex;
    flex-direction: column;
    align-items: flex-end;
}
.My-grid{
  margin-top: -17px;
  display: flex;
}

.display-flex-align{
  display: flex;
    align-items: center;
}
.man-timeline-before {
}
.timeline-card-img{
  background: #eff8f7 !important;
  width: 77px !important;
  border: 2px solid #7acaca  !important;
}
.circle{
  background: #7acaca;
    border-radius: 50%;
    width: 10px;
   
    position: absolute;
    height: 10px;
    left: 411px;
}
// .left-circle{
//   left: -3px; !important
// }
// .right-circle{
//   right: -6px !important
// }
.my-side{
  display: flex;
  align-items: center;
}
.timeline-info{
  width: 100%;
}
.timeline-event{
  
}
.my-custom-header{
  display: flex;
  justify-content: space-evenly;
  width: 100%;
  height: 60px;
  margin-top : 20px;
  margin-bottom : 20px;
}
.old-header{
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;  
}
.header-image{
width:50px;
border: 2px solid #7acaca;
}

.person-one-image, .person-two-image{
  display: flex;
}

.person-one-image > img, .person-two-image > img{
  width: 62px;
  height: auto;
}

.header-text {
  float: right;
  background: rgb(239 248 247);
  display: flex;
  align-items: center;
  padding: 5px;
  font-weight: 480;
  color: #1f2c2c;
  width: 144px;
  text-align: center;
  justify-content: center;
}

.family-text {
  font-weight: bold;
  font-size: 20px;
  overflow-wrap: break-word;
  max-width: 175px;
  text-align: center;
  color: #1a3f69;
}

.pdf-container {
  margin-bottom: 70px;
}
.blue{
  min-width: 80%;
}

.worksheet-headings{
  border-top: 2px solid #72c6c7;
  border-bottom: 2px solid #72c6c7;
  background: #e6f1f2;
  display: inline-block;
  padding: 5px 15px 5px 15px;
}

.worksheet-heading-text{
  font-size:20px;
  font-weight: bold;
  color: #1a3f69;
}

.worksheet-field-title{
  font-weight: bold;
  color: #1a3f69;
}
.empty-field{
  border-bottom: 2px solid #72c6c7;
  width:100%
}

.filled-field{
  // border-bottom: 2px solid #72c6c7;
}

.role-types-heading{
  font-weight: bold;
  color: #1a3f69;
}
.roles-list{
  font-weight: bold;
  color: #1a3f69;
  list-style: none;
}

.worksheet-field-row{
  margin-left:45px;
  display:flex;
  flex-direction: row;
  width:80%;
  margin-bottom: 30px;
}

.worksheet-field-each{
  display:flex;
  flex-direction: row;
  margin-right:15px;
}

.worksheet-label{
  font-weight: bold;
  color: #1a3f69;
}

.worksheet-text{
  text-align: left;
  border-bottom: 2px solid #72c6c7;
}

// .phone-checkbox{
//   border: 2px solid #72c6c7;
// }
// .timeline-ancestral {
//   text-align: center;
//   color: #1a3f69;
//   font-size: 25px;
// }
`;

export default StoryOfUsStyles;