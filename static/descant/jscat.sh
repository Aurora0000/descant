#!/bin/bash
echo "Meow!"
# Descant Code
echo "Concatenating Descant code"
cat index.js config.js services/*.js directives/*.js controllers/*.js filters/*.js > app.js

# Vendor Code
echo "Concatenating Vendor code"
cat vendor/*.js > vendor.min.js
