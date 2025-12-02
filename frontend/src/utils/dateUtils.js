// export const getISODateTime = () => {
//   const d = new Date();
//   const tzo = -d.getTimezoneOffset();
//   const pad = (num) => (num < 10 ? "0" : "") + num;
//   return (
//     d.getFullYear() +
//     "-" +
//     pad(d.getMonth() + 1) +
//     "-" +
//     pad(d.getDate()) +
//     " " +
//     pad(d.getHours()) +
//     ":" +
//     pad(d.getMinutes()) +
//     ":" +
//     pad(d.getSeconds())
//   );
// };

export const getISODateTime = () => {
  const d = new Date();
  const tzo = -d.getTimezoneOffset();
  const pad = (num, size = 2) => String(num).padStart(size, "0");

  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(
    d.getHours()
  )}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
};

export const formatToCustomDateTime = (datetimeLocalString) => {
  const date = new Date(datetimeLocalString);
  if (isNaN(date.getTime())) return ""; // Invalid date handling

  const pad = (num) => (num < 10 ? "0" : "") + num;
  // Format: YYYY-MM-DD HH:mm:ss (no timezone offset)
  return (
    date.getFullYear() +
    "-" +
    pad(date.getMonth() + 1) +
    "-" +
    pad(date.getDate()) +
    " " +
    pad(date.getHours()) +
    ":" +
    pad(date.getMinutes()) +
    ":" +
    pad(date.getSeconds())
  );
};
