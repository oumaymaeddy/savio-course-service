#!/bin/bash
# Publish my work:
#   1. the whole project to my personal repo
#   2. only the shared services to the organization
set -e  # stop at the first error

# Category 2: folder name -> remote of its repo in the organization
SHARED=(
  "savio-course-service:org-course"
  # "savio-document-service:org-document"   # uncomment when it exists
)

echo "→ Personal repo (everything)"
git push origin main

for entry in "${SHARED[@]}"; do
  folder="${entry%%:*}"
  remote="${entry##*:}"
  branch="export-$folder"
  echo "→ Organization: $folder"
  git branch -D "$branch" 2>/dev/null || true   # remove a leftover branch, if any
  git subtree split --prefix="$folder" -b "$branch"
  git push "$remote" "$branch:main"
  git branch -D "$branch"                        # clean up the temporary branch
done