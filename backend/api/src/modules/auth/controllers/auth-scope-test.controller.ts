import { sendSuccessResponse } from '../../../utils/api-response';
import { asyncHandler } from '../../../utils/async-handler';

const buildScopeTestController = ({
  message,
  requestedScopeField,
}: {
  message: string;
  requestedScopeField: 'vendorId' | 'storeId' | 'cityId';
}) =>
  asyncHandler(async (req, res) => {
    const requestedScopeValue = req.query[requestedScopeField];

    return sendSuccessResponse({
      res,
      message,
      data: {
        user: req.user || {},
        requestedScopeValue:
          typeof requestedScopeValue === 'string' ? requestedScopeValue : null,
      },
    });
  });

export const vendorScopeTestController = buildScopeTestController({
  message: 'Vendor scope test route working',
  requestedScopeField: 'vendorId',
});

export const storeScopeTestController = buildScopeTestController({
  message: 'Store scope test route working',
  requestedScopeField: 'storeId',
});

export const cityScopeTestController = buildScopeTestController({
  message: 'City scope test route working',
  requestedScopeField: 'cityId',
});
