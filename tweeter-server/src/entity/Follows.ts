export class Follows {
  public follower_handle: string
  public followee_handle: string
  
  constructor(follower_handle: string, followee_handle: string) {
    this.follower_handle = follower_handle;
    this.followee_handle = followee_handle;
  }
}
