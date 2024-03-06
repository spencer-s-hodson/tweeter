import { AuthToken, Status, User } from "tweeter-shared";
import { StatusService } from "../model/service/StatusService";
import { InfoMessageView, Presenter } from "./Presenter";

export interface PostStatusView extends InfoMessageView {
    setPost: (post: string) => void;
}

export class PostStatusPresenter extends Presenter {
    private _service: StatusService | null = null;

    public constructor(view: PostStatusView) {
        super(view);
    }

    public async submitPost(post: string, currentUser: User, authToken: AuthToken) {
        this.doFailureReportingOperation(async () => {
            this.view.displayInfoMessage("Posting status...", 0);

            let status = new Status(post, currentUser!, Date.now());

            await this.service.postStatus(authToken!, status);

            this.view.clearLastInfoMessage();
            this.view.setPost("");
            this.view.displayInfoMessage("Status posted!", 2000);
        }, this.getItemDescription())
    };

    public clearPost() {
        this.view.setPost("");
    };

    public checkButtonStatus(post: string, authToken: AuthToken | null, currentUser: User | null): boolean {
        return !post.trim() || !authToken || !currentUser;
    };

    protected getItemDescription(): string {
        return "post to status";
    }

    protected get view(): PostStatusView {
        return super.view as PostStatusView;
    }

    public get service(): StatusService {
        if (this._service == null) {
            this._service = new StatusService();
          }
          return this._service;
    }
};
