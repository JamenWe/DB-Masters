import {FC, useMemo} from 'react';
import {Helmet} from 'react-helmet-async';

export type TitleWrapperPropsType = {
    title: string;
};

const KurTitleWrapper: FC<TitleWrapperPropsType> = (props) => {
    const { title } = props;

    const kurTitle = useMemo(() => {
        if (title.trim().length === 0) {
            return `Kraut & Rüben | Admin`;
        }
        return `Kraut & Rüben | Admin | ${title}`;
    }, [title]);

    return (
        <>
            <Helmet>
                <title>{kurTitle}</title>
            </Helmet>
        </>
    );
};

export default KurTitleWrapper;