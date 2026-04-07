import React, {ReactElement} from 'react';
import Document, {DocumentContext, Head, Html, Main, NextScript} from 'next/document';
import {ServerStyleSheet} from "styled-components";
import ServerStyleSheets from "@material-ui/styles/ServerStyleSheets";
import {RenderPageResult} from "next/dist/next-server/lib/utils";
import {renderToStaticMarkup, renderToString} from "react-dom/server";
import {logSimple} from "~/ui/constants/utils";
import {PaperFormat, PDFOptions} from "puppeteer/lib/cjs/puppeteer/common/PDFOptions";
import puppeteer from "puppeteer/lib/cjs/puppeteer/node-puppeteer-core";
import {logoBase64WithouText, PDFFooter, PDFFooterUpdated} from "~/ui/components/Reports/PDFEmbedded/PDFEmbedded";
import {processServerError} from "~/services/api/errors";
import { PDFDocument } from 'pdf-lib';

interface CustomPageSize{
  width: number | string,
  height: number | string,
  margin: {horizontal: number | string, vertical: string | number}
}

class DocumentPage extends Document {
  static async getInitialProps(ctx: DocumentContext) {
    const initialProps = await Document.getInitialProps(ctx);
    const {req, res, query, renderPage} = ctx;
    // Null check
    if (!res) {
      return {...initialProps};
    }

    // Styles
    const sheet = new ServerStyleSheet();
    const materialSheet = new ServerStyleSheets();

    // Parse query
    const pdf = query.pdf === "true";
    const server = !!req;

    // Fetch styles from components in page
    const page: RenderPageResult = !pdf ?
      await renderPage((App: any) => (props: any) =>
        sheet.collectStyles(materialSheet.collect(<App {...props} />))
      ) :
      await renderPage({
        enhanceApp: App => props => sheet.collectStyles(materialSheet.collect(<App {...props} />))
      });

    // Extract style as <style> tags
    const styleTags = sheet.getStyleElement();
    const materialStyleTags = materialSheet.getStyleElement();

    if (pdf && server) {
      try {
        const css = sheet
          .getStyleElement()
          .map((e: any) => e.props.dangerouslySetInnerHTML.__html)
          .join();
        const mcss = materialSheet.toString();


        // Create component
        const styleTagsString = `
        <style>
            @font-face {
              font-family: 'Akzidenz-Grotesk';
              src: local("Akzidenz-Grotesk"), url(/fonts/akzidenz-new/AkzidGroCFFReg.otf) format('opentype');
            }
            span.logo { height: 20px; content: url(${logoBase64WithouText}) }
            div.footer { display: block; width: 100%; padding-left: 40px; padding-right: 40px; font-size: 8px; color: #183f69; }
            div.footer-content { display:flex; justify-content: space-between; width: 100%; padding-top: 15px; }
            div.footer-left { width: 5%; padding: 0; text-align: left; line-height: 20px; }
            div.footer-right { width: 30%; padding: 0; text-align: right; line-height: 20px; }
            div.footer-center { width: 65%; padding: 0; text-align: left; line-height: 20px; vertical-align: middle; }
            </style>
            <style id="local-css">${renderToString(css)}</style>
            <style id="material-css">${mcss}</style>
            
        `;
        
        const component: ReactElement = (
          <html lang="en" dangerouslySetInnerHTML={{
            __html: `
            <head>
                ${styleTagsString}
            </head>
            <body>
            <div id="__next">${page.html}</div>
            </body>`
          }}/>
        );
        
        let buffer;
        if(query.width){
          const customSize:CustomPageSize = {
            width: query.width as string,
            height: query.height as string,
            margin: {
              vertical: query.vertical as string,
              horizontal: query.horizontal as string
            }
            // margin: {
            //   vertical: '0',
            //   horizontal: '0'
            // }
          }

          // Create buffer
          buffer = await toPdfBuffer(component, customSize, String(query?.reportTitle), Boolean(query?.guidebook), Boolean(query?.hideFooter), query?.customFormat ? String(query?.customFormat) as PaperFormat : undefined, Number(query?.scale))
              .catch((e: any) => {
                logSimple('error', e);
              });
        }else{
          buffer = await toPdfBuffer(component, undefined, String(query?.reportTitle), Boolean(query?.guidebook), Boolean(query?.hideFooter), query?.customFormat ? String(query?.customFormat) as PaperFormat : undefined, Number(query?.scale))
              .catch((e: any) => {
                logSimple('error', e);
              });
        }


        // Set necessary headers
        res.setHeader("Content-disposition", 'attachment; filename="report.pdf');
        res.setHeader("Content-Type", "application/pdf");
        res.end(buffer);
      } catch(err) {
        processServerError(err, '_document.getInitialProps');

      }
    }

    // @ts-ignore
    return {...page, renderPage, styleTags, materialStyleTags, query, pdf, server};
  }

  render(): ReactElement {
    return (
      <Html>
        <Head lang="en"/>
        <body>
        <Main/>
        <NextScript/>
        </body>
      </Html>
    );
  }
}

export const toPdfBuffer = async (component: ReactElement, customSize?: CustomPageSize, customTitle?: String, guidebook?: boolean, hideFooter?: boolean, customFormat?: PaperFormat, scale?: number) => {
  const url = process.env.NEXT_PUBLIC_DOMAIN;
  if (!url) throw new Error('URL not defined.');
  const html = renderToStaticMarkup(component);

  const browser = await puppeteer.launch({
    headless: true,
    args: ['—no-sandbox', '—disable-setuid-sandbox', '--hide-scrollbars'],
    ignoreHTTPSErrors: true,
  });
  const page = await browser.newPage();

  await page.goto(url );
  // await page.waitFor('*')
  // await page.addStyleTag({content: styles2});
  await page.setContent(html, {waitUntil: ['domcontentloaded', 'networkidle2'], timeout: 50000});

  await page.evaluateHandle('document.fonts.ready');
  await page.emulateMediaType('screen');

  // await page.evaluate(() => {
  //   return new Promise((resolve) => {
  //     const images = document.getElementsByTagName("img")
  //     if(images.length) {
  //       let isAllLoaded = false
  //       while (!isAllLoaded) {
  //         isAllLoaded = Array.prototype.slice.call(images).map(i => i.complete && i.naturalHeight !== 0).reduce((pv, v) => pv && v, true)
  //       }
  //       resolve()
  //     }else{
  //       resolve()
  //     }
  //   })
  // })

  // await page.waitForSelector('#chartImage')

  const options: PDFOptions = {
    format: customFormat ? customFormat : 'letter',
    scale: scale ? scale : 1,
    printBackground: true,
    displayHeaderFooter: !hideFooter,
    headerTemplate: '',
    footerTemplate: PDFFooter(customTitle ? String(customTitle) : "Clariata Report"),
    // footerTemplate: '',
  };

  if(customSize){
    options.format = undefined
    options.width = customSize.width
    options.height = customSize.height
    options.margin = {
      top: customSize.margin.vertical,
      bottom: customSize.margin.vertical,
      left: customSize.margin.horizontal,
      right: customSize.margin.horizontal
    }
  }

  if(guidebook) {
    const page1: Buffer = await page.pdf({
      ...options,
      displayHeaderFooter: false,
      pageRanges: '1',
    })
    const page2: Buffer = await page.pdf({
      ...options,
      pageRanges: '2-',
    })

    const pdfDoc = await PDFDocument.create()

    const coverDoc = await PDFDocument.load(page1)
    const [coverPage] = await pdfDoc.copyPages(coverDoc, [0])
    pdfDoc.addPage(coverPage)

    const mainDoc = await PDFDocument.load(page2)
    for (let i = 0; i < mainDoc.getPageCount(); i++) {
      const [aMainPage] = await pdfDoc.copyPages(mainDoc, [i])
      pdfDoc.addPage(aMainPage)
    }

    const pdfBytes = await pdfDoc.save()
    await browser.close();
    return Buffer.from(pdfBytes);
  }
  else {
    // await page.emulateMediaType("screen");
    // await page.waitForNavigation({
    //   waitUntil: 'networkidle0',
    // });

    const pdf = await page.pdf(options);
    await browser.close();
    return pdf;
  }
};

export default DocumentPage;
