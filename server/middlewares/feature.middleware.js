export const checkFeatureAccess = (featureKey) => {
  return (req, res, next) => {
    const features = req.user?.features;

    if (!features || !features[featureKey]) {
      return res.status(403).json({
        message: `Access to '${featureKey}' feature is disabled for your account.`,
      });
    }

    next();
  };
};
