"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatNotificationRelativeTime = void 0;
const RELATIVE_TIME_UNIT_VALUES = [
    { unit: 'year', seconds: 31_536_000 },
    { unit: 'month', seconds: 2_592_000 },
    { unit: 'week', seconds: 604_800 },
    { unit: 'day', seconds: 86_400 },
    { unit: 'hour', seconds: 3_600 },
    { unit: 'minute', seconds: 60 },
];
const formatNotificationRelativeTime = (createdAt, now = new Date()) => {
    const createdDate = new Date(createdAt);
    if (Number.isNaN(createdDate.getTime())) {
        return '';
    }
    const diffSeconds = Math.round((createdDate.getTime() - now.getTime()) / 1000);
    const absoluteSeconds = Math.abs(diffSeconds);
    if (absoluteSeconds < 60) {
        return 'just now';
    }
    const formatter = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });
    const matchingUnit = RELATIVE_TIME_UNIT_VALUES.find((unit) => absoluteSeconds >= unit.seconds) ?? {
        unit: 'minute',
        seconds: 60,
    };
    return formatter.format(Math.round(diffSeconds / matchingUnit.seconds), matchingUnit.unit);
};
exports.formatNotificationRelativeTime = formatNotificationRelativeTime;
