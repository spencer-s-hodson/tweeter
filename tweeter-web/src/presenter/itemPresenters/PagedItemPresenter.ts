import { AuthToken, User } from "tweeter-shared";
import { Presenter, View } from "../Presenter";

export const PAGE_SIZE = 10;

export interface PagedItemView<T> extends View {
  addItems: (items: T[]) => void;
};

export abstract class PagedItemPresenter<T, U> extends Presenter {
  private _service: U;
  private _hasMoreItems: boolean = true;
  private _lastItem: T | null = null;

  public constructor(view: PagedItemView<T>) {
    super(view);
    this._service = this.createService();
  };

  protected abstract createService(): U;

  public async loadMoreItems(authToken: AuthToken, user: User) {
    this.doFailureReportingOperation(async () => {
      if (this.hasMoreItems) {
        let [newItems, hasMore] = await this.getMoreItems(
          authToken, 
          user,
        );

        this.hasMoreItems = hasMore;
        this.lastItem = newItems[newItems.length - 1];
        this.view.addItems(newItems);
      };
    }, this.getItemDescription())
  };

  protected get service(): U {
    return this._service;
  };

  public get hasMoreItems(): boolean {
    return this._hasMoreItems;
  };

  public get lastItem(): T | null {
    return this._lastItem;
  };

  protected get view(): PagedItemView<T> {
    return super.view as PagedItemView<T>;  // DO NOT DO this.view OR YOU WILL GO INFINITE
  }

  protected set hasMoreItems(value: boolean) {
    this._hasMoreItems = value;
  };

  protected set lastItem(value: T | null) {
    this._lastItem = value;
  };

  protected abstract getMoreItems(authToken: AuthToken, user: User): Promise<[T[], boolean]>;

  protected abstract getItemDescription(): string;
};
