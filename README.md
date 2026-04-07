# Clariata Frontend

Next.js + React frontend for Clariata: an advisor/client platform with modules like **Advisor Dashboard**, **Client Dashboard**, **Discover**, **Dream**, and **Direction** (with **Deepen**/**Destiny** partially implemented).

## Screenshots

![Advisor Dashboard](clariata/Screenshot%20(196).png)
![Client Dashboard](clariata/Screenshot%20(197).png)
![Discover](clariata/Screenshot%20(198).png)
![Dream](clariata/Screenshot%20(199).png)
![Direction](clariata/Screenshot%20(200).png)

## Install

### Prerequisites

- Node.js: use the version in `.nvmrc` (recommended) to match the older Next.js/React toolchain.
- Package manager: Yarn Classic (v1) is recommended (this repo includes `yarn.lock`).

### Install dependencies

Initial install:
### `yarn install`

If you prefer npm:
### `npm install`

If you don't have Yarn installed yet:
### `npm install -g yarn@1`

## Prepare local environment

Create a local config if necessary:
### `cp .env.local.example .env.local`

Note: `.env*` files are intentionally ignored by git. Only the `*.example` template should be committed.

## Execution

### Run locally

### `yarn dev`

OR

### `debug` from `package.json` to debug
[See Next.js debugging docs](https://nextjs.org/docs/advanced-features/debugging)


Runs the app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br />
You will also see any lint errors in the console.

### Run locally with specific environment
```bash
ENVIRONMENT="{env}" npm run dev:env
```

## Build

### `yarn build`

Builds the app for production to the `.next` folder.

Builds the app for production with special environment:
```bash
ENVIRONMENT="{env}" npm run build:env
```

## Framework Overview
<a href="https://nextjs.org/" target="_blank">Next JS</a> is utilized as the primary framework.

Page declarations can be found in the `src/pages` directory. 

Page implementations can be found in the `src/ui/pages` directory. 

### Adding a new page
1) Add page declaration in `src/pages` directory. 

2) Create page directory under the `src/ui/pages` directory (directory name is page name capitalized). 

    a) Add `PageName.module.scss` to page directory. Declare the styles used on the page.
    
    b) Add `PageName.tsx` to page directory. This is the page definition.
    
    c) Add `index.ts` to page directory. Used to export the component. 
    
3) Add path to path constants in `src/ui/constants/paths.ts`

### Adding and Using layouts
There are currently three layouts located in the `src/ui/layouts/*` directory. By default, the `PrivateLayout` is always used. 
To override the default layout, simply set the layout of the page in the page declaration prior to exporting the page. 
See NextJS Custom 'App' documentation for more details.

Example:

    const LoginPage = (): ReactElement => (
      <>
        <Head>
          <title>Login</title>
          <meta name="description" content="Login to Clariata" />
        </Head>
        <DynamicComponentWithNoSSR />
      </>
    );
    
    LoginPage.Layout = PublicLayout;
    
    export default LoginPage;

### Adding a new component

Create component directory under the `src/ui/components` directory (directory name is page name capitalized). 

1) Add `ComponentName.module.scss` to component directory. Declare the styles used on the page.

2) Add `ComponentName.tsx` to component directory. This is the component definition.

3) Add `index.ts` to component directory. Used to export the component. 

## Store Overview
<a href="https://easy-peasy.now.sh/" target="_blank">Easy Peasy</a> is utilized to simplify interactions with redux.

All store related files can be found in the `src/store` directory. 

The mass majority of all data is loaded and stored when a new household is selected (triggers this on login as well using the most recently selected household). 
After initial store population, only specific store items are updated in specific components.

## HTTP Overview
<a href="https://github.com/axios/axios" target="_blank">Axios</a> is utilized for all http requests.

All request configurations and api endpoint defintions can be found in the `src/services/api` directory. 

All models used from the API can be found in `src/types/api`. These models match up with the backend models. Some models were extended to include frontend-specific properties.

## Tables Overview
Tables are representated as view (IDataTableView).

A view has a list of headers (IDataTableHeader) as a property that contain key properties including the column's sorting capabilities and configuration.

Each header has a defined cell template (see `src/ui/components/Priorities/CellTemplates/*` for examples) this is wrapped by the `DataCellTemplate` component. The majority of cell templates have an inline editing configuration as well that enable editing the data in a cell directly via a click.

Pagination, sorting, filtering, drag/dro, and filters are all handled via hooks. 

All data is currently being loaded locally via a single API hit (API doesn't currently support pagination). 

## Reports Overview
The reporting functionality utilizes Puppeteer on the server-side to generate PDF reports from the actual page html.
Any page can be exported as a pdf by simply passing `pdf=true` as a query param (idea being that reports can also be displayed in the browser).

This logic can be found in `src/pages/_document.tsx`.

The `src/layouts/PDFLayout/*` directory contains the PDF layout used for PDF reports.

## Other third-party documentation
Other libraries not mentioned in the above documentation are listed below.

<a href="https://sass-lang.com/" target="_blank">
SASS - styles
</a><br />
<a href="https://github.com/axios/axios" target="_blank">
Axios - http
</a><br />
<a href="https://github.com/jquense/yup" target="_blank">
Yup - model validation
</a><br />
<a href="https://formik.org/" target="_blank">
Formik - forms
</a><br />
<a href="https://jestjs.io/" target="_blank">
Jest - testing
</a><br />

# Additional notes and concerns (5/5/21)
## In-Progress
Dashboard widgets - A collection of widgets has already been created, but there are quite a few more to be added. Most that aren't completed require data visualizations.

Settings - The settings page is partially done. Most of the work to be done needs to be done on the sharing and organization management (see endpoints). There were still some things to be ironed out on how the organization management should work on the backend, so those need to iron those out first to determine what needs to be on the frontend.

Excel Reports - Not much has been done on the excel reports, but endpoints exist for these. The results from the API are designed to match up with ExcelJS, which is what we were planning on using on the FE.

Notifications - Form notifications need to be finished. Submit success/error notifications are triggered in the FormWrapper component. By default, it will simply display “Saved Successfully,” but it can be overridden wherever a new instance of FormWrapper is included. Primarily just need to adjust on the auth page ( login, reset password, verification, etc.) and anywhere there needs to be context in the success or error messages.

Dream > Action Items - The calendar should be working fine, but some additional work needs to be done on the Gantt. It’s extending off the side of the page. The editing capabilities for the Gantt also haven’t been tested.

TODOs - There are quite a few TODOs throughout the code. Most have comments as well.

Evaluation wizard - There's a few errors on this page, but it's not currently included in the UI. Confirm with project owners that this will be included.

## Concerns

Data Population - Loading all of the data when initially selecting a household will surely become a performance bottleneck. 
The data is needed on various main template and dashboard items. An endpoint needs to be added to only included these details so that the data population can be separated into individual components.

Pagination - Not currently using API for paginating. I could see this becoming an issue down the road as well.

Mobile Compatibility - There wasn’t any time spent on making the UI mobile compatible, so time will need to be allocated to this if the project owners determine they want the the UI to work on various small devices. 

Testing - No tests have been added up to this point.

# Contact

If you need any additional help on this project, feel free to contact me at jordan@macinteractive.io .

