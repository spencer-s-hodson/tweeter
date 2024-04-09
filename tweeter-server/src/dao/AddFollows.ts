import { Factory } from "../../src/factory/Factory";
import { DynamoUserDAO } from "./dynamo/DynamoUserDAO";

const main = async () =>  {
  // // create a users DAO
  // const userDAO: DynamoUserDAO = Factory.factory.getUserDAO();

  // // add user0 - user24 with put command
  // for (let i = 0; i < 25; i++) {
  //   await userDAO.putUser(
  //     `User${i}`, // alias
  //     "a",        // password
  //     "User",     // first name
  //     `${i}`,          // last name
  //     "https://my-tweeter-bucket.s3.us-west-2.amazonaws.com/image/thousand-yard-stare-1000-yard-stare.png"  // image url
  //   );
  // }
}


main();
