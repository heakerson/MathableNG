export class Config {
  public readonly apiKey = 'orgvj9dk93';
  public readonly region = 'us-east-2';
  public readonly stage = 'dev';

  public getUrl(partitionKey: string): string {
    return `https://${this.apiKey}.execute-api.${this.region}.amazonaws.com/${this.stage}/getByCompositeKey/${partitionKey}`;
  }

  public createUrl(): string {
    return `https://${this.apiKey}.execute-api.${this.region}.amazonaws.com/${this.stage}/create`;
  }

  public updateUrl(): string {
    return `https://${this.apiKey}.execute-api.${this.region}.amazonaws.com/${this.stage}/createUpdateItems`;
  }

  public deleteUrl(): string {
    return `https://${this.apiKey}.execute-api.${this.region}.amazonaws.com/${this.stage}/deleteItems`;
  }
}