#!/bin/bash

# Descant Code
cat index.js config.js services/*.js directives/*.js controllers/*.js > app.js

# Vendor Code
cat vendor/*.js > vendor.min.js
