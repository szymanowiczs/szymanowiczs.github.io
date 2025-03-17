#!/bin/bash

# Iterate over all .ply files in the current directory
for file in *.ply; do
    # Skip files that already have "compressed" in the name
    if [[ "$file" != *"compressed"* ]]; then
        # Extract filename without extension
        filename="${file%.ply}"
        
        # Call splat-transform
        splat-transform "$file" "${filename}.compressed.ply"
        
        echo "Processed: $file"
    fi
done

echo "Done!"