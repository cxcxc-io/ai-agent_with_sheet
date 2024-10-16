
# 部屬集成式AI應用

下載資料夾到cloud shell editor

```
https://shell.cloud.google.com/cloudshell/editor?cloudshell_git_repo=https%3A%2F%2Fgithub.com%2Fcxcxc-io%2Fai-agent_with_sheet&cloudshell_open_in_editor=gcp_ai_cloud_run%2FREADME.md&cloudshell_workspace=gcp_ai_cloud_run
```

# 建立Artifact registry
```
gcloud artifacts repositories create ai-demo --location=asia-east1 --repository-format=docker
```

# 透過cloud build 打包成image, 並存放在artifact registry
```
gcloud builds submit --tag asia-east1-docker.pkg.dev/$GOOGLE_CLOUD_PROJECT/ai-demo/web-app:0.0.1
```

打開cloud run 介面，進行部屬
