cat index.js config.js services.js directives/*.js controllers/*.js > app.js
ngmin app.js app.annotated.js
ccjs app.annotated.js > app.min.js
