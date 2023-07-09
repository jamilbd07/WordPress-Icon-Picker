import {
	PanelRow,
	Dashicon,
	SearchControl,
	TabPanel,
	Popover,
} from '@wordpress/components';
import { useEffect, useState } from '@wordpress/element';

import { getIconType } from "./helpers";

const DisplayIcon = ({ icon }) => {
	if (typeof icon != 'string') {
		return;
	}

	const iconType = getIconType(icon)

	return (
		<>
			{iconType === 'dashicon' && (
				<Dashicon icon={icon} />
			)}
			{iconType === 'fontawesome' && (
				<i class={icon}></i>
			)}
		</>
	);
};

export default DisplayIcon;