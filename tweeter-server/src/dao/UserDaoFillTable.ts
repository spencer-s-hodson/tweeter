import { BatchWriteCommand, BatchWriteCommandInput, BatchWriteCommandOutput, UpdateCommand } from "@aws-sdk/lib-dynamodb";
import { ddbDocClient } from "./ClientDynamo";
// import { getServerValue } from "../util/ServerVariables";
import { SHA256 } from "crypto-js";
import { execSync } from "child_process";
import { User } from "tweeter-shared";

export class UserDaoFillTable {
  private table_name = "users";
  private user_alias = "user_alias";
  private user_first_name = "user_first_name";
  private user_last_name = "user_last_name";
  private user_password = "user_password";
  private user_image = "user_image";
  private following = "following";
  private followers = "followers";   

  async createUsers(userList: User[], password: string){
    if(userList.length == 0){
      console.log('zero followers to batch write');
      return;
    }
    else{
      const hashedPassword = SHA256(password).toString();
      const params = {
        RequestItems: {
          [this.table_name]: this.createPutUserRequestItems(userList, hashedPassword)
        }
      }
      await ddbDocClient.send(new BatchWriteCommand(params))
      .then(async (resp) => {
        await this.putUnprocessedItems(resp, params);
      })
      .catch(err => {
        throw new Error('Error while batchwriting users with params: '+ params + ": \n" + err);
    });;
    }
  }
  private createPutUserRequestItems(userList: User[], hashedPassword: string){
      return userList.map(user => this.createPutUserRequest(user, hashedPassword));
  }
  private createPutUserRequest(user: User, hashedPassword: string){
      let item = {
          [this.user_alias]: user.alias,
          [this.user_first_name]: user.firstName,
          [this.user_last_name]: user.lastName,
          [this.user_password]: hashedPassword,
          [this.user_image]: user.imageUrl,
          [this.followers]: 0,
          [this.following]: 1
      }
      let request = {
          PutRequest: {
              Item: item
          }
      }
      return request;
  }

  private async putUnprocessedItems(resp: BatchWriteCommandOutput, params: BatchWriteCommandInput) {
    if(resp.UnprocessedItems != undefined){
        let sec = 0.01;
        while(Object.keys(resp.UnprocessedItems).length > 0) {
            console.log(Object.keys(resp.UnprocessedItems.feed).length + ' unprocessed items');
            //The ts-ignore with an @ in front must be as a comment in order to ignore an error for the next line for compiling. 
            // @ts-ignore 
            params.RequestItems = resp.UnprocessedItems;
            execSync('sleep ' + sec);
            if(sec < 1) sec += 0.1;
            await ddbDocClient.send(new BatchWriteCommand(params));
            if(resp.UnprocessedItems == undefined){
                break;
            }
        }
    }
  }
  increaseFollowersCount(alias: string, count: number) {
    const params = {
      TableName: this.table_name,
      Key: { [this.user_alias]: alias},
      ExpressionAttributeValues: { ":inc": count },
      UpdateExpression: "SET " + this.followers + " = " + this.following + ' + :inc'
    };
    ddbDocClient.send(new UpdateCommand(params)).then(data => {
        return true});
  }
}