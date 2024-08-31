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
`doPost` 函數用於處理HTTP POST請求，將請求的JSON數據插入到指定的Google Spreadsheet工作表中。該函數會根據工作表的表頭自動匹配相應的欄位，並將數據插入到對應的列中。此功能適合於需要從外部應用程式自動寫入數據至Spreadsheet的場景。

### 使用方式：

1. **在Google Apps Script中部署Web應用**：
   - 在Google Apps Script編輯器中，點擊 `部署` > `部署為網頁應用`。
   - 設定誰可以訪問應用為 `任何擁有此應用程式網址的人`。
   - 點擊 `部署` 並獲取應用的URL。

2. **通過HTTP POST請求使用`doPost`**：
   - 使用HTTP客戶端（如Postman、cURL）向該應用的URL發送POST請求，請求正文應包含要插入的數據，並指定目標工作表的名稱。

### POST Body 格式：
請求正文應為JSON格式，包含以下內容：
- **sheet_name**: 要插入數據的Google Spreadsheet工作表名稱。
- 其他字段：與Google Spreadsheet中的列名對應的key-value對。

#### 範例：
插入數據至名為 `Sheet1` 的工作表中，將 `name` 和 `email` 插入對應的列。

```json
{
  "sheet_name": "Sheet1",
  "name": "John Doe",
  "email": "johndoe@example.com"
}
```
使用curl 發送訪問
```
curl -X POST \
  https://script.google.com/macros/s/your-script-id/exec \
  -H 'Content-Type: application/json' \
  -d '{
    "sheet_name": "Sheet1",
    "name": "John Doe",
    "email": "johndoe@example.com"
  }'
```
