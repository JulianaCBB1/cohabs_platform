import { Request, Response, NextFunction } from 'express';
import { ZodObject, ZodError, treeifyError } from 'zod';

export const validate =
  (schema: ZodObject) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      // parse() will throw an error if validation fails
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      return next();
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({
          status: 'fail',
          errors: treeifyError(error),
        });
      }
      return res.status(500).json({ error: 'Internal server error' });
    }
  };
