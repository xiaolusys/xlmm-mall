from busybox

run mkdir -p /var/www/mall
add dist /var/www/mall
COPY qiniu/qshell_linux_amd64 /usr/local/bin
workdir /var/www
