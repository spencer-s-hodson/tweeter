/**
 * A page of data returned by the database.
 *
 * @param <T> type of data objects being returned.
 */
export class DataPage<T> {
  items: T[]; // page of values returned by the database
  hasMorePages: boolean; // Indicates whether there are more pages of data available to be retrieved

  constructor(items: T[], hasMorePages: boolean) {
    this.items = items;
    this.hasMorePages = hasMorePages;
  }
}