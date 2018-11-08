export function dateFromEpochDate(epochDate) {
  const d = new Date(0);
  d.setUTCSeconds(epochDate);
  return d;
}
