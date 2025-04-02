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
- **圖片儲存至Google Drive：自動下載網路圖片並儲存至Google Drive資料夾。

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

## `doGet` 使用教學

### 功能：
`doGet` 函數用於處理HTTP GET請求，從Google Spreadsheet中提取數據並根據查詢參數進行過濾、排序及分頁。此功能特別適合於需要從表格中動態提取數據的應用場景，例如生成API端點以供外部應用程序訪問數據。

### 使用方式：

1. **在Google Apps Script中部署Web應用**：
   - 在Google Apps Script編輯器中，點擊 `部署` > `部署為網頁應用`。
   - 設定誰可以訪問應用為 `任何擁有此應用程式網址的人`。
   - 點擊 `部署` 並獲取應用的URL。

2. **通過HTTP GET請求使用`doGet`**：
   - 使用Web瀏覽器或HTTP客戶端（如Postman、cURL）訪問該應用的URL，並添加查詢參數進行數據查詢。
   - 範例URL格式：
   ```url
   https://script.google.com/macros/s/your-script-id/exec?sheet_name=Sheet1&query_mode=normal&filter_column=colA=ValueA&exclude_columns=colB
### 共通的查詢參數說明
* **sheet_name** (required): 指定要查詢的工作表名稱。
* **query_mode** (optional): 查詢模式，支持 normal、rag 和 graph_rag 模式。預設為 normal。
* **exclude_columns** (optional): 需要排除的欄位名稱列表，以逗號分隔（如 colA,colB,colC）。
- **page** (optional): 指定返回結果的頁碼，預設為第1頁。
- **page_size** (optional): 指定每頁返回的記錄數量，預設為10。

### `doGet` 模式查詢說明與範例

### normal 模式

#### 說明：
`normal` 模式是最基本的查詢模式，允許您根據指定的查詢參數從Google Spreadsheet中提取並篩選數據。您可以使用篩選條件、排除特定欄位、進行分頁等操作。

#### 查詢參數：

- **資料表內任意欄位**: 依照你資料表現有的欄位資料篩選

#### 範例：
查詢 `Sheet1` 中符合 `colA` 等於 `ValueA` 的數據，排除 `colB`，並顯示第1頁的前10條結果。

```url
https://script.google.com/macros/s/your-script-id/exec?sheet_name=Sheet1&query_mode=normal&exclude_columns=colB&page=1&page_size=10&your_data_column_name>=10
```

### rag 模式

#### 說明：
`rag` 模式（基於向量檢索的增強生成模式）允許您將查詢字串轉換為向量，並與指定欄位中的向量進行相似度比較。此模式特別適合於需要基於語義相似度進行數據篩選的場景。

#### 查詢參數：
- **search_term**: 用於查詢的字串，將被轉換為向量以進行相似度比較。
- **compare_vector_column**: 指定與 `search_term` 生成的向量進行比較的欄位名稱。
- **threshold**: 指定相似度閾值，僅保留相似度大於等於該閾值的結果。

#### 範例：
查詢 `Sheet1` 中，`search_term` 與 `vector_col` 中的向量相似度大於等於 `0.75` 的數據，並顯示第1頁的前10條結果。

```url
https://script.google.com/macros/s/your-script-id/exec?sheet_name=Sheet1&query_mode=rag&search_term=Example%20Query&compare_vector_column=vector_col&threshold=0.75&page=1&page_size=10
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

#### 通用參數：
- **function_name**: 指定所需執行的功能，可以是 `insert_data` 或 `mail_user`。

#### `insert_data` 模式：
- **sheet_name**: 必須參數，指定要插入數據的Google Spreadsheet工作表名稱。
- 其他字段：需對應Google Spreadsheet中的列名。

#### `mail_user` 模式：
- **sender_emails**: 必須參數，收件人的郵件地址列表。
- **email_subject**: 可選參數，信件的標題；若未提供，則會使用當天日期作為標題。
- **email_content**: 必須參數，信件內容，支持HTML格式。

#### `store_image_to_drive` 模式：
- **image_url**: 必須參數，指定要下載的圖片URL。
- **folder_name**: 可選參數，指定圖片儲存的資料夾名稱；若未提供，會以當前Spreadsheet的名稱作為資料夾名稱。

#### `create_pdf_from_doc_template` 模式：
- **template_doc_name**: 可選參數，指定Google Docs範本文件名稱，若未提供，則使用"文件範本"作為預設名稱。
- **pdf_file_name**: 可選參數，生成的PDF檔案名稱，若未指定，則使用當前時間戳與隨機碼生成唯一名稱。
- **folder_name**: 可選參數，指定儲存生成PDF的Google Drive資料夾名稱，若未提供，則使用範本所在資料夾。
- **replace_map**: 必須參數，包含範本替換字典，用於動態替換範本中的文字。


### 範例：

#### 1. 插入數據至工作表 (`insert_data` 模式)：
將 `name` 和 `email` 插入至名為 `Sheet1` 的工作表中。

```json
{
  "function_name": "insert_data",
  "sheet_name": "Sheet1",
  "name": "John Doe",
  "email": "johndoe@example.com"
}
```

使用cURL發送請求：
```
curl -X POST \
  https://script.google.com/macros/s/your-script-id/exec \
  -H 'Content-Type: application/json' \
  -d '{
    "function_name": "insert_data",
    "sheet_name": "Sheet1",
    "name": "John Doe",
    "email": "johndoe@example.com"
  }'
```

#### 2. 發送郵件 (mail_user 模式)：

發送一封內容為 Welcome! 的信件，標題為當天日期，給多個收件人。
```
{
  "function_name": "mail_user",
  "sender_emails": ["user1@example.com", "user2@example.com"],
  "email_content": "<h1>Welcome!</h1><p>Thank you for joining us!</p>"
}
```
使用cURL發送請求
```
curl -X POST \
  https://script.google.com/macros/s/your-script-id/exec \
  -H 'Content-Type: application/json' \
  -d '{
    "function_name": "mail_user",
    "sender_emails": ["user1@example.com", "user2@example.com"],
    "email_content": "<h1>Welcome!</h1><p>Thank you for joining us!</p>"
  }'
```

#### 3.儲存網路圖片到Google Drive (store_image_to_drive 模式)：：

將指定的圖片儲存至指定的Google Drive資料夾，若資料夾名稱未指定，則以Spreadsheet名稱為資料夾名稱。
```
{
  "function_name": "store_image_to_drive",
  "image_url": "https://example.com/image.jpg",
  "folder_name": "MyImagesFolder"
}
```
使用cURL發送請求
```
curl -X POST \
  https://script.google.com/macros/s/your-script-id/exec \
  -H 'Content-Type: application/json' \
  -d '{
    "function_name": "store_image_to_drive",
    "image_url": "https://example.com/image.jpg",
    "folder_name": "MyImagesFolder"
  }'
```

#### 4.基於範本生成PDF (create_pdf_from_doc_template 模式)：

```
{
  "function_name": "create_pdf_from_doc_template",
  "template_doc_name": "課程證書範本",
  "pdf_file_name": "學員證書",
  "folder_name": "證書",
  "replace_map": {
    "{{姓名}}": "張三",
    "{{課程名稱}}": "AI應用課程"
  }
}
```
使用cURL發送請求
```
curl -X POST \
  https://script.google.com/macros/s/your-script-id/exec \
  -H 'Content-Type: application/json' \
  -d '{
  "function_name": "create_pdf_from_doc_template",
  "template_doc_name": "課程證書範本",
  "pdf_file_name": "學員證書",
  "folder_name": "證書",
  "replace_map": {
    "{{姓名}}": "張三",
    "{{課程名稱}}": "AI應用課程"
  }
}'
```
