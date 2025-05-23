# 雲育鏈 AI-Agent 與 Sheet with AI - Google Apps Script 工具集

## 專案簡介

此專案包含一系列為[雲育鏈職場AI軟體暨雲端應用課程](https://www.cxcxc.io/agentic-ai-course/)設計的Google Apps Script範例程式碼。這些程式碼旨在提升課程參與者的工作效率，涵蓋如何自動化Google Sheets的數據操作、整合Google Gemini API進行AI問答與分類，以及如何生成並計算文本向量相似度等功能。

## 功能列表

- **HTTP GET/POST 數據處理**：自動化Google Sheets中的數據查詢、插入與更新。
- **AI 問答與分類**：透過Google Gemini API進行文本問答生成及文本分類操作。
- **文本向量生成與相似度計算**：將文本轉換為向量表示，並計算其相似度。
- **圖片問答解析：提供圖片URL，將圖片轉換為Base64後，透過Gemini API進行問答。
- **網頁內容抓取與問答生成：自動抓取指定網頁內容，並進行問答生成，增強答案的準確性。
- **PDF文件生成：基於Google Docs範本自動生成PDF文件，並可指定範本參數進行動態替換。


## 應用場景

這些Google Apps Script程式碼可在以下情境中應用：

1. **自動化數據處理**：在企業報告生成過程中，減少手動操作的錯誤與耗時。
2. **AI 驅動的文本分類與分析**：快速分類客戶反饋，提取重要資訊並及時做出決策。
3. **向量相似度計算**：在客服系統中快速找到相似問題的解答，提升客服效率。
4. **業務流程自動化**：自動處理和分類來自各部門的數據，提升生產力。

如需課程包班合作，可加入Line官方號進行：[https://lin.ee/nlPnBYS](https://lin.ee/nlPnBYS)

## 安裝與使用

1. **複製專案**：將此專案克隆至您的Google Apps Script專案中。
2. **配置API Key**：在專案設定中加入Google Gemini API的密鑰。
3. **運行範例**：使用範例函數進行測試，確認API整合與功能正常運作。

## 授權條款

本專案依照MIT License開源，歡迎自由使用、修改與分發。如需進一步合作或課程包班合作，請參考[雲育鏈官網](https://www.cxcxc.io/)。

## 聯繫我們

如有任何問題或建議，歡迎通過[雲育鏈Line官方號](https://lin.ee/nlPnBYS)聯繫我們。


# 在Google Spreadsheet中使用Google Apps Script調用Gemini API

## 概述

本教學將介紹如何在Google Spreadsheet中使用Google Apps Script調用Gemini API來實現自動化功能。透過這個教學，您將學會如何使用Apps Script來完成問答生成、文本分類及向量操作。

## 先決條件

取得Google API金鑰（API Key）
請確保您已經從Google AI Studio 取得了Gemini API的API Key。
並在該Appscript管理介面，新增了指令碼屬性 Script Property


確保已經將程式碼添加到您的Google Apps Script專案中。

## 各功能導引目錄

# 在Google Spreadsheet中使用Google Apps Script調用Gemini API

[GitHub Repository](https://github.com/cxcxc-io/ai-agent_with_sheet)

[教學文件 - tutorial.md](https://github.com/cxcxc-io/ai-agent_with_sheet/blob/main/tutorial.md)

## 目錄
- [GeminiQA 使用教學](#geminiqa-使用教學)
- [GeminiQAFromImage 使用教學](#geminiqafromimage-使用教學)
- [GeminiClassify 使用教學](#geminiclassify-使用教學)
- [GeminiVector001 使用教學](#geminivector001-使用教學)
- [GeminiVectorSimilarCalculate 使用教學](#geminivectorsimilarcalculate-使用教學)
- [GeminiQAWithWeb 使用教學](#geminiqawithweb-使用教學)
- [doGet 使用教學](#doget-使用教學)
- [doPost 使用教學](#dopost-使用教學)

## `GeminiQA` 使用教學

### 功能：
`GeminiQA` 函數用於透過Google Apps Script調用Gemini API，針對您提出的問題生成對應的答案。您只需要提供一個問題，Gemini API將返回最合適的答案。

### 使用方式：

1. **在Google Spreadsheet中使用**：
   - 在Spreadsheet的任意儲存格內輸入以下公式來調用`GeminiQA`：
   ```javascript
   =GeminiQA("你的問題")



## `GeminiQA` 使用教學

### 功能：
`GeminiQA` 函數用於透過Google Apps Script調用Gemini API，針對您提出的問題生成對應的答案。您只需要提供一個問題，Gemini API將返回最合適的答案。

### 使用方式：

1. **在Google Spreadsheet中使用**：
   - 在Spreadsheet的任意儲存格內輸入以下公式來調用`GeminiQA`：
   ```javascript
   =GeminiQA("你的問題")
   ```

## `GeminiQAFromImage` 使用教學

### 功能：
`GeminiQAFromImage` 函數用於透過Google Apps Script調用Gemini API，將圖片轉換為Base64格式後進行問答生成。您可以提供一個問題和圖片的網址，並由Gemini API返回解析結果。

### 使用方式：


1. **在Google Spreadsheet中使用**：
   - 在Spreadsheet的任意儲存格內輸入以下公式來調用`GeminiQAFromImage`：
   ```javascript
   =GeminiQAFromImage("你的問題", "圖片網址")
   ```

## `GeminiClassify` 使用教學

### 功能：
`GeminiClassify` 函數用於透過Google Apps Script調用Gemini API，將輸入的文本內容根據指定的分類進行分類操作。您可以提供一個分類數組和要分類的文本內容，Gemini API將返回對應的分類結果。

### 使用方式：

1. **在Google Spreadsheet中使用**：
   - 在Spreadsheet的任意儲存格內輸入以下公式來調用`GeminiClassify`：
   ```javascript
   =GeminiClassify({"分類1", "分類2", "分類3"}, "要分類的內容")
   ```

## `GeminiVector001` 使用教學

### 功能：
`GeminiVector001` 函數用於透過Google Apps Script調用Gemini API，生成文本的向量表示。該向量表示可以用於計算文本相似度或進行其他向量操作。

### 使用方式：

1. **在Google Spreadsheet中使用**：
   - 在Spreadsheet的任意儲存格內輸入以下公式來調用`GeminiVector001`：
   ```javascript
   =GeminiVector001("要生成向量的文本")
    ```
## `GeminiVectorSimilarCalculate` 使用教學

### 功能：
`GeminiVectorSimilarCalculate` 函數用於透過Google Apps Script計算兩個向量之間的相似度。該相似度通常以餘弦相似度的形式表示，範圍在 -1 到 1 之間。該函數可以用於比較兩段文本的相似程度，前提是這兩段文本已經被向量化。

### 使用方式：

1. **在Google Spreadsheet中使用**：
   - 在Spreadsheet的任意儲存格內輸入以下公式來調用`GeminiVectorSimilarCalculate`：
   ```javascript
   =GeminiVectorSimilarCalculate("向量1的字串", "向量2的字串")
    ```

### 使用範例
```
=GeminiVectorSimilarCalculate("0.123, 0.456, 0.789", "0.321, 0.654, 0.987")
```

## `GeminiQAWithWeb` 使用教學

### 功能：
`GeminiQAWithWeb` 由於Gemini尚未支援中文當作function call，請注意此方法一定要用英文來問, 函數用於透過Google Apps Script調用Gemini API，處理更為複雜的問答生成任務。這個函數允許在問答過程中使用特定功能（如抓取網頁內容）來補充和擴展答案，從而提升回答的準確性和全面性。

### 使用方式：

1. **在Google Spreadsheet中使用**：
   - 在Spreadsheet的任意儲存格內輸入以下公式來調用`GeminiQAWithWeb`：
   ```javascript
   =GeminiQAWithWeb("你的問題，請用英文表達，若有網址，則會幫你訪問此網址")
   ```
### 使用範例
```
GeminiQAWithWeb("What content is available on https://example.com?")
```



## `doPost` 使用教學

### 功能：
`doPost` 函數用於處理HTTP POST請求，根據 `function_name` 參數執行不同的操作：
- **`insert_data`**：將請求的JSON數據插入到指定的Google Spreadsheet工作表中，並根據表頭自動匹配相應的欄位進行插入。
- **`mail_user`**：根據提供的收件人列表發送郵件，若未指定信件標題，則會自動使用當天日期作為預設標題。
- **`store_image_to_drive`**：將指定的網路圖片下載並儲存到Google Drive中，若提供了 `folder_name`，則會儲存在指定資料夾內，否則將以當前Spreadsheet的名稱作為資料夾名稱。
- **`create_pdf_from_doc_template`**：使用指定的Google Docs範本自動生成PDF，並根據POST中的替換字典自動替換範本中的關鍵字或標記。可選擇將生成的PDF儲存在指定的Google Drive資料夾中，並設定權限為「有連結的人可讀」，方便共享。若未提供檔案名稱或資料夾，系統將自動命名並儲存於範本文件的父資料夾中。


這些功能適合於需要自動化地將數據寫入Google Spreadsheet或發送郵件的情境。

### 使用方式：

#### 1. 在Google Apps Script中部署Web應用：
   - 在Google Apps Script編輯器中，點擊 `部署` > `部署為網頁應用`。
   - 設定應用的訪問權限為 `任何擁有此應用程式網址的人`。
   - 點擊 `部署`，並獲取應用的URL。

#### 2. 通過HTTP POST請求使用`doPost`：
   - 使用HTTP客戶端（如Postman、cURL）向應用的URL發送POST請求。
   - 根據不同的功能，在POST Body中指定 `function_name` 及其他所需參數。

### POST Body 格式：
請求正文應為JSON格式，包含以下參數：



### 範例：

#### 1. 插入數據至工作表 (`insert_data` 模式)：

```json
{
  "sheet_name": "Sheet1",
  "operate_method": "insert_data",
  "data": {
    "id": "001",
    "columnB_name": "王小明",
    "columnC_name": "這是一筆測試資料"
  },
  "index_column_name": "id"
}
```

使用cURL發送請求：
```
curl -X POST \
  https://script.google.com/macros/s/your-script-id/exec \
  -H 'Content-Type: application/json' \
  -d '{
  "sheet_name": "Sheet1",
  "operate_method": "insert_data",
  "data": {
    "id": "001",
    "columnB_name": "王小明",
    "columnC_name": "這是一筆測試資料"
  },
  "index_column_name": "id"
}'
```

Response
```
{
  "status": "success",
  "message": "新增資料成功"
}
```
#### . 查詢資料 (read_data) (一般查詢 模式)：

Request data format
```
{
  "sheet_name": "Sheet1",
  "operate_method": "read_data",
  "data": {
    "id": "001"
  },
  "index_column_name": "id"
}
```

curl 範例
```
curl -X POST "YOUR_WEBHOOK_URL" \
  -H "Content-Type: application/json" \
  -d '{
        "sheet_name": "Sheet1",
        "operate_method": "read_data",
        "data": {
          "id": "001"
        },
        "index_column_name": "id"
      }'
```

Response format
```
{
  "status": "success",
  "data": [
    {
      "id": "001",
      "name": "王小明",
      "content": "這是一筆測試資料",
      "similarity": 0.98
    }
  ]
}
```
#### . 查詢資料 (read_data) (向量查詢 模式)：

request format
```
{
  "sheet_name": "Sheet1",
  "operate_method": "read_data",
  "data": {
    "columnA_name": "測試向量查詢的內容"
  },
  "index_column_name": "vector_columnA_name",
  "threshold": "0.8"
}
```
curl format
```
curl -X POST "YOUR_WEBHOOK_URL" \
  -H "Content-Type: application/json" \
  -d '{
        "sheet_name": "Sheet1",
        "operate_method": "read_data",
        "data": {
          "columnA_name": "測試向量查詢的內容"
        },
        "index_column_name": "vector_columnA_name",
        "threshold": "0.8"
      }'

```

response format
```
{
  "status": "success",
  "data": [
    {
      "id": "001",
      "name": "王小明",
      "content": "這是一筆測試資料",
      "similarity": 0.85
    }
  ]
}

```
#### .更新資料 (update_data 模式)：

Request format
```
{
  "sheet_name": "Sheet1",
  "operate_method": "update_data",
  "data": {
    "id": "001",
    "name": "王大明",
    "content": "更新後的內容"
  },
  "index_column_name": "id"
}

```
curl format
```
curl -X POST "YOUR_WEBHOOK_URL" \
  -H "Content-Type: application/json" \
  -d '{
        "sheet_name": "Sheet1",
        "operate_method": "update_data",
        "data": {
          "id": "001",
          "name": "王大明",
          "content": "更新後的內容"
        },
        "index_column_name": "id"
      }'
```
Response format
```
{
  "status": "success",
  "message": "更新資料成功"
}
```
#### .刪除資料 (delete_data)：
Request format
```
{
  "sheet_name": "Sheet1",
  "operate_method": "delete_data",
  "data": {
    "id": "001"
  },
  "index_column_name": "id"
}
```
curl format
```
curl -X POST "YOUR_WEBHOOK_URL" \
  -H "Content-Type: application/json" \
  -d '{
        "sheet_name": "Sheet1",
        "operate_method": "delete_data",
        "data": {
          "id": "001"
        },
        "index_column_name": "id"
      }'

```
Response format
```
{
  "status": "success",
  "message": "刪除資料成功"
}
```


#### .基於範本生成PDF (create_pdf_from_doc_template 模式)：

```
{
  "operate_method": "generate_pdf",
  "data": {
    "template_name": "文件範本",
    "generate_pdf_name": "報告",
    "folder_name": "PDF資料夾",
    "replace_map": {
      "title": "報告標題",
      "date": "20250402"
    }
  }
}

```
使用cURL發送請求
```
curl -X POST "YOUR_WEBHOOK_URL" \
  -H "Content-Type: application/json" \
  -d '{
        "operate_method": "generate_pdf",
        "data": {
          "template_name": "文件範本",
          "generate_pdf_name": "報告",
          "folder_name": "PDF資料夾",
          "replace_map": {
            "title": "報告標題",
            "date": "20250402"
          }
        }
      }'

```

Response format

```
{
  "result": "success",
  "fileName": "20250402-報告.pdf",
  "fileLink": "https://drive.google.com/...",
  "message": "PDF 已生成並設為有連結的人可讀"
}

```
