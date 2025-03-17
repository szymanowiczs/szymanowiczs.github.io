# Create the output directory if it doesn't exist
mkdir -p gallery_videos_compressed

# Process each MP4 file in the gallery_videos folder
find gallery_videos -type f -name "*.mp4" -exec bash -c '
  input="$1"
  filename=$(basename "$input")
  output="gallery_videos_compressed/${filename%.*}.webm"
  
  # Get original dimensions
  dimensions=$(ffprobe -v error -select_streams v:0 -show_entries stream=width,height -of csv=p=0 "$input")
  width=$(echo $dimensions | cut -d "," -f1)
  height=$(echo $dimensions | cut -d "," -f2)
  
  # Calculate new dimensions (70% of original and make divisible by 2)
  new_width=$(echo "scale=0; $width*0.7/2*2" | bc)
  new_height=$(echo "scale=0; $height*0.7/2*2" | bc)
  
  # Remove the output file if it already exists
  rm -f "$output"
  
  # Convert to WebM with maximum compression settings
  ffmpeg -i "$input" -vf "scale=$new_width:$new_height" \
    -c:v libvpx-vp9 \
    -b:v 0 \
    -crf 37 \
    -deadline good \
    -cpu-used 4 \
    -row-mt 1 \
    -tile-columns 2 \
    -an \
    -auto-alt-ref 1 \
    -lag-in-frames 25 \
    -frame-parallel 1 \
    -pass 1 \
    -f null /dev/null && \
  ffmpeg -i "$input" -vf "scale=$new_width:$new_height" \
    -c:v libvpx-vp9 \
    -b:v 0 \
    -crf 37 \
    -deadline good \
    -cpu-used 4 \
    -row-mt 1 \
    -tile-columns 2 \
    -an \
    -auto-alt-ref 1 \
    -lag-in-frames 25 \
    -frame-parallel 1 \
    -pass 2 \
    -y "$output"
  
  echo "Processed: $filename"
' bash {} \;

echo "All videos have been compressed to gallery_videos_compressed/"