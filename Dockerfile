# Use a lightweight web server as base image
FROM nginx:alpine

# Copy all website files to the nginx html directory
COPY . /usr/share/nginx/html/

# Expose port 80
EXPOSE 80

# Command to run when container starts
CMD ["nginx", "-g", "daemon off;"]