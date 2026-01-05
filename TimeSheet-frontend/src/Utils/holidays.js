// 📌 src/Utils/holidays.js

// 🎉 Global Holiday List (extend year by year)
export const holidayList = [

  // ----- 2026 Hyderabad Holidays -----
  "2026-01-14", "2026-01-26", "2026-03-20", 
  "2026-05-01",  "2026-06-02",  "2026-08-15",
  "2026-09-14", "2026-10-02", "2026-10-20", "2026-12-25"
];

// 📌 Check if a date is a holiday
export const isHoliday = (date) => {
  if (!date) return false;
  const formatted = new Date(date).toISOString().split("T")[0];
  return holidayList.includes(formatted);
};

// 📌 Check if Sunday
export const isSunday = (date) => {
  if (!date) return false;
  return new Date(date).getDay() === 0;
};

// 📌 Count Valid Days Excluding Sundays & Holidays
export const getValidLeaveDays = (start, end) => {
  let count = 0;
  let current = new Date(start);

  while (current <= new Date(end)) {
    const formatted = current.toISOString().split("T")[0];
    if (!isSunday(formatted) && !holidayList.includes(formatted)) {
      count++;
    }
    current.setDate(current.getDate() + 1);
  }
  return count;
};
