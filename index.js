import { __ } from '@wordpress/i18n';
import {
	PanelRow,
	Dashicon,
	SearchControl,
	TabPanel,
	Popover,
} from '@wordpress/components';
import { useEffect, useState, useRef } from '@wordpress/element';

import DisplayIcon from './DisplayIcon';
import './style.scss';

//Import Dashicon list
import { dashIcon } from './icons/dashicon';
import { fontAwesome } from './icons/fontawesome';

function useOutsideAlerter(ref, setVal) {
	useEffect(() => {
		/**
		 * Alert if clicked on outside of element
		 */
		function handleClickOutside(event) {
			if (ref.current && !ref.current.contains(event.target)) {
				setVal(false);
			}
		}
		// Bind the event listener
		document.addEventListener('mousedown', handleClickOutside);
		return () => {
			// Unbind the event listener on clean up
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, [ref]);
}

const IconPicker = (props) => {
	const {
		title = 'Select Icon',
		value,
		onChange,
		showHeading = true,
	} = props;

	const [selectedIcon, setSelectedIcon] = useState('');
	const [searchInput, setSearchInput] = useState('');
	const [iconType, setIconType] = useState('dashicon');
	const [icons, setIcons] = useState('');
	const [showPopover, setShowPopover] = useState(false);
	const [popoverAnchor, setPopoverAnchor] = useState('');

	const popoverWrapperRef = useRef(null);
	useOutsideAlerter(popoverWrapperRef, setShowPopover);

	useEffect(() => {
		if (typeof dashIcon === 'object' && Object.keys(dashIcon).length > 0) {
			setIcons(dashIcon);
		}

		//set popover anchor
		const selector = document.querySelector('#zoloIcon');
		setPopoverAnchor(selector);

		// let icons = {}
		// Object.keys(fontawesome).map((item, index) => {
		//     const splitText = fontawesome[item].split(" ");
		//     icons = {
		//         ...icons,
		//         [splitText[1]]: {
		//             name: splitText[1].replace(/-/g, " "),
		//             source: 'fontawesome',
		//             type: splitText[0]
		//         }
		//     }
		// })
		// console.log("Icons:", icons)
	}, []);

	useEffect(() => {
		//Set search text to empty
		setSearchInput('');

		switch (iconType) {
			case 'fontawesome':
				if (
					typeof fontAwesome === 'object' &&
					Object.keys(fontAwesome).length > 0
				) {
					setIcons(fontAwesome);
				}
				break;
			default:
				if (
					typeof dashIcon === 'object' &&
					Object.keys(dashIcon).length > 0
				) {
					setIcons(dashIcon);
				}
		}
	}, [iconType]);

	useEffect(() => {
		if (!value || typeof value != 'object') {
			return;
		}
		const key = Object.keys(value)[0];
		setSelectedIcon(key);

		if (value[key].source) {
			setIconType(value[key].source);
		}
	}, [value]);

	const searchIcon = (text) => {
		setSearchInput(text);

		//Filter search result
		const iconList = iconType === 'fontawesome' ? fontAwesome : dashIcon;
		const filteredIcons = Object.keys(iconList)
			.filter((item) => item.includes(text))
			.reduce((obj, key) => {
				return Object.assign(obj, {
					[key]: iconList[key],
				});
			}, {});

		//set Icons list from search result
		setIcons(filteredIcons);
	};

	const saveIcon = (value) => {
		//Save attribute value
		onChange(value);

		//Hide popover
		setShowPopover(false);
	};

	return (
		<>
			{showHeading && <PanelRow>{title}</PanelRow>}

			<div id={'wipIcon'} onClick={() => setShowPopover(true)}>
				{value && (
					<>
						<DisplayIcon
							label="Click to choose Icon"
							icon={value}
						/>
					</>
				)}
				{!value && (
					<>
						<Dashicon
							className="wip-iconpicker-placeholder"
							icon={'insert'}
						/>
					</>
				)}
			</div>
			{showPopover && (
				<Popover
					ref={popoverWrapperRef}
					anchor={popoverAnchor}
					className="wip-iconpicker-popup"
				>
					<SearchControl
						value={searchInput}
						onChange={(text) => searchIcon(text)}
					/>
					<TabPanel
						className="wip-parent-tab-panel"
						activeClass="active-tab"
						onSelect={(selected) => setIconType(selected)}
						initialTabName={iconType}
						tabs={[
							{
								name: 'dashicon',
								title: 'Dashicon',
								className: 'wip-icon-tab dashicon',
							},
							{
								name: 'fontawesome',
								title: 'FontAwesome',
								className: 'wip-icon-tab fontawesome',
							},
						]}
					>
						{(tab) => (
							<div className="wip-icon-area">
								{Object.keys(icons).map((item, index) => (
									<div
										className={`wip-icon-box${
											selectedIcon === item
												? ' active'
												: ''
										}`}
										onClick={() =>
											saveIcon({ [item]: icons[item] })
										}
									>
										<div className="wip-icon-content">
											{iconType === 'dashicon' && (
												<Dashicon icon={item} />
											)}
											{iconType === 'fontawesome' && (
												<i
													class={`${icons[item].type} ${item}`}
												></i>
											)}

											<PanelRow>
												{icons[item].name}
											</PanelRow>
										</div>
									</div>
								))}
							</div>
						)}
					</TabPanel>
				</Popover>
			)}
		</>
	);
};

export default IconPicker;
