const train =
  'data:image/png;base64,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';

export default train;
