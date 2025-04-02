import Subscribe from "../models/Subscribe.js";

export const AddSubscriber = async (req, res) => {
  const subscriptionData = req.body;
  try {
    const isSubscribed = await Subscribe.findOne({
      endpoint: subscriptionData.endpoint,
    });

    if (isSubscribed) {
      return res.status(200).json({ message: "Already subscribed" });
    }
    const subscriber = new Subscribe(subscriptionData);
    await subscriber.save();

    res.status(201).json({ message: "Subscription added successfully" });
  } catch (error) {
    console.error("🚀 ~ AddSubscriber ~ error:", error);
    res.status(500).json({ message: "Server error: " + error.message });
  }
};
