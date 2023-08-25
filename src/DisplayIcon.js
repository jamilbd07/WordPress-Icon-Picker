import {
	Dashicon
} from '@wordpress/components';

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