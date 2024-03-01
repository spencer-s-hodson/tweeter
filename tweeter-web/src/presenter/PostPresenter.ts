import { AuthToken, Status, User } from "tweeter-shared";
import { StatusService } from "../model/service/StatusService";
import { InfoMessageView, Presenter } from "./Presenter";

export interface PostView extends InfoMessageView {
    setPost: (post: string) => void;
}

export class PostPresenter extends Presenter {
    private service: StatusService;

    public constructor(view: PostView) {
        super(view);
        this.service = new StatusService();
    }

    public async submitPost(event: React.MouseEvent, post: string, currentUser: User, authToken: AuthToken) {
        event.preventDefault();
        this.doFailureReportingOperation(async () => {
            this.view.displayInfoMessage("Posting status...", 0);

            let status = new Status(post, currentUser!, Date.now());

            await this.service.postStatus(authToken!, status);

            this.view.clearLastInfoMessage();
            this.view.setPost("");
            this.view.displayInfoMessage("Status posted!", 2000);
        }, this.getItemDescription())
    };

    public clearPost(event: React.MouseEvent) {
        event.preventDefault();
        this.view.setPost("");
    };

    public checkButtonStatus(post: string, authToken: AuthToken | null, currentUser: User | null): boolean {
        return !post.trim() || !authToken || !currentUser;
    };

    protected getItemDescription(): string {
        return "post to status";
    }

    protected get view(): PostView {
        return super.view as PostView;
    }
};
