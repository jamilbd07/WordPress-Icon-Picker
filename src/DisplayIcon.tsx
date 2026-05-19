import { Dashicon } from '@wordpress/components';
import type { ComponentProps, HTMLAttributes } from 'react';

type DashiconIcon = ComponentProps<typeof Dashicon>['icon'];

import { getIconType, dashiconHandler } from './helpers';

export interface DisplayIconProps extends HTMLAttributes<HTMLElement> {
	icon: string;
	className?: string;
}

const DisplayIcon = (props: DisplayIconProps) => {
	const { icon, className = '', ...rest } = props;

	if (typeof icon !== 'string') {
		return null;
	}

	const iconType = getIconType(icon);

	if (iconType === 'dashicon') {
		return (
			<Dashicon
				{...rest}
				className={className}
				icon={dashiconHandler(icon) as DashiconIcon}
			/>
		);
	}

	return <i {...rest} className={`${icon} ${className}`.trim()} />;
};

export default DisplayIcon;
