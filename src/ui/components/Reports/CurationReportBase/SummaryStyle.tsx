import {createGlobalStyle} from "styled-components";

const SummaryStyle = createGlobalStyle`
  @charset "UTF-8";

  body{
    background-color: transparent !important;
  }
  
  
  #summary article,
  #summary aside,
  #summary details,
  #summary figcaption,
  #summary figure,
  #summary footer,
  #summary header,
  #summary hgroup,
  #summary main,
  #summary nav,
  #summary section,
  #summary summary {
    display: block;
  }

  #summary audio,
  #summary canvas,
  #summary video {
    display: inline-block;
  }

  #summary audio:not([controls]) {
    display: none;
    height: 0;
  }

  #summary [hidden] {
    display: none;
  }

  #summary html {
    -ms-text-size-adjust: 100%;
    /* 2 */
    -webkit-text-size-adjust: 100%;
    /* 2 */
  }

  body {
    margin: 0;
    -webkit-font-smoothing: antialiased;
  }

  #summary a:focus {
    outline: none;
  }

  #summary a:active,
  #summary a:hover {
    outline: 0;
  }

  #summary h1 {
    font-size: 2em;
    margin: 0.67em 0;
  }

  #summary abbr[title] {
    border-bottom: 1px dotted;
  }

  #summary b,
  #summary strong {
    font-weight: bold;
  }

  #summary dfn {
    font-style: italic;
  }

  #summary hr {
    -moz-box-sizing: content-box;
    box-sizing: content-box;
    height: 0;
  }

  #summary mark {
    background: #ff0;
    color: #000;
  }

  #summary code,
  #summary kbd,
  #summary pre,
  #summary samp {
    font-family: monospace, serif;
    font-size: 1em;
  }

  #summary pre {
    white-space: pre-wrap;
  }

  #summary q {
    quotes: "“" "”" "‘" "’";
  }

  #summary small {
    font-size: 80%;
  }

  #summary sub,
  #summary sup {
    font-size: 75%;
    line-height: 0;
    position: relative;
    vertical-align: baseline;
  }

  #summary sup {
    top: -0.5em;
  }

  #summary sub {
    bottom: -0.25em;
  }

  #summary img {
    border: 0;
  }

  #summary svg:not(:root) {
    overflow: hidden;
  }

  #summary figure {
    margin: 0;
  }

  #summary fieldset {
    border: 1px solid #c0c0c0;
    margin: 0 2px;
    padding: 0.35em 0.625em 0.75em;
  }

  #summary legend {
    border: 0;
    /* 1 */
    padding: 0;
    /* 2 */
  }

  #summary button,
  #summary input,
  #summary select,
  #summary textarea {
    font-family: inherit;
    /* 1 */
    font-size: 100%;
    /* 2 */
    margin: 0;
    /* 3 */
  }

  #summary button,
  #summary input {
    line-height: normal;
  }

  #summary button,
  #summary select {
    text-transform: none;
  }

  #summary button,
  #summary html input[type=button],
  #summary input[type=reset],
  #summary input[type=submit] {
    -webkit-appearance: button;
    /* 2 */
    cursor: pointer;
    /* 3 */
  }

  #summary button[disabled],
  #summary html input[disabled] {
    cursor: default;
  }

  #summary input[type=checkbox],
  #summary input[type=radio] {
    box-sizing: border-box;
    /* 1 */
    padding: 0;
    /* 2 */
  }

  #summary * {
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
    outline: medium none;
  }

  #summary :-moz-placeholder {
    opacity: 1;
  }

  #summary ::-moz-placeholder {
    opacity: 1;
  }

  #summary :-ms-input-placeholder {
    opacity: 1;
  }

  #summary ::-webkit-input-placeholder {
    opacity: 1;
  }

  #summary input[type=search] {
    -webkit-appearance: textfield;
    /* 1 */
    -moz-box-sizing: border-box;
    -webkit-box-sizing: border-box;
    /* 2 */
    box-sizing: border-box;
  }

  #summary input[type=search]::-webkit-search-cancel-button,
  #summary input[type=search]::-webkit-search-decoration {
    -webkit-appearance: none;
  }

  #summary button::-moz-focus-inner,
  #summary input::-moz-focus-inner {
    border: 0;
    padding: 0;
  }

  #summary textarea {
    overflow: auto;
    /* 1 */
    vertical-align: top;
    /* 2 */
  }

  #summary table {
    border-collapse: collapse;
    border-spacing: 0;
  }

  #summary ::-webkit-input-placeholder {
    /* Chrome/Opera/Safari */
    opacity: 1;
  }

  #summary ::-moz-placeholder {
    /* Firefox 19+ */
    opacity: 1;
  }

  #summary :-ms-input-placeholder {
    /* IE 10+ */
    opacity: 1;
  }

  #summary :-moz-placeholder {
    /* Firefox 18- */
    opacity: 1;
  }

  #summary .clearfix::before,
  #summary .clearfix::after {
    content: " ";
    /* 1 */
    display: table;
    /* 2 */
  }

  #summary .clearfix::after {
    clear: both;
  }

  #summary .clearfix {
    *zoom: 1;
  }

  @page {
    size: 7in 9.25in;
    margin: 27mm 16mm;
  }

  body {
    font-family: Play, Arial, monospace !important;
  }

  #summary h1,
  #summary h2,
  #summary h3,
  #summary p {
    margin: 0;
    padding: 0;
    color: #1a3f69;
  }

  #summary .bc-row {
    page-break-inside: avoid;
  }

  #summary .page-wrapper {
    width: 890px;
    margin: 0 auto;
  }

  #summary .pw-left {
    width: 50px;
    float: left;
  }

  #summary .pw-right {
    width: 840px;
    float: left;
  }

  #summary .logo-text {
    writing-mode: vertical-rl;
    text-orientation: mixed;
    padding: 20px 0 0 14px;
    white-space: nowrap;
  }

  #summary .pwl-bottom p {
    writing-mode: vertical-rl;
    text-orientation: mixed;
  }

  #summary .h-left {
    display: inline-block;
    width: 260px;
    vertical-align: middle;
  }

  #summary .h-left img {
    width: 23px;
    display: inline-block;
    vertical-align: middle;
    height: auto;
  }

  #summary .h-left p {
    width: 220px;
    vertical-align: middle;
    display: inline-block;
    font-size: 14px;
    text-transform: uppercase;
    font-weight: 600;
    padding: 0 0 0 5px;
  }

  #summary .h-right {
    display: inline-block;
    width: 570px;
    vertical-align: middle;
  }

  #summary .hr-wrapper {
    float: right;
    border: 1px solid #72c6c7;
    padding: 5px;
  }

  #summary .hr-wrapper img {
    width: 120px;
    display: inline-block;
    vertical-align: middle;
    height: auto;
  }

  #summary .hr-wrapper p {
    width: auto;
    display: inline-block;
    vertical-align: middle;
    font-size: 12px;
    text-align: center;
    padding: 0 20px;
  }

  #summary .body-copy {
    margin: 20px 0 10px;
  }

  #summary .bc-heading {
    display: table;
    width: 100%;
    table-layout: fixed;
    border-spacing: 5px;
    border-collapse: separate;
  }

  #summary .bc-heading p {
    color: #fff;
    text-transform: uppercase;
    font-weight: 600;
    background-color: #72c8c9;
    display: table-cell;
    vertical-align: middle;
    text-align: center;
    font-size: 12px;
    line-height: 16px;
    padding: 10px;
    width: 114px;
  }

  #summary .bc-row {
    display: table;
    width: 100%;
    table-layout: fixed;
    border-spacing: 5px;
    border-collapse: separate;
  }

  #summary .bc-row:nth-child(odd) .bc-col {
    background-color: #eef8f7;
  }

  #summary .bc-col {
    display: table-cell;
    border: 1px solid #eef8f7;
    text-align: center;
    padding: 5px;
    width: 114px;
    vertical-align: middle;
  }

  #summary .bc-col p {
    font-size: 8px;
    line-height: 12px;
  }

  #summary .bcc-images img {
    display: inline-block;
    vertical-align: middle;
    margin: 10px 2px 5px;
    height: 16px;
    width: auto;
  }

  #summary footer {
    display: table;
    width: calc(100% - 10px);
    table-layout: fixed;
    border: 1px solid #72c6c7;
    padding: 5px;
    border-spacing: 5px;
    border-collapse: separate;
    margin-left: 5px;
  }

  #summary .f-col {
    display: table-cell;
    vertical-align: middle;
    border-right: 1px solid #72c6c7;
    padding: 0 10px;
  }

  #summary .f-col > p {
    font-size: 12px;
    line-height: 16px;
    font-weight: 600;
    padding-bottom: 5px;
  }

  #summary .f-col:nth-child(1) {
    width: 130px;
  }

  #summary .f-col:nth-child(2) {
    width: 280px;
  }

  #summary .f-col:nth-child(3) {
    width: 160px;
  }

  #summary .f-col:nth-child(4) {
    width: 205px;
    border: none;
  }

  #summary .f-row img {
    float: left;
    width: auto;
    height: 12px;
  }

  #summary .f-row p {
    float: left;
    font-size: 8px;
    padding: 0 5px;
    line-height: 12px;
  }

  /*# sourceMappingURL=content.module.css.map */

`

export default SummaryStyle;