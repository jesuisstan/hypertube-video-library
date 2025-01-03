'use client';

import React, { useState } from 'react';

export default function VideoPlayer({ hash }: { hash: string }) {
  const videoSrc = `/api/torrent?hash=${hash}`;

  return (
    <div>
      <video
        src={videoSrc}
        controls
        width="800"
      >
        Your browser does not support the video tag.
      </video>
    </div>
  );
}
