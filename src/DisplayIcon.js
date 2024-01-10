import {
	Dashicon
} from '@wordpress/components';

import { getIconType, dashiconHandler } from "./helpers";

const DisplayIcon = (props) => {
	const {
		icon,
		className = ''
	} = props

	if (typeof icon != 'string') {
		return;
	}

	const iconType = getIconType(icon)

	return (
		<>
			{iconType === 'dashicon' && (
				<Dashicon
					{...props}
					className={className}
					icon={dashiconHandler(icon)}
				/>
			)}
			{iconType === 'fontawesome' && (
				<i
					{...props}
					className={`${icon} ${className}`}
				></i>
			)}
		</>
	);
};

export default DisplayIcon;