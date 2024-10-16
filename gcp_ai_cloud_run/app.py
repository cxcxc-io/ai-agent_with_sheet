from flask import Flask, render_template_string, request, jsonify, abort
from google.cloud import firestore, storage
from linebot import LineBotApi, WebhookHandler
from linebot.exceptions import InvalidSignatureError
from linebot.models import MessageEvent, TextMessage, TextSendMessage, ImageMessage
import requests
import datetime
import json
import os

app = Flask(__name__, static_folder='static')

@app.route('/register', methods=['GET', 'POST'])
def register():
    # GET 請求時顯示表單
    if request.method == 'GET':
        print("Handling GET request for /register")
        form_html = '''
        <form method="POST">
            <label for="line_channel_id">Line Channel ID:</label><br>
            <input type="text" id="line_channel_id" name="line_channel_id"><br><br>
            <label for="line_channel_secret">Line Channel Secret:</label><br>
            <input type="text" id="line_channel_secret" name="line_channel_secret"><br><br>
            <label for="line_channel_access_token">Line Channel Access Token:</label><br>
            <input type="text" id="line_channel_access_token" name="line_channel_access_token"><br><br>
            <label for="coze_bot_id">Coze Bot ID:</label><br>
            <input type="text" id="coze_bot_id" name="coze_bot_id"><br><br>
            <label for="coze_api_key">Coze API Key:</label><br>
            <input type="text" id="coze_api_key" name="coze_api_key"><br><br>
            <label for="cloud_storage_bucket_name">Cloud Storage Bucket Name:</label><br>
            <input type="text" id="cloud_storage_bucket_name" name="cloud_storage_bucket_name"><br><br>
            <input type="submit" value="Submit">
        </form>
        '''
        return render_template_string(form_html)

    # POST 請求時處理表單資料並生成 URL
    elif request.method == 'POST':
        print("Handling POST request for /register")
        line_channel_id = request.form.get('line_channel_id')
        line_channel_secret = request.form.get('line_channel_secret')
        line_channel_access_token = request.form.get('line_channel_access_token')
        coze_bot_id = request.form.get('coze_bot_id')
        coze_api_key = request.form.get('coze_api_key')
        cloud_storage_bucket_name = request.form.get('cloud_storage_bucket_name')

        print(f"Received data: line_channel_id={line_channel_id}, line_channel_secret={line_channel_secret}, line_channel_access_token={line_channel_access_token}, coze_bot_id={coze_bot_id}, coze_api_key={coze_api_key}, cloud_storage_bucket_name={cloud_storage_bucket_name}")

        # 構建完整的 URL
        domain = request.host_url  # 獲取當前域名
        complete_url = f"{domain}api/{line_channel_id}"
        print(f"Constructed complete URL: {complete_url}")

        # 將資料寫入 Firestore 的 bot_info collection
        db = firestore.Client()
        doc_ref = db.collection('bot_info').document(line_channel_id)
        doc_ref.set({
            'line_channel_id': line_channel_id,
            'line_channel_secret': line_channel_secret,
            'line_channel_access_token': line_channel_access_token,
            'coze_bot_id': coze_bot_id,
            'coze_api_key': coze_api_key,
            'cloud_storage_bucket_name': cloud_storage_bucket_name,
            'complete_url': complete_url
        })
        print("Data successfully written to Firestore")

        response_html = f'''
        <p>Line Channel ID: {line_channel_id}</p>
        <p>Line Channel Secret: {line_channel_secret}</p>
        <p>Line Channel Access Token: {line_channel_access_token}</p>
        <p>Coze Bot ID: {coze_bot_id}</p>
        <p>Coze API Key: {coze_api_key}</p>
        <p>Cloud Storage Bucket Name: {cloud_storage_bucket_name}</p>
        <p>完整網址: <a href="{complete_url}">{complete_url}</a></p>
        '''
        return render_template_string(response_html)

@app.route('/api/<line_channel_id>', methods=['POST'])
def handle_line_api(line_channel_id):
    print(f"Handling request for /api with line_channel_id: {line_channel_id}")

    # 從 Firestore 的 bot_info collection 中讀取資料
    db = firestore.Client()
    doc_ref = db.collection('bot_info').document(line_channel_id)
    doc = doc_ref.get()

    if doc.exists:
        print(f"Document found for line_channel_id: {line_channel_id}")
        bot_info = doc.to_dict()
        line_channel_secret = bot_info['line_channel_secret']
        line_channel_access_token = bot_info['line_channel_access_token']
        coze_bot_id = bot_info['coze_bot_id']
        coze_api_key = bot_info['coze_api_key']
        cloud_storage_bucket_name = bot_info['cloud_storage_bucket_name']

        # 驗證請求並處理事件
        signature = request.headers['X-Line-Signature']
        body = request.get_data(as_text=True)
        print(f"Received POST request with body: {body} and signature: {signature}")

        # 設置 Line bot 配置
        line_bot_api = LineBotApi(line_channel_access_token)
        handler = WebhookHandler(line_channel_secret)

        @handler.add(MessageEvent, message=TextMessage)
        def handle_message(event):
            print(f"準備進入處理文字消息")
            user_id = event.source.user_id
            user_message = event.message.text
            print(f"Handling message event from user_id: {user_id} with message: {user_message}")
            reply_text = f"收到消息: {user_message}"

            # 向 Coze API 發送請求
            coze_url = "https://api.coze.com/v3/chat"
            headers = {
                "Authorization": f"Bearer {coze_api_key}",
                "Content-Type": "application/json"
            }
            body = {
                "bot_id": coze_bot_id,
                "user_id": user_id,
                "stream": True,
                "auto_save_history": True,
                "additional_messages": [
                    {
                        "role": "user",
                        "content": user_message,
                        "content_type": "text"
                    }
                ]
            }
            print(f"Sending request to Coze API with URL: {coze_url} and body: {body}")
            coze_response = requests.post(coze_url, headers=headers, json=body, stream=True)

            if coze_response.status_code == 200:
                reply_text = ""
                for line in coze_response.iter_lines():
                    if line:
                        decoded_line = line.decode('utf-8')
                        if decoded_line.startswith("data:"):
                            try:
                                content = decoded_line[5:]
                                response_data = json.loads(content)
                                if "content" in response_data:
                                    # 過濾掉非訊息類型的內容
                                    if not response_data["content"].startswith("{"):
                                        reply_text += response_data["content"]
                            except json.JSONDecodeError:
                                print(f"Failed to decode JSON: {decoded_line}")
                print(f"Received response from Coze API: {reply_text}")
            else:
                reply_text = "無法從 Coze API 獲取回應"
                print(f"Failed to get response from Coze API, status code: {coze_response.status_code}")

            # 回覆用戶的消息
            line_bot_api.reply_message(
                event.reply_token,
                TextSendMessage(text=reply_text)
            )
            print(f"Replied to user with text: {reply_text}")

        @handler.add(MessageEvent, message=ImageMessage)
        def handle_image(event):
            print(f"準備進入處理圖片消息")
            user_id = event.source.user_id
            message_id = event.message.id
            timestamp = datetime.datetime.now().strftime('%Y%m%d%H%M%S')
            file_name = f"static/{user_id}_{message_id}_{timestamp}.jpg"

            # 從 Line 下載圖片
            message_content = line_bot_api.get_message_content(message_id)
            os.makedirs(os.path.dirname(file_name), exist_ok=True)
            with open(file_name, 'wb') as f:
                for chunk in message_content.iter_content():
                    f.write(chunk)
            print(f"Image saved locally as {file_name}")

            # 上傳到 Cloud Storage
            storage_client = storage.Client()
            print(cloud_storage_bucket_name)
            bucket = storage_client.get_bucket(cloud_storage_bucket_name)
            blob = bucket.blob(f"{user_id}/{message_id}_{timestamp}.jpg")
            blob.upload_from_filename(file_name)
            print(f"Image uploaded to Cloud Storage bucket {cloud_storage_bucket_name} with filename {file_name}")

            # 設置 Flask 靜態 URL
            public_url = f"{request.host_url}static/{user_id}_{message_id}_{timestamp}.jpg"
            print(f"Public URL for image: {public_url}")

            # 向 Coze API 發送包含圖片的請求
            coze_url = "https://api.coze.com/v3/chat"
            headers = {
                "Authorization": f"Bearer {coze_api_key}",
                "Content-Type": "application/json"
            }
            body = {
                "bot_id": coze_bot_id,
                "user_id": user_id,
                "stream": True,
                "auto_save_history": True,
                "additional_messages": [
                    {
                        "role": "user",
                        "content": json.dumps([
                            {"type": "image", "file_url": public_url},
                            {"type": "text", "text": "what's in this picture"}
                        ]),
                        "content_type": "object_string"
                    }
                ]
            }
            print(f"Sending request to Coze API with URL: {coze_url} and body: {body}")
            coze_response = requests.post(coze_url, headers=headers, json=body, stream=True)

            if coze_response.status_code == 200:
                reply_text = ""
                for line in coze_response.iter_lines():
                    if line:
                        decoded_line = line.decode('utf-8')
                        if decoded_line.startswith("data:"):
                            try:
                                content = decoded_line[5:]
                                response_data = json.loads(content)
                                if "content" in response_data:
                                    # 過濾掉非訊息類型的內容
                                    if not response_data["content"].startswith("{"):
                                        reply_text += response_data["content"]
                            except json.JSONDecodeError:
                                print(f"Failed to decode JSON: {decoded_line}")
                print(f"Received response from Coze API: {reply_text}")
            else:
                reply_text = "無法從 Coze API 獲取回應"
                print(f"Failed to get response from Coze API, status code: {coze_response.status_code}")

            # 刪除本地檔案
            # os.remove(file_name)
            # print(f"Local file {file_name} deleted after upload")

            # 回覆用戶的消息
            line_bot_api.reply_message(
                event.reply_token,
                TextSendMessage(text=reply_text)
            )
            print(f"Replied to user with text: {reply_text}")

        try:
            handler.handle(body, signature)
        except InvalidSignatureError:
            print("Invalid signature error")
            return 'Invalid signature. Please check your channel secret and access token.', 400

        return 'OK'
    else:
        print(f"No document found for line_channel_id: {line_channel_id}")
        return 'Bot info not found', 404

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8080)
