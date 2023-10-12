import {
	Dashicon
} from '@wordpress/components';

import { getIconType, dashiconHandler } from "./helpers";

const DisplayIcon = ({ icon, className = '' }) => {
	if (typeof icon != 'string') {
		return;
	}

	const iconType = getIconType(icon)

	return (
		<>
			{iconType === 'dashicon' && (
				<Dashicon className={className} icon={dashiconHandler(icon)} />
			)}
			{iconType === 'fontawesome' && (
				<i class={`${icon} ${className}`}></i>
			)}
		</>
	);
};

export default DisplayIcon;