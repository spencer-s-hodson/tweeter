// import { UserService } from "../model/service/UserService";

// export interface LogoutView {
//   displayInfoMessage: () => void;
//   clearLastInfoMessage
//   clearUserInfo
//   displayErrorMessage
// }

// export class LogoutPresenter {
//   private view: LogoutView;
//   private service: UserService;

//   public constructor(view: LogoutView) {
//     this.view = view;
//     this.service = new UserService();
//   }


//   public async logOut() {
//     displayInfoMessage("Logging Out...", 0);

//     try {
//       await this.service.logout(authToken!);

//       clearLastInfoMessage();
//       clearUserInfo();
//     } catch (error) {
//       displayErrorMessage(
//         `Failed to log user out because of exception: ${error}`
//       );
//     }
//   };



// }