# Face Detection Models

This directory should contain the face-api.js models.

## Download Models

Download the `tiny_face_detector_model-weights_manifest.json` and `tiny_face_detector_model-shard1` files from:

https://github.com/justadudewhohacks/face-api.js/tree/master/weights

Place them in this `/public/models` directory.

## Quick Setup (using curl):

```bash
cd public/models

# Download tiny face detector model
curl -O https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights/tiny_face_detector_model-weights_manifest.json
curl -O https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights/tiny_face_detector_model-shard1
```

## Alternative: Use CDN

If you prefer not to host models locally, you can modify `/lib/face-detection.ts` to load from CDN:

```typescript
await faceapi.nets.tinyFaceDetector.loadFromUri('https://cdn.jsdelivr.net/npm/@vladmandic/face-api/model/');
```






