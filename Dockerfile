from busybox

run mkdir -p /var/www/mall
add dist /var/www/mall
copy qiniu/qshell_linux_amd64 /usr/sbin/qshell
workdir /var/www
