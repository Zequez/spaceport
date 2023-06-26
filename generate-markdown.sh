#!/bin/bash

# Thank you ChatGPT

# Create a shell script that gets all the files from:

# "./public/assets/sites-thumbnails/*.webp"

# And, if the file does not exist, creates a markdown file at:

# "./src/content/sites/*.md"

# With the following content:

# ```
# ---
# title: <file name>
# url:  http://<file name>.mystrikingly.com
# ---
# ```

# Get all .webp files in the specified directory
files=(./public/assets/sites-thumbnails/*.webp)


# Iterate over each file
for file in "${files[@]}"
do
  # Extract the file name without extension
  filename=$(basename "$file" .webp)

  # Check if the file doesn't exist
  if [ ! -e "./src/content/sites/${filename}.md" ]; then
    # Create the markdown file with the desired content
    echo "---" > "./src/content/sites/${filename}.md"
    echo "title: ${filename}" >> "./src/content/sites/${filename}.md"
    echo "url:  http://${filename}.mystrikingly.com" >> "./src/content/sites/${filename}.md"
    echo "---" >> "./src/content/sites/${filename}.md"
    echo "Markdown file created: ./src/content/sites/${filename}.md"
  fi
done