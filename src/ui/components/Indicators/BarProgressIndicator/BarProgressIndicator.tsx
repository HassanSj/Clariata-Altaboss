import React from 'react';
import {createStyles, Theme, withStyles} from '@material-ui/core/styles';
import LinearProgress from '@material-ui/core/LinearProgress';

const BarProgressIndicator = withStyles((theme: Theme) =>
    createStyles({
        root: {
            height: 12,
            borderRadius: 0,
        },
        colorPrimary: {
            backgroundColor: theme.palette.grey[theme.palette.type === 'light' ? 200 : 700],
        },
        bar: {
            borderRadius: 0,
            backgroundColor: '183F69',
        },
    }),
)(LinearProgress);

export default BarProgressIndicator;
