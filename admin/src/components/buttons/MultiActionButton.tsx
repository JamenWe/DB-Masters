import React, { FC, MouseEvent, ReactNode, useCallback, useRef, useState } from 'react';
import { Button, ButtonGroup, ButtonProps, ClickAwayListener, ListItemIcon, ListItemText, MenuItem, MenuList, Paper, Popper } from '@mui/material';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';

export type ActionType = {
    label: string;
    onClick: (event: MouseEvent<HTMLLIElement>) => void;
    icon?: ReactNode;
    disabled?: boolean;
};

export type MultiActionButtonProps =
    & { additionalActions?: ActionType[] }
    & ButtonProps;

/**
 * A customizable button, which has additional actions available via dropdown.
 */
const MultiActionButton: FC<MultiActionButtonProps> = (props) => {
    const { additionalActions = [], disabled, ...buttonProps } = props;

    const [open, setOpen] = useState(false);
    const anchorRef = useRef<HTMLDivElement>(null);

    const handlePrimaryClick = useCallback((event: MouseEvent<HTMLButtonElement>) => {
        setOpen(false);
        buttonProps.onClick?.(event);
    }, [buttonProps]);

    const handleActionClick = useCallback((event: MouseEvent<HTMLLIElement>, index: number) => {
        setOpen(false);
        additionalActions[index].onClick?.(event);
    }, [additionalActions]);

    const handleToggle = useCallback(() => {
        setOpen(prevOpen => !prevOpen);
    }, []);

    const handleClose = useCallback((event: Event) => {
        if (anchorRef.current && anchorRef.current.contains(event.target as HTMLElement)) {
            return;
        }

        setOpen(false);
    }, []);

    return (
        <>
            <ButtonGroup variant="contained" ref={anchorRef} aria-label="split button">
                <Button {...buttonProps} onClick={handlePrimaryClick} disabled={disabled}/>
                {additionalActions.length ? (
                    <Button
                        size="small"
                        aria-controls={open ? 'additional-menu' : undefined}
                        aria-expanded={open ? 'true' : undefined}
                        aria-label="Additional actions"
                        aria-haspopup="menu"
                        onClick={handleToggle}
                        disabled={disabled}
                    >
                        <ArrowDropDownIcon />
                    </Button>
                ) : null}
            </ButtonGroup>

            <Popper
                sx={{ zIndex: 1 }}
                open={open}
                anchorEl={anchorRef.current}
                disablePortal={true}
            >
                <Paper>
                    <ClickAwayListener onClickAway={handleClose}>
                        <MenuList id="additional-menu" autoFocusItem={true}>
                            {additionalActions.map((action, index) => (
                                <MenuItem key={action.label} disabled={action.disabled} onClick={(event) => handleActionClick(event, index)}>
                                    <ListItemIcon>
                                        {action.icon}
                                    </ListItemIcon>
                                    <ListItemText>
                                        {action.label}
                                    </ListItemText>
                                </MenuItem>
                            ))}
                        </MenuList>
                    </ClickAwayListener>
                </Paper>
            </Popper>
        </>
    );
};

export default MultiActionButton;
