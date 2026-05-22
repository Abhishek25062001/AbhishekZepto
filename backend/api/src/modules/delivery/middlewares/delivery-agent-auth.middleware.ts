import type { RequestHandler } from 'express';
import { AppError } from '../../../errors/AppError';
import { ERROR_CODES } from '../../../errors/error-codes';
import { HTTP_STATUS } from '../../../utils/http-status';
import { authenticate } from '../../auth/middlewares/authenticate.middleware';
import { requireRole } from '../../auth/middlewares/require-role.middleware';
import { AUTH_ROLE } from '../../auth/constants/auth-role.constants';
import { DeliveryAgentModel } from '../models/delivery-agent.model';

export const authenticateDeliveryAgent = (): RequestHandler[] => {
  return [
    authenticate(),
    requireRole([AUTH_ROLE.DELIVERY_AGENT]),
    async (req, _res, next) => {
      try {
        if (!req.user) {
          return next(
            new AppError({
              message: 'Authentication is required',
              statusCode: HTTP_STATUS.UNAUTHORIZED,
              errorCode: ERROR_CODES.UNAUTHORIZED,
            }),
          );
        }

        const agent = await DeliveryAgentModel.findOne({
          userId: req.user.userId,
          isDeleted: false,
        });

        if (!agent) {
          return next(
            new AppError({
              message: 'Delivery agent profile not found for this user',
              statusCode: HTTP_STATUS.NOT_FOUND,
              errorCode: ERROR_CODES.DELIVERY_AGENT_NOT_FOUND,
            }),
          );
        }

        req.deliveryAgentId = agent._id.toString();
        req.deliveryAgent = agent;
        return next();
      } catch (error) {
        return next(error);
      }
    },
  ];
};
