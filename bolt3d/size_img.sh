#!/bin/bash

# Directory to process - change this to your target directory
TARGET_DIR="./gallery_videos_compressed"

# Find all PNG files and process them
find "$TARGET_DIR" -type f -name "*.png" | while read -r file; do
    echo "Processing: $file"
    
    # Create a temporary filename
    temp_file="${file}.temp.png"
    
    # Use sips (built-in on macOS) to resize to 50%
    original_size=$(sips -g pixelWidth -g pixelHeight "$file" | tail -n 2)
    width=$(echo "$original_size" | head -n 1 | awk '{print $2}')
    height=$(echo "$original_size" | tail -n 1 | awk '{print $2}')
    
    # Calculate new dimensions (50% of original)
    new_width=$((width / 2))
    new_height=$((height / 2))
    
    # Resize the image and save to temp file
    sips --resampleWidth $new_width --resampleHeight $new_height "$file" --out "$temp_file"
    
    # Replace original with resized version
    mv "$temp_file" "$file"
    
    echo "Resized: $file to ${new_width}x${new_height}"
done

echo "All PNG files have been resized to 50%"