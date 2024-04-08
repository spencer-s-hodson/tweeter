export class Follows {
  public followerHandle: string
  public followerName: string
  public followeeHandle: string
  public followeeName: string

  constructor(followerHandle: string, followerName: string, followeeHandle: string, followeeName: string) {
    this.followerHandle = followerHandle;
    this.followerName = followerName;
    this.followeeHandle = followeeHandle;
    this.followeeName = followeeName;
  }

  toString(): string {
    return (
      "Follows {" +
      "followerHandle='" +
      this.followerHandle +
      "'" +
      ", followerName='" +
      this.followeeName +
      "'" +
      ", followeeHandle=" +
      this.followeeHandle +
      "'" +
      ", followeeName=" +
      this.followeeName +
      "}"
    );
  }
}
