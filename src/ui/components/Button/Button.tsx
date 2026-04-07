import React, {ReactElement} from 'react';
import {Button as MaterialButton} from '@material-ui/core';
import Link from "next/link";
import {isNullOrUndefined} from "~/ui/constants/utils";
import styles from "./Button.module.scss";
import classnames from 'classnames';

interface Props {
    className?: any;
    text: string;
    type?: 'button' | 'submit' | 'reset' | undefined;
    variant?: 'contained' | 'outlined' | 'text' | undefined;
    size?: 'small' | 'medium' | 'large' | undefined;
    color?: 'default' | 'inherit' | 'primary' | 'secondary' | 'info' | 'warning' | 'error' | 'success' | undefined;
    disabled?: boolean;
    onClick?: () => unknown;
    path?: string;
    fullWidth?: boolean;
    startIcon?: any;
  endIcon?: any;
  disableElevation?: boolean;
}

const Button = ({
                    className,
                    text,
                    type = 'button',
                    variant,
                    size,
                    color,
                    disabled = false,
                    onClick,
                    path,
                    fullWidth = false,
                    startIcon,
                    endIcon,
                  disableElevation
                }: Props): ReactElement => {

  const buttonClasses = [
    { [styles.info]: (color === 'info') },
    { [styles.warning]: (color === 'warning') },
    { [styles.error]: (color === 'error') },
    { [styles.success]: (color === 'success') },
    { [styles.contained]: (variant === 'contained') },
    { [styles.outlined]: (variant === 'outlined') },
    { [styles.text]: (variant === 'text') },
  ];

    return (
        <>
            {!isNullOrUndefined(path) && path ?
                <Link href={path}>
                    <MaterialButton
                        className={classnames(className, ...buttonClasses)}
                        type={type}
                        variant={variant}
                        size={size}
                        color={(color === 'default' || color === 'inherit' || color === 'primary' || color === 'secondary') ? color : 'primary'}
                        disabled={disabled}
                        onClick={onClick}
                        fullWidth={fullWidth}
                        startIcon={startIcon}
                        endIcon={endIcon}
                        disableElevation={disableElevation}>
                        {text}
                    </MaterialButton>
                </Link>
                :
                <MaterialButton
                  className={classnames(className, ...buttonClasses)}
                  type={type}
                  variant={variant}
                  size={size}
                  color={(color === 'default' || color === 'inherit' || color === 'primary' || color === 'secondary') ? color : 'primary'}
                  disabled={disabled}
                  onClick={onClick}
                  fullWidth={fullWidth}
                  startIcon={startIcon}
                  endIcon={endIcon}
                  disableElevation={disableElevation}>
                    {text}
                </MaterialButton>
            }
        </>
    );
};

export default Button;
