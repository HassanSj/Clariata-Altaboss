import {createGlobalStyle} from 'styled-components';

const ReportStyles = createGlobalStyle`
@media print {
  @page {
    size: A4 portait;
    margin-left: 40px;
    margin-right: 40px;
    margin-top: 0px;
    margin-bottom: 100px;
  }
  .page {
    page-break-after: always;
  }
}

.report_wrapper {
  display: block;
  position: relative;
  overflow: hidden;
  padding: 10px;
}

.report_page_header {
  padding: 15px 0px;
  margin-bottom: 10px;
}

.report_page_header_logo {
  height: 60px;
}

.report_page_subheader {
  display: block;
  position: relative;
  overflow: hidden;
  width: 100%;
  clear: both;
  color: #fff !important;
  background: #183f69 !important;
  padding: 15px 20px;
  margin-bottom: 15px;
}

.evaluation_question {
  display: block;
  position: relative;
  overflow: hidden;
  width: 100%;
  clear: both;
  color: #fff !important;
  background: #183f69 !important;
  padding: 15px 20px;
}

.evaluation_response {
  border: 1px solid lightblue;
  height: 100px;
  padding: 15px 20px;
}

.evaluation_section {
  margin-bottom: 30px;
}

p.score {
  font-size: medium;
  text-align: center;
  padding: 0;
  margin: 0;
}

p.value {
  font-size: small;
  text-align: center;
  padding: 0;
  margin: 0;
}

.evaluation_score {
  max-height: 50px;
  border: 1px solid lightblue;
}

.evaluation_score.active {
  background: #183f69 !important;
}

.report_page_content {
  display: block;
  position: relative;
  overflow: hidden;
}

.report_page_footer {
  padding-top: 10px;
  border-top: 1px solid #183f69 !important;
}

.report_page_footer_number {
  text-align: right;
}

.report_subheader {
  text-align: center;
  padding: 10px 0px;
  font-size: 1.2rem !important;
  font-weight: bold !important;
  color: #183f69 !important;
  border-top: 2px solid #183f69 !important;
  border-bottom: 2px solid #183f69 !important;
}

.report_subheader > .report_subheader_icon {
  margin-right: 15px;
  color: #183f69 !important;
  padding-top: 5px !important;
}

.report_row_label,
.report_row_label .MuiTypography-body2 {
  font-weight: bold !important;
}

.report_page_header_triangle {
    float: right;
    width: 0;
    height: 0;
    border-top: 100px solid #eee;
    border-left: 100px solid transparent;
    border-right: 100px solid #eee;
    margin-top: -15px;
    margin-bottom: -15px;
}

.report_interview_question_wrapper {
    margin-bottom: 15px;
}

.report_interview_question {

}

.report_interview_question_title {
  text-align: left;
  padding: 10px 0px;
  font-size: 1rem !important;
  font-weight: bold !important;
  color: #183f69 !important;
  border-bottom: 1px solid #ccc !important;
  margin-bottom: 10px;
}

.report_interview_subquestions {
    padding-left: 10px !important;
}

.report_interview_subquestion {

}

.report_interview_subquestion_title {
  text-align: left;
  padding: 10px 0px;
  font-size: 1rem !important;
  font-weight: bold !important;
  color: #183f69 !important;
  border-bottom: 1px solid #ccc !important;
  margin-bottom: 10px;
}

.report_interview_question_index {
  margin-right: 10px;
  color: #000;
}

.report_interview_question_response_wrapper {
  padding: 0px 10px;
  font-size: 0.9rem !important;
  border-left: 2px solid #ccc;
  margin-bottom: 10px;
}

.report_interview_question_response_item {
  margin-bottom: 10px;
}

.report_interview_question_response_label {
  margin-right: 15px;
  font-weight: bold;
}

.report_interview_question_response_value {

}

.report_matrix_header {
  font-weight: bold;
  text-transform: uppercase;
}

.report_matrix_row {
  min-height: 100px;
  padding: 10px;
}

.report_matrix_row_alt {
  min-height: 100px;
  background: #eee !Important;
  padding: 10px;
}
`;

export default ReportStyles;
