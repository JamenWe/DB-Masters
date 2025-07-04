import React, {FC, useCallback, useMemo, useState} from 'react';
import {Alert, AlertColor, AlertTitle, Snackbar} from '@mui/material';

export type SeverityType = AlertColor;

export type NotificationWrapperProps = {
    severity?: SeverityType;
    message?: string;
    onClose?: () => void;
};

/**
 * A component for showing a notification
 */
const NotificationWrapper: FC<NotificationWrapperProps> = (props) => {
    const { severity, message, onClose } = props;

    const [open, setOpen] = useState<boolean>(true);

    const handleClose = useCallback((): void => {
        if (onClose) {
            onClose();
        }
        setOpen(false);
    }, [onClose, setOpen]);

    const alertTitle = useMemo(() => {
        if (!severity) {
            return 'Error';
        }
        return severity[0].toString().toUpperCase() + severity.slice(1);
    }, [severity]);

    return (
        <Snackbar
            open={open}
            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            autoHideDuration={3000}
            onClose={() => handleClose()}
        >
            <Alert
                severity={severity ?? 'error'}
                variant='filled'
            >
                <AlertTitle>{alertTitle}</AlertTitle>
                {message ?? ''}
            </Alert>
        </Snackbar>
    );
};

export default NotificationWrapper;