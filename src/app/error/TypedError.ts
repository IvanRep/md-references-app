import { ErrorType } from '@/app/types/ErrorType';

export class TypedError extends Error {
  public type: ErrorType;
  constructor(message: string, type: ErrorType) {
    super(message);
    this.type = type;
  }
}
