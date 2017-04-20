node {
  checkout scm
  withCredentials([usernamePassword(credentialsId: 'docker', passwordVariable: 'DOCKER_PASSWORD', usernameVariable: 'DOCKER_USERNAME')]) {
    sh("docker login -u ${env.DOCKER_USERNAME} -p ${env.DOCKER_PASSWORD} registry.aliyuncs.com")
  }
  sh('docker run --rm -v "$PWD":/workspace -w /workspace node npm install')
  sh('docker run --rm -v "$PWD":/workspace -w /workspace node npm run build:production')
  sh("docker build -t registry.aliyuncs.com/xiaolu-img/xiaolusys-ui:mall-k8s .")
  withCredentials([usernamePassword(credentialsId: 'qiniu', passwordVariable: 'QINIU_SECRETKEY', usernameVariable: 'QINIU_ACCESSKEY')]) {
    def workspace = sh(script: "pwd", returnStdout: true).trim()
    sh("docker run --rm -v ${workspace}:/workspace -w /workspace busybox ./bin/qshell_linux_amd64 account ${env.QINIU_ACCESSKEY} ${env.QINIU_SECRETKEY}")
    sh("docker run --rm -v ${workspace}/dist:/var/www/mall -v ${workspace}:/workspace -w /workspace busybox ./bin/qshell_linux_amd64 qupload 2 config/qupload.conf")
  }
  sh("docker push registry.aliyuncs.com/xiaolu-img/xiaolusys-ui:mall-k8s")
}

