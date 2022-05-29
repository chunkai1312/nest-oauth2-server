export class MissingModelError extends Error {
  constructor() {
    super('`OAuth2ServerModel` not provided');
    this.name = MissingModelError.name;
  }
}
