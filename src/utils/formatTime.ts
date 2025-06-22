export const formatDuration = (ms: number): string => {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes.toString().padStart(2, "0")}:${seconds
    .toString()
    .padStart(2, "0")}`;
};

export const formatDateRelative = (dateString: string | null): string => {
  if (!dateString) {
    return "";
  }

  const date = new Date(dateString);
  const today = new Date();

  // Reset time part for accurate day difference calculation
  today.setHours(0, 0, 0, 0);
  date.setHours(0, 0, 0, 0);

  const diffTime = today.getTime() - date.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    return "היום";
  } else if (diffDays === 1) {
    return "אתמול";
  } else {
    return `לפני ${diffDays} ימים`;
  }
};

export const getDaysSince = (dateString: string | null): number | null => {
  if (!dateString) {
    return null;
  }

  const date = new Date(dateString);
  const today = new Date();

  // Reset time part for accurate day difference calculation
  today.setHours(0, 0, 0, 0);
  date.setHours(0, 0, 0, 0);

  const diffTime = today.getTime() - date.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  return diffDays;
};
