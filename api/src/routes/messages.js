router.post('/score', async (req, res) => {
  const { text, userId } = req.body;
  const ml = await mlClient.predictText(text);
  // save to MongoDB (pseudocode)
  await Message.create({userId, text, mlResult: ml});
  res.json({ ml, saved: true });
});
