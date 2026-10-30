import type { RequestHandler } from 'express';

export function asyncHandler(requestHandler: RequestHandler): RequestHandler {
  return function (req, res, next) {
    Promise.resolve(requestHandler(req, res, next)).catch(next);
  };
}
