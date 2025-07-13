export const SubscriptionData = (data: any) => {
  const a = {
    name: data.name,
    price: Number(data.price),
    credits: Number(data.credits),
    features: data.features,
    popular: data.popular,
    isActive: data.isActive,
  };

  return a;
};
