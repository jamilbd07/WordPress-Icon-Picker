import {
	PanelRow,
	Dashicon,
	SearchControl,
	TabPanel,
	Popover,
	Tooltip,
} from '@wordpress/components';
import { useCallback, useEffect, useMemo, useRef, useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import type { ComponentProps, KeyboardEvent } from 'react';

type DashiconIcon = ComponentProps<typeof Dashicon>['icon'];

import DisplayIcon, { type DisplayIconProps } from './DisplayIcon';
import { getIconType, useOutsideAlerter, dashiconHandler, type IconType } from './helpers';
import './style.scss';

import { dashIcon } from './icons/dashicon';
import { fontAwesome } from './icons/fontawesome';

const LABEL_TRUNCATE_LENGTH = 16;

type IconSetKey = 'dashIcon' | 'fontAwesome';
type IconSets = Partial<Record<IconSetKey, readonly string[]>>;

export interface IconPickerProps {
	value: string;
	onChange: (value: string) => void;
	title?: string;
	icons?: IconSets | false;
	showHeading?: boolean;
	disableDashicon?: boolean;
	disableFontAwesome?: boolean;
}

const isNonEmptyArray = (value: unknown): value is readonly string[] =>
	Array.isArray(value) && value.length > 0;

const activateOnKey = (handler: () => void) => (event: KeyboardEvent) => {
	if (event.key === 'Enter' || event.key === ' ') {
		event.preventDefault();
		handler();
	}
};

const IconPicker = (props: IconPickerProps) => {
	const {
		title = __('Select Icon', 'wordpress-icon-picker'),
		icons = false,
		value,
		onChange,
		showHeading = true,
		disableDashicon = false,
		disableFontAwesome = false,
	} = props;

	const allIcons = useMemo<IconSets>(() => {
		const base: IconSets =
			icons && typeof icons === 'object' && Object.keys(icons).length > 0
				? { ...icons }
				: { dashIcon, fontAwesome };

		if (disableDashicon) {
			delete base.dashIcon;
		}
		if (disableFontAwesome) {
			delete base.fontAwesome;
		}
		return base;
	}, [icons, disableDashicon, disableFontAwesome]);

	const [selectedIcon, setSelectedIcon] = useState<string>('');
	const [searchInput, setSearchInput] = useState<string>('');
	const [iconType, setIconType] = useState<IconType>('dashicon');
	const [showPopover, setShowPopover] = useState<boolean>(false);
	const [popoverAnchor, setPopoverAnchor] = useState<HTMLElement | null>(null);

	const popoverWrapperRef = useRef<HTMLDivElement>(null);
	const iconWrapperRef = useRef<HTMLDivElement>(null);
	useOutsideAlerter(popoverWrapperRef, iconWrapperRef, setShowPopover);

	useEffect(() => {
		if (iconWrapperRef.current) {
			setPopoverAnchor(iconWrapperRef.current);
		}
	}, []);

	useEffect(() => {
		setSearchInput('');
	}, [iconType]);

	useEffect(() => {
		if (typeof value !== 'string' || !value) {
			return;
		}
		setSelectedIcon(value);
		setIconType(getIconType(value));
	}, [value]);

	const activeIconList = useMemo<readonly string[]>(() => {
		if (iconType === 'fontawesome' && isNonEmptyArray(allIcons.fontAwesome)) {
			return allIcons.fontAwesome;
		}
		if (isNonEmptyArray(allIcons.dashIcon)) {
			return allIcons.dashIcon;
		}
		return [];
	}, [allIcons, iconType]);

	const filteredIcons = useMemo<readonly string[]>(() => {
		if (!searchInput) {
			return activeIconList;
		}
		const needle = searchInput.toLowerCase();
		return activeIconList.filter((item) => item.toLowerCase().includes(needle));
	}, [activeIconList, searchInput]);

	const saveIcon = useCallback(
		(next: string) => {
			onChange(next);
			setShowPopover(false);
		},
		[onChange]
	);

	const togglePopover = useCallback(() => {
		setShowPopover((open) => !open);
	}, []);

	const tabs = useMemo(() => {
		const tabList: Array<{ name: IconType; title: string; className: string }> = [];
		if (!disableDashicon) {
			tabList.push({
				name: 'dashicon',
				title: __('Dashicon', 'wordpress-icon-picker'),
				className: 'wip-icon-tab dashicon',
			});
		}
		if (!disableFontAwesome) {
			tabList.push({
				name: 'fontawesome',
				title: __('FontAwesome', 'wordpress-icon-picker'),
				className: 'wip-icon-tab fontawesome',
			});
		}
		return tabList;
	}, [disableDashicon, disableFontAwesome]);

	return (
		<>
			{showHeading && <PanelRow>{title}</PanelRow>}
			<div
				ref={iconWrapperRef}
				className="wip-iconpicker-trigger"
				role="button"
				tabIndex={0}
				aria-haspopup="dialog"
				aria-expanded={showPopover}
				onClick={togglePopover}
				onKeyDown={activateOnKey(togglePopover)}
			>
				{value ? (
					<DisplayIcon
						aria-label={__('Click to choose Icon', 'wordpress-icon-picker')}
						icon={value}
					/>
				) : (
					<Dashicon
						className="wip-iconpicker-placeholder"
						icon="insert"
					/>
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
						onChange={setSearchInput}
					/>
					<TabPanel
						className="wip-parent-tab-panel"
						activeClass="active-tab"
						onSelect={(selected) => setIconType(selected as IconType)}
						initialTabName={iconType}
						tabs={tabs}
					>
						{() => (
							<div className="wip-icon-area">
								{filteredIcons.map((item) => {
									const isActive = selectedIcon === item;
									const label =
										item.length > LABEL_TRUNCATE_LENGTH
											? `${item.substring(0, LABEL_TRUNCATE_LENGTH)}...`
											: item;
									const select = () => saveIcon(item);
									return (
										<div
											key={item}
											className={`wip-icon-box${isActive ? ' active' : ''}`}
											role="button"
											tabIndex={0}
											aria-pressed={isActive}
											onClick={select}
											onKeyDown={activateOnKey(select)}
										>
											<Tooltip text={item}>
												<div className="wip-icon-content">
													{iconType === 'dashicon' && (
														<Dashicon icon={dashiconHandler(item) as DashiconIcon} />
													)}
													{iconType === 'fontawesome' && (
														<i className={item} />
													)}
													<PanelRow>{label}</PanelRow>
												</div>
											</Tooltip>
										</div>
									);
								})}
							</div>
						)}
					</TabPanel>
				</Popover>
			)}
		</>
	);
};

export { IconPicker, DisplayIcon };
export type { DisplayIconProps, IconType };
