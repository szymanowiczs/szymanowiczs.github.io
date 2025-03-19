#!/bin/bash

find . -type f -name "*.mp4" -exec bash -c '
  input="$1"
  filename=$(basename "$input")
  dirname=$(dirname "$input")
  temp_output="${dirname}/temp_${filename}"
  
  # Get original dimensions
  dimensions=$(ffprobe -v error -select_streams v:0 -show_entries stream=width,height -of csv=p=0 "$input")
  width=$(echo $dimensions | cut -d "," -f1)
  height=$(echo $dimensions | cut -d "," -f2)
  
  # Calculate new dimensions (70% of original and make divisible by 2)
  new_width=$(echo "scale=0; $width*0.7/2*2" | bc)
  new_height=$(echo "scale=0; $height*0.7/2*2" | bc)
  
  # Convert to MP4 with high compression settings using H.264
  ffmpeg -i "$input" -vf "scale=$new_width:$new_height" \
    -c:v libx264 \
    -preset slow \
    -crf 28 \
    -profile:v baseline \
    -level 3.0 \
    -movflags +faststart \
    -pix_fmt yuv420p \
    -an \
    -y "$temp_output"
    
  # Check if ffmpeg was successful
  if [ $? -eq 0 ]; then
    # Replace original with compressed version
    mv "$temp_output" "$input"
    echo "Processed and replaced: $filename"
  else
    echo "Error processing: $filename"
    # Clean up temp file if it exists
    rm -f "$temp_output"
  fi
' bash {} \;

echo "All videos have been compressed"