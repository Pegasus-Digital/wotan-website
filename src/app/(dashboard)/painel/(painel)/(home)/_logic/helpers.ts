export function getLast12MonthDateRanges(referenceDate: Date = new Date()): Array<{ start: Date; end: Date }> {
    const ranges: Array<{ start: Date; end: Date }> = [];
    const baseYear = referenceDate.getUTCFullYear();
    const baseMonthIndex = referenceDate.getUTCMonth(); // 0-11
  
    for (let offset = 11; offset >= 0; offset -= 1) {
      const start = new Date(Date.UTC(baseYear, baseMonthIndex - offset, 1, 0, 0, 0, 0));
      const end = new Date(Date.UTC(baseYear, baseMonthIndex - offset + 1, 0, 23, 59, 59, 999));
      
      // Only include ranges from 2025 onwards (to avoid empty data)
      if (start.getUTCFullYear() >= 2025) {
        ranges.push({ start, end });
      }
    }
  
    return ranges;
  }