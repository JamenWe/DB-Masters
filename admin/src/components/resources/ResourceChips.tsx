import * as React from 'react';
import { FC, useMemo } from 'react';
import { BasicResourceType, byMarketId } from 'src/api/resources';
import { styled } from '@mui/material/styles';
import Tooltip, { TooltipProps, tooltipClasses } from '@mui/material/Tooltip';
import { Chip, Stack } from '@mui/material';

export type ResourceSelectorProps = {
    resources: BasicResourceType[];
    maxItems?: number;
    size?: 'small' | 'medium';
};

/**
 * A component to display a route's resources in the overview table.
 */
const ResourceChips: FC<ResourceSelectorProps> = (props) => {
    const { resources, maxItems, size } = props;

    const sortedResources: BasicResourceType[] = useMemo(() => {
        return resources.sort(byMarketId);
    }, [resources]);

    const previewCount = (maxItems !== undefined && maxItems > 0 && maxItems < sortedResources.length)
        ? maxItems
        : sortedResources.length;

    const previewResources = sortedResources.slice(0, previewCount);
    const furtherResources = sortedResources.slice(previewCount);

    const NoMaxWidthTooltip = styled(({ className, ...innerProps }: TooltipProps) => (
        <Tooltip {...innerProps} classes={{ popper: className }} />
    ))({
        [`& .${tooltipClasses.tooltip}`]: {
            maxWidth: 'none',
            padding: '10px',
            backgroundColor: '#ebebeb',
        },
    });

    return (
        <Stack direction="row" spacing={1}>
            {previewResources.map(resource => (
                <Chip
                    key={`resource-${resource.id}`}
                    clickable={false}
                    label={resource.marketId.toUpperCase()}
                    color={'primary'}
                    size={size}
                />
            ))}
            {furtherResources.length > 0 ? (
                <NoMaxWidthTooltip
                    key="further-tooltip"
                    title={<ResourceChips resources={furtherResources} size={size}/>}
                >
                    <Chip
                        clickable={false}
                        label={`+ ${resources.length - previewResources.length}`}
                        color={'default'}
                        size={size}
                    />
                </NoMaxWidthTooltip>
            ) : null}
        </Stack>
    );
};

export default ResourceChips;
