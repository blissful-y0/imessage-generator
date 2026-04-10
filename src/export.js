export function buildFrameExportOptions(frame, scale = 2) {
  return {
    width: frame.offsetWidth,
    height: frame.offsetHeight,
    scale,
    backgroundColor: null,
    style: {
      transform: 'none',
      transformOrigin: 'center center',
    },
    features: {
      restoreScrollPosition: true,
    },
  };
}

export async function exportFrameAsPng(frame, fileName = 'imessage.png') {
  const { domToBlob, waitUntilLoad } = await import('modern-screenshot');

  if (document.fonts?.ready) {
    await document.fonts.ready;
  }

  await waitUntilLoad(frame);
  await new Promise(resolve => {
    requestAnimationFrame(() => {
      requestAnimationFrame(resolve);
    });
  });

  const blob = await domToBlob(frame, buildFrameExportOptions(frame));
  const url = URL.createObjectURL(blob);

  try {
    const link = document.createElement('a');
    link.download = fileName;
    link.href = url;
    link.click();
  } finally {
    setTimeout(() => URL.revokeObjectURL(url), 0);
  }
}
