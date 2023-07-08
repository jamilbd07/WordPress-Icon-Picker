import {
	PanelRow,
	Dashicon,
	SearchControl,
	TabPanel,
	Popover,
} from '@wordpress/components';
import { useEffect, useState } from '@wordpress/element';

const DisplayIcon = ( { icon } ) => {
	if ( typeof icon != 'object' ) {
		return;
	}

	const iconName = Object.keys( icon )[ 0 ];

	return (
		<>
			{ icon[ iconName ].source &&
				icon[ iconName ].source === 'dashicon' && (
					<Dashicon icon={ iconName } />
				) }
			{ icon[ iconName ].source &&
				icon[ iconName ].source === 'fontawesome' && (
					<i class={ `${ icon[ iconName ].type } ${ iconName }` }></i>
				) }
		</>
	);
};

export default DisplayIcon;