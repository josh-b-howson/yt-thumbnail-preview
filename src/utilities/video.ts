export const getFormattedViewCount = (viewCount: number) => {
  const formatter = new Intl.NumberFormat('en-US', {
    notation: 'compact',
    compactDisplay: 'short'
  });
  const count = viewCount ? formatter.format(viewCount) : 'No';
  return `${count} views`;
}

export const getTimeSincePublished = (date: Date) => {
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  const timeUnits = [
    { name: 'year', duration: 60 * 60 * 24 * 365 },
    { name: 'month', duration: 60 * 60 * 24 * 30 },
    { name: 'week', duration: 60 * 60 * 24 * 7 },
    { name: 'day', duration: 60 * 60 * 24 },
    { name: 'hour', duration: 60 * 60 },
    { name: 'minute', duration: 60 },
    { name: 'second', duration: 1 }
  ];

  for (const unit of timeUnits) {
    const duration = Math.floor(seconds / unit.duration);
    if (duration > 0) {
      return `${duration} ${unit.name}${duration > 1 ? 's' : ''} ago`;
    }
  }

  return 'just now';
}

// formatDuration(61) -> '1:01'
export const getFormattedVideoDuration = (duration: number) => {
  const minutes = Math.floor(duration / 60);
  const seconds = duration % 60;
  return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
}