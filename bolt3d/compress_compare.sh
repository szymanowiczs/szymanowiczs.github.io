# Recursively find all MP4 files in the comparison folder and process each one
find comparison/ -type f -name "*.mp4" -exec bash -c '
  input="$1"
  temp_output="${input%.*}_temp.mp4"
  
  # Get original dimensions
  dimensions=$(ffprobe -v error -select_streams v:0 -show_entries stream=width,height -of csv=p=0 "$input")
  width=$(echo $dimensions | cut -d "," -f1)
  height=$(echo $dimensions | cut -d "," -f2)
  
  new_width=$(echo "scale=0; $width*0.9/2*2" | bc)
  new_height=$(echo "scale=0; $height*0.9/2*2" | bc)
  
  echo "Processing: $input"
  
  # Compress with maximum size reduction, no audio, and replace original file
  ffmpeg -i "$input" -vf "scale=$new_width:$new_height" \
    -c:v libx264 \
    -crf 32 \
    -preset medium \
    -tune film \
    -profile:v high \
    -level 4.1 \
    -movflags +faststart \
    -an \
    -y "$temp_output" && mv "$temp_output" "$input"
  
  echo "Completed: $input"
' bash {} \;

echo "All videos in comparison/ folder have been compressed in place."