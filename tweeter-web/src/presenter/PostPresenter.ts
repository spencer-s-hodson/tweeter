import { AuthToken, Status, User } from "tweeter-shared";
import Post from "../components/statusItem/Post";
import { StatusService } from "../model/service/StatusService";


export interface PostView {
    displayInfoMessage: (message: string, duration: number, bootstrapClasses?: string) => void;
    clearLastInfoMessage: () => void;
    displayErrorMessage: (message: string, bootstrapClasses?: string) => void;
    setPost: (post: string) => void;  //this might not be correct
}

export class PostPresenter {
    private view: PostView;
    private service: StatusService;

    public constructor(view: PostView) {
        this.view = view;
        this.service = new StatusService();
    }

    public async submitPost(post: string, currentUser: User, authToken: AuthToken) {
        try {
            this.view.displayInfoMessage("Posting status...", 0);

            let status = new Status(post, currentUser!, Date.now());

            await this.service.postStatus(authToken!, status);

            this.view.clearLastInfoMessage();
            this.view.setPost("");
            this.view.displayInfoMessage("Status posted!", 2000);
        } catch (error) {
            this.view.displayErrorMessage(
                `Failed to post the status because of exception: ${error}`
            );
        }
    };

    public clearPost() {
        this.view.setPost("");
    }

    public checkButtonStatus(post: string, authToken: AuthToken | undefined, currentUser: User | undefined): boolean {
        return !post.trim() || !authToken || !currentUser;
    };
};
