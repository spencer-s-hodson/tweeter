import { AuthToken, Status, User } from "tweeter-shared";
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

    public async submitPost(event: React.MouseEvent, post: string, currentUser: User, authToken: AuthToken) {
        event.preventDefault();
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
        };
    };

    public clearPost(event: React.MouseEvent) {    
        event.preventDefault();
        this.view.setPost("");
    };

    public checkButtonStatus(post: string, authToken: AuthToken | null, currentUser: User | null): boolean {
        return !post.trim() || !authToken || !currentUser;
    };
};
