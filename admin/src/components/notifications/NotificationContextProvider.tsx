import { NotificationWrapperProps, SeverityType } from 'src/components/notifications/NotificationWrapper';
import React, { createContext, FC, PropsWithChildren, Reducer, useCallback, useContext, useReducer } from 'react';

type NotificationType = Pick<NotificationWrapperProps, 'severity' | 'message'>;

type NotificationContextType = {
    notification?: NotificationType;
    dispatchShowNotification: (severity: SeverityType, message?: string) => void;
    dispatchClearNotification: () => void;
};

type NotificationContextStateType = Pick<NotificationContextType, 'notification'>;

type NotificationActionType = {
    type: 'SHOW_NOTIFICATION' | 'CLEAR_NOTIFICATION';
    notification?: NotificationType;
};

const initialContext: NotificationContextType = {
    notification: undefined,
    dispatchShowNotification: (): void => {},
    dispatchClearNotification: (): void => {},
};

const NotificationContext = createContext<NotificationContextType>(initialContext);

export const useNotification = (): NotificationContextType => useContext<NotificationContextType>(NotificationContext);

const notificationReducer: Reducer<NotificationContextStateType, NotificationActionType> = (state, action) => {
    switch (action.type) {
        case 'SHOW_NOTIFICATION': {
            return {
                notification: action.notification,
            };
        }
        case 'CLEAR_NOTIFICATION': {
            return {
                notification: undefined,
            };
        }
        default:
            break;
    }

    return state;
};

const NotificationContextProvider: FC<PropsWithChildren> = ({ children }) => {
    const [notificationState, dispatch] = useReducer<Reducer<NotificationContextStateType, NotificationActionType>>(notificationReducer, initialContext);

    const dispatchShowNotification = useCallback((severity: SeverityType, message?: string): void => {
        // Reset the snackbar's auto-hide timer by clearing it first.
        dispatch({ type: 'CLEAR_NOTIFICATION' });
        dispatch({ type: 'SHOW_NOTIFICATION', notification: { severity, message } });
    }, [dispatch]);
    const dispatchClearNotification = useCallback((): void => dispatch({ type: 'CLEAR_NOTIFICATION' }), [dispatch]);

    return (
        <NotificationContext.Provider
            value={{
                notification: notificationState.notification,
                dispatchShowNotification,
                dispatchClearNotification,
            }}
        >
            {children}
        </NotificationContext.Provider>
    );
};

export default NotificationContextProvider;
