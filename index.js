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
import { getIconType, useOutsideAlerter } from "./helpers";
import './style.scss';

//Import Dashicon list
import { dashIcon } from './icons/dashicon';
import { fontAwesome } from './icons/fontawesome';

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
	const iconWrapperRef = useRef(null);
	useOutsideAlerter(popoverWrapperRef, iconWrapperRef, setShowPopover);

	useEffect(() => {
		if (typeof dashIcon === 'object' && dashIcon.length > 0) {
			setIcons(dashIcon);
		}

		//set popover anchor
		const selector = document.querySelector('#zoloIcon');
		setPopoverAnchor(selector);
	}, []);

	useEffect(() => {
		//Set search text to empty
		setSearchInput('');

		switch (iconType) {
			case 'fontawesome':
				if (typeof fontAwesome === 'object' && fontAwesome.length > 0) {
					setIcons(fontAwesome);
				}
				break;
			default:
				if (typeof dashIcon === 'object' && dashIcon.length > 0) {
					setIcons(dashIcon);
				}
		}
	}, [iconType]);

	/**
	 * UseEffect when attribute value is changed
	 */
	useEffect(() => {
		if (!value || typeof value != 'string') {
			return;
		}

		setSelectedIcon(value);
		setIconType(getIconType(value));

	}, [value]);

	/**
	 * search icon function
	 * @param {*} text 
	 */
	const searchIcon = (text) => {
		setSearchInput(text);

		//Filter search result
		const iconList = iconType === 'fontawesome' ? fontAwesome : dashIcon;
		const filteredIcons = iconList.filter((item) => item.includes(text));

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
			<div
				ref={iconWrapperRef}
				id={'wipIcon'}
				onClick={() => setShowPopover(!showPopover)}
			>
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
								{icons.map((item) => (
									<div
										className={`wip-icon-box${selectedIcon === item
											? ' active'
											: ''
											}`}
										onClick={() =>
											saveIcon(item)
										}
									>
										<div className="wip-icon-content">
											{iconType === 'dashicon' && (
												<Dashicon icon={item} />
											)}
											{iconType === 'fontawesome' && (
												<i
													class={item}
												></i>
											)}

											<PanelRow label={item}>
												{item.substring(0,16) + '...'}
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

export { IconPicker, DisplayIcon };
