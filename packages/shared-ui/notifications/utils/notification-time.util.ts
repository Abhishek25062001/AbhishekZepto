const RELATIVE_TIME_UNIT_VALUES: Array<{
  unit: Intl.RelativeTimeFormatUnit;
  seconds: number;
}> = [
  { unit: 'year', seconds: 31_536_000 },
  { unit: 'month', seconds: 2_592_000 },
  { unit: 'week', seconds: 604_800 },
  { unit: 'day', seconds: 86_400 },
  { unit: 'hour', seconds: 3_600 },
  { unit: 'minute', seconds: 60 },
];

export const formatNotificationRelativeTime = (
  createdAt: string,
  now = new Date(),
): string => {
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
  const matchingUnit =
    RELATIVE_TIME_UNIT_VALUES.find((unit) => absoluteSeconds >= unit.seconds) ?? {
      unit: 'minute',
      seconds: 60,
    };

  return formatter.format(
    Math.round(diffSeconds / matchingUnit.seconds),
    matchingUnit.unit,
  );
};
