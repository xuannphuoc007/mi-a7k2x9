/** USDC in circulation, billions of dollars — dated milestones from Circle's announcements,
 * reserve reports and earnings releases and from dated press reports (see references), joined by
 * straight lines. Not a daily series: the line between two dots is drawn, not measured.
 * 2024.5 is derived from Circle's reported +90% year-on-year growth to $61.3B on 30 Jun 2025. */
export const SUPPLY: [number, number][] = [
  [2018.74, 0.0], // 26 Sep 2018 launch
  [2019.95, 0.5], // Dec 2019
  [2020.0, 0.47], // Jan 2020
  [2020.2, 0.6], // mid-Mar 2020
  [2020.3, 0.7], // Apr 2020
  [2020.5, 1.0], // 3 Jul 2020
  [2020.72, 2.79], // Sep 2020
  [2020.94, 3.0], // 9 Dec 2020
  [2021.0, 4.1], // 1 Jan 2021
  [2021.21, 10.7], // 19 Mar 2021
  [2021.36, 15.0], // 11 May 2021
  [2021.5, 25.0], // 1 Jul 2021
  [2021.91, 35.0], // 30 Nov 2021
  [2022.0, 42.5], // 1 Jan 2022
  [2022.16, 52.0], // 28 Feb 2022
  [2022.47, 55.9], // Jun 2022 — all-time high
  [2023.0, 44.5], // 31 Dec 2022
  [2023.18, 43.5], // 9 Mar 2023
  [2023.27, 32.5], // late Mar 2023, after the SVB weekend
  [2023.55, 26.7], // Jul 2023
  [2024.0, 23.8], // 1 Jan 2024 — the low
  [2024.5, 32.3], // 30 Jun 2024 (derived)
  [2025.0, 44.0], // 2 Jan 2025
  [2025.5, 61.3], // 30 Jun 2025
  [2025.61, 65.2], // 10 Aug 2025
  [2025.74, 73.7], // 30 Sep 2025
  [2026.0, 75.3], // 31 Dec 2025
  [2026.39, 76.9], // 21 May 2026
  [2026.74, 73.9], // 30 Sep 2026
  [2026.87, 67.9], // 12 Nov 2026
];
export const SUPPLY_NEWS: [number, number][] = [];
export const DATA_END = 2026.87;
