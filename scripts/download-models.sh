#!/bin/bash

# Script to download face-api.js models for YaadKar

echo "Downloading face-api.js models..."

cd public/models

# Download tiny face detector model files
echo "Downloading tiny_face_detector_model..."
curl -L -o tiny_face_detector_model-weights_manifest.json \
  https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights/tiny_face_detector_model-weights_manifest.json

curl -L -o tiny_face_detector_model-shard1 \
  https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights/tiny_face_detector_model-shard1

echo "✅ Models downloaded successfully!"
echo "Files are in: public/models/"






