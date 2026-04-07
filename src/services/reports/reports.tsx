import {ServerStyleSheet} from "styled-components";
import ServerStyleSheets from "@material-ui/styles/ServerStyleSheets";
import {DocumentContext, RenderPageResult} from "next/dist/next-server/lib/utils";
import React, {ReactElement} from "react";
import {renderToString} from "react-dom/server";
import {logSimple} from "~/ui/constants/utils";
import {processServerError} from "~/services/api/errors";
import {toPdfBuffer} from "~/pages/_document";
import {IncomingMessage, OutgoingMessage} from "http";
import request from "~/services/api/request";
import {createServerClientWithToken} from "~/services/api/serverRequest";
import {getFullFamily, getHouseholdFamily} from "~/services/reports/persons";
import api from "../api";

export const processReport = async (req: IncomingMessage, res: OutgoingMessage, query: any, renderPage: any) => {

  // Styles
  const sheet = new ServerStyleSheet();
  const materialSheet = new ServerStyleSheets();

  // Fetch styles from components in page
  const page: RenderPageResult = await renderPage((App: any) => (props: any) =>
    sheet.collectStyles(materialSheet.collect(<App {...props} />))
  );

  // Extract style as <style> tags
  const styleTags = sheet.getStyleElement();
  const materialStyleTags = materialSheet.getStyleElement();

  // Parse query
  const pdf = query.pdf === "true";
  const server = !!req;

  if (pdf && server) {
    try {
      const css = sheet
        .getStyleElement()
        .map((e: any) => e.props.dangerouslySetInnerHTML.__html)
        .join();
      const mcss = materialSheet.toString();

      // Create component
      const component: ReactElement = (
        <html lang="en" dangerouslySetInnerHTML={{
          __html: `
            <head>
            <style>
            @font-face {
              font-family: 'Play';
              font-style: normal;
              font-weight: 400;
              font-display: swap;
              src: url(https://fonts.gstatic.com/s/play/v12/6aez4K2oVqwIvtg2H68T.woff2) format('woff2');
              unicode-range: U+0460-052F, U+1C80-1C88, U+20B4, U+2DE0-2DFF, U+A640-A69F, U+FE2E-FE2F;
            }
            
            @font-face {
              font-family: 'Play';
              font-style: normal;
              font-weight: 400;
              font-display: swap;
              src: url(https://fonts.gstatic.com/s/play/v12/6aez4K2oVqwIvtE2H68T.woff2) format('woff2');
              unicode-range: U+0400-045F, U+0490-0491, U+04B0-04B1, U+2116;
            }
            
            @font-face {
              font-family: 'Play';
              font-style: normal;
              font-weight: 400;
              font-display: swap;
              src: url(https://fonts.gstatic.com/s/play/v12/6aez4K2oVqwIvtY2H68T.woff2) format('woff2');
              unicode-range: U+0370-03FF;
            }
            
            @font-face {
              font-family: 'Play';
              font-style: normal;
              font-weight: 400;
              font-display: swap;
              src: url(https://fonts.gstatic.com/s/play/v12/6aez4K2oVqwIvto2H68T.woff2) format('woff2');
              unicode-range: U+0102-0103, U+0110-0111, U+0128-0129, U+0168-0169, U+01A0-01A1, U+01AF-01B0, U+1EA0-1EF9, U+20AB;
            }
            
            @font-face {
              font-family: 'Play';
              font-style: normal;
              font-weight: 400;
              font-display: swap;
              src: url(https://fonts.gstatic.com/s/play/v12/6aez4K2oVqwIvts2H68T.woff2) format('woff2');
              unicode-range: U+0100-024F, U+0259, U+1E00-1EFF, U+2020, U+20A0-20AB, U+20AD-20CF, U+2113, U+2C60-2C7F, U+A720-A7FF;
            }
            
            @font-face {
              font-family: 'Play';
              font-style: normal;
              font-weight: 400;
              font-display: swap;
              src: url(https://fonts.gstatic.com/s/play/v12/6aez4K2oVqwIvtU2Hw.woff2) format('woff2');
              unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
            }
            </style>
            <style id="local-css">${renderToString(css)}</style>
            <style id="material-css">${mcss}</style>
            </head>
            <body>
            <div id="__next">${page.html}</div>
            </body>`
        }} />
      );
      // Create buffer
      const buffer = await toPdfBuffer(component)
        .catch((e: any) => {
          logSimple('error', e);
        });

      // Set necessary headers
      res.setHeader("Content-disposition", 'attachment; filename="report.pdf');
      res.setHeader("Content-Type", "application/pdf");
      res.end(buffer);

      return true;
    } catch (err) {
      processServerError(err, '_document.getInitialProps');
    }
  }

  return false;
}

export const getReportProps = async (context: DocumentContext) => {
  if (context.query) {
    request.private = createServerClientWithToken(context.req, String(context.query.token));
    const family = await getHouseholdFamily(Number(context.query.householdId));
    const household = await getFullFamily(Number(context.query.householdId));
    const persons = await api.person.list(household?.HouseholdID);
    family.household = household;

    return {
      props: {
        family,
        household,
        persons: persons?.data
      }
    };
  }

  return {
    props: {
      family: undefined,
      household: undefined,
      persons: undefined
    }
  }
}