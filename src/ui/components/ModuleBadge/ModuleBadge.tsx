import React, {ReactElement} from 'react';
import {CircularProgress, Icon as ModuleBadge} from '@material-ui/core';
import LogoDiscover from './Images/Clariata5DIcon_Discover.png';
import LogoDream from './Images/Clariata5DIcon_Dream.png';
import LogoDirection from './Images/Clariata5DIcon_Direction.png';
import LogoDeepen from './Images/Clariata5DIcon_Deepen.png';
import LogoDestiny from './Images/Clariata5DIcon_Destiny.png';
import { InterviewType } from '~/ui/constants/interview';
import styles from "~/ui/components/ModuleBadge/ModuleBadge.module.scss";
import classnames from 'classnames';

interface Props {
    moduleName: Number;
    percentage?: number;
    onClick?: () => unknown;
    selected?: Boolean;
    direction?: Boolean;
    title?: Boolean;
}

const Button = ({
                    moduleName,
                    percentage,
                    onClick,
                    selected,
                    direction,
                    title=true,
                }: Props): ReactElement => {
    

    const getImage = () => {
        switch(moduleName)
        {
            case 1:
                return LogoDream;
            case 2:
                return LogoDiscover;
            case 3:
                return LogoDirection;
        }
        return '';
    }

    return (
        <>
            <ModuleBadge>
                <div className={styles.outerdiv} onClick={onClick}>
                    <img className={classnames(styles.compass, {[styles.adjust]: !title})} src={getImage()} height={50} width={50}/>
                    <div className={styles.innerdiv}>
                        <CircularProgress
                            variant = "determinate"
                            value={100 - (typeof percentage != "undefined" ? percentage : 0)}
                            size={50}
                            thickness={5}
                            classes={{
                                colorPrimary: selected ? styles.selected : styles.not_selected,
                                colorSecondary: styles.secondary,
                            }}
                            // className={classnames({[styles.adjust_circle] : !title})}
                        />
                    </div>
                </div>
                {title ?
                direction ? <span className={styles.modulename}>Direction</span> 
                : <span className={styles.modulename}>{moduleName === InterviewType.DREAM ? "Dream" : "Discover"}</span> : null}
            </ModuleBadge>
        </>
    );
};

export default Button;