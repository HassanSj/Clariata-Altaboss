import React from "react";
import {createStyles, withStyles} from "@material-ui/styles";
import Tabs from "@material-ui/core/Tabs";
import {Theme} from "@material-ui/core/styles";
import Tab from "@material-ui/core/Tab";
import {TabProps} from "~/ui/components/Containers/VerticalTabs/VerticalTabs";


export interface StyledTabsProps {
  value: number;
  onChange: (event: React.ChangeEvent<{}>, newValue: number) => void;
}
export const StyledTabs = withStyles({
  indicator: {
    display: 'flex',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    '& > span': {
      maxWidth: 40,
      width: '100%',
      backgroundColor: '#3498db',
    },
  },
})((props: StyledTabsProps) => <Tabs {...props} TabIndicatorProps={{ children: <span /> }} />);
export const StyledTabsTab = withStyles((theme: Theme) =>
  createStyles({
    root: {
      textTransform: 'none',
      color: '#183f69',
      fontWeight: 400,
      fontSize: theme.typography.pxToRem(15),
      marginRight: theme.spacing(1),
      '&:focus': {
        opacity: 1,
      },
    },
  }),
)((props: TabProps) => <Tab disableRipple {...props} />);
