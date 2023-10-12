import React from 'react';
import {
	PanelRow,
	Dashicon,
	SearchControl,
	TabPanel,
	Popover,
} from '@wordpress/components';
import { useEffect, useState, useRef } from '@wordpress/element';

import DisplayIcon from './DisplayIcon';
import { getIconType, useOutsideAlerter, dashiconHandler } from "./helpers";
import './style.scss';

//Import Dashicon list
import { dashIcon } from './icons/dashicon';
import { fontAwesome } from './icons/fontawesome';

const IconPicker = (props) => {
	const {
		title = 'Select Icon',
		icons = false,
		value,
		onChange,
		showHeading = true,
		disableDashicon = false,
		disableFontAwesome = false
	} = props;

	const [allIcons, setAllIcons] = useState({})
	const [selectedIcon, setSelectedIcon] = useState('');
	const [searchInput, setSearchInput] = useState('');
	const [iconType, setIconType] = useState('dashicon');
	const [selectedIcons, setSelectedIcons] = useState({});
	const [showPopover, setShowPopover] = useState(false);
	const [popoverAnchor, setPopoverAnchor] = useState('');

	const popoverWrapperRef = useRef(null);
	const iconWrapperRef = useRef(null);
	useOutsideAlerter(popoverWrapperRef, iconWrapperRef, setShowPopover);

	useEffect(() => {
		let _allIcons = {};
		if (icons && typeof icons === 'object' && Object.keys(icons).length > 0) {
			_allIcons = { ...icons }
		}
		else {
			_allIcons = {
				dashIcon: dashIcon,
				fontAwesome: fontAwesome
			}
		}
		//Remove dashicon if set as disabled
		if (disableDashicon) {
			delete _allIcons.dashIcon;
		}
		//Remove fontawesome if set as disabled
		if (disableFontAwesome) {
			delete _allIcons.fontAwesome;
		}
		//set All Icons
		setAllIcons(_allIcons)

		if (typeof _allIcons === 'object' && Object.keys(_allIcons).length > 0 && typeof _allIcons[Object.keys(_allIcons)[0]] === 'object') {
			setSelectedIcons(_allIcons[Object.keys(_allIcons)[0]]);
		}

		//set popover anchor
		const selector = document.querySelector('#wipIcon');
		setPopoverAnchor(selector);
	}, []);

	useEffect(() => {
		//Set search text to empty
		setSearchInput('');
		switch (iconType) {
			case 'fontawesome':
				if (allIcons.fontAwesome && typeof allIcons.fontAwesome === 'object' && allIcons.fontAwesome.length > 0) {
					setSelectedIcons(allIcons.fontAwesome);
				}
				break;
			default:
				if (allIcons.dashIcon && typeof allIcons.dashIcon === 'object' && allIcons.dashIcon.length > 0) {
					setSelectedIcons(allIcons.dashIcon);
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
		const iconList = iconType === 'fontawesome' ? allIcons.fontAwesome : allIcons.dashIcon;
		const filteredIcons = iconList.filter((item) => item.includes(text));

		//set Icons list from search result
		setSelectedIcons(filteredIcons);
	};

	const saveIcon = (value) => {
		//Save attribute value
		onChange(value);

		//Hide popover
		setShowPopover(false);
	};

	const tabs = () => {
		const tabList = []
		if (!disableDashicon) {
			tabList.push({
				name: 'dashicon',
				title: 'Dashicon',
				className: 'wip-icon-tab dashicon',
			})
		}
		if (!disableFontAwesome) {
			tabList.push({
				name: 'fontawesome',
				title: 'FontAwesome',
				className: 'wip-icon-tab fontawesome',
			})
		}
		return tabList
	}

	return (
		<React.Fragment>
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
						tabs={tabs()}
					>
						{(tab) => (
							<div className="wip-icon-area">
								{selectedIcons.map((item) => (
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
												<Dashicon icon={dashiconHandler(item)} />
											)}
											{iconType === 'fontawesome' && (
												<i
													class={item}
												></i>
											)}

											<PanelRow label={item}>
												{item.substring(0, 16) + '...'}
											</PanelRow>
										</div>
									</div>
								))}
							</div>
						)}
					</TabPanel>
				</Popover>
			)}
		</React.Fragment>
	);
};

export { IconPicker, DisplayIcon };